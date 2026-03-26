import type { Metadata } from "next";
import Link from "next/link";
import { AetherAppShell } from "@/components/aether-app";
import { getWorkspaceProjects } from "@/lib/aether-api";
import { requireSession } from "@/lib/auth";
import { createPrivatePageMetadata } from "../../seo";

export const metadata: Metadata = createPrivatePageMetadata({
  title: "Settings",
  description: "Workspace identity, access, and profile settings.",
  canonicalPath: "/app/settings",
});

export default async function SettingsPage() {
  const session = await requireSession();
  const workspaceProjects = await getWorkspaceProjects(session.workspaceId);
  const leadProject = workspaceProjects[0];

  return (
    <AetherAppShell
      active="settings"
      session={session}
      projectHref={leadProject ? `/app/projects/${leadProject.id}` : "/app/projects/new"}
      title="Settings"
      subtitle="Workspace identity and access control."
    >
      <section className="aether-settings">
        <div className="aether-settings__main">
          <div className="aether-panel">
            <p className="aether-kicker">Workspace</p>
            <h2>{session.workspaceId}</h2>
            <p>Sessions are scoped to {session.email}.</p>
          </div>
          <div className="aether-panel">
            <p className="aether-kicker">Operator</p>
            <h3>{session.name}</h3>
            <p>{session.email}</p>
            <div className="aether-settings__actions">
              <Link href="/sign-out" prefetch={false} className="aether-btn aether-btn--secondary">
                Sign out
              </Link>
            </div>
          </div>
        </div>
        <aside className="aether-settings__rail">
          <div className="aether-panel">
            <p className="aether-kicker">Support</p>
            <p>For workspace changes or governance, contact the platform team.</p>
            <Link href="/contact" className="aether-inline-link">
              Contact support
            </Link>
          </div>
          <div className="aether-panel">
            <p className="aether-kicker">Workflow</p>
            <p>Projects remain scoped to the signed-in workspace and do not leak across sessions.</p>
          </div>
        </aside>
      </section>
    </AetherAppShell>
  );
}
