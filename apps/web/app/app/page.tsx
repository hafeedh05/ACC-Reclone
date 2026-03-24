import type { Metadata } from "next";
import Link from "next/link";
import { AetherAppShell } from "@/components/aether-app";
import { EditorialMediaFrame, mediaForRun } from "@/components/media-system";
import { getAdminSnapshot, getWorkspaceProjects } from "@/lib/aether-api";
import { requireSession } from "@/lib/auth";
import { createPrivatePageMetadata } from "../seo";

export const metadata: Metadata = createPrivatePageMetadata({
  title: "Workspace",
  description: "Aether Hyve workspace for active generations, projects, and asset inventory.",
  canonicalPath: "/app",
});

export default async function AppPage() {
  const session = await requireSession();
  const metrics = await getAdminSnapshot();
  const workspaceProjects = await getWorkspaceProjects(session.workspaceId);
  const featuredHref = workspaceProjects[0]
    ? `/app/projects/${workspaceProjects[0].id}`
    : "/app/projects/new";
  const referenceProjects = [
    { slug: "cobalt-travel-charger", name: "Cobalt Travel Charger", status: "Reference sample run" },
    { slug: "aster-house-launch", name: "Aster House Launch", status: "Reference command system" },
  ];

  return (
    <AetherAppShell
      active="dashboard"
      session={session}
      projectHref={featuredHref}
      title="Workspace"
      subtitle={`Signed in as ${session.email}`}
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
          <h2>Workspace status</h2>
          <span>{workspaceProjects.length} projects in your workspace</span>
        </div>
        {workspaceProjects.length ? (
          <div className="aether-run-grid">
            {workspaceProjects.slice(0, 2).map((project, index) => (
              <article key={project.id} className={index === 0 ? "aether-run-card is-live" : "aether-run-card"}>
                <div className="aether-run-card__top">
                  <div>
                    <strong>{project.name}</strong>
                    <p>{project.description || "Project created and waiting for brief approval."}</p>
                  </div>
                  <span>{index === 0 ? "Ready" : "Queued"}</span>
                </div>
                <div className="aether-run-card__progress">
                  <b style={{ width: index === 0 ? "18%" : "6%" }} />
                </div>
                <div className="aether-run-card__meta">
                  <span>{index === 0 ? "Brief and assets pending" : "Project initialized"}</span>
                  <span>{new Date(project.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="aether-empty-state">
            <div>
              <span>No active runs yet</span>
              <h3>Your workspace is ready for the first brief.</h3>
              <p>Create a project, add the offer and assets, then the active run surface will populate from your own workflow instead of shared demo data.</p>
            </div>
            <Link href="/app/projects/new" className="aether-btn aether-btn--primary">
              Create project
            </Link>
          </div>
        )}
      </section>

      <section className="aether-workspace-section">
        <div className="aether-workspace-section__head">
          <h2>Your project workspace</h2>
          <Link href="/app/projects/new">Create project</Link>
        </div>
        {workspaceProjects.length ? (
          <div className="aether-workspace-projects">
            {workspaceProjects.map((project, index) => (
              <Link
                key={project.id}
                href={`/app/projects/${project.id}`}
                className={index === 0 ? "aether-workspace-project aether-workspace-project--lead" : "aether-workspace-project"}
              >
                <div>
                  <span>{index === 0 ? "Lead project" : "Project"}</span>
                  <strong>{project.name}</strong>
                  <p>{project.description || "Ready for brief, assets, and first generation run."}</p>
                </div>
                <em>Open workspace</em>
              </Link>
            ))}
          </div>
        ) : (
          <div className="aether-empty-state">
            <div>
              <span>Workspace ready</span>
              <h3>Create your first project</h3>
              <p>Start with a project name and description. The brief, assets, and generation steps follow inside the workspace.</p>
            </div>
            <Link href="/app/projects/new" className="aether-btn aether-btn--primary">
              Create first project
            </Link>
          </div>
        )}
      </section>

      <section className="aether-workspace-section">
        <div className="aether-workspace-section__head">
          <h2>Reference systems</h2>
          <span>Seeded sample runs</span>
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
            <div className="aether-project-grid__badge">Reference</div>
          </Link>

          <div className="aether-project-grid__stack">
            {referenceProjects.map((project) => (
              <Link key={project.slug} href={`/sample-runs/${project.slug}`} className="aether-project-tile">
                <EditorialMediaFrame
                  asset={mediaForRun(project.slug)}
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
    </AetherAppShell>
  );
}
