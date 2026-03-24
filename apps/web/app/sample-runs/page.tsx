"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EditorialMediaFrame, mediaForRun } from "@/components/media-system";
import { sampleRunFilters, sampleRuns } from "@/components/site-data";
import { MarketingHeader, SiteFooter } from "@/components/site-primitives";

export default function SampleRunsPage() {
  const [active, setActive] = useState("All");

  const filtered = useMemo(
    () =>
      active === "All" ? sampleRuns : sampleRuns.filter((run) => run.industry === active),
    [active],
  );

  const [featured, ...rest] = filtered;

  return (
    <main className="aether-marketing-page" id="main-content">
      <MarketingHeader active="sample-runs" />

      <section className="aether-sample-index-hero">
        <div className="aether-sample-index-hero__copy">
          <p className="aether-kicker">Sample runs</p>
          <h1>Proof pages, not inventory pages.</h1>
          <p>
            Browse real campaign systems, open the strongest run, and inspect the approved story,
            aspect views, and final output family without extra scaffolding.
          </p>
          <div className="aether-hero-actions">
            <Link href={`/sample-runs/${featured.slug}`} className="aether-btn aether-btn--primary">
              Open featured run
            </Link>
            <Link href="/app/command-center" className="aether-btn aether-btn--ghost">
              Open platform
            </Link>
          </div>
          <div className="aether-filter-row">
            {sampleRunFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={filter === active ? "is-active" : undefined}
                onClick={() => setActive(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <Link href={`/sample-runs/${featured.slug}`} className="aether-sample-index-hero__feature">
          <EditorialMediaFrame
            asset={mediaForRun(featured.slug)}
            aspect="wide"
            className="aether-sample-index-hero__frame"
            motion
            priority
            sizes="(min-width: 1024px) 56vw, 100vw"
          />
          <div className="aether-sample-index-hero__feature-copy">
            <p>{featured.industry}</p>
            <h2>{featured.title}</h2>
            <span>{featured.outputs[0]?.aspect}</span>
          </div>
        </Link>
      </section>

      <section className="aether-archive">
        <div className="aether-archive__head">
          <div>
            <p className="aether-kicker">Archive</p>
            <h3>Campaign systems across categories.</h3>
          </div>
        </div>
        <div className="aether-archive__grid">
          {rest.map((run) => (
            <Link key={run.slug} href={`/sample-runs/${run.slug}`} className="aether-archive__card">
              <EditorialMediaFrame
                asset={mediaForRun(run.slug)}
                aspect="portrait"
                className="aether-archive__frame"
                sizes="(min-width: 1024px) 22vw, 100vw"
              />
              <span>{run.industry}</span>
              <strong>{run.title}</strong>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
