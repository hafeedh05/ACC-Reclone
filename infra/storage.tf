resource "random_id" "storage_suffix" {
  byte_length = 3

  keepers = {
    environment = var.environment
    project_id  = var.project_id
  }
}

resource "google_storage_bucket" "uploads" {
  name     = local.bucket_names.uploads
  location = var.region
  labels   = local.labels

  uniform_bucket_level_access = true
  force_destroy               = false

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age = 14
    }

    action {
      type = "Delete"
    }
  }

  depends_on = [google_project_service.enabled]
}

resource "google_storage_bucket" "working" {
  name     = local.bucket_names.working
  location = var.region
  labels   = local.labels

  uniform_bucket_level_access = true
  force_destroy               = false

  lifecycle_rule {
    condition {
      age = 30
    }

    action {
      type = "Delete"
    }
  }

  depends_on = [google_project_service.enabled]
}

resource "google_storage_bucket" "exports" {
  name     = local.bucket_names.exports
  location = var.region
  labels   = local.labels

  uniform_bucket_level_access = true
  force_destroy               = false

  versioning {
    enabled = true
  }

  depends_on = [google_project_service.enabled]
}
