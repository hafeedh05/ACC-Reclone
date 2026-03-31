export type NavItem = {
  href: string;
  label: string;
};

export type SampleOutput = {
  slug: string;
  category: string;
  title: string;
  aspect: string;
  summary: string;
  assetLabel: string;
};

export type WorkflowStep = {
  id: string;
  title: string;
  copy: string;
  visualLabel: string;
};

export type CommandRole = {
  name: string;
  status: string;
  note: string;
};

export type CaseStudyTeaser = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  outcome: string;
};

export type PricingTier = {
  name: string;
  price: string;
  credits: string;
  runRange: string;
  note: string;
  points: string[];
  ctaLabel: string;
  href: string;
  featured?: boolean;
};

export type GalleryItem = {
  slug: string;
  title: string;
  industry: string;
  aspect: string;
  campaignType: string;
  assetLabel: string;
  summary: string;
  detail: string;
  notes: string[];
  href: string;
};

export type SampleRun = {
  slug: string;
  title: string;
  industry: string;
  brief: string;
  concept: string;
  summary: string;
  selectedGoals: string[];
  selectedAssets: string[];
  assets: string[];
  approvedScript: string[];
  storyboard: Array<{ scene: string; note: string; overlay: string }>;
  stages: Array<{ name: string; note: string; status: string }>;
  outputs: Array<{ name: string; aspect: string; note: string; assetLabel: string }>;
  relatedSlugs: string[];
  ctaLabel: string;
  ctaHref: string;
};

export type Article = {
  slug: string;
  category: string;
  title: string;
  dek: string;
  author: string;
  date: string;
  readTime: string;
  summaryPoints?: string[];
  metrics?: Array<{ label: string; value: string; note: string }>;
  sections: Array<{ heading: string; body: string }>;
  relatedSlugs?: string[];
  cta?: {
    eyebrow: string;
    title: string;
    body: string;
    label: string;
    href: string;
  };
  challenge?: string;
  constraints?: string[];
  inputs?: string[];
  approach?: string[];
  outputs?: string[];
  outcomes?: string[];
  lessons?: string[];
};

export type ProjectRecord = {
  slug: string;
  name: string;
  industry: string;
  status: string;
  updatedAt: string;
  brief: string;
  goals: string[];
  formats: string[];
  assets: string[];
};

export type OutputRecord = {
  name: string;
  aspect: string;
  status: string;
  note: string;
};

export type CommandStage = {
  name: string;
  operational: string;
  theatrical: string;
  status: string;
  progress: number;
  note: string;
};

export type EventRow = {
  time: string;
  role: string;
  title: string;
  note: string;
  severity?: "default" | "warning";
};

export const marketingNav: NavItem[] = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/sample-runs", label: "Sample Runs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/journal", label: "Journal" },
  { href: "/enterprise", label: "Enterprise" },
];

export const trustMarks = [
  "Launch teams",
  "Brand studios",
  "Growth operators",
  "In-house creative",
  "Performance marketing",
];

export const sampleRunFilters = [
  "All",
  "Beauty",
  "Ecommerce",
  "Apparel",
  "Tech Accessory",
  "Residential",
  "Supplement",
];

export const galleryFilters = {
  industries: ["All", "Beauty", "Ecommerce", "Apparel", "Tech Accessory", "Supplement", "Residential"],
  ratios: ["All", "9:16", "1:1", "16:9"],
  campaignTypes: ["All", "Performance", "Brand", "Feature", "Platform"],
};

export const sampleOutputs: SampleOutput[] = [
  {
    slug: "northstar-beauty",
    category: "Beauty",
    title: "Northstar Renewal Serum",
    aspect: "9:16 / Performance Cut",
    summary: "Pack-shot-led beauty creative with warm skincare tone and direct claim hierarchy.",
    assetLabel: "Serum hero visual",
  },
  {
    slug: "morrow-ecommerce",
    category: "Ecommerce",
    title: "Weekend Texture Loop",
    aspect: "1:1 / Brand Cut",
    summary: "Soft product texture, clean offer framing, and a compact conversion-friendly story.",
    assetLabel: "Offer-led product visual",
  },
  {
    slug: "atelier-apparel",
    category: "Apparel",
    title: "Summer Layering Study",
    aspect: "16:9 / Feature Cut",
    summary: "Motion-led apparel sequence with restrained copy and fit-focused scene progression.",
    assetLabel: "Editorial motion visual",
  },
  {
    slug: "cobalt-accessory",
    category: "Tech Accessory",
    title: "Carry-Light Charger Cut",
    aspect: "9:16 / Platform Cut",
    summary: "Accessory-first launch creative built for retail cutdowns and repeatable platform placements.",
    assetLabel: "Travel utility visual",
  },
];

export const workflowSteps: WorkflowStep[] = [
  {
    id: "create-project",
    title: "Create project",
    copy: "Start from the campaign objective, the offer, and the formats your team needs to leave with.",
    visualLabel: "Campaign workspace",
  },
  {
    id: "upload-brief",
    title: "Upload assets and brief",
    copy: "Bring in pack shots, device captures, hand-held imagery, and any references worth preserving.",
    visualLabel: "Source set preview",
  },
  {
    id: "generate-script",
    title: "Generate creative brief + script package",
    copy: "The system shapes the angle, the script, and the first pass of the campaign structure before any media work starts.",
    visualLabel: "Script package preview",
  },
  {
    id: "review-script",
    title: "Review or regenerate script",
    copy: "Adjust the hook, tighten the promise, and keep the expensive work downstream from a clear creative direction.",
    visualLabel: "Review overlay",
  },
  {
    id: "approve-storyboard",
    title: "Approve storyboard",
    copy: "Each scene earns its place through motion notes, overlays, and the exact role it plays in the final cut.",
    visualLabel: "Storyboard sequence",
  },
  {
    id: "run-generation",
    title: "Run clip generation",
    copy: "Scene prompts, quality checks, and fallback paths work from one shared clip pool.",
    visualLabel: "Clip generation board",
  },
  {
    id: "follow-progress",
    title: "Follow progress in command center",
    copy: "Watch the production run with live events, role status, stage truth, and recovery signals when something needs attention.",
    visualLabel: "Command workspace",
  },
  {
    id: "receive-variants",
    title: "Receive 3–4 final variants",
    copy: "Finish with an output set that can be published, handed off, or reshaped for multiple channels without starting over.",
    visualLabel: "Output family",
  },
];

export const commandRoles: CommandRole[] = [
  {
    name: "Head Writer",
    status: "Locked",
    note: "Objective normalized and audience intent anchored.",
  },
  {
    name: "Hook Writer",
    status: "Ready",
    note: "Top openers ranked for scroll-stop strength.",
  },
  {
    name: "Benefit Writer",
    status: "Ready",
    note: "Benefit stack aligned to the strongest visual proof.",
  },
  {
    name: "Brand Voice Editor",
    status: "In pass",
    note: "Language is being tightened to stay premium and controlled.",
  },
  {
    name: "Storyboard Lead",
    status: "Queued",
    note: "Scene pacing and overlays are staged for approval.",
  },
  {
    name: "Variant Strategist",
    status: "Queued",
    note: "Shared clip pool will be mapped into four disciplined cuts.",
  },
  {
    name: "Clip Lab",
    status: "Waiting",
    note: "Generation starts once approvals are locked.",
  },
  {
    name: "Editor Desk",
    status: "Waiting",
    note: "Final assembly and delivery will follow the shared pool.",
  },
];

export const caseStudyTeasers: CaseStudyTeaser[] = [
  {
    slug: "northstar-launch",
    category: "Beauty",
    title: "A skincare launch built from pack shots and one sharp promise",
    summary: "A compact asset set became four distinct cuts with one consistent brand voice.",
    outcome: "Four launch-ready variants across 9:16, 1:1, and 16:9",
  },
  {
    slug: "morrow-drop",
    category: "Ecommerce",
    title: "A weekend drop turned into a clean multi-format campaign set",
    summary: "The workflow kept the creative tight enough for performance use without flattening the brand tone.",
    outcome: "Shared clip pool reused across brand and performance cuts",
  },
  {
    slug: "cobalt-travel",
    category: "Tech Accessory",
    title: "A product-led travel accessory launch that kept clarity under pressure",
    summary: "Visual proof, utility language, and packaging detail were sequenced into a sharper output library.",
    outcome: "Faster review cycles and cleaner platform-specific exports",
  },
];

export const pricingTiers: PricingTier[] = [
  {
    name: "Launch",
    price: "$299",
    credits: "240 credits",
    runRange: "About 3 to 5 guided runs",
    note: "For smaller teams buying credits into one workspace and using them campaign by campaign.",
    points: [
      "Credits land in the workspace balance and are only spent when generation starts",
      "Best for focused launches, offer tests, and paid refreshes",
      "Includes the full review flow, approvals, and export packaging",
    ],
    ctaLabel: "Set up launch credits",
    href: "/contact",
  },
  {
    name: "Studio",
    price: "$799",
    credits: "720 credits",
    runRange: "About 10 to 14 guided runs",
    note: "For teams running a steady output rhythm and keeping a reusable credit reserve inside the workspace.",
    points: [
      "Lower effective credit rate for teams shipping every week",
      "Shared balance, reusable production structure, and stronger project organization",
      "Built for recurring launches, performance refreshes, and multi-cut output families",
    ],
    ctaLabel: "Set up studio billing",
    href: "/contact",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    credits: "Pooled credits",
    runRange: "Annual or quarterly volume planning",
    note: "For organizations that need pooled credits, governance, procurement support, and cross-team control.",
    points: [
      "Pooled balances across multiple teams, brands, or markets",
      "Approval logic, governance, operational visibility, and rollout discipline",
      "Annual billing, onboarding design, and account-level support",
    ],
    ctaLabel: "Talk to enterprise",
    href: "/enterprise",
  },
];

export const galleryItems: GalleryItem[] = [
  {
    slug: "gallery-beauty-01",
    title: "Skincare renewal launch",
    industry: "Beauty",
    aspect: "9:16",
    campaignType: "Performance",
    assetLabel: "Macro serum frame",
    summary: "Warm, close product storytelling with a disciplined claim hierarchy and a premium close.",
    detail: "Texture, bottle form, and a single promise stay in frame long enough to feel expensive without over-explaining the product.",
    notes: ["Macro proof", "Warm amber palette", "Vertical first"],
    href: "/sample-runs/northstar-serum-launch",
  },
  {
    slug: "gallery-ecommerce-01",
    title: "Weekend bundle drop",
    industry: "Ecommerce",
    aspect: "1:1",
    campaignType: "Brand",
    assetLabel: "Offer-led bundle frame",
    summary: "A quiet offer story that keeps packaging, price framing, and product texture in one premium pass.",
    detail: "The cut stays readable on social without collapsing into retail clutter, which makes it useful for launches and retargeting alike.",
    notes: ["Offer clarity", "Square export", "Brand-safe pacing"],
    href: "/sample-runs/morrow-weekend-drop",
  },
  {
    slug: "gallery-apparel-01",
    title: "Apparel styling cut",
    industry: "Apparel",
    aspect: "16:9",
    campaignType: "Feature",
    assetLabel: "Runway styling frame",
    summary: "Long-form apparel sequencing that gives the brand room to breathe while still landing the product details.",
    detail: "Fabric, movement, and fit are given room to read without turning the sequence into a generic fashion reel.",
    notes: ["Editorial pace", "Fit-led proof", "Landscape format"],
    href: "/sample-runs/atelier-summer-layering",
  },
  {
    slug: "gallery-tech-01",
    title: "Travel charger story",
    industry: "Tech Accessory",
    aspect: "9:16",
    campaignType: "Platform",
    assetLabel: "Utility access frame",
    summary: "A compact accessory story that makes use case and portability obvious in the first few seconds.",
    detail: "The sequence keeps the product legible in mobile placements and avoids unnecessary motion clutter.",
    notes: ["Utility proof", "Compact export", "Platform-ready"],
    href: "/sample-runs/cobalt-travel-charger",
  },
  {
    slug: "gallery-supplement-01",
    title: "Supplement product focus",
    industry: "Supplement",
    aspect: "1:1",
    campaignType: "Performance",
    assetLabel: "Routine stack frame",
    summary: "A health-focused product cut with restrained language and enough structure to work in paid placements.",
    detail: "The creative language stays disciplined and avoids the overblown claims that make supplement ads feel untrustworthy.",
    notes: ["Routine framing", "Square crop", "Claim restraint"],
    href: "/sample-runs/northstar-serum-launch",
  },
  {
    slug: "gallery-residential-01",
    title: "Residential launch sequence",
    industry: "Residential",
    aspect: "16:9",
    campaignType: "Brand",
    assetLabel: "Daylight interior frame",
    summary: "A property story that uses space, light, and breathing room instead of fake dashboard energy.",
    detail: "The frame logic stays calm and editorial so the space can do the persuasion work.",
    notes: ["Premium pacing", "Interior light", "Sales-ready"],
    href: "/sample-runs/aster-house-launch",
  },
  {
    slug: "gallery-beauty-02",
    title: "Evening routine sequence",
    industry: "Beauty",
    aspect: "16:9",
    campaignType: "Brand",
    assetLabel: "Evening ritual frame",
    summary: "A slower brand-led beauty cut that gives texture and ritual enough room to register.",
    detail: "This cut is built for site embeds and social proof, not for trying to do every job at once.",
    notes: ["Brand cadence", "Wider frame", "Ritual language"],
    href: "/sample-runs/northstar-serum-launch",
  },
  {
    slug: "gallery-beverage-01",
    title: "Shelf-ready beverage launch",
    industry: "Beverage",
    aspect: "9:16",
    campaignType: "Feature",
    assetLabel: "Shelf hero frame",
    summary: "A product-first beverage layout that reads cleanly on mobile and keeps the packaging hero intact.",
    detail: "It is designed to work as both an acquisition cut and a landing-page visual without re-editing the concept.",
    notes: ["Retail clarity", "Mobile first", "Shelf presence"],
    href: "/sample-runs/morrow-weekend-drop",
  },
];

export const sampleRuns: SampleRun[] = [
  {
    slug: "northstar-serum-launch",
    title: "Northstar Serum Launch",
    industry: "Beauty",
    brief:
      "Launch a premium daily serum using pack shots and close product handling. Keep the tone warm, disciplined, and conversion-aware.",
    concept:
      "A controlled story that moves from texture and proof into a clear premium promise, then splits into performance, brand, feature, and platform cuts.",
    summary: "A tight beauty launch that feels editorial, not overbuilt, and gives the product room to earn trust.",
    selectedGoals: ["Launch premium skincare", "Keep claims disciplined", "Export every aspect ratio"],
    selectedAssets: ["Amber bottle portrait", "Serum texture pour", "Palm application frame", "Carton detail"],
    assets: ["Amber bottle portrait", "Serum texture pour", "Palm application frame", "Carton detail"],
    approvedScript: [
      "Open on texture, not hype.",
      "Name the promise once.",
      "Close on the result and the CTA.",
    ],
    storyboard: [
      {
        scene: "01",
        note: "Macro detail establishes warmth, texture, and premium restraint.",
        overlay: "Soft claim / clean opener",
      },
      {
        scene: "02",
        note: "Hand-held use adds scale and keeps the product feel grounded.",
        overlay: "Use once daily / proof line",
      },
      {
        scene: "03",
        note: "The bottle holds on the promise so the final beat lands cleanly.",
        overlay: "Result first / CTA close",
      },
    ],
    stages: [
      { name: "Brief normalized", note: "Audience and offer locked into one campaign angle.", status: "Complete" },
      { name: "Script package", note: "Hook, benefit stack, and CTA refined.", status: "Approved" },
      { name: "Storyboard", note: "Four scene structure with copy overlays and pacing notes.", status: "Approved" },
      { name: "Clip generation", note: "Reusable pool prepared for multiple cuts.", status: "Complete" },
      { name: "Assembly", note: "Output variants composed and packaged.", status: "Delivered" },
    ],
    outputs: [
      { name: "Performance Cut", aspect: "9:16", note: "Sharp hook and early proof.", assetLabel: "Vertical opener frame" },
      { name: "Brand Cut", aspect: "1:1", note: "Tone-led pacing with softer proof.", assetLabel: "Texture-led square frame" },
      { name: "Feature Cut", aspect: "16:9", note: "Longer product explanation.", assetLabel: "Editorial landscape frame" },
      { name: "Platform Cut", aspect: "9:16", note: "Compact retail-friendly export.", assetLabel: "Retail-ready mobile frame" },
    ],
    relatedSlugs: ["morrow-weekend-drop", "cobalt-travel-charger", "aster-house-launch"],
    ctaLabel: "Request a similar launch",
    ctaHref: "/contact",
  },
  {
    slug: "morrow-weekend-drop",
    title: "Morrow Weekend Drop",
    industry: "Ecommerce",
    brief:
      "Turn a compact asset set into a polished campaign for a weekend product drop with strong offer clarity and premium restraint.",
    concept:
      "Keep the offer visible, preserve brand tone, and let packaging, scale, and texture do the heavy lifting.",
    summary: "An ecommerce drop that keeps offer framing crisp and the asset set small enough to stay agile.",
    selectedGoals: ["Clarify the offer", "Keep the brand tone premium", "Avoid over-explaining the product"],
    selectedAssets: ["Tray hero composition", "Offer panel crop", "Bundle detail frame", "Editorial close crop"],
    assets: ["Tray hero composition", "Offer panel crop", "Bundle detail frame", "Editorial close crop"],
    approvedScript: [
      "Lead with the offer, not the motion.",
      "Let texture carry the brand tone.",
      "Close with one precise next step.",
    ],
    storyboard: [
      {
        scene: "01",
        note: "The product and offer sit together so the value proposition is immediate.",
        overlay: "Weekend drop / offer first",
      },
      {
        scene: "02",
        note: "A tighter crop keeps the package feeling premium instead of busy.",
        overlay: "Limited run / clean read",
      },
      {
        scene: "03",
        note: "The end frame stays calm so the CTA can do the work.",
        overlay: "Shop the set / one action",
      },
    ],
    stages: [
      { name: "Brief normalized", note: "Offer clarity aligned to the drop window.", status: "Complete" },
      { name: "Script package", note: "Lean language keeps the offer clean and premium.", status: "Approved" },
      { name: "Storyboard", note: "Shorter scene structure for quick platform use.", status: "Approved" },
      { name: "Clip generation", note: "Light product motions and editorial cutaways rendered.", status: "Complete" },
      { name: "Assembly", note: "Four outputs packaged for launch week.", status: "Delivered" },
    ],
    outputs: [
      { name: "Performance Cut", aspect: "1:1", note: "Offer-forward square export.", assetLabel: "Offer-forward square frame" },
      { name: "Brand Cut", aspect: "16:9", note: "Editorial pacing for site and brand channels.", assetLabel: "Editorial brand frame" },
      { name: "Platform Cut", aspect: "9:16", note: "Condensed mobile-ready variant.", assetLabel: "Mobile launch frame" },
    ],
    relatedSlugs: ["northstar-serum-launch", "atelier-summer-layering", "cobalt-travel-charger"],
    ctaLabel: "See a similar campaign",
    ctaHref: "/contact",
  },
  {
    slug: "atelier-summer-layering",
    title: "Atelier Summer Layering",
    industry: "Apparel",
    brief:
      "Show a small apparel set in a way that reads editorial first and retail-ready second.",
    concept:
      "The pacing stays light and tactile so the fabrics, fit, and movement do the persuasion work without turning into a generic runway reel.",
    summary: "An apparel sequence that keeps movement, fit, and texture in a disciplined editorial frame.",
    selectedGoals: ["Show fit clearly", "Preserve brand tone", "Produce landscape and social cuts"],
    selectedAssets: ["Entrance silhouette", "Fabric sweep detail", "Look-down hold", "Stride close frame"],
    assets: ["Entrance silhouette", "Fabric sweep detail", "Look-down hold", "Stride close frame"],
    approvedScript: [
      "Open with movement, not montage.",
      "Let texture show the quality.",
      "Hold one frame long enough to read the fit.",
    ],
    storyboard: [
      {
        scene: "01",
        note: "A clean first move establishes shape and silhouette without noise.",
        overlay: "Fit first / soft opening",
      },
      {
        scene: "02",
        note: "Fabric detail and motion together make the quality legible.",
        overlay: "Texture / light handoff",
      },
      {
        scene: "03",
        note: "The closing frame widens out for the longer brand cut.",
        overlay: "Summer layer / final hold",
      },
    ],
    stages: [
      { name: "Brief normalized", note: "Apparel angle locked to fit and fabric.", status: "Complete" },
      { name: "Script package", note: "Copy stays light so the visuals remain the lead.", status: "Approved" },
      { name: "Storyboard", note: "Movement beats and holds are mapped for export.", status: "Approved" },
      { name: "Clip generation", note: "Editorial motions rendered against a shared motion pool.", status: "Complete" },
      { name: "Assembly", note: "Aspect-specific variants are packaged for handoff.", status: "Delivered" },
    ],
    outputs: [
      { name: "Performance Cut", aspect: "9:16", note: "Fast entry for mobile placements.", assetLabel: "Vertical motion frame" },
      { name: "Brand Cut", aspect: "1:1", note: "Clean square framing for feed use.", assetLabel: "Square fabric frame" },
      { name: "Feature Cut", aspect: "16:9", note: "Slower look at fit and finishing.", assetLabel: "Landscape editorial frame" },
      { name: "Platform Cut", aspect: "9:16", note: "Compact retail-ready export.", assetLabel: "Platform motion frame" },
    ],
    relatedSlugs: ["northstar-serum-launch", "morrow-weekend-drop", "aster-house-launch"],
    ctaLabel: "Build this apparel flow",
    ctaHref: "/contact",
  },
  {
    slug: "cobalt-travel-charger",
    title: "Cobalt Travel Charger",
    industry: "Tech Accessory",
    brief:
      "Turn a small utility product into a confident launch system that reads clearly in mobile placements and landing-page embeds.",
    concept:
      "The product stays legible at every step: use case first, portability second, and just enough motion to keep the cut alive.",
    summary: "A utility-led accessory launch that makes the product legible before it tries to be stylish.",
    selectedGoals: ["Show utility", "Preserve product clarity", "Fit social and retail"],
    selectedAssets: ["Desk reveal", "Carry pouch context", "Travel tray frame", "Connector detail"],
    assets: ["Desk reveal", "Carry pouch context", "Travel tray frame", "Connector detail"],
    approvedScript: [
      "Lead with the use case.",
      "Keep the form factor obvious.",
      "Close on why it matters on the move.",
    ],
    storyboard: [
      {
        scene: "01",
        note: "The charger appears in context so the utility reads immediately.",
        overlay: "Travel ready / quick reveal",
      },
      {
        scene: "02",
        note: "A tighter product hold keeps the design legible in vertical formats.",
        overlay: "Compact power / clear read",
      },
      {
        scene: "03",
        note: "The end card anchors the CTA without overloading the frame.",
        overlay: "Charge anywhere / final beat",
      },
    ],
    stages: [
      { name: "Brief normalized", note: "Use case and placement rules were locked in early.", status: "Complete" },
      { name: "Script package", note: "The language stays utility-first and concise.", status: "Approved" },
      { name: "Storyboard", note: "Mobile-first staging keeps the object readable.", status: "Approved" },
      { name: "Clip generation", note: "Context and product shots are rendered into a shared pool.", status: "Complete" },
      { name: "Assembly", note: "The output set packages cleanly for launch.", status: "Delivered" },
    ],
    outputs: [
      { name: "Performance Cut", aspect: "9:16", note: "Utility hook for mobile-first placements.", assetLabel: "Vertical utility frame" },
      { name: "Brand Cut", aspect: "1:1", note: "Balanced square export for feed use.", assetLabel: "Square product frame" },
      { name: "Feature Cut", aspect: "16:9", note: "Longer landing-page version.", assetLabel: "Landscape use-case frame" },
      { name: "Platform Cut", aspect: "9:16", note: "Compressed retail-ready version.", assetLabel: "Compact platform frame" },
    ],
    relatedSlugs: ["morrow-weekend-drop", "northstar-serum-launch", "aster-house-launch"],
    ctaLabel: "Request a similar product launch",
    ctaHref: "/contact",
  },
  {
    slug: "aster-house-launch",
    title: "Aster House Launch",
    industry: "Residential",
    brief:
      "Present a residential offering with enough space, light, and calm to feel premium across inquiry, brand, and sales placements.",
    concept:
      "The narrative stays close to place and atmosphere, letting architecture and daylight do the selling while the format work stays invisible.",
    summary: "A residential campaign that uses light and spatial calm instead of generic property marketing tropes.",
    selectedGoals: ["Drive high-intent inquiry", "Protect premium positioning", "Work across site and paid"],
    selectedAssets: ["Arrival lounge", "Window line", "Exterior dusk", "View axis"],
    assets: ["Arrival lounge", "Window line", "Exterior dusk", "View axis"],
    approvedScript: [
      "Open on space and light.",
      "Let the property feel lived-in but elevated.",
      "End with one clear action to inquire.",
    ],
    storyboard: [
      {
        scene: "01",
        note: "Warm light and wide space give the launch its premium tone.",
        overlay: "Calm arrival / space first",
      },
      {
        scene: "02",
        note: "Interior details keep the property grounded and believable.",
        overlay: "Materials / daylight / detail",
      },
      {
        scene: "03",
        note: "The closing frame moves to the exterior and the CTA.",
        overlay: "Book a viewing / final hold",
      },
    ],
    stages: [
      { name: "Brief normalized", note: "Offer, audience, and format mix were aligned.", status: "Complete" },
      { name: "Script package", note: "Copy stays calm and avoids over-selling.", status: "Approved" },
      { name: "Storyboard", note: "Space, light, and detail are sequenced for trust.", status: "Approved" },
      { name: "Clip generation", note: "Architectural motion and interior holds were composed.", status: "Complete" },
      { name: "Assembly", note: "Final exports are packaged for sales and paid media.", status: "Delivered" },
    ],
    outputs: [
      { name: "Performance Cut", aspect: "9:16", note: "Inquiry-first vertical export.", assetLabel: "Vertical property frame" },
      { name: "Brand Cut", aspect: "1:1", note: "Balanced feed-ready presentation.", assetLabel: "Square interior frame" },
      { name: "Feature Cut", aspect: "16:9", note: "Wider walkthrough for site and presentations.", assetLabel: "Landscape property frame" },
      { name: "Platform Cut", aspect: "9:16", note: "Compact mobile-friendly version.", assetLabel: "Platform property frame" },
    ],
    relatedSlugs: ["northstar-serum-launch", "morrow-weekend-drop", "cobalt-travel-charger"],
    ctaLabel: "Talk through a residential launch",
    ctaHref: "/contact",
  },
  {
    slug: "kindred-daily-greens",
    title: "Kindred Daily Greens",
    industry: "Supplement",
    brief:
      "Launch a daily greens system with enough ritual and proof to feel premium, calm, and genuinely usable across acquisition and retention placements.",
    concept:
      "Build the story around ritual, product clarity, and a clean proof sequence so the campaign feels like a daily habit, not a hard-sell health ad.",
    summary: "A supplement launch that leans into ritual, taste, and repeat use without losing premium control.",
    selectedGoals: ["Show ritual clearly", "Keep the offer calm", "Package a reusable output family"],
    selectedAssets: ["Jar hero", "Daily routine", "Scoop detail", "Kitchen light"],
    assets: ["Jar hero", "Daily routine", "Scoop detail", "Kitchen light"],
    approvedScript: [
      "Open on routine, not urgency.",
      "Make the mix and the jar feel clean and legible.",
      "Close on consistency, not exaggeration.",
    ],
    storyboard: [
      {
        scene: "01",
        note: "Morning setup establishes ritual before any claim language appears.",
        overlay: "Daily routine / calm opener",
      },
      {
        scene: "02",
        note: "Scoop and pour detail bring the product into the frame without noise.",
        overlay: "Clean mix / product proof",
      },
      {
        scene: "03",
        note: "The close holds on the jar and glass so the CTA lands with confidence.",
        overlay: "Build the habit / final hold",
      },
    ],
    stages: [
      { name: "Brief normalized", note: "Ritual angle aligned to retention and acquisition goals.", status: "Complete" },
      { name: "Script package", note: "Language stays calm and premium instead of over-claiming.", status: "Approved" },
      { name: "Storyboard", note: "Ritual, proof, and CTA beats are locked into a usable sequence.", status: "Approved" },
      { name: "Clip generation", note: "Preparation, pour, and product holds rendered into one shared pool.", status: "Complete" },
      { name: "Assembly", note: "The final family is packaged for social, landing, and retention use.", status: "Delivered" },
    ],
    outputs: [
      { name: "Performance Cut", aspect: "9:16", note: "Routine-first opening for mobile acquisition.", assetLabel: "Vertical ritual frame" },
      { name: "Brand Cut", aspect: "1:1", note: "Square crop that holds on the product and ritual cues.", assetLabel: "Square ritual frame" },
      { name: "Feature Cut", aspect: "16:9", note: "Longer story built for landing pages and product education.", assetLabel: "Landscape routine frame" },
      { name: "Platform Cut", aspect: "9:16", note: "Compact version for retention and community channels.", assetLabel: "Mobile habit frame" },
    ],
    relatedSlugs: ["northstar-serum-launch", "morrow-weekend-drop", "atelier-summer-layering"],
    ctaLabel: "Build a similar ritual-led launch",
    ctaHref: "/contact",
  },
];

export const journalArticles: Article[] = [
  {
    slug: "why-creative-approval-belongs-before-generation",
    category: "Workflow",
    title: "Why creative approval belongs before generation",
    dek: "The fastest way to waste time in an ad system is to generate media before the campaign angle is actually clear.",
    author: "Ad Command Center",
    date: "March 20, 2026",
    readTime: "6 min read",
    summaryPoints: [
      "Approval should lock the angle before the expensive media stage.",
      "Script and storyboard reviews reduce revision churn downstream.",
      "A clear sign-off path makes the production system safer to scale.",
    ],
    metrics: [
      { label: "Review gates", value: "2", note: "Script and storyboard approvals keep the pipeline honest." },
      { label: "Output lift", value: "4x", note: "One clean decision flow protects multiple variants." },
      { label: "Failure mode", value: "Late approval", note: "Generation before clarity multiplies rework." },
    ],
    sections: [
      {
        heading: "The false speed problem",
        body: "Teams often rush into media generation because it feels like the visible part of the process. In practice, unclear creative direction only multiplies revisions downstream. A better system makes the brief, the hook, and the storyboard explicit before the expensive stage begins.",
      },
      {
        heading: "Review points that keep the system honest",
        body: "The most useful approvals are lightweight and specific. Script approval confirms the message. Storyboard approval confirms the pacing. After that, generation and assembly can move with fewer surprises and less random iteration.",
      },
      {
        heading: "Why this matters for product teams",
        body: "A polished workflow is not just about visuals. It changes how quickly teams can align, how safely they can scale, and how consistently they can ship campaign work without rebuilding the process every time.",
      },
    ],
    relatedSlugs: [
      "the-right-way-to-think-about-aspect-ratios-in-launch-ads",
      "how-to-turn-one-asset-set-into-four-usable-variants",
      "why-command-center-surfaces-create-better-stakeholder-trust",
    ],
    cta: {
      eyebrow: "Workflow",
      title: "See the same approval logic in the sample runs.",
      body: "Sample runs show the sequence from brief to approval to final output without hiding the decision points.",
      label: "Watch Sample Runs",
      href: "/sample-runs",
    },
  },
  {
    slug: "the-right-way-to-think-about-aspect-ratios-in-launch-ads",
    category: "Creative Ops",
    title: "The right way to think about aspect ratios in launch ads",
    dek: "Aspect ratio should be a production decision, not a formatting afterthought.",
    author: "Ad Command Center",
    date: "March 19, 2026",
    readTime: "5 min read",
    summaryPoints: [
      "Different ratios deserve different edit intent, not simple crops.",
      "The shared clip pool should be planned around the weakest placement first.",
      "Vertical, square, and landscape each play a different acquisition role.",
    ],
    metrics: [
      { label: "Core ratios", value: "3", note: "9:16, 1:1, and 16:9 should each earn a clear role." },
      { label: "Planning rule", value: "Weakest first", note: "Design the story for the hardest placement before repurposing." },
      { label: "Output family", value: "4", note: "A disciplined variant set beats a large generic pile." },
    ],
    sections: [
      {
        heading: "Do not crop first, plan first",
        body: "If the story is built for one rectangle and force-fit into the others, the result usually feels compromised. A better workflow starts by assigning each ratio a purpose: scroll stop, brand resonance, or product explanation.",
      },
      {
        heading: "Use ratio-specific promises",
        body: "Vertical should earn immediate attention. Square should feel balanced and premium. Landscape should carry the fuller product argument and more deliberate pacing. That separation keeps the output library useful across channels.",
      },
      {
        heading: "Why this matters for the business",
        body: "Teams that understand ratios early waste less time on late edits, get more value from the same source footage, and publish assets that are clearly fit for purpose instead of barely acceptable everywhere.",
      },
    ],
    relatedSlugs: [
      "how-to-turn-one-asset-set-into-four-usable-variants",
      "designing-an-output-library-that-people-actually-use",
      "how-to-write-a-brief-that-survives-production",
    ],
    cta: {
      eyebrow: "Ratios",
      title: "See how the sample runs package each ratio differently.",
      body: "The proof pages show why the ratio logic is part of the creative system, not an export setting.",
      label: "Open a Sample Run",
      href: "/sample-runs/northstar-serum-launch",
    },
  },
  {
    slug: "how-to-turn-one-asset-set-into-four-usable-variants",
    category: "Production",
    title: "How to turn one asset set into four usable variants",
    dek: "The best ad systems do not multiply assets blindly. They create distinct cuts from a shared production spine.",
    author: "Ad Command Center",
    date: "March 18, 2026",
    readTime: "7 min read",
    summaryPoints: [
      "Shared production spines prevent visual drift between variants.",
      "Each output needs a different job, not just a different length.",
      "A variant strategy should describe intent before layout.",
    ],
    metrics: [
      { label: "Variant target", value: "4", note: "Performance, brand, feature, and platform cuts." },
      { label: "Reuse model", value: "1 pool", note: "One shared clip pool keeps the family coherent." },
      { label: "Fallback", value: "Animated stills", note: "A useful backup when a scene fails quality." },
    ],
    sections: [
      {
        heading: "Variant logic comes first",
        body: "A useful variant system starts with intent. If each cut is assigned a specific role, the edit plan can reuse the same source material without making the outputs feel identical.",
      },
      {
        heading: "Plan the source material around the family",
        body: "Treat the clip pool as infrastructure. Pick scenes that can support multiple tones, make sure the strongest proof appears early, and preserve room for ratio-specific pacing.",
      },
      {
        heading: "The commercial upside",
        body: "Four good variants usually outperform one polished master because the team can choose the right output for the right channel without having to restart the production cycle.",
      },
    ],
    relatedSlugs: [
      "designing-an-output-library-that-people-actually-use",
      "why-command-center-surfaces-create-better-stakeholder-trust",
      "why-creative-approval-belongs-before-generation",
    ],
    cta: {
      eyebrow: "Variants",
      title: "See the four-cut logic in the output library.",
      body: "The output surface shows how one production run becomes a usable handoff set.",
      label: "View Outputs",
      href: "/app/outputs",
    },
  },
  {
    slug: "designing-an-output-library-that-people-actually-use",
    category: "Product",
    title: "Designing an output library that people actually use",
    dek: "The final handoff surface matters because that is where campaign work becomes useful to the rest of the team.",
    author: "Ad Command Center",
    date: "March 18, 2026",
    readTime: "5 min read",
    summaryPoints: [
      "Outputs should read by intent, ratio, and next action at a glance.",
      "Publish, download, and share need obvious hierarchy.",
      "The library should feel like a product surface, not an afterthought.",
    ],
    metrics: [
      { label: "Key labels", value: "3", note: "Intent, ratio, and action are enough for first-glance reading." },
      { label: "Handoff quality", value: "High", note: "The right library reduces confusion at the point of use." },
      { label: "Primary job", value: "Decision support", note: "The surface should help teams choose quickly." },
    ],
    sections: [
      {
        heading: "Outputs should not feel like leftovers",
        body: "The outputs library should feel like a product surface in its own right. If teams cannot read variant intent, aspect ratios, and next actions quickly, the pipeline feels unfinished no matter how good the generation engine is.",
      },
      {
        heading: "Keep action surfaces elegant",
        body: "Publish, download, and share must remain obvious without turning the page into an operations console. Good hierarchy, strong spacing, and intentional metadata are usually more valuable than more buttons.",
      },
      {
        heading: "A good library points forward",
        body: "Each output should lead naturally into publishing, review, or reuse. That makes the library a living part of the workflow rather than a dead-end archive.",
      },
    ],
    relatedSlugs: [
      "why-command-center-surfaces-create-better-stakeholder-trust",
      "what-makes-a-sample-run-worth-landing-on-from-search",
      "how-to-write-a-brief-that-survives-production",
    ],
    cta: {
      eyebrow: "Library",
      title: "See the output system in the product preview.",
      body: "The command center and outputs surfaces show how the handoff behaves in the app.",
      label: "Open Command Center",
      href: "/app/command-center",
    },
  },
  {
    slug: "what-makes-a-sample-run-worth-landing-on-from-search",
    category: "SEO",
    title: "What makes a sample run worth landing on from search",
    dek: "Search traffic is most valuable when the landing page proves the product with enough detail to carry a buying conversation.",
    author: "Ad Command Center",
    date: "March 17, 2026",
    readTime: "6 min read",
    summaryPoints: [
      "A sample run page needs brief, assets, process, and outputs in one place.",
      "The page should feel like proof, not a generic gallery entry.",
      "Related runs and clear CTA paths improve commercial usefulness.",
    ],
    metrics: [
      { label: "Search role", value: "Proof", note: "The page should help the visitor decide whether the workflow fits." },
      { label: "Landing depth", value: "Full", note: "Brief, process, and outputs need to sit together." },
      { label: "CTA", value: "One next step", note: "Too many links dilute the intent of the page." },
    ],
    sections: [
      {
        heading: "The page has to do real work",
        body: "A sample run page should not simply display artwork. It needs to explain what the brief was, what the system did with the assets, and why the final output set is credible enough to buy into.",
      },
      {
        heading: "Search depth should feel useful",
        body: "The best landing pages answer the commercial questions without becoming SEO sludge. Clear structure, concise detail, and actual proof move the page into acquisition territory.",
      },
      {
        heading: "Design for the handoff moment",
        body: "The visitor should be able to move from the sample into the product story, the pricing story, or a direct contact path without losing the context that got them there.",
      },
    ],
    relatedSlugs: [
      "designing-an-output-library-that-people-actually-use",
      "why-creative-approval-belongs-before-generation",
      "why-command-center-surfaces-create-better-stakeholder-trust",
    ],
    cta: {
      eyebrow: "Search",
      title: "See the strongest sample run in context.",
      body: "The Northstar run shows what a landing page should prove and why it matters.",
      label: "Open Sample Run",
      href: "/sample-runs/northstar-serum-launch",
    },
  },
  {
    slug: "why-command-center-surfaces-create-better-stakeholder-trust",
    category: "Operations",
    title: "Why command center surfaces create better stakeholder trust",
    dek: "People trust a process faster when they can see what is happening, what has happened, and what still needs approval.",
    author: "Ad Command Center",
    date: "March 16, 2026",
    readTime: "7 min read",
    summaryPoints: [
      "Operational truth should be visible beneath the theatrical layer.",
      "Status, role ownership, and recovery paths reduce uncertainty.",
      "A calm live surface makes the whole system feel more credible.",
    ],
    metrics: [
      { label: "Trust gain", value: "Visible", note: "Stakeholders respond better when stage state is readable." },
      { label: "Risk control", value: "Clear", note: "Fallback and retry signals prevent guesswork." },
      { label: "Review speed", value: "Faster", note: "Less ambiguity means quicker sign-off." },
    ],
    sections: [
      {
        heading: "Visibility is a product feature",
        body: "A command center is not theater for its own sake. The surface exists to show stage truth, approval state, and next actions so the team can move with confidence.",
      },
      {
        heading: "The calmest interface wins",
        body: "A loud dashboard tends to feel fragile. A calm, explicit surface feels operationally mature because it shows the work without exaggerating it.",
      },
      {
        heading: "That trust compounds",
        body: "Once stakeholders trust the surface, they trust the process. That shortens reviews, reduces interruptions, and makes the production system easier to adopt.",
      },
    ],
    relatedSlugs: [
      "why-creative-approval-belongs-before-generation",
      "designing-an-output-library-that-people-actually-use",
      "how-to-turn-one-asset-set-into-four-usable-variants",
    ],
    cta: {
      eyebrow: "Command Center",
      title: "See the live preview in the product surface.",
      body: "The command center route shows how stage truth, event feed, and role ownership fit together.",
      label: "Open Command Center",
      href: "/app/command-center",
    },
  },
  {
    slug: "how-to-write-a-brief-that-survives-production",
    category: "Briefing",
    title: "How to write a brief that survives production",
    dek: "Good briefs do not just inspire the first draft. They keep the project coherent after approval, storyboard, and assembly.",
    author: "Ad Command Center",
    date: "March 15, 2026",
    readTime: "6 min read",
    summaryPoints: [
      "The brief should state the offer, audience, proof, and tone plainly.",
      "Production-safe briefs remove ambiguity before media work starts.",
      "A brief is successful if the team can still use it after several handoffs.",
    ],
    metrics: [
      { label: "Core fields", value: "4", note: "Offer, audience, proof, and tone are the minimum useful set." },
      { label: "Production cost", value: "Lower", note: "Clarity up front avoids expensive rework later." },
      { label: "Brief outcome", value: "Reusable", note: "A strong brief supports the whole launch, not just the first draft." },
    ],
    sections: [
      {
        heading: "Make the brief specific",
        body: "Broad direction is not enough. A brief needs a sharp offer, a clearly named audience, the proof that matters, and the tone the creative should hold onto from start to finish.",
      },
      {
        heading: "Write for production, not inspiration alone",
        body: "The best briefs survive handoff because they are specific enough to guide script writing, storyboard framing, and output selection. Anything looser creates confusion downstream.",
      },
      {
        heading: "Use the brief as a contract",
        body: "A good production brief is the shared reference point when the work is being reviewed, approved, and packaged for final use. That makes it more valuable than a loose creative note.",
      },
    ],
    relatedSlugs: [
      "why-creative-approval-belongs-before-generation",
      "the-right-way-to-think-about-aspect-ratios-in-launch-ads",
      "how-to-turn-one-asset-set-into-four-usable-variants",
    ],
    cta: {
      eyebrow: "Briefs",
      title: "See the same brief logic inside a real sample run.",
      body: "The Northstar and Morrow runs show how the brief turns into a production-ready system.",
      label: "Browse Sample Runs",
      href: "/sample-runs",
    },
  },
  {
    slug: "why-the-storyboard-becomes-the-real-approval-point",
    category: "Workflow",
    title: "Why the storyboard becomes the real approval point",
    dek: "Scripts can be persuasive, but storyboards decide whether the campaign actually holds together visually.",
    author: "Ad Command Center",
    date: "March 14, 2026",
    readTime: "5 min read",
    summaryPoints: [
      "Storyboard approval confirms pacing and scene intent.",
      "It is the last low-cost point to fix structural problems.",
      "The storyboard should make the final output family obvious.",
    ],
    metrics: [
      { label: "Approval point", value: "Storyboard", note: "This is where visual coherence gets locked." },
      { label: "Cost saved", value: "High", note: "Fixing structure before generation avoids expensive rework." },
      { label: "Output clarity", value: "Stronger", note: "The final family is easier to plan when the scenes are real." },
    ],
    sections: [
      {
        heading: "A script is not yet a campaign",
        body: "The script can sound right and still fail visually. The storyboard translates the copy into actual scene logic, which is why it is often the more important approval step.",
      },
      {
        heading: "Scene order changes the story",
        body: "Moving one shot can change the whole pacing of the ad. The storyboard exposes that structure before rendering starts, which makes the downstream work more reliable.",
      },
      {
        heading: "The output family gets easier to build",
        body: "When the storyboard is solid, the clip pool and the edit plan can move faster because the system knows which scene carries which job.",
      },
    ],
    relatedSlugs: [
      "why-creative-approval-belongs-before-generation",
      "how-to-turn-one-asset-set-into-four-usable-variants",
      "why-command-center-surfaces-create-better-stakeholder-trust",
    ],
    cta: {
      eyebrow: "Storyboard",
      title: "See the storyboard stage in the command center preview.",
      body: "The product surface shows where the approval point sits in the run.",
      label: "Open Command Center",
      href: "/app/command-center",
    },
  },
];

export const caseStudies: Article[] = [
  {
    slug: "northstar-launch-system",
    category: "Case Study",
    title: "Northstar turned a sparse asset set into a disciplined launch system",
    dek: "A small beauty asset library became a cleaner campaign package because the workflow protected the creative sequence before generation started.",
    author: "Ad Command Center",
    date: "March 16, 2026",
    readTime: "7 min read",
    challenge:
      "Northstar needed a premium launch treatment without a large content shoot and with very limited source material.",
    summaryPoints: [
      "Small asset sets can still support a full launch if the workflow is strict.",
      "The system should make the strongest proof appear early in the cut.",
      "The output family should feel consistent without becoming repetitive.",
    ],
    metrics: [
      { label: "Asset count", value: "4", note: "Pack shots and hand-held imagery were enough to stage the launch." },
      { label: "Outputs", value: "4", note: "Performance, brand, feature, and platform cuts were all usable." },
      { label: "Review path", value: "2 steps", note: "Script and storyboard approvals stabilized the run." },
    ],
    constraints: [
      "No large content shoot",
      "Premium tone without overclaiming",
      "Multiple formats from a small source set",
    ],
    inputs: [
      "Product shots",
      "Hand-held visuals",
      "Brand tone guidance",
      "One main offer",
    ],
    approach: [
      "Start with texture and proof instead of trying to overbuild the narrative.",
      "Keep the first cut disciplined so the other ratios have something clear to inherit.",
      "Reuse a shared clip pool to preserve tone across all outputs.",
    ],
    outputs: [
      "Performance cut for paid social.",
      "Brand cut for higher-trust placements.",
      "Feature cut for fuller explanation.",
      "Platform cut for compact retail use.",
    ],
    outcomes: [
      "Approvals moved earlier.",
      "The final package felt like a launch system, not a pile of files.",
      "The team got usable exports across three ratios and four cuts.",
    ],
    lessons: [
      "Small asset sets benefit from stricter sequencing, not looser editing.",
      "The first approval should happen before expensive media generation.",
      "Variant strategy is more useful than raw volume.",
    ],
    sections: [
      {
        heading: "The brief",
        body: "Northstar needed a premium launch treatment without a large content shoot. The core inputs were product shots, a small set of hand-held visuals, and a brand tone that needed to stay confident without becoming generic.",
      },
      {
        heading: "Creative approach",
        body: "The system focused on texture, trust, and proof rather than overbuilt performance language. The output set used a shared pool of scenes to preserve consistency while still producing distinct cuts.",
      },
      {
        heading: "What changed",
        body: "Approvals moved earlier, output clarity improved, and the final package gave the team a usable set of exports instead of a pile of disconnected assets.",
      },
    ],
    relatedSlugs: ["morrow-drop-case-study", "aster-house-launch-system", "cobalt-travel-launch-system"],
    cta: {
      eyebrow: "Proof",
      title: "See the same structure in a live sample run.",
      body: "The sample run pages show the sequence and outputs in a more interactive format.",
      label: "Open Sample Runs",
      href: "/sample-runs",
    },
  },
  {
    slug: "morrow-drop-case-study",
    category: "Case Study",
    title: "Morrow compressed a weekend drop into a cleaner review and delivery cycle",
    dek: "The campaign stayed useful because the production logic stayed simple: clarify the offer, confirm the sequence, then build the variants.",
    author: "Ad Command Center",
    date: "March 12, 2026",
    readTime: "6 min read",
    challenge:
      "Morrow needed campaign outputs fast but still wanted the visual language to feel composed.",
    summaryPoints: [
      "Fast launches still need a visible approval path.",
      "A compact asset set works when the offer is clear early.",
      "The shared clip pool made the outputs feel related instead of rushed.",
    ],
    metrics: [
      { label: "Timeline", value: "Weekend", note: "The run stayed compact without losing polish." },
      { label: "Asset load", value: "Lean", note: "The team worked with a small but focused source set." },
      { label: "Variant count", value: "3+", note: "Multiple outputs were still coherent." },
    ],
    constraints: [
      "Short turnaround",
      "Compact asset set",
      "Premium brand tone",
    ],
    inputs: [
      "Packaging shots",
      "A single offer",
      "Brand guidelines",
      "Launch timing",
    ],
    approach: [
      "Lock the offer in the script and storyboard before generation.",
      "Use light product motions and editorial cutaways rather than forcing extra visuals.",
      "Package the variants for brand and performance use in one pass.",
    ],
    outputs: [
      "Brand cut for editorial placements.",
      "Performance cut for paid media.",
      "Platform cut for mobile-first placements.",
    ],
    outcomes: [
      "The team delivered faster without making the launch feel cheap.",
      "The output set stayed composed across use cases.",
      "The review cycle was shorter because the sequence was explicit.",
    ],
    lessons: [
      "Speed is easier to manage when the offer is unambiguous.",
      "A smaller asset set can still produce a premium result if the edit plan is disciplined.",
      "The output family should be designed together, not one file at a time.",
    ],
    sections: [
      {
        heading: "The brief",
        body: "Morrow needed campaign outputs fast but still wanted the visual language to feel composed. The asset set was compact and the timeline was short.",
      },
      {
        heading: "Production flow",
        body: "The team used the script and storyboard approvals to lock the direction, then relied on a shared clip pool for speed during assembly. That kept the output family coherent even when the pace increased.",
      },
      {
        heading: "Output set",
        body: "The result was a cleaner brand cut, a sharper performance cut, and platform-friendly exports that did not feel improvised.",
      },
    ],
    relatedSlugs: ["northstar-launch-system", "aster-house-launch-system", "cobalt-travel-launch-system"],
    cta: {
      eyebrow: "Speed",
      title: "See the launch workflow in the product preview.",
      body: "The command center and project surfaces show how fast runs stay controlled.",
      label: "Open Command Center",
      href: "/app/command-center",
    },
  },
  {
    slug: "aster-house-launch-system",
    category: "Case Study",
    title: "Aster House used one command center to keep a residential launch on script",
    dek: "The product story stayed premium because the review sequence stayed visible from brief to final exports.",
    author: "Ad Command Center",
    date: "March 10, 2026",
    readTime: "7 min read",
    challenge:
      "A premium residential launch needed polished outputs for sales and brand teams without turning into a generic property tour.",
    summaryPoints: [
      "Residential launches need room, pace, and proof to land correctly.",
      "Stakeholders need to see stage status to trust the workflow.",
      "One command center kept the campaign aligned across teams.",
    ],
    metrics: [
      { label: "Stakeholders", value: "3 teams", note: "Brand, sales, and marketing all had to stay aligned." },
      { label: "Stages", value: "8", note: "The process stayed visible from ingest through delivery." },
      { label: "Output family", value: "Multi-ratio", note: "Final exports worked across site and social channels." },
    ],
    constraints: [
      "Residential subject matter",
      "Multiple stakeholder groups",
      "Need for premium and operational tone",
    ],
    inputs: [
      "Property imagery",
      "Briefing notes",
      "Sales priorities",
      "Format requirements",
    ],
    approach: [
      "Use the command center as the shared source of truth.",
      "Keep the visual language calm and editorial so the property feels premium.",
      "Treat each output as a distinct use case rather than a duplicate cut.",
    ],
    outputs: [
      "Performance cut for paid social.",
      "Brand cut for the marketing site.",
      "Feature cut for the sales team.",
      "Platform cut for faster distribution.",
    ],
    outcomes: [
      "The campaign stayed on script.",
      "Review friction dropped because everyone could see stage truth.",
      "The team left with outputs that felt ready for real use.",
    ],
    lessons: [
      "Real estate campaigns need operational clarity as much as visual polish.",
      "A calm command center can reduce stakeholder churn.",
      "One workflow should support both brand and sales outcomes.",
    ],
    sections: [
      {
        heading: "The brief",
        body: "Aster House needed a premium residential launch treatment that could work for marketing, sales, and internal review without sounding generic or overproduced.",
      },
      {
        heading: "Creative approach",
        body: "The system staged the story around light, space, and confidence, then used a visible command center to keep the stakeholders aligned as the run moved through approvals.",
      },
      {
        heading: "What changed",
        body: "The team got cleaner outputs, fewer review loops, and a more believable production process that could be reused for future launches.",
      },
    ],
    relatedSlugs: ["northstar-launch-system", "morrow-drop-case-study", "cobalt-travel-launch-system"],
    cta: {
      eyebrow: "Residential",
      title: "See how the command center is presented in the app.",
      body: "The product preview surfaces show the same stage logic in a live workspace frame.",
      label: "Open Command Center",
      href: "/app/command-center",
    },
  },
  {
    slug: "cobalt-travel-launch-system",
    category: "Case Study",
    title: "Cobalt kept a travel accessory launch clean under tight format pressure",
    dek: "A compact accessory story became more usable when the team planned the ratios and the edit plan together.",
    author: "Ad Command Center",
    date: "March 08, 2026",
    readTime: "6 min read",
    challenge:
      "The launch needed to work as a short-form ad, a product feature piece, and a lightweight retail asset set.",
    summaryPoints: [
      "Accessory launches benefit from strict ratio planning.",
      "The edit plan matters as much as the footage itself.",
      "The output library should make the multi-use case obvious.",
    ],
    metrics: [
      { label: "Primary use", value: "Retail", note: "The campaign had to travel well across placements." },
      { label: "Coverage", value: "3 ratios", note: "9:16, 1:1, and 16:9 all needed to hold up." },
      { label: "Reusability", value: "High", note: "One source set had to do more than one job." },
    ],
    constraints: [
      "Tight format pressure",
      "Accessory category",
      "Need for retail and social use",
    ],
    inputs: [
      "Product imagery",
      "Packaging details",
      "Usage framing",
      "Ratio requirements",
    ],
    approach: [
      "Start with utility and clarity rather than extra motion.",
      "Make each ratio serve a different purpose.",
      "Keep the output family compact and legible.",
    ],
    outputs: [
      "Performance cut for social ads.",
      "Feature cut for product explanation.",
      "Platform cut for retail placements.",
    ],
    outcomes: [
      "The launch stayed clean under pressure.",
      "The outputs were easier to assign to channel needs.",
      "The team reused the outputs with less cleanup.",
    ],
    lessons: [
      "Accessory campaigns succeed when utility is visible early.",
      "Ratio discipline is more valuable than trying to do everything in one edit.",
      "The handoff surface should make reuse obvious.",
    ],
    sections: [
      {
        heading: "The brief",
        body: "Cobalt needed a travel accessory launch that could flex between social, retail, and product detail contexts without looking stretched or generic.",
      },
      {
        heading: "Production choices",
        body: "The team treated the format mix as part of the creative brief, then used the command center logic to keep the edit plan disciplined as the output family came together.",
      },
      {
        heading: "Result",
        body: "The final package stayed clean, legible, and reusable across placements that usually demand different levels of explanation.",
      },
    ],
    relatedSlugs: ["northstar-launch-system", "morrow-drop-case-study", "aster-house-launch-system"],
    cta: {
      eyebrow: "Accessory",
      title: "See the output library that follows the case study.",
      body: "The product surfaces show how the final handoff is presented to the team.",
      label: "View Outputs",
      href: "/app/outputs",
    },
  },
];
export const projects: ProjectRecord[] = [
  {
    slug: "aster-house-launch",
    name: "Aster House Launch",
    industry: "Residential",
    status: "Storyboard approved",
    updatedAt: "4 minutes ago",
    brief:
      "Launch a premium residential development campaign around light, space, and confidence. Keep the tone poised and polished.",
    goals: ["Drive high-intent inquiry", "Protect premium positioning", "Export multi-format campaign cuts"],
    formats: ["9:16", "1:1", "16:9"],
    assets: ["Arrival lounge", "Lobby detail", "Exterior dusk", "View axis"],
  },
  {
    slug: "northstar-serum-launch",
    name: "Northstar Serum Launch",
    industry: "Beauty",
    status: "Rendering",
    updatedAt: "12 minutes ago",
    brief:
      "Use a controlled product-led story to introduce the serum and make the final package useful across paid, retail, and brand channels.",
    goals: ["Build premium perception", "Create reusable launch cuts", "Keep review points tight"],
    formats: ["9:16", "1:1", "16:9"],
    assets: ["Primary pack crop", "Usage detail crop", "Carton front detail"],
  },
];

export const outputsLibrary: OutputRecord[] = [
  {
    name: "Performance Cut",
    aspect: "9:16",
    status: "Ready",
    note: "Highest-intent opening and early proof.",
  },
  {
    name: "Brand Cut",
    aspect: "1:1",
    status: "Ready",
    note: "Softer pacing with stronger brand texture.",
  },
  {
    name: "Feature Cut",
    aspect: "16:9",
    status: "Rendering",
    note: "Longer product explanation and slower cadence.",
  },
  {
    name: "Platform Cut",
    aspect: "9:16",
    status: "Ready",
    note: "Condensed export for retail and social placements.",
  },
];

export const commandStages: CommandStage[] = [
  {
    name: "ingest",
    operational: "Assets queued and payload verified",
    theatrical: "Materials received",
    status: "Complete",
    progress: 100,
    note: "Files are structured and ready for normalization.",
  },
  {
    name: "normalize",
    operational: "Brief normalized against format and goal set",
    theatrical: "Campaign angle locked",
    status: "Complete",
    progress: 100,
    note: "Offer, audience, and CTA are coherent enough to move forward.",
  },
  {
    name: "writers_room",
    operational: "Script package assembled and ranked",
    theatrical: "Writers room in pass",
    status: "Live",
    progress: 72,
    note: "Hook and benefit stack are converging on the strongest version.",
  },
  {
    name: "storyboard",
    operational: "Scene map and overlays prepared",
    theatrical: "Storyboard preparing",
    status: "Queued",
    progress: 12,
    note: "Shots will lock once the current script pass is confirmed.",
  },
  {
    name: "clip_generation",
    operational: "Scene prompts render into shared clip pool",
    theatrical: "Clip lab on standby",
    status: "Waiting",
    progress: 0,
    note: "Generation begins after storyboard approval.",
  },
  {
    name: "clip_qc",
    operational: "Clips checked for usable pacing and framing",
    theatrical: "Quality pass",
    status: "Waiting",
    progress: 0,
    note: "QC will annotate any fallback or retry requirement.",
  },
  {
    name: "edit_planning",
    operational: "Variants planned from shared clip pool",
    theatrical: "Variant map drafting",
    status: "Waiting",
    progress: 0,
    note: "The output family stays intentional, not duplicated.",
  },
  {
    name: "assembly",
    operational: "Final cuts composed and framed for export",
    theatrical: "Editor desk ready",
    status: "Waiting",
    progress: 0,
    note: "Final exports package into vertical, square, and landscape formats.",
  },
  {
    name: "delivery",
    operational: "Variants prepared for publish, download, or share",
    theatrical: "Delivery queued",
    status: "Waiting",
    progress: 0,
    note: "Delivery closes the run with usable assets, not raw fragments.",
  },
];

export const eventRows: EventRow[] = [
  {
    time: "09:04",
    role: "Head Writer",
    title: "Brief normalized",
    note: "Goal set and audience intent are aligned to one production direction.",
  },
  {
    time: "09:08",
    role: "Hook Writer",
    title: "Openers scored",
    note: "Four hooks were ranked and one lead angle moved forward.",
  },
  {
    time: "09:11",
    role: "Benefit Writer",
    title: "Benefit stack tightened",
    note: "Visual proof is now matched to the most valuable promise.",
  },
  {
    time: "09:13",
    role: "Brand Voice Editor",
    title: "Language pass underway",
    note: "Copy is being tightened to stay premium and controlled.",
  },
  {
    time: "09:16",
    role: "Storyboard Lead",
    title: "Queue prepared",
    note: "Scene planning will start once the current script pass is approved.",
    severity: "warning",
  },
];

export function getSampleRun(slug: string) {
  return sampleRuns.find((item) => item.slug === slug);
}

export function getRelatedSampleRuns(slug: string) {
  const run = getSampleRun(slug);

  if (!run) {
    return [];
  }

  return run.relatedSlugs
    .map((relatedSlug) => getSampleRun(relatedSlug))
    .filter((item): item is SampleRun => Boolean(item));
}

export function getGalleryItem(slug: string) {
  return galleryItems.find((item) => item.slug === slug);
}

export function getJournalArticle(slug: string) {
  return journalArticles.find((item) => item.slug === slug);
}

export function getCaseStudy(slug: string) {
  return caseStudies.find((item) => item.slug === slug);
}

export function getProject(slug: string) {
  return projects.find((item) => item.slug === slug);
}
