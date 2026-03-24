import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialMediaFrame, mediaForJournal } from "@/components/media-system";
import { getJournalArticle, journalArticles } from "@/components/site-data";
import { MarketingHeader, SiteFooter } from "@/components/site-primitives";
import { absoluteUrl, breadcrumbJsonLd, buildJsonLd, createPublicPageMetadata } from "../../seo";

function toAnchorId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function generateStaticParams() {
  return journalArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getJournalArticle(slug);

  if (!article) {
    return createPublicPageMetadata({
      title: "Journal",
      description: "Campaign systems, workflow notes, and production guidance.",
      canonicalPath: "/journal",
    });
  }

  return createPublicPageMetadata({
    title: article.title,
    description: article.dek,
    canonicalPath: `/journal/${article.slug}`,
  });
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getJournalArticle(slug);

  if (!article) {
    notFound();
  }

  const toc = article.sections.map((section) => ({
    id: toAnchorId(section.heading),
    heading: section.heading,
  }));

  const relatedArticles = (article.relatedSlugs ?? [])
    .map((relatedSlug) => getJournalArticle(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.dek,
    datePublished: article.date,
    author: {
      "@type": "Organization",
      name: article.author,
    },
    articleSection: article.category,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/journal/${article.slug}`),
    },
  };

  return (
    <main className="aether-marketing-page aether-marketing-page--detail" id="main-content">
      <MarketingHeader active="journal" />
      <Script
        id={`journal-jsonld-${article.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        id={`journal-breadcrumbs-${article.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: buildJsonLd(
            breadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Journal", url: "/journal" },
              { name: article.title, url: `/journal/${article.slug}` },
            ]),
          ),
        }}
      />

      <section className="aether-article-detail__hero">
        <div className="aether-article-detail__hero-copy">
          <div className="aether-run-detail__eyebrow-row">
            <span>{article.category}</span>
            <span>{article.readTime}</span>
          </div>
          <Link href="/journal" className="aether-tier-link">
            Back to journal
          </Link>
          <h1>{article.title}</h1>
          <p>{article.dek}</p>
          <div className="aether-article-detail__meta">
            <span>{article.author}</span>
            <span>{article.date}</span>
          </div>
        </div>
        <div className="aether-article-detail__hero-media">
          <EditorialMediaFrame
            asset={mediaForJournal(article.slug)}
            aspect="wide"
            className="aether-article-detail__hero-frame"
            sizes="(min-width: 1024px) 54vw, 100vw"
            priority
          />
        </div>
      </section>

      {article.summaryPoints?.length ? (
        <section className="aether-article-detail__summary">
          {article.summaryPoints.map((point) => (
            <article key={point}>
              <span>Key point</span>
              <p>{point}</p>
            </article>
          ))}
        </section>
      ) : null}

      <section className="aether-article-detail__body">
        <aside className="aether-article-detail__rail">
          <div className="aether-article-detail__rail-block">
            <p className="aether-kicker">Contents</p>
            <nav>
              {toc.map((entry) => (
                <a key={entry.id} href={`#${entry.id}`}>
                  {entry.heading}
                </a>
              ))}
            </nav>
          </div>

          {article.metrics?.length ? (
            <div className="aether-article-detail__rail-block">
              <p className="aether-kicker">Signals</p>
              <div className="aether-article-detail__metric-list">
                {article.metrics.map((metric) => (
                  <div key={metric.label}>
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {relatedArticles.length ? (
            <div className="aether-article-detail__rail-block">
              <p className="aether-kicker">Related</p>
              <div className="aether-article-detail__related-list">
                {relatedArticles.slice(0, 3).map((item) => (
                  <Link key={item.slug} href={`/journal/${item.slug}`}>
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </aside>

        <div className="aether-article-detail__content">
          {article.sections.map((section) => (
            <section key={section.heading} id={toAnchorId(section.heading)}>
              <div className="aether-article-detail__section-head">
                <span />
                <p>{section.heading}</p>
              </div>
              <p>{section.body}</p>
            </section>
          ))}

          {article.cta ? (
            <section className="aether-article-detail__cta">
              <p className="aether-kicker">{article.cta.eyebrow}</p>
              <h2>{article.cta.title}</h2>
              <p>{article.cta.body}</p>
              <Link href={article.cta.href} className="aether-btn aether-btn--primary">
                {article.cta.label}
              </Link>
            </section>
          ) : null}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
