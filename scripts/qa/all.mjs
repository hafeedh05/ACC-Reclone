import { spawnSync } from "node:child_process";
import process from "node:process";

const runId =
  process.env.QA_RUN_ID ??
  new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");

const steps = ["qa:visual", "qa:content", "qa:flows", "qa:motion", "qa:a11y", "qa:perf", "qa:seo"];

for (const step of steps) {
  const result = spawnSync("pnpm", [step], {
    cwd: process.cwd(),
    stdio: "inherit",
    env: {
      ...process.env,
      QA_RUN_ID: runId,
    },
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`qa:all passed (run ${runId})`);
