import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ButtonLink,
  EditorialDivider,
  MarketingHeader,
  PageShell,
  ProseBlock,
  SectionIntro,
  SiteFooter,
  StatusBadge,
} from "@/components/site-primitives";
import { getJournalArticle, journalArticles } from "@/components/site-data";
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
    <PageShell className="pb-16">
      <MarketingHeader />
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

      <section className="page-hero">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <SectionIntro eyebrow={article.category} title={article.title} body={article.dek} />
          <div className="space-y-3">
            <div className="rail-panel">
              <p className="eyebrow">Article</p>
              <p className="text-sm leading-7 text-[color:var(--text-secondary)]">
                {article.author}
                <br />
                {article.date}
                <br />
                {article.readTime}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge tone="default">Editorial note</StatusBadge>
              <StatusBadge tone="accent">Search depth</StatusBadge>
              <StatusBadge tone="success">Commercial angle</StatusBadge>
            </div>
          </div>
        </div>
      </section>

      {article.summaryPoints ? (
        <section className="grid gap-4 lg:grid-cols-3">
          {article.summaryPoints.map((point) => (
            <div
              key={point}
              className="rounded-[28px] border border-[color:var(--border-subtle)] bg-[color:var(--surface)] p-5"
            >
              <p className="eyebrow">Key point</p>
              <p className="mt-3 text-lg leading-8 text-[color:var(--text-primary)]">{point}</p>
            </div>
          ))}
        </section>
      ) : null}

      {article.metrics ? (
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {article.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-[28px] border border-[color:var(--border-default)] bg-[color:var(--surface)] p-5"
            >
              <p className="eyebrow">{metric.label}</p>
              <div className="mt-3 text-3xl tracking-[-0.04em]">{metric.value}</div>
              <p className="mt-2 text-sm leading-7 text-[color:var(--text-secondary)]">
                {metric.note}
              </p>
            </div>
          ))}
        </section>
      ) : null}

      <ProseBlock
        aside={
          <div className="space-y-4">
            <div className="rail-panel">
              <p className="eyebrow">Metadata</p>
              <div className="mt-3 space-y-2 text-sm leading-7 text-[color:var(--text-secondary)]">
                <div>{article.author}</div>
                <div>{article.date}</div>
                <div>{article.readTime}</div>
              </div>
            </div>
            <div className="rail-panel">
              <p className="eyebrow">Contents</p>
              <nav className="mt-3 space-y-3">
                {toc.map((entry) => (
                  <a
                    key={entry.id}
                    href={`#${entry.id}`}
                    className="block text-sm leading-7 text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-primary)]"
                  >
                    {entry.heading}
                  </a>
                ))}
              </nav>
            </div>
            {relatedArticles.length ? (
              <div className="rail-panel">
                <p className="eyebrow">Related reading</p>
                <div className="mt-3 space-y-3">
                  {relatedArticles.slice(0, 3).map((item) => (
                    <Link
                      key={item.slug}
                      href={`/journal/${item.slug}`}
                      className="block rounded-[20px] border border-[color:var(--border-subtle)] px-4 py-3 transition-colors hover:bg-[color:var(--surface-raised)]"
                    >
                      <p className="text-sm font-medium text-[color:var(--text-primary)]">{item.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                        {item.category}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        }
      >
        <section className="space-y-6">
          {article.sections.map((section) => (
            <section
              key={section.heading}
              id={toAnchorId(section.heading)}
              className="article-section scroll-mt-28"
            >
              <EditorialDivider label={section.heading} />
              <p>{section.body}</p>
            </section>
          ))}
        </section>

        {article.cta ? (
          <section className="mt-14 rounded-[32px] border border-[color:var(--border-default)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow-soft)]">
            <div className="space-y-4">
              <p className="eyebrow">{article.cta.eyebrow}</p>
              <h2 className="text-3xl leading-[1.05] tracking-[-0.045em]">{article.cta.title}</h2>
              <p className="max-w-3xl text-[color:var(--text-secondary)] leading-8">
                {article.cta.body}
              </p>
              <ButtonLink href={article.cta.href} variant="primary">
                {article.cta.label}
              </ButtonLink>
            </div>
          </section>
        ) : null}

        {relatedArticles.length ? (
          <section className="mt-14 space-y-6">
            <EditorialDivider label="Related reading" detail="Continue the editorial path" />
            <div className="grid gap-4 md:grid-cols-3">
              {relatedArticles.slice(0, 3).map((item) => (
                <Link
                  key={item.slug}
                  href={`/journal/${item.slug}`}
                  className="group rounded-[28px] border border-[color:var(--border-subtle)] bg-[color:var(--surface)] p-5 transition-transform duration-200 hover:-translate-y-1"
                >
                  <p className="eyebrow">{item.category}</p>
                  <h3 className="mt-3 text-2xl leading-[1.05] tracking-[-0.035em]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
                    {item.dek}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </ProseBlock>

      <section className="mt-16 rounded-[32px] border border-[color:var(--border-default)] bg-[color:var(--surface)] px-6 py-8 shadow-[var(--shadow-soft)] sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="space-y-3">
            <p className="eyebrow">Journal</p>
            <h2 className="text-3xl leading-[1.05] tracking-[-0.045em]">
              This note belongs to the production system, not just the content layer.
            </h2>
            <p className="max-w-3xl text-[color:var(--text-secondary)] leading-8">
              The journal is designed to rank, support handoff, and make the product story easier
              to trust.
            </p>
          </div>
          <ButtonLink href="/case-studies" variant="secondary">
            Read case studies
          </ButtonLink>
        </div>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
