import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { NPCS } from "../src/core/npcs.ts";
import { NPC_STORIES } from "../src/core/npcStories.ts";
import { NPC_ARCS } from "../src/core/npcArcs.ts";

// 1) Content consistency: every NPC must have a story and a deeper arc.
const npcs = NPCS;
const npcIds = NPCS.map((npc) => npc.id);
if (new Set(npcIds).size !== npcIds.length) {
  throw new Error("NPC ids must be unique");
}
for (const id of npcIds) {
  const story = NPC_STORIES[id];
  const arc = NPC_ARCS[id];
  if (!story) throw new Error(`NPC ${id} missing story`);
  if (story.zh.length < 2 || story.en.length < 2) {
    throw new Error(`NPC ${id} story must have at least 2 paragraphs`);
  }
  if (story.dialogue.length < 1) {
    throw new Error(`NPC ${id} story must have dialogue`);
  }
  if (!arc) throw new Error(`NPC ${id} missing deeper arc`);
  if (arc.zh.length < 1 || arc.en.length < 1) {
    throw new Error(`NPC ${id} arc must have paragraphs`);
  }
}

// 2) Runtime navigation: every core module opens and returns to menu.
const root = resolve(import.meta.dirname, "..");
const port = 4186;
const url = `http://127.0.0.1:${port}`;
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
  throw new Error("server did not start");
}

const VIEWS = [
  { action: "open-map", selector: ".map-shell" },
  { action: "open-trial", selector: ".trial-shell" },
  { action: "open-duel", selector: ".duel-lobby" },
  { action: "open-ability", selector: ".ability-shell" },
  { action: "open-relations", selector: ".relation-shell" },
  { action: "open-report", selector: ".report-shell" },
  { action: "open-achievements", selector: ".achievement-shell" },
  { action: "open-profile", selector: ".narrow-shell" },
  { action: "open-settings", selector: ".settings-shell" },
  { action: "open-coach", selector: ".coach-shell" },
  { action: "open-leadership-games", selector: ".lg-grid" }
];

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
  await page.waitForSelector("body[data-app-ready='1']", { timeout: 15000 });

  for (const view of VIEWS) {
    console.log("NAV", view.action);
    await page.locator(`[data-action="${view.action}"]`).first().click();
    await page.waitForSelector(view.selector, { timeout: 15000 });
    const openMenu = page.locator('[data-action="open-menu"]').first();
    if (view.action === "open-leadership-games") {
      await page.locator('[data-action="lg-home"]').first().click();
      await page.waitForSelector(".map-shell", { timeout: 15000 });
      await openMenu.click();
    } else {
      await openMenu.click();
    }
    await page.waitForSelector(".menu-shell", { timeout: 15000 });
  }
  if (errors.length > 0) {
    throw new Error(`page errors: ${errors.join(" | ")}`);
  }
  await browser.close();
  console.log(
    `PASS system audit (${npcs.length} NPCs with stories + arcs, ${VIEWS.length} views navigable)`
  );
} finally {
  server.kill();
}
