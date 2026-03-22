import path from "node:path";
import process from "node:process";
import { bannedPhrases } from "./config.mjs";
import {
  createArtifactDir,
  ensureDir,
  getBaseUrl,
  parseRouteFilter,
  resolveUrl,
  routeSlug,
  withPage,
  writeJson,
  writeText,
} from "./shared.mjs";

const routes = parseRouteFilter();
const baseUrl = getBaseUrl();
const artifactDir = await createArtifactDir("content");
const summary = [];
const failures = [];

const writeBaseline = process.argv.includes("--write-baseline");
const defaultBaselineDir = path.join(process.cwd(), "reports", "clutter");
const baselineDir = parseOption("--baseline-dir=") ?? (writeBaseline ? null : defaultBaselineDir);

for (const route of routes) {
  const desktop = await auditRoute(route, { width: 1440, height: 1080, name: "desktop-1440" });
  const mobile = await auditRoute(route, { width: 390, height: 844, name: "mobile-390" });

  const normalizedText = desktop.bodyText.toLowerCase();
  const routeFailures = [];
  const matchedPhrases = bannedPhrases.filter((phrase) => normalizedText.includes(phrase));

  if (matchedPhrases.length > 0) {
    routeFailures.push(`banned phrases: ${matchedPhrases.join(", ")}`);
  }

  const duplicateHeadings = desktop.headings.filter(
    (heading, index) => heading && desktop.headings.indexOf(heading) !== index,
  );
  if (duplicateHeadings.length > 0) {
    routeFailures.push(`duplicate headings: ${[...new Set(duplicateHeadings)].join(", ")}`);
  }

  if (route.key === "sample-runs") {
    const uniqueRunLinks = new Set(
      desktop.internalLinks.filter((href) => href?.startsWith("/sample-runs/")),
    );
    if (uniqueRunLinks.size < 6) {
      routeFailures.push(`sample run archive is too thin: ${uniqueRunLinks.size} detail links`);
    }
  }

  if (route.key === "journal") {
    const uniqueArticleLinks = new Set(
      desktop.internalLinks.filter((href) => href?.startsWith("/journal/")),
    );
    if (uniqueArticleLinks.size < 8) {
      routeFailures.push(`journal archive is too thin: ${uniqueArticleLinks.size} article links`);
    }
  }

  if (route.key === "case-studies") {
    const uniqueCaseLinks = new Set(
      desktop.internalLinks.filter((href) => href?.startsWith("/case-studies/")),
    );
    if (uniqueCaseLinks.size < 4) {
      routeFailures.push(`case study archive is too thin: ${uniqueCaseLinks.size} detail links`);
    }
  }

  if (desktop.consoleErrors.length > 0) {
    routeFailures.push(`console errors: ${desktop.consoleErrors.join(" | ")}`);
  }

  if (desktop.pageErrors.length > 0) {
    routeFailures.push(`page errors: ${desktop.pageErrors.join(" | ")}`);
  }

  const clutterReport = {
    route: route.path,
    label: route.label,
    capturedAt: new Date().toISOString(),
    visibleWordCountAboveFold: desktop.metrics.visibleWordCountAboveFold,
    interactiveCountAboveFold: desktop.metrics.interactiveCountAboveFold,
    navItemCount: desktop.metrics.navItemCount,
    ctaCountAboveFold: desktop.metrics.ctaCountAboveFold,
    chipBadgeCountAboveFold: desktop.metrics.chipBadgeCountAboveFold,
    borderedSurfaceCountAboveFold: desktop.metrics.borderedSurfaceCountAboveFold,
    sectionCount: desktop.metrics.sectionCount,
    repeatedLabelCount: desktop.metrics.repeatedLabelCount,
    visiblePlaceholderOrScaffoldingTerms: matchedPhrases,
    motionElementCountPerViewport: {
      [desktop.viewport]: desktop.metrics.motionElementCount,
      [mobile.viewport]: mobile.metrics.motionElementCount,
    },
    interactionInventory: desktop.metrics.interactionInventory,
    consoleErrors: desktop.consoleErrors,
  };

  const baselinePath = baselineDir ? path.join(baselineDir, `${routeSlug(route)}.json`) : null;
  if (baselinePath) {
    const baseline = await readBaseline(baselinePath);
    if (baseline && route.key === "home") {
      if (
        desktop.metrics.visibleWordCountAboveFold >
        Math.floor(baseline.visibleWordCountAboveFold * 0.75)
      ) {
        routeFailures.push(
          `homepage above-fold word count did not drop by 25% (${desktop.metrics.visibleWordCountAboveFold} vs baseline ${baseline.visibleWordCountAboveFold})`,
        );
      }

      if (
        desktop.metrics.interactiveCountAboveFold >
        Math.floor(baseline.interactiveCountAboveFold * 0.8)
      ) {
        routeFailures.push(
          `homepage above-fold interactive count did not drop by 20% (${desktop.metrics.interactiveCountAboveFold} vs baseline ${baseline.interactiveCountAboveFold})`,
        );
      }

      if (
        desktop.metrics.borderedSurfaceCountAboveFold >
        Math.floor(baseline.borderedSurfaceCountAboveFold * 0.7)
      ) {
        routeFailures.push(
          `homepage bordered surface count did not drop by 30% (${desktop.metrics.borderedSurfaceCountAboveFold} vs baseline ${baseline.borderedSurfaceCountAboveFold})`,
        );
      }

      if (baseline.repeatedLabelCount > 0) {
        if (desktop.metrics.repeatedLabelCount >= baseline.repeatedLabelCount) {
          routeFailures.push(
            `homepage repeated label count did not improve (${desktop.metrics.repeatedLabelCount} vs baseline ${baseline.repeatedLabelCount})`,
          );
        }
      } else if (desktop.metrics.repeatedLabelCount > 0) {
        routeFailures.push(
          `homepage repeated label count regressed (${desktop.metrics.repeatedLabelCount} vs baseline ${baseline.repeatedLabelCount})`,
        );
      }
    }
  }

  if (writeBaseline) {
    const outDir = baselineDir ?? defaultBaselineDir;
    await ensureDir(outDir);
    await writeJson(path.join(outDir, `${routeSlug(route)}.json`), clutterReport);
  }

  await writeText(
    path.join(artifactDir, `${routeSlug(route)}.txt`),
    `${resolveUrl(baseUrl, route.path)}\n\n${desktop.bodyText}\n`,
  );

  summary.push({
    route: route.path,
    headings: desktop.headings,
    clutterReport,
    failures: routeFailures,
  });
  failures.push(...routeFailures.map((failure) => `${route.path} ${failure}`));
}

await writeJson(path.join(artifactDir, "summary.json"), { baseUrl, summary, failures });

if (failures.length > 0) {
  console.error("qa:content failed\n" + failures.join("\n"));
  process.exit(1);
}

console.log(`qa:content passed for ${routes.length} routes -> ${artifactDir}`);

function parseOption(prefix) {
  const arg = process.argv.find((entry) => entry.startsWith(prefix));
  return arg ? arg.replace(prefix, "") : null;
}

async function readBaseline(filePath) {
  try {
    const raw = await import("node:fs/promises").then((fs) => fs.readFile(filePath, "utf8"));
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function auditRoute(route, viewport) {
  return withPage(baseUrl, viewport, async ({ page, consoleErrors, pageErrors }) => {
    await page.goto(resolveUrl(baseUrl, route.path), { waitUntil: "networkidle" });
    const pageState = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      const headings = Array.from(document.querySelectorAll("h1,h2,h3")).map((node) =>
        node.textContent?.trim() ?? "",
      );
      const internalLinks = Array.from(document.querySelectorAll('a[href^="/"]')).map((node) =>
        node.getAttribute("href"),
      );

      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      function textFromNode(node) {
        return (node?.textContent ?? "").replace(/\s+/g, " ").trim();
      }

      function isElementVisible(element) {
        if (!(element instanceof HTMLElement)) return false;
        const style = window.getComputedStyle(element);
        if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) {
          return false;
        }

        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }

      function isAboveFold(element) {
        if (!(element instanceof HTMLElement) || !isElementVisible(element)) return false;
        const rect = element.getBoundingClientRect();
        return rect.top < viewportHeight && rect.bottom > 0 && rect.left < viewportWidth && rect.right > 0;
      }

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const value = textFromNode(node);
          if (!value) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          return parent && isAboveFold(parent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        },
      });

      const textChunks = [];
      while (walker.nextNode()) {
        textChunks.push(textFromNode(walker.currentNode));
      }

      const visibleWordCountAboveFold = textChunks.join(" ").split(/\s+/).filter(Boolean).length;

      const interactiveSelector = 'a[href], button, input, select, textarea, [role="button"], summary';
      const allInteractive = Array.from(document.querySelectorAll(interactiveSelector)).filter((node) =>
        isAboveFold(node),
      );

      const navItemCount = Array.from(document.querySelectorAll("header nav a[href], header nav button")).filter(
        (node) => isAboveFold(node),
      ).length;

      const ctaCountAboveFold = allInteractive.filter((node) =>
        node.classList.contains("button-link") || node.matches("button,[role='button']"),
      ).length;

      const chipBadgeSelector = ".chip, .status-badge, .page-meta-line span, .eyebrow";
      const chipBadgeElements = Array.from(document.querySelectorAll(chipBadgeSelector)).filter((node) =>
        isAboveFold(node),
      );

      const labelValues = chipBadgeElements
        .map((node) => textFromNode(node))
        .filter(Boolean)
        .map((value) => value.toLowerCase());

      const repeatedLabelCount = [...new Set(labelValues)].reduce((count, label) => {
        const matches = labelValues.filter((value) => value === label).length;
        return count + (matches > 1 ? matches - 1 : 0);
      }, 0);

      const surfaceRegex = /(surface|panel|card|tile|console|board|rail|chip|badge|note|metric|brief|family|asset|stage|row)/i;
      const borderedSurfaceCountAboveFold = Array.from(document.querySelectorAll("body *")).filter((node) => {
        if (!(node instanceof HTMLElement) || !isAboveFold(node)) return false;
        const className = typeof node.className === "string" ? node.className : "";
        const rect = node.getBoundingClientRect();
        return rect.width > 72 && rect.height > 24 && surfaceRegex.test(className);
      }).length;

      const sectionCount = document.querySelectorAll("main section").length;

      const motionElementCount = Array.from(document.querySelectorAll("body *")).filter((node) => {
        if (!(node instanceof HTMLElement) || !isAboveFold(node)) return false;
        const runningAnimations = node
          .getAnimations({ subtree: false })
          .some((animation) => animation.playState === "running" || animation.playState === "pending");
        const isPlayingVideo =
          node instanceof HTMLVideoElement && !node.paused && !node.ended && node.readyState > 2;
        return runningAnimations || isPlayingVideo;
      }).length;

      const interactionInventory = allInteractive
        .slice(0, 20)
        .map((node) => textFromNode(node))
        .filter(Boolean);

      return {
        bodyText,
        headings,
        internalLinks,
        metrics: {
          viewport: `${viewportWidth}x${viewportHeight}`,
          visibleWordCountAboveFold,
          interactiveCountAboveFold: allInteractive.length,
          navItemCount,
          ctaCountAboveFold,
          chipBadgeCountAboveFold: chipBadgeElements.length,
          borderedSurfaceCountAboveFold,
          sectionCount,
          repeatedLabelCount,
          motionElementCount,
          interactionInventory,
        },
      };
    });

    return {
      ...pageState,
      viewport: viewport.name,
      consoleErrors,
      pageErrors,
    };
  });
}
