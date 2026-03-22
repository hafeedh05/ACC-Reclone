import type { Metadata } from "next";
import Link from "next/link";
import {
  ButtonLink,
  Chip,
  MarketingHeader,
  PageShell,
  SiteFooter,
} from "@/components/site-primitives";
import { RevealOnScroll } from "@/components/experience-chrome";
import {
  EditorialMediaFrame,
  mediaForCaseStudy,
  mediaForOutput,
  mediaLibrary,
  type MediaAsset,
} from "@/components/media-system";
import { CommandCenterShowcase } from "@/components/product-surfaces";
import {
  caseStudies,
  pricingTiers,
  sampleOutputs,
  sampleRuns,
  trustMarks,
} from "@/components/site-data";
import {
  buildJsonLd,
  createPublicPageMetadata,
  organizationJsonLd,
  softwareApplicationJsonLd,
} from "./seo";

const heroRun = sampleRuns[0];
const heroOutputs = heroRun.outputs.slice(0, 3);
const proofStudies = caseStudies.slice(0, 2);
const featuredOutput = sampleOutputs[1];
const outputRail = sampleOutputs.filter((output) => output.slug !== featuredOutput.slug).slice(0, 3);

const workflowMoments = [
  {
    label: "Source set",
    title: "Start with the assets, the offer, and one clean production direction.",
    note: "The brief should settle the campaign before anything expensive starts moving.",
  },
  {
    label: "Creative package",
    title: "Shape the script and storyboard while the work is still easy to steer.",
    note: "The strongest angle, scene order, and claim hierarchy are locked before clips are made.",
  },
  {
    label: "Output family",
    title: "Route one shared clip pool into the cuts the campaign actually needs.",
    note: "Performance, brand, feature, and platform exports stay related without feeling duplicated.",
  },
];

export const metadata: Metadata = createPublicPageMetadata({
  title: "Turn a brief into campaign-ready ads",
  description:
    "Ad Command Center turns uploaded assets, reviewed creative, and production logic into finished ad variants across the formats a campaign actually needs.",
  canonicalPath: "/",
});

export default function HomePage() {
  return (
    <PageShell className="pb-16">
      <script
        id="organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildJsonLd(organizationJsonLd()) }}
      />
      <script
        id="software-application-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildJsonLd(softwareApplicationJsonLd()) }}
      />

      <MarketingHeader />

      <section id="home-hero" className="home-hero-v2 journey-section journey-section--hero">
        <div className="home-hero-v2__copy">
          <p className="eyebrow">Campaign production</p>
          <h1 className="hero-title">Turn a brief into campaign-ready ads</h1>
          <p className="hero-body">
            Upload the asset set, review the angle, and leave with polished cuts for 9:16, 1:1,
            and 16:9.
          </p>
          <div className="hero-actions">
            <ButtonLink href="/how-it-works" variant="primary">
              See How It Works
            </ButtonLink>
            <ButtonLink href="/sample-runs" variant="secondary">
              Watch a Sample Run
            </ButtonLink>
          </div>
        <div className="hero-proof-row" aria-label="What the run produces">
          <span>Reviewed creative</span>
          <span>Four-cut family</span>
          <span>9:16 / 1:1 / 16:9</span>
        </div>
        </div>

        <HeroConsole />
      </section>

      <RevealOnScroll as="section" className="trust-whisper journey-section" delay={40}>
        <p className="eyebrow">Trusted by teams that care what the work looks like</p>
        <div className="trust-whisper__marks" aria-label="Who the product is for">
          {trustMarks.map((mark) => (
            <span key={mark}>{mark}</span>
          ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll
        as="section"
        id="home-workflow"
        className="home-sequence-v2 journey-section"
        variant="mask"
      >
        <div className="home-sequence-v2__copy">
          <p className="eyebrow">Workflow</p>
          <h2>One source set in. One disciplined output family out.</h2>
          <p>
            The material, the creative package, and the finished exports each get their own clear
            moment, so the run stays readable from first upload to final delivery.
          </p>

          <ol className="workflow-ledger">
            {workflowMoments.map((moment, index) => (
              <li key={moment.label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p>{moment.label}</p>
                  <strong>{moment.title}</strong>
                  <em>{moment.note}</em>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="home-sequence-v2__proof">
          <article className="featured-output">
            <MediaPlate
              asset={mediaForOutput(featuredOutput.slug)}
              tone="amber"
              ratio={featuredOutput.aspect.split(" / ")[0]}
              title={featuredOutput.title}
              label="Sample output"
              highlight="Brand cut"
            />
            <div className="featured-output__copy">
              <p className="eyebrow">{featuredOutput.category}</p>
              <strong>{featuredOutput.title}</strong>
              <p>{featuredOutput.summary}</p>
              <div className="chip-row">
                <Chip tone="accent">{featuredOutput.aspect}</Chip>
                <Chip tone="cobalt">Reviewed before generation</Chip>
              </div>
            </div>
          </article>

          <div className="output-rail-v2">
            {outputRail.map((output, index) => (
              <Link key={output.slug} href="/gallery" className="output-rail-v2__item">
                <MediaPlate
                  asset={mediaForOutput(output.slug)}
                  tone={index === 0 ? "cobalt" : index === 1 ? "neutral" : "amber"}
                  ratio={output.aspect.split(" / ")[0]}
                  title={output.title}
                  label={output.category}
                  highlight={output.aspect.split(" / ")[1] ?? output.aspect}
                  compact
                />
                <div>
                  <strong>{output.title}</strong>
                  <p>{output.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll
        as="section"
        id="home-command"
        className="home-command-v2 journey-section"
        delay={60}
      >
        <div className="home-command-v2__lead">
          <div className="home-command-v2__lead-copy">
            <p className="eyebrow">Command Center</p>
            <h2>See the run while it is still steerable.</h2>
            <p>
              Review gates, live artifacts, scene focus, route mapping, and fallback readiness stay
              visible in one calm operating surface.
            </p>
          </div>
          <div className="home-command-v2__lead-action">
            <ButtonLink href="/app/command-center" variant="secondary">
              Open the screen
            </ButtonLink>
          </div>
        </div>
        <CommandCenterShowcase compact />
      </RevealOnScroll>

      <RevealOnScroll
        as="section"
        id="home-proof"
        className="home-proof-v2 journey-section"
        delay={90}
      >
        <div className="home-proof-v2__studies">
          <div className="home-proof-v2__intro">
            <p className="eyebrow">Proof</p>
            <h2>Two proof pages worth opening.</h2>
            <p>
              Show the brief, the constraints, the decisions, and the delivered cuts clearly enough
              that the work sells itself.
            </p>
          </div>

          <div className="case-strip-v2">
            {proofStudies.map((study, index) => (
              <Link key={study.slug} href={`/case-studies/${study.slug}`} className="case-strip-v2__item">
                <MediaPlate
                  asset={mediaForCaseStudy(study.slug)}
                  tone={index === 0 ? "amber" : "cobalt"}
                  ratio="16:9"
                  title={study.title}
                  label={study.category}
                  highlight="Case study"
                  compact
                />
                <div className="case-strip-v2__copy">
                  <strong>{study.title}</strong>
                  <p>{study.dek}</p>
                  <div className="case-strip-v2__metrics">
                    {(study.metrics ?? []).slice(0, 2).map((metric) => (
                      <div key={metric.label}>
                        <span>{metric.label}</span>
                        <b>{metric.value}</b>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <aside className="home-commercial-v2">
          <div className="home-commercial-v2__pricing">
            <p className="eyebrow">Pricing</p>
            <h3>Credits are bought into the workspace balance and spent when a run starts.</h3>
            <div className="pricing-column-v2">
              {pricingTiers.map((tier) => (
                <article key={tier.name}>
                  <div>
                    <p className="eyebrow">{tier.name}</p>
                    <strong>{tier.price}</strong>
                    <b>{tier.credits}</b>
                  </div>
                  <span>{tier.runRange}</span>
                </article>
              ))}
            </div>
            <ButtonLink href="/pricing" variant="secondary">
              Review pricing
            </ButtonLink>
          </div>

          <div className="enterprise-note-v2">
            <p className="eyebrow">Enterprise</p>
            <h3>Governance, approvals, and operational visibility for teams running at scale.</h3>
            <p>
              Keep brand control, review logic, and output oversight intact across launches,
              markets, and stakeholders.
            </p>
            <ButtonLink href="/enterprise" variant="primary">
              Talk to Enterprise
            </ButtonLink>
          </div>
        </aside>
      </RevealOnScroll>

      <SiteFooter />
    </PageShell>
  );
}

function HeroConsole() {
  return (
    <div className="hero-console hero-console--open" style={{ containerType: "inline-size" }}>
      <section className="hero-canvas">
        <div className="hero-canvas__stage hero-canvas__stage--poster">
          <EditorialMediaFrame
            asset={mediaLibrary.heroSerum}
            aspect="landscape"
            className="hero-canvas__media"
            motion
            priority
            sizes="(min-width: 1280px) 52vw, 100vw"
          />
          <div className="hero-canvas__caption hero-canvas__caption--poster">
            <p className="eyebrow">Live preview</p>
            <h3>{heroRun.title}</h3>
            <span>Warm launch framing. Clear offer.</span>
          </div>
          <div className="hero-canvas__status hero-canvas__status--poster">
            <span>Scene 03 live</span>
            <span>Fallback ready</span>
          </div>
        </div>

        <div className="hero-canvas__info-row hero-canvas__info-row--poster">
          <div className="hero-console__support-block">
            <p className="eyebrow">Output family</p>
          </div>

          <div className="hero-console__format-list">
            {heroOutputs.map((output, index) => (
              <div key={`${output.name}-${output.aspect}`} className="hero-console__format-item">
                <span>{output.aspect}</span>
                <strong>{output.name}</strong>
                <b>{index === 0 ? "Live" : index === 1 ? "Ready" : "Queued"}</b>
              </div>
            ))}
          </div>

          <p className="hero-console__support-note">Reviewed before generation. Primary pack and offer tray already mapped.</p>
        </div>
      </section>
    </div>
  );
}

function MediaPlate({
  asset,
  tone,
  ratio,
  title,
  label,
  highlight,
  compact = false,
}: {
  asset: MediaAsset;
  tone: "amber" | "cobalt" | "neutral";
  ratio: string;
  title: string;
  label: string;
  highlight: string;
  compact?: boolean;
}) {
  return (
    <div className={["media-plate", `media-plate--${tone}`, compact ? "is-compact" : ""].join(" ")}>
      <div className="media-plate__shell">
        <EditorialMediaFrame
          asset={asset}
          aspect={ratio === "9:16" ? "portrait" : ratio === "1:1" ? "square" : "landscape"}
          className="media-plate__media"
          motion={Boolean(asset.videoSrc && !compact)}
          sizes={compact ? "220px" : "420px"}
        />
        <div className="media-plate__meta">
          <span>{ratio}</span>
          <b>{highlight}</b>
        </div>
      </div>
      <div className="media-plate__copy">
        <p>{label}</p>
        <strong>{title}</strong>
      </div>
    </div>
  );
}
