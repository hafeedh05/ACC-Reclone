import type { Metadata } from "next";
import { OutputsLibrarySurface } from "@/components/product-surfaces";
import { ProductHeader } from "@/components/site-primitives";
import { requireSession } from "@/lib/auth";
import { createPrivatePageMetadata } from "../../seo";

export const metadata: Metadata = createPrivatePageMetadata({
  title: "Outputs Library",
  description: "A finished output library with grid and list views for campaign variants.",
  canonicalPath: "/app/outputs",
});

export default async function OutputsPage() {
  const session = await requireSession();

  return (
    <main className="site-shell pb-16" id="main-content">
      <ProductHeader sessionName={session.name} workspaceId={session.workspaceId} />
      <OutputsLibrarySurface />
    </main>
  );
}
