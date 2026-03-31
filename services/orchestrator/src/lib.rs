use axum::{
    Json, Router,
    extract::{Path, State},
    response::IntoResponse,
    routing::{get, post},
};
use serde::Serialize;
use shared::{MemoryStore, OrchestratorTick, ServiceError};
use std::net::SocketAddr;
use tower_http::trace::TraceLayer;
use tracing_subscriber::EnvFilter;

#[derive(Clone)]
pub struct OrchestratorState {
    pub store: MemoryStore,
}

impl OrchestratorState {
    pub fn new(store: MemoryStore) -> Self {
        Self { store }
    }
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
pub struct OrchestratorError(pub ServiceError);

impl IntoResponse for OrchestratorError {
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

impl From<ServiceError> for OrchestratorError {
    fn from(value: ServiceError) -> Self {
        Self(value)
    }
}

pub fn build_router(state: OrchestratorState) -> Router {
    Router::new()
        .route("/healthz", get(healthz))
        .route("/internal/tick/{run_id}", post(tick_run))
        .route("/internal/reconcile/{run_id}", post(reconcile_run))
        .with_state(state)
        .layer(TraceLayer::new_for_http())
}

pub async fn run() -> anyhow::Result<()> {
    let filter = EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| EnvFilter::new("orchestrator=info,shared=info"));
    let _ = tracing_subscriber::fmt().with_env_filter(filter).try_init();

    let addr = std::env::var("ORCHESTRATOR_BIND_ADDR")
        .ok()
        .and_then(|value| value.parse::<SocketAddr>().ok())
        .or_else(|| {
            std::env::var("PORT")
                .ok()
                .and_then(|value| value.parse::<u16>().ok())
                .map(|port| SocketAddr::from(([0, 0, 0, 0], port)))
        })
        .unwrap_or_else(|| SocketAddr::from(([0, 0, 0, 0], 8080)));

    let app = build_router(OrchestratorState::new(MemoryStore::new()));
    let listener = tokio::net::TcpListener::bind(addr).await?;
    tracing::info!("orchestrator listening on {}", listener.local_addr()?);
    axum::serve(listener, app).await?;
    Ok(())
}

async fn healthz() -> Json<HealthResponse> {
    Json(HealthResponse { status: "ok" })
}

async fn tick_run(
    State(state): State<OrchestratorState>,
    Path(run_id): Path<String>,
) -> Result<Json<OrchestratorTick>, OrchestratorError> {
    Ok(Json(state.store.tick_run(&run_id)?))
}

async fn reconcile_run(
    State(state): State<OrchestratorState>,
    Path(run_id): Path<String>,
) -> Result<Json<OrchestratorTick>, OrchestratorError> {
    Ok(Json(state.store.tick_run(&run_id)?))
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::{Request, StatusCode};
    use tower::ServiceExt;

    #[tokio::test]
    async fn health_route_is_alive() {
        let app = build_router(OrchestratorState::new(MemoryStore::new()));
        let request: Request<Body> = Request::builder()
            .uri("/healthz")
            .body(Body::empty())
            .expect("request");
        let response = app.oneshot(request).await.expect("response");
        assert_eq!(response.status(), StatusCode::OK);
    }
}
