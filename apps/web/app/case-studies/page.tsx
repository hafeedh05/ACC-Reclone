import Link from "next/link";
import type { Metadata } from "next";
import {
  Chip,
  MarketingHeader,
  PageShell,
  SiteFooter,
} from "@/components/site-primitives";
import { EditorialMediaFrame, mediaForCaseStudy } from "@/components/media-system";
import { caseStudies } from "@/components/site-data";
import { createPublicPageMetadata } from "../seo";

export const metadata: Metadata = createPublicPageMetadata({
  title: "Case Studies",
  description:
    "Case studies showing the brief, constraints, workflow decisions, output family, and commercial outcome behind real campaign systems.",
  canonicalPath: "/case-studies",
});

export default function CaseStudiesPage() {
  const [featured, ...supporting] = caseStudies;

  return (
    <PageShell className="pb-16">
      <MarketingHeader />

      <section className="page-hero case-hero">
        <div className="case-hero__copy">
          <Chip tone="accent">Case studies</Chip>
          <h1 className="hero-title max-w-[8ch]">Case studies built around the actual launch decisions</h1>
          <p className="hero-body">
            Brief, constraints, workflow choices, approval logic, output structure, and what
            changed commercially all stay together so the page proves the system instead of
            summarizing it.
          </p>
          <div className="hero-proof-row">
            <span>{caseStudies.length} studies</span>
            <span>Before / after logic</span>
            <span>Outputs tied to outcomes</span>
          </div>
        </div>

        <FeaturedCaseBoard study={featured} />
      </section>

      <section className="case-system case-system--simple">
        <div className="case-system__list">
          {supporting.map((study, index) => (
            <CaseStudyRow
              key={study.slug}
              study={study}
              accent={index % 3 === 0 ? "amber" : index % 3 === 1 ? "cobalt" : "neutral"}
              reversed={index % 2 === 1}
            />
          ))}
        </div>
      </section>

      <SiteFooter />
    </PageShell>
  );
}

function FeaturedCaseBoard({ study }: { study: (typeof caseStudies)[number] }) {
  return (
    <Link href={`/case-studies/${study.slug}`} className="case-lead">
      <div className="case-lead__copy">
        <p className="eyebrow">{study.category}</p>
        <h2>{study.title}</h2>
        <p>{study.dek}</p>
        <div className="page-meta-line">
          <span>{study.date}</span>
          <span>{study.readTime}</span>
          <span>{study.author}</span>
        </div>

        <div className="case-lead__logic">
          <div>
            <span>Before</span>
            <p>{study.challenge}</p>
          </div>
          <div>
            <span>Workflow choice</span>
            <p>{(study.approach ?? [])[0] ?? ""}</p>
          </div>
          <div>
            <span>After</span>
            <p>{(study.outcomes ?? [])[0] ?? ""}</p>
          </div>
        </div>
      </div>

      <div className="case-lead__media">
        <EditorialMediaFrame
          asset={mediaForCaseStudy(study.slug)}
          aspect="landscape"
          className="case-lead__media-frame"
          sizes="(min-width: 1280px) 28vw, 100vw"
        />
      </div>
    </Link>
  );
}

function CaseStudyRow({
  study,
  accent,
  reversed,
}: {
  study: (typeof caseStudies)[number];
  accent: "amber" | "cobalt" | "neutral";
  reversed?: boolean;
}) {
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className={[
        "case-row",
        reversed ? "case-row--reverse" : "",
        accent === "amber"
          ? "case-row--amber"
          : accent === "cobalt"
            ? "case-row--cobalt"
            : "case-row--neutral",
      ].join(" ")}
    >
      <div className="case-row__visual">
        <EditorialMediaFrame
          asset={mediaForCaseStudy(study.slug)}
          aspect="landscape"
          className="case-row__visual-media"
          sizes="(min-width: 1280px) 28vw, 100vw"
        />
        <div className="case-row__visual-top">
          <p>{study.category}</p>
          <span>{study.metrics?.[0]?.value ?? "Case study"}</span>
        </div>
        <div className="case-row__band">
          <div>
            <span>Brief</span>
            <strong>{study.challenge}</strong>
          </div>
          <div>
            <span>What changed</span>
            <strong>{(study.outcomes ?? [])[0] ?? ""}</strong>
          </div>
        </div>
        <div className="case-row__outputs">
          {(study.outputs ?? []).slice(0, 3).map((output) => (
            <span key={`${study.slug}-${output}`}>{output}</span>
          ))}
        </div>
      </div>

      <div className="case-row__content">
        <div className="space-y-3">
          <p className="eyebrow">{study.category}</p>
          <h3>{study.title}</h3>
          <p>{study.dek}</p>
        </div>

        <div className="case-row__logic">
          <div>
            <span>Constraints</span>
            <p>{(study.constraints ?? []).join(" · ")}</p>
          </div>
          <div>
            <span>Workflow choice</span>
            <p>{(study.approach ?? [])[1] ?? (study.approach ?? [])[0] ?? ""}</p>
          </div>
          <div>
            <span>Why it mattered</span>
            <p>{(study.lessons ?? [])[0] ?? ""}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
