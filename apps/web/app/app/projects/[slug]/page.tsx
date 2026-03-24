import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AetherAppShell } from "@/components/aether-app";
import { EditorialMediaFrame, mediaForRun } from "@/components/media-system";
import { getProject } from "@/components/site-data";
import { getWorkspaceProject } from "@/lib/aether-api";
import { requireSession } from "@/lib/auth";
import { createPrivatePageMetadata } from "../../../seo";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await requireSession();
  const { slug } = await params;
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

  return (
    <AetherAppShell
      active="projects"
      session={session}
      projectHref={isWorkspaceProject ? `/app/projects/${project.id}` : "/app/projects/new"}
      title={project.name}
      subtitle={isWorkspaceProject ? "Ready for first brief and asset ingest" : project.status}
      actions={
        <Link href="/app/command-center" className="aether-btn aether-btn--secondary">
          Open live run
        </Link>
      }
    >
      <section className="aether-project-detail">
        <article className="aether-project-detail__hero">
          <EditorialMediaFrame
            asset={mediaForRun(mediaSlug)}
            aspect="wide"
            className="aether-project-detail__frame"
            sizes="(min-width: 1200px) 62vw, 100vw"
          />
        </article>

        <aside className="aether-project-detail__rail">
          <div>
            <span>Brief</span>
            <strong>{isWorkspaceProject ? project.description || "No brief captured yet." : project.brief}</strong>
          </div>
          <div>
            <span>Goals</span>
            <p>{isWorkspaceProject ? "Capture goals once the brief is opened." : project.goals.join(" · ")}</p>
          </div>
          <div>
            <span>Formats</span>
            <p>{isWorkspaceProject ? "9:16 · 1:1 · 16:9" : project.formats.join(" · ")}</p>
          </div>
          <div>
            <span>Assets</span>
            <p>{isWorkspaceProject ? "No uploads yet" : project.assets.join(" · ")}</p>
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
