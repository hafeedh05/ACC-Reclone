import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialMediaFrame, mediaForRun } from "@/components/media-system";
import { getRelatedSampleRuns, getSampleRun, sampleRuns } from "@/components/site-data";
import { MarketingHeader, SiteFooter } from "@/components/site-primitives";
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
      description: "Campaign proof pages showing the run, the script, and the output family.",
      canonicalPath: "/sample-runs",
    });
  }

  return createPublicPageMetadata({
    title: run.title,
    description: run.brief,
    canonicalPath: `/sample-runs/${run.slug}`,
  });
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

  const related = getRelatedSampleRuns(run.slug).slice(0, 3);

  return (
    <main className="aether-marketing-page aether-marketing-page--detail" id="main-content">
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

      <MarketingHeader active="sample-runs" />

      <section className="aether-run-detail__header">
        <div className="aether-run-detail__header-copy">
          <div className="aether-run-detail__eyebrow-row">
            <span>{run.industry}</span>
            <span>Sample system</span>
          </div>
          <h1>{run.title}</h1>
          <p>{run.brief}</p>
        </div>
        <div className="aether-run-detail__actions">
          <Link href="/sample-runs" className="aether-btn aether-btn--secondary">
            Back to runs
          </Link>
          <Link href={run.ctaHref} className="aether-btn aether-btn--primary">
            {run.ctaLabel}
          </Link>
        </div>
      </section>

      <section className="aether-run-detail__hero">
        <div className="aether-run-detail__sidebar aether-run-detail__sidebar--context">
          <div className="aether-run-detail__sidebar-block">
            <h3>Campaign brief</h3>
            <p>{run.summary}</p>
          </div>
          <div className="aether-run-detail__sidebar-block">
            <h3>Goals</h3>
            <div className="aether-run-detail__pill-list">
              {run.selectedGoals.map((goal) => (
                <span key={goal}>{goal}</span>
              ))}
            </div>
          </div>
          <div className="aether-run-detail__sidebar-block">
            <h3>Approved outputs</h3>
            <div className="aether-run-detail__pill-list">
              {run.outputs.map((output) => (
                <span key={`${run.slug}-${output.name}`}>{output.aspect}</span>
              ))}
            </div>
          </div>
          <div className="aether-run-detail__sidebar-block">
            <h3>Source set</h3>
            <ul className="aether-run-detail__asset-list">
              {run.selectedAssets.map((asset) => (
                <li key={asset}>{asset}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="aether-run-detail__body">
          <article className="aether-run-detail__media-stage">
            <EditorialMediaFrame
              asset={mediaForRun(run.slug)}
              aspect="wide"
              className="aether-run-detail__media-stage-frame"
              motion
              priority
              sizes="(min-width: 1200px) 68vw, 100vw"
            />
            <div className="aether-run-detail__stage-pills">
              <span>{run.outputs[0]?.aspect}</span>
              <span>4K master</span>
            </div>
          </article>

          <div className="aether-run-detail__variants">
            <div className="aether-run-detail__variant">
              <h3>9:16 social vertical</h3>
              <EditorialMediaFrame
                asset={mediaForRun(run.slug)}
                aspect="portrait"
                className="aether-run-detail__variant-frame"
                sizes="(min-width: 1200px) 18vw, 50vw"
              />
            </div>
            <div className="aether-run-detail__variant">
              <h3>1:1 square feed</h3>
              <EditorialMediaFrame
                asset={mediaForRun(run.slug)}
                aspect="square"
                className="aether-run-detail__variant-frame"
                sizes="(min-width: 1200px) 18vw, 50vw"
              />
            </div>
            <div className="aether-run-detail__explorer">
              <h3>Variant explorer</h3>
              <p>Approved cuts sit side by side so pacing and emphasis are easy to compare.</p>
              <div className="aether-run-detail__explorer-list">
                {run.outputs.slice(0, 3).map((output, index) => (
                  <div
                    key={`${run.slug}-${output.name}`}
                    className={index === 0 ? "is-active" : undefined}
                  >
                    <span>{output.name}</span>
                    <em>{index === 0 ? "Active" : "Queued"}</em>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="aether-run-detail__script">
        <div className="aether-run-detail__script-head">
          <h2>Script & vision</h2>
          <p>Approved lines and storyboard cues stay on one surface.</p>
        </div>
        <div className="aether-run-detail__script-grid">
          <div className="aether-run-detail__script-copy">
            {run.approvedScript.slice(0, 2).map((line, index) => (
              <article key={line}>
                <span>Scene 0{index + 1}</span>
                <p>{line}</p>
              </article>
            ))}
          </div>
          <div className="aether-run-detail__storyboard-grid">
            {run.storyboard.slice(0, 4).map((frame) => (
              <article key={`${run.slug}-${frame.scene}`}>
                <EditorialMediaFrame
                  asset={mediaForRun(run.slug)}
                  aspect="landscape"
                  className="aether-run-detail__storyboard-frame"
                  sizes="(min-width: 1200px) 18vw, 50vw"
                />
                <div>
                  <span>Frame {frame.scene}</span>
                  <strong>{frame.overlay}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="aether-run-detail__related">
        <div className="aether-archive__head">
          <div>
            <p className="aether-kicker">Related runs</p>
            <h3>Keep exploring the output family.</h3>
          </div>
        </div>
        <div className="aether-archive__grid">
          {related.map((item) => (
            <Link key={item.slug} href={`/sample-runs/${item.slug}`} className="aether-archive__card">
              <EditorialMediaFrame
                asset={mediaForRun(item.slug)}
                aspect="portrait"
                className="aether-archive__frame"
                sizes="(min-width: 1024px) 22vw, 100vw"
              />
              <span>{item.industry}</span>
              <strong>{item.title}</strong>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
