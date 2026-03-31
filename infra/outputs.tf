output "artifact_registry_repository" {
  value = google_artifact_registry_repository.containers.repository_id
}

output "cloud_sql_connection_name" {
  value = google_sql_database_instance.primary.connection_name
}

output "cloud_run_urls" {
  value = {
    web          = google_cloud_run_service.web.status[0].url
    api          = google_cloud_run_service.api.status[0].url
    orchestrator = google_cloud_run_service.orchestrator.status[0].url
    workers      = google_cloud_run_service.workers.status[0].url
  }
}

output "public_load_balancer_ip" {
  value = var.enable_edge_stack ? google_compute_global_address.public_ip[0].address : null
}

output "public_domain" {
  value = var.enable_edge_stack ? var.domain_name : null
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
  value = var.manage_github_federation ? google_iam_workload_identity_pool_provider.github[0].name : null
}

output "github_deployer_service_account" {
  value = var.manage_github_federation ? google_service_account.deployer[0].email : null
}
