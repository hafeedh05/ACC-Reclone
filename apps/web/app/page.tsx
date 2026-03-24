import type { Metadata } from "next";
import Link from "next/link";
import {
  EditorialMediaFrame,
  mediaLibrary,
  mediaForRun,
} from "@/components/media-system";
import { MarketingHeader, SiteFooter } from "@/components/site-primitives";
import { buildJsonLd, createPublicPageMetadata, organizationJsonLd, softwareApplicationJsonLd } from "./seo";

export const metadata: Metadata = createPublicPageMetadata({
  title: "Campaign motion, perfected",
  description:
    "Aether Hyve turns asset sets, creative approvals, and live generation into cinematic ad systems that ship across the cuts a campaign actually needs.",
  canonicalPath: "/",
});

const phases = [
  {
    tag: "Phase 01",
    title: "Raw asset ingest.",
    body:
      "Bring the source set in once. Product stills, motion references, handheld coverage, and pack shots stay intact before any generation spend starts.",
    media: mediaLibrary.chargerStill,
    layout: "media-left",
  },
  {
    tag: "Phase 02",
    title: "Narrative direction.",
    body:
      "Lock the angle, the hook, and the scene order while the campaign is still easy to steer. The brief, script, and storyboard stay visible as one system.",
    media: mediaLibrary.residentialStill,
    layout: "media-right",
  },
  {
    tag: "Phase 03",
    title: "Automated mastery.",
    body:
      "Approved scenes move into generation, route into performance and brand cuts, and stay recoverable if one beat slips or a fallback still-pack has to take over.",
    media: mediaForRun("cobalt-travel-charger"),
    layout: "media-left",
  },
];

export default function HomePage() {
  return (
    <main className="aether-marketing-page" id="main-content">
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

      <section className="aether-home-hero">
        <div className="aether-home-hero__media">
          <EditorialMediaFrame
            asset={mediaLibrary.heroSerum}
            aspect="wide"
            className="aether-home-hero__media-frame"
            motion
            priority
            sizes="100vw"
          />
        </div>

        <div className="aether-home-hero__content">
          <p className="aether-kicker">Aether Hyve</p>
          <h1>Campaign Motion. Perfected.</h1>
          <p>
            Upload the source set, settle the creative direction, and leave with a cinematic
            output family built for 9:16, 1:1, and 16:9.
          </p>
          <div className="aether-hero-actions">
            <Link href="/app" className="aether-btn aether-btn--primary">
              Open Workspace
            </Link>
            <Link
              href="/sample-runs/cobalt-travel-charger"
              className="aether-btn aether-btn--ghost"
            >
              Watch Sample Run
            </Link>
          </div>
          <div className="aether-home-hero__proof">
            <span>Reviewed creative</span>
            <span>Live generation</span>
            <span>Multi-cut delivery</span>
          </div>
        </div>
      </section>

      <section className="aether-home-band">
        <div className="aether-home-band__inner">
          <span>Launch teams</span>
          <span>Brand studios</span>
          <span>Growth operators</span>
          <span>Enterprise creative</span>
        </div>
      </section>

      {phases.map((phase, index) => (
        <section
          key={phase.title}
          className={[
            "aether-phase",
            phase.layout === "media-right" ? "aether-phase--reverse" : "",
            index === 1 ? "aether-phase--surface" : "",
          ].join(" ")}
        >
          <div className="aether-phase__media">
            <EditorialMediaFrame
              asset={phase.media}
              aspect="landscape"
              className="aether-phase__frame"
              motion={index === 2}
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
          </div>
          <div className="aether-phase__copy">
            <p className="aether-kicker">{phase.tag}</p>
            <h2>{phase.title}</h2>
            <p>{phase.body}</p>
            {index === 1 ? (
              <div className="aether-phase__bullet">
                <span />
                <strong>Script, storyboard, and generation cues stay in one view.</strong>
              </div>
            ) : null}
            {index === 2 ? (
              <ul className="aether-phase__checklist">
                <li>Real-time scene routing</li>
                <li>Fallback-ready exports</li>
                <li>Command-center traceability</li>
              </ul>
            ) : null}
          </div>
        </section>
      ))}

      <section className="aether-home-cta">
        <div className="aether-home-cta__media">
          <EditorialMediaFrame
            asset={mediaLibrary.residentialStill}
            aspect="wide"
            className="aether-home-cta__frame"
            sizes="100vw"
          />
        </div>
        <div className="aether-home-cta__content">
          <h2>Seamless delivery.</h2>
          <p>
            Final exports stay ready for paid media, product launches, and higher-touch stakeholder
            review without rebuilding the system from scratch.
          </p>
          <div className="aether-hero-actions">
            <Link href="/pricing" className="aether-btn aether-btn--primary">
              Review pricing
            </Link>
            <Link href="/case-studies" className="aether-btn aether-btn--secondary">
              View case studies
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
