import Link from "next/link";
import type { Metadata } from "next";
import {
  ButtonLink,
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
          <h1 className="hero-title max-w-[8ch]">
            Case studies built around the actual launch decisions
          </h1>
          <p className="hero-body">
            Brief, constraints, workflow choices, approval logic, output structure, and what
            changed commercially all stay together so the page proves the system instead of
            summarizing it.
          </p>
          <div className="page-meta-line">
            <span>{caseStudies.length} studies</span>
            <span>Before / after logic</span>
            <span>Outputs tied to outcomes</span>
          </div>
        </div>

        <FeaturedCaseBoard study={featured} />
      </section>

      <section className="case-system">
        <aside className="case-system__rail">
          <div className="case-rail-panel">
            <p className="eyebrow">What strong studies answer</p>
            <div className="mt-5 space-y-4">
              <ArchiveNote
                label="Constraints"
                value="What the team did not have matters as much as what they shipped."
              />
              <ArchiveNote
                label="Workflow choices"
                value="Where approvals happened changed the quality and pace of the final package."
              />
              <ArchiveNote
                label="Commercial effect"
                value="The strongest studies show why the final handoff mattered after review."
              />
            </div>
          </div>

          <div className="case-rail-panel">
            <p className="eyebrow">Next step</p>
            <div className="mt-5 grid gap-3">
              <ButtonLink href="/sample-runs" variant="primary">
                Compare against sample runs
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Talk through a similar launch
              </ButtonLink>
            </div>
          </div>
        </aside>

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
        <div className="case-lead__chips">
          {(study.constraints ?? []).slice(0, 3).map((item) => (
            <span key={`${study.slug}-${item}`}>{item}</span>
          ))}
        </div>
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

      <div className="case-lead__sidebar">
        {(study.metrics ?? []).slice(0, 3).map((metric, index) => (
          <article
            key={metric.label}
            className={["case-metric", index === 0 ? "case-metric--accent" : ""].join(" ")}
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
