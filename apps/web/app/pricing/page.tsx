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
        <SectionIntro
          eyebrow="Pricing"
          title="Three buying paths. One disciplined production model."
          body="Keep the page concise, make the differences obvious, and anchor the value in review quality, output usefulness, and repeatable launch discipline."
        />
      </section>

      <section className="pricing-cascade">
        {pricingTiers.map((tier, index) => (
          <article
            key={tier.name}
            className={index === 1 ? "pricing-cascade__tier is-featured" : "pricing-cascade__tier"}
          >
            <div className="pricing-cascade__header">
              <div>
                <p className="eyebrow">{tier.name}</p>
                <h2>{tier.price}</h2>
              </div>
              {index === 1 ? <Chip tone="accent">Most complete</Chip> : null}
            </div>
            <p>{tier.note}</p>
            <ul className="bullet-list">
              {tier.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="pricing-cascade__footer">
              <ButtonLink href={tier.name === "Enterprise" ? "/enterprise" : "/contact"} variant={index === 1 ? "primary" : "secondary"}>
                {tier.name === "Enterprise" ? "Talk to Enterprise" : "Contact the Team"}
              </ButtonLink>
            </div>
          </article>
        ))}
      </section>

      <EditorialDivider label="Buying logic" detail="What changes as teams scale" />

      <section className="pricing-logic">
        <article>
          <p className="eyebrow">Core</p>
          <h3>For campaign-by-campaign teams</h3>
          <p>Best when the workflow needs to stay sharp without introducing operational overhead.</p>
        </article>
        <article>
          <p className="eyebrow">Studio</p>
          <h3>For teams building repeatable launch muscle</h3>
          <p>Best when the goal is cleaner review, reusable structure, and a stronger output library.</p>
        </article>
        <article>
          <p className="eyebrow">Enterprise</p>
          <h3>For governance, visibility, and cross-team consistency</h3>
          <p>Best when brand control and rollout discipline matter as much as raw speed.</p>
        </article>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
