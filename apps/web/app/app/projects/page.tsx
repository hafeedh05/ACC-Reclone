import type { Metadata } from "next";
import Link from "next/link";
import { AetherAppShell } from "@/components/aether-app";
import { getWorkspaceProjects } from "@/lib/aether-api";
import { requireSession } from "@/lib/auth";
import { createPrivatePageMetadata } from "../../seo";

export const metadata: Metadata = createPrivatePageMetadata({
  title: "Projects",
  description: "Workspace projects, briefs, and approval status.",
  canonicalPath: "/app/projects",
});

const pageSize = 5;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await requireSession();
  const workspaceProjects = await getWorkspaceProjects(session.workspaceId);
  const leadProject = workspaceProjects[0];
  const projectHref = leadProject ? `/app/projects/${leadProject.id}` : "/app/projects/new";
  const params = await searchParams;
  const pageParam = Number(params.page ?? "1");
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const totalPages = Math.max(1, Math.ceil(workspaceProjects.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageProjects = workspaceProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <AetherAppShell
      active="projects"
      flowStep="projects"
      session={session}
      projectHref={projectHref}
      title="Projects"
      subtitle="Briefs, assets, and approvals stay scoped to each project."
      actions={
        <div className="aether-app__meta-pair">
          <span>{workspaceProjects.length} projects</span>
          <span>{leadProject ? "Briefs in motion" : "Create your first brief"}</span>
        </div>
      }
    >
      <section className="aether-projects">
        <div className="aether-projects__main">
          <div className="aether-projects__head">
            <div>
              <h2>Project workspace</h2>
              <p>Keep briefs, assets, and approvals focused per run.</p>
            </div>
            <Link href="/app/projects/new" className="aether-btn aether-btn--primary">
              New project
            </Link>
          </div>

          {pageProjects.length ? (
            <div className="aether-projects__list">
              {pageProjects.map((project) => (
                <Link key={project.id} href={`/app/projects/${project.id}`} className="aether-project-row">
                  <div>
                    <strong>{project.name}</strong>
                    <span>{project.description || "Brief pending"}</span>
                  </div>
                  <div className="aether-project-row__meta">
                    <span>
                      Updated{" "}
                      {new Date(project.updated_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <em>Open</em>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="aether-panel aether-projects__empty">
              <p className="aether-kicker">No projects yet</p>
              <h3>Start a new workspace brief.</h3>
              <p>Each project captures the offer, assets, and approvals before the run begins.</p>
              <Link href="/app/projects/new" className="aether-btn aether-btn--primary">
                Create project
              </Link>
            </div>
          )}

          {totalPages > 1 ? (
            <div className="aether-projects__pagination">
              <Link
                href={`/app/projects?page=${Math.max(1, currentPage - 1)}`}
                className={`aether-btn aether-btn--ghost ${currentPage === 1 ? "is-disabled" : ""}`}
                aria-disabled={currentPage === 1}
              >
                Previous
              </Link>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Link
                href={`/app/projects?page=${Math.min(totalPages, currentPage + 1)}`}
                className={`aether-btn aether-btn--ghost ${currentPage === totalPages ? "is-disabled" : ""}`}
                aria-disabled={currentPage === totalPages}
              >
                Next
              </Link>
            </div>
          ) : null}
        </div>

        <aside className="aether-projects__rail">
          <div className="aether-panel">
            <p className="aether-kicker">Workflow checklist</p>
            <ol className="aether-step-list">
              <li>
                <span>01</span>
                <strong>Capture the brief</strong>
              </li>
              <li>
                <span>02</span>
                <strong>Upload assets</strong>
              </li>
              <li>
                <span>03</span>
                <strong>Lock approvals</strong>
              </li>
            </ol>
          </div>

          <div className="aether-panel">
            <p className="aether-kicker">Active brief</p>
            <h3>{leadProject ? leadProject.name : "No active brief"}</h3>
            <p>
              {leadProject
                ? leadProject.description || "Open the project to finalize the brief and assets."
                : "Create a project to open the brief workspace."}
            </p>
            <Link
              href={leadProject ? `/app/projects/${leadProject.id}` : "/app/projects/new"}
              className="aether-btn aether-btn--secondary"
            >
              {leadProject ? "Open project" : "Create project"}
            </Link>
          </div>
        </aside>
      </section>
    </AetherAppShell>
  );
}
