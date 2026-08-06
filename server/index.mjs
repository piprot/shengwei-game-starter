import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocketServer } from "ws";
import {
  dbEnabled,
  getAccount,
  initDb,
  leaderboard as dbLeaderboard,
  upsertAccount
} from "./db.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || join(__dirname, "data");
const DATA_FILE = join(DATA_DIR, "store.json");
const PORT = Number(process.env.PORT || 8080);

mkdirSync(DATA_DIR, { recursive: true });

let store = { accounts: {} };
try {
  store = JSON.parse(readFileSync(DATA_FILE, "utf8"));
} catch {
  store = { accounts: {} };
}

function persist() {
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

const httpServer = createServer((_request, response) => {
  response.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
  response.end("ok");
});
const wss = new WebSocketServer({ server: httpServer });
const rooms = new Map();
const matchQueue = [];

await initDb();

function send(socket, payload) {
  if (socket.readyState === 1) {
    socket.send(JSON.stringify(payload));
  }
}

function roomById(roomId) {
  return rooms.get(roomId);
}

function addToRoom(roomId, player) {
  const room = roomById(roomId);
  if (!room) return null;
  room.players.push(player);
  player.roomId = roomId;
  if (room.players.length === 2) {
    room.status = "playing";
    send(room.players[0].socket, { type: "match_started", roomId, playerIndex: 0 });
    send(room.players[1].socket, { type: "match_started", roomId, playerIndex: 1 });
  }
  return room;
}

function createRoom(player, rounds) {
  const roomId = randomUUID().slice(0, 6);
  const room = {
    id: roomId,
    rounds: Number(rounds) || 3,
    status: "waiting",
    players: []
  };
  rooms.set(roomId, room);
  addToRoom(roomId, player);
  send(player.socket, { type: "room_created", roomId });
  return room;
}

function tryAutoMatch(player) {
  const opponent = matchQueue.shift();
  if (!opponent) {
    matchQueue.push(player);
    send(player.socket, { type: "queued" });
    return;
  }
  const room = createRoom(opponent, player.rounds || 3);
  addToRoom(room.id, player);
}

function accountForToken(token) {
  return store.accounts[token];
}

function jsonLeaderboard() {
  return Object.values(store.accounts)
    .map((account) => ({
      name: account.name,
      role: account.role,
      score: Object.values(account.save?.profile?.abilities || {}).reduce(
        (sum, value) => sum + Number(value || 0),
        0
      ),
      updatedAt: account.updatedAt
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);
}

wss.on("connection", (socket) => {
  send(socket, { type: "connected", message: "自适应领导力服务已连接" });

  socket.on("message", async (raw) => {
    let message;
    try {
      message = JSON.parse(String(raw));
    } catch {
      send(socket, { type: "error", message: "无法解析消息" });
      return;
    }

    switch (message.type) {
      case "register": {
        const token = randomUUID();
        const account = {
          token,
          name: String(message.name || "玩家"),
          role: String(message.role || "highPotential"),
          save: message.save || null
        };
        if (dbEnabled) {
          await upsertAccount(
            account.token,
            account.name,
            account.role,
            account.save
          );
        } else {
          store.accounts[token] = {
            ...account,
            updatedAt: new Date().toISOString()
          };
          persist();
        }
        send(socket, { type: "registered", token, account });
        break;
      }
      case "login": {
        const token = String(message.token || "");
        const account = dbEnabled
          ? await getAccount(token)
          : accountForToken(token);
        if (!account) {
          send(socket, { type: "error", message: "账号不存在" });
          return;
        }
        socket.accountToken = account.token;
        send(socket, { type: "logged_in", account });
        break;
      }
      case "cloud_save": {
        const token = String(message.token || "");
        const account = dbEnabled ? await getAccount(token) : accountForToken(token);
        if (!account) {
          send(socket, { type: "error", message: "账号不存在" });
          return;
        }
        if (dbEnabled) {
          await upsertAccount(token, account.name, account.role, message.save);
        } else {
          account.save = message.save;
          account.updatedAt = new Date().toISOString();
          persist();
        }
        send(socket, { type: "save_ok" });
        break;
      }
      case "leaderboard": {
        send(socket, {
          type: "leaderboard",
          entries: dbEnabled ? await dbLeaderboard() : jsonLeaderboard()
        });
        break;
      }
      case "create_room": {
        createRoom(
          {
            socket,
            name: String(message.name || "玩家"),
            role: String(message.role || "highPotential"),
            save: message.save || null
          },
          message.rounds
        );
        break;
      }
      case "join_room": {
        const room = roomById(String(message.roomId || ""));
        if (!room || room.status !== "waiting") {
          send(socket, { type: "error", message: "房间不存在或已满" });
          return;
        }
        addToRoom(room.id, {
          socket,
          name: String(message.name || "玩家"),
          role: String(message.role || "highPotential"),
          save: message.save || null
        });
        break;
      }
      case "match": {
        tryAutoMatch({
          socket,
          name: String(message.name || "玩家"),
          role: String(message.role || "highPotential"),
          save: message.save || null,
          rounds: message.rounds
        });
        break;
      }
      case "pick": {
        const player = findPlayer(socket);
        if (!player?.roomId) return;
        const room = roomById(player.roomId);
        if (!room) return;
        const opponent = room.players.find((item) => item.socket !== socket);
        if (opponent) {
          send(opponent.socket, { type: "pick", optionIndex: message.optionIndex });
        }
        break;
      }
      case "signal": {
        const player = findPlayer(socket);
        if (!player?.roomId) return;
        const room = roomById(player.roomId);
        if (!room) return;
        const opponent = room.players.find((item) => item.socket !== socket);
        if (opponent) {
          send(opponent.socket, { type: "signal", signal: message.signal });
        }
        break;
      }
      case "leave": {
        leaveRoom(socket);
        break;
      }
      default:
        send(socket, { type: "error", message: "未知消息类型" });
    }
  });

  socket.on("close", () => {
    leaveRoom(socket);
    const index = matchQueue.findIndex((player) => player.socket === socket);
    if (index >= 0) matchQueue.splice(index, 1);
  });
});

function findPlayer(socket) {
  for (const room of rooms.values()) {
    const player = room.players.find((item) => item.socket === socket);
    if (player) return player;
  }
  return null;
}

function leaveRoom(socket) {
  const player = findPlayer(socket);
  if (!player?.roomId) return;
  const room = roomById(player.roomId);
  if (!room) return;
  room.players = room.players.filter((item) => item.socket !== socket);
  if (room.players.length === 0) {
    rooms.delete(room.id);
  } else {
    send(room.players[0].socket, { type: "opponent_left" });
    room.status = "waiting";
  }
}

httpServer.listen(PORT, () => {
  console.log(`Adaptive Ascent server listening on ws://127.0.0.1:${PORT}`);
});
