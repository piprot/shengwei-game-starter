import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({
  viewport: { width: 720, height: 1280 }
});

const errors = [];
page.on("pageerror", (error) => errors.push(error.stack || error.message));
page.on("console", (message) => {
  if (message.type() === "error") {
    errors.push(message.text());
  }
});

await page.goto("http://127.0.0.1:5173", {
  waitUntil: "networkidle"
});
await page.waitForTimeout(500);

const hasCanvas = await page.evaluate(() => Boolean(document.querySelector("canvas")));
if (!hasCanvas) {
  throw new Error("Canvas was not created.");
}

await page.mouse.click(360, 640);
await page.waitForTimeout(800);

if (errors.length > 0) {
  throw new Error("Page errors detected: " + errors.join(" | "));
}

await browser.close();
console.log("PASS smoke test");
