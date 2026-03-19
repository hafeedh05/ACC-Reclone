import Link from "next/link";
import {
  caseStudies,
  dashboardStats,
  outputVariants,
  pricingTiers,
  projects,
  trustSignals,
} from "@/components/mock-data";

const benefits = [
  "Prompt-first brief intake with guided approvals.",
  "Writers room, storyboard review, clip generation, and exports in one flow.",
  "Multiple variants from a single clip pool for faster campaign testing.",
];

const steps = [
  {
    title: "1. Brief the system",
    copy: "Drop in a prompt, attach assets, and define audience, tone, and formats without needing a long setup flow.",
  },
  {
    title: "2. Approve the creative",
    copy: "Review script options and storyboards before media generation begins, so the expensive part is always intentional.",
  },
  {
    title: "3. Ship variants",
    copy: "Receive a package of ad-ready variants in the formats your team needs for launch, testing, and repurposing.",
  },
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <div className="ambient-orb orb-gold drift-slow left-[-6rem] top-[-4rem] h-80 w-80" />
      <div className="ambient-orb orb-blue drift-medium right-[-7rem] top-20 h-96 w-96" />
      <div className="grid-fade absolute inset-0 opacity-30" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="glass-panel-strong flex flex-col gap-4 rounded-[30px] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--muted)]">
              Ad Command Center
            </p>
            <p className="mt-1 text-sm text-zinc-300">
              A prompt-first production workspace for premium ad creation.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link
              href="/app"
              className="rounded-full bg-gradient-to-r from-amber-200 via-orange-300 to-amber-500 px-4 py-2.5 font-medium text-neutral-950 shadow-[0_16px_40px_rgba(228,176,111,0.22)] transition hover:brightness-105"
            >
              Open workspace
            </Link>
            <Link
              href="#workflow"
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-zinc-100 transition hover:bg-white/[0.08]"
            >
              See workflow
            </Link>
          </div>
        </header>

        <div className="relative mt-4 grid flex-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="glass-panel-strong rounded-[34px] p-6 sm:p-8 lg:p-10">
            <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-emerald-100">
              Built for launch teams
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-zinc-50 sm:text-6xl lg:text-7xl">
              Turn a prompt and some pictures into ad campaigns people actually want to watch.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
              A cinematic command center for guided ad generation: write the brief, review the
              script, approve the storyboard, generate the clips, and export multiple variants
              from one coherent production run.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/app"
                className="rounded-full bg-gradient-to-r from-amber-200 via-orange-300 to-amber-500 px-5 py-3 font-medium text-neutral-950 shadow-[0_18px_48px_rgba(228,176,111,0.24)] transition hover:brightness-105"
              >
                Start a new run
              </Link>
              <Link
                href="#outputs"
                className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-zinc-100 transition hover:bg-white/[0.08]"
              >
                View output styles
              </Link>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {dashboardStats.map((stat) => (
                <div key={stat.label} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-zinc-400">{stat.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
                    {stat.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-panel rounded-[30px] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
                Live example
              </p>
              <div className="mt-4 space-y-3">
                {projects.map((project) => (
                  <div key={project.name} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">{project.name}</p>
                        <p className="text-sm text-zinc-400">{project.industry}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
                        {project.status}
                      </span>
                    </div>
                    <div className="mt-4 h-1.5 rounded-full bg-white/5">
                      <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-amber-300 via-orange-300 to-amber-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-[30px] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
                Why it feels premium
              </p>
              <div className="mt-4 space-y-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-sm leading-6 text-zinc-200">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section id="workflow" className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="glass-panel rounded-[30px] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
              Workflow
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              A guided system that moves from idea to export without losing the creative thread.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-300">
              The app keeps approvals visible, the production stages explicit, and the output
              formats organized so teams can move quickly without feeling rushed.
            </p>
            <div className="mt-6 space-y-3">
              {steps.map((step) => (
                <div key={step.title} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                  <p className="font-medium text-white">{step.title}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{step.copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel-strong rounded-[30px] p-6" id="outputs">
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
              Outputs
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              3-4 variants, each ready for the platform it was built for.
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {outputVariants.map((variant) => (
                <div key={variant.title} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-lg font-medium text-white">{variant.title}</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {variant.duration} · {variant.aspect}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-zinc-300">{variant.theme}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[24px] border border-amber-300/20 bg-amber-300/8 p-4">
              <p className="text-sm font-medium text-amber-50">Launch-ready by design</p>
              <p className="mt-2 text-sm leading-6 text-amber-100/80">
                Review the creative, watch the command center run, and send the final package to
                your team without exposing the infrastructure behind it.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <div key={study.title} className="glass-panel rounded-[30px] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
                {study.category}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{study.title}</h2>
              <p className="mt-3 text-sm font-medium text-amber-100">{study.outcome}</p>
              <p className="mt-4 text-sm leading-6 text-zinc-300">{study.summary}</p>
            </div>
          ))}
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="glass-panel rounded-[30px] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Trust</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              The product explains itself while it works.
            </h2>
            <div className="mt-6 space-y-3">
              {trustSignals.map((signal) => (
                <div key={signal} className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                  <p className="text-sm leading-6 text-zinc-200">{signal}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel-strong rounded-[30px] p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
                  Pricing
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                  Structured for launches now and scale later.
                </h2>
              </div>
              <Link
                href="/app"
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-zinc-100 transition hover:bg-white/[0.08]"
              >
                Try the workflow
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-[24px] border p-4 ${
                    tier.highlighted
                      ? "border-amber-300/30 bg-amber-300/8"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <p className="text-sm font-medium text-white">{tier.name}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{tier.price}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{tier.caption}</p>
                  <div className="mt-4 space-y-2">
                    {tier.points.map((point) => (
                      <p key={point} className="text-sm text-zinc-200">
                        {point}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4 mb-10">
          <div className="glass-panel-strong rounded-[34px] p-6 sm:p-8 lg:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
              Enterprise
            </p>
            <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Need a private rollout, custom governance, or a tighter production lane?
                </h2>
                <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">
                  This stack is structured for staged environments, hidden provider plumbing,
                  event-driven workflow control, and a branded command surface that can scale into
                  a real production system.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/app"
                  className="rounded-full bg-gradient-to-r from-amber-200 via-orange-300 to-amber-500 px-5 py-3 font-medium text-neutral-950 shadow-[0_18px_48px_rgba(228,176,111,0.24)] transition hover:brightness-105"
                >
                  Enter the command center
                </Link>
                <Link
                  href="mailto:enterprise@ad-command-center.example"
                  className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-zinc-100 transition hover:bg-white/[0.08]"
                >
                  Contact enterprise
                </Link>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
