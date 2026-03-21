import type { Metadata } from "next";
import { ContactFallbackPage } from "@/components/site-primitives";
import { createPublicPageMetadata } from "../seo";

export const metadata: Metadata = createPublicPageMetadata({
  title: "Contact",
  description: "Contact the Ad Command Center team for enterprise workflow design, launch planning, or partnership conversations.",
  canonicalPath: "/contact",
});

export default function ContactPage() {
  return <ContactFallbackPage title="Contact" />;
}
