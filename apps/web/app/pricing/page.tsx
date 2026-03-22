import type { Metadata } from "next";
import {
  ButtonLink,
  Chip,
  EditorialDivider,
  MarketingHeader,
  PageShell,
  SectionIntro,
  SiteFooter,
} from "@/components/site-primitives";
import { pricingTiers } from "@/components/site-data";
import { createPublicPageMetadata } from "../seo";

export const metadata: Metadata = createPublicPageMetadata({
  title: "Pricing",
  description:
    "Choose the Ad Command Center operating model that fits your team, from campaign-by-campaign use through enterprise workflow governance.",
  canonicalPath: "/pricing",
});

export default function PricingPage() {
  return (
    <PageShell className="pb-16">
      <MarketingHeader />

      <section className="page-hero page-hero--pricing">
        <div className="pricing-hero-v2">
          <SectionIntro
            eyebrow="Pricing"
            title="Buy credits into the workspace. Use them when a run is worth making."
            body="Every paid workspace carries a credit balance. Credits are consumed when generation starts, while the brief, approvals, storyboard, and exports stay inside the same account."
          />
          <div className="pricing-hero-v2__ledger">
            <div>
              <span>Guided run</span>
              <strong>45 to 90 credits</strong>
              <p>Depends on scene count, clip volume, and how heavy the output family is.</p>
            </div>
            <div>
              <span>Refresh or extension</span>
              <strong>18 to 30 credits</strong>
              <p>Best for cutdown work, platform refreshes, or new output variants from an existing system.</p>
            </div>
            <div>
              <span>Workspace balance</span>
              <strong>Credits live on the account</strong>
              <p>Billing stays attached to the workspace, not to a single user or campaign.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing-cascade">
        {pricingTiers.map((tier) => (
          <article
            key={tier.name}
            className={tier.featured ? "pricing-cascade__tier is-featured" : "pricing-cascade__tier"}
          >
            <div className="pricing-cascade__header">
              <div>
                <p className="eyebrow">{tier.name}</p>
                <h2>{tier.price}</h2>
                <div className="pricing-cascade__credit-line">
                  <strong>{tier.credits}</strong>
                  <span>{tier.runRange}</span>
                </div>
              </div>
              {tier.featured ? <Chip tone="accent">Best rate</Chip> : null}
            </div>
            <p>{tier.note}</p>
            <ul className="bullet-list">
              {tier.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="pricing-cascade__footer">
              <ButtonLink href={tier.href} variant={tier.featured ? "primary" : "secondary"}>
                {tier.ctaLabel}
              </ButtonLink>
            </div>
          </article>
        ))}
      </section>

      <EditorialDivider label="Credit logic" detail="How the balance is actually used" />

      <section className="pricing-logic pricing-logic--credits">
        <article>
          <p className="eyebrow">1. Fund the workspace</p>
          <h3>Credits are purchased into the account, not attached to a single campaign.</h3>
          <p>
            The workspace holds the balance so the team can brief, review, approve, and launch without
            re-billing every time a run starts.
          </p>
        </article>
        <article>
          <p className="eyebrow">2. Spend on generation</p>
          <h3>Credits are consumed when clips, variants, and export families are actually generated.</h3>
          <p>
            Review stages stay cheap. Spend happens when the approved script and storyboard are ready to
            turn into real outputs.
          </p>
        </article>
        <article>
          <p className="eyebrow">3. Refill before bottlenecks</p>
          <h3>Teams top up the balance before launches, seasonal pushes, or heavy paid cycles.</h3>
          <p>
            Enterprise accounts can pool credits, set billing controls, and coordinate volume across
            multiple teams and markets.
          </p>
        </article>
      </section>

      <section className="pricing-faq-v2">
        <article>
          <p className="eyebrow">What counts as a run?</p>
          <h3>One approved brief moving through script, storyboard, generation, and delivery.</h3>
          <p>
            Heavier runs with more scenes, more clip attempts, or broader output families draw more
            credits than lighter refreshes.
          </p>
        </article>
        <article>
          <p className="eyebrow">What is already included?</p>
          <h3>Review flow, approvals, export packaging, and the workspace itself.</h3>
          <p>
            The credit balance covers generation. The product surface, approvals, delivery structure,
            and workspace organization stay part of the account.
          </p>
        </article>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
