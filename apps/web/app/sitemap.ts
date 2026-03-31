import type { MetadataRoute } from "next";
import { siteUrl } from "./seo";
import { caseStudies, journalArticles, sampleRuns } from "@/components/site-data";

const publicRoutes = [
  "/",
  "/how-it-works",
  "/gallery",
  "/pricing",
  "/enterprise",
  "/contact",
  "/privacy",
  "/terms",
  "/journal",
  "/case-studies",
  "/sample-runs",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = publicRoutes.map((path) => {
    const changeFrequency = path === "/" ? "weekly" : "monthly";

    return {
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: changeFrequency as "weekly" | "monthly",
      priority: path === "/" ? 1 : 0.7,
    };
  });

  const articleRoutes = journalArticles.map((article) => ({
    url: `${siteUrl}/journal/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const caseStudyRoutes = caseStudies.map((study) => ({
    url: `${siteUrl}/case-studies/${study.slug}`,
    lastModified: new Date(study.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const sampleRunRoutes = sampleRuns.map((run) => ({
    url: `${siteUrl}/sample-runs/${run.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...articleRoutes, ...caseStudyRoutes, ...sampleRunRoutes];
}
