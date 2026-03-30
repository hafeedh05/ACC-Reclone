import type { Metadata } from "next";
import Link from "next/link";
import { AetherAppShell } from "@/components/aether-app";
import {
  getRun,
  listRunEvents,
  listRunVariants,
  getWorkspaceProjects,
} from "@/lib/aether-api";
import { requireSession } from "@/lib/auth";
import { createPrivatePageMetadata } from "../../seo";
import {
  approveScriptAction,
  approveStoryboardAction,
  regenerateScriptAction,
  regenerateStoryboardAction,
} from "./actions";

export const metadata: Metadata = createPrivatePageMetadata({
  title: "Command Center",
  description: "Live run status, stages, artifacts, and routed outputs.",
  canonicalPath: "/app/command-center",
});

export default async function CommandCenterPage({
  searchParams,
}: {
  searchParams: Promise<{ run?: string }>;
}) {
  const session = await requireSession();
  const { run: runId } = await searchParams;
  const workspaceProjects = await getWorkspaceProjects(session.workspaceId);
  const leadProject = workspaceProjects[0];

  const run = runId ? await getRun(runId) : null;
  const events = runId ? (await listRunEvents(runId)) ?? [] : [];
  const variants = runId ? (await listRunVariants(runId)) ?? [] : [];

  if (!run) {
    return (
      <AetherAppShell
        active="command"
        session={session}
        title="Command center"
        subtitle="Manual approvals and run control."
      >
        <section className="aether-command-shell aether-command-shell--empty">
          <div className="aether-panel">
            <p className="aether-kicker">No active run</p>
            <h2>Generate a run from a project brief.</h2>
            <p>
              Start in a project, capture the brief, then return here to approve the script and storyboard.
            </p>
            <Link href={leadProject ? `/app/projects/${leadProject.id}` : "/app/projects"} className="aether-btn aether-btn--primary">
              {leadProject ? "Open project" : "Open projects"}
            </Link>
          </div>
        </section>
      </AetherAppShell>
    );
  }

  const canApproveScript = run.status === "awaiting_script_approval";
  const canApproveStoryboard = run.status === "awaiting_storyboard_approval";

  return (
    <AetherAppShell
      active="command"
      session={session}
      title="Command center"
      subtitle={`Run ${run.id} · ${run.status.replace(/_/g, " ")}`}
      actions={
        <div className="aether-app__meta-pair">
          <span>{run.stage.replace(/_/g, " ")}</span>
          <span>{variants.length} outputs</span>
        </div>
      }
    >
      <section className="aether-command-shell">
        <aside className="aether-command-shell__rail">
          <div className="aether-panel aether-command-brief">
            <div className="aether-command-brief__block">
              <p className="aether-kicker">Brief</p>
              <strong>{run.brief.objective}</strong>
              <span>{run.brief.audience}</span>
            </div>
            <div className="aether-command-brief__block">
              <p className="aether-kicker">Tone</p>
              <span>{run.brief.tone}</span>
              <span>CTA: {run.brief.call_to_action}</span>
            </div>
            <div className="aether-command-brief__block">
              <p className="aether-kicker">Formats</p>
              {run.brief.formats.map((format) => (
                <div key={format} className="aether-command-panel__row">
                  <strong>{format.replace("r", "").replace("x", ":")}</strong>
                  <span>Planned</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="aether-command-shell__stage">
          <div className="aether-command-stage__spine">
            <div className="aether-workspace-section__head">
              <h2>Script draft</h2>
              <span>{run.script ? `v${run.script.version}` : "Pending"}</span>
            </div>
            {run.script ? (
              <div className="aether-command-script">
                <strong>{run.script.headline}</strong>
                <p>{run.script.logline}</p>
                <div className="aether-command-script__body">
                  <p>{run.script.voiceover}</p>
                </div>
              </div>
            ) : (
              <p className="aether-muted">Script draft will appear after run creation.</p>
            )}
            <div className="aether-command-actions">
              <form action={approveScriptAction}>
                <input type="hidden" name="runId" value={run.id} />
                <button type="submit" className="aether-btn aether-btn--primary" disabled={!canApproveScript}>
                  Approve script
                </button>
              </form>
              <form action={regenerateScriptAction}>
                <input type="hidden" name="runId" value={run.id} />
                <button type="submit" className="aether-btn aether-btn--secondary" disabled={!canApproveScript}>
                  Regenerate
                </button>
              </form>
            </div>
          </div>

          <div className="aether-command-stage__spine">
            <div className="aether-workspace-section__head">
              <h2>Storyboard</h2>
              <span>{run.storyboard ? `v${run.storyboard.version}` : "Pending"}</span>
            </div>
            {run.storyboard ? (
              <div className="aether-stage-list">
                {run.storyboard.scenes.map((scene) => (
                  <div key={scene.id} className="aether-stage-list__item">
                    <div>
                      <strong>Scene {scene.index}</strong>
                      <p>{scene.prompt}</p>
                    </div>
                    <div className="aether-stage-list__meta">
                      <span>{scene.duration_seconds}s</span>
                      <b>{scene.camera_direction}</b>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="aether-muted">Storyboard will populate once script is approved.</p>
            )}
            <div className="aether-command-actions">
              <form action={approveStoryboardAction}>
                <input type="hidden" name="runId" value={run.id} />
                <button type="submit" className="aether-btn aether-btn--primary" disabled={!canApproveStoryboard}>
                  Approve storyboard
                </button>
              </form>
              <form action={regenerateStoryboardAction}>
                <input type="hidden" name="runId" value={run.id} />
                <button type="submit" className="aether-btn aether-btn--secondary" disabled={!canApproveStoryboard}>
                  Regenerate
                </button>
              </form>
            </div>
          </div>
        </section>

        <aside className="aether-command-shell__ops">
          <div className="aether-command-panel">
            <div className="aether-workspace-section__head">
              <h2>Output map</h2>
              <span>{variants.length} variants</span>
            </div>
            {variants.length ? (
              variants.map((variant) => (
                <div key={variant.id} className="aether-command-panel__row">
                  <strong>{variant.name}</strong>
                  <span>{variant.aspect_ratio.replace("r", "").replace("x", ":")}</span>
                </div>
              ))
            ) : (
              <span className="aether-muted">Outputs appear after storyboard approval.</span>
            )}
          </div>
          <div className="aether-command-panel">
            <div className="aether-workspace-section__head">
              <h2>Live feed</h2>
              <span>{events.length} events</span>
            </div>
            <div className="aether-event-feed">
              {events.slice(-4).map((event) => (
                <div key={event.event_id} className="aether-event-feed__item">
                  <span>{new Date(event.emitted_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                  <div>
                    <strong>{event.actor}</strong>
                    <p>{event.message}</p>
                    <em>{event.stage.replace(/_/g, " ")}</em>
                  </div>
                </div>
              ))}
              {!events.length ? <p className="aether-muted">No events yet.</p> : null}
            </div>
          </div>
        </aside>
      </section>
    </AetherAppShell>
  );
}
