"use client";

import Link from "next/link";
import { startTransition, useEffect, useState, type ReactNode } from "react";
import {
  dashboardStats,
  liveRunEvents,
  outputVariants,
  projects,
  sceneCards,
  scriptCards,
  stages,
  type ViewKey,
} from "./mock-data";

const views: Array<{ key: ViewKey; label: string; eyebrow: string }> = [
  { key: "dashboard", label: "Dashboard", eyebrow: "Overview" },
  { key: "intake", label: "Prompt Intake", eyebrow: "Brief" },
  { key: "review", label: "Script Review", eyebrow: "Approve" },
  { key: "command", label: "Command Center", eyebrow: "Live" },
  { key: "library", label: "Outputs", eyebrow: "Deliver" },
];

function pillClass(status: string) {
  if (status.toLowerCase().includes("delivered") || status.toLowerCase().includes("complete")) {
    return "border-emerald-400/30 bg-emerald-400/12 text-emerald-100";
  }

  if (status.toLowerCase().includes("review") || status.toLowerCase().includes("ready")) {
    return "border-amber-400/30 bg-amber-400/12 text-amber-100";
  }

  if (status.toLowerCase().includes("queued") || status.toLowerCase().includes("live")) {
    return "border-sky-400/30 bg-sky-400/12 text-sky-100";
  }

  return "border-white/10 bg-white/5 text-zinc-200";
}

function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`glass-panel rounded-[28px] ${className}`}>{children}</div>;
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] uppercase tracking-[0.35em] text-[color:var(--muted)]">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
        {title}
      </h2>
      <p className="max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">{description}</p>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 rounded-full bg-white/8">
      <div
        className="h-full rounded-full bg-gradient-to-r from-amber-300 via-orange-300 to-amber-500 shadow-[0_0_20px_rgba(228,176,111,0.22)]"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function NavButton({
  active,
  label,
  eyebrow,
  onClick,
}: {
  active: boolean;
  label: string;
  eyebrow: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
        active
          ? "border-amber-300/30 bg-white/8 text-white shadow-[0_0_0_1px_rgba(228,176,111,0.18)]"
          : "border-transparent text-zinc-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span>
        <span className="block text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">
          {eyebrow}
        </span>
        <span className="mt-1 block">{label}</span>
      </span>
      <span className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
        {active ? "open" : "go"}
      </span>
    </button>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">
        {label}
      </span>
      {children}
      {hint ? <span className="text-xs text-zinc-500">{hint}</span> : null}
    </label>
  );
}

export function AdCommandCenter() {
  const [activeView, setActiveView] = useState<ViewKey>("dashboard");
  const [activeStep, setActiveStep] = useState(0);
  const [scriptApproved, setScriptApproved] = useState(false);
  const [storyboardApproved, setStoryboardApproved] = useState(false);
  const [prompt, setPrompt] = useState(
    "Launch a premium ad campaign for a new residential development. Highlight light, space, and confidence."
  );
  const [audience, setAudience] = useState("Affluent families and relocation buyers");
  const [tone, setTone] = useState("Cinematic, warm, decisive");
  const [format, setFormat] = useState("9:16, 1:1, 16:9");

  useEffect(() => {
    if (activeView !== "command" || activeStep >= liveRunEvents.length - 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveStep((value) => Math.min(value + 1, liveRunEvents.length - 1));
    }, 2200);

    return () => window.clearInterval(interval);
  }, [activeStep, activeView]);

  const activeProject = projects[0];
  const currentStage = stages[Math.min(activeStep, stages.length - 1)];
  const currentEvent = liveRunEvents[Math.min(activeStep, liveRunEvents.length - 1)];

  function openView(view: ViewKey) {
    startTransition(() => setActiveView(view));
  }

  function resetDemo() {
    setActiveStep(0);
    setScriptApproved(false);
    setStoryboardApproved(false);
    openView("dashboard");
  }

  function generateBrief() {
    setScriptApproved(false);
    setStoryboardApproved(false);
    setActiveStep(0);
    openView("review");
  }

  function approveScriptStep() {
    setScriptApproved(true);
  }

  function approveStoryboardStep() {
    setStoryboardApproved(true);
    setActiveStep(0);
    openView("command");
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="ambient-orb orb-gold drift-slow left-[-5rem] top-[-2rem] h-72 w-72" />
      <div className="ambient-orb orb-blue drift-medium right-[-6rem] top-24 h-80 w-80" />
      <div className="grid-fade absolute inset-0 opacity-35" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="glass-panel-strong flex flex-col gap-4 rounded-[30px] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 via-orange-300 to-amber-500 text-sm font-black text-neutral-950 shadow-[0_10px_30px_rgba(228,176,111,0.25)]">
              AC
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-[color:var(--muted)]">
                Ad Command Center
              </p>
              <p className="text-sm text-zinc-300">
                Production desk for prompt-first campaigns and export-ready variants.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-emerald-100">
              Workspace live
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-zinc-200">
              3 runs in flight
            </span>
            <Link
              href="/"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-zinc-100 transition hover:bg-white/10"
            >
              Marketing site
            </Link>
          </div>
        </header>

        <div className="mt-4 grid flex-1 gap-4 lg:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="glass-panel-strong rounded-[30px] p-4">
            <div className="space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.34em] text-[color:var(--muted)]">
                  Current project
                </p>
                <p className="mt-2 text-lg font-semibold text-white">{activeProject.name}</p>
                <p className="text-sm text-zinc-400">{activeProject.industry}</p>
                <div className="mt-4 space-y-3">
                  <ProgressBar value={72} />
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>{activeProject.status}</span>
                    <span>{activeProject.updatedAt}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {views.map((view) => (
                  <NavButton
                    key={view.key}
                    active={activeView === view.key}
                    eyebrow={view.eyebrow}
                    label={view.label}
                    onClick={() => openView(view.key)}
                  />
                ))}
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">
                  Runtime snapshot
                </p>
                <div className="mt-4 grid gap-3">
                  {dashboardStats.slice(0, 2).map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-black/20 p-3">
                      <p className="text-xs text-zinc-400">{stat.label}</p>
                      <p className="text-xl font-semibold text-white">{stat.value}</p>
                      <p className="text-xs text-zinc-500">{stat.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="min-w-0 space-y-4">
            <Panel className="px-5 py-5 sm:px-6">
              {activeView === "dashboard" ? <DashboardView onNewRun={() => openView("intake")} /> : null}
              {activeView === "intake" ? (
                <IntakeView
                  audience={audience}
                  format={format}
                  prompt={prompt}
                  tone={tone}
                  onAudienceChange={setAudience}
                  onFormatChange={setFormat}
                  onPromptChange={setPrompt}
                  onToneChange={setTone}
                  onGenerateBrief={generateBrief}
                  onSaveDraft={() => openView("dashboard")}
                />
              ) : null}
              {activeView === "review" ? (
                <ReviewView
                  scriptApproved={scriptApproved}
                  storyboardApproved={storyboardApproved}
                  onApproveScript={approveScriptStep}
                  onApproveStoryboard={approveStoryboardStep}
                  onRegenerateStoryboard={() => setStoryboardApproved(false)}
                />
              ) : null}
              {activeView === "command" ? (
                <CommandView
                  activeStep={activeStep}
                  currentEvent={currentEvent}
                  currentStage={currentStage}
                  onFastForward={() =>
                    setActiveStep((value) => Math.min(value + 1, liveRunEvents.length - 1))
                  }
                  onOpenLibrary={() => openView("library")}
                />
              ) : null}
              {activeView === "library" ? <LibraryView onRestart={resetDemo} /> : null}
            </Panel>
          </main>
        </div>
      </div>
    </div>
  );
}

function DashboardView({ onNewRun }: { onNewRun: () => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Overview"
        title="A polished command surface for the whole creative run."
        description="Track live jobs, see what is blocked, and jump directly into the next approval or export without leaving the workspace."
      />

      <div className="flex flex-wrap gap-3">
        <ActionButton onClick={onNewRun}>Start new prompt</ActionButton>
        <ActionButton subtle>Review latest exports</ActionButton>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <div key={stat.label} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm text-zinc-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{stat.value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
              {stat.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
                Projects
              </p>
              <p className="mt-1 text-lg font-semibold text-white">Recent campaigns</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              Sync live
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {projects.map((project) => (
              <div key={project.name} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-white">{project.name}</p>
                    <p className="text-sm text-zinc-400">{project.industry}</p>
                  </div>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs ${pillClass(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <MetricMini label="Assets" value={`${project.assets}`} />
                  <MetricMini label="Runs" value={`${project.runs}`} />
                  <MetricMini label="Formats" value={project.formats.join(" / ")} />
                </div>
                <div className={`mt-4 h-1.5 rounded-full bg-gradient-to-r ${project.accent} opacity-90`} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Next up
          </p>
          <div className="mt-4 space-y-3">
            <NextStep label="Approve script package" note="Two hooks, one body, one CTA locked." />
            <NextStep label="Launch clip generation" note="Scene prompts are ready for provider dispatch." />
            <NextStep label="Export platform cuts" note="Variant recipes already match all three aspect ratios." />
          </div>
        </div>
      </div>
    </div>
  );
}

function IntakeView({
  audience,
  format,
  prompt,
  tone,
  onAudienceChange,
  onFormatChange,
  onPromptChange,
  onToneChange,
  onGenerateBrief,
  onSaveDraft,
}: {
  audience: string;
  format: string;
  prompt: string;
  tone: string;
  onAudienceChange: (value: string) => void;
  onFormatChange: (value: string) => void;
  onPromptChange: (value: string) => void;
  onToneChange: (value: string) => void;
  onGenerateBrief: () => void;
  onSaveDraft: () => void;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Prompt intake"
        title="Turn a rough brief into a structured creative run."
        description="This screen is intentionally guided: the user can describe what they want, upload assets, and shape the creative before the heavier generation stages begin."
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <div className="grid gap-4">
            <Field label="Campaign prompt" hint="Describe the goal, product, and tone in plain language.">
              <textarea
                value={prompt}
                onChange={(event) => onPromptChange(event.target.value)}
                rows={7}
                className="w-full rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-amber-300/40 focus:bg-white/[0.05]"
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Audience">
                <input
                  value={audience}
                  onChange={(event) => onAudienceChange(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-amber-300/40"
                />
              </Field>
              <Field label="Tone">
                <input
                  value={tone}
                  onChange={(event) => onToneChange(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-amber-300/40"
                />
              </Field>
              <Field label="Formats">
                <input
                  value={format}
                  onChange={(event) => onFormatChange(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-amber-300/40"
                />
              </Field>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <DropzoneCard title="Reference images" value="6 assets attached" />
              <DropzoneCard title="Brand notes" value="Voice guide and CTA rules" />
              <DropzoneCard title="Platform mix" value="Paid social, landing page, retargeting" />
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Generated brief
          </p>
          <div className="mt-4 space-y-4">
            <BriefRow label="Positioning" value="Premium, visually confident, conversion-aware." />
            <BriefRow label="Audience" value={audience} />
            <BriefRow label="Tone" value={tone} />
            <BriefRow label="Prompt shape" value="Hook, proof, emotional payoff, CTA." />
          </div>
          <div className="mt-6 rounded-[24px] border border-amber-300/20 bg-amber-300/8 p-4">
            <p className="text-sm font-medium text-amber-50">Approval gate</p>
            <p className="mt-1 text-sm leading-6 text-amber-100/80">
              The brief is good enough to start the writers room, but it still benefits from a
              quick human review before the clip stage begins.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <ActionButton onClick={onGenerateBrief}>Generate brief</ActionButton>
              <ActionButton subtle onClick={onSaveDraft}>
                Save draft
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewView({
  scriptApproved,
  storyboardApproved,
  onApproveScript,
  onApproveStoryboard,
  onRegenerateStoryboard,
}: {
  scriptApproved: boolean;
  storyboardApproved: boolean;
  onApproveScript: () => void;
  onApproveStoryboard: () => void;
  onRegenerateStoryboard: () => void;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Review studio"
        title="Approve the script and storyboard before the expensive media pass."
        description="The copy and scene plan are presented as editable artifacts, not hidden black-box outputs. That keeps the product trustworthy and makes approvals fast."
      />

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Script package
          </p>
          <div className="mt-4 space-y-4">
            {scriptCards.map((card) => (
              <div key={card.title} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{card.title}</p>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs ${
                      scriptApproved
                        ? "border-emerald-400/30 bg-emerald-400/12 text-emerald-100"
                        : "border-white/10 bg-white/5 text-zinc-300"
                    }`}
                  >
                    {scriptApproved ? "approved" : "review"}
                  </span>
                </div>
                <p className="mt-3 text-sm font-medium leading-6 text-amber-100">{card.hook}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{card.body}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
                  CTA: {card.cta}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
                Storyboard
              </p>
              <p className="mt-1 text-lg font-semibold text-white">Shot list and motion notes</p>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-xs ${
                storyboardApproved
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
                  : "border-amber-400/20 bg-amber-400/10 text-amber-100"
              }`}
            >
              {storyboardApproved ? "ready to render" : "awaiting approval"}
            </span>
          </div>

          <div className="mt-4 grid gap-3">
            {sceneCards.map((scene) => (
              <div key={scene.scene} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-white">{scene.scene}</p>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                    locked
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  <span className="text-[color:var(--accent-strong)]">Visual:</span> {scene.visual}
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  <span className="text-[color:var(--accent-strong)]">Motion:</span> {scene.motion}
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  <span className="text-[color:var(--accent-strong)]">Overlay:</span> {scene.overlay}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <ActionButton disabled={scriptApproved} onClick={onApproveScript}>
              {scriptApproved ? "Script approved" : "Approve script"}
            </ActionButton>
            <ActionButton
              disabled={!scriptApproved}
              onClick={onApproveStoryboard}
            >
              {storyboardApproved ? "Rendering launched" : "Approve storyboard"}
            </ActionButton>
            <ActionButton subtle onClick={onRegenerateStoryboard}>
              Regenerate storyboard
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommandView({
  currentStage,
  currentEvent,
  activeStep,
  onFastForward,
  onOpenLibrary,
}: {
  currentStage: (typeof stages)[number];
  currentEvent: (typeof liveRunEvents)[number];
  activeStep: number;
  onFastForward: () => void;
  onOpenLibrary: () => void;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Command center"
        title="The production floor is visible, tactile, and alive."
        description="This is the screen that should make the product feel expensive: a real-time flow of stage events, creative team updates, and edit-state progress."
      />

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Live run</p>
              <p className="mt-1 text-xl font-semibold text-white">Ad run `#0193` in motion</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(74,222,128,0.9)]" />
              Updating every few seconds
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {stages.map((stage, index) => {
              const status = index < activeStep ? "complete" : index === activeStep ? "live" : "queued";
              const progress = index < activeStep ? 100 : index === activeStep ? stage.progress : 0;
              return (
                <div
                  key={stage.id}
                  className={`rounded-[24px] border p-4 transition ${
                    index === activeStep
                      ? "border-amber-300/30 bg-white/[0.06] shadow-[0_0_0_1px_rgba(228,176,111,0.12)]"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-white">{stage.label}</p>
                        <span className={`rounded-full border px-3 py-1 text-xs ${pillClass(status)}`}>
                          {status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-zinc-400">{stage.actor}</p>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">{stage.note}</p>
                    </div>
                    <div className="min-w-[220px] space-y-2">
                      <ProgressBar value={progress} />
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>{progress}%</span>
                        <span>{status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
              Human-readable feed
            </p>
            <p className="mt-3 text-xl font-semibold text-white">{currentEvent.actor}</p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              {currentEvent.message} {currentStage.note}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ActionButton
                onClick={activeStep >= liveRunEvents.length - 1 ? onOpenLibrary : onFastForward}
              >
                {activeStep >= liveRunEvents.length - 1 ? "Open outputs" : "Advance stage"}
              </ActionButton>
              <ActionButton subtle>Pause theatrics</ActionButton>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
              Run metadata
            </p>
            <div className="mt-4 grid gap-3">
              <MetaRow label="Creative actor" value={currentEvent.actor} />
              <MetaRow label="Retries" value={String(currentEvent.attempt)} />
              <MetaRow label="Outputs" value="4 variants, 3 ratios" />
              <MetaRow label="Trace ID" value="trace_8fa2c1" />
            </div>
            <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-medium text-white">Recent event</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                {currentEvent.step} moved through `{currentEvent.stage}` at {currentEvent.progress}%.
                The next visible stage is {currentStage.actor}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LibraryView({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Final outputs"
        title="A library that makes it easy to download, compare, and relaunch."
        description="Each variant is treated as a product artifact with ratios, captions, and CTA details visible at a glance."
      />

      <div className="flex flex-wrap gap-3">
        <ActionButton onClick={onRestart}>Start another run</ActionButton>
        <ActionButton subtle>Reopen command center</ActionButton>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {outputVariants.map((variant) => (
          <div key={variant.title} className="rounded-[28px] border border-white/10 bg-black/20 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-white">{variant.title}</p>
                <p className="text-sm text-zinc-400">
                  {variant.duration} · {variant.aspect}
                </p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs ${pillClass(variant.status)}`}>
                {variant.status}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-300">{variant.theme}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">
              CTA: {variant.cta}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ActionButton>Download MP4</ActionButton>
              <ActionButton subtle>Duplicate</ActionButton>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Delivery bundle
          </p>
          <div className="mt-4 space-y-3">
            <MetaRow label="Files" value="4 MP4, 4 thumbnails, 4 subtitle packs" />
            <MetaRow label="Fallbacks" value="Animated stills and caption-only cut" />
            <MetaRow label="Share link" value="Enabled for workspace reviewers" />
            <MetaRow label="Next action" value="Launch the next prompt from this script" />
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
            Exports
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <ExportTile title="Vertical master" value="9:16" />
            <ExportTile title="Square cut" value="1:1" />
            <ExportTile title="Landscape cut" value="16:9" />
            <ExportTile title="Caption package" value="SRT + burned-in" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">{label}</p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function NextStep({ label, note }: { label: string; note: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
      <p className="font-medium text-white">{label}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-300">{note}</p>
    </div>
  );
}

function DropzoneCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-white/14 bg-white/[0.03] p-4">
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="mt-2 text-sm text-zinc-400">{value}</p>
    </div>
  );
}

function BriefRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">{label}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-200">{value}</p>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="text-sm text-zinc-100">{value}</p>
    </div>
  );
}

function ExportTile({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.26em] text-[color:var(--muted)]">{value}</p>
    </div>
  );
}

function ActionButton({
  children,
  subtle = false,
  disabled = false,
  onClick,
}: {
  children: ReactNode;
  subtle?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
        subtle
          ? "border border-white/10 bg-white/[0.03] text-zinc-100 hover:bg-white/[0.08]"
          : "bg-gradient-to-r from-amber-200 via-orange-300 to-amber-500 text-neutral-950 shadow-[0_16px_40px_rgba(228,176,111,0.22)] hover:brightness-105"
      } ${disabled ? "cursor-not-allowed opacity-45 hover:brightness-100" : ""}`}
    >
      {children}
    </button>
  );
}
