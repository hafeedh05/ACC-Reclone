import type { Metadata } from "next";
import Link from "next/link";
import {
  ButtonLink,
  Chip,
  MarketingHeader,
  PageShell,
  SiteFooter,
  StatusBadge,
} from "@/components/site-primitives";
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

const heroAssets = [
  {
    id: "01",
    label: "Primary pack",
    note: "Front-facing hero crop",
    tone: "amber" as const,
    media: mediaLibrary.heroSerum,
  },
  {
    id: "02",
    label: "Offer tray",
    note: "Controlled support composition",
    tone: "cobalt" as const,
    media: mediaLibrary.ecommerceTray,
  },
  {
    id: "03",
    label: "Travel kit",
    note: "Accessory cue for compact cuts",
    tone: "neutral" as const,
    media: mediaLibrary.chargerStill,
  },
  {
    id: "04",
    label: "Interior proof",
    note: "Space-led backdrop for wider exports",
    tone: "amber" as const,
    media: mediaLibrary.residentialStill,
  },
];

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

      <section className="home-hero-v2">
        <div className="home-hero-v2__copy">
          <Chip tone="accent">Campaign production</Chip>
          <h1 className="hero-title">Turn a brief into campaign-ready ads</h1>
          <p className="hero-body">
            Upload the assets, describe the offer, review the creative, and leave with polished
            variants shaped for paid, feed, landing, and handoff use.
          </p>
          <div className="hero-actions">
            <ButtonLink href="/how-it-works" variant="primary">
              See How It Works
            </ButtonLink>
            <ButtonLink href="/sample-runs" variant="secondary">
              Watch a Sample Run
            </ButtonLink>
          </div>
          <div className="hero-ledger">
            <div>
              <span>Upload</span>
              <strong>Assets + brief</strong>
            </div>
            <div>
              <span>Review</span>
              <strong>Script + storyboard</strong>
            </div>
            <div>
              <span>Receive</span>
              <strong>3 ratios / 4 cuts</strong>
            </div>
          </div>
        </div>

        <HeroConsole />
      </section>

      <section className="trust-whisper">
        <p className="eyebrow">Trusted by teams that care what the work looks like</p>
        <div className="trust-whisper__marks" aria-label="Who the product is for">
          {trustMarks.map((mark) => (
            <span key={mark}>{mark}</span>
          ))}
        </div>
      </section>

      <section className="home-sequence-v2">
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
      </section>

      <section className="home-command-v2">
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
      </section>

      <section className="home-proof-v2">
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
            <h3>Buying shapes that match how teams actually run work.</h3>
            <div className="pricing-column-v2">
              {pricingTiers.map((tier) => (
                <article key={tier.name}>
                  <div>
                    <p className="eyebrow">{tier.name}</p>
                    <strong>{tier.price}</strong>
                  </div>
                  <span>{tier.note}</span>
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
      </section>

      <SiteFooter />
    </PageShell>
  );
}

function HeroConsole() {
  return (
    <div className="hero-console hero-console--open" style={{ containerType: "inline-size" }}>
      <div className="hero-console__meta-line">
        <span>Northstar / run live</span>
        <span>Reviewed creative</span>
        <span>Script approved 09:13</span>
        <span>4 cuts mapped</span>
      </div>

      <div className="hero-console__open-grid">
        <aside className="hero-console__rail">
          <div className="hero-console__rail-intro">
            <p className="eyebrow">Brief</p>
            <h2>{heroRun.title}</h2>
            <p>{heroRun.summary}</p>
            <div className="hero-console__meta-stack">
              <span>{heroRun.industry}</span>
              <span>Reviewed creative</span>
              <span>Multi-format delivery</span>
            </div>
          </div>

          <div className="hero-console__goal-line">
            {heroRun.selectedGoals.slice(0, 2).map((goal) => (
              <div key={goal}>
                <span />
                <p>{goal}</p>
              </div>
            ))}
          </div>

          <div className="hero-console__asset-column">
            {heroAssets.slice(0, 3).map((asset) => (
              <article key={asset.id} className={`hero-asset hero-asset--open hero-asset--${asset.tone}`}>
                <div className="hero-asset__thumb" aria-hidden="true">
                  <EditorialMediaFrame
                    asset={asset.media}
                    aspect="square"
                    className="hero-asset__media"
                    sizes="140px"
                  />
                </div>
                <div className="hero-asset__copy">
                  <p>{asset.id}</p>
                  <strong>{asset.label}</strong>
                  <span>{asset.note}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="hero-console__approval-line">
            <span>Script approved</span>
            <span>Storyboard approved</span>
            <span>Four cuts planned</span>
          </div>
        </aside>

        <section className="hero-canvas">
          <div className="hero-canvas__head">
            <div>
              <p className="eyebrow">Campaign preview</p>
              <strong>Warm launch framing. Clear offer.</strong>
            </div>
            <StatusBadge tone="accent">Scene 03 live</StatusBadge>
          </div>

          <div className="hero-canvas__stage">
            <EditorialMediaFrame
              asset={mediaLibrary.heroSerum}
              aspect="landscape"
              className="hero-canvas__media"
              motion
              priority
              sizes="(min-width: 1280px) 38vw, 100vw"
            />
            <div className="hero-canvas__caption">
              <p className="eyebrow">Performance cut</p>
              <h3>Soft light, tighter claim stack, and a cleaner retail close.</h3>
              <span>Scene 03 is already feeding paid, brand, and platform routes.</span>
            </div>
            <div className="hero-canvas__status">
              <span>Hook approved 09:13</span>
              <span>Overlay locked</span>
              <span>Fallback prepared</span>
            </div>
          </div>

          <div className="hero-canvas__scene-strip">
            {[
              { id: "01", label: "Arrival", state: "on" },
              { id: "02", label: "Texture", state: "on" },
              { id: "03", label: "Reveal", state: "live" },
              { id: "04", label: "Close", state: "queued" },
            ].map((scene) => (
              <div
                key={scene.id}
                className={[
                  "hero-canvas__scene",
                  scene.state === "live" ? "is-live" : scene.state === "queued" ? "is-queued" : "is-on",
                ].join(" ")}
              >
                <b>{scene.id}</b>
                <span>{scene.label}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="hero-family">
          <p className="eyebrow">Output family</p>
          <div className="hero-family__list">
            {heroOutputs.map((output, index) => (
              <article key={`${output.name}-${output.aspect}`} className="hero-family__item">
                <MediaPlate
                  asset={mediaLibrary.heroSerum}
                  tone={index === 0 ? "amber" : index === 1 ? "cobalt" : "neutral"}
                  ratio={output.aspect}
                  title={output.name}
                  label="Output"
                  highlight={index === 0 ? "Live" : index === 1 ? "Ready" : "Queued"}
                  compact
                />
                <div>
                  <strong>{output.name}</strong>
                  <p>{output.note}</p>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>
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
