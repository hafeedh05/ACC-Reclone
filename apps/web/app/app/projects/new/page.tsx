import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AetherAppShell } from "@/components/aether-app";
import { createWorkspaceProject } from "@/lib/aether-api";
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
  const { error } = await searchParams;

  return (
    <AetherAppShell
      active="projects"
      session={session}
      title="Create project"
      subtitle="Start the brief and asset flow for a new run."
    >
      <section className="aether-project-create aether-project-create--flow">
        <div className="aether-project-create__rail">
          <p className="aether-kicker">Project setup</p>
          <h2>Begin with a clean brief.</h2>
          <p>
            Projects stay scoped to your workspace. Add the campaign intent now, then attach assets
            and approvals inside the project workspace.
          </p>
          <ol className="aether-step-list">
            <li className="is-active">
              <span>01</span>
              <strong>Project basics</strong>
            </li>
            <li>
              <span>02</span>
              <strong>Brief and assets</strong>
            </li>
            <li>
              <span>03</span>
              <strong>Approval gates</strong>
            </li>
          </ol>
          <div className="aether-project-create__meta">
            <span>Workspace owner</span>
            <strong>{session.name}</strong>
            <p>
              Projects created here are scoped to <strong>{session.email}</strong>.
            </p>
          </div>
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
