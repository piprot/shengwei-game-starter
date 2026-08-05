import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { chromium } from "playwright";

const root = resolve(import.meta.dirname, "..");
const port = 4173;
const url = `http://127.0.0.1:${port}`;
const profileDir = mkdtempSync(join(tmpdir(), "adaptive-ascent-smoke-"));

const server = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "--host",
    "127.0.0.1",
    "--port",
    String(port),
    "--strictPort"
  ],
  {
    cwd: root,
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"]
  }
);

let serverLog = "";
server.stdout.on("data", (chunk) => {
  serverLog += String(chunk);
});
server.stderr.on("data", (chunk) => {
  serverLog += String(chunk);
});

async function waitForServer() {
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // server not ready yet
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
  }
  throw new Error(`Vite server did not start.\n${serverLog}`);
}

try {
  await waitForServer();
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true
  });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    storageState: { cookies: [], origins: [] }
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.stack || error.message));
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });

  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector("text=权变之路");

  await page.click("text=创建档案");
  await page.fill("input[name=playerName]", "林远");
  await page.click("button[data-role=highPotential]");
  await page.click("text=开启征程");
  await page.waitForSelector("text=九章权力架构");

  await page.click("text=空降首周");
  await page.waitForSelector("text=当前考验");
  await page.click(".option-card");
  await page.waitForSelector("text=专家级应对");
  await page.click("text=返回地图");
  await page.waitForSelector("text=九章权力架构");

  await page.click("text=进入 1v1");
  await page.waitForSelector("text=谁能在复杂局势中做出更好的判断");
  await page.click("text=开始对战");
  await page.waitForSelector(".duel-options");

  for (let i = 0; i < 5; i += 1) {
    const enabled = page.locator(".duel-options .option-card:not([disabled])");
    const count = await enabled.count();
    if (count === 0) break;
    await enabled.first().click();
    await page.waitForTimeout(1000);
    if ((await page.locator(".duel-result").count()) > 0) break;
  }
  await page.waitForSelector(".duel-result", { timeout: 15000 });
  await page.waitForSelector("text=对决结束");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  if (overflow > 0) {
    throw new Error(`Horizontal overflow detected: ${overflow}px`);
  }
  if (errors.length > 0) {
    throw new Error("Page errors detected: " + errors.join(" | "));
  }

  await browser.close();
  console.log("PASS smoke test");
} finally {
  server.kill();
  rmSync(profileDir, { recursive: true, force: true });
}
