import type { Metadata } from "next";
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
import { createPublicPageMetadata } from "../seo";

const enterprisePillars = [
  {
    title: "Governance without drag",
    body: "Protect brand decisions and approval logic without making teams swim through process for every campaign.",
  },
  {
    title: "Review workflow that survives scale",
    body: "Keep script, storyboard, and output approvals readable enough for operators and rigorous enough for brand teams.",
  },
  {
    title: "Operational visibility across launches",
    body: "See where campaigns are moving, where retries are happening, and where delivery risk shows up before it turns into delay.",
  },
];

export const metadata: Metadata = createPublicPageMetadata({
  title: "Enterprise",
  description:
    "See how Ad Command Center supports governance, review workflow, brand control, and operational visibility for larger creative teams.",
  canonicalPath: "/enterprise",
});

export default function EnterprisePage() {
  return (
    <PageShell className="pb-16">
      <MarketingHeader />

      <section className="page-hero page-hero--enterprise">
        <div className="enterprise-hero">
          <div className="enterprise-hero__copy">
            <SectionIntro
              eyebrow="Enterprise"
              title="Built for governance, review workflow, brand control, and cross-team consistency."
              body="This page should sell operational confidence: cleaner approvals, clearer visibility, and a more disciplined way to scale campaign production across categories and markets."
            />
            <div className="hero-actions">
              <ButtonLink href="/contact" variant="primary">
                Contact the Team
              </ButtonLink>
              <ButtonLink href="/sample-runs" variant="secondary">
                Review Sample Runs
              </ButtonLink>
            </div>
          </div>
          <div className="enterprise-hero__visual">
            <div className="enterprise-console">
              <div className="enterprise-console__header">
                <Chip tone="accent">Global workspace</Chip>
                <StatusBadge tone="success">Governance live</StatusBadge>
              </div>
              <div className="enterprise-console__viewport" aria-hidden="true">
                <div className="enterprise-console__viewport-glow" />
                <div className="enterprise-console__viewport-window" />
                <div className="enterprise-console__viewport-panel" />
              </div>
              <div className="enterprise-console__signals">
                {["Approval audit", "Brand rules", "Regional rollouts", "Visibility feed"].map((item) => (
                  <article key={item}>
                    <p className="eyebrow">System layer</p>
                    <h3>{item}</h3>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <EditorialDivider label="Pillars" detail="Why enterprise teams care" />

      <section className="enterprise-pillars">
        {enterprisePillars.map((pillar) => (
          <article key={pillar.title} className="enterprise-pillars__item">
            <p className="eyebrow">Enterprise benefit</p>
            <h2>{pillar.title}</h2>
            <p>{pillar.body}</p>
          </article>
        ))}
      </section>

      <EditorialDivider label="Operating model" detail="How the system scales" />

      <section className="enterprise-operating-model">
        <div className="enterprise-operating-model__narrative">
          <h2>One command surface. Many teams. Consistent campaign output.</h2>
          <p>
            Enterprise teams need more than generation. They need a production layer that keeps
            brand control, approval discipline, and delivery visibility intact as more launches move
            through the system.
          </p>
          <div className="chip-row">
            <Chip>Brand control</Chip>
            <Chip tone="accent">Review workflow</Chip>
            <Chip tone="cobalt">Operational visibility</Chip>
          </div>
        </div>
        <div className="enterprise-operating-model__rail">
          {[
            "Central workspace templates for categories and markets.",
            "Approval surfaces that keep changes explainable and traceable.",
            "Output packaging that stays usable across paid, retail, and brand channels.",
          ].map((line) => (
            <article key={line} className="enterprise-operating-model__point">
              <p>{line}</p>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
