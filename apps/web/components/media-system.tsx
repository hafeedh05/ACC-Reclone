import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type MediaAsset = {
  imageSrc: string;
  alt: string;
  videoSrc?: string;
  posterSrc?: string;
  objectPosition?: CSSProperties["objectPosition"];
};

type MediaAspect = "landscape" | "portrait" | "square" | "wide";

const heroSerum: MediaAsset = {
  imageSrc: "/media/generated/hero-serum-thumb.webp",
  posterSrc: "/media/generated/hero-serum-thumb.webp",
  videoSrc: "/media/generated/hero-serum-loop.mp4",
  alt: "Amber dropper bottle arranged on charcoal fabric and a ceramic tray.",
  objectPosition: "60% 44%",
};

const ecommerceTray: MediaAsset = {
  imageSrc: "/media/generated/ecommerce-tray-thumb.webp",
  alt: "Amber skincare bottles arranged on a warm tray with a leaf detail.",
  objectPosition: "center center",
};

const apparelStill: MediaAsset = {
  imageSrc: "/media/generated/apparel-thumb.webp",
  alt: "Folded charcoal garment arranged on a quiet studio surface.",
  objectPosition: "center center",
};

const chargerStill: MediaAsset = {
  imageSrc: "/media/generated/charger-thumb.webp",
  alt: "Compact travel charger kit arranged on a matte tray.",
  objectPosition: "center center",
};

const residentialStill: MediaAsset = {
  imageSrc: "/media/generated/residential-thumb.webp",
  posterSrc: "/media/generated/residential-thumb.webp",
  videoSrc: "/media/generated/residential-loop.mp4",
  alt: "Premium residential interior with warm dusk light and floor-to-ceiling windows.",
  objectPosition: "center center",
};

const greensStill: MediaAsset = {
  imageSrc: "/media/generated/greens-thumb.webp",
  alt: "Premium supplement jar and scoop on a calm kitchen surface.",
  objectPosition: "center center",
};

const fallbackAsset = heroSerum;

const sampleRunMediaMap: Record<string, MediaAsset> = {
  "northstar-serum-launch": heroSerum,
  "morrow-weekend-drop": ecommerceTray,
  "atelier-summer-layering": apparelStill,
  "cobalt-travel-charger": chargerStill,
  "aster-house-launch": residentialStill,
  "kindred-daily-greens": greensStill,
};

const sampleOutputMediaMap: Record<string, MediaAsset> = {
  "northstar-beauty": heroSerum,
  "morrow-ecommerce": ecommerceTray,
  "atelier-apparel": apparelStill,
  "cobalt-accessory": chargerStill,
};

const caseStudyMediaMap: Record<string, MediaAsset> = {
  "northstar-launch-system": heroSerum,
  "morrow-weekend-drop-system": ecommerceTray,
  "aster-house-command-center": residentialStill,
  "cobalt-travel-launch-system": chargerStill,
};

const journalMediaMap: Record<string, MediaAsset> = {
  "why-creative-approval-belongs-before-generation": residentialStill,
  "the-right-way-to-think-about-aspect-ratios-in-launch-ads": chargerStill,
  "how-to-turn-one-asset-set-into-four-usable-variants": ecommerceTray,
  "designing-an-output-library-that-people-actually-use": heroSerum,
  "what-makes-a-sample-run-worth-landing-on-from-search": ecommerceTray,
  "why-command-center-surfaces-create-better-stakeholder-trust": residentialStill,
  "how-to-write-a-brief-that-survives-production": greensStill,
  "why-the-storyboard-becomes-the-real-approval-point": apparelStill,
};

export const mediaLibrary = {
  heroSerum,
  ecommerceTray,
  apparelStill,
  chargerStill,
  residentialStill,
  greensStill,
};

export function mediaForRun(slug: string) {
  return sampleRunMediaMap[slug] ?? fallbackAsset;
}

export function mediaForOutput(slug: string) {
  return sampleOutputMediaMap[slug] ?? fallbackAsset;
}

export function mediaForCaseStudy(slug: string) {
  return caseStudyMediaMap[slug] ?? fallbackAsset;
}

export function mediaForJournal(slug: string) {
  return journalMediaMap[slug] ?? fallbackAsset;
}

export function EditorialMediaFrame({
  asset,
  aspect = "landscape",
  className,
  priority = false,
  motion = false,
  sizes = "100vw",
  children,
}: {
  asset: MediaAsset;
  aspect?: MediaAspect;
  className?: string;
  priority?: boolean;
  motion?: boolean;
  sizes?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "editorial-media",
        `editorial-media--${aspect}`,
        asset.videoSrc && motion && "editorial-media--motion",
        className,
      )}
    >
      <Image
        alt={asset.alt}
        className="editorial-media__image"
        fill
        priority={priority}
        sizes={sizes}
        src={asset.imageSrc}
        style={{ objectPosition: asset.objectPosition }}
      />
      {asset.videoSrc && motion ? (
        <video
          aria-hidden="true"
          autoPlay
          className="editorial-media__video"
          loop
          muted
          playsInline
          poster={asset.posterSrc ?? asset.imageSrc}
          preload="none"
        >
          <source src={asset.videoSrc} type="video/mp4" />
        </video>
      ) : null}
      <div className="editorial-media__wash" />
      <div className="editorial-media__grain" />
      {children ? <div className="editorial-media__content">{children}</div> : null}
    </div>
  );
}
