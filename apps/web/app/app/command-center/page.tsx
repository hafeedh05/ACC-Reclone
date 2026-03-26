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
  const activeStage = commandStages.find((stage) => stage.status === "Live") ?? commandStages[2];
  const briefSummary = leadProject
    ? leadProject.description || "Brief queued for asset ingest and approval."
    : "Reference command surface until your first run is approved.";
  const assets = ["Lead pack shot", "Use-case frame", "Detail close"];
  const approvals = ["Script pending", "Storyboard pending"];

  return (
    <AetherAppShell
      active="command"
      flowStep="command"
      session={session}
      projectHref={leadProject ? `/app/projects/${leadProject.id}` : "/app/projects/new"}
      title="Command center"
      subtitle={leadProject ? `${leadProject.name} is ready to move through generation.` : "Reference command surface."}
      actions={
        <div className="aether-app__meta-pair">
          <span>{metrics.overview.active_runs} active runs</span>
          <span>{metrics.overview.queued_jobs} queued jobs</span>
        </div>
      }
    >
      <section className="aether-command-shell">
        <aside className="aether-command-shell__rail">
          <div className="aether-command-panel">
            <p className="aether-kicker">Brief</p>
            <strong>{leadProject?.name ?? "Reference run"}</strong>
            <span>{briefSummary}</span>
          </div>
          <div className="aether-command-panel">
            <p className="aether-kicker">Assets</p>
            {assets.map((asset) => (
              <div key={asset} className="aether-command-panel__row">
                <strong>{asset}</strong>
                <span>Queued</span>
              </div>
            ))}
          </div>
          <div className="aether-command-panel">
            <p className="aether-kicker">Formats</p>
            {[
              "9:16",
              "1:1",
              "16:9",
            ].map((format) => (
              <div key={format} className="aether-command-panel__row">
                <strong>{format}</strong>
                <span>Planned</span>
              </div>
            ))}
          </div>
          <div className="aether-command-panel">
            <p className="aether-kicker">Approvals</p>
            {approvals.map((approval) => (
              <div key={approval} className="aether-command-panel__row">
                <strong>{approval}</strong>
                <span>Waiting</span>
              </div>
            ))}
          </div>
        </aside>

        <section className="aether-command-shell__stage">
          <article className="aether-command-stage">
            <EditorialMediaFrame
              asset={mediaForRun("aster-house-launch")}
              aspect="wide"
              className="aether-command-stage__frame"
              motion
              priority
              sizes="(min-width: 1200px) 56vw, 100vw"
            />
            <div className="aether-command-stage__overlay">
              <p className="aether-kicker">Active stage</p>
              <strong>{activeStage.operational}</strong>
              <span>{activeStage.note}</span>
            </div>
          </article>

          <div className="aether-command-stage__spine">
            <div className="aether-workspace-section__head">
              <h2>Stage spine</h2>
              <span>{activeStage.progress}% complete</span>
            </div>
            <div className="aether-stage-list">
              {commandStages.slice(0, 5).map((stage) => (
                <div key={stage.name} className="aether-stage-list__item">
                  <div>
                    <strong>{stage.operational}</strong>
                    <p>{stage.note}</p>
                  </div>
                  <div className="aether-stage-list__meta">
                    <span>{stage.status}</span>
                    <b>{stage.progress}%</b>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="aether-command-shell__ops">
          <div className="aether-command-panel">
            <div className="aether-workspace-section__head">
              <h2>Output map</h2>
              <span>{outputsLibrary.length} routes</span>
            </div>
            {outputsLibrary.map((output) => (
              <div key={output.name} className="aether-command-panel__row">
                <strong>{output.name}</strong>
                <span>{output.status}</span>
              </div>
            ))}
          </div>
          <div className="aether-command-panel">
            <div className="aether-workspace-section__head">
              <h2>Live feed</h2>
              <span>Latest events</span>
            </div>
            <div className="aether-event-feed">
              {eventRows.slice(0, 3).map((event) => (
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
              Review sample run
            </Link>
          </div>
          <div className="aether-command-panel">
            <div className="aether-workspace-section__head">
              <h2>Recovery</h2>
              <span>Fallback ready</span>
            </div>
            <strong>Still-led assembly is armed for the live scene.</strong>
            <span>Performance and brand cuts keep moving even if one motion beat slips.</span>
          </div>
        </aside>
      </section>
    </AetherAppShell>
  );
}
