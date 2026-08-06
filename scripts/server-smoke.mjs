import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const port = 8090;
const dataDir = mkdtempSync(join(tmpdir(), "adaptive-ascent-server-"));

const server = spawn(process.execPath, ["server/index.mjs"], {
  cwd: root,
  windowsHide: true,
  env: {
    ...process.env,
    PORT: String(port),
    DATA_DIR: dataDir
  },
  stdio: ["ignore", "pipe", "pipe"]
});

let log = "";
server.stdout.on("data", (chunk) => (log += String(chunk)));
server.stderr.on("data", (chunk) => (log += String(chunk)));

async function waitForServer() {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}`);
      if (response.ok) return;
    } catch {
      // not ready
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 200));
  }
  throw new Error(`Server did not start.\n${log}`);
}

async function runClient() {
  const ws = new WebSocket(`ws://127.0.0.1:${port}`);
  await new Promise((resolvePromise, reject) => {
    ws.onopen = resolvePromise;
    ws.onerror = () => reject(new Error("WebSocket connect failed"));
  });

  const wait = (type) =>
    new Promise((resolvePromise, reject) => {
      const timer = setTimeout(() => reject(new Error(`timeout waiting ${type}`)), 5000);
      ws.onmessage = (event) => {
        const message = JSON.parse(String(event.data));
        if (message.type === type) {
          clearTimeout(timer);
          resolvePromise(message);
        }
      };
    });

  ws.send(
    JSON.stringify({
      type: "register",
      name: "服务端测试",
      role: "founder",
      save: { profile: { abilities: { execution: 5 } } }
    })
  );
  const registered = await wait("registered");
  ws.send(
    JSON.stringify({
      type: "cloud_save",
      token: registered.token,
      save: { profile: { abilities: { execution: 9 } } }
    })
  );
  await wait("save_ok");
  ws.send(JSON.stringify({ type: "leaderboard" }));
  const board = await wait("leaderboard");
  if (!Array.isArray(board.entries) || board.entries.length === 0) {
    throw new Error("Leaderboard empty");
  }
  ws.close();
}

async function runMatchTest() {
  const clients = [
    new WebSocket(`ws://127.0.0.1:${port}`),
    new WebSocket(`ws://127.0.0.1:${port}`)
  ];
  await Promise.all(
    clients.map(
      (ws) =>
        new Promise((resolvePromise, reject) => {
          ws.onopen = resolvePromise;
          ws.onerror = () => reject(new Error("WebSocket connect failed"));
        })
    )
  );

  const waitFor = (ws, type) =>
    new Promise((resolvePromise, reject) => {
      const timer = setTimeout(() => reject(new Error(`timeout waiting ${type}`)), 5000);
      ws.onmessage = (event) => {
        const message = JSON.parse(String(event.data));
        if (message.type === type) {
          clearTimeout(timer);
          resolvePromise(message);
        }
      };
    });

  clients[0].send(JSON.stringify({ type: "match", name: "甲", role: "founder", save: null, rounds: 3 }));
  clients[1].send(JSON.stringify({ type: "match", name: "乙", role: "highPotential", save: null, rounds: 3 }));

  const [start0, start1] = await Promise.all([
    waitFor(clients[0], "match_started"),
    waitFor(clients[1], "match_started")
  ]);
  if (start0.opponentName !== "乙" || start1.opponentName !== "甲") {
    throw new Error("Opponent names were not relayed correctly");
  }

  clients[0].send(JSON.stringify({ type: "pick", optionIndex: 2 }));
  const received = await waitFor(clients[1], "pick");
  if (received.optionIndex !== 2) {
    throw new Error("Pick was not relayed correctly");
  }

  clients.forEach((ws) => ws.close());
}

try {
  await waitForServer();
  await runClient();
  await runMatchTest();
  console.log("PASS server smoke test");
} finally {
  server.kill();
  rmSync(dataDir, { recursive: true, force: true });
}
