import type { Metadata } from "next";
import {
  Chip,
  EditorialDivider,
  MarketingHeader,
  PageShell,
  PlaceholderArt,
  SectionIntro,
  SiteFooter,
  StatusBadge,
} from "@/components/site-primitives";
import { workflowSteps } from "@/components/site-data";
import { createPublicPageMetadata } from "../seo";

export const metadata: Metadata = createPublicPageMetadata({
  title: "How it works",
  description:
    "See how Ad Command Center moves from project setup and asset intake through creative approval, generation, and final multi-format delivery.",
  canonicalPath: "/how-it-works",
});

const stepArtifacts = [
  {
    eyebrow: "Project setup",
    detail: "Goal, audience, and launch pressure are established before any production logic kicks in.",
    chips: ["Launch objective", "Format plan", "Team owner"],
    ratio: "browser" as const,
  },
  {
    eyebrow: "Asset intake",
    detail: "The asset tray becomes a usable edit surface instead of a file dump.",
    chips: ["Pack shot", "Hand-held", "Packaging"],
    ratio: "landscape" as const,
  },
  {
    eyebrow: "Creative brief",
    detail: "Message hierarchy, concept angle, and first-pass script become explicit and reviewable.",
    chips: ["Hook options", "Benefit stack", "CTA"],
    ratio: "browser" as const,
  },
  {
    eyebrow: "Script review",
    detail: "The system exposes what changed so regeneration is precise, not random.",
    chips: ["Original", "Revision", "Approved"],
    ratio: "landscape" as const,
  },
  {
    eyebrow: "Storyboard approval",
    detail: "Each scene earns its place with a visual role, pacing note, and overlay intent.",
    chips: ["Scene role", "Overlay", "Timing"],
    ratio: "browser" as const,
  },
  {
    eyebrow: "Clip generation",
    detail: "Generation stays downstream from the creative decisions, not ahead of them.",
    chips: ["Shared pool", "Retry path", "QC ready"],
    ratio: "landscape" as const,
  },
  {
    eyebrow: "Live command view",
    detail: "Stage truth, role status, and fallback logic remain visible while the run is moving.",
    chips: ["Live", "Fallback", "Event feed"],
    ratio: "browser" as const,
  },
  {
    eyebrow: "Final delivery",
    detail: "The run closes with a usable output library rather than disconnected exports.",
    chips: ["Performance", "Brand", "Feature"],
    ratio: "landscape" as const,
  },
];

export default function HowItWorksPage() {
  return (
    <PageShell className="pb-16">
      <MarketingHeader />

      <section className="page-hero page-hero--story">
        <SectionIntro
          eyebrow="How it works"
          title="A sticky narrative that shows where the decisions happen."
          body="The workflow is linear on purpose. The review points are visible, the transitions are believable, and the expensive steps only start once the creative package is clear."
        />
      </section>

      <section className="workflow-story">
        {workflowSteps.map((step, index) => {
          const artifact = stepArtifacts[index];

          return (
            <article key={step.id} className="workflow-story__chapter">
              <div className="workflow-story__visual">
                <div className="workflow-story__visual-sticky">
                  <div className="workflow-story__frame">
                    <PlaceholderArt label={step.visualLabel} ratio={artifact.ratio} />
                    <div className="workflow-story__artifact">
                      <p className="eyebrow">{artifact.eyebrow}</p>
                      <p>{artifact.detail}</p>
                      <div className="chip-row">
                        {artifact.chips.map((chip, chipIndex) => (
                          <Chip key={chip} tone={chipIndex === 1 ? "accent" : chipIndex === 2 ? "cobalt" : "default"}>
                            {chip}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="workflow-story__copy">
                <div className="workflow-story__index">
                  <span>0{index + 1}</span>
                  <StatusBadge tone={index < 3 ? "success" : index < 6 ? "accent" : "default"}>
                    {index < 3 ? "Structured" : index < 6 ? "Active" : "Delivered"}
                  </StatusBadge>
                </div>
                <h2>{step.title}</h2>
                <p>{step.copy}</p>
                <EditorialDivider label="Operational truth" detail={artifact.eyebrow} />
                <div className="workflow-story__callouts">
                  <div>
                    <p className="eyebrow">Why it matters</p>
                    <p>{artifact.detail}</p>
                  </div>
                  <div>
                    <p className="eyebrow">What the user sees</p>
                    <p>
                      Clean artifacts, clear state, and enough context to approve or regenerate
                      without falling into guesswork.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <SiteFooter />
    </PageShell>
  );
}
