import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { chromium } from "playwright";

const root = resolve(import.meta.dirname, "..");
const port = 4174;
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
      if (response.ok) return;
    } catch {
      // not ready yet
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
  }
  throw new Error(`Vite server did not start.\n${serverLog}`);
}

async function overflow(page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
}

const sizes = [
  { name: "desktop-1280x720", width: 1280, height: 720 },
  { name: "phone-390x844", width: 390, height: 844 }
];

try {
  await waitForServer();
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const results = [];

  for (const size of sizes) {
    const page = await browser.newPage({
      viewport: { width: size.width, height: size.height }
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.stack || error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForSelector("text=权变之路");

    const menuOverflow = await overflow(page);
    await page.click("text=创建档案");
    await page.fill("input[name=playerName]", "审计员");
    await page.click("text=开启征程");
    await page.waitForSelector("text=能力基线测评");
    await page.click("text=跳过测评");
    await page.waitForSelector("text=能力基线报告");
    await page.click("text=进入主线");
    await page.waitForSelector("text=九章权力架构");
    const mapOverflow = await overflow(page);

    await page.click("text=空降首周");
    await page.waitForSelector("text=当前考验");
    await page.click(".option-card");
    await page.waitForSelector("text=专家级应对");
    await page.click("text=进入角色分岔");
    await page.waitForSelector("text=当前考验");
    await page.click(".option-card");
    await page.waitForSelector("text=返回地图");
    const storyOverflow = await overflow(page);
    await page.click("text=返回地图");

    await page.click("text=能力图谱");
    await page.waitForSelector("text=综合能力值");
    const abilityOverflow = await overflow(page);
    await page.click("text=复盘报告");
    await page.waitForSelector("text=领导力轨迹");
    const reportOverflow = await overflow(page);
    await page.click("text=返回主页");

    await page.click("text=进入 1v1");
    await page.waitForSelector("text=谁能在复杂局势中做出更好的判断");
    await page.click("button[data-mode=local]");
    await page.click("text=开始对战");
    await page.waitForSelector(".duel-options");
    const duelOverflow = await overflow(page);

    const errorsBeforeEnglish = errors.length;
    await page.goto(url, { waitUntil: "networkidle" });
    if ((await page.locator("text=Adaptive Ascent").count()) === 0) {
      await page.click("[data-action=toggle-language]");
    }
    await page.waitForSelector("text=Adaptive Ascent");
    const htmlLang = await page.evaluate(() => document.documentElement.lang);
    if (htmlLang !== "en") {
      throw new Error(`English mode did not set html lang, got ${htmlLang}`);
    }
    await page.click("button.primary[data-action=open-map]");
    await page.waitForSelector("text=Diagnose");
    const englishMapOverflow = await overflow(page);
    await page.click("text=First Week");
    await page.waitForSelector("text=Current Test");
    const englishStoryOverflow = await overflow(page);
    const englishErrors = errors.length - errorsBeforeEnglish;

    results.push({
      size: size.name,
      overflow: {
        menu: menuOverflow,
        map: mapOverflow,
        story: storyOverflow,
        ability: abilityOverflow,
        report: reportOverflow,
        duel: duelOverflow
      },
      errors: errors.length
    });
    results.push({
      size: `${size.name}-en`,
      overflow: {
        menu: 0,
        map: englishMapOverflow,
        story: englishStoryOverflow,
        ability: 0,
        report: 0,
        duel: 0
      },
      errors: englishErrors
    });
    if (errors.length > 0 || englishErrors > 0) {
      throw new Error(`${size.name} page errors: ${errors.join(" | ")}`);
    }
    if (
      menuOverflow > 0 ||
      mapOverflow > 0 ||
      storyOverflow > 0 ||
      abilityOverflow > 0 ||
      reportOverflow > 0 ||
      duelOverflow > 0 ||
      englishMapOverflow > 0 ||
      englishStoryOverflow > 0
    ) {
      throw new Error(
        `${size.name} horizontal overflow detected: ${JSON.stringify({
          menu: menuOverflow,
          map: mapOverflow,
          story: storyOverflow,
          ability: abilityOverflow,
          report: reportOverflow,
          duel: duelOverflow,
          englishMap: englishMapOverflow,
          englishStory: englishStoryOverflow
        })}`
      );
    }
    await page.close();
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
  console.log("PASS audit");
} finally {
  server.kill();
}
