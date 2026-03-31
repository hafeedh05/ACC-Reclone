# Infrastructure Scaffolding

This directory contains the Terraform-style root module for the ad command center platform.

## What Is Here

- Cloud Run services for `web`, `api`, `orchestrator`, and `workers`
- Cloud SQL for Postgres
- Cloud Storage buckets for uploads, working assets, and final exports
- Pub/Sub topics and push subscriptions
- Cloud Tasks queues
- Secret Manager secrets and bootstrap versions
- Artifact Registry for container images
- IAM service accounts, project roles, and GitHub Workload Identity Federation scaffolding
- Cloud Armor and an external HTTPS load balancer for the public web surface

## Layout

- `backend.tf`: remote state backend declaration
- `versions.tf`: Terraform and provider version pins
- `providers.tf`: provider configuration and project lookup
- `apis.tf`: GCP API enablement
- `artifact-registry.tf`: container image repository
- `cloudrun.tf`: runtime services and IAM bindings
- `cloudsql.tf`: Postgres instance, database, and user
- `cloudtasks.tf`: retry queues for orchestration
- `load-balancer.tf`: Cloud Armor and HTTPS load balancing
- `pubsub.tf`: event and work queues
- `secret-manager.tf`: app secrets and bootstrap values
- `storage.tf`: upload, working, and export buckets
- `iam.tf`: runtime/deployer identities and GitHub federation
- `env/*.tfvars`: per-environment configuration

## Bootstrap Order

1. Create or pick a GCS bucket for Terraform state.
2. Run `terraform init` with backend config:
   ```bash
   terraform init \
     -backend-config="bucket=YOUR_STATE_BUCKET" \
     -backend-config="prefix=ad-command-center/dev"
   ```
3. Apply the environment file you want:
   ```bash
   terraform apply -var-file=env/dev.tfvars
   ```
4. Replace the placeholder secret values in Secret Manager before production use.

## GitHub Actions Inputs

The deploy workflow expects these repository variables:

- `GCP_PROJECT_ID`
- `GCP_WORKLOAD_IDENTITY_PROVIDER`
- `GCP_DEPLOYER_SERVICE_ACCOUNT`
- `TF_STATE_BUCKET`

The provider and service account variables are placeholders until the WIF binding is finalized.
