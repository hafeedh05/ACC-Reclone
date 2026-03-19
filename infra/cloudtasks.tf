resource "google_cloud_tasks_queue" "generate" {
  name     = local.queue_names.generate
  location = var.region
  project  = var.project_id

  rate_limits {
    max_dispatches_per_second = 20
    max_burst_size            = 100
  }

  retry_config {
    max_attempts       = 10
    max_backoff        = "3600s"
    min_backoff        = "10s"
    max_doublings      = 5
    max_retry_duration = "86400s"
  }
}

resource "google_cloud_tasks_queue" "deliver" {
  name     = local.queue_names.deliver
  location = var.region
  project  = var.project_id

  rate_limits {
    max_dispatches_per_second = 10
    max_burst_size            = 50
  }

  retry_config {
    max_attempts       = 8
    max_backoff        = "1800s"
    min_backoff        = "10s"
    max_doublings      = 5
    max_retry_duration = "86400s"
  }
}

resource "google_cloud_tasks_queue_iam_member" "generate_enqueuer" {
  project  = var.project_id
  location = var.region
  queue    = google_cloud_tasks_queue.generate.name
  role     = "roles/cloudtasks.enqueuer"
  member   = "serviceAccount:${google_service_account.runtime.email}"
}

resource "google_cloud_tasks_queue_iam_member" "deliver_enqueuer" {
  project  = var.project_id
  location = var.region
  queue    = google_cloud_tasks_queue.deliver.name
  role     = "roles/cloudtasks.enqueuer"
  member   = "serviceAccount:${google_service_account.runtime.email}"
}
