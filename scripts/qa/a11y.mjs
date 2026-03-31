import path from "node:path";
import axeCore from "axe-core";
import { createArtifactDir, getBaseUrl, parseRouteFilter, resolveUrl, writeJson } from "./shared.mjs";
import { withPage } from "./shared.mjs";

const routes = parseRouteFilter();
const baseUrl = getBaseUrl();
const artifactDir = await createArtifactDir("a11y");
const summary = [];
const failures = [];

for (const route of routes) {
  const desktop = await withPage(
    baseUrl,
    { width: 1440, height: 1080, name: "desktop-1440" },
    async ({ page }) => {
      await page.goto(resolveUrl(baseUrl, route.path), { waitUntil: "networkidle" });
      await page.addScriptTag({ content: axeCore.source });
      const axeResults = await page.evaluate(async () => window.axe.run(document, {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa"],
        },
      }));

      const focusStates = [];
      for (let index = 0; index < 10; index += 1) {
        await page.keyboard.press("Tab");
        const snapshot = await page.evaluate(() => {
          const active = document.activeElement;
          if (!active) {
            return { tag: "none", text: "", outline: "", boxShadow: "" };
          }

          const styles = getComputedStyle(active);
          return {
            tag: active.tagName.toLowerCase(),
            text: active.textContent?.trim().slice(0, 80) ?? "",
            outline: `${styles.outlineWidth} ${styles.outlineStyle}`,
            boxShadow: styles.boxShadow,
          };
        });
        focusStates.push(snapshot);
      }

      return { axeResults, focusStates };
    },
  );

  const reducedMotion = await withPage(
    baseUrl,
    { width: 1440, height: 1080, name: "desktop-1440" },
    async ({ page }) => {
      await page.goto(resolveUrl(baseUrl, route.path), { waitUntil: "networkidle" });
      return page.evaluate(() => ({
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        hasMain: Boolean(document.querySelector("main")),
      }));
    },
    { reducedMotion: true },
  );

  const routeFailures = [];

  if (desktop.axeResults.violations.length > 0) {
    routeFailures.push(
      `axe violations: ${desktop.axeResults.violations
        .map((violation) => `${violation.id}(${violation.impact ?? "unknown"})`)
        .join(", ")}`,
    );
  }

  const focused = desktop.focusStates.filter((state) => state.tag !== "body" && state.tag !== "none");
  if (focused.length < 3) {
    routeFailures.push("keyboard tab flow is too shallow");
  }

  const visibleFocus = focused.some(
    (state) =>
      state.outline !== "0px none" ||
      (state.boxShadow && state.boxShadow !== "none"),
  );
  if (!visibleFocus) {
    routeFailures.push("visible focus treatment was not detected");
  }

  if (!reducedMotion.reducedMotion || !reducedMotion.hasMain) {
    routeFailures.push("reduced-motion or main landmark check failed");
  }

  summary.push({
    route: route.path,
    violations: desktop.axeResults.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.length,
    })),
    focusStates: desktop.focusStates,
    failures: routeFailures,
  });
  failures.push(...routeFailures.map((failure) => `${route.path} ${failure}`));
}

await writeJson(path.join(artifactDir, "summary.json"), { baseUrl, summary, failures });

if (failures.length > 0) {
  console.error("qa:a11y failed\n" + failures.join("\n"));
  process.exit(1);
}

console.log(`qa:a11y passed for ${routes.length} routes -> ${artifactDir}`);
