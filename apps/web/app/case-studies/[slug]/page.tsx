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
import { caseStudies, getCaseStudy } from "@/components/site-data";
import { absoluteUrl, breadcrumbJsonLd, buildJsonLd, createPublicPageMetadata } from "../../seo";

function toAnchorId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) {
    return createPublicPageMetadata({
      title: "Case Studies",
      description: "Detailed case studies for campaign system design and output strategy.",
      canonicalPath: "/case-studies",
    });
  }

  return createPublicPageMetadata({
    title: study.title,
    description: study.dek,
    canonicalPath: `/case-studies/${study.slug}`,
  });
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) {
    notFound();
  }

  const toc = study.sections.map((section) => ({
    id: toAnchorId(section.heading),
    heading: section.heading,
  }));

  const relatedStudies = (study.relatedSlugs ?? [])
    .map((relatedSlug) => getCaseStudy(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.dek,
    datePublished: study.date,
    articleSection: study.category,
    author: {
      "@type": "Organization",
      name: study.author,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/case-studies/${study.slug}`),
    },
  };

  return (
    <PageShell className="pb-16">
      <MarketingHeader />
      <Script
        id={`case-study-jsonld-${study.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        id={`case-study-breadcrumbs-${study.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: buildJsonLd(
            breadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Case Studies", url: "/case-studies" },
              { name: study.title, url: `/case-studies/${study.slug}` },
            ]),
          ),
        }}
      />

      <section className="page-hero">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <SectionIntro eyebrow={study.category} title={study.title} body={study.dek} />
          <div className="space-y-3">
            <div className="rail-panel">
              <p className="eyebrow">Case study</p>
              <p className="text-sm leading-7 text-[color:var(--text-secondary)]">
                {study.author}
                <br />
                {study.date}
                <br />
                {study.readTime}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge tone="success">Commercial proof</StatusBadge>
              <StatusBadge tone="accent">Workflow detail</StatusBadge>
              <StatusBadge tone="default">Output logic</StatusBadge>
            </div>
          </div>
        </div>
      </section>

      {study.summaryPoints ? (
        <section className="grid gap-4 lg:grid-cols-3">
          {study.summaryPoints.map((point) => (
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

      {study.metrics ? (
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {study.metrics.map((metric) => (
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

      {study.challenge || study.outcomes?.length ? (
        <section className="mt-10 grid gap-4 lg:grid-cols-2">
          {study.challenge ? (
            <div className="rounded-[32px] border border-[color:var(--border-default)] bg-[color:var(--surface)] p-6">
              <p className="eyebrow">Before</p>
              <p className="mt-3 text-2xl leading-[1.15] tracking-[-0.04em] text-[color:var(--text-primary)]">
                {study.challenge}
              </p>
            </div>
          ) : null}
          {study.outcomes?.length ? (
            <div className="rounded-[32px] border border-[color:var(--border-default)] bg-[color:var(--surface)] p-6">
              <p className="eyebrow">After</p>
              <ul className="mt-3 space-y-3">
                {study.outcomes.map((item) => (
                  <li key={item} className="text-lg leading-8 text-[color:var(--text-primary)]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      <ProseBlock
        aside={
          <div className="space-y-4">
            <div className="rail-panel">
              <p className="eyebrow">Brief</p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
                {study.challenge ?? study.dek}
              </p>
            </div>
            {study.constraints?.length ? (
              <div className="rail-panel">
                <p className="eyebrow">Constraints</p>
                <ul className="mt-3 space-y-3">
                  {study.constraints.map((item) => (
                    <li key={item} className="text-sm leading-7 text-[color:var(--text-secondary)]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {study.inputs?.length ? (
              <div className="rail-panel">
                <p className="eyebrow">Inputs</p>
                <ul className="mt-3 space-y-3">
                  {study.inputs.map((item) => (
                    <li key={item} className="text-sm leading-7 text-[color:var(--text-secondary)]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
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
            {study.outputs?.length ? (
              <div className="rail-panel">
                <p className="eyebrow">Outputs</p>
                <ul className="mt-3 space-y-3">
                  {study.outputs.map((item) => (
                    <li key={item} className="text-sm leading-7 text-[color:var(--text-secondary)]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        }
      >
        <section className="space-y-6">
          {study.sections.map((section) => (
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

        {study.approach?.length ? (
          <section className="mt-12 rounded-[32px] border border-[color:var(--border-default)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow-soft)]">
            <div className="space-y-4">
              <p className="eyebrow">Creative approach</p>
              <ul className="space-y-3">
                {study.approach.map((item) => (
                  <li key={item} className="text-lg leading-8 text-[color:var(--text-primary)]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {study.lessons?.length ? (
          <section className="mt-12 space-y-6">
            <EditorialDivider label="Reusable lessons" detail="What carries to the next campaign" />
            <div className="grid gap-4 md:grid-cols-3">
              {study.lessons.map((lesson) => (
                <div
                  key={lesson}
                  className="rounded-[28px] border border-[color:var(--border-subtle)] bg-[color:var(--surface)] p-5"
                >
                  <p className="eyebrow">Lesson</p>
                  <p className="mt-3 text-lg leading-8 text-[color:var(--text-primary)]">{lesson}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {study.cta ? (
          <section className="mt-14 rounded-[32px] border border-[color:var(--border-default)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow-soft)]">
            <div className="space-y-4">
              <p className="eyebrow">{study.cta.eyebrow}</p>
              <h2 className="text-3xl leading-[1.05] tracking-[-0.045em]">{study.cta.title}</h2>
              <p className="max-w-3xl text-[color:var(--text-secondary)] leading-8">
                {study.cta.body}
              </p>
              <ButtonLink href={study.cta.href} variant="primary">
                {study.cta.label}
              </ButtonLink>
            </div>
          </section>
        ) : null}

        {relatedStudies.length ? (
          <section className="mt-14 space-y-6">
            <EditorialDivider label="Related studies" detail="Continue the proof chain" />
            <div className="grid gap-4 md:grid-cols-3">
              {relatedStudies.slice(0, 3).map((item) => (
                <Link
                  key={item.slug}
                  href={`/case-studies/${item.slug}`}
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
            <p className="eyebrow">Case studies</p>
            <h2 className="text-3xl leading-[1.05] tracking-[-0.045em]">
              Proof should explain the production logic, not just celebrate the output.
            </h2>
            <p className="max-w-3xl text-[color:var(--text-secondary)] leading-8">
              The case study layer is built to show constraints, choices, and outcomes with enough
              detail to support a real sales conversation.
            </p>
          </div>
          <ButtonLink href="/journal" variant="secondary">
            Read journal notes
          </ButtonLink>
        </div>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
