import Link from "next/link";
import type { Metadata } from "next";
import {
  ButtonLink,
  Chip,
  MarketingHeader,
  PageShell,
  SiteFooter,
  StatusBadge,
} from "@/components/site-primitives";
import { journalArticles } from "@/components/site-data";
import { createPublicPageMetadata } from "../seo";

const topicLabels = ["Workflow", "Creative Ops", "Production", "Launch Craft", "Output Strategy"];

export const metadata: Metadata = createPublicPageMetadata({
  title: "Journal",
  description:
    "Articles on launch craft, review logic, output systems, storyboard approvals, and campaign production decisions.",
  canonicalPath: "/journal",
});

export default function JournalIndexPage() {
  const [featured, leadEssay, systemsNote, fieldMemo, ...archive] = journalArticles;

  return (
    <PageShell className="pb-16">
      <MarketingHeader />

      <section className="page-hero journal-hero">
        <div className="journal-hero__copy">
          <Chip tone="accent">Journal</Chip>
          <h1 className="hero-title max-w-[8ch]">
            Editorial depth for teams improving campaign systems
          </h1>
          <p className="hero-body">
            Essays, field notes, and operating lessons for teams shaping briefs, reviewing
            storyboards, packaging output families, and keeping campaign production coherent
            after handoff.
          </p>
          <div className="flex flex-wrap gap-2">
            {topicLabels.map((item, index) => (
              <span
                key={item}
                className={
                  index === 0
                    ? "inline-flex items-center rounded-full border border-[rgba(212,154,90,0.34)] bg-[rgba(212,154,90,0.12)] px-4 py-2 text-sm text-[color:var(--text-primary)]"
                    : "inline-flex items-center rounded-full border border-[color:var(--border-default)] bg-[rgba(246,242,234,0.03)] px-4 py-2 text-sm text-[color:var(--text-secondary)]"
                }
              >
                {item}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <StatusBadge tone="default">{journalArticles.length} articles</StatusBadge>
            <StatusBadge tone="accent">Essays, notes, and systems views</StatusBadge>
            <StatusBadge tone="success">Linked to runs and case studies</StatusBadge>
          </div>
        </div>

        <FeaturedJournalBoard article={featured} />
      </section>

      <section className="journal-grid">
        <aside className="journal-grid__rail">
          <div className="journal-rail-panel">
            <p className="eyebrow">Reading map</p>
            <div className="mt-5 space-y-4">
              <ArchiveNote
                label="Workflow"
                value="Approvals, storyboard logic, and the sequence that protects production quality."
              />
              <ArchiveNote
                label="Creative ops"
                value="Ratios, output libraries, and how one run turns into a usable family."
              />
              <ArchiveNote
                label="Proof"
                value="Every article has a natural path into a sample run or a case study."
              />
            </div>
          </div>

          <div className="journal-rail-panel">
            <p className="eyebrow">Next step</p>
            <div className="mt-5 grid gap-3">
              <ButtonLink href="/sample-runs" variant="primary">
                Move into sample runs
              </ButtonLink>
              <ButtonLink href="/case-studies" variant="secondary">
                Read case studies
              </ButtonLink>
            </div>
          </div>
        </aside>

        <div className="journal-grid__stack">
          <LeadEssayCard article={leadEssay} />
          <div className="journal-grid__notes">
            <JournalNoteCard article={systemsNote} accent="cobalt" />
            <JournalNoteCard article={fieldMemo} accent="amber" />
          </div>
        </div>
      </section>

      <section className="journal-archive">
        <div className="journal-archive__heading">
          <div className="space-y-3">
            <p className="eyebrow">Archive</p>
            <h2 className="text-4xl leading-[0.98] tracking-[-0.05em] text-[color:var(--text-primary)]">
              Different angles, different density, one editorial standard.
            </h2>
            <p className="max-w-3xl text-base leading-8 text-[color:var(--text-secondary)]">
              Some pieces carry the big operating argument. Others solve one production problem
              cleanly. The archive should read like a publication with a point of view.
            </p>
          </div>
          <ButtonLink href="/sample-runs" variant="secondary">
            Move into sample runs
          </ButtonLink>
        </div>

        <div className="journal-archive__list">
          {archive.map((article, index) => (
            <JournalArchiveRow
              key={article.slug}
              article={article}
              accent={index % 3 === 0 ? "amber" : index % 3 === 1 ? "cobalt" : "neutral"}
            />
          ))}
        </div>
      </section>

      <SiteFooter />
    </PageShell>
  );
}

function FeaturedJournalBoard({ article }: { article: (typeof journalArticles)[number] }) {
  return (
    <Link href={`/journal/${article.slug}`} className="journal-lead">
      <div className="journal-lead__copy">
        <p className="eyebrow">{article.category}</p>
        <h2>{article.title}</h2>
        <p>{article.dek}</p>
        <div className="journal-lead__chips">
          {(article.summaryPoints ?? []).slice(0, 3).map((point) => (
            <Chip key={point}>{point}</Chip>
          ))}
        </div>
        <div className="journal-lead__meta">
          <StatusBadge tone="default">{article.date}</StatusBadge>
          <StatusBadge tone="accent">{article.readTime}</StatusBadge>
          <StatusBadge tone="success">{article.author}</StatusBadge>
        </div>
      </div>

      <div className="journal-lead__sidebar">
        {(article.metrics ?? []).slice(0, 3).map((metric, index) => (
          <article
            key={metric.label}
            className={[
              "journal-metric",
              index === 0 ? "journal-metric--accent" : "",
            ].join(" ")}
          >
            <p className="eyebrow">{metric.label}</p>
            <div>{metric.value}</div>
            <p>{metric.note}</p>
          </article>
        ))}
      </div>
    </Link>
  );
}

function LeadEssayCard({ article }: { article: (typeof journalArticles)[number] }) {
  return (
    <Link href={`/journal/${article.slug}`} className="journal-essay">
      <div className="journal-essay__top">
        <div>
          <p className="eyebrow">{article.category}</p>
          <h2>{article.title}</h2>
        </div>
        <StatusBadge tone="accent">{article.readTime}</StatusBadge>
      </div>
      <p className="journal-essay__dek">{article.dek}</p>
      <div className="journal-essay__grid">
        {(article.summaryPoints ?? []).slice(0, 3).map((point, index) => (
          <div key={`${article.slug}-${point}`} className="journal-essay__point">
            <span>0{index + 1}</span>
            <p>{point}</p>
          </div>
        ))}
      </div>
    </Link>
  );
}

function JournalNoteCard({
  article,
  accent,
}: {
  article: (typeof journalArticles)[number];
  accent: "amber" | "cobalt";
}) {
  return (
    <Link
      href={`/journal/${article.slug}`}
      className={[
        "journal-note",
        accent === "amber" ? "journal-note--amber" : "journal-note--cobalt",
      ].join(" ")}
    >
      <p className="eyebrow">{article.category}</p>
      <h3>{article.title}</h3>
      <p>{article.dek}</p>
      <div className="journal-note__meta">
        <StatusBadge tone="default">{article.date}</StatusBadge>
        <StatusBadge tone="accent">{article.readTime}</StatusBadge>
      </div>
    </Link>
  );
}

function JournalArchiveRow({
  article,
  accent,
}: {
  article: (typeof journalArticles)[number];
  accent: "amber" | "cobalt" | "neutral";
}) {
  return (
    <Link
      href={`/journal/${article.slug}`}
      className={[
        "journal-archive-row",
        accent === "amber"
          ? "journal-archive-row--amber"
          : accent === "cobalt"
            ? "journal-archive-row--cobalt"
            : "journal-archive-row--neutral",
      ].join(" ")}
    >
      <div className="journal-archive-row__intro">
        <p className="eyebrow">{article.category}</p>
        <span>{article.date}</span>
      </div>

      <div className="journal-archive-row__content">
        <h3>{article.title}</h3>
        <p>{article.dek}</p>
      </div>

      <div className="journal-archive-row__points">
        {(article.summaryPoints ?? []).slice(0, 2).map((point) => (
          <Chip key={`${article.slug}-${point}`}>{point}</Chip>
        ))}
      </div>

      <div className="journal-archive-row__cta">
        <span>{article.readTime}</span>
        <strong>{article.cta?.label ?? "Read article"}</strong>
      </div>
    </Link>
  );
}

function ArchiveNote({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-[rgba(246,242,234,0.08)] pb-4 last:border-b-0 last:pb-0">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
        {label}
      </p>
      <p className="mt-2 text-sm leading-7 text-[color:var(--text-secondary)]">{value}</p>
    </div>
  );
}
