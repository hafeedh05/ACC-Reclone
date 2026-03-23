import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ButtonLink,
  Chip,
  EditorialDivider,
  MarketingHeader,
  PageShell,
  SectionIntro,
  SiteFooter,
  StatusBadge,
} from "@/components/site-primitives";
import { EditorialMediaFrame, mediaForRun } from "@/components/media-system";
import { getRelatedSampleRuns, getSampleRun, sampleRuns } from "@/components/site-data";
import { breadcrumbJsonLd, buildJsonLd, createPublicPageMetadata } from "../../seo";

export function generateStaticParams() {
  return sampleRuns.map((run) => ({ slug: run.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const run = getSampleRun(slug);

  if (!run) {
    return createPublicPageMetadata({
      title: "Sample Runs",
      description:
        "Explore sample runs that show how briefs, approvals, and output families become campaign-ready ad variants.",
      canonicalPath: "/sample-runs",
    });
  }

  return createPublicPageMetadata({
    title: run.title,
    description: run.brief,
    canonicalPath: `/sample-runs/${run.slug}`,
  });
}

function RelatedRunCard({
  slug,
  title,
  industry,
  summary,
}: {
  slug: string;
  title: string;
  industry: string;
  summary: string;
}) {
  return (
    <Link href={`/sample-runs/${slug}`} className="sample-run-related">
      <p className="eyebrow">{industry}</p>
      <h3>{title}</h3>
      <p>{summary}</p>
    </Link>
  );
}

export default async function SampleRunDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const run = getSampleRun(slug);

  if (!run) {
    notFound();
  }

  const relatedRuns = getRelatedSampleRuns(run.slug).slice(0, 3);
  const leadOutput = run.outputs[0];

  return (
    <PageShell className="pb-16">
      <Script
        id={`sample-run-breadcrumbs-${run.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: buildJsonLd(
            breadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Sample Runs", url: "/sample-runs" },
              { name: run.title, url: `/sample-runs/${run.slug}` },
            ]),
          ),
        }}
      />
      <MarketingHeader />

      <section className="sample-run-detail-hero">
        <div className="sample-run-detail-hero__copy">
          <SectionIntro eyebrow={run.industry} title={run.title} body={run.brief} />
          <div className="sample-run-detail-hero__proof">
            <Chip tone="accent">{run.outputs.length} cuts</Chip>
            <Chip>{run.selectedGoals[0]}</Chip>
            <Chip tone="cobalt">{leadOutput.aspect}</Chip>
          </div>
          <div className="hero-actions">
            <ButtonLink href={run.ctaHref} variant="primary">
              {run.ctaLabel}
            </ButtonLink>
            <ButtonLink href="/sample-runs" variant="secondary">
              Back to sample runs
            </ButtonLink>
          </div>
        </div>

        <article className="sample-run-detail-stage">
          <EditorialMediaFrame
            asset={mediaForRun(run.slug)}
            aspect="landscape"
            className="sample-run-detail-stage__media"
            motion
            priority
            sizes="(min-width: 1280px) 54vw, 100vw"
          />
          <div className="sample-run-detail-stage__header">
            <p className="eyebrow">Lead cut</p>
            <strong>{leadOutput.name}</strong>
            <span>{leadOutput.aspect}</span>
          </div>
          <div className="sample-run-detail-stage__caption">
            <h2>{run.summary}</h2>
            <p>{run.concept}</p>
          </div>
          <div className="sample-run-detail-stage__family">
            {run.outputs.slice(0, 3).map((output, index) => (
              <article key={`${run.slug}-${output.name}`} className="sample-run-detail-stage__family-item">
                <span>{output.aspect}</span>
                <strong>{output.name}</strong>
                <b>{index === 0 ? "Live" : index === 1 ? "Ready" : "Queued"}</b>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="sample-run-detail-layout">
        <aside className="sample-run-detail-rail">
          <div className="sample-run-detail-rail__section">
            <p className="eyebrow">Brief</p>
            <strong>{run.concept}</strong>
            <p>The proof stays visible while the approval logic remains secondary.</p>
          </div>

          <div className="sample-run-detail-rail__section">
            <p className="eyebrow">Source set</p>
            <div className="sample-run-detail-asset-list">
              {run.selectedAssets.map((asset, index) => (
                <article key={asset}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{asset}</strong>
                    <p>{index === 0 ? "Lead frame" : index === 1 ? "Support frame" : "Coverage"}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="sample-run-detail-rail__section">
            <p className="eyebrow">Approvals</p>
            <div className="sample-run-detail-approval-row">
              <StatusBadge tone="success">Script approved</StatusBadge>
              <StatusBadge tone="success">Storyboard approved</StatusBadge>
            </div>
            <div className="sample-run-detail-approval-row">
              {run.outputs.map((output) => (
                <Chip key={`${run.slug}-${output.name}`} tone="cobalt">
                  {output.aspect}
                </Chip>
              ))}
            </div>
          </div>

          <div className="sample-run-detail-rail__section">
            <p className="eyebrow">Use this pattern</p>
            <p>Lift the structure, not just the category. The sequence works because the proof arrives before the close.</p>
            <ButtonLink href={run.ctaHref} variant="primary">
              {run.ctaLabel}
            </ButtonLink>
          </div>
        </aside>

        <div className="sample-run-detail-body">
          <section className="sample-run-detail-script">
            <div className="sample-run-detail-section-head">
              <div>
                <p className="eyebrow">Approved script</p>
                <h2>Three lines, locked before anything expensive starts moving.</h2>
              </div>
              <StatusBadge tone="success">Approved</StatusBadge>
            </div>

            <ol className="sample-run-detail-script__list">
              {run.approvedScript.map((line, index) => (
                <li key={line}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{line}</p>
                </li>
              ))}
            </ol>
          </section>

          <EditorialDivider label="Storyboard" detail="Scene order and overlay logic" />

          <section className="sample-run-storyboard">
            <div className="sample-run-storyboard__visual">
              <EditorialMediaFrame
                asset={mediaForRun(run.slug)}
                aspect="landscape"
                className="sample-run-storyboard__media"
                sizes="(min-width: 1280px) 44vw, 100vw"
              />
              <div className="sample-run-storyboard__overlay">
                <p className="eyebrow">Scene focus</p>
                <strong>
                  Scene {run.storyboard[0]?.scene} routes the visual tone for the whole output family.
                </strong>
              </div>
            </div>

            <div className="sample-run-storyboard__list">
              {run.storyboard.map((frame) => (
                <article key={`${run.slug}-${frame.scene}`} className="sample-run-storyboard__item">
                  <div>
                    <p className="eyebrow">Scene {frame.scene}</p>
                    <strong>{frame.overlay}</strong>
                  </div>
                  <p>{frame.note}</p>
                </article>
              ))}
            </div>
          </section>

          <EditorialDivider label="Run progression" detail="Readable all the way through delivery" />

          <section className="sample-run-stage-strip">
            {run.stages.map((stage, index) => (
              <article key={stage.name} className="sample-run-stage-strip__item">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p>{stage.name}</p>
                  <strong>{stage.note}</strong>
                </div>
                <StatusBadge tone={stage.status === "Delivered" ? "success" : "accent"}>
                  {stage.status}
                </StatusBadge>
              </article>
            ))}
          </section>

          <EditorialDivider label="Output family" detail="One clip pool, four usable exports" />

          <section className="sample-run-output-strip">
            {run.outputs.map((output, index) => (
              <article key={`${run.slug}-${output.name}`} className={index === 0 ? "is-lead" : ""}>
                <div className="sample-run-output-strip__top">
                  <p>{output.aspect}</p>
                  <StatusBadge tone={index === 0 ? "accent" : "default"}>
                    {index === 0 ? "Lead" : "Export"}
                  </StatusBadge>
                </div>
                <strong>{output.name}</strong>
                <span>{output.note}</span>
                <b>{output.assetLabel}</b>
              </article>
            ))}
          </section>

          <EditorialDivider label="Related runs" detail="Adjacent proof" />

          <section className="sample-run-related-strip">
            {relatedRuns.map((item) => (
              <RelatedRunCard
                key={item.slug}
                slug={item.slug}
                title={item.title}
                industry={item.industry}
                summary={item.summary}
              />
            ))}
          </section>
        </div>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
