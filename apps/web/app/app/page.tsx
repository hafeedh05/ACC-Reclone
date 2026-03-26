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
  const leadProject = workspaceProjects[0];
  const projectHref = leadProject ? `/app/projects/${leadProject.id}` : "/app/projects/new";
  const focusTitle = leadProject ? leadProject.name : "Create your first project";
  const focusCopy = leadProject
    ? leadProject.description || "Capture the brief to unlock assets and approvals."
    : "Start with a project name and a short brief. The workspace will guide assets, approvals, and the run.";
  const nextSteps = leadProject
    ? ["Confirm the brief", "Upload assets", "Open command center"]
    : ["Create project", "Add the brief", "Upload assets"];
  const recentProjects = workspaceProjects.slice(0, 3);
  const hasProjects = workspaceProjects.length > 0;

  return (
    <AetherAppShell
      active="overview"
      flowStep="overview"
      session={session}
      projectHref={projectHref}
      title="Workspace overview"
      subtitle={`Signed in as ${session.email}`}
      actions={
        <div className="aether-app__meta-pair">
          <span>{metrics.overview.active_runs} active processes</span>
          <span>{metrics.summary.variant_count} ready variants</span>
        </div>
      }
    >
      <section className="aether-overview">
        <div className="aether-overview__main">
          <article className="aether-panel aether-overview__focus">
            <p className="aether-kicker">Current focus</p>
            <h2>{focusTitle}</h2>
            <p>{focusCopy}</p>
            <div className="aether-overview__actions">
              <Link href={projectHref} className="aether-btn aether-btn--primary">
                {leadProject ? "Open project" : "Create project"}
              </Link>
              {hasProjects ? (
                <Link href="/app/command-center" className="aether-btn aether-btn--secondary">
                  Open command center
                </Link>
              ) : null}
            </div>
          </article>

          {hasProjects ? (
            <div className="aether-overview__list">
              <div className="aether-overview__list-head">
                <div>
                  <h3>Recent projects</h3>
                  <span>{workspaceProjects.length} in workspace</span>
                </div>
                <Link href="/app/projects" className="aether-inline-link">
                  View all
                </Link>
              </div>
              <div className="aether-overview__rows">
                {recentProjects.map((project) => (
                  <Link key={project.id} href={`/app/projects/${project.id}`} className="aether-overview__row">
                    <div>
                      <strong>{project.name}</strong>
                      <span>{project.description || "Brief pending"}</span>
                    </div>
                    <em>
                      {new Date(project.updated_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </em>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="aether-panel aether-overview__zero">
              <p className="aether-kicker">Workspace ready</p>
              <h3>What happens next</h3>
              <p>Once the first project exists, this overview tracks brief, assets, approvals, and outputs.</p>
              <ol className="aether-step-list">
                {nextSteps.map((step, index) => (
                  <li key={step}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{step}</strong>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <aside className="aether-overview__rail">
          {hasProjects ? (
            <div className="aether-panel">
              <p className="aether-kicker">Next action</p>
              <ol className="aether-step-list">
                {nextSteps.map((step, index) => (
                  <li key={step}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{step}</strong>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          <div className="aether-panel aether-overview__reference">
            <p className="aether-kicker">Reference run</p>
            <EditorialMediaFrame
              asset={mediaForRun("cobalt-travel-charger")}
              aspect="landscape"
              className="aether-overview__reference-frame"
              sizes="(min-width: 1200px) 20vw, 80vw"
            />
            <div>
              <strong>Cobalt Travel Charger</strong>
              <p>Review a clean sample run to compare the workflow against live runs.</p>
              <Link href="/sample-runs/cobalt-travel-charger" className="aether-inline-link">
                Open sample run
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </AetherAppShell>
  );
}
