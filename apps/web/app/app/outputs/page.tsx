import type { Metadata } from "next";
import { OutputsLibrarySurface } from "@/components/product-surfaces";
import { ProductHeader } from "@/components/site-primitives";
import { createPrivatePageMetadata } from "../../seo";

export const metadata: Metadata = createPrivatePageMetadata({
  title: "Outputs Library",
  description: "A finished output library with grid and list views for campaign variants.",
  canonicalPath: "/app/outputs",
});

export default function OutputsPage() {
  return (
    <main className="site-shell pb-16" id="main-content">
      <ProductHeader />
      <OutputsLibrarySurface />
    </main>
  );
}
