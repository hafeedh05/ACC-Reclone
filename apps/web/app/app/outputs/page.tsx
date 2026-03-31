import type { Metadata } from "next";
import { OutputsLibrarySurface } from "@/components/product-surfaces";
import { AetherAppShell } from "@/components/aether-app";
import { requireSession } from "@/lib/auth";
import { getRun, listRunVariants, listRuns, getWorkspaceProject } from "@/lib/aether-api";
import { createPrivatePageMetadata } from "../../seo";

export const metadata: Metadata = createPrivatePageMetadata({
  title: "Outputs Library",
  description: "A finished output library with grid and list views for campaign variants.",
  canonicalPath: "/app/outputs",
});

export default async function OutputsPage({
  searchParams,
}: {
  searchParams: Promise<{ run?: string }>;
}) {
  const session = await requireSession();
  const { run: runId } = await searchParams;
  const runs = (await listRuns()) ?? [];
  const workspaceRuns = runs
    .filter((item) => item.workspace_id === session.workspaceId)
    .sort((left, right) => right.updated_at.localeCompare(left.updated_at));
  const activeRunId = runId ?? workspaceRuns[0]?.id;
  const run = activeRunId ? await getRun(activeRunId) : null;
  const variants = activeRunId ? (await listRunVariants(activeRunId)) ?? [] : [];
  const project = run ? await getWorkspaceProject(run.project_id, session.workspaceId) : null;
  const projectLabel = project?.name ?? "Aether Clip";
  const formatLabel = (value: string) =>
    value
      .split(/[_-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  const fileSafe = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  return (
    <AetherAppShell
      active="outputs"
      session={session}
      title="Outputs"
      subtitle="Deliverable variants grouped by intent and ratio."
      outputsHref={activeRunId ? `/app/outputs?run=${activeRunId}` : undefined}
    >
      <section className="aether-outputs-lead">
        <div>
          <h2>Delivery bundle</h2>
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
      {run ? (
        <section className="aether-output-grid">
          <div className="aether-output-grid__head">
            <div>
              <p className="aether-kicker">Latest run</p>
              <h2>{run.brief.objective}</h2>
              <p>
                Outputs for {run.brief.duration_seconds ? `${run.brief.duration_seconds}s` : "this"} run,
                grouped by ratio.
              </p>
            </div>
            <div className="aether-output-grid__meta">
              <span>{variants.length} variants</span>
              <span>Status: {formatLabel(run.status)}</span>
            </div>
          </div>

          {variants.length ? (
            <div className="aether-output-grid__list">
              {variants.map((variant) => {
                const ratioLabel = variant.aspect_ratio.replace("r", "").replace("x", ":");
                const ratioClass =
                  variant.aspect_ratio === "r9x16"
                    ? "is-portrait"
                    : variant.aspect_ratio === "r1x1"
                      ? "is-square"
                      : "is-landscape";
                const downloadName = `aether-clip-${fileSafe(projectLabel)}-${fileSafe(variant.name)}-${ratioLabel.replace(":", "x")}.mp4`;
                const downloadUrl = `/api/download?uri=${encodeURIComponent(
                  variant.uri,
                )}&name=${encodeURIComponent(downloadName)}`;
                return (
                  <article key={variant.id} className="aether-output-card">
                    <div className={`aether-output-media ${ratioClass}`}>
                      <video
                        src={variant.uri}
                        poster={variant.thumbnail_uri}
                        controls
                        playsInline
                        preload="metadata"
                      />
                    </div>
                    <div className="aether-output-card__meta">
                      <div>
                        <p className="aether-kicker">Variant</p>
                        <h3>{formatLabel(variant.name)}</h3>
                      </div>
                      <div className="aether-output-card__tags">
                        <span>{ratioLabel}</span>
                        <span>{variant.published ? "Published" : "Ready"}</span>
                      </div>
                    </div>
                    <div className="aether-output-card__actions">
                      <a
                        className="aether-btn aether-btn--secondary"
                        href={downloadUrl}
                        download={downloadName}
                      >
                        Download
                      </a>
                      <button type="button" className="aether-btn aether-btn--ghost">
                        Share
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="aether-panel aether-panel--alert">
              <p className="aether-kicker">No outputs yet</p>
              <h2>Approve the storyboard to start clip generation.</h2>
              <p>The output library will populate once clips are rendered.</p>
            </div>
          )}
        </section>
      ) : (
        <OutputsLibrarySurface compact />
      )}
    </AetherAppShell>
  );
}
