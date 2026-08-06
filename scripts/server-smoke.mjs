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

try {
  await waitForServer();
  await runClient();
  console.log("PASS server smoke test");
} finally {
  server.kill();
  rmSync(dataDir, { recursive: true, force: true });
}
