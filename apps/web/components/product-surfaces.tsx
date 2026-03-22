"use client";

import { useState } from "react";
import {
  commandStages,
  eventRows,
  projects,
  type OutputRecord,
  type ProjectRecord,
} from "./site-data";
import type { ReactNode } from "react";
import {
  ButtonLink,
  Chip,
  EditorialDivider,
  MetricLine,
  SectionIntro,
  StatusBadge,
} from "./site-primitives";
import { EditorialMediaFrame, mediaForRun } from "./media-system";

type FrameTone = "amber" | "cobalt" | "neutral";
type FrameAspect = "browser" | "square" | "portrait" | "landscape";

const workspaceSignals = [
  {
    label: "Active runs",
    value: "03",
    note: "Two live, one awaiting review.",
  },
  {
    label: "Ready outputs",
    value: "11",
    note: "Packaged for publish, share, or handoff.",
  },
  {
    label: "Review gates",
    value: "02",
    note: "Script and storyboard approvals stay visible.",
  },
];

const dashboardLeadCards = [
  {
    eyebrow: "Inbox",
    title: "Aster House Launch",
    note: "Storyboard approved. Clip lab is queued behind a clean script pass.",
    tone: "amber" as const,
    status: "Live",
  },
  {
    eyebrow: "Priority",
    title: "Northstar Serum Launch",
    note: "Performance, brand, feature, and platform cuts share one production pool.",
    tone: "cobalt" as const,
    status: "Rendering",
  },
  {
    eyebrow: "Template",
    title: "Beauty launch",
    note: "Pack-shot-led campaigns with disciplined approval gates and multi-format exports.",
    tone: "neutral" as const,
    status: "Saved",
  },
];

const outputFilterOptions = ["All", "Performance", "Brand", "Feature", "Platform"] as const;

const curatedOutputs: Array<OutputRecord & { category: string; summary: string; cue: string }> = [
  {
    name: "Performance Cut",
    aspect: "9:16",
    status: "Ready",
    note: "Highest-intent opening and early proof.",
    category: "Performance",
    summary: "Built for short-form mobile placements with a direct first beat.",
    cue: "Scroll-stop hook",
  },
  {
    name: "Brand Cut",
    aspect: "1:1",
    status: "Ready",
    note: "Softer pacing with stronger brand texture.",
    category: "Brand",
    summary: "Keeps tonal control and product clarity intact across square formats.",
    cue: "Editorial tone",
  },
  {
    name: "Feature Cut",
    aspect: "16:9",
    status: "Rendering",
    note: "Longer product explanation and slower cadence.",
    category: "Feature",
    summary: "Lets the proof breathe with a wider canvas and more context.",
    cue: "Feature story",
  },
  {
    name: "Platform Cut",
    aspect: "9:16",
    status: "Ready",
    note: "Condensed export for retail and social placements.",
    category: "Platform",
    summary: "A compact delivery variant that stays usable on fast-moving channels.",
    cue: "Delivery pack",
  },
];

const commandScenes = [
  {
    id: "01",
    title: "Arrival hold",
    duration: "1.4s",
    note: "Warm entry frame locks the property tone before any text lands.",
    overlay: "Space first / calm opener",
    status: "Complete",
  },
  {
    id: "02",
    title: "Material proof",
    duration: "2.2s",
    note: "Window line and material detail carry the premium proof beat.",
    overlay: "Material detail / premium restraint",
    status: "Complete",
  },
  {
    id: "03",
    title: "Reveal sequence",
    duration: "3.8s",
    note: "The main interior reveal is active and feeding the output family.",
    overlay: "Light, scale, and confidence",
    status: "Live",
  },
  {
    id: "04",
    title: "Inquiry close",
    duration: "1.6s",
    note: "CTA frame is queued behind storyboard confirmation.",
    overlay: "Book a viewing",
    status: "Queued",
  },
];

const commandOutputRoutes = [
  {
    name: "Performance",
    aspect: "9:16",
    scenes: ["01", "03", "04"],
    note: "Lead hook and faster inquiry close",
    state: "Live",
  },
  {
    name: "Brand",
    aspect: "1:1",
    scenes: ["02", "03", "04"],
    note: "Longer hold on materials and tone",
    state: "Live",
  },
  {
    name: "Feature",
    aspect: "16:9",
    scenes: ["01", "02", "03", "04"],
    note: "Wider narrative and slower cadence",
    state: "Queued",
  },
  {
    name: "Platform",
    aspect: "9:16",
    scenes: ["03", "04"],
    note: "Compact channel-specific export",
    state: "Ready",
  },
];

const commandTelemetry = [
  { label: "Run", value: "AC-184", note: "Aster House / launch" },
  { label: "Elapsed", value: "09:16", note: "Run clock live" },
  { label: "Scene focus", value: "03 / 04", note: "Reveal sequence active" },
  { label: "Route cover", value: "3 / 4", note: "Feature cut is the only queued export" },
];

const commandRoleLedger = [
  { name: "Head Writer", status: "Locked", updatedAt: "09:04", dependency: "Brief normalized" },
  { name: "Hook Writer", status: "Ready", updatedAt: "09:08", dependency: "Openers ranked" },
  { name: "Benefit Writer", status: "Ready", updatedAt: "09:11", dependency: "Benefit stack tightened" },
  { name: "Brand Voice Editor", status: "In pass", updatedAt: "09:13", dependency: "Language pass live" },
  { name: "Storyboard Lead", status: "Queued", updatedAt: "09:16", dependency: "Waiting on overlay release" },
  { name: "Variant Strategist", status: "Queued", updatedAt: "09:18", dependency: "Routes pre-mapped for four cuts" },
  { name: "Clip Lab", status: "Waiting", updatedAt: "09:18", dependency: "Held behind storyboard approval" },
  { name: "Editor Desk", status: "Waiting", updatedAt: "09:18", dependency: "Fallback assembly ready" },
];

const commandDependencies = [
  {
    label: "Writers room",
    value: "Locked",
    note: "Hook stack approved at 09:13 and released to storyboard prep.",
    time: "09:13",
  },
  {
    label: "Storyboard",
    value: "Queued",
    note: "Scene 04 waits on the final overlay confirmation.",
    time: "09:21",
  },
  {
    label: "Output routes",
    value: "Mapped",
    note: "Scene 03 is already feeding performance, brand, and platform.",
    time: "09:24",
  },
];

const commandTransfers = [
  {
    time: "09:13",
    artifact: "script.v3",
    from: "Head Writer",
    to: "Brand Voice Editor",
    status: "Locked",
    note: "Lead angle approved and handed to language pass.",
  },
  {
    time: "09:18",
    artifact: "scene.03.overlay",
    from: "Brand Voice Editor",
    to: "Storyboard Lead",
    status: "Live",
    note: "Reveal overlay is attached to the current scene board.",
  },
  {
    time: "09:24",
    artifact: "route-map.performance",
    from: "Variant Strategist",
    to: "Editor Desk",
    status: "Mapped",
    note: "Scene 03 is routed into three live exports.",
  },
  {
    time: "09:27",
    artifact: "fallback.still-pack",
    from: "Clip Lab",
    to: "Editor Desk",
    status: "Ready",
    note: "Still-led fallback is armed if the live motion beat slips.",
  },
];

function toneForStatus(status: string) {
  if (status === "Complete" || status === "Ready" || status === "Locked") {
    return "success" as const;
  }

  if (status === "Live" || status === "In pass" || status === "Rendering") {
    return "accent" as const;
  }

  if (status === "Queued" || status === "Waiting") {
    return "warning" as const;
  }

  return "default" as const;
}

function ratioToFrame(aspect: string): FrameAspect {
  if (aspect === "16:9") {
    return "landscape";
  }

  if (aspect === "1:1") {
    return "square";
  }

  if (aspect === "9:16") {
    return "portrait";
  }

  return "browser";
}

export function DashboardSurface() {
  return (
    <div className="app-surface app-surface--dashboard">
      <section className="workspace-hero">
        <div className="workspace-hero__copy">
          <SectionIntro
            eyebrow="Workspace"
            title="A production desk that keeps the next useful action in view"
            body="Recent campaigns stay readable, templates remain practical, and the workspace never collapses into a noisy grid of empty cards."
          />

          <div className="action-strip">
            <ButtonLink href="/app/command-center" variant="primary">
              Open command center
            </ButtonLink>
            <ButtonLink href="/app/projects/aster-house-launch" variant="secondary">
              Resume project
            </ButtonLink>
          </div>

          <div className="workspace-stat-grid">
            <MetricLine label="Runs in motion" value="03" />
            <MetricLine label="Review-ready" value="02" />
            <MetricLine label="Delivered this week" value="11" />
          </div>

          <div className="signal-strip" aria-label="Workspace signals">
            {workspaceSignals.map((signal) => (
              <article key={signal.label} className="signal-strip__item">
                <p className="eyebrow">{signal.label}</p>
                <strong>{signal.value}</strong>
                <span>{signal.note}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="workspace-hero__preview">
          <StudioFrame
            eyebrow="Live inbox"
            title="Aster House Launch"
            note="Storyboard approved. The latest run is moving into assembly."
            tone="amber"
            aspect="browser"
          >
            <div className="workspace-preview">
              <div className="workspace-preview__column">
                {dashboardLeadCards.map((card) => (
                  <article key={card.title} className="mini-run-card">
                    <div className="mini-run-card__head">
                      <p className="eyebrow">{card.eyebrow}</p>
                      <StatusBadge tone={card.tone === "amber" ? "accent" : card.tone === "cobalt" ? "default" : "success"}>
                        {card.status}
                      </StatusBadge>
                    </div>
                    <h3>{card.title}</h3>
                    <p>{card.note}</p>
                  </article>
                ))}
              </div>
              <div className="workspace-preview__column workspace-preview__column--visual">
                <div className="workspace-preview__lead">
                  <p className="eyebrow">Latest output</p>
                  <h3>Performance Cut</h3>
                  <p>Warm residential framing with a strong opening beat and a clean handoff to the CTA.</p>
                </div>
                <div className="workspace-preview__formats">
                  {["9:16", "1:1", "16:9"].map((format) => (
                    <article key={format} className="format-chip-card">
                      <strong>{format}</strong>
                      <span>{format === "9:16" ? "Mobile-first" : format === "1:1" ? "Feed-ready" : "Landscape"}</span>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </StudioFrame>
        </div>
      </section>

      <EditorialDivider label="Projects" detail="Recent campaigns" />

      <section className="project-ledger project-ledger--workspace">
        {projects.map((project) => (
          <article key={project.slug} className="project-ledger__row project-ledger__row--workspace">
            <div className="project-ledger__lead">
              <p className="eyebrow">{project.industry}</p>
              <h3>{project.name}</h3>
              <p>{project.brief}</p>
            </div>
            <div className="project-ledger__meta">
              <StatusBadge tone={project.status.includes("Rendering") ? "accent" : "success"}>
                {project.status}
              </StatusBadge>
              <div className="project-ledger__details">
                <div>Formats: {project.formats.join(" · ")}</div>
                <div>Updated: {project.updatedAt}</div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <EditorialDivider label="Templates" detail="Saved starting points" />

      <section className="template-row">
        {["Beauty launch", "Product drop", "Residential campaign"].map((template, index) => (
          <article key={template} className="template-row__item template-row__item--workspace">
            <p className="eyebrow">Template 0{index + 1}</p>
            <h3>{template}</h3>
            <p>Structured for assets, formats, and review logic without overfitting the campaign tone.</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export function ProjectDetailSurface({ project }: { project: ProjectRecord }) {
  const relatedProjects = projects.filter((item) => item.slug !== project.slug).slice(0, 2);

  return (
    <div className="app-surface app-surface--project">
      <section className="project-detail-shell">
        <div className="project-detail-shell__main">
          <SectionIntro
            eyebrow={project.industry}
            title={project.name}
            body={project.brief}
          />

          <div className="project-breadcrumb">
            <span>Project</span>
            <span>Brief</span>
            <span>Approvals</span>
            <span>Outputs</span>
          </div>

          <StudioFrame
            eyebrow="Concept summary"
            title="A disciplined launch system"
            note="The creative line stays premium while the output family remains wide enough to reuse."
            tone="cobalt"
            aspect="browser"
          >
            <div className="project-snapshot">
              <div className="project-snapshot__body">
                <p className="eyebrow">Selected assets</p>
                <div className="asset-tray asset-tray--project">
                  {project.assets.map((asset, index) => (
                    <article key={asset} className="asset-tile">
                      <div className="asset-tile__frame">
                        <span>{index + 1}</span>
                        <strong>{asset}</strong>
                      </div>
                      <p>Assigned to a specific scene or export role in the run.</p>
                    </article>
                  ))}
                </div>
              </div>
              <div className="project-snapshot__rail">
                <article className="story-card">
                  <p className="eyebrow">Approved script</p>
                  <h3>Hook, proof, and CTA are locked.</h3>
                  <p>
                    The opening beat lands fast, the proof sequence stays compact, and the offer remains visible.
                  </p>
                </article>
                <article className="story-card story-card--soft">
                  <p className="eyebrow">Storyboard</p>
                  <h3>Four-scene structure</h3>
                  <p>
                    Arrival, proof, product detail, and final CTA are sequenced for multi-format reuse.
                  </p>
                </article>
              </div>
            </div>
          </StudioFrame>

          <div className="detail-grid">
            <article className="detail-card detail-card--wide">
              <p className="eyebrow">Output plan</p>
              <div className="variant-lane">
                {[
                  "Performance Cut",
                  "Brand Cut",
                  "Feature Cut",
                  "Platform Cut",
                ].map((variant) => (
                  <article key={variant} className="variant-lane__item">
                    <strong>{variant}</strong>
                    <span>{variant === "Performance Cut" ? "Scroll-stop first" : "Multi-format reuse"}</span>
                  </article>
                ))}
              </div>
            </article>

            <article className="detail-card">
              <p className="eyebrow">Latest outputs</p>
              <div className="project-output-stack">
                {project.formats.map((format, index) => (
                  <div key={format} className="project-output-row">
                    <span>{format}</span>
                    <strong>{index === 0 ? "Publish-ready" : "Queued"}</strong>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="project-related">
            <EditorialDivider label="Related runs" detail="Adjacent campaigns" />
            <div className="related-grid">
              {relatedProjects.map((item) => (
                <article key={item.slug} className="related-card">
                  <p className="eyebrow">{item.industry}</p>
                  <h3>{item.name}</h3>
                  <p>{item.brief}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="project-detail-shell__rail">
          <div className="rail-panel rail-panel--sticky">
            <p className="eyebrow">Status</p>
            <h3>{project.status}</h3>
            <p>Last update: {project.updatedAt}</p>
            <div className="project-cta-stack">
              <ButtonLink href="/app/command-center" variant="primary">
                Open command center
              </ButtonLink>
              <ButtonLink href="/app/outputs" variant="secondary">
                Review outputs
              </ButtonLink>
            </div>
          </div>

          <div className="rail-panel">
            <p className="eyebrow">Goals</p>
            <ul className="bullet-list">
              {project.goals.map((goal) => (
                <li key={goal}>{goal}</li>
              ))}
            </ul>
          </div>

          <div className="rail-panel">
            <p className="eyebrow">Formats</p>
            <div className="chip-row">
              {project.formats.map((format) => (
                <Chip key={format} tone="accent">
                  {format}
                </Chip>
              ))}
            </div>
          </div>

          <div className="rail-panel">
            <p className="eyebrow">Approvals</p>
            <div className="space-y-3">
              <StatusBadge tone="success">Script approved</StatusBadge>
              <StatusBadge tone="success">Storyboard approved</StatusBadge>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

export function CommandCenterSurface() {
  return (
    <div className="app-surface app-surface--command">
      <CommandCenterShowcase />
    </div>
  );
}

export function CommandCenterShowcase({ compact = false }: { compact?: boolean }) {
  const currentScene = commandScenes.find((scene) => scene.status === "Live") ?? commandScenes[2];
  const currentStage = commandStages.find((stage) => stage.status === "Live") ?? commandStages[2];
  const visibleEvents = eventRows.slice(0, compact ? 3 : 3);
  const visibleTransfers = commandTransfers.slice(0, compact ? 3 : 3);
  const visibleDependencies = commandDependencies.slice(0, 2);
  const compactRoles = commandRoleLedger.slice(0, 2);
  const compactRoutes = commandOutputRoutes.slice(0, 3);
  const telemetryRows = compact ? commandTelemetry.slice(0, 2) : commandTelemetry.slice(0, 2);
  const activeRoles = compact ? compactRoles : commandRoleLedger.filter((role) => role.status !== "Waiting").slice(0, 4);
  const liveEvents = compact ? visibleEvents : visibleEvents.slice(0, 2);

  return (
    <div
      className={["command-plane", "command-plane--rescued", "command-plane--open", compact ? "is-compact" : ""].join(" ")}
      style={{ containerType: "inline-size" }}
    >
      <section className="command-plane__core command-plane__core--open">
        <header className="command-plane__hero">
          <div className="command-plane__hero-copy">
            <p className="eyebrow">Command Center</p>
            <h2>Aster House Launch</h2>
            <p className="command-plane__hero-note">Scene 03 is live and already feeding the export map.</p>
          </div>
          <div className="command-plane__hero-meta">
            <span>AC-184 live</span>
            <span>{currentStage.name} {currentStage.progress}%</span>
            <span>Fallback ready</span>
          </div>
        </header>

        {compact ? (
          <div className="command-plane__mini-overview">
            <article>
              <p className="eyebrow">Scene focus</p>
              <strong>
                {currentScene.id} / {currentScene.title}
              </strong>
              <span>{currentScene.status} with fallback prepared</span>
            </article>
            <article>
              <p className="eyebrow">Output map</p>
              <strong>{compactRoutes.length} live export paths</strong>
              <span>Performance, brand, and feature are already mapped.</span>
            </article>
          </div>
        ) : null}

        <article className="command-plane__board">
          <section className="command-plane__scene-panel">
            <div className="command-plane__scene-headline">
              <div>
                <p className="eyebrow">Active scene</p>
                <h3>
                  Scene {currentScene.id} · {currentScene.title}
                </h3>
                <p className="command-plane__scene-note">
                  The live scene stays in focus while the next beat waits cleanly in queue.
                </p>
              </div>
              <div className="command-plane__scene-statuses">
                <StatusBadge tone="accent">{currentScene.status}</StatusBadge>
                <StatusBadge tone="default">{currentScene.duration}</StatusBadge>
              </div>
            </div>

            <div className="command-plane__scene-canvas">
              <div className="command-plane__canvas command-plane__canvas--rescued command-plane__canvas--open">
                <EditorialMediaFrame
                  asset={mediaForRun("aster-house-launch")}
                  aspect="landscape"
                  className="command-plane__canvas-media"
                  motion
                  sizes="(min-width: 1280px) 42vw, 100vw"
                />
                <div className="command-plane__canvas-tags">
                  {["Scene 03 live"].map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="command-plane__canvas-notes">
              <div>
                <p className="eyebrow">Overlay</p>
                <span>{currentScene.overlay}</span>
              </div>
              <div>
                <p className="eyebrow">Latest handoff</p>
                <span>Scene 04 is queued behind overlay confirmation.</span>
              </div>
            </div>

            <div className="command-plane__scene-strip">
              {commandScenes.map((scene) => (
                <article
                  key={scene.id}
                  className={[
                    "command-plane__scene-chip",
                    scene.status === "Live"
                      ? "is-live"
                      : scene.status === "Complete"
                        ? "is-complete"
                        : "is-queued",
                  ].join(" ")}
                >
                  <b>{scene.id}</b>
                  <div>
                    <strong>{scene.title}</strong>
                    <span>{scene.status}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="command-plane__movement">
            <div className="command-plane__dependency-strip">
              {visibleDependencies.map((item) => (
                <article key={item.label} className="command-plane__dependency-chip">
                  <p>{item.label}</p>
                  <strong>{item.value}</strong>
                  <span>{item.time}</span>
                </article>
              ))}
            </div>

            <div className="command-plane__stream">
              <div className="command-plane__stream-head">
                <p className="eyebrow">Artifact movement</p>
                <StatusBadge tone="accent">{visibleTransfers.length} live handoffs</StatusBadge>
              </div>
              <div className="command-plane__transfer-list command-plane__transfer-list--open">
                {visibleTransfers.map((transfer) => (
                  <article key={`${transfer.time}-${transfer.artifact}`} className="command-plane__transfer command-plane__transfer--open">
                    <div className="command-plane__transfer-time">{transfer.time}</div>
                    <div className="command-plane__transfer-copy">
                      <p>{transfer.artifact}</p>
                      <strong>
                        {transfer.from} to {transfer.to}
                      </strong>
                      <span>{transfer.note}</span>
                    </div>
                    <StatusBadge tone={toneForStatus(transfer.status)}>{transfer.status}</StatusBadge>
                  </article>
                ))}
              </div>
            </div>

            <div className="command-plane__route-list command-plane__route-list--open">
              {(compact ? compactRoutes : commandOutputRoutes).map((route) => (
                <article key={route.name} className="command-plane__route command-plane__route--open">
                  <div className="command-plane__route-head">
                    <div>
                      <p>{route.aspect}</p>
                      <strong>{route.name}</strong>
                    </div>
                    <div className="command-plane__route-meta">
                      <StatusBadge tone={toneForStatus(route.state)}>{route.state}</StatusBadge>
                      <span>{route.note}</span>
                    </div>
                  </div>
                  <div className="command-plane__route-map">
                    {commandScenes.map((scene) => (
                      <b
                        key={`${route.name}-${scene.id}`}
                        className={[
                          route.scenes.includes(scene.id)
                            ? scene.id === currentScene.id
                              ? "is-live"
                              : "is-on"
                            : "",
                        ].join(" ")}
                      >
                        {scene.id}
                      </b>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            {compact ? (
              <div className="command-plane__compact-band command-plane__compact-band--open">
                <article>
                  <p className="eyebrow">Active roles</p>
                  <div className="command-plane__compact-list">
                    {compactRoles.map((role) => (
                      <div key={role.name}>
                        <strong>{role.name}</strong>
                        <span>
                          {role.status} · {role.updatedAt}
                        </span>
                      </div>
                    ))}
                  </div>
                </article>

                <article>
                  <p className="eyebrow">Latest movement</p>
                  <div className="command-plane__compact-list">
                    {visibleTransfers.slice(0, 2).map((transfer) => (
                      <div key={`${transfer.time}-${transfer.artifact}`}>
                        <strong>{transfer.artifact}</strong>
                        <span>
                          {transfer.from} to {transfer.to} · {transfer.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </article>

                <article>
                  <p className="eyebrow">Output cover</p>
                  <div className="command-plane__compact-list">
                    {compactRoutes.map((route) => (
                      <div key={route.name}>
                        <strong>
                          {route.name} · {route.aspect}
                        </strong>
                        <span>{route.state}</span>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            ) : null}
          </section>
        </article>

        {!compact ? (
          <section className="command-plane__afterglow">
            <div className="command-plane__telemetry command-plane__telemetry--open">
              {telemetryRows.map((item) => (
                <article key={item.label} className="command-plane__telemetry-item">
                  <p>{item.label}</p>
                  <strong>{item.value}</strong>
                  <span>{item.note}</span>
                </article>
              ))}
            </div>
            <CommandBriefRail />
          </section>
        ) : null}
      </section>

      {!compact ? <aside className="command-plane__ops command-plane__ops--rescued command-plane__ops--open">
        <section className="command-plane__ops-section command-plane__ops-section--events">
          <div className="command-plane__ops-head">
            <p className="eyebrow">Live feed</p>
            <StatusBadge tone="default">latest events</StatusBadge>
          </div>
          <div className="command-plane__event-list" aria-live="polite">
            {liveEvents.map((event, rowIndex) => (
              <article key={`${event.time}-${event.title}-${rowIndex}`} className="command-plane__event">
                <div className="command-plane__event-meta">
                  <p>{event.time}</p>
                  <StatusBadge tone={event.severity === "warning" ? "warning" : "default"}>
                    {event.role}
                  </StatusBadge>
                </div>
                <strong>{event.title}</strong>
                <span>{event.note}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="command-plane__ops-section command-plane__ops-section--roles">
          <div className="command-plane__ops-head">
            <p className="eyebrow">Role ledger</p>
            <StatusBadge tone="accent">{activeRoles.length} active roles</StatusBadge>
          </div>
          <div className="command-plane__role-list command-plane__role-list--compact">
            {activeRoles.map((role) => (
              <article key={role.name} className="command-plane__role">
                <strong>{role.name}</strong>
                <div className="command-plane__role-meta">
                  <em>{role.updatedAt}</em>
                  <StatusBadge tone={toneForStatus(role.status)}>{role.status}</StatusBadge>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="command-plane__recovery command-plane__recovery--open">
          <div className="command-plane__ops-head">
            <p className="eyebrow">Recovery path</p>
            <StatusBadge tone="warning">Ready</StatusBadge>
          </div>
          <strong>Still-led assembly is already mapped for the live scene.</strong>
          <span>Performance, brand, and platform cuts keep moving even if one motion beat slips.</span>
        </section>
      </aside> : null}
    </div>
  );
}

function CommandBriefRail() {
  return (
    <aside className="command-brief command-brief--open">
      <div className="command-brief__sheet command-brief__sheet--open">
        <div className="command-brief__summary">
          <p className="eyebrow">Brief</p>
          <h3>Aster House</h3>
          <p>
            Premium residential launch shaped around light, space, and inquiry-ready calm.
          </p>
        </div>

        <div className="command-brief__asset-list command-brief__asset-list--open">
          {["Arrival lounge", "Window line"].map((asset, index) => (
            <article
              key={asset}
              className={[
                "command-brief__asset",
                "command-brief__asset--open",
                index === 0 ? "is-lead" : "",
              ].join(" ")}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{asset}</strong>
                <p>
                  {index === 0
                    ? "Primary scene"
                    : "Material proof"}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="command-brief__support">
          <div className="command-brief__meta command-brief__meta--open">
            <span>Residential</span>
            <span>Multi-format</span>
            <span>Inquiry-led</span>
          </div>
          <div className="command-brief__formats command-brief__formats--open">
            {["9:16", "1:1", "16:9"].map((format) => (
              <span key={format}>{format}</span>
            ))}
          </div>
          <div className="command-brief__approval-list command-brief__approval-list--open">
            <span>Script approved</span>
            <span>Storyboard approved</span>
          </div>
        </div>

        <div className="command-brief__run-meta">
          <div>
            <span>Run clock</span>
            <strong>09:16</strong>
          </div>
          <div>
            <span>Fallback</span>
            <strong>Still-led assembly ready</strong>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function OutputsLibrarySurface() {
  const [mode, setMode] = useState<"grid" | "list">("grid");
  const [selectedFilter, setSelectedFilter] = useState<(typeof outputFilterOptions)[number]>("All");

  const filteredOutputs = curatedOutputs.filter(
    (output) => selectedFilter === "All" || output.category === selectedFilter,
  );

  return (
    <div className="app-surface app-surface--outputs">
      <section className="outputs-library-header">
        <SectionIntro
          eyebrow="Outputs"
          title="An output library that feels finished instead of leftover"
          body="Variants stay easy to scan, actions stay elegant, and the final package is useful to the next team the moment it arrives."
        />
        <div className="outputs-library-header__actions">
          <div className="toggle-row" role="tablist" aria-label="View mode">
            <button
              type="button"
              className={mode === "grid" ? "filter-chip filter-chip--active" : "filter-chip"}
              onClick={() => setMode("grid")}
            >
              Grid
            </button>
            <button
              type="button"
              className={mode === "list" ? "filter-chip filter-chip--active" : "filter-chip"}
              onClick={() => setMode("list")}
            >
              List
            </button>
          </div>
          <div className="surface-filter-row" aria-label="Output filters">
            {outputFilterOptions.map((filter) => (
              <button
                key={filter}
                type="button"
                className={selectedFilter === filter ? "filter-chip filter-chip--active" : "filter-chip"}
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={mode === "grid" ? "outputs-grid" : "outputs-list"}>
        {filteredOutputs.map((output) => (
          <article key={output.name} className={mode === "grid" ? "output-card" : "output-row"}>
            <StudioFrame
              eyebrow={output.category}
              title={output.name}
              note={output.summary}
              tone={output.category === "Performance" ? "amber" : output.category === "Brand" ? "cobalt" : "neutral"}
              aspect={ratioToFrame(output.aspect)}
            >
              <div className="output-preview">
                <div className="output-preview__layer">
                  <span className="eyebrow">{output.aspect}</span>
                  <strong>{output.cue}</strong>
                </div>
              </div>
            </StudioFrame>

            <div className={mode === "grid" ? "output-card__body" : "output-row__body"}>
              <div className="output-card__title-row">
                <div>
                  <p className="eyebrow">Variant</p>
                  <h3>{output.name}</h3>
                </div>
                <StatusBadge tone={output.status === "Rendering" ? "warning" : "success"}>
                  {output.status}
                </StatusBadge>
              </div>
              <p>{output.note}</p>
              <div className="chip-row">
                <Chip tone="accent">{output.aspect}</Chip>
                <Chip>{output.cue}</Chip>
                <Chip tone="cobalt">{output.category}</Chip>
              </div>
              <div className="output-actions">
                <button type="button" className="surface-action">
                  Publish
                </button>
                <button type="button" className="surface-action">
                  Download
                </button>
                <button type="button" className="surface-action">
                  Share
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function StudioFrame({
  eyebrow,
  title,
  note,
  tone = "neutral",
  aspect = "browser",
  children,
}: {
  eyebrow: string;
  title: string;
  note: string;
  tone?: FrameTone;
  aspect?: FrameAspect;
  children: ReactNode;
}) {
  return (
    <article className={`studio-frame studio-frame--${tone} studio-frame--${aspect}`}>
      <div className="studio-frame__chrome">
        <span />
        <span />
        <span />
        <span className="studio-frame__label">{eyebrow}</span>
      </div>
      <div className="studio-frame__surface">
        <div className="studio-frame__copy">
          <p className="eyebrow">{eyebrow}</p>
          <h3>{title}</h3>
          <p>{note}</p>
        </div>
        <div className="studio-frame__content">{children}</div>
      </div>
    </article>
  );
}
