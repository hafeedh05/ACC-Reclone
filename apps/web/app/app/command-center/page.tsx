import type { Metadata } from "next";
import Link from "next/link";
import { AetherAppShell } from "@/components/aether-app";
import { EditorialMediaFrame, mediaForRun } from "@/components/media-system";
import { commandStages, eventRows, outputsLibrary } from "@/components/site-data";
import { getAdminSnapshot, getWorkspaceProjects } from "@/lib/aether-api";
import { requireSession } from "@/lib/auth";
import { createPrivatePageMetadata } from "../../seo";

export const metadata: Metadata = createPrivatePageMetadata({
  title: "Command Center",
  description: "Live run status, stages, artifacts, and routed outputs.",
  canonicalPath: "/app/command-center",
});

export default async function CommandCenterPage() {
  const session = await requireSession();
  const metrics = await getAdminSnapshot();
  const workspaceProjects = await getWorkspaceProjects(session.workspaceId);
  const leadProject = workspaceProjects[0];

  return (
    <AetherAppShell
      active="runs"
      session={session}
      projectHref={leadProject ? `/app/projects/${leadProject.id}` : "/app/projects/new"}
      title="Command Center"
      subtitle={leadProject ? `${leadProject.name} is ready to move through generation.` : "Reference command surface until your first run is approved."}
      actions={
        <div className="aether-app__meta-pair">
          <span>{metrics.overview.active_runs} active runs</span>
          <span>{metrics.overview.queued_jobs} queued jobs</span>
        </div>
      }
    >
      <section className="aether-command-lead">
        <article className="aether-command-lead__media">
          <EditorialMediaFrame
            asset={mediaForRun("aster-house-launch")}
            aspect="wide"
            className="aether-command-lead__frame"
            motion
            priority
            sizes="(min-width: 1200px) 58vw, 100vw"
          />
          <div className="aether-command-lead__overlay">
            <p>Live artifact</p>
            <strong>{leadProject?.name ?? "Aster House Launch"}</strong>
            <span>
              {leadProject?.description ??
                "Reference scene board showing how live routing, approvals, and output mapping will appear once your run starts."}
            </span>
          </div>
        </article>

        <aside className="aether-command-lead__rail">
          <div className="aether-command-panel">
            <p className="aether-kicker">Route map</p>
            {outputsLibrary.map((output) => (
              <div key={output.name} className="aether-command-panel__row">
                <strong>{output.name}</strong>
                <span>{output.status}</span>
              </div>
            ))}
          </div>
          <div className="aether-command-panel">
            <p className="aether-kicker">Recovery</p>
            <div className="aether-command-panel__row">
              <strong>Fallback still-pack</strong>
              <span>Ready</span>
            </div>
            <div className="aether-command-panel__row">
              <strong>Overlay confirmation</strong>
              <span>Waiting</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="aether-command-grid">
        <article className="aether-command-block">
          <div className="aether-workspace-section__head">
            <h2>Stage spine</h2>
            <span>Operational truth</span>
          </div>
          <div className="aether-stage-list">
            {commandStages.map((stage) => (
              <div key={stage.name} className="aether-stage-list__item">
                <div>
                  <strong>{stage.name}</strong>
                  <p>{stage.operational}</p>
                </div>
                <div className="aether-stage-list__meta">
                  <span>{stage.status}</span>
                  <b>{stage.progress}%</b>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="aether-command-block">
          <div className="aether-workspace-section__head">
            <h2>Artifact movement</h2>
            <span>Writers room to delivery</span>
          </div>
          <div className="aether-event-feed">
            {eventRows.map((event) => (
              <div key={`${event.time}-${event.title}`} className="aether-event-feed__item">
                <span>{event.time}</span>
                <div>
                  <strong>{event.role}</strong>
                  <p>{event.title}</p>
                  <em>{event.note}</em>
                </div>
              </div>
            ))}
          </div>
          <Link href="/sample-runs/cobalt-travel-charger" className="aether-inline-link">
            Review live run detail
          </Link>
        </article>
      </section>
    </AetherAppShell>
  );
}
