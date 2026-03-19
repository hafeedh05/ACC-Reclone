resource "google_pubsub_topic" "run_events" {
  name   = local.topic_names.run_events
  labels = local.labels
}

resource "google_pubsub_topic" "clip_jobs" {
  name   = local.topic_names.clip_jobs
  labels = local.labels
}

resource "google_pubsub_topic" "delivery_jobs" {
  name   = local.topic_names.delivery_jobs
  labels = local.labels
}

resource "google_pubsub_topic" "dead_letter" {
  name   = local.topic_names.dead_letter
  labels = local.labels
}

resource "google_pubsub_subscription" "orchestrator_run_events" {
  name  = "${local.base_name}-orchestrator-run-events"
  topic = google_pubsub_topic.run_events.name

  ack_deadline_seconds = 30

  dead_letter_policy {
    dead_letter_topic     = google_pubsub_topic.dead_letter.id
    max_delivery_attempts = 5
  }

  push_config {
    push_endpoint = "${google_cloud_run_service.orchestrator.status[0].url}/events/pubsub"

    oidc_token {
      service_account_email = google_service_account.runtime.email
      audience              = google_cloud_run_service.orchestrator.status[0].url
    }
  }
}

resource "google_pubsub_subscription" "workers_clip_jobs" {
  name  = "${local.base_name}-workers-clip-jobs"
  topic = google_pubsub_topic.clip_jobs.name

  ack_deadline_seconds = 60

  dead_letter_policy {
    dead_letter_topic     = google_pubsub_topic.dead_letter.id
    max_delivery_attempts = 5
  }

  push_config {
    push_endpoint = "${google_cloud_run_service.workers.status[0].url}/pubsub/clip-jobs"

    oidc_token {
      service_account_email = google_service_account.runtime.email
      audience              = google_cloud_run_service.workers.status[0].url
    }
  }
}

resource "google_pubsub_subscription" "workers_delivery_jobs" {
  name  = "${local.base_name}-workers-delivery-jobs"
  topic = google_pubsub_topic.delivery_jobs.name

  ack_deadline_seconds = 60

  dead_letter_policy {
    dead_letter_topic     = google_pubsub_topic.dead_letter.id
    max_delivery_attempts = 5
  }

  push_config {
    push_endpoint = "${google_cloud_run_service.workers.status[0].url}/pubsub/delivery-jobs"

    oidc_token {
      service_account_email = google_service_account.runtime.email
      audience              = google_cloud_run_service.workers.status[0].url
    }
  }
}
