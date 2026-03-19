resource "google_cloud_run_service" "web" {
  name     = local.service_names.web
  location = var.region
  project  = var.project_id

  autogenerate_revision_name = true

  metadata {
    labels = local.labels
    annotations = {
      "run.googleapis.com/ingress" = local.public_service_ingress
    }
  }

  template {
    metadata {
      labels = local.labels
      annotations = {
        "autoscaling.knative.dev/minScale" = tostring(var.cloud_run_min_instances)
        "autoscaling.knative.dev/maxScale" = tostring(var.cloud_run_max_instances)
      }
    }

    spec {
      service_account_name  = google_service_account.runtime.email
      container_concurrency = 80

      containers {
        image = local.image_refs.web

        ports {
          container_port = 8080
        }

        env {
          name  = "APP_ENV"
          value = var.environment
        }

        env {
          name  = "NEXT_PUBLIC_APP_ENV"
          value = var.environment
        }

        env {
          name  = "NEXT_PUBLIC_BASE_URL"
          value = local.public_base_url
        }

        env {
          name  = "NEXT_PUBLIC_API_BASE_PATH"
          value = "/api"
        }

        env {
          name  = "PROJECT_ID"
          value = var.project_id
        }

        env {
          name  = "REGION"
          value = var.region
        }

        env {
          name  = "PUBLIC_STORAGE_UPLOADS_BUCKET"
          value = google_storage_bucket.uploads.name
        }

        env {
          name  = "PUBLIC_STORAGE_EXPORTS_BUCKET"
          value = google_storage_bucket.exports.name
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [google_project_service.enabled]
}

resource "google_cloud_run_service" "api" {
  name     = local.service_names.api
  location = var.region
  project  = var.project_id

  autogenerate_revision_name = true

  metadata {
    labels = local.labels
    annotations = {
      "run.googleapis.com/ingress" = local.public_service_ingress
    }
  }

  template {
    metadata {
      labels = local.labels
      annotations = {
        "autoscaling.knative.dev/minScale"      = tostring(var.cloud_run_min_instances)
        "autoscaling.knative.dev/maxScale"      = tostring(var.cloud_run_max_instances)
        "run.googleapis.com/cloudsql-instances" = google_sql_database_instance.primary.connection_name
      }
    }

    spec {
      service_account_name  = google_service_account.runtime.email
      container_concurrency = 40

      containers {
        image = local.image_refs.api

        ports {
          container_port = 8080
        }

        env {
          name  = "APP_ENV"
          value = var.environment
        }

        env {
          name  = "PROJECT_ID"
          value = var.project_id
        }

        env {
          name  = "REGION"
          value = var.region
        }

        env {
          name = "DATABASE_URL"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.database_url.secret_id
              key  = "latest"
            }
          }
        }

        env {
          name = "JWT_SECRET"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.jwt_secret.secret_id
              key  = "latest"
            }
          }
        }

        env {
          name = "WEBHOOK_SIGNING_SECRET"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.webhook_signing_secret.secret_id
              key  = "latest"
            }
          }
        }

        env {
          name = "OPENAI_API_KEY"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.openai_api_key.secret_id
              key  = "latest"
            }
          }
        }

        env {
          name = "GEMINI_API_KEY"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.gemini_api_key.secret_id
              key  = "latest"
            }
          }
        }

        env {
          name  = "RUN_EVENTS_TOPIC"
          value = google_pubsub_topic.run_events.name
        }

        env {
          name  = "CLIP_JOBS_TOPIC"
          value = google_pubsub_topic.clip_jobs.name
        }

        env {
          name  = "DELIVERY_JOBS_TOPIC"
          value = google_pubsub_topic.delivery_jobs.name
        }

        env {
          name  = "UPLOAD_BUCKET"
          value = google_storage_bucket.uploads.name
        }

        env {
          name  = "WORKING_BUCKET"
          value = google_storage_bucket.working.name
        }

        env {
          name  = "EXPORT_BUCKET"
          value = google_storage_bucket.exports.name
        }

        env {
          name  = "TASK_QUEUE_GENERATE"
          value = google_cloud_tasks_queue.generate.name
        }

        env {
          name  = "TASK_QUEUE_DELIVER"
          value = google_cloud_tasks_queue.deliver.name
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [google_project_service.enabled]
}

resource "google_cloud_run_service" "orchestrator" {
  name     = local.service_names.orchestrator
  location = var.region
  project  = var.project_id

  autogenerate_revision_name = true

  metadata {
    labels = local.labels
    annotations = {
      "run.googleapis.com/ingress" = "all"
    }
  }

  template {
    metadata {
      labels = local.labels
      annotations = {
        "autoscaling.knative.dev/minScale"      = tostring(var.cloud_run_min_instances)
        "autoscaling.knative.dev/maxScale"      = tostring(var.cloud_run_max_instances)
        "run.googleapis.com/cloudsql-instances" = google_sql_database_instance.primary.connection_name
      }
    }

    spec {
      service_account_name  = google_service_account.runtime.email
      container_concurrency = 10

      containers {
        image = local.image_refs.orchestrator

        ports {
          container_port = 8080
        }

        env {
          name  = "APP_ENV"
          value = var.environment
        }

        env {
          name  = "PROJECT_ID"
          value = var.project_id
        }

        env {
          name  = "REGION"
          value = var.region
        }

        env {
          name = "DATABASE_URL"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.database_url.secret_id
              key  = "latest"
            }
          }
        }

        env {
          name  = "RUN_EVENTS_TOPIC"
          value = google_pubsub_topic.run_events.name
        }

        env {
          name  = "CLIP_JOBS_TOPIC"
          value = google_pubsub_topic.clip_jobs.name
        }

        env {
          name  = "DELIVERY_JOBS_TOPIC"
          value = google_pubsub_topic.delivery_jobs.name
        }

        env {
          name  = "UPLOAD_BUCKET"
          value = google_storage_bucket.uploads.name
        }

        env {
          name  = "WORKING_BUCKET"
          value = google_storage_bucket.working.name
        }

        env {
          name  = "EXPORT_BUCKET"
          value = google_storage_bucket.exports.name
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [google_project_service.enabled]
}

resource "google_cloud_run_service" "workers" {
  name     = local.service_names.workers
  location = var.region
  project  = var.project_id

  autogenerate_revision_name = true

  metadata {
    labels = local.labels
    annotations = {
      "run.googleapis.com/ingress" = "all"
    }
  }

  template {
    metadata {
      labels = local.labels
      annotations = {
        "autoscaling.knative.dev/minScale"      = tostring(var.cloud_run_min_instances)
        "autoscaling.knative.dev/maxScale"      = tostring(var.cloud_run_max_instances)
        "run.googleapis.com/cloudsql-instances" = google_sql_database_instance.primary.connection_name
      }
    }

    spec {
      service_account_name  = google_service_account.runtime.email
      container_concurrency = 1

      containers {
        image = local.image_refs.workers

        ports {
          container_port = 8080
        }

        env {
          name  = "APP_ENV"
          value = var.environment
        }

        env {
          name  = "PROJECT_ID"
          value = var.project_id
        }

        env {
          name  = "REGION"
          value = var.region
        }

        env {
          name = "DATABASE_URL"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.database_url.secret_id
              key  = "latest"
            }
          }
        }

        env {
          name = "OPENAI_API_KEY"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.openai_api_key.secret_id
              key  = "latest"
            }
          }
        }

        env {
          name = "GEMINI_API_KEY"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.gemini_api_key.secret_id
              key  = "latest"
            }
          }
        }

        env {
          name  = "RUN_EVENTS_TOPIC"
          value = google_pubsub_topic.run_events.name
        }

        env {
          name  = "CLIP_JOBS_TOPIC"
          value = google_pubsub_topic.clip_jobs.name
        }

        env {
          name  = "DELIVERY_JOBS_TOPIC"
          value = google_pubsub_topic.delivery_jobs.name
        }

        env {
          name  = "UPLOAD_BUCKET"
          value = google_storage_bucket.uploads.name
        }

        env {
          name  = "WORKING_BUCKET"
          value = google_storage_bucket.working.name
        }

        env {
          name  = "EXPORT_BUCKET"
          value = google_storage_bucket.exports.name
        }

        env {
          name  = "TASK_QUEUE_GENERATE"
          value = google_cloud_tasks_queue.generate.name
        }

        env {
          name  = "TASK_QUEUE_DELIVER"
          value = google_cloud_tasks_queue.deliver.name
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [google_project_service.enabled]
}

resource "google_cloud_run_service_iam_member" "web_public" {
  project  = var.project_id
  location = var.region
  service  = google_cloud_run_service.web.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_service_iam_member" "api_public" {
  project  = var.project_id
  location = var.region
  service  = google_cloud_run_service.api.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_service_iam_member" "api_runtime" {
  project  = var.project_id
  location = var.region
  service  = google_cloud_run_service.api.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_service_account.runtime.email}"
}

resource "google_cloud_run_service_iam_member" "orchestrator_runtime" {
  project  = var.project_id
  location = var.region
  service  = google_cloud_run_service.orchestrator.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_service_account.runtime.email}"
}

resource "google_cloud_run_service_iam_member" "workers_runtime" {
  project  = var.project_id
  location = var.region
  service  = google_cloud_run_service.workers.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_service_account.runtime.email}"
}
