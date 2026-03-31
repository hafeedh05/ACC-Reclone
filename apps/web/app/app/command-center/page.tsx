import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AetherAppShell } from "@/components/aether-app";
import {
  getRun,
  listRunEvents,
  listRunVariants,
  getWorkspaceProjects,
  listRuns,
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
  searchParams: Promise<{ run?: string; error?: string }>;
}) {
  const session = await requireSession();
  const { run: runId, error } = await searchParams;
  const localFetch = async <T,>(path: string): Promise<T | null> => {
    if (process.env.NODE_ENV === "production") {
      return null;
    }
    try {
      const response = await fetch(`http://127.0.0.1:8080${path}`, { cache: "no-store" });
      if (!response.ok) {
        return null;
      }
      return (await response.json()) as T;
    } catch {
      return null;
    }
  };
  const workspaceProjects = await getWorkspaceProjects(session.workspaceId);
  const leadProject = workspaceProjects[0];
  const allRuns = (await listRuns()) ?? [];
  const workspaceRuns = allRuns
    .filter((item) => item.workspace_id === session.workspaceId)
    .sort((left, right) => right.updated_at.localeCompare(left.updated_at));
  const activeRunId = runId ?? workspaceRuns[0]?.id;

  let run = activeRunId ? await getRun(activeRunId) : null;
  if (!run && activeRunId) {
    run = await localFetch(`/v1/runs/${activeRunId}`);
  }
  let events = activeRunId ? (await listRunEvents(activeRunId)) ?? [] : [];
  if (activeRunId && events.length === 0) {
    events = (await localFetch(`/v1/runs/${activeRunId}/events`)) ?? [];
  }
  let variants = activeRunId ? (await listRunVariants(activeRunId)) ?? [] : [];
  if (activeRunId && variants.length === 0) {
    variants = (await localFetch(`/v1/runs/${activeRunId}/variants`)) ?? [];
  }
  const formatLabel = (value: string) =>
    value
      .split(/[_-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  const formatRunId = (value: string) => {
    const shortId = value.split("-").pop()?.slice(0, 8).toUpperCase();
    return shortId ? `Run ${shortId}` : "Run";
  };

  if (!run) {
    return (
      <AetherAppShell
        active="command"
        session={session}
        title="Command center"
        subtitle="No active run"
        outputsHref={workspaceRuns[0] ? `/app/outputs?run=${workspaceRuns[0].id}` : undefined}
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

  if (error === "failed" && run.status !== "failed") {
    redirect(`/app/command-center?run=${run.id}`);
  }

  const canApproveScript = run.status === "awaiting_script_approval";
  const canApproveStoryboard = run.status === "awaiting_storyboard_approval";
  const hasError = run.status === "failed";
  const callToAction = run.brief.call_to_action?.trim();

  return (
    <AetherAppShell
      active="command"
      session={session}
      title="Command center"
      subtitle={`${formatRunId(run.id)} - ${formatLabel(run.status)}`}
      outputsHref={`/app/outputs?run=${run.id}`}
      actions={
        <div className="aether-app__meta-pair">
          <span>{formatLabel(run.stage)}</span>
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
              <span>CTA: {callToAction ? callToAction : "None"}</span>
            </div>
            <div className="aether-command-brief__block">
              <p className="aether-kicker">Duration</p>
              <span>{run.brief.duration_seconds ? `${run.brief.duration_seconds}s` : "Not set"}</span>
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
          {hasError ? (
            <div className="aether-panel aether-panel--alert">
              <p className="aether-kicker">Run failed</p>
              <h2>Generation stopped before outputs were delivered.</h2>
              <p>Check the API logs for the provider error, then retry the approval.</p>
            </div>
          ) : null}
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
                  <strong>{formatLabel(variant.name)}</strong>
                  <span>{variant.aspect_ratio.replace("r", "").replace("x", ":")}</span>
                </div>
              ))
            ) : (
              <span className="aether-muted aether-command-panel__note">
                Outputs appear after storyboard approval.
              </span>
            )}
            <Link href={`/app/outputs?run=${run.id}`} className="aether-inline-link">
              Open outputs
            </Link>
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
                    <strong>{formatLabel(event.actor)}</strong>
                    <p>{event.message}</p>
                    <em>{formatLabel(event.stage)}</em>
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
