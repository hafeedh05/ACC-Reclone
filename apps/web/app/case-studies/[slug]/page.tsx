import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialMediaFrame, mediaForCaseStudy } from "@/components/media-system";
import { caseStudies, getCaseStudy } from "@/components/site-data";
import { absoluteUrl, breadcrumbJsonLd, buildJsonLd, createPublicPageMetadata } from "../../seo";
import { MarketingHeader, SiteFooter } from "@/components/site-primitives";

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
    <main className="aether-marketing-page aether-marketing-page--detail" id="main-content">
      <MarketingHeader active="case-studies" />
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

      <section className="aether-case-detail__hero">
        <div className="aether-case-detail__copy">
          <div className="aether-run-detail__eyebrow-row">
            <span>{study.category}</span>
            <span>{study.readTime}</span>
          </div>
          <Link href="/case-studies" className="aether-tier-link">
            Back to case studies
          </Link>
          <h1>{study.title}</h1>
          <p>{study.dek}</p>
        </div>
        <div className="aether-case-detail__media">
          <EditorialMediaFrame
            asset={mediaForCaseStudy(study.slug)}
            aspect="wide"
            className="aether-case-detail__frame"
            sizes="(min-width: 1024px) 54vw, 100vw"
            priority
          />
        </div>
      </section>

      <section className="aether-case-detail__compare">
        <article>
          <span>Before</span>
          <p>{study.challenge}</p>
        </article>
        <article>
          <span>After</span>
          <ul>
            {study.outcomes?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="aether-case-detail__body">
        <aside className="aether-case-detail__rail">
          {study.constraints?.length ? (
            <div className="aether-case-detail__rail-block">
              <p className="aether-kicker">Constraints</p>
              <ul>
                {study.constraints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {study.inputs?.length ? (
            <div className="aether-case-detail__rail-block">
              <p className="aether-kicker">Inputs</p>
              <ul>
                {study.inputs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {study.outputs?.length ? (
            <div className="aether-case-detail__rail-block">
              <p className="aether-kicker">Delivered</p>
              <ul>
                {study.outputs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>

        <div className="aether-case-detail__content">
          {study.approach?.length ? (
            <section className="aether-case-detail__approach">
              <div className="aether-case-detail__section-head">
                <span />
                <p>Workflow choices</p>
              </div>
              <div className="aether-case-detail__approach-list">
                {study.approach.map((item) => (
                  <article key={item}>
                    <p>{item}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {study.sections.map((section) => (
            <section key={section.heading}>
              <div className="aether-case-detail__section-head">
                <span />
                <p>{section.heading}</p>
              </div>
              <p>{section.body}</p>
            </section>
          ))}

          {study.lessons?.length ? (
            <section className="aether-case-detail__lessons">
              <div className="aether-case-detail__section-head">
                <span />
                <p>Reusable lessons</p>
              </div>
              <div className="aether-case-detail__lesson-grid">
                {study.lessons.map((lesson) => (
                  <article key={lesson}>
                    <p>{lesson}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {study.cta ? (
            <section className="aether-case-detail__cta">
              <p className="aether-kicker">{study.cta.eyebrow}</p>
              <h2>{study.cta.title}</h2>
              <p>{study.cta.body}</p>
              <Link href={study.cta.href} className="aether-btn aether-btn--primary">
                {study.cta.label}
              </Link>
            </section>
          ) : null}

          {relatedStudies.length ? (
            <section className="aether-case-detail__related">
              <div className="aether-case-detail__section-head">
                <span />
                <p>Related studies</p>
              </div>
              <div className="aether-archive__grid">
                {relatedStudies.slice(0, 3).map((item) => (
                  <Link key={item.slug} href={`/case-studies/${item.slug}`} className="aether-archive__card">
                    <EditorialMediaFrame
                      asset={mediaForCaseStudy(item.slug)}
                      aspect="portrait"
                      className="aether-archive__frame"
                      sizes="(min-width: 1024px) 22vw, 100vw"
                    />
                    <span>{item.date}</span>
                    <strong>{item.title}</strong>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
