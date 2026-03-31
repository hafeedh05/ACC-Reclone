import Link from "next/link";
import type { Metadata } from "next";
import { EditorialMediaFrame, mediaForCaseStudy } from "@/components/media-system";
import { caseStudies } from "@/components/site-data";
import { MarketingHeader, SiteFooter } from "@/components/site-primitives";
import { createPublicPageMetadata } from "../seo";

export const metadata: Metadata = createPublicPageMetadata({
  title: "Case Studies",
  description:
    "Commercial proof pages showing brief, constraints, workflow choices, outputs, and outcomes.",
  canonicalPath: "/case-studies",
});

export default function CaseStudiesPage() {
  const [featured, second, third, ...archive] = caseStudies;

  return (
    <main className="aether-marketing-page" id="main-content">
      <MarketingHeader active="case-studies" />

      <section className="aether-editorial-hero">
        <Link href={`/case-studies/${featured.slug}`} className="aether-editorial-hero__media">
          <EditorialMediaFrame
            asset={mediaForCaseStudy(featured.slug)}
            aspect="wide"
            className="aether-editorial-hero__frame"
            sizes="(min-width: 1024px) 62vw, 100vw"
          />
          <span>Feature / Commercial proof</span>
        </Link>
        <div className="aether-editorial-hero__copy">
          <p className="aether-kicker">Case study</p>
          <h1>{featured.title}</h1>
          <p>{featured.dek}</p>
          <Link href={`/case-studies/${featured.slug}`} className="aether-inline-link">
            Read study
          </Link>
        </div>
      </section>

      <section className="aether-editorial-column">
        <div className="aether-editorial-column__copy">
          <span className="aether-kicker">Before / after</span>
          <h2>{second.title}</h2>
          <p>{second.challenge}</p>
          <div className="aether-proof-list">
            <div>
              <span>Workflow choice</span>
              <strong>{second.approach?.[0]}</strong>
            </div>
            <div>
              <span>What changed</span>
              <strong>{second.outcomes?.[0]}</strong>
            </div>
          </div>
        </div>
        <Link href={`/case-studies/${second.slug}`} className="aether-editorial-column__media">
          <EditorialMediaFrame
            asset={mediaForCaseStudy(second.slug)}
            aspect="landscape"
            className="aether-editorial-column__frame"
            sizes="(min-width: 1024px) 42vw, 100vw"
          />
        </Link>
      </section>

      <section className="aether-editorial-band">
        <div className="aether-editorial-band__copy">
          <span className="aether-kicker">Study focus</span>
          <h2>{third.title}</h2>
          <div className="aether-editorial-band__columns">
            <p>{third.constraints?.join(" · ")}</p>
            <p>{third.lessons?.[0] ?? third.dek}</p>
          </div>
          <Link href={`/case-studies/${third.slug}`} className="aether-tier-link">
            Open proof page
          </Link>
        </div>
      </section>

      <section className="aether-archive">
        <div className="aether-archive__head">
          <div>
            <p className="aether-kicker">The archive</p>
            <h3>Previous studies.</h3>
          </div>
          <Link href="/sample-runs" className="aether-inline-link">
            Review sample runs
          </Link>
        </div>

        <div className="aether-archive__grid">
          {archive.slice(0, 3).map((study) => (
            <Link key={study.slug} href={`/case-studies/${study.slug}`} className="aether-archive__card">
              <EditorialMediaFrame
                asset={mediaForCaseStudy(study.slug)}
                aspect="portrait"
                className="aether-archive__frame"
                sizes="(min-width: 1024px) 22vw, 100vw"
              />
              <span>{study.date}</span>
              <strong>{study.title}</strong>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
