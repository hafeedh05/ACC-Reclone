resource "google_artifact_registry_repository" "containers" {
  project       = var.project_id
  location      = var.region
  repository_id = var.artifact_registry_repo_id
  description   = "Container images for ${var.name_prefix}"
  format        = "DOCKER"
  labels        = local.labels

  depends_on = [google_project_service.enabled]
}
