import type { Metadata } from "next";
import { ContactFallbackPage } from "@/components/site-primitives";
import { createPublicPageMetadata } from "../seo";

export const metadata: Metadata = createPublicPageMetadata({
  title: "Privacy",
  description: "Privacy and data-handling information for Ad Command Center.",
  canonicalPath: "/privacy",
});

export default function PrivacyPage() {
  return <ContactFallbackPage title="Privacy" />;
}
