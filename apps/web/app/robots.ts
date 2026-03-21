import type { MetadataRoute } from "next";
import { siteUrl } from "./seo";

export default function robots(): MetadataRoute.Robots {
  const host = new URL(siteUrl).origin;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/app"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host,
  };
}
