import Link from "next/link";
import type { ReactNode } from "react";
import type { PlatformSession } from "@/lib/auth";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const workspaceNav = [
  { key: "overview", label: "Overview", href: "/app" },
  { key: "projects", label: "Projects", href: "/app/projects" },
  { key: "command", label: "Command Center", href: "/app/command-center" },
  { key: "outputs", label: "Outputs", href: "/app/outputs" },
  { key: "settings", label: "Settings", href: "/app/settings" },
];

export function AetherAppShell({
  active,
  flowStep,
  title,
  subtitle,
  session,
  projectHref = "/app/projects/new",
  actions,
  children,
}: {
  active: string;
  flowStep?: string;
  title: string;
  subtitle: string;
  session: PlatformSession;
  projectHref?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const flowSteps = [
    { key: "overview", label: "Overview", href: "/app" },
    { key: "projects", label: "Projects & brief", href: "/app/projects" },
    { key: "setup", label: "Project setup", href: projectHref },
    { key: "command", label: "Command center", href: "/app/command-center" },
    { key: "outputs", label: "Outputs", href: "/app/outputs" },
  ];

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
              href={item.key === "projects" ? "/app/projects" : item.href}
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
          <div className="aether-app__header-title">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="aether-app__header-actions">
            {actions}
            <div className="aether-app__session-chip">
              <strong>{session.name}</strong>
              <span>{session.workspaceId}</span>
            </div>
          </div>
        </header>

        <div className="aether-app__content">
          {flowStep ? (
            <nav className="aether-app__flow" aria-label="Workflow">
              <p className="aether-app__flow-label">Workflow path</p>
              <div className="aether-app__flow-steps">
                {flowSteps.map((step) => (
                  <Link
                    key={step.key}
                    href={step.href}
                    className={cn(
                      "aether-app__flow-step",
                      flowStep === step.key && "is-active",
                    )}
                  >
                    <span>{step.label}</span>
                  </Link>
                ))}
              </div>
            </nav>
          ) : null}
          {children}
        </div>
      </div>
    </main>
  );
}
