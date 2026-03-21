"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ButtonLink,
  Chip,
  MarketingHeader,
  PageShell,
  SiteFooter,
  StatusBadge,
} from "@/components/site-primitives";
import { sampleRunFilters, sampleRuns, type SampleRun } from "@/components/site-data";

type AccentTone = "amber" | "cobalt" | "neutral";

function filterButtonClass(active: boolean) {
  return [
    "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm transition",
    active
      ? "border-[rgba(212,154,90,0.34)] bg-[rgba(212,154,90,0.12)] text-[color:var(--text-primary)]"
      : "border-[color:var(--border-default)] bg-[rgba(246,242,234,0.03)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]",
  ].join(" ");
}

function toneForRun(index: number): AccentTone {
  if (index % 3 === 0) return "amber";
  if (index % 3 === 1) return "cobalt";
  return "neutral";
}

function collectRuns(activeIndustry: string) {
  const filtered =
    activeIndustry === "All"
      ? sampleRuns
      : sampleRuns.filter((run) => run.industry === activeIndustry);

  const primary = filtered[0] ?? sampleRuns[0];
  const rest = filtered.filter((run) => run.slug !== primary.slug);
  const atlas = activeIndustry === "All" ? sampleRuns : filtered;

  return {
    filtered,
    primary,
    atlas,
    archive: rest,
  };
}

export default function SampleRunsPage() {
  const [activeIndustry, setActiveIndustry] = useState("All");
  const { primary, atlas, archive } = useMemo(() => collectRuns(activeIndustry), [activeIndustry]);

  return (
    <PageShell className="pb-16">
      <MarketingHeader />

      <section className="page-hero sample-runs-hero">
        <div className="sample-runs-hero__copy">
          <Chip tone="accent">Sample runs</Chip>
          <h1 className="hero-title max-w-[8ch]">
            Campaign proof that changes with the category
          </h1>
          <p className="hero-body">
            Each run keeps the brief, the selected source set, the approvals, and the final
            cut family in one view. Beauty should not read like residential. Apparel should
            not be packaged like a supplement launch.
          </p>
          <div className="flex flex-wrap gap-2">
            {sampleRunFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={filterButtonClass(activeIndustry === filter)}
                onClick={() => setActiveIndustry(filter)}
                aria-pressed={activeIndustry === filter}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <StatusBadge tone="default">{atlas.length} live examples</StatusBadge>
            <StatusBadge tone="accent">Brief, approvals, outputs</StatusBadge>
            <StatusBadge tone="success">3 ratios / multi-cut packaging</StatusBadge>
          </div>
        </div>

        <RunAtlasBoard runs={atlas} activeSlug={primary.slug} />
      </section>

      <section className="sample-proof">
        <div className="sample-proof__intro">
          <div className="space-y-3">
            <p className="eyebrow">Lead run</p>
            <h2 className="text-4xl leading-[0.96] tracking-[-0.05em] text-[color:var(--text-primary)] md:text-[4.4rem]">
              {primary.title}
            </h2>
            <p className="max-w-3xl text-base leading-8 text-[color:var(--text-secondary)]">
              {primary.summary}
            </p>
          </div>

          <div className="sample-proof__intro-actions">
            <ButtonLink href={`/sample-runs/${primary.slug}`} variant="primary">
              Open the full run
            </ButtonLink>
            <ButtonLink href="/gallery" variant="secondary">
              Browse finished outputs
            </ButtonLink>
          </div>
        </div>

        <LeadRunBoard run={primary} />
      </section>

      <section className="sample-archive">
        <div className="sample-archive__heading">
          <div className="space-y-3">
            <p className="eyebrow">Archive</p>
            <h2 className="text-4xl leading-[0.98] tracking-[-0.05em] text-[color:var(--text-primary)]">
              Compare the campaign systems, not a wall of exports.
            </h2>
            <p className="max-w-3xl text-base leading-8 text-[color:var(--text-secondary)]">
              Each run below keeps the creative angle, the approval logic, and the final cut
              family visible enough to judge the work honestly.
            </p>
          </div>
          <ButtonLink href="/contact" variant="secondary">
            Request a tailored run
          </ButtonLink>
        </div>

        <div className="sample-archive__list">
          {archive.map((run, index) => (
            <RunProofRow
              key={run.slug}
              run={run}
              accent={toneForRun(index)}
              reversed={index % 2 === 1}
            />
          ))}
        </div>
      </section>

      <SiteFooter />
    </PageShell>
  );
}

function RunAtlasBoard({
  runs,
  activeSlug,
}: {
  runs: SampleRun[];
  activeSlug: string;
}) {
  const activeRun = runs.find((run) => run.slug === activeSlug) ?? runs[0];
  const perimeter = runs.filter((run) => run.slug !== activeRun.slug).slice(0, 5);

  return (
    <div className="sample-atlas">
      <div className="sample-atlas__surface">
        <div className="sample-atlas__board">
          <div className="sample-atlas__focus">
            <div className="sample-atlas__focus-header">
              <p className="eyebrow">{activeRun.industry}</p>
              <StatusBadge tone="accent">{activeRun.outputs.length} cuts</StatusBadge>
            </div>
            <p className="sample-atlas__focus-title">{activeRun.title}</p>
            <p className="sample-atlas__focus-copy">{activeRun.brief}</p>
            <div className="sample-atlas__preview">
              <div className="sample-atlas__preview-asset">
                <span>Source set</span>
                <strong>{activeRun.selectedAssets[0]}</strong>
              </div>
              <div className="sample-atlas__preview-main">
                <div className="sample-atlas__preview-glow" />
                <div className="sample-atlas__preview-bottle" />
                <div className="sample-atlas__preview-output">
                  <span>{activeRun.outputs[0]?.aspect}</span>
                  <strong>{activeRun.outputs[0]?.name}</strong>
                </div>
              </div>
              <div className="sample-atlas__preview-rail">
                {activeRun.outputs.slice(0, 3).map((output) => (
                  <div key={`${activeRun.slug}-${output.name}`} className="sample-atlas__mini-output">
                    <span>{output.aspect}</span>
                    <strong>{output.name}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sample-atlas__perimeter">
            {perimeter.map((run, index) => (
              <Link
                key={run.slug}
                href={`/sample-runs/${run.slug}`}
                className={[
                  "sample-atlas__tile",
                  index % 3 === 0
                    ? "sample-atlas__tile--amber"
                    : index % 3 === 1
                      ? "sample-atlas__tile--cobalt"
                      : "sample-atlas__tile--neutral",
                ].join(" ")}
              >
                <p>{run.industry}</p>
                <strong>{run.summary}</strong>
                <span>{run.outputs[0]?.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="sample-atlas__ledger">
          <div>
            <p className="eyebrow">Locked approvals</p>
            <strong>Script + storyboard approved</strong>
          </div>
          <div>
            <p className="eyebrow">Shared clip pool</p>
            <strong>One generation spine, multiple cuts</strong>
          </div>
          <div>
            <p className="eyebrow">Output family</p>
            <strong>9:16, 1:1, 16:9, platform variants</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadRunBoard({ run }: { run: SampleRun }) {
  return (
    <article className="sample-proof-board">
      <aside className="sample-proof-board__rail">
        <div className="sample-proof-board__panel">
          <p className="eyebrow">Brief</p>
          <p className="sample-proof-board__copy">{run.brief}</p>
        </div>
        <div className="sample-proof-board__panel">
          <p className="eyebrow">Selected goals</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {run.selectedGoals.map((goal, index) => (
              <Chip key={`${run.slug}-goal-${goal}`} tone={index === 0 ? "accent" : "default"}>
                {goal}
              </Chip>
            ))}
          </div>
        </div>
        <div className="sample-proof-board__panel">
          <p className="eyebrow">Source set</p>
          <div className="mt-4 space-y-3">
            {run.selectedAssets.map((asset) => (
              <div key={`${run.slug}-${asset}`} className="sample-proof-board__asset">
                <span>Selected</span>
                <strong>{asset}</strong>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="sample-proof-board__canvas">
        <div className="sample-proof-board__stage">
          <div className="sample-proof-board__stage-header">
            <div>
              <p className="eyebrow">Active sequence</p>
              <h3>Approved scene structure and output mapping</h3>
            </div>
            <div className="sample-proof-board__stage-badges">
              <StatusBadge tone="success">Script approved</StatusBadge>
              <StatusBadge tone="success">Storyboard approved</StatusBadge>
            </div>
          </div>

          <div className="sample-proof-board__stage-visual">
            <div className="sample-proof-board__scene-stack">
              {run.storyboard.map((frame) => (
                <div key={`${run.slug}-${frame.scene}`} className="sample-proof-board__scene">
                  <span>{frame.scene}</span>
                  <strong>{frame.overlay}</strong>
                  <p>{frame.note}</p>
                </div>
              ))}
            </div>

            <div className="sample-proof-board__preview">
              <div className="sample-proof-board__preview-glow" />
              <div className="sample-proof-board__preview-core" />
              <div className="sample-proof-board__preview-label">
                <span>Live preview</span>
                <strong>{run.outputs[0]?.name}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="sample-proof-board__lower">
          <div className="sample-proof-board__script">
            <p className="eyebrow">Approved script</p>
            <div className="mt-4 space-y-3">
              {run.approvedScript.map((line, index) => (
                <div key={`${run.slug}-script-${index + 1}`} className="sample-proof-board__script-line">
                  <span>0{index + 1}</span>
                  <p>{line}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="sample-proof-board__outputs">
            <p className="eyebrow">Output family</p>
            <div className="mt-4 grid gap-3">
              {run.outputs.map((output, index) => (
                <div
                  key={`${run.slug}-${output.name}`}
                  className={[
                    "sample-proof-board__output",
                    index === 0
                      ? "sample-proof-board__output--accent"
                      : output.aspect === "16:9"
                        ? "sample-proof-board__output--cobalt"
                        : "",
                  ].join(" ")}
                >
                  <div>
                    <span>{output.aspect}</span>
                    <strong>{output.name}</strong>
                  </div>
                  <p>{output.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function RunProofRow({
  run,
  accent,
  reversed,
}: {
  run: SampleRun;
  accent: AccentTone;
  reversed?: boolean;
}) {
  return (
    <Link
      href={`/sample-runs/${run.slug}`}
      className={[
        "sample-proof-row",
        reversed ? "sample-proof-row--reverse" : "",
        accent === "amber"
          ? "sample-proof-row--amber"
          : accent === "cobalt"
            ? "sample-proof-row--cobalt"
            : "sample-proof-row--neutral",
      ].join(" ")}
    >
      <div className="sample-proof-row__visual">
        <div className="sample-proof-row__visual-ledger">
          <p>{run.industry}</p>
          <span>{run.outputs.length} cuts</span>
        </div>
        <div className="sample-proof-row__visual-stage">
          {run.storyboard.slice(0, 3).map((frame) => (
            <div key={`${run.slug}-${frame.scene}`} className="sample-proof-row__scene-chip">
              <span>{frame.scene}</span>
              <strong>{frame.overlay}</strong>
            </div>
          ))}
        </div>
        <div className="sample-proof-row__visual-foot">
          {run.outputs.slice(0, 3).map((output) => (
            <span key={`${run.slug}-${output.name}`}>{output.aspect}</span>
          ))}
        </div>
      </div>

      <div className="sample-proof-row__content">
        <div className="space-y-3">
          <p className="eyebrow">{run.industry}</p>
          <h3>{run.title}</h3>
          <p>{run.summary}</p>
        </div>

        <div className="sample-proof-row__details">
          <div>
            <span>Brief</span>
            <p>{run.brief}</p>
          </div>
          <div>
            <span>Approvals</span>
            <p>{run.stages[1]?.status} script package, {run.stages[2]?.status?.toLowerCase()} storyboard.</p>
          </div>
          <div>
            <span>Output strategy</span>
            <p>{run.outputs.map((output) => output.name).join(" · ")}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
