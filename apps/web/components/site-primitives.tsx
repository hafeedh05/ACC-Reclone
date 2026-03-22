import Link from "next/link";
import type { ReactNode } from "react";
import { MarketingNavLinks } from "./experience-chrome";
import { marketingNav } from "./site-data";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function titleCase(input: string) {
  return input
    .split(/[\s/_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function accessibleMediaLabel(label: string) {
  const value = label.toLowerCase();

  if (value.includes("workspace") || value.includes("browser") || value.includes("laptop")) {
    return "Campaign workspace preview";
  }

  if (value.includes("phone") || value.includes("output")) {
    return "Output preview";
  }

  if (value.includes("texture") || value.includes("detail")) {
    return "Detail preview";
  }

  if (value.includes("product") || value.includes("bottle") || value.includes("pack")) {
    return "Campaign product preview";
  }

  if (value.includes("application") || value.includes("use-case") || value.includes("hand-held")) {
    return "Use-case preview";
  }

  if (value.includes("thumbnail") || value.includes("storyboard") || value.includes("scene")) {
    return "Campaign scene preview";
  }

  if (value.includes("shadow") || value.includes("plate")) {
    return "Ambient campaign layer";
  }

  return titleCase(label);
}

function mediaKindFromLabel(label: string) {
  const value = label.toLowerCase();

  if (value.includes("browser") || value.includes("laptop")) return "browser";
  if (value.includes("bottle") || value.includes("serum")) return "bottle";
  if (value.includes("phone") || value.includes("device")) return "device";
  if (value.includes("packaging") || value.includes("box")) return "packaging";
  if (value.includes("hand-held") || value.includes("handheld")) return "lifestyle";
  if (value.includes("shadow")) return "plate";
  if (value.includes("thumbnail") || value.includes("crop")) return "thumbnail";

  return "editorial";
}

function contactCopy(title: string) {
  switch (title) {
    case "Contact":
      return {
        eyebrow: "Contact",
        body:
          "For launch planning, enterprise workflow design, or partnership conversations, contact the team directly and we will route it to the right operator.",
        actions: [
          { href: "/enterprise", label: "Talk to Enterprise" },
          { href: "/sample-runs", label: "Review Sample Runs" },
        ],
      };
    case "Privacy":
      return {
        eyebrow: "Privacy",
        body:
          "Privacy details, data handling expectations, and operational controls will live here as the product stack moves from demo state into broader release.",
        actions: [
          { href: "/journal", label: "Read the Journal" },
          { href: "/contact", label: "Contact the Team" },
        ],
      };
    case "Terms":
      return {
        eyebrow: "Terms",
        body:
          "Terms of service, usage boundaries, and service commitments will be published here as the commercial product package is finalized.",
        actions: [
          { href: "/pricing", label: "Review Pricing" },
          { href: "/contact", label: "Contact the Team" },
        ],
      };
    default:
      return {
        eyebrow: title,
        body: "This route is part of the live marketing surface and will continue to be expanded alongside the product launch stack.",
        actions: [
          { href: "/", label: "Back to Homepage" },
          { href: "/journal", label: "Read the Journal" },
        ],
      };
  }
}

export function SiteWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-3">
      <span className="wordmark-chip">
        <span className="wordmark-chip__core" />
      </span>
      <span className={cn("leading-none", compact ? "text-base" : "text-lg")}>
        <span className="block font-semibold tracking-[-0.02em] text-[color:var(--text-primary)]">
          Ad Command Center
        </span>
        {!compact ? (
          <span className="mt-1 block text-[11px] uppercase tracking-[0.28em] text-[color:var(--text-soft)]">
            Prompt-first campaign production
          </span>
        ) : null}
      </span>
    </Link>
  );
}

export function MarketingHeader() {
  return (
    <header className="site-shell site-shell--tight">
      <div className="topbar">
        <SiteWordmark />
        <nav className="hidden items-center gap-8 text-sm text-[color:var(--text-secondary)] lg:flex">
          <MarketingNavLinks items={marketingNav} />
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <ButtonLink href="/how-it-works" variant="primary">
            See How It Works
          </ButtonLink>
          <ButtonLink href="/sample-runs" variant="secondary">
            Watch a Sample Run
          </ButtonLink>
        </div>
        <div className="md:hidden">
          <ButtonLink href="/how-it-works" variant="primary" compact>
            Workflow
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

export function ProductHeader() {
  return (
    <header className="site-shell site-shell--tight">
      <div className="topbar topbar--product">
        <SiteWordmark compact />
        <nav className="hidden items-center gap-3 lg:flex">
          <ButtonLink href="/app" variant="ghost" compact>
            Dashboard
          </ButtonLink>
          <ButtonLink href="/app/projects/aster-house-launch" variant="ghost" compact>
            Project
          </ButtonLink>
          <ButtonLink href="/app/command-center" variant="ghost" compact>
            Command Center
          </ButtonLink>
          <ButtonLink href="/app/outputs" variant="ghost" compact>
            Outputs
          </ButtonLink>
        </nav>
        <div className="flex items-center gap-3">
          <span className="status-badge status-badge--success">Workspace live</span>
          <ButtonLink href="/" variant="secondary" compact>
            Marketing site
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-shell site-shell--footer">
      <div className="footer-grid">
        <div className="space-y-5">
          <SiteWordmark compact />
          <p className="max-w-md text-sm leading-7 text-[color:var(--text-secondary)]">
            A premium operating system for turning assets, review logic, and production discipline
            into campaign-ready variants that a team can actually use.
          </p>
        </div>
        <div className="footer-links">
          <FooterColumn
            heading="Product"
            items={[
              { href: "/how-it-works", label: "How It Works" },
              { href: "/sample-runs", label: "Sample Runs" },
              { href: "/gallery", label: "Gallery" },
              { href: "/pricing", label: "Pricing" },
            ]}
          />
          <FooterColumn
            heading="Company"
            items={[
              { href: "/journal", label: "Journal" },
              { href: "/case-studies", label: "Case Studies" },
              { href: "/enterprise", label: "Enterprise" },
              { href: "/contact", label: "Contact" },
            ]}
          />
          <FooterColumn
            heading="Legal"
            items={[
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
            ]}
          />
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  heading,
  items,
}: {
  heading: string;
  items: Array<{ href: string; label: string }>;
}) {
  return (
    <div className="space-y-4">
      <p className="eyebrow">{heading}</p>
      <div className="space-y-3">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="footer-link">
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  compact = false,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "button-link",
        `button-link--${variant}`,
        compact && "button-link--compact",
      )}
    >
      {children}
    </Link>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function SectionIntro({
  eyebrow,
  title,
  body,
  align = "left",
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  body: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("section-intro", align === "center" && "section-intro--center")}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="section-title">{title}</h2>
      <p className="section-body">{body}</p>
    </div>
  );
}

export function HeroTitle({ children }: { children: ReactNode }) {
  return <h1 className="hero-title">{children}</h1>;
}

export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("site-shell", className)} id="main-content">
      {children}
    </main>
  );
}

export function EditorialDivider({
  label,
  detail,
}: {
  label?: string;
  detail?: string;
}) {
  return (
    <div className="editorial-divider">
      <span />
      {label ? <p className="editorial-divider__label">{label}</p> : null}
      {detail ? <p className="editorial-divider__detail">{detail}</p> : null}
    </div>
  );
}

export function PlaceholderArt({
  label,
  ratio = "square",
  align = "center",
}: {
  label: string;
  ratio?: "portrait" | "square" | "story" | "landscape" | "browser";
  align?: "center" | "start" | "end";
}) {
  const kind = mediaKindFromLabel(label);
  const cleanLabel = accessibleMediaLabel(label);

  return (
    <div
      aria-label={cleanLabel}
      className={cn(
        "placeholder-art",
        `placeholder-art--${ratio}`,
        `placeholder-art--${align}`,
        `placeholder-art--${kind}`,
      )}
      role="img"
    >
      <div className="placeholder-art__halo" />
      <div className="placeholder-art__grid" />
      <div className="placeholder-art__shadow" />
      <div className="placeholder-art__subject" />
      <div className="placeholder-art__glint" />
      <span className="sr-only">{cleanLabel}</span>
    </div>
  );
}

export function BrowserMockup({
  left,
  right,
  footer,
}: {
  left: ReactNode;
  right: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="browser-mockup">
      <div className="browser-mockup__bar">
        <span />
        <span />
        <span />
      </div>
      <div className="browser-mockup__grid">
        <div className="browser-mockup__column">{left}</div>
        <div className="browser-mockup__column browser-mockup__column--media">{right}</div>
      </div>
      {footer ? <div className="browser-mockup__footer">{footer}</div> : null}
    </div>
  );
}

export function Chip({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "accent" | "cobalt";
}) {
  return <span className={cn("chip", `chip--${tone}`)}>{children}</span>;
}

export function StatusBadge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "success" | "warning" | "accent";
}) {
  return <span className={cn("status-badge", `status-badge--${tone}`)}>{children}</span>;
}

export function FilterRow({
  items,
}: {
  items: string[];
}) {
  return (
    <div className="filter-row" aria-label="Filters" role="toolbar">
      {items.map((item, index) => (
        <button
          key={item}
          type="button"
          aria-pressed={index === 0}
          className={cn("filter-chip", index === 0 && "filter-chip--active")}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export function MetricLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="metric-line">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function ProseBlock({
  children,
  aside,
}: {
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="prose-layout">
      <div className="prose-layout__body">{children}</div>
      {aside ? <aside className="prose-layout__aside">{aside}</aside> : null}
    </div>
  );
}

export function ContactFallbackPage({
  title,
}: {
  title: string;
}) {
  const content = contactCopy(title);

  return (
    <PageShell className="pb-16">
      <MarketingHeader />
      <section className="page-hero page-hero--support">
        <div className="support-surface">
          <SectionIntro eyebrow={content.eyebrow} title={title} body={content.body} />
          <div className="hero-actions">
            {content.actions.map((action, index) => (
              <ButtonLink
                key={action.href}
                href={action.href}
                variant={index === 0 ? "primary" : "secondary"}
              >
                {action.label}
              </ButtonLink>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </PageShell>
  );
}
