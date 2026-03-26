import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AetherAppShell } from "@/components/aether-app";
import { EditorialMediaFrame, mediaForRun } from "@/components/media-system";
import { getProject } from "@/components/site-data";
import { getWorkspaceProject } from "@/lib/aether-api";
import { requireSession } from "@/lib/auth";
import { createPrivatePageMetadata } from "../../../seo";

const viewOptions = [
  { key: "overview", label: "Overview", helper: "Summary and next action" },
  { key: "brief", label: "Brief + goals", helper: "Campaign direction" },
  { key: "assets", label: "Assets", helper: "Uploads and selects" },
  { key: "approvals", label: "Approvals", helper: "Review gates" },
  { key: "outputs", label: "Outputs", helper: "Latest exports" },
];

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ view?: string }>;
}) {
  const session = await requireSession();
  const { slug } = await params;
  const { view } = await searchParams;
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
  const goals = isWorkspaceProject
    ? ["Define the primary goal", "Lock the offer", "Confirm ratios and channels"]
    : project.goals;
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
  const viewKey = viewOptions.find((item) => item.key === view)?.key ?? "overview";

  return (
    <AetherAppShell
      active="projects"
      flowStep="setup"
      session={session}
      projectHref={isWorkspaceProject ? `/app/projects/${project.id}` : "/app/projects/new"}
      title={project.name}
      subtitle={projectStatus}
      actions={
        <Link href="/app/command-center" className="aether-btn aether-btn--secondary">
          Open command center
        </Link>
      }
    >
      <section className="aether-project-flow">
        <aside className="aether-project-flow__nav">
          <p className="aether-kicker">Project views</p>
          {viewOptions.map((item) => (
            <Link
              key={item.key}
              href={`/app/projects/${slug}?view=${item.key}`}
              className={viewKey === item.key ? "aether-project-flow__nav-link is-active" : "aether-project-flow__nav-link"}
            >
              <strong>{item.label}</strong>
              <span>{item.helper}</span>
            </Link>
          ))}
        </aside>

        <div className="aether-project-flow__content">
          {viewKey === "overview" ? (
            <div className="aether-project-view">
              <div className="aether-project-view__hero">
                <EditorialMediaFrame
                  asset={mediaForRun(mediaSlug)}
                  aspect="wide"
                  className="aether-project-view__frame"
                  sizes="(min-width: 1200px) 60vw, 100vw"
                />
                <div className="aether-project-view__hero-copy">
                  <p className="aether-kicker">Project overview</p>
                  <h2>Brief summary</h2>
                  <p>{brief}</p>
                </div>
              </div>

              <div className="aether-project-view__grid">
                <article className="aether-panel">
                  <p className="aether-kicker">Goals</p>
                  <ul className="aether-bullet-list">
                    {goals.map((goal) => (
                      <li key={goal}>{goal}</li>
                    ))}
                  </ul>
                </article>
                <article className="aether-panel">
                  <p className="aether-kicker">Formats</p>
                  <div className="aether-chip-grid">
                    {formats.map((format) => (
                      <span key={format}>{format}</span>
                    ))}
                  </div>
                </article>
              </div>
            </div>
          ) : null}

          {viewKey === "brief" ? (
            <div className="aether-project-view">
              <article className="aether-panel">
                <p className="aether-kicker">Campaign brief</p>
                <h2>Direction and intent</h2>
                <p>{brief}</p>
              </article>
              <div className="aether-project-view__grid">
                <article className="aether-panel">
                  <p className="aether-kicker">Goals</p>
                  <ul className="aether-bullet-list">
                    {goals.map((goal) => (
                      <li key={goal}>{goal}</li>
                    ))}
                  </ul>
                </article>
                <article className="aether-panel">
                  <p className="aether-kicker">Formats</p>
                  <div className="aether-chip-grid">
                    {formats.map((format) => (
                      <span key={format}>{format}</span>
                    ))}
                  </div>
                </article>
              </div>
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
                <p>Approvals keep generation and edit work from drifting.</p>
                <div className="aether-approval-list">
                  {approvals.map((approval) => (
                    <span key={approval}>{approval}</span>
                  ))}
                </div>
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

        <aside className="aether-project-flow__rail">
          <div className="aether-panel">
            <p className="aether-kicker">Status</p>
            <h3>{projectStatus}</h3>
            <p>Last update: {updatedLabel}</p>
            <div className="aether-project-flow__rail-actions">
              <Link href="/app/command-center" className="aether-btn aether-btn--primary">
                Open command center
              </Link>
              <Link href="/app/outputs" className="aether-btn aether-btn--secondary">
                Review outputs
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
