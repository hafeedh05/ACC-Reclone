variable "project_id" {
  description = "GCP project ID for the environment."
  type        = string
}

variable "region" {
  description = "Default GCP region for regional resources."
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "environment must be one of: dev, staging, prod."
  }
}

variable "name_prefix" {
  description = "Logical product prefix used to name resources."
  type        = string
  default     = "ad-command-center"
}

variable "artifact_registry_repo_id" {
  description = "Artifact Registry repository ID for container images."
  type        = string
  default     = "ad-command-center"
}

variable "domain_name" {
  description = "Primary public domain for the web app and API."
  type        = string
}

variable "image_tag" {
  description = "Container image tag to deploy."
  type        = string
  default     = "latest"
}

variable "cloud_sql_tier" {
  description = "Cloud SQL machine tier."
  type        = string
  default     = "db-custom-2-8192"
}

variable "cloud_sql_disk_size_gb" {
  description = "Cloud SQL persistent disk size in GB."
  type        = number
  default     = 50
}

variable "cloud_sql_database_name" {
  description = "Primary Postgres database name."
  type        = string
  default     = "ad_command_center"
}

variable "cloud_run_min_instances" {
  description = "Minimum number of Cloud Run instances."
  type        = number
  default     = 0
}

variable "cloud_run_max_instances" {
  description = "Maximum number of Cloud Run instances."
  type        = number
  default     = 10
}

variable "github_repository" {
  description = "GitHub repository slug used for the WIF condition."
  type        = string
  default     = "your-org/ad-command-center"
}
