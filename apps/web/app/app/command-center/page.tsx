import type { Metadata } from "next";
import { CommandCenterSurface } from "@/components/product-surfaces";
import { ProductHeader } from "@/components/site-primitives";
import { createPrivatePageMetadata } from "../../seo";

export const metadata: Metadata = createPrivatePageMetadata({
  title: "Command Center",
  description: "A live production surface for script approvals, clip generation, and variant assembly.",
  canonicalPath: "/app/command-center",
});

export default function CommandCenterPage() {
  return (
    <main className="site-shell pb-16" id="main-content">
      <ProductHeader />
      <CommandCenterSurface />
    </main>
  );
}
