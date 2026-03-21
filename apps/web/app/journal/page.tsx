import Link from "next/link";
import type { Metadata } from "next";
import {
  ButtonLink,
  Chip,
  MarketingHeader,
  PageShell,
  SiteFooter,
} from "@/components/site-primitives";
import { EditorialMediaFrame, mediaForJournal } from "@/components/media-system";
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
          <div className="page-meta-line">
            {topicLabels.map((item, index) => (
              <span key={item} className={index === 0 ? "text-[color:var(--text-primary)]" : undefined}>
                {item}
              </span>
            ))}
          </div>
          <div className="page-meta-line">
            <span>{journalArticles.length} articles</span>
            <span>Essays, notes, and systems views</span>
            <span>Linked to runs and case studies</span>
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
              Essays, notes, and sharp how-tos in one editorial system.
            </h2>
            <p className="max-w-3xl text-base leading-8 text-[color:var(--text-secondary)]">
              Some pieces carry the broader operating argument. Others solve one production problem
              cleanly. The archive should feel readable, varied, and useful.
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
            <span key={point}>{point}</span>
          ))}
        </div>
        <div className="page-meta-line">
          <span>{article.date}</span>
          <span>{article.readTime}</span>
          <span>{article.author}</span>
        </div>
      </div>

      <div className="journal-lead__media">
        <EditorialMediaFrame
          asset={mediaForJournal(article.slug)}
          aspect="landscape"
          className="journal-lead__media-frame"
          sizes="(min-width: 1280px) 26vw, 100vw"
        />
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
      <EditorialMediaFrame
        asset={mediaForJournal(article.slug)}
        aspect="wide"
        className="journal-essay__media"
        sizes="(min-width: 1280px) 48vw, 100vw"
      />
      <div className="journal-essay__top">
        <div>
          <p className="eyebrow">{article.category}</p>
          <h2>{article.title}</h2>
        </div>
        <span className="journal-meta-pill">{article.readTime}</span>
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
      <EditorialMediaFrame
        asset={mediaForJournal(article.slug)}
        aspect="landscape"
        className="journal-note__media"
        sizes="(min-width: 1280px) 22vw, 100vw"
      />
      <p className="eyebrow">{article.category}</p>
      <h3>{article.title}</h3>
      <p>{article.dek}</p>
      <div className="page-meta-line">
        <span>{article.date}</span>
        <span>{article.readTime}</span>
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
      <div className="journal-archive-row__media">
        <EditorialMediaFrame
          asset={mediaForJournal(article.slug)}
          aspect="landscape"
          className="journal-archive-row__media-frame"
          sizes="(min-width: 1280px) 22vw, 100vw"
        />
      </div>
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
          <span key={`${article.slug}-${point}`}>{point}</span>
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
