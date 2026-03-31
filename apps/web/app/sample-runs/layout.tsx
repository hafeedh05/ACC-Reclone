import type { Metadata } from "next";
import { createPublicPageMetadata } from "../seo";

export const metadata: Metadata = createPublicPageMetadata({
  title: "Sample Runs",
  description:
    "Explore real sample runs across beauty, ecommerce, apparel, residential, and product-led launches with briefs, approvals, and final output cuts.",
  canonicalPath: "/sample-runs",
});

export default function SampleRunsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
