import { chromium } from "playwright";

const sizes = [
  { name: "desktop-1280x720", width: 1280, height: 720 },
  { name: "phone-720x1280", width: 720, height: 1280 },
  { name: "phone-1080x2400", width: 1080, height: 2400 }
];

const browser = await chromium.launch({ channel: "msedge", headless: true });

for (const size of sizes) {
  const page = await browser.newPage({
    viewport: { width: size.width, height: size.height }
  });
  await page.goto("http://127.0.0.1:5173", {
    waitUntil: "networkidle"
  });
  await page.mouse.click(size.width / 2, size.height / 2);
  await page.waitForTimeout(300);

  const result = await page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    const rect = canvas?.getBoundingClientRect();
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
      canvasWidth: rect ? Math.round(rect.width) : 0,
      canvasHeight: rect ? Math.round(rect.height) : 0,
      canvasLeft: rect ? Math.round(rect.left) : 0,
      canvasTop: rect ? Math.round(rect.top) : 0
    };
  });

  console.log(JSON.stringify({ name: size.name, ...result }));
  await page.close();
}

await browser.close();
