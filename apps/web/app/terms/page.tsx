import type { Metadata } from "next";
import { ContactFallbackPage } from "@/components/site-primitives";
import { createPublicPageMetadata } from "../seo";

export const metadata: Metadata = createPublicPageMetadata({
  title: "Terms",
  description: "Terms and commercial operating details for Ad Command Center.",
  canonicalPath: "/terms",
});

export default function TermsPage() {
  return <ContactFallbackPage title="Terms" />;
}
