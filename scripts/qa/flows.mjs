import path from "node:path";
import {
  createArtifactDir,
  getBaseUrl,
  parseRouteFilter,
  resolveUrl,
  routeSlug,
  withPage,
  writeJson,
} from "./shared.mjs";

const routes = parseRouteFilter();
const baseUrl = getBaseUrl();
const artifactDir = await createArtifactDir("flows");
const summary = [];
const failures = [];

const flowStrategies = {
  home: [
    { name: "See How It Works", href: "/how-it-works" },
    { name: "Watch a Sample Run", href: "/sample-runs" },
    { name: "Command Center teaser", href: "/app/command-center" },
  ],
  "command-center": [
    { name: "Outputs library", prefix: "/app/outputs" },
    { name: "Project detail", prefix: "/app/projects/" },
  ],
  "sample-runs": [{ name: "Sample run detail", prefix: "/sample-runs/" }],
  journal: [{ name: "Journal article", prefix: "/journal/" }],
  "case-studies": [{ name: "Case study detail", prefix: "/case-studies/" }],
};

function isIgnorableRequestFailure(entry) {
  return (
    (entry.failure.includes("ERR_ABORTED") && entry.url.includes("_rsc=")) ||
    entry.url.includes("/favicon.ico") ||
    entry.url.includes("/api/web-vitals")
  );
}

for (const route of routes) {
  const expectedLinks = flowStrategies[route.key] ?? [];

  const result = await withPage(
    baseUrl,
    { width: 1440, height: 1080, name: "desktop-1440" },
    async ({ page, consoleErrors, pageErrors, requestFailures }) => {
      await page.goto(resolveUrl(baseUrl, route.path), { waitUntil: "networkidle" });

      const checks = [];
      for (const link of expectedLinks) {
        const selector = "href" in link ? `a[href="${link.href}"]` : `a[href^="${link.prefix}"]`;
        const locator = page.locator(selector).first();
        const visible = await locator.isVisible().catch(() => false);
        if (!visible) {
          checks.push({
            name: link.name,
            href: "href" in link ? link.href : link.prefix,
            status: "missing",
          });
          continue;
        }

        const targetHref = await locator.getAttribute("href");
        if (!targetHref) {
          checks.push({
            name: link.name,
            href: "href" in link ? link.href : link.prefix,
            status: "missing-href",
          });
          continue;
        }

        await page.goto(resolveUrl(baseUrl, targetHref), { waitUntil: "networkidle" });
        await page.waitForLoadState("networkidle");
        checks.push({
          name: link.name,
          href: targetHref,
          status: page.url().endsWith(targetHref) ? "ok" : `landed:${page.url()}`,
        });
        await page.goto(resolveUrl(baseUrl, route.path), { waitUntil: "networkidle" });
      }

      return { consoleErrors, pageErrors, requestFailures, checks };
    },
  );

  const routeFailures = [];

  for (const check of result.checks) {
    if (check.status !== "ok") {
      routeFailures.push(`interaction failed for "${check.name}" -> ${check.status}`);
    }
  }

  if (result.consoleErrors.length > 0) {
    routeFailures.push(`console errors: ${result.consoleErrors.join(" | ")}`);
  }

  if (result.pageErrors.length > 0) {
    routeFailures.push(`page errors: ${result.pageErrors.join(" | ")}`);
  }

  const relevantRequestFailures = result.requestFailures.filter(
    (entry) => !isIgnorableRequestFailure(entry),
  );

  if (relevantRequestFailures.length > 0) {
    routeFailures.push(
      `request failures: ${relevantRequestFailures
        .map((entry) => `${entry.failure} ${entry.url}`)
        .join(" | ")}`,
    );
  }

  summary.push({
    route: route.path,
    checks: result.checks,
    failures: routeFailures,
  });
  failures.push(...routeFailures.map((failure) => `${route.path} ${failure}`));
}

await writeJson(path.join(artifactDir, "summary.json"), { baseUrl, summary, failures });

if (failures.length > 0) {
  console.error("qa:flows failed\n" + failures.join("\n"));
  process.exit(1);
}

console.log(`qa:flows passed for ${routes.length} routes -> ${artifactDir}`);
