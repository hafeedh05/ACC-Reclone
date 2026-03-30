import type { Metadata } from "next";
import { OutputsLibrarySurface } from "@/components/product-surfaces";
import { AetherAppShell } from "@/components/aether-app";
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
    <AetherAppShell
      active="outputs"
      session={session}
      title="Outputs"
      subtitle="Deliverable variants grouped by intent and ratio."
    >
      <section className="aether-outputs-lead">
        <div>
          <h2>Delivery pack</h2>
          <p>Outputs stay grouped by intent with clear actions for publish, download, or share.</p>
        </div>
        <div className="aether-outputs-lead__actions">
          <button type="button" className="aether-btn aether-btn--primary">
            Download pack
          </button>
          <button type="button" className="aether-btn aether-btn--secondary">
            Share package
          </button>
        </div>
      </section>
      <OutputsLibrarySurface compact />
    </AetherAppShell>
  );
}
