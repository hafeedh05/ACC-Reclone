import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AetherAppShell } from "@/components/aether-app";
import { EditorialMediaFrame, mediaForRun } from "@/components/media-system";
import { getProject } from "@/components/site-data";
import { getWorkspaceProject } from "@/lib/aether-api";
import { requireSession } from "@/lib/auth";
import { createPrivatePageMetadata } from "../../../seo";
import { createRunAction } from "./actions";

const stepTabs = [
  { key: "brief", label: "Brief & script", helper: "Direction and draft" },
  { key: "assets", label: "Assets", helper: "Uploads and selects" },
  { key: "approvals", label: "Approvals", helper: "Review gates" },
  { key: "run", label: "Run", helper: "Command center" },
  { key: "outputs", label: "Outputs", helper: "Delivery exports" },
];

const formatOptions = [
  { value: "r9x16", label: "9:16" },
  { value: "r1x1", label: "1:1" },
  { value: "r16x9", label: "16:9" },
];

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ view?: string; error?: string }>;
}) {
  const session = await requireSession();
  const { slug } = await params;
  const { view, error } = await searchParams;
  const seededProject = getProject(slug);
  const workspaceProject = await getWorkspaceProject(slug, session.workspaceId);
  const project = seededProject ?? workspaceProject;

  if (!project) {
    notFound();
  }

  const isWorkspaceProject = "workspace_id" in project;
  const mediaSlug = isWorkspaceProject
    ? "cobalt-travel-charger"
    : project.slug === "aster-house-launch"
      ? "aster-house-launch"
      : "northstar-serum-launch";
  const brief = isWorkspaceProject
    ? project.description || "No brief captured yet. Add the offer and direction to unlock assets."
    : project.brief;
  const formats = isWorkspaceProject ? ["9:16", "1:1", "16:9"] : project.formats;
  const assets = isWorkspaceProject
    ? ["Upload pack shots", "Add use-case frames", "Attach references"]
    : project.assets;
  const approvals = isWorkspaceProject
    ? ["Script pending", "Storyboard pending"]
    : ["Script approved", "Storyboard approved"];
  const outputs = formats.map((format, index) => ({
    label: `${format} export`,
    status: index === 0 ? "Ready" : "Queued",
  }));
  const updatedLabel = isWorkspaceProject
    ? new Date(project.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : project.updatedAt;
  const projectStatus = isWorkspaceProject ? "Brief pending" : project.status;
  const nextAction = isWorkspaceProject
    ? project.description
      ? "Upload assets and confirm formats."
      : "Capture the brief to unlock assets and approvals."
    : "Open command center to start the run.";
  const viewKey = stepTabs.find((item) => item.key === view)?.key ?? "brief";

  return (
    <AetherAppShell
      active="projects"
      session={session}
      title={project.name}
      subtitle={projectStatus}
      actions={
        <div className="aether-app__meta-pair">
          <span>{projectStatus}</span>
          <span>Updated {updatedLabel}</span>
        </div>
      }
    >
      <section className="aether-project-shell">
        <div className="aether-project-shell__header">
          <p className="aether-kicker">Project workflow</p>
          <nav className="aether-project-steps" aria-label="Project steps">
            {stepTabs.map((item) => (
              <Link
                key={item.key}
                href={`/app/projects/${slug}?view=${item.key}`}
                className={viewKey === item.key ? "aether-project-step is-active" : "aether-project-step"}
              >
                <strong>{item.label}</strong>
                <span>{item.helper}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="aether-project-shell__body">
          <div className="aether-project-shell__main">
            {viewKey === "brief" ? (
              <div className="aether-project-view">
                <div className="aether-project-view__hero">
                  <EditorialMediaFrame
                    asset={mediaForRun(mediaSlug)}
                    aspect="wide"
                    className="aether-project-view__frame"
                    sizes="(min-width: 1200px) 60vw, 100vw"
                  />
                  <div className="aether-project-view__hero-copy">
                    <p className="aether-kicker">Brief summary</p>
                    <h2>Describe the run</h2>
                    <p>{brief}</p>
                  </div>
                </div>

                {isWorkspaceProject ? (
                  <form action={createRunAction} className="aether-brief-form">
                    <input type="hidden" name="projectId" value={project.id} />
                    <label>
                      <span>Brief description</span>
                      <textarea
                        name="objective"
                        rows={4}
                        placeholder="What should this video communicate? Keep it short and direct."
                        defaultValue={project.description ?? ""}
                        required
                      />
                    </label>
                    <div className="aether-brief-form__grid">
                      <label>
                        <span>Audience</span>
                        <input name="audience" type="text" placeholder="Core customer segment" />
                      </label>
                      <label>
                        <span>Tone</span>
                        <input name="tone" type="text" placeholder="Premium, calm, controlled" />
                      </label>
                      <label>
                        <span>Call to action</span>
                        <input name="call_to_action" type="text" placeholder="Learn more" />
                      </label>
                    </div>
                    <fieldset className="aether-format-select">
                      <legend>Formats</legend>
                      <div className="aether-chip-grid aether-chip-grid--tight">
                        {formatOptions.map((option) => (
                          <label key={option.value} className="aether-chip-select">
                            <input type="checkbox" name="formats" value={option.value} defaultChecked />
                            <span>{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    {error === "missing" ? (
                      <p className="aether-auth-error">Brief description is required.</p>
                    ) : null}
                    {error === "failed" ? (
                      <p className="aether-auth-error">Run creation failed. Check the API and retry.</p>
                    ) : null}
                    <div className="aether-brief-form__actions">
                      <button type="submit" className="aether-btn aether-btn--primary">
                        Generate script draft
                      </button>
                      <span>Manual approvals happen in command center.</span>
                    </div>
                  </form>
                ) : (
                  <div className="aether-panel">
                    <p className="aether-kicker">Sample run</p>
                    <h3>Sample data is read-only.</h3>
                    <p>Create a workspace project to generate new runs.</p>
                  </div>
                )}
              </div>
            ) : null}

            {viewKey === "assets" ? (
              <div className="aether-project-view">
                <article className="aether-panel">
                  <p className="aether-kicker">Asset set</p>
                  <h2>Source material</h2>
                  <p>Keep the asset list tight so each scene has a clear job.</p>
                  <div className="aether-asset-list">
                    {assets.map((asset, index) => (
                      <div key={asset}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <strong>{asset}</strong>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            ) : null}

            {viewKey === "approvals" ? (
              <div className="aether-project-view">
                <article className="aether-panel">
                  <p className="aether-kicker">Approvals</p>
                  <h2>Review gates</h2>
                  <p>Approve the script and storyboard before clips are generated.</p>
                  <div className="aether-approval-list">
                    {approvals.map((approval) => (
                      <span key={approval}>{approval}</span>
                    ))}
                  </div>
                  <Link href="/app/command-center" className="aether-inline-link">
                    Open command center
                  </Link>
                </article>
              </div>
            ) : null}

            {viewKey === "run" ? (
              <div className="aether-project-view">
                <article className="aether-panel">
                  <p className="aether-kicker">Run control</p>
                  <h2>Command center</h2>
                  <p>Review script and storyboard approvals, then trigger clip generation.</p>
                  <Link href="/app/command-center" className="aether-btn aether-btn--primary">
                    Open command center
                  </Link>
                </article>
              </div>
            ) : null}

            {viewKey === "outputs" ? (
              <div className="aether-project-view">
                <article className="aether-panel">
                  <p className="aether-kicker">Latest outputs</p>
                  <h2>Delivery status</h2>
                  <p>Outputs appear here once the command center completes the run.</p>
                  <div className="aether-output-list">
                    {outputs.map((output) => (
                      <div key={output.label}>
                        <strong>{output.label}</strong>
                        <span>{output.status}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/app/outputs" className="aether-inline-link">
                    Open outputs library
                  </Link>
                </article>
              </div>
            ) : null}
          </div>

          <aside className="aether-project-shell__rail">
            <div className="aether-panel">
              <p className="aether-kicker">Status</p>
              <h3>{projectStatus}</h3>
              <p>Last update: {updatedLabel}</p>
              <div className="aether-project-shell__rail-actions">
                <Link href="/app/command-center" className="aether-btn aether-btn--secondary">
                  Open command center
                </Link>
              </div>
            </div>

            <div className="aether-panel">
              <p className="aether-kicker">Next action</p>
              <strong>{nextAction}</strong>
              <span>Keep the run moving by completing the next gate.</span>
            </div>

            <div className="aether-panel">
              <p className="aether-kicker">Approvals</p>
              <div className="aether-approval-list">
                {approvals.map((approval) => (
                  <span key={approval}>{approval}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </AetherAppShell>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return createPrivatePageMetadata({
      title: "Project",
      description: "Aether Hyve workspace project.",
      canonicalPath: `/app/projects/${slug}`,
    });
  }

  return createPrivatePageMetadata({
    title: project.name,
    description: project.brief,
    canonicalPath: `/app/projects/${project.slug}`,
  });
}
