import path from "node:path";
import {
  createArtifactDir,
  getBaseUrl,
  parseRouteFilter,
  getHtmlDocument,
  resolveUrl,
  writeJson,
} from "./shared.mjs";

function normalizeUrl(url) {
  return url.replace(/\/$/, "");
}

const routes = parseRouteFilter();
const baseUrl = getBaseUrl();
const expectedCanonicalBase =
  process.env.QA_EXPECT_CANONICAL_BASE?.replace(/\/$/, "") ?? baseUrl;
const publicRoutes = routes.filter((route) => route.public);
const privateRoutes = routes.filter((route) => !route.public);
const artifactDir = await createArtifactDir("seo");
const summary = [];
const failures = [];

for (const route of publicRoutes) {
  const { $, html } = await getHtmlDocument(baseUrl, route.path);
  const routeFailures = [];
  const title = $("title").text().trim();
  const description = $('meta[name="description"]').attr("content")?.trim() ?? "";
  const canonical = $('link[rel="canonical"]').attr("href")?.trim() ?? "";
  const ogTitle = $('meta[property="og:title"]').attr("content")?.trim() ?? "";
  const ogDescription = $('meta[property="og:description"]').attr("content")?.trim() ?? "";
  const ogUrl = $('meta[property="og:url"]').attr("content")?.trim() ?? "";
  const twitterCard = $('meta[name="twitter:card"]').attr("content")?.trim() ?? "";
  const jsonLd = $('script[type="application/ld+json"]')
    .map((_, node) => $(node).html())
    .get()
    .filter(Boolean);

  if (!title) routeFailures.push("missing title");
  if (!description) routeFailures.push("missing meta description");
  if (normalizeUrl(canonical) !== normalizeUrl(resolveUrl(expectedCanonicalBase, route.path))) {
    routeFailures.push(`canonical mismatch: ${canonical}`);
  }
  if (
    !ogTitle ||
    !ogDescription ||
    normalizeUrl(ogUrl) !== normalizeUrl(resolveUrl(expectedCanonicalBase, route.path))
  ) {
    routeFailures.push("Open Graph metadata incomplete");
  }
  if (!twitterCard) {
    routeFailures.push("missing Twitter card metadata");
  }
  if (route.path === "/") {
    const joined = jsonLd.join("\n").replace(/\s+/g, "");
    if (!joined.includes('"@type":"Organization"') || !joined.includes('"@type":"SoftwareApplication"')) {
      routeFailures.push("homepage JSON-LD missing Organization or SoftwareApplication");
    }
  }

  if (html.includes("noindex")) {
    routeFailures.push("public route unexpectedly contains noindex");
  }

  summary.push({
    route: route.path,
    title,
    description,
    canonical,
    ogTitle,
    ogUrl,
    failures: routeFailures,
  });
  failures.push(...routeFailures.map((failure) => `${route.path} ${failure}`));
}

for (const route of privateRoutes) {
  const { $ } = await getHtmlDocument(baseUrl, route.path);
  const robots = $('meta[name="robots"]').attr("content")?.toLowerCase() ?? "";
  if (!robots.includes("noindex") || !robots.includes("nofollow")) {
    failures.push(`${route.path} missing noindex,nofollow`);
  }
}

const robotsResponse = await fetch(resolveUrl(baseUrl, "/robots.txt"));
const sitemapResponse = await fetch(resolveUrl(baseUrl, "/sitemap.xml"));
const robotsText = await robotsResponse.text();
const sitemapText = await sitemapResponse.text();

if (!robotsResponse.ok || !robotsText.includes("Disallow: /app")) {
  failures.push("/robots.txt missing /app disallow rule");
}

if (!sitemapResponse.ok || !sitemapText.includes("<loc>")) {
  failures.push("/sitemap.xml missing URL entries");
}

await writeJson(path.join(artifactDir, "summary.json"), {
  baseUrl,
  summary,
  robotsOk: robotsResponse.ok,
  sitemapOk: sitemapResponse.ok,
  failures,
});

if (failures.length > 0) {
  console.error("qa:seo failed\n" + failures.join("\n"));
  process.exit(1);
}

console.log(`qa:seo passed for ${routes.length} routes -> ${artifactDir}`);
