import path from "node:path";
import { chromium } from "playwright";
import { createArtifactDir, getBaseUrl, parseRouteFilter, resolveUrl, routeSlug, writeJson, writeText } from "./shared.mjs";

const routes = parseRouteFilter();
const baseUrl = getBaseUrl();
const artifactDir = await createArtifactDir("motion");
const failures = [];
const summary = [];

for (const route of routes) {
  const desktop = await auditMotion(route, false);
  const reduced = await auditMotion(route, true);

  const routeFailures = [];
  if (route.key === "home" && desktop.maxVisibleAnimated > 3) {
    routeFailures.push(`homepage shows too many animated elements at once: ${desktop.maxVisibleAnimated}`);
  }

  if (route.key === "home" && reduced.maxVisibleAnimated > 1) {
    routeFailures.push(`homepage still animates too much under reduced motion: ${reduced.maxVisibleAnimated}`);
  }

  if (desktop.consoleErrors.length > 0) {
    routeFailures.push(`console errors: ${desktop.consoleErrors.join(" | ")}`);
  }

  if (desktop.pageErrors.length > 0) {
    routeFailures.push(`page errors: ${desktop.pageErrors.join(" | ")}`);
  }

  summary.push({
    route: route.path,
    desktop,
    reduced,
    failures: routeFailures,
  });
  failures.push(...routeFailures.map((failure) => `${route.path} ${failure}`));
}

await writeJson(path.join(artifactDir, "summary.json"), { baseUrl, summary, failures });
await writeText(
  path.join(process.cwd(), "reports", "motion", "homepage.md"),
  buildHomepageMotionReport(summary.find((entry) => entry.route === "/")),
);

if (failures.length > 0) {
  console.error("qa:motion failed\n" + failures.join("\n"));
  process.exit(1);
}

console.log(`qa:motion passed for ${routes.length} routes -> ${artifactDir}`);

async function auditMotion(route, reducedMotion) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1080 },
    reducedMotion: reducedMotion ? "reduce" : "no-preference",
    recordVideo: route.key === "home" && !reducedMotion ? { dir: artifactDir, size: { width: 1440, height: 1080 } } : undefined,
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const checkpoints = [];
  const tracePath = path.join(
    artifactDir,
    `${routeSlug(route)}-${reducedMotion ? "reduced" : "full"}-trace.zip`,
  );

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await context.tracing.start({ screenshots: true, snapshots: true });

  try {
    await page.goto(resolveUrl(baseUrl, route.path), { waitUntil: "networkidle" });

    const stops = [0, 0.25, 0.5, 0.75, 1];
    for (const progress of stops) {
      await page.evaluate((value) => {
        const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
        window.scrollTo({ top: maxScroll * value, behavior: "instant" });
      }, progress);
      await page.waitForTimeout(240);
      checkpoints.push(
        await page.evaluate((value) => {
          function inViewport(element) {
            if (!(element instanceof HTMLElement)) return false;
            const style = window.getComputedStyle(element);
            if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) {
              return false;
            }
            const rect = element.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0;
          }

          const animated = Array.from(document.querySelectorAll("body *")).filter((node) => {
            if (!(node instanceof HTMLElement) || !inViewport(node)) return false;
            const runningAnimations = node
              .getAnimations({ subtree: false })
              .some((animation) => animation.playState === "running" || animation.playState === "pending");
            const playingVideo =
              node instanceof HTMLVideoElement && !node.paused && !node.ended && node.readyState > 2;
            return runningAnimations || playingVideo;
          });

          return {
            progress: value,
            visibleAnimatedCount: animated.length,
            sampleElements: animated
              .slice(0, 8)
              .map((node) => (node.className && typeof node.className === "string" ? node.className : node.tagName)),
          };
        }, progress),
      );
    }

    if (consoleErrors.length || pageErrors.length || (route.key === "home" && checkpoints.some((entry) => entry.visibleAnimatedCount > 3))) {
      await context.tracing.stop({ path: tracePath });
    } else {
      await context.tracing.stop();
    }

    const videoPath = page.video ? await page.video()?.path().catch(() => null) : null;

    return {
      reducedMotion,
      checkpoints,
      maxVisibleAnimated: Math.max(...checkpoints.map((entry) => entry.visibleAnimatedCount), 0),
      videoPath,
      tracePath: consoleErrors.length || pageErrors.length ? tracePath : null,
      consoleErrors,
      pageErrors,
    };
  } finally {
    await page.close();
    await browser.close();
  }
}

function buildHomepageMotionReport(entry) {
  if (!entry) {
    return "# Homepage motion report\n\nNo homepage motion data was captured.\n";
  }

  return `# Homepage motion report

- element: hero media plane
  trigger: initial presence and light hover/scroll drift
  start/end range: 0% to 25% viewport progress
  purpose: keep the hero feeling alive without adding more labels or chrome
  fallback when reduced motion is enabled: static media, no drift

- element: workflow progression
  trigger: section scroll progression
  start/end range: 25% to 60% viewport progress
  purpose: show the run moving from brief to output without animating the body copy
  fallback when reduced motion is enabled: static section transitions

- element: command center route map
  trigger: section entry and hover emphasis
  start/end range: 55% to 85% viewport progress
  purpose: make route mapping legible without turning the whole surface into a dashboard animation
  fallback when reduced motion is enabled: static route indicators

Max visible animated elements observed: ${entry.desktop.maxVisibleAnimated}
Reduced-motion max visible animated elements observed: ${entry.reduced.maxVisibleAnimated}
`;
}
