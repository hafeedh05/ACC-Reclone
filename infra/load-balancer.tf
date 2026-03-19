resource "google_compute_global_address" "public_ip" {
  name    = "${local.base_name}-lb-ip"
  project = var.project_id
}

resource "google_compute_managed_ssl_certificate" "frontend" {
  name    = "${local.base_name}-cert"
  project = var.project_id

  managed {
    domains = [var.domain_name]
  }
}

resource "google_compute_security_policy" "edge" {
  name    = "${local.base_name}-armor"
  project = var.project_id

  rule {
    action   = "allow"
    priority = 1000

    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["0.0.0.0/0"]
      }
    }

    description = "Starter allow rule; tune this before production launch."
  }
}

resource "google_compute_region_network_endpoint_group" "web" {
  name                  = "${local.base_name}-web-neg"
  region                = var.region
  project               = var.project_id
  network_endpoint_type  = "SERVERLESS"

  cloud_run {
    service = google_cloud_run_service.web.name
  }
}

resource "google_compute_region_network_endpoint_group" "api" {
  name                  = "${local.base_name}-api-neg"
  region                = var.region
  project               = var.project_id
  network_endpoint_type  = "SERVERLESS"

  cloud_run {
    service = google_cloud_run_service.api.name
  }
}

resource "google_compute_backend_service" "web" {
  name                  = "${local.base_name}-web-backend"
  project               = var.project_id
  protocol              = "HTTP"
  port_name             = "http"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  security_policy       = google_compute_security_policy.edge.self_link

  backend {
    group = google_compute_region_network_endpoint_group.web.self_link
  }
}

resource "google_compute_backend_service" "api" {
  name                  = "${local.base_name}-api-backend"
  project               = var.project_id
  protocol              = "HTTP"
  port_name             = "http"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  security_policy       = google_compute_security_policy.edge.self_link

  backend {
    group = google_compute_region_network_endpoint_group.api.self_link
  }
}

resource "google_compute_url_map" "https" {
  name    = "${local.base_name}-url-map"
  project = var.project_id

  default_service = google_compute_backend_service.web.self_link

  host_rule {
    hosts        = [var.domain_name]
    path_matcher = "primary"
  }

  path_matcher {
    name            = "primary"
    default_service = google_compute_backend_service.web.self_link

    path_rule {
      paths   = ["/api", "/api/*"]
      service = google_compute_backend_service.api.self_link
    }
  }
}

resource "google_compute_target_https_proxy" "frontend" {
  name             = "${local.base_name}-https-proxy"
  project          = var.project_id
  url_map          = google_compute_url_map.https.self_link
  ssl_certificates = [google_compute_managed_ssl_certificate.frontend.self_link]
}

resource "google_compute_global_forwarding_rule" "https" {
  name                  = "${local.base_name}-https-forwarding-rule"
  project               = var.project_id
  ip_address            = google_compute_global_address.public_ip.address
  port_range            = "443"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  target                = google_compute_target_https_proxy.frontend.self_link
}

resource "google_compute_url_map" "http_redirect" {
  name    = "${local.base_name}-http-redirect"
  project = var.project_id

  default_url_redirect {
    https_redirect         = true
    strip_query            = false
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
  }
}

resource "google_compute_target_http_proxy" "http_redirect" {
  name    = "${local.base_name}-http-proxy"
  project = var.project_id
  url_map = google_compute_url_map.http_redirect.self_link
}

resource "google_compute_global_forwarding_rule" "http" {
  name                  = "${local.base_name}-http-forwarding-rule"
  project               = var.project_id
  ip_address            = google_compute_global_address.public_ip.address
  port_range            = "80"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  target                = google_compute_target_http_proxy.http_redirect.self_link
}
