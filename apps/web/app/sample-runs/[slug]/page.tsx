import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BrowserMockup,
  ButtonLink,
  Chip,
  EditorialDivider,
  MarketingHeader,
  PageShell,
  ProseBlock,
  SectionIntro,
  SiteFooter,
  StatusBadge,
} from "@/components/site-primitives";
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

function RunVisual({ title, summary, assets }: { title: string; summary: string; assets: string[] }) {
  return (
    <BrowserMockup
      left={
        <div className="space-y-4">
          <div className="rounded-[24px] border border-[color:var(--border-default)] bg-[rgba(246,242,234,0.03)] p-5 shadow-[var(--shadow-soft)]">
            <p className="eyebrow">Run brief</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--text-primary)]">
              {title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">{summary}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {assets.map((asset, index) => (
              <div
                key={asset}
                className={[
                  "min-h-[108px] rounded-[22px] border border-[color:var(--border-default)] p-4 shadow-[var(--shadow-soft)]",
                  index === 0
                    ? "bg-[linear-gradient(180deg,rgba(212,154,90,0.16),rgba(17,20,24,0.96))]"
                    : index === 1
                      ? "bg-[linear-gradient(180deg,rgba(94,114,155,0.18),rgba(17,20,24,0.96))]"
                      : "bg-[rgba(246,242,234,0.04)]",
                ].join(" ")}
              >
                <p className="eyebrow">Selected asset</p>
                <p className="mt-3 text-lg font-medium tracking-[-0.03em] text-[color:var(--text-primary)]">
                  {asset}
                </p>
              </div>
            ))}
          </div>
        </div>
      }
      right={
        <div className="space-y-4">
          <div className="rounded-[24px] border border-[color:var(--border-default)] bg-[rgba(246,242,234,0.03)] p-5 shadow-[var(--shadow-soft)]">
            <p className="eyebrow">Approved script</p>
            <div className="mt-4 space-y-3">
              {[
                "Open on the strongest visual proof.",
                "Keep the promise to one clear sentence.",
                "Close with the exact action the team wants.",
              ].map((line, index) => (
                <div
                  key={line}
                  className="rounded-[18px] border border-[color:var(--border-subtle)] bg-[rgba(246,242,234,0.02)] px-4 py-3"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-soft)]">
                    0{index + 1}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--text-secondary)]">{line}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-[color:var(--border-default)] bg-[rgba(246,242,234,0.03)] p-5 shadow-[var(--shadow-soft)]">
            <p className="eyebrow">Output family</p>
            <div className="mt-4 space-y-3">
              {[
                { aspect: "9:16", name: "Performance Cut", note: "Highest-intent opener and early proof." },
                { aspect: "1:1", name: "Brand Cut", note: "Tone-led square export for feed and paid." },
                { aspect: "16:9", name: "Feature Cut", note: "Wider format for site and presentation use." },
              ].map((output) => (
                <div
                  key={output.name}
                  className="rounded-[20px] border border-[color:var(--border-subtle)] bg-[rgba(246,242,234,0.02)] px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="eyebrow">{output.aspect}</p>
                    <StatusBadge tone="accent">Ready</StatusBadge>
                  </div>
                  <p className="mt-2 text-base font-medium tracking-[-0.03em] text-[color:var(--text-primary)]">
                    {output.name}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--text-secondary)]">{output.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      footer={
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone="success">Script approved</StatusBadge>
          <StatusBadge tone="success">Storyboard approved</StatusBadge>
          <StatusBadge tone="accent">4 outputs packaged</StatusBadge>
        </div>
      }
    />
  );
}

function RelatedRunCard({ slug, title, industry, summary }: { slug: string; title: string; industry: string; summary: string }) {
  return (
    <Link
      href={`/sample-runs/${slug}`}
      className="group rounded-[28px] border border-[color:var(--border-default)] bg-[rgba(246,242,234,0.03)] p-5 shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:border-[color:var(--border-strong)]"
    >
      <p className="eyebrow">{industry}</p>
      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">
        {title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)]">{summary}</p>
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

      <section className="pt-14 lg:pt-18">
        <div className="space-y-6">
          <SectionIntro eyebrow={run.industry} title={run.title} body={run.brief} />
          <div className="flex flex-wrap gap-2">
            <Chip tone="accent">{run.outputs.length} output cuts</Chip>
            {run.selectedGoals.slice(0, 3).map((goal) => (
              <Chip key={goal}>{goal}</Chip>
            ))}
          </div>
        </div>
      </section>

      <ProseBlock
        aside={
          <aside className="space-y-4 lg:sticky lg:top-6">
            <div className="rounded-[30px] border border-[color:var(--border-default)] bg-[rgba(246,242,234,0.03)] p-6 shadow-[var(--shadow-soft)]">
              <p className="eyebrow">Brief rail</p>
              <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)]">
                {run.concept}
              </p>
            </div>

            <div className="rounded-[30px] border border-[color:var(--border-default)] bg-[rgba(246,242,234,0.03)] p-6 shadow-[var(--shadow-soft)]">
              <p className="eyebrow">Selected assets</p>
              <div className="mt-4 space-y-3">
                {run.selectedAssets.map((asset) => (
                  <div
                    key={asset}
                    className="rounded-[18px] border border-[color:var(--border-subtle)] bg-[rgba(246,242,234,0.02)] px-4 py-3"
                  >
                    <p className="text-sm leading-7 text-[color:var(--text-secondary)]">{asset}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-[color:var(--border-default)] bg-[rgba(246,242,234,0.03)] p-6 shadow-[var(--shadow-soft)]">
              <p className="eyebrow">CTA</p>
              <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)]">
                Use this run as the template for a similar launch pattern in your category.
              </p>
              <div className="mt-5">
                <ButtonLink href={run.ctaHref} variant="primary">
                  {run.ctaLabel}
                </ButtonLink>
              </div>
            </div>
          </aside>
        }
      >
        <div className="space-y-8">
          <RunVisual title={run.title} summary={run.summary} assets={run.selectedAssets} />

          <div className="grid gap-4 md:grid-cols-2">
            {run.selectedGoals.map((goal) => (
              <div
                key={goal}
                className="rounded-[24px] border border-[color:var(--border-default)] bg-[rgba(246,242,234,0.03)] p-5 shadow-[var(--shadow-soft)]"
              >
                <p className="eyebrow">Goal</p>
                <p className="mt-3 text-lg font-medium tracking-[-0.03em] text-[color:var(--text-primary)]">
                  {goal}
                </p>
              </div>
            ))}
          </div>

          <section className="space-y-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Approved script</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[color:var(--text-primary)]">
                  The approved copy stays short enough to keep the media expensive
                </h2>
              </div>
              <StatusBadge tone="success">Approved</StatusBadge>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {run.approvedScript.map((line, index) => (
                <article
                  key={line}
                  className="rounded-[26px] border border-[color:var(--border-default)] bg-[rgba(246,242,234,0.03)] p-5 shadow-[var(--shadow-soft)]"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-soft)]">
                    0{index + 1}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">{line}</p>
                </article>
              ))}
            </div>
          </section>

          <EditorialDivider label="Storyboard" detail="Scene-by-scene structure" />

          <section className="space-y-4">
            {run.storyboard.map((frame) => (
              <article
                key={`${run.slug}-${frame.scene}`}
                className="grid gap-4 rounded-[28px] border border-[color:var(--border-default)] bg-[rgba(246,242,234,0.03)] p-5 shadow-[var(--shadow-soft)] lg:grid-cols-[96px_minmax(0,1fr)_auto]"
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-soft)]">
                    Scene {frame.scene}
                  </p>
                  <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-[color:var(--text-primary)]">
                    {frame.overlay}
                  </p>
                </div>
                <p className="text-sm leading-7 text-[color:var(--text-secondary)]">{frame.note}</p>
                <StatusBadge tone="accent">{frame.overlay}</StatusBadge>
              </article>
            ))}
          </section>

          <EditorialDivider label="Run progression" detail="Stage-by-stage truth" />

          <section className="longform-stage-list">
            {run.stages.map((stage) => (
              <article key={stage.name} className="longform-stage-list__item">
                <div className="space-y-2">
                  <p className="eyebrow">{stage.name}</p>
                  <p className="text-sm leading-7 text-[color:var(--text-secondary)]">{stage.note}</p>
                </div>
                <StatusBadge tone={stage.status === "Delivered" ? "success" : "accent"}>
                  {stage.status}
                </StatusBadge>
              </article>
            ))}
          </section>

          <EditorialDivider label="Final outputs" detail="Aspect-ratio packaging" />

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {run.outputs.map((output, index) => (
              <article
                key={`${run.slug}-${output.name}`}
                className={[
                  "rounded-[28px] border border-[color:var(--border-default)] p-5 shadow-[var(--shadow-soft)]",
                  index === 0
                    ? "bg-[linear-gradient(180deg,rgba(212,154,90,0.14),rgba(17,20,24,0.96))]"
                    : "bg-[rgba(246,242,234,0.03)]",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="eyebrow">{output.aspect}</p>
                  <StatusBadge tone="default">Export</StatusBadge>
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">
                  {output.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">{output.note}</p>
                <p className="mt-5 text-sm uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                  {output.assetLabel}
                </p>
              </article>
            ))}
          </section>

          <EditorialDivider label="Related runs" detail="Adjacent proof" />

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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

          <div className="flex flex-wrap gap-3 border-t border-[color:var(--border-subtle)] pt-8">
            <ButtonLink href={run.ctaHref} variant="primary">
              {run.ctaLabel}
            </ButtonLink>
            <ButtonLink href="/gallery" variant="secondary">
              Browse the gallery
            </ButtonLink>
          </div>
        </div>
      </ProseBlock>

      <SiteFooter />
    </PageShell>
  );
}
