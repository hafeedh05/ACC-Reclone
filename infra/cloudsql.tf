resource "random_password" "database_password" {
  length  = 32
  special = false
}

resource "google_sql_database_instance" "primary" {
  name             = "${local.base_name}-pg"
  database_version = "POSTGRES_16"
  region           = var.region
  project          = var.project_id

  deletion_protection = true

  settings {
    tier              = var.cloud_sql_tier
    availability_type = var.environment == "prod" ? "REGIONAL" : "ZONAL"
    disk_size         = var.cloud_sql_disk_size_gb
    disk_type         = "PD_SSD"

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = true
    }

    ip_configuration {
      ipv4_enabled = true
      require_ssl  = true
    }

    maintenance_window {
      day          = 7
      hour         = 3
      update_track = "stable"
    }
  }

  depends_on = [google_project_service.enabled]
}

resource "google_sql_database" "app" {
  name     = var.cloud_sql_database_name
  instance = google_sql_database_instance.primary.name
}

resource "google_sql_user" "app" {
  name     = "${var.name_prefix}_app"
  instance = google_sql_database_instance.primary.name
  password = random_password.database_password.result
}
