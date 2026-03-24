import type { Metadata } from "next";
import Link from "next/link";
import { AetherAppShell } from "@/components/aether-app";
import { EditorialMediaFrame, mediaForRun } from "@/components/media-system";
import { projects } from "@/components/site-data";
import { getAdminSnapshot } from "@/lib/aether-api";
import { createPrivatePageMetadata } from "../seo";

export const metadata: Metadata = createPrivatePageMetadata({
  title: "Workspace",
  description: "Aether Hyve workspace for active generations, projects, and asset inventory.",
  canonicalPath: "/app",
});

export default async function AppPage() {
  const metrics = await getAdminSnapshot();
  const [featured, sideOne, sideTwo] = [
    projects.find((item) => item.slug === "northstar-serum-launch") ?? projects[0],
    projects.find((item) => item.slug === "aster-house-launch") ?? projects[0],
    projects[0],
  ];

  return (
    <AetherAppShell
      active="dashboard"
      title="Workspace"
      subtitle="Active runs, project systems, and source assets"
      actions={
        <>
          <div className="aether-app__meta-pair">
            <span>{metrics.overview.active_runs} active processes</span>
            <span>{metrics.summary.variant_count} ready variants</span>
          </div>
        </>
      }
    >
      <section className="aether-workspace-section">
        <div className="aether-workspace-section__head">
          <h2>Active video generations</h2>
          <span>{metrics.overview.active_runs} active processes</span>
        </div>
        <div className="aether-run-grid">
          <article className="aether-run-card is-live">
            <div className="aether-run-card__top">
              <div>
                <strong>Northstar Serum Launch</strong>
                <p>Script approved, storyboard locked, generation in progress</p>
              </div>
              <span>Processing</span>
            </div>
            <div className="aether-run-card__progress">
              <b style={{ width: "64%" }} />
            </div>
            <div className="aether-run-card__meta">
              <span>64% rendered</span>
              <span>Est. 02:14 remaining</span>
            </div>
          </article>
          <article className="aether-run-card">
            <div className="aether-run-card__top">
              <div>
                <strong>Cobalt Travel Charger</strong>
                <p>Queued for multi-cut export and delivery packaging</p>
              </div>
              <span>Queued</span>
            </div>
            <div className="aether-run-card__progress">
              <b style={{ width: "8%" }} />
            </div>
            <div className="aether-run-card__meta">
              <span>Waiting for GPU node</span>
              <span>Est. 12:00 remaining</span>
            </div>
          </article>
        </div>
      </section>

      <section className="aether-workspace-section">
        <div className="aether-workspace-section__head">
          <h2>Recent campaign systems</h2>
          <Link href="/sample-runs">View archive</Link>
        </div>
        <div className="aether-project-grid">
          <Link href="/sample-runs/cobalt-travel-charger" className="aether-project-grid__featured">
            <EditorialMediaFrame
              asset={mediaForRun("cobalt-travel-charger")}
              aspect="wide"
              className="aether-project-grid__featured-frame"
              sizes="(min-width: 1200px) 52vw, 100vw"
            />
            <div className="aether-project-grid__featured-copy">
              <span>Lead sample run</span>
              <h3>Cobalt Travel Charger</h3>
              <div className="aether-project-grid__featured-actions">
                <em>Review script</em>
                <em>Inspect outputs</em>
              </div>
            </div>
            <div className="aether-project-grid__badge">v2.4 ready</div>
          </Link>

          <div className="aether-project-grid__stack">
            {[sideOne, sideTwo].map((project) => (
              <Link key={project.slug} href={`/app/projects/${project.slug}`} className="aether-project-tile">
                <EditorialMediaFrame
                  asset={mediaForRun(project.slug === "aster-house-launch" ? "aster-house-launch" : "northstar-serum-launch")}
                  aspect="landscape"
                  className="aether-project-tile__frame"
                  sizes="(min-width: 1200px) 22vw, 100vw"
                />
                <div>
                  <strong>{project.name}</strong>
                  <span>{project.status}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="aether-workspace-section">
        <div className="aether-workspace-section__head">
          <h2>Asset library repository</h2>
          <span>{featured.assets.length} source assets</span>
        </div>
        <div className="aether-asset-table">
          <div className="aether-asset-table__row aether-asset-table__row--head">
            <span>Name / File format</span>
            <span>Resolution</span>
            <span>Duration</span>
            <span>Last modified</span>
          </div>
          {featured.assets.map((asset, index) => (
            <div key={asset} className="aether-asset-table__row">
              <strong>{asset.replace(/\s+/g, "_").toLowerCase()}.png</strong>
              <span>{index === 0 ? "3840 × 2160" : "2160 × 2160"}</span>
              <span>{index === 0 ? "00:05.2" : "-"}</span>
              <span>{index === 0 ? "Mar 24, 2026" : "Mar 23, 2026"}</span>
            </div>
          ))}
        </div>
      </section>
    </AetherAppShell>
  );
}
