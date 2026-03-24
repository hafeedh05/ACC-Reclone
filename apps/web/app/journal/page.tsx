import Link from "next/link";
import type { Metadata } from "next";
import { EditorialMediaFrame, mediaForJournal } from "@/components/media-system";
import { journalArticles } from "@/components/site-data";
import { MarketingHeader, SiteFooter } from "@/components/site-primitives";
import { createPublicPageMetadata } from "../seo";

export const metadata: Metadata = createPublicPageMetadata({
  title: "Journal",
  description:
    "Operating notes on campaign systems, review logic, storyboard approvals, and output design.",
  canonicalPath: "/journal",
});

export default function JournalIndexPage() {
  const [featured, second, third, ...archive] = journalArticles;

  return (
    <main className="aether-marketing-page" id="main-content">
      <MarketingHeader active="journal" />

      <section className="aether-editorial-hero">
        <Link href={`/journal/${featured.slug}`} className="aether-editorial-hero__media">
          <EditorialMediaFrame
            asset={mediaForJournal(featured.slug)}
            aspect="wide"
            className="aether-editorial-hero__frame"
            sizes="(min-width: 1024px) 62vw, 100vw"
          />
          <span>Feature / Workflow systems</span>
        </Link>
        <div className="aether-editorial-hero__copy">
          <p className="aether-kicker">Journal</p>
          <h1>{featured.title}</h1>
          <p>{featured.dek}</p>
          <Link href={`/journal/${featured.slug}`} className="aether-inline-link">
            Read story
          </Link>
        </div>
      </section>

      <section className="aether-editorial-column">
        <div className="aether-editorial-column__copy">
          <span className="aether-kicker">Case note</span>
          <h2>{second.title}</h2>
          <p>{second.dek}</p>
          <div className="aether-editorial-author">
            <div />
            <div>
              <strong>{second.author}</strong>
              <span>{second.category}</span>
            </div>
          </div>
        </div>
        <div className="aether-editorial-column__stack">
          <Link href={`/journal/${second.slug}`} className="aether-tier-link">
            Read case note
          </Link>
          <Link href={`/journal/${second.slug}`} className="aether-editorial-column__media">
            <EditorialMediaFrame
              asset={mediaForJournal(second.slug)}
              aspect="landscape"
              className="aether-editorial-column__frame"
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
          </Link>
        </div>
      </section>

      <section className="aether-editorial-band">
        <div className="aether-editorial-band__copy">
          <span className="aether-kicker">Journal entry</span>
          <h2>{third.title}</h2>
          <div className="aether-editorial-band__columns">
            <p>{third.summaryPoints?.[0] ?? third.dek}</p>
            <p>{third.summaryPoints?.[1] ?? third.dek}</p>
          </div>
          <Link href={`/journal/${third.slug}`} className="aether-tier-link">
            Read full thesis
          </Link>
        </div>
      </section>

      <section className="aether-archive">
        <div className="aether-archive__head">
          <div>
            <p className="aether-kicker">The archive</p>
            <h3>Previous editions.</h3>
          </div>
          <Link href="/case-studies" className="aether-inline-link">
            View case studies
          </Link>
        </div>

        <div className="aether-archive__grid">
          {archive.map((article) => (
            <Link key={article.slug} href={`/journal/${article.slug}`} className="aether-archive__card">
              <EditorialMediaFrame
                asset={mediaForJournal(article.slug)}
                aspect="portrait"
                className="aether-archive__frame"
                sizes="(min-width: 1024px) 22vw, 100vw"
              />
              <span>{article.date}</span>
              <strong>{article.title}</strong>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
