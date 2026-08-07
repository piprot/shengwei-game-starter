import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { chromium } from "playwright";

const root = resolve(import.meta.dirname, "..");
const port = 4177;
const url = `http://127.0.0.1:${port}`;
const profileDir = mkdtempSync(join(tmpdir(), "adaptive-feature-audit-"));
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
  { cwd: root, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] }
);

async function waitForServer() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // wait
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
  }
  throw new Error("Vite server did not start");
}

try {
  await waitForServer();
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.stack || error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto(url, { waitUntil: "networkidle" });
  await page.click("[data-action=open-profile]");
  await page.fill("input[name=playerName]", "功能审计");
  await page.click("button[data-role=highPotential]");
  await page.click("text=开启征程");
  await page.click("[data-action=assessment-skip]");
  await page.waitForSelector("text=能力基线报告");

  await page.evaluate(() => {
    const raw = localStorage.getItem("adaptive-ascent-save-v1");
    const save = raw ? JSON.parse(raw) : null;
    if (save) {
      save.chapterRecords = [
        {
          chapterId: 1,
          completedNodeIds: ["c1n1", "c1n2"],
          stars: 220
        }
      ];
      save.unlockedChapters = [1, 2];
      localStorage.setItem("adaptive-ascent-save-v1", JSON.stringify(save));
    }
  });
  await page.reload({ waitUntil: "networkidle" });

  await page.click("[data-action=open-map]");
  await page.waitForSelector(".map-shell");
  await page.click("[data-action=select-chapter][data-chapter='1']");
  await page.click("[data-action=replay-chapter]");
  await page.waitForSelector(".story-shell");
  await page.locator(".option-card").first().click();
  await page.waitForSelector(".outcome-panel");
  if ((await page.locator("[data-action=continue-branch]").count()) > 0) {
    await page.click("[data-action=continue-branch]");
  }
  await page.waitForSelector(".hidden-branch-shell, .story-shell", {
    timeout: 5000
  }).catch(() => {});
  if ((await page.locator("[data-action=open-map]").count()) === 0) {
    throw new Error("replay flow has no map exit");
  }
  await page.click("[data-action=open-map]");
  await page.waitForSelector(".map-shell");
  const playCountAfterReplay = await page.evaluate(() => {
    const raw = localStorage.getItem("adaptive-ascent-save-v1");
    return raw ? JSON.parse(raw).playCount : -1;
  });
  if (playCountAfterReplay !== 0) {
    throw new Error("replay should not write progress");
  }

  await page.click("[data-action=open-menu]");
  await page.click("[data-action=open-settings]");
  await page.waitForSelector(".settings-shell");

  await page.click("[data-action=open-menu]");
  await page.click("[data-action=open-trial]");
  await page.waitForSelector(".trial-shell");
  const stageCount = await page.locator(".trial-stage-card").count();
  if (stageCount !== 19) throw new Error(`expected 19 trial stages, got ${stageCount}`);
  await page.locator(".trial-stage-card.open button").first().click();
  await page.waitForSelector(".trial-phase-panel");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  if (overflow > 0) throw new Error(`Horizontal overflow: ${overflow}px`);
  if (errors.length > 0) throw new Error(`Page errors: ${errors.join(" | ")}`);

  await browser.close();
  console.log("PASS feature audit");
} finally {
  server.kill();
  rmSync(profileDir, { recursive: true, force: true });
}
