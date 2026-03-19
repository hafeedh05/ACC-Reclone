import type { RunEvent } from "@ad-command-center/contracts";

export type ViewKey =
  | "dashboard"
  | "intake"
  | "review"
  | "command"
  | "library";

export type Project = {
  name: string;
  industry: string;
  status: string;
  updatedAt: string;
  formats: string[];
  assets: number;
  runs: number;
  accent: string;
};

export type Stage = {
  id: string;
  label: string;
  actor: string;
  progress: number;
  note: string;
};

export type OutputVariant = {
  title: string;
  duration: string;
  aspect: string;
  status: string;
  theme: string;
  cta: string;
};

export type ScriptCard = {
  title: string;
  hook: string;
  body: string;
  cta: string;
};

export type SceneCard = {
  scene: string;
  visual: string;
  motion: string;
  overlay: string;
};

export type CaseStudy = {
  title: string;
  category: string;
  outcome: string;
  summary: string;
};

export type PricingTier = {
  name: string;
  price: string;
  caption: string;
  points: string[];
  highlighted?: boolean;
};

export const projects: Project[] = [
  {
    name: "Aster House Launch",
    industry: "Real estate",
    status: "Rendering",
    updatedAt: "2m ago",
    formats: ["9:16", "1:1", "16:9"],
    assets: 14,
    runs: 3,
    accent: "from-amber-300/80 to-orange-400/70",
  },
  {
    name: "Morrow Cafe Summer Drop",
    industry: "Hospitality",
    status: "Review ready",
    updatedAt: "12m ago",
    formats: ["9:16", "1:1"],
    assets: 8,
    runs: 2,
    accent: "from-sky-300/80 to-cyan-400/70",
  },
  {
    name: "Northstar Skincare",
    industry: "Beauty",
    status: "Needs approval",
    updatedAt: "1h ago",
    formats: ["9:16", "1:1", "16:9"],
    assets: 11,
    runs: 5,
    accent: "from-rose-300/80 to-pink-400/70",
  },
];

export const stages: Stage[] = [
  {
    id: "head-writer",
    label: "Brief intake",
    actor: "Head Writer",
    progress: 100,
    note: "The initial brief is normalized into a clear production angle with goals, audience, and CTA locked.",
  },
  {
    id: "hook-writer",
    label: "Hook development",
    actor: "Hook Writer",
    progress: 92,
    note: "Opening lines are drafted for scroll-stop strength without drifting away from the core offer.",
  },
  {
    id: "benefit-writer",
    label: "Benefit stack",
    actor: "Benefit Writer",
    progress: 86,
    note: "The value story is sequenced so each scene earns the next reveal instead of repeating the same point.",
  },
  {
    id: "brand-voice-editor",
    label: "Brand voice polish",
    actor: "Brand Voice Editor",
    progress: 78,
    note: "The script is tightened to keep the language premium, controlled, and usable across multiple variants.",
  },
  {
    id: "storyboard-lead",
    label: "Storyboard",
    actor: "Storyboard Lead",
    progress: 66,
    note: "Shot design is being aligned to motion, overlays, and pacing before media generation begins.",
  },
  {
    id: "variant-strategist",
    label: "Variant planning",
    actor: "Variant Strategist",
    progress: 48,
    note: "A shared clip pool is being mapped into four cuts so the output set feels intentional, not duplicated.",
  },
  {
    id: "clip-lab",
    label: "Clip generation",
    actor: "Clip Lab",
    progress: 36,
    note: "Scene prompts are rendering into reusable footage with QC checkpoints attached to each job.",
  },
  {
    id: "editor-desk",
    label: "Assembly",
    actor: "Editor Desk",
    progress: 18,
    note: "The cut is paced and packaged into the final vertical, square, and landscape exports.",
  },
];

export const liveRunEvents: RunEvent[] = [
  {
    event_id: "event-head-writer",
    run_id: "run-0193",
    project_id: "proj-aster-house",
    stage: "normalize",
    step: "brief_normalized",
    status: "completed",
    attempt: 1,
    actor: "Head Writer",
    artifact_ids: ["brief-0193"],
    message: "The brief is sharp enough to move into concept development.",
    progress: 12,
    emitted_at: "2026-03-19T09:00:00Z",
    metrics: { duration_ms: 1800 },
  },
  {
    event_id: "event-hook-writer",
    run_id: "run-0193",
    project_id: "proj-aster-house",
    stage: "writers_room",
    step: "hooks_ranked",
    status: "completed",
    attempt: 1,
    actor: "Hook Writer",
    artifact_ids: ["script-0193-v1"],
    message: "Four hooks were scored and the strongest opener was carried forward.",
    progress: 24,
    emitted_at: "2026-03-19T09:00:08Z",
    metrics: { variant_count: 4 },
  },
  {
    event_id: "event-benefit-writer",
    run_id: "run-0193",
    project_id: "proj-aster-house",
    stage: "writers_room",
    step: "benefit_pass",
    status: "completed",
    attempt: 1,
    actor: "Benefit Writer",
    artifact_ids: ["script-0193-v1"],
    message: "The benefit stack now ties visual proof to the highest-intent audience.",
    progress: 36,
    emitted_at: "2026-03-19T09:00:15Z",
    metrics: { duration_ms: 2400 },
  },
  {
    event_id: "event-brand-voice",
    run_id: "run-0193",
    project_id: "proj-aster-house",
    stage: "writers_room",
    step: "brand_voice_pass",
    status: "completed",
    attempt: 1,
    actor: "Brand Voice Editor",
    artifact_ids: ["script-0193-v2"],
    message: "The copy was tightened for confidence and premium positioning without sounding generic.",
    progress: 48,
    emitted_at: "2026-03-19T09:00:21Z",
    metrics: { duration_ms: 1300 },
  },
  {
    event_id: "event-storyboard",
    run_id: "run-0193",
    project_id: "proj-aster-house",
    stage: "storyboard",
    step: "shot_list_locked",
    status: "completed",
    attempt: 1,
    actor: "Storyboard Lead",
    artifact_ids: ["story-0193-v1"],
    message: "The scene plan is locked with motion notes and overlay cues attached to each beat.",
    progress: 62,
    emitted_at: "2026-03-19T09:00:30Z",
    metrics: { clip_count: 4 },
  },
  {
    event_id: "event-variant",
    run_id: "run-0193",
    project_id: "proj-aster-house",
    stage: "edit_planning",
    step: "variant_map_ready",
    status: "completed",
    attempt: 1,
    actor: "Variant Strategist",
    artifact_ids: ["recipe-performance", "recipe-brand", "recipe-feature", "recipe-platform"],
    message: "The shared clip pool is split into performance, brand, feature, and platform cuts.",
    progress: 74,
    emitted_at: "2026-03-19T09:00:38Z",
    metrics: { variant_count: 4 },
  },
  {
    event_id: "event-clip-lab",
    run_id: "run-0193",
    project_id: "proj-aster-house",
    stage: "clip_generation",
    step: "clips_rendered",
    status: "completed",
    attempt: 1,
    actor: "Clip Lab",
    artifact_ids: ["clip-1", "clip-2", "clip-3", "clip-4"],
    message: "The reusable clip pool passed QC and is ready for the edit pass.",
    progress: 88,
    emitted_at: "2026-03-19T09:00:49Z",
    metrics: { clip_count: 4 },
  },
  {
    event_id: "event-editor",
    run_id: "run-0193",
    project_id: "proj-aster-house",
    stage: "assembly",
    step: "delivery_bundle_ready",
    status: "completed",
    attempt: 1,
    actor: "Editor Desk",
    artifact_ids: ["bundle-0193"],
    message: "The export package is ready with 3 ratios, thumbnails, and caption assets.",
    progress: 100,
    emitted_at: "2026-03-19T09:01:05Z",
    metrics: { variant_count: 4, clip_count: 4 },
  },
];

export const scriptCards: ScriptCard[] = [
  {
    title: "Hook pass",
    hook: "Not a listing. A cinematic invitation with measured urgency.",
    body: "Aerials, interior details, and a human-scale payoff sequence align to a single message: premium space without the usual premium friction.",
    cta: "Book a private walkthrough",
  },
  {
    title: "Body pass",
    hook: "Light, volume, and proximity do the selling.",
    body: "The script leans on tangible features, proof points, and a pacing structure that can survive rewrites without losing momentum.",
    cta: "See availability",
  },
];

export const sceneCards: SceneCard[] = [
  {
    scene: "Scene 1",
    visual: "Sunrise reveal across the facade with glass and stone detail.",
    motion: "Slow orbital push, lens flare, subtle title treatment.",
    overlay: "Where the city quiets down.",
  },
  {
    scene: "Scene 2",
    visual: "Interior transition through the kitchen into the living space.",
    motion: "Match cut from exterior to warm interior with parallax depth.",
    overlay: "Space that breathes with the brief.",
  },
  {
    scene: "Scene 3",
    visual: "Lifestyle moment with people moving naturally through the home.",
    motion: "Faster cut rhythm, music lift, CTA locked to the final beat.",
    overlay: "Designed for the life around it.",
  },
];

export const outputVariants: OutputVariant[] = [
  {
    title: "Performance Cut",
    duration: "15s",
    aspect: "9:16",
    status: "Delivered",
    theme: "Fast hook, benefit stack, direct CTA",
    cta: "Start now",
  },
  {
    title: "Brand Cut",
    duration: "30s",
    aspect: "16:9",
    status: "Queued",
    theme: "Atmospheric pacing with longer reveal",
    cta: "View story",
  },
  {
    title: "Feature Cut",
    duration: "20s",
    aspect: "1:1",
    status: "Review ready",
    theme: "Feature-led composition with captions",
    cta: "Compare edits",
  },
  {
    title: "Platform Cut",
    duration: "12s",
    aspect: "9:16",
    status: "Delivered",
    theme: "Placement tuned for vertical feeds",
    cta: "Download",
  },
];

export const caseStudies: CaseStudy[] = [
  {
    title: "Residential launch sprint",
    category: "Real estate",
    outcome: "4 variants from one image set in a single run",
    summary: "A premium property launch used one shared clip plan to create vertical paid social, landscape hero video, and square retargeting assets.",
  },
  {
    title: "Hospitality seasonal drop",
    category: "Restaurants",
    outcome: "Same-day creative testing package",
    summary: "A campaign was structured around mood, motion, and offer cadence so the team could test two hooks and one calmer brand cut immediately.",
  },
  {
    title: "Beauty product relaunch",
    category: "Beauty",
    outcome: "Performance and brand cuts from the same asset pool",
    summary: "The product flow kept the script approvals visible, then reused the clip pool to generate tighter conversion edits without rebuilding the whole campaign.",
  },
];

export const trustSignals = [
  "Built for launch teams, agencies, and in-house growth operators.",
  "Review gates stay human-readable from brief to export.",
  "Every run exposes its stage events instead of hiding behind a spinner.",
  "One shared clip pool becomes multiple platform-ready cuts.",
];

export const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    price: "$149",
    caption: "For individual campaigns and small teams.",
    points: ["Prompt + upload intake", "Script and storyboard approvals", "3 ratio exports"],
  },
  {
    name: "Studio",
    price: "$499",
    caption: "For agencies and growth teams running multiple launches.",
    highlighted: true,
    points: ["Multi-project workspace", "Variant library and relaunch tools", "Priority rendering lanes"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    caption: "For high-volume teams with governance and deployment needs.",
    points: ["Private environments", "Usage controls and admin tooling", "Dedicated support and onboarding"],
  },
];

export const dashboardStats = [
  { label: "Active runs", value: "12", detail: "+3 this week" },
  { label: "Avg. time to first script", value: "58s", detail: "with guided approval" },
  { label: "Render success", value: "96%", detail: "last 30 days" },
  { label: "Exports ready", value: "84", detail: "across 3 formats" },
];
