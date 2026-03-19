# Six-Agent Delivery Model

This repo uses a six-role ownership model for parallel delivery. The roles are implementation ownership boundaries, not customer-facing runtime names.

## Ownership

1. `codex/a1-web`
   - owns `apps/web`
   - marketing site, design system, product shell, intake, review, command center, outputs library
2. `codex/a2-api`
   - owns `services/api` and shared public contracts
   - public API, approvals, SSE progress, admin views
3. `codex/a3-media`
   - owns `services/workers` and provider adapter implementations
   - clip lifecycle, QC, edit planning, deterministic render orchestration
4. `codex/a4-platform`
   - owns `infra`
   - GCP resources, IAM, buckets, queues, secrets, networking
5. `codex/a5-product`
   - owns auth, workspaces, usage, quota, billing-ready hooks, admin operations
6. `codex/a6-release`
   - owns `.github`, deploy promotion, branch protections, release gates, rollback discipline

## Merge Order

1. API/contracts freeze first.
2. Platform wiring lands second.
3. Media pipeline integrates against those contracts.
4. Web integrates against stable contracts and staging endpoints.
5. Product systems land after the data and API seams are stable.
6. Release automation merges last and guards `main`.

## PR Rules

- `main` stays deployable.
- No direct pushes once branch protections are enabled.
- Squash merges only.
- Green CI is mandatory before merge.
- Expensive generation paths should be mocked or capped in previews.
