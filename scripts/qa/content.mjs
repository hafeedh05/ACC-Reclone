import path from "node:path";
import { bannedPhrases } from "./config.mjs";
import {
  createArtifactDir,
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

for (const route of routes) {
  const result = await withPage(
    baseUrl,
    { width: 1440, height: 1080, name: "desktop-1440" },
    async ({ page, consoleErrors, pageErrors }) => {
      await page.goto(resolveUrl(baseUrl, route.path), { waitUntil: "networkidle" });
      const pageState = await page.evaluate(() => {
        const bodyText = document.body.innerText;
        const headings = Array.from(document.querySelectorAll("h1,h2,h3")).map((node) =>
          node.textContent?.trim() ?? "",
        );
        const internalLinks = Array.from(document.querySelectorAll('a[href^="/"]')).map((node) =>
          node.getAttribute("href"),
        );
        return {
          bodyText,
          headings,
          internalLinks,
        };
      });
      return {
        ...pageState,
        consoleErrors,
        pageErrors,
      };
    },
  );

  const normalizedText = result.bodyText.toLowerCase();
  const routeFailures = [];
  const matchedPhrases = bannedPhrases.filter((phrase) => normalizedText.includes(phrase));
  if (matchedPhrases.length > 0) {
    routeFailures.push(`banned phrases: ${matchedPhrases.join(", ")}`);
  }

  const duplicateHeadings = result.headings.filter(
    (heading, index) => heading && result.headings.indexOf(heading) !== index,
  );
  if (duplicateHeadings.length > 0) {
    routeFailures.push(`duplicate headings: ${[...new Set(duplicateHeadings)].join(", ")}`);
  }

  if (route.key === "sample-runs") {
    const uniqueRunLinks = new Set(
      result.internalLinks.filter((href) => href?.startsWith("/sample-runs/")),
    );
    if (uniqueRunLinks.size < 6) {
      routeFailures.push(`sample run archive is too thin: ${uniqueRunLinks.size} detail links`);
    }
  }

  if (route.key === "journal") {
    const uniqueArticleLinks = new Set(
      result.internalLinks.filter((href) => href?.startsWith("/journal/")),
    );
    if (uniqueArticleLinks.size < 8) {
      routeFailures.push(`journal archive is too thin: ${uniqueArticleLinks.size} article links`);
    }
  }

  if (route.key === "case-studies") {
    const uniqueCaseLinks = new Set(
      result.internalLinks.filter((href) => href?.startsWith("/case-studies/")),
    );
    if (uniqueCaseLinks.size < 4) {
      routeFailures.push(`case study archive is too thin: ${uniqueCaseLinks.size} detail links`);
    }
  }

  if (result.consoleErrors.length > 0) {
    routeFailures.push(`console errors: ${result.consoleErrors.join(" | ")}`);
  }

  if (result.pageErrors.length > 0) {
    routeFailures.push(`page errors: ${result.pageErrors.join(" | ")}`);
  }

  await writeText(
    path.join(artifactDir, `${routeSlug(route)}.txt`),
    `${resolveUrl(baseUrl, route.path)}\n\n${result.bodyText}\n`,
  );

  summary.push({
    route: route.path,
    headings: result.headings,
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
