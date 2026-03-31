import fs from "node:fs/promises";
import path from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { viewports } from "./config.mjs";
import {
  createArtifactDir,
  getBaseUrl,
  getPageMetrics,
  parseRouteFilter,
  resolveUrl,
  routeSlug,
  withPage,
  writeJson,
} from "./shared.mjs";

const routes = parseRouteFilter();
const baseUrl = getBaseUrl();
const compareDir = process.env.QA_VISUAL_COMPARE_DIR;
const artifactDir = await createArtifactDir("visual");
const summary = [];
const failures = [];

function isIgnorableRequestFailure(entry) {
  return (
    (entry.failure.includes("ERR_ABORTED") && entry.url.includes("_rsc=")) ||
    (entry.failure.includes("ERR_ABORTED") && /\.mp4($|\?)/.test(entry.url))
  );
}

for (const route of routes) {
  for (const viewport of viewports) {
    const screenshotPath = path.join(
      artifactDir,
      `${routeSlug(route)}-${viewport.name}.png`,
    );
    const foldScreenshotPath = path.join(
      artifactDir,
      `${routeSlug(route)}-${viewport.name}-fold.png`,
    );

    const result = await withPage(
      baseUrl,
      viewport,
      async ({ page, consoleErrors, pageErrors, requestFailures }) => {
        await page.goto(resolveUrl(baseUrl, route.path), { waitUntil: "networkidle" });
        const metrics = await getPageMetrics(page);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        await page.screenshot({ path: foldScreenshotPath });
        return { metrics, consoleErrors, pageErrors, requestFailures };
      },
    );

    const routeFailures = [];

    if (!result.metrics.mainExists) {
      routeFailures.push("missing <main> landmark");
    }

    if (result.metrics.scrollWidth > result.metrics.clientWidth + 2) {
      routeFailures.push(
        `horizontal overflow at ${viewport.name}: ${result.metrics.scrollWidth} > ${result.metrics.clientWidth}`,
      );
    }

    if (result.metrics.bodyTextLength < 180) {
      routeFailures.push(`page content is suspiciously thin at ${viewport.name}`);
    }

    if (result.consoleErrors.length > 0) {
      routeFailures.push(`console errors at ${viewport.name}: ${result.consoleErrors.join(" | ")}`);
    }

    if (result.pageErrors.length > 0) {
      routeFailures.push(`page errors at ${viewport.name}: ${result.pageErrors.join(" | ")}`);
    }

    const relevantRequestFailures = result.requestFailures.filter(
      (entry) => !isIgnorableRequestFailure(entry),
    );

    if (relevantRequestFailures.length > 0) {
      routeFailures.push(
        `request failures at ${viewport.name}: ${relevantRequestFailures
          .map((entry) => `${entry.failure} ${entry.url}`)
          .join(" | ")}`,
      );
    }

    let diffPixels = null;
    let diffRatio = null;

    if (compareDir) {
      const baselinePath = path.join(compareDir, `${routeSlug(route)}-${viewport.name}.png`);
      try {
        const [baselineBuffer, currentBuffer] = await Promise.all([
          fs.readFile(baselinePath),
          fs.readFile(screenshotPath),
        ]);
        const baseline = PNG.sync.read(baselineBuffer);
        const current = PNG.sync.read(currentBuffer);
        if (baseline.width !== current.width || baseline.height !== current.height) {
          routeFailures.push(
            `baseline size mismatch at ${viewport.name}: ${baseline.width}x${baseline.height} vs ${current.width}x${current.height}`,
          );
        } else {
          const diff = new PNG({ width: baseline.width, height: baseline.height });
          diffPixels = pixelmatch(
            baseline.data,
            current.data,
            diff.data,
            baseline.width,
            baseline.height,
            { threshold: 0.18 },
          );
          diffRatio = diffPixels / (baseline.width * baseline.height);
          if (diffRatio > 0.45) {
            routeFailures.push(
              `visual delta too high at ${viewport.name}: ${(diffRatio * 100).toFixed(2)}%`,
            );
          }
        }
      } catch {
        routeFailures.push(`missing visual baseline for ${viewport.name}`);
      }
    }

    summary.push({
      route: route.path,
      viewport: viewport.name,
      screenshotPath,
      foldScreenshotPath,
      metrics: result.metrics,
      diffPixels,
      diffRatio,
      failures: routeFailures,
    });

    failures.push(...routeFailures.map((failure) => `${route.path} [${viewport.name}] ${failure}`));
  }
}

await writeJson(path.join(artifactDir, "summary.json"), { baseUrl, summary, failures });

if (failures.length > 0) {
  console.error("qa:visual failed\n" + failures.join("\n"));
  process.exit(1);
}

console.log(`qa:visual passed for ${routes.length} routes -> ${artifactDir}`);
