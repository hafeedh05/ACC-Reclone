import Link from "next/link";
import type { ReactNode } from "react";
import type { PlatformSession } from "@/lib/auth";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const workspaceNav = [
  { key: "dashboard", label: "Dashboard", href: "/app" },
  { key: "projects", label: "Projects", href: "/app/projects/aster-house-launch" },
  { key: "assets", label: "Assets", href: "/sample-runs" },
  { key: "runs", label: "Runs", href: "/app/command-center" },
  { key: "settings", label: "Settings", href: "/pricing" },
];

export function AetherAppShell({
  active,
  title,
  subtitle,
  session,
  projectHref = "/app/projects/new",
  actions,
  children,
}: {
  active: string;
  title: string;
  subtitle: string;
  session: PlatformSession;
  projectHref?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="aether-app" id="main-content">
      <aside className="aether-app__sidebar">
        <div className="aether-app__brand">
          <p>AETHER HYVE</p>
          <span>Enterprise tier</span>
        </div>

        <nav className="aether-app__nav" aria-label="Workspace">
          {workspaceNav.map((item) => (
            <Link
              key={item.key}
              href={item.key === "projects" ? projectHref : item.href}
              className={cn(
                "aether-app__nav-link",
                active === item.key && "is-active",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="aether-app__sidebar-footer">
          <Link href="/app/projects/new" className="aether-btn aether-btn--primary aether-btn--full">
            New generation
          </Link>
          <div className="aether-app__sidebar-meta">
            <span>{session.name}</span>
            <span>{session.email}</span>
            <Link href="/sign-out" prefetch={false}>
              Sign out
            </Link>
          </div>
        </div>
      </aside>

      <div className="aether-app__canvas">
        <header className="aether-app__header">
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="aether-app__header-actions">
            <div className="aether-app__session-chip">
              <strong>{session.name}</strong>
              <span>{session.workspaceId}</span>
            </div>
            {actions}
          </div>
        </header>

        <div className="aether-app__content">{children}</div>
      </div>
    </main>
  );
}
