import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocketServer } from "ws";
import { createToken, verifyToken } from "./auth.mjs";
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
const MAX_MESSAGE_BYTES = Number(process.env.MAX_MESSAGE_BYTES || 64 * 1024);
const MAX_SAVE_BYTES = Number(process.env.MAX_SAVE_BYTES || 256 * 1024);
const ROOM_TTL_MS = Number(process.env.ROOM_TTL_MS || 10 * 60 * 1000);
const VALID_ROLES = new Set(["parachute", "founder", "highPotential"]);
const VALID_ROUNDS = new Set([3, 5, 7]);

if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
  throw new Error("Production requires DATABASE_URL");
}

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
  response.writeHead(200, { "content-type": "application/json; charset=utf-8" });
  response.end(
    JSON.stringify({
      status: "ok",
      db: dbEnabled,
      uptime: process.uptime()
    })
  );
});
const wss = new WebSocketServer({
  server: httpServer,
  maxPayload: MAX_MESSAGE_BYTES
});
const rooms = new Map();
const matchQueue = [];

await initDb();

function cleanName(value) {
  const name = String(value || "").trim().slice(0, 24);
  return name || "Player";
}

function cleanRole(value) {
  const role = String(value || "highPotential");
  return VALID_ROLES.has(role) ? role : "highPotential";
}

function cleanRounds(value) {
  const rounds = Number(value);
  return VALID_ROUNDS.has(rounds) ? rounds : 3;
}

function cleanSave(save) {
  if (!save || typeof save !== "object" || Array.isArray(save)) return null;
  try {
    return JSON.stringify(save).length > MAX_SAVE_BYTES ? null : save;
  } catch {
    return null;
  }
}

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
    send(room.players[0].socket, {
      type: "match_started",
      roomId,
      playerIndex: 0,
      opponentName: room.players[1].name
    });
    send(room.players[1].socket, {
      type: "match_started",
      roomId,
      playerIndex: 1,
      opponentName: room.players[0].name
    });
  }
  return room;
}

function createRoom(player, rounds) {
  const roomId = randomUUID().slice(0, 6);
  const room = {
    id: roomId,
    rounds: Number(rounds) || 3,
    status: "waiting",
    createdAt: Date.now(),
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

const roomCleanup = setInterval(() => {
  const now = Date.now();
  for (const [roomId, room] of rooms) {
    if (room.status === "waiting" && now - room.createdAt > ROOM_TTL_MS) {
      send(room.players[0]?.socket, { type: "room_expired", roomId });
      leaveRoom(room.players[0]?.socket);
    }
  }
}, 60_000);
roomCleanup.unref?.();

function accountForToken(token) {
  return store.accounts[token];
}

function jsonLeaderboard() {
  const rows = Object.values(store.accounts)
    .map((account) => ({
      name: account.name,
      role: account.role,
      score: Object.values(account.save?.profile?.abilities || {}).reduce(
        (sum, value) => sum + abilityLevel(Number(value || 0)),
        0
      ),
      updatedAt: account.updatedAt
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);
  return rows.map((row, index) => ({
    ...row,
    percentile: Math.round(((rows.length - index - 1) / rows.length) * 100)
  }));
}

function abilityLevel(exp) {
  const thresholds = [0, 4, 10, 18, 28, 40];
  let level = 1;
  for (const threshold of thresholds.slice(1)) {
    if (exp >= threshold) level += 1;
    else break;
  }
  return Math.min(6, level);
}

wss.on("connection", (socket) => {
  socket.rateCount = 0;
  socket.rateWindow = Date.now();
  send(socket, { type: "connected", message: "自适应领导力服务已连接" });

  socket.on("message", async (raw) => {
    const now = Date.now();
    if (now - socket.rateWindow > 10000) {
      socket.rateCount = 0;
      socket.rateWindow = now;
    }
    socket.rateCount += 1;
    if (socket.rateCount > 120) {
      send(socket, { type: "error", message: "消息过于频繁，请稍后再试" });
      return;
    }
    let message;
    try {
      const text = String(raw);
      if (Buffer.byteLength(text, "utf8") > MAX_MESSAGE_BYTES) {
        send(socket, { type: "error", message: "消息过大，请分步操作" });
        return;
      }
      message = JSON.parse(text);
    } catch {
      send(socket, { type: "error", message: "无法解析消息" });
      return;
    }

    switch (message.type) {
      case "register": {
        const name = cleanName(message.name);
        const role = cleanRole(message.role);
        const save = cleanSave(message.save);
        const token = createToken(
          name,
          role
        );
        const account = {
          token,
          name,
          role,
          save
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
        if (!verifyToken(token)) {
          send(socket, { type: "error", message: "Token 无效或已过期" });
          return;
        }
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
        if (!verifyToken(token)) {
          send(socket, { type: "error", message: "Token 无效或已过期" });
          return;
        }
        const account = dbEnabled ? await getAccount(token) : accountForToken(token);
        if (!account) {
          send(socket, { type: "error", message: "账号不存在" });
          return;
        }
        const save = cleanSave(message.save);
        if (!save) {
          send(socket, { type: "error", message: "存档格式无效或过大" });
          return;
        }
        if (dbEnabled) {
          await upsertAccount(token, account.name, account.role, save);
        } else {
          account.save = save;
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
        const name = cleanName(message.name);
        const role = cleanRole(message.role);
        const save = cleanSave(message.save);
        createRoom(
          {
            socket,
            name,
            role,
            save
          },
          cleanRounds(message.rounds)
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
          name: cleanName(message.name),
          role: cleanRole(message.role),
          save: cleanSave(message.save)
        });
        break;
      }
      case "match": {
        tryAutoMatch({
          socket,
          name: cleanName(message.name),
          role: cleanRole(message.role),
          save: cleanSave(message.save),
          rounds: cleanRounds(message.rounds)
        });
        break;
      }
      case "pick": {
        const optionIndex = Number(message.optionIndex);
        if (![0, 1, 2].includes(optionIndex)) {
          send(socket, { type: "error", message: "选项索引无效" });
          return;
        }
        const player = findPlayer(socket);
        if (!player?.roomId) return;
        const room = roomById(player.roomId);
        if (!room) return;
        const opponent = room.players.find((item) => item.socket !== socket);
        if (opponent) {
          send(opponent.socket, { type: "pick", optionIndex });
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

function shutdown(signal) {
  console.log(`Adaptive Ascent server shutting down (${signal})`);
  clearInterval(roomCleanup);
  wss.close();
  httpServer.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
