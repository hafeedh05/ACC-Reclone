resource "google_compute_global_address" "public_ip" {
  count = var.enable_edge_stack ? 1 : 0

  name    = "${local.base_name}-lb-ip"
  project = var.project_id
}

resource "google_compute_managed_ssl_certificate" "frontend" {
  count = var.enable_edge_stack ? 1 : 0

  name    = "${local.base_name}-cert"
  project = var.project_id

  managed {
    domains = [var.domain_name]
  }
}

resource "google_compute_security_policy" "edge" {
  count = var.enable_edge_stack ? 1 : 0

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

  rule {
    action   = "allow"
    priority = 2147483647

    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }

    description = "Default allow rule."
  }
}

resource "google_compute_region_network_endpoint_group" "web" {
  count = var.enable_edge_stack ? 1 : 0

  name                  = "${local.base_name}-web-neg"
  region                = var.region
  project               = var.project_id
  network_endpoint_type = "SERVERLESS"

  cloud_run {
    service = google_cloud_run_service.web.name
  }
}

resource "google_compute_region_network_endpoint_group" "api" {
  count = var.enable_edge_stack ? 1 : 0

  name                  = "${local.base_name}-api-neg"
  region                = var.region
  project               = var.project_id
  network_endpoint_type = "SERVERLESS"

  cloud_run {
    service = google_cloud_run_service.api.name
  }
}

resource "google_compute_backend_service" "web" {
  count = var.enable_edge_stack ? 1 : 0

  name                  = "${local.base_name}-web-backend"
  project               = var.project_id
  protocol              = "HTTP"
  port_name             = "http"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  security_policy       = google_compute_security_policy.edge[0].self_link

  backend {
    group = google_compute_region_network_endpoint_group.web[0].self_link
  }
}

resource "google_compute_backend_service" "api" {
  count = var.enable_edge_stack ? 1 : 0

  name                  = "${local.base_name}-api-backend"
  project               = var.project_id
  protocol              = "HTTP"
  port_name             = "http"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  security_policy       = google_compute_security_policy.edge[0].self_link

  backend {
    group = google_compute_region_network_endpoint_group.api[0].self_link
  }
}

resource "google_compute_url_map" "https" {
  count = var.enable_edge_stack ? 1 : 0

  name    = "${local.base_name}-url-map"
  project = var.project_id

  default_service = google_compute_backend_service.web[0].self_link

  host_rule {
    hosts        = [var.domain_name]
    path_matcher = "primary"
  }

  path_matcher {
    name            = "primary"
    default_service = google_compute_backend_service.web[0].self_link

    path_rule {
      paths   = ["/api", "/api/*"]
      service = google_compute_backend_service.api[0].self_link
    }
  }
}

resource "google_compute_target_https_proxy" "frontend" {
  count = var.enable_edge_stack ? 1 : 0

  name             = "${local.base_name}-https-proxy"
  project          = var.project_id
  url_map          = google_compute_url_map.https[0].self_link
  ssl_certificates = [google_compute_managed_ssl_certificate.frontend[0].self_link]
}

resource "google_compute_global_forwarding_rule" "https" {
  count = var.enable_edge_stack ? 1 : 0

  name                  = "${local.base_name}-https-forwarding-rule"
  project               = var.project_id
  ip_address            = google_compute_global_address.public_ip[0].address
  port_range            = "443"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  target                = google_compute_target_https_proxy.frontend[0].self_link
}

resource "google_compute_url_map" "http_redirect" {
  count = var.enable_edge_stack ? 1 : 0

  name    = "${local.base_name}-http-redirect"
  project = var.project_id

  default_url_redirect {
    https_redirect         = true
    strip_query            = false
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
  }
}

resource "google_compute_target_http_proxy" "http_redirect" {
  count = var.enable_edge_stack ? 1 : 0

  name    = "${local.base_name}-http-proxy"
  project = var.project_id
  url_map = google_compute_url_map.http_redirect[0].self_link
}

resource "google_compute_global_forwarding_rule" "http" {
  count = var.enable_edge_stack ? 1 : 0

  name                  = "${local.base_name}-http-forwarding-rule"
  project               = var.project_id
  ip_address            = google_compute_global_address.public_ip[0].address
  port_range            = "80"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  target                = google_compute_target_http_proxy.http_redirect[0].self_link
}
