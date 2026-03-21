"use client";

import { useState } from "react";
import {
  ButtonLink,
  Chip,
  EditorialDivider,
  MarketingHeader,
  PageShell,
  SiteFooter,
  StatusBadge,
} from "@/components/site-primitives";
import { galleryFilters, galleryItems } from "@/components/site-data";

function galleryFilterClass(active: boolean) {
  return [
    "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm transition",
    active
      ? "border-[color:rgba(212,154,90,0.35)] bg-[rgba(212,154,90,0.12)] text-[color:var(--text-primary)]"
      : "border-[color:var(--border-default)] bg-[rgba(246,242,234,0.03)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]",
  ].join(" ");
}

function FilterGroup({
  label,
  items,
  value,
  onChange,
}: {
  label: string;
  items: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="eyebrow">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className={galleryFilterClass(value === item)}
            onClick={() => onChange(item)}
            aria-pressed={value === item}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function GalleryFrame({
  title,
  summary,
  detail,
  label,
  aspect,
}: {
  title: string;
  summary: string;
  detail: string;
  label: string;
  aspect: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[34px] border border-[color:var(--border-default)] bg-[linear-gradient(180deg,rgba(19,22,26,0.95),rgba(15,17,21,0.98))] shadow-[var(--shadow-hero)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,154,90,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(94,114,155,0.18),transparent_34%)]" />
      <div className="relative flex h-full min-h-[420px] flex-col justify-between p-6 sm:p-7">
        <div className="flex flex-wrap gap-2">
          <Chip tone="accent">{aspect}</Chip>
          <Chip tone="cobalt">{label}</Chip>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-3">
            <p className="eyebrow">Selected cut</p>
            <h3 className="max-w-[12ch] text-4xl font-semibold tracking-[-0.05em] text-[color:var(--text-primary)]">
              {title}
            </h3>
            <p className="max-w-[32ch] text-sm leading-7 text-[color:var(--text-secondary)]">
              {summary}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[26px] border border-[color:var(--border-subtle)] bg-[rgba(246,242,234,0.03)] p-4">
              <p className="eyebrow">Frame note</p>
              <p className="mt-3 text-lg font-medium tracking-[-0.03em] text-[color:var(--text-primary)]">
                {label}
              </p>
            </div>
            <div className="rounded-[26px] border border-[color:var(--border-subtle)] bg-[rgba(246,242,234,0.03)] p-4">
              <p className="eyebrow">Creative angle</p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">{detail}</p>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-soft)]">
                Gallery spotlight
              </p>
              <p className="max-w-[34ch] text-sm leading-7 text-[color:var(--text-secondary)]">
                A disciplined proof frame designed to hold the final media pack without redesigning the layout.
              </p>
            </div>
          <StatusBadge tone="default">{aspect}</StatusBadge>
        </div>
      </div>
    </div>
  );
}

function GalleryTile({
  item,
  active,
  onSelect,
  index,
}: {
  item: (typeof galleryItems)[number];
  active: boolean;
  onSelect: () => void;
  index: number;
}) {
  const spanClass = [
    "xl:col-span-4",
    "xl:col-span-3",
    "xl:col-span-5",
    "xl:col-span-4",
    "xl:col-span-6",
    "xl:col-span-3",
  ][index % 6];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "group block text-left transition duration-200 hover:-translate-y-1",
        "rounded-[30px] border p-4 shadow-[var(--shadow-soft)]",
        active
          ? "border-[color:rgba(212,154,90,0.38)] bg-[rgba(246,242,234,0.05)]"
          : "border-[color:var(--border-default)] bg-[rgba(246,242,234,0.03)] hover:border-[color:var(--border-strong)]",
        spanClass,
      ].join(" ")}
    >
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-[26px] border border-[color:var(--border-subtle)] bg-[linear-gradient(180deg,rgba(20,24,29,0.98),rgba(12,15,19,0.98))]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,154,90,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(94,114,155,0.16),transparent_34%)]" />
          <div className="relative flex min-h-[280px] flex-col justify-between p-5">
            <div className="flex flex-wrap gap-2">
              <Chip tone="accent">{item.aspect}</Chip>
              <Chip tone="cobalt">{item.campaignType}</Chip>
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="space-y-3">
                <p className="eyebrow">{item.industry}</p>
                <h3 className="max-w-[12ch] text-3xl font-semibold tracking-[-0.05em] text-[color:var(--text-primary)]">
                  {item.title}
                </h3>
              </div>
              <div className="rounded-[22px] border border-[color:var(--border-subtle)] bg-[rgba(246,242,234,0.03)] p-4">
                <p className="eyebrow">Frame label</p>
                <p className="mt-3 text-lg font-medium tracking-[-0.03em] text-[color:var(--text-primary)]">
                  {item.assetLabel}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm leading-7 text-[color:var(--text-secondary)]">{item.summary}</p>
          <div className="flex flex-wrap gap-2">
            {item.notes.slice(0, 3).map((note) => (
              <StatusBadge key={note} tone="default">
                {note}
              </StatusBadge>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

export default function GalleryPage() {
  const [industry, setIndustry] = useState("All");
  const [ratio, setRatio] = useState("All");
  const [campaignType, setCampaignType] = useState("All");
  const [selectedSlug, setSelectedSlug] = useState(galleryItems[0]?.slug ?? "");

  const filteredItems = galleryItems.filter((item) => {
    const industryMatch = industry === "All" || item.industry === industry;
    const ratioMatch = ratio === "All" || item.aspect === ratio;
    const campaignMatch = campaignType === "All" || item.campaignType === campaignType;

    return industryMatch && ratioMatch && campaignMatch;
  });

  const selected = filteredItems.find((item) => item.slug === selectedSlug) ?? filteredItems[0] ?? galleryItems[0];

  return (
    <PageShell className="pb-16">
      <MarketingHeader />

      <section className="pt-14 lg:pt-18">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="space-y-7">
            <div className="space-y-5">
              <Chip tone="accent">Gallery</Chip>
              <h1 className="hero-title max-w-[11ch]">Browse finished cuts by industry, ratio, and campaign type</h1>
              <p className="hero-body">
                The gallery is built like a visual acquisition layer: filter by what matters, open a
                spotlight frame, and land on the supporting proof without a wall of empty cards.
              </p>
            </div>

            <div className="space-y-5">
              <FilterGroup label="Industry" items={galleryFilters.industries} value={industry} onChange={setIndustry} />
              <FilterGroup label="Ratio" items={galleryFilters.ratios} value={ratio} onChange={setRatio} />
              <FilterGroup
                label="Campaign type"
                items={galleryFilters.campaignTypes}
                value={campaignType}
                onChange={setCampaignType}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/sample-runs" variant="primary">
                Open a sample run
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Ask for a similar cut
              </ButtonLink>
            </div>
          </div>

          <div className="relative">
            <GalleryFrame
              title={selected.title}
              summary={selected.summary}
              detail={selected.detail}
              label={selected.assetLabel}
              aspect={selected.aspect}
            />
          </div>
        </div>
      </section>

      <EditorialDivider label="Spotlight" detail={selected.industry} />

      <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-5">
          <GalleryFrame
            title={selected.title}
            summary={selected.summary}
            detail={selected.detail}
            label={selected.assetLabel}
            aspect={selected.aspect}
          />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6">
          <div className="rounded-[30px] border border-[color:var(--border-default)] bg-[rgba(246,242,234,0.03)] p-6 shadow-[var(--shadow-soft)]">
            <p className="eyebrow">Selected cut</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[color:var(--text-primary)]">
              {selected.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)]">{selected.detail}</p>
          </div>

          <div className="rounded-[30px] border border-[color:var(--border-default)] bg-[rgba(246,242,234,0.03)] p-6 shadow-[var(--shadow-soft)]">
            <p className="eyebrow">Proof notes</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {selected.notes.map((note) => (
                <StatusBadge key={note} tone="default">
                  {note}
                </StatusBadge>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-[color:var(--border-default)] bg-[rgba(246,242,234,0.03)] p-6 shadow-[var(--shadow-soft)]">
            <p className="eyebrow">Open the source run</p>
            <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)]">
              This gallery item links back to the sample run that produced the visual pattern.
            </p>
            <div className="mt-5">
              <ButtonLink href={selected.href} variant="primary">
                Open sample run
              </ButtonLink>
            </div>
          </div>
        </aside>
      </section>

      <EditorialDivider label="Mosaic" detail={`${filteredItems.length} results`} />

      <section className="grid gap-4 xl:grid-cols-12">
        {filteredItems.map((item, index) => (
          <GalleryTile
            key={item.slug}
            item={item}
            active={item.slug === selected.slug}
            onSelect={() => setSelectedSlug(item.slug)}
            index={index}
          />
        ))}
      </section>

      <section className="mt-16 grid gap-6 border-t border-[color:var(--border-subtle)] pt-10 lg:grid-cols-3">
        <div className="space-y-3">
          <p className="eyebrow">Real proof</p>
          <p className="text-sm leading-7 text-[color:var(--text-secondary)]">
            Each gallery item is tied to a real sample run so the visual layer carries product truth,
            not invented filler.
          </p>
        </div>
        <div className="space-y-3">
          <p className="eyebrow">Filter depth</p>
          <p className="text-sm leading-7 text-[color:var(--text-secondary)]">
            Industry, aspect ratio, and campaign type filters keep the gallery useful for search and
            for people who need to compare formats fast.
          </p>
        </div>
        <div className="space-y-3">
          <p className="eyebrow">Next step</p>
          <p className="text-sm leading-7 text-[color:var(--text-secondary)]">
            Move from gallery into a sample run when you want to inspect the full brief, script,
            storyboard, and output family.
          </p>
        </div>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
