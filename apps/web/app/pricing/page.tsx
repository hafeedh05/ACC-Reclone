import type { Metadata } from "next";
import Link from "next/link";
import { MarketingHeader, SiteFooter } from "@/components/site-primitives";
import { pricingTiers } from "@/components/site-data";
import { createPublicPageMetadata } from "../seo";

export const metadata: Metadata = createPublicPageMetadata({
  title: "Pricing",
  description:
    "Credits fund the workspace balance, then generation spends against that balance when a run actually starts.",
  canonicalPath: "/pricing",
});

const logic = [
  {
    index: "01",
    title: "1 credit = controlled generation time",
    body: "Spend begins when approved runs move into media generation, not while the team is still briefing or reviewing.",
  },
  {
    index: "02",
    title: "4K output families",
    body: "Performance, brand, feature, and platform cuts are packaged from one controlled system instead of separate manual edits.",
  },
  {
    index: "03",
    title: "Workspace balance, not single-user spend",
    body: "Credits live on the account so multiple operators can share one launch calendar and one review flow.",
  },
];

export default function PricingPage() {
  return (
    <main className="aether-marketing-page" id="main-content">
      <MarketingHeader active="pricing" />

      <section className="aether-pricing-hero">
        <div className="aether-pricing-hero__copy">
          <p className="aether-kicker">Strategic value</p>
          <h1>Investment in intelligence.</h1>
          <p>
            Buy credits into the workspace, keep the balance visible to the team, and only spend
            when a run actually enters generation.
          </p>
        </div>

        <div className="aether-pricing-ledger">
          <div className="aether-pricing-ledger__top">
            <div>
              <span>Current balance</span>
              <strong>
                1,240 <em>credits</em>
              </strong>
            </div>
            <b>⚡</b>
          </div>
          <div className="aether-pricing-ledger__bar">
            <span style={{ width: "62%" }} />
          </div>
          <div className="aether-pricing-ledger__meta">
            <span>Monthly allocation</span>
            <span>2,000 credits</span>
          </div>
          <Link href="/contact" className="aether-btn aether-btn--secondary aether-btn--full">
            Add credits
          </Link>
        </div>
      </section>

      <section className="aether-logic-grid">
        {logic.map((item) => (
          <article key={item.index}>
            <span>{item.index}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="aether-pricing-list">
        {pricingTiers.map((tier) => (
          <article key={tier.name} className="aether-pricing-tier">
            <div className="aether-pricing-tier__copy">
              <p className="aether-kicker">{tier.name}</p>
              <h2>{tier.name}</h2>
              <p>{tier.note}</p>
            </div>
            <div className="aether-pricing-tier__amount">
              <span>Monthly pack</span>
              <strong>{tier.price}</strong>
              <em>{tier.credits}</em>
              <Link href={tier.href} className="aether-tier-link">
                {tier.ctaLabel}
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="aether-spec-table">
        <h3>System specifications</h3>
        <div className="aether-spec-table__wrap">
          <table>
            <thead>
              <tr>
                <th>Capability</th>
                <th>Starter</th>
                <th>Growth</th>
                <th>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Base credits / month</td>
                <td>500</td>
                <td>2,500</td>
                <td>Unlimited pool</td>
              </tr>
              <tr>
                <td>Rendering resolution</td>
                <td>Up to 1080p</td>
                <td>Up to 4K</td>
                <td>4K master + custom handling</td>
              </tr>
              <tr>
                <td>Concurrent generations</td>
                <td>2 runs</td>
                <td>10 runs</td>
                <td>Priority queue</td>
              </tr>
              <tr>
                <td>Review governance</td>
                <td>Basic</td>
                <td>Shared approvals</td>
                <td>Cross-team controls</td>
              </tr>
              <tr>
                <td>API workflow access</td>
                <td>-</td>
                <td>Limited</td>
                <td>Full</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="aether-final-banner">
        <div className="aether-final-banner__panel">
          <h2>Ready to begin?</h2>
          <p>
            Join teams using Aether Hyve to move from approved creative to delivered output without
            rebuilding the workflow every launch.
          </p>
          <div className="aether-hero-actions">
            <Link href="/app" className="aether-btn aether-btn--primary">
              Start a run
            </Link>
            <Link href="/contact" className="aether-btn aether-btn--secondary">
              Request pricing
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
