import type { Metadata } from "next";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://ad-command-center-dev-web-k66jrtxjhq-uc.a.run.app";

export function absoluteUrl(path: string) {
  return `${siteUrl}${path}`;
}

export function createPublicPageMetadata({
  title,
  description,
  canonicalPath,
}: {
  title: string;
  description: string;
  canonicalPath: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(canonicalPath),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonicalPath),
      siteName: "Ad Command Center",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function createPrivatePageMetadata({
  title,
  description,
  canonicalPath,
}: {
  title: string;
  description: string;
  canonicalPath: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(canonicalPath),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonicalPath),
      siteName: "Ad Command Center",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export function buildJsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data);
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ad Command Center",
    url: siteUrl,
    description: "A premium production system for turning briefs into campaign-ready ad variants.",
  };
}

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Ad Command Center",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: siteUrl,
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}
