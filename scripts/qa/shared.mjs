import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { chromium } from "playwright";
import { load } from "cheerio";
import { qaRoutes } from "./config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const repoRoot = path.resolve(__dirname, "..", "..");

export function getBaseUrl() {
  const cliBase = process.argv.find((arg) => arg.startsWith("--base-url="));
  if (cliBase) {
    return cliBase.replace("--base-url=", "").replace(/\/$/, "");
  }

  return (
    process.env.QA_BASE_URL?.replace(/\/$/, "") ??
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://ad-command-center-dev-web-k66jrtxjhq-uc.a.run.app"
  );
}

export function getRunId() {
  return (
    process.env.QA_RUN_ID ??
    new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-")
  );
}

export function routeSlug(route) {
  return route.key;
}

export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
  return dirPath;
}

export async function createArtifactDir(kind) {
  const dir = path.join(repoRoot, "output", "qa", getRunId(), kind);
  await ensureDir(dir);
  return dir;
}

export async function writeJson(filePath, value) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function writeText(filePath, value) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, value, "utf8");
}

export function resolveUrl(baseUrl, routePath) {
  return `${baseUrl}${routePath}`;
}

export async function fetchHtml(baseUrl, routePath) {
  const response = await fetch(resolveUrl(baseUrl, routePath), {
    headers: { "user-agent": "AdCommandCenter-QA/1.0" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${routePath}: ${response.status}`);
  }

  return response.text();
}

export async function getHtmlDocument(baseUrl, routePath) {
  const html = await fetchHtml(baseUrl, routePath);
  return { html, $: load(html) };
}

export async function launchBrowser() {
  try {
    return await chromium.launch({ channel: "chrome", headless: true });
  } catch {
    return chromium.launch({ headless: true });
  }
}

export async function withPage(baseUrl, viewport, fn, options = {}) {
  const browser = await launchBrowser();
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: options.reducedMotion ? "reduce" : "no-preference",
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const requestFailures = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("requestfailed", (request) =>
    requestFailures.push({
      url: request.url(),
      failure: request.failure()?.errorText ?? "unknown",
    }),
  );

  try {
    return await fn({ page, context, consoleErrors, pageErrors, requestFailures, baseUrl });
  } finally {
    await browser.close();
  }
}

export async function getPageMetrics(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const main = document.querySelector("main");
    return {
      title: document.title,
      bodyTextLength: body?.innerText.length ?? 0,
      scrollWidth: doc?.scrollWidth ?? 0,
      clientWidth: doc?.clientWidth ?? 0,
      scrollHeight: doc?.scrollHeight ?? 0,
      mainExists: Boolean(main),
      headings: Array.from(document.querySelectorAll("h1,h2,h3")).map((node) =>
        node.textContent?.trim() ?? "",
      ),
      linkCount: document.querySelectorAll("a[href]").length,
    };
  });
}

export function summarizeFailures(items) {
  return items.length === 0 ? "pass" : items.join("\n");
}

export function getRouteByKey(key) {
  const route = qaRoutes.find((entry) => entry.key === key);
  if (!route) {
    throw new Error(`Unknown QA route key: ${key}`);
  }

  return route;
}

export function parseRouteFilter() {
  const arg = process.argv.find((entry) => entry.startsWith("--routes="));
  if (!arg) {
    return qaRoutes;
  }

  const keys = new Set(arg.replace("--routes=", "").split(",").map((entry) => entry.trim()));
  return qaRoutes.filter((route) => keys.has(route.key));
}

export function isPublicRoute(route) {
  return route.public;
}
