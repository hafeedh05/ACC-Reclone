# Repo Index: Ad Command Center

This repository is a productized monorepo for a prompt-first ad generation platform. The current codebase ships a polished web surface, a Rust control plane, shared contracts, and GCP deployment scaffolding. The original Python proof of concept still exists under `legacy/prototype` as reference only.

## Current State

- Local repo path: `/Users/ahmad/sobha-video-ads-code`
- GitHub repo: `https://github.com/ahmadyoussefrifai-dev/ad-command-center`
- Deploy status: `main` is deployed to `dev`
- Last verified date: `2026-03-19`

### Live Dev URLs

- Web: `https://ad-command-center-dev-web-k66jrtxjhq-uc.a.run.app`
- Workspace UI: `https://ad-command-center-dev-web-k66jrtxjhq-uc.a.run.app/app`
- API: `https://ad-command-center-dev-api-k66jrtxjhq-uc.a.run.app`
- API health: `https://ad-command-center-dev-api-k66jrtxjhq-uc.a.run.app/v1/admin/health`
- Orchestrator: `https://ad-command-center-dev-orchestrator-k66jrtxjhq-uc.a.run.app`
- Workers: `https://ad-command-center-dev-workers-k66jrtxjhq-uc.a.run.app`

## What This Repo Actually Is

- Public SaaS scaffold for generating ad campaigns from a prompt plus uploaded assets
- Marketing site plus authenticated product UI in Next.js
- Rust API, orchestration layer, and worker services
- Shared OpenAPI and event contracts
- Terraform-managed GCP deployment stack

## What Is Real vs What Is Still Stubbed

### Implemented

- Marketing site and command center UI
- Rust API routes for projects, runs, approvals, events, variants, and admin health
- Orchestrator service skeleton
- Worker service skeleton with role-based entrypoints
- Shared domain types and contracts
- Terraform for Cloud Run, Cloud SQL, Storage, Pub/Sub, Cloud Tasks, Secret Manager, Artifact Registry, and load balancer wiring
- GitHub Actions CI/CD

### Placeholder-backed

- Persistent database implementation is not wired yet
- Signed upload generation is not wired yet
- Production auth, quotas, billing, and abuse controls are not fully wired yet
- Real provider adapters for script generation, video generation, voice, QC, and final media rendering are not wired yet

### Critical Boundary

The provider abstraction is real, but the runtime implementations are currently mock providers:

- Real interfaces: `services/shared/src/providers.rs`
- Mock implementations: `services/shared/src/mock.rs`

That means the product shell and control plane are real, but the actual model-powered generation path is still simulated behind those interfaces.

## Monorepo Map

- `apps/web`
  - Next.js marketing site and app shell
  - primary user-facing surface
- `services/api`
  - public Rust API
  - project, run, approval, event, variant, and admin endpoints
- `services/orchestrator`
  - workflow/state-machine service
  - tick and reconcile endpoints
- `services/workers`
  - worker roles for writer, video, voice, QC, edit, and render
- `services/shared`
  - shared Rust domain models, store, orchestration helpers, provider interfaces, mock providers
- `packages/contracts`
  - TypeScript contracts, OpenAPI spec, event schema
- `infra`
  - Terraform for GCP environments and service wiring
- `docs`
  - architecture and six-agent delivery docs
- `legacy/prototype`
  - old Python video-ad prototype kept for reference only

## Key Files

- `README.md`
  - high-level project overview and local development commands
- `docs/architecture.md`
  - runtime flow, GCP topology, event model, and current implementation boundary
- `docs/agents.md`
  - six-agent ownership model
- `apps/web/app/page.tsx`
  - marketing homepage
- `apps/web/app/app/page.tsx`
  - workspace route entrypoint
- `apps/web/components/ad-command-center.tsx`
  - main command center UI
- `services/api/src/lib.rs`
  - main API routes and SSE event stream
- `services/orchestrator/src/lib.rs`
  - tick/reconcile service entrypoints
- `services/workers/src/lib.rs`
  - worker CLI and health endpoints
- `services/shared/src/providers.rs`
  - provider interfaces
- `services/shared/src/mock.rs`
  - mock provider suite
- `packages/contracts/src/index.ts`
  - generation stages, run statuses, request/response types
- `packages/contracts/openapi/ad-command-center.openapi.yaml`
  - OpenAPI spec
- `packages/contracts/events/generation-run-event.schema.json`
  - event schema

## Runtime Flow

1. User creates a `Project`.
2. App prepares upload intents for assets.
3. API creates a `GenerationRun`.
4. Writers room generates a script package.
5. Script waits for approval or regeneration.
6. Storyboard is generated.
7. Storyboard waits for approval or regeneration.
8. Clip generation and QC produce reusable media assets.
9. Edit planning derives ad variants from the shared clip pool.
10. Renderer exports final variants and derivatives.

## Current API Surface

- `GET /v1/projects`
- `POST /v1/projects`
- `POST /v1/projects/{project_id}/assets:prepare-upload`
- `POST /v1/runs`
- `GET /v1/runs/{run_id}`
- `GET /v1/runs/{run_id}/stream`
- `POST /v1/runs/{run_id}/approve-script`
- `POST /v1/runs/{run_id}/regenerate-script`
- `POST /v1/runs/{run_id}/approve-storyboard`
- `POST /v1/runs/{run_id}/regenerate-storyboard`
- `GET /v1/runs/{run_id}/events`
- `GET /v1/runs/{run_id}/variants`
- `POST /v1/variants/{variant_id}/publish`
- `GET /v1/admin/overview`
- `GET /v1/admin/summary`
- `GET /v1/admin/health`

## Canonical Workflow Vocabulary

### Generation stages

- `ingest`
- `normalize`
- `writers_room`
- `storyboard`
- `clip_generation`
- `clip_qc`
- `edit_planning`
- `assembly`
- `delivery`

### Run statuses

- `draft`
- `awaiting_script_approval`
- `awaiting_storyboard_approval`
- `running`
- `partial_success`
- `completed`
- `failed`
- `cancelled`

### Command center actors

- `Head Writer`
- `Hook Writer`
- `Benefit Writer`
- `Brand Voice Editor`
- `Storyboard Lead`
- `Variant Strategist`
- `Clip Lab`
- `Editor Desk`

## Deployment Topology

- Cloud Run services: `web`, `api`, `orchestrator`, `workers`
- Cloud SQL Postgres: intended workflow truth and durable state
- Cloud Storage: uploads, intermediates, exports
- Pub/Sub: domain events and fanout
- Cloud Tasks: retries and delayed work
- Secret Manager: secrets and provider keys
- Artifact Registry: container images
- HTTPS Load Balancer and Cloud Armor: edge layer

## Source vs Generated Paths

If you are showing this repo to ChatGPT, focus on these source paths:

- `apps/web`
- `services`
- `packages/contracts`
- `infra`
- `docs`
- `legacy/prototype`

Ignore these generated or local state directories unless debugging build output:

- `apps/web/.next`
- `services/target`
- `infra/.terraform`

## Recommended ChatGPT Prompt

Use this prompt when pasting this repo into ChatGPT:

```text
You are reviewing a monorepo called Ad Command Center. It is a prompt-first ad generation SaaS with a Next.js frontend, Rust backend services, shared contracts, and Terraform-managed GCP infrastructure.

Important context:
- The current product shell, API scaffolding, orchestration scaffolding, contracts, and deployment scaffolding are real.
- The actual model/provider execution layer is still mocked behind provider interfaces.
- The old Python proof of concept lives under legacy/prototype and should be treated as historical reference, not the production architecture.

Please:
1. Summarize the architecture.
2. Identify what is implemented vs placeholder.
3. Point out the highest-value next engineering steps.
4. Flag any structural risks or missing production pieces.
5. Recommend the cleanest path to wire real provider adapters into the existing interfaces.
```

## Fast Reading Order

If someone wants to understand the repo quickly, read in this order:

1. `README.md`
2. `REPO_INDEX.md`
3. `docs/architecture.md`
4. `apps/web/app/page.tsx`
5. `apps/web/components/ad-command-center.tsx`
6. `services/api/src/lib.rs`
7. `services/shared/src/providers.rs`
8. `services/shared/src/mock.rs`
9. `packages/contracts/src/index.ts`
10. `infra/README.md`
