# Architecture

## Product Model

Ad Command Center has two public surfaces:

- `apps/web` serves the marketing site and the authenticated product shell.
- The Rust control plane under `services/` owns durable run state, orchestration, worker roles, and event streaming.

The original Python implementation remains under [`legacy/prototype`](/Users/ahmad/sobha-video-ads-code/legacy/prototype) for feature reference only.

## Runtime Flow

1. A user creates a `Project`.
2. The app prepares upload intents for images, logos, and brand files.
3. The API creates a `GenerationRun` with a normalized creative brief.
4. The writers room drafts the script package and waits for approval.
5. The storyboard stage produces scene specs and waits for approval.
6. The clip generation and QC stages produce reusable media assets.
7. The edit planner builds variant recipes from the shared clip pool.
8. The renderer exports 3-4 variants in `9:16`, `1:1`, and `16:9`.
9. The outputs library exposes the delivery bundle for download or publish.

## Services

- `services/api`
  - public API for projects, runs, uploads, approvals, variants, and admin views
  - emits event history and stream endpoints for the command center
- `services/orchestrator`
  - advances workflow state and handles reconciliation
- `services/workers`
  - role-based worker entrypoints for writers, clip generation, QC, edit planning, and rendering
- `services/shared`
  - domain types, mock providers, orchestration rules, and store abstractions

## Event Model

Canonical workflow stages:

- `ingest`
- `normalize`
- `writers_room`
- `storyboard`
- `clip_generation`
- `clip_qc`
- `edit_planning`
- `assembly`
- `delivery`

Canonical command-center actors:

- Head Writer
- Hook Writer
- Benefit Writer
- Brand Voice Editor
- Storyboard Lead
- Variant Strategist
- Clip Lab
- Editor Desk

## GCP Topology

- Cloud Run: `web`, `api`, `orchestrator`, `workers`
- Cloud SQL Postgres: durable state and workflow truth
- Cloud Storage: uploads, working assets, exports
- Pub/Sub: domain events and work fanout
- Cloud Tasks: retries, delivery jobs, reconciliation work
- Secret Manager: API keys, DB URL, JWT/webhook secrets
- Artifact Registry: container images
- HTTPS Load Balancer + Cloud Armor: public edge

## Contracts

- OpenAPI lives at [`packages/contracts/openapi/ad-command-center.openapi.yaml`](/Users/ahmad/sobha-video-ads-code/packages/contracts/openapi/ad-command-center.openapi.yaml)
- Event schema lives at [`packages/contracts/events/generation-run-event.schema.json`](/Users/ahmad/sobha-video-ads-code/packages/contracts/events/generation-run-event.schema.json)

## Current Implementation Boundary

The repo now ships a strong product scaffold:

- polished marketing and command-center UI
- Rust API/orchestrator/worker skeletons with mock providers
- Terraform and CI/CD scaffolding for GCP

What is still placeholder-backed:

- persistent database implementation
- signed upload generation
- production auth and billing
- live provider adapters for script/video/voice/QC
