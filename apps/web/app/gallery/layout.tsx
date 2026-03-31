import type { Metadata } from "next";
import { createPublicPageMetadata } from "../seo";

export const metadata: Metadata = createPublicPageMetadata({
  title: "Gallery",
  description:
    "Browse the Ad Command Center gallery by industry, aspect ratio, and campaign type with spotlighted proof surfaces designed to convert.",
  canonicalPath: "/gallery",
});

export default function GalleryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
