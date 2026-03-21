import path from "node:path";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { performanceThresholds } from "./config.mjs";
import { createArtifactDir, getBaseUrl, parseRouteFilter, resolveUrl, writeJson } from "./shared.mjs";

const routes = parseRouteFilter();
const baseUrl = getBaseUrl();
const artifactDir = await createArtifactDir("perf");
const summary = [];
const failures = [];
const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  for (const route of routes) {
    const url = resolveUrl(baseUrl, route.path);
    const result = await lighthouse(
      url,
      {
        port: chrome.port,
        logLevel: "error",
        output: "json",
        emulatedFormFactor: "desktop",
        onlyCategories: ["performance"],
      },
      undefined,
    );

    const performanceScore = result.lhr.categories.performance.score ?? 0;
    const routeFailures = [];
    const threshold = performanceThresholds[route.key] ?? 0.68;

    if (performanceScore < threshold) {
      routeFailures.push(
        `performance score ${performanceScore.toFixed(2)} below threshold ${threshold.toFixed(2)}`,
      );
    }

    summary.push({
      route: route.path,
      performanceScore,
      metrics: result.lhr.audits,
      failures: routeFailures,
    });
    failures.push(...routeFailures.map((failure) => `${route.path} ${failure}`));
  }
} finally {
  await chrome.kill();
}

await writeJson(path.join(artifactDir, "summary.json"), { baseUrl, summary, failures });

if (failures.length > 0) {
  console.error("qa:perf failed\n" + failures.join("\n"));
  process.exit(1);
}

console.log(`qa:perf passed for ${routes.length} routes -> ${artifactDir}`);
