import type { Metadata } from "next";
import { DashboardSurface } from "@/components/product-surfaces";
import { ProductHeader } from "@/components/site-primitives";
import { createPrivatePageMetadata } from "../seo";

export const metadata: Metadata = createPrivatePageMetadata({
  title: "Workspace",
  description: "A premium production desk for live campaigns, reviews, and final outputs.",
  canonicalPath: "/app",
});

export default function AppPage() {
  return (
    <main className="site-shell pb-16" id="main-content">
      <ProductHeader />
      <DashboardSurface />
    </main>
  );
}
