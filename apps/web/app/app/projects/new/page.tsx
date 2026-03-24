import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AetherAppShell } from "@/components/aether-app";
import { createWorkspaceProject, getWorkspaceProjects } from "@/lib/aether-api";
import { requireSession } from "@/lib/auth";
import { createPrivatePageMetadata } from "../../../seo";

export const metadata: Metadata = createPrivatePageMetadata({
  title: "Create Project",
  description: "Start a new Aether Hyve project inside your workspace.",
  canonicalPath: "/app/projects/new",
});

async function createProjectAction(formData: FormData) {
  "use server";

  const session = await requireSession();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name) {
    redirect("/app/projects/new?error=missing");
  }

  const project = await createWorkspaceProject({
    workspaceId: session.workspaceId,
    name,
    description,
  });

  if (!project) {
    redirect("/app/projects/new?error=failed");
  }

  redirect(`/app/projects/${project.id}`);
}

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await requireSession();
  const workspaceProjects = await getWorkspaceProjects(session.workspaceId);
  const { error } = await searchParams;

  return (
    <AetherAppShell
      active="projects"
      session={session}
      projectHref={workspaceProjects[0] ? `/app/projects/${workspaceProjects[0].id}` : "/app/projects/new"}
      title="Create project"
      subtitle="Start a user-scoped workspace project"
    >
      <section className="aether-project-create">
        <div className="aether-project-create__intro">
          <span>Workspace owner</span>
          <h2>{session.name}</h2>
          <p>
            Projects created here are scoped to <strong>{session.email}</strong> and stay tied to
            workspace <strong>{session.workspaceId}</strong>.
          </p>
        </div>

        <form action={createProjectAction} className="aether-project-create__form">
          <label>
            <span>Project name</span>
            <input name="name" type="text" placeholder="Spring launch system" required />
          </label>
          <label>
            <span>Description</span>
            <textarea
              name="description"
              rows={5}
              placeholder="Describe the offer, the product, and the direction you want the run to follow."
            />
          </label>
          {error === "missing" ? (
            <p className="aether-auth-error">Project name is required.</p>
          ) : null}
          {error === "failed" ? (
            <p className="aether-auth-error">Project creation failed. Retry the request.</p>
          ) : null}
          <button type="submit" className="aether-btn aether-btn--primary">
            Create project
          </button>
        </form>
      </section>
    </AetherAppShell>
  );
}
