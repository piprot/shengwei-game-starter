import { spawnSync } from "node:child_process";

const STATUS_URL = "https://www.githubstatus.com/api/v2/components.json";
const REPO = process.env.REPO || "piprot/shengwei-game-starter";
const MAX_WAIT_SECONDS = Number(process.env.MAX_WAIT_SECONDS || 1800);
const POLL_SECONDS = Number(process.env.POLL_SECONDS || 30);

function gh(args) {
  const result = spawnSync("gh", args, { encoding: "utf8" });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || "").trim();
    throw new Error(`gh ${args.join(" ")} failed: ${detail}`);
  }
  return result.stdout.trim();
}

async function waitForOperational() {
  const deadline = Date.now() + MAX_WAIT_SECONDS * 1000;
  while (Date.now() < deadline) {
    const response = await fetch(STATUS_URL);
    const data = await response.json();
    const required = ["Actions", "Pages"];
    const operational = required.every((name) =>
      data.components.some(
        (component) =>
          component.name === name && component.status === "operational"
      )
    );
    if (operational) {
      console.log("GitHub Actions and Pages are operational.");
      return;
    }
    const next = Math.min(deadline - Date.now(), POLL_SECONDS * 1000);
    console.log(
      `GitHub incident still active; retrying in ${Math.max(
        1,
        Math.round(next / 1000)
      )}s.`
    );
    await new Promise((resolve) => setTimeout(resolve, next));
  }
  throw new Error(
    `GitHub Actions/Pages did not recover within ${MAX_WAIT_SECONDS}s.`
  );
}

try {
  await waitForOperational();
  const head = gh(["rev-parse", "HEAD"]).trim();
  const runs = JSON.parse(
    gh([
      "run",
      "list",
      "--repo",
      REPO,
      "--workflow=CI",
      "--limit",
      "30",
      "--json",
      "databaseId,headSha,status,conclusion"
    ])
  );
  const target =
    runs.find((run) => run.headSha === head) ||
    runs.find((run) => run.status === "queued" || run.status === "in_progress") ||
    runs[0];
  if (!target) {
    throw new Error("No CI run found to recover.");
  }
  if (target.conclusion === "failure") {
    gh([
      "run",
      "rerun",
      String(target.databaseId),
      "--repo",
      REPO,
      "--failed"
    ]);
  }
  console.log(`Watching CI run ${target.databaseId}.`);
  gh([
    "run",
    "watch",
    String(target.databaseId),
    "--repo",
    REPO,
    "--exit-status",
    "--interval",
    "15"
  ]);
} catch (error) {
  console.error(`FAIL github-recovery: ${error.message}`);
  process.exit(1);
}
