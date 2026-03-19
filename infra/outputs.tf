output "artifact_registry_repository" {
  value = google_artifact_registry_repository.containers.repository_id
}

output "cloud_sql_connection_name" {
  value = google_sql_database_instance.primary.connection_name
}

output "cloud_run_urls" {
  value = {
    web         = google_cloud_run_service.web.status[0].url
    api         = google_cloud_run_service.api.status[0].url
    orchestrator = google_cloud_run_service.orchestrator.status[0].url
    workers     = google_cloud_run_service.workers.status[0].url
  }
}

output "public_load_balancer_ip" {
  value = google_compute_global_address.public_ip.address
}

output "public_domain" {
  value = var.domain_name
}

output "storage_buckets" {
  value = {
    uploads = google_storage_bucket.uploads.name
    working = google_storage_bucket.working.name
    exports = google_storage_bucket.exports.name
  }
}

output "pubsub_topics" {
  value = {
    run_events    = google_pubsub_topic.run_events.name
    clip_jobs     = google_pubsub_topic.clip_jobs.name
    delivery_jobs = google_pubsub_topic.delivery_jobs.name
    dead_letter   = google_pubsub_topic.dead_letter.name
  }
}

output "cloud_tasks_queues" {
  value = {
    generate = google_cloud_tasks_queue.generate.name
    deliver  = google_cloud_tasks_queue.deliver.name
  }
}

output "github_workload_identity_provider" {
  value = google_iam_workload_identity_pool_provider.github.name
}

output "github_deployer_service_account" {
  value = google_service_account.deployer.email
}
