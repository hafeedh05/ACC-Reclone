locals {
  base_name = "${var.name_prefix}-${var.environment}"

  labels = {
    app         = var.name_prefix
    environment = var.environment
    managed_by  = "terraform"
    platform    = "gcp"
  }

  enabled_apis = toset([
    "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "compute.googleapis.com",
    "cloudtasks.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "pubsub.googleapis.com",
    "secretmanager.googleapis.com",
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "serviceusage.googleapis.com",
    "storage.googleapis.com",
  ])

  service_image_repo = "us-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.containers.repository_id}"

  image_refs = {
    web          = "${local.service_image_repo}/web:${var.image_tag}"
    api          = "${local.service_image_repo}/api:${var.image_tag}"
    orchestrator = "${local.service_image_repo}/orchestrator:${var.image_tag}"
    workers      = "${local.service_image_repo}/workers:${var.image_tag}"
  }

  service_names = {
    web          = "${local.base_name}-web"
    api          = "${local.base_name}-api"
    orchestrator = "${local.base_name}-orchestrator"
    workers      = "${local.base_name}-workers"
  }

  topic_names = {
    run_events    = "${local.base_name}-run-events"
    clip_jobs     = "${local.base_name}-clip-jobs"
    delivery_jobs = "${local.base_name}-delivery-jobs"
    dead_letter   = "${local.base_name}-dead-letter"
  }

  queue_names = {
    generate = "${local.base_name}-generate"
    deliver  = "${local.base_name}-deliver"
  }

  bucket_suffix = random_id.storage_suffix.hex

  bucket_names = {
    uploads = "${var.name_prefix}-${var.environment}-${local.bucket_suffix}-uploads"
    working = "${var.name_prefix}-${var.environment}-${local.bucket_suffix}-working"
    exports = "${var.name_prefix}-${var.environment}-${local.bucket_suffix}-exports"
  }

  runtime_project_roles = toset([
    "roles/cloudsql.client",
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
    "roles/pubsub.publisher",
    "roles/pubsub.subscriber",
    "roles/secretmanager.secretAccessor",
    "roles/storage.objectAdmin",
  ])

  deployer_project_roles = toset([
    "roles/artifactregistry.admin",
    "roles/cloudsql.admin",
    "roles/cloudtasks.admin",
    "roles/compute.admin",
    "roles/iam.serviceAccountAdmin",
    "roles/iam.serviceAccountUser",
    "roles/pubsub.admin",
    "roles/resourcemanager.projectIamAdmin",
    "roles/run.admin",
    "roles/secretmanager.admin",
    "roles/serviceusage.serviceUsageAdmin",
    "roles/storage.admin",
  ])

  placeholder_openai_api_key = "REPLACE_WITH_OPENAI_API_KEY"
  placeholder_gemini_api_key = "REPLACE_WITH_GEMINI_API_KEY"
  database_url               = "postgresql://${google_sql_user.app.name}:${random_password.database_password.result}@//cloudsql/${google_sql_database_instance.primary.connection_name}/${google_sql_database.app.name}?sslmode=disable"
}
