# Ad Command Center

Ad Command Center is a prompt-first ad generation platform for turning a brief plus uploaded assets into reviewable, export-ready ad variants. This repo is the new monorepo for the product and keeps the original Python proof of concept under [`legacy/prototype`](/Users/ahmad/sobha-video-ads-code/legacy/prototype) as reference only.

## Structure

- `apps/web`: Next.js marketing site and product UI
- `services/api`: public Rust API
- `services/orchestrator`: workflow state machine
- `services/workers`: worker entrypoints and provider stubs
- `packages/contracts`: OpenAPI and event contracts shared across the stack
- `infra`: GCP and CI/CD scaffolding
- `legacy/prototype`: non-deployable reference implementation
- `docs`: architecture and delivery docs for the six-agent workflow

## Product Surfaces

- Marketing site: cinematic homepage, gallery, trust, pricing, and enterprise CTA
- Authenticated app: dashboard, prompt intake, review gates, command center, outputs library
- Rust control plane: project/run APIs, orchestration, worker roles, and event streaming
- GCP deployment plane: Cloud Run, Cloud SQL, Cloud Storage, Pub/Sub, Cloud Tasks, Secret Manager, Artifact Registry, and HTTPS edge

## Local Development

### Prerequisites

- Node 22+
- pnpm 10+
- Rust stable toolchain
- Terraform for local infra validation if you want to run it outside CI

### Install

```bash
pnpm install
```

### Web

```bash
pnpm dev:web
```

### Rust services

```bash
cargo run --manifest-path services/Cargo.toml -p api
cargo run --manifest-path services/Cargo.toml -p orchestrator
cargo run --manifest-path services/Cargo.toml -p workers -- --help
```

### Verification

```bash
pnpm verify
```

## Deployment

- The currently linked GCP project is assumed to be `azadea-bi`.
- Terraform lives in [`infra`](/Users/ahmad/sobha-video-ads-code/infra) and is parameterized for `dev`, `staging`, and `prod`.
- GitHub Actions handles CI plus image build and GCP deploy once Workload Identity Federation variables are configured.
- Dockerfiles for `web`, `api`, `orchestrator`, and `workers` live alongside each service.

## Workflow Notes

- Provider names must never appear in user-facing UI copy.
- The six-agent branch/ownership model is documented in [`docs/agents.md`](/Users/ahmad/sobha-video-ads-code/docs/agents.md).
- The runtime topology and workflow stages are documented in [`docs/architecture.md`](/Users/ahmad/sobha-video-ads-code/docs/architecture.md).
- Terraform files are present under [`infra`](/Users/ahmad/sobha-video-ads-code/infra), but local `terraform validate` is still blocked here because Terraform is not installed in this environment.
