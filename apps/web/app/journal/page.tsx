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
          <h1 className="hero-title max-w-[8ch]">Editorial depth for teams improving campaign systems</h1>
          <p className="hero-body">
            Essays, field notes, and operating lessons for teams shaping briefs, reviewing
            storyboards, packaging output families, and keeping campaign production coherent
            after handoff.
          </p>
          <div className="hero-proof-row">
            <span>{journalArticles.length} articles</span>
            <span>Essays, notes, how-tos</span>
            <span>Linked to runs and studies</span>
          </div>
        </div>

        <FeaturedJournalBoard article={featured} />
      </section>

      <section className="journal-grid journal-grid--simple">
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
