use axum::{Json, Router, response::IntoResponse, routing::get};
use clap::{Parser, ValueEnum};
use serde::Serialize;
use shared::{MemoryStore, ServiceError};
use std::net::SocketAddr;
use tower_http::trace::TraceLayer;
use tracing_subscriber::EnvFilter;

#[derive(Debug, Clone, Copy, ValueEnum)]
pub enum WorkerRole {
    Writer,
    Video,
    Voice,
    Qc,
    Edit,
    Render,
}

#[derive(Debug, Parser)]
#[command(
    name = "workers",
    about = "Local worker stubs for the ad generation pipeline"
)]
pub struct WorkerCli {
    #[command(subcommand)]
    pub command: WorkerCommand,
}

#[derive(Debug, clap::Subcommand)]
pub enum WorkerCommand {
    Serve {
        #[arg(long, default_value = "0.0.0.0:8080")]
        bind: SocketAddr,
    },
    Run {
        #[arg(value_enum)]
        role: WorkerRole,
        #[arg(long)]
        run_id: Option<String>,
    },
}

#[derive(Debug, Serialize)]
pub struct HealthResponse {
    pub status: &'static str,
}

#[derive(Debug, Serialize)]
pub struct ErrorResponse {
    pub error: String,
}

#[derive(Debug)]
pub struct WorkerError(pub ServiceError);

impl IntoResponse for WorkerError {
    fn into_response(self) -> axum::response::Response {
        let (status, message) = match self.0 {
            ServiceError::NotFound(message) => (axum::http::StatusCode::NOT_FOUND, message),
            ServiceError::InvalidRequest(message) => (axum::http::StatusCode::BAD_REQUEST, message),
            ServiceError::Conflict(message) => (axum::http::StatusCode::CONFLICT, message),
            ServiceError::Internal(message) => {
                (axum::http::StatusCode::INTERNAL_SERVER_ERROR, message)
            }
        };
        (status, Json(ErrorResponse { error: message })).into_response()
    }
}

impl From<ServiceError> for WorkerError {
    fn from(value: ServiceError) -> Self {
        Self(value)
    }
}

pub fn build_router() -> Router {
    Router::new()
        .route("/healthz", get(healthz))
        .route("/readyz", get(readyz))
        .layer(TraceLayer::new_for_http())
}

pub async fn run() -> anyhow::Result<()> {
    let cli = WorkerCli::parse();
    let filter = EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| EnvFilter::new("workers=info,shared=info"));
    let _ = tracing_subscriber::fmt().with_env_filter(filter).try_init();

    match cli.command {
        WorkerCommand::Serve { bind } => serve(bind).await,
        WorkerCommand::Run { role, run_id } => {
            let store = MemoryStore::new();
            tracing::info!(?role, ?run_id, "running worker stub");
            let summary = store.health_summary();
            tracing::info!(
                projects = summary.project_count,
                runs = summary.run_count,
                "worker saw in-memory state"
            );
            Ok(())
        }
    }
}

async fn serve(bind: SocketAddr) -> anyhow::Result<()> {
    let app = build_router();
    let listener = tokio::net::TcpListener::bind(bind).await?;
    tracing::info!("workers listening on {}", listener.local_addr()?);
    axum::serve(listener, app).await?;
    Ok(())
}

async fn healthz() -> Json<HealthResponse> {
    Json(HealthResponse { status: "ok" })
}

async fn readyz() -> Json<HealthResponse> {
    Json(HealthResponse { status: "ready" })
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::{Request, StatusCode};
    use tower::ServiceExt;

    #[tokio::test]
    async fn health_is_ok() {
        let app = build_router();
        let request: Request<Body> = Request::builder()
            .uri("/healthz")
            .body(Body::empty())
            .expect("request");
        let response = app.oneshot(request).await.expect("response");
        assert_eq!(response.status(), StatusCode::OK);
    }
}
