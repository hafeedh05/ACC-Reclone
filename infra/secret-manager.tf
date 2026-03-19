resource "random_password" "jwt_secret" {
  length  = 48
  special = false
}

resource "random_password" "webhook_secret" {
  length  = 48
  special = false
}

resource "google_secret_manager_secret" "database_url" {
  secret_id = "${local.base_name}-database-url"

  replication {
    automatic = true
  }

  labels = local.labels
}

resource "google_secret_manager_secret_version" "database_url" {
  secret      = google_secret_manager_secret.database_url.id
  secret_data = local.database_url
}

resource "google_secret_manager_secret" "jwt_secret" {
  secret_id = "${local.base_name}-jwt-secret"

  replication {
    automatic = true
  }

  labels = local.labels
}

resource "google_secret_manager_secret_version" "jwt_secret" {
  secret      = google_secret_manager_secret.jwt_secret.id
  secret_data = random_password.jwt_secret.result
}

resource "google_secret_manager_secret" "webhook_signing_secret" {
  secret_id = "${local.base_name}-webhook-signing-secret"

  replication {
    automatic = true
  }

  labels = local.labels
}

resource "google_secret_manager_secret_version" "webhook_signing_secret" {
  secret      = google_secret_manager_secret.webhook_signing_secret.id
  secret_data = random_password.webhook_secret.result
}

resource "google_secret_manager_secret" "openai_api_key" {
  secret_id = "${local.base_name}-openai-api-key"

  replication {
    automatic = true
  }

  labels = local.labels
}

resource "google_secret_manager_secret_version" "openai_api_key" {
  secret      = google_secret_manager_secret.openai_api_key.id
  secret_data = local.placeholder_openai_api_key
}

resource "google_secret_manager_secret" "gemini_api_key" {
  secret_id = "${local.base_name}-gemini-api-key"

  replication {
    automatic = true
  }

  labels = local.labels
}

resource "google_secret_manager_secret_version" "gemini_api_key" {
  secret      = google_secret_manager_secret.gemini_api_key.id
  secret_data = local.placeholder_gemini_api_key
}
