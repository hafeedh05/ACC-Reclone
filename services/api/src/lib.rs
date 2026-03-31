use axum::{
    Json, Router,
    extract::{OriginalUri, Path, State},
    http::StatusCode,
    response::{
        IntoResponse, Response,
        sse::{Event, KeepAlive, Sse},
    },
    routing::{get, post},
};
use serde::Serialize;
use shared::{
    AdminOverview, AdminSummary, CreateProjectRequest, CreateRunRequest, GenerationRun,
    MemoryStore, PrepareUploadRequest, PreparedUpload, Project, RenderedVariant, RunEvent,
    ServiceError,
};
use std::{convert::Infallible, net::SocketAddr, path::PathBuf, time::Duration};
use tokio_stream::iter as stream_iter;
use tower_http::services::ServeDir;
use tower_http::trace::TraceLayer;
use tracing_subscriber::EnvFilter;

#[derive(Clone)]
pub struct ApiState {
    pub store: MemoryStore,
}

impl ApiState {
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
pub struct ApiError(pub ServiceError);

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, message) = match self.0 {
            ServiceError::NotFound(message) => (StatusCode::NOT_FOUND, message),
            ServiceError::InvalidRequest(message) => (StatusCode::BAD_REQUEST, message),
            ServiceError::Conflict(message) => (StatusCode::CONFLICT, message),
            ServiceError::Internal(message) => (StatusCode::INTERNAL_SERVER_ERROR, message),
        };
        (status, Json(ErrorResponse { error: message })).into_response()
    }
}

impl From<ServiceError> for ApiError {
    fn from(value: ServiceError) -> Self {
        Self(value)
    }
}

fn api_routes() -> Router<ApiState> {
    Router::new()
        .route("/v1/projects", get(list_projects).post(create_project))
        .route(
            "/v1/projects/{project_id}/assets:prepare-upload",
            post(prepare_upload),
        )
        .route("/v1/runs", get(list_runs).post(create_run))
        .route("/v1/runs/{run_id}", get(get_run))
        .route("/v1/runs/{run_id}/stream", get(stream_events))
        .route("/v1/runs/{run_id}/approve-script", post(approve_script))
        .route(
            "/v1/runs/{run_id}/regenerate-script",
            post(regenerate_script),
        )
        .route(
            "/v1/runs/{run_id}/approve-storyboard",
            post(approve_storyboard),
        )
        .route(
            "/v1/runs/{run_id}/regenerate-storyboard",
            post(regenerate_storyboard),
        )
        .route("/v1/runs/{run_id}/events", get(list_events))
        .route("/v1/runs/{run_id}/variants", get(list_variants))
        .route("/v1/variants/{variant_id}/publish", post(publish_variant))
        .route("/v1/admin/overview", get(admin_overview))
        .route("/v1/admin/summary", get(admin_summary))
        .route("/v1/admin/health", get(admin_health))
        .fallback(exact_publish_fallback)
}

pub fn build_router(state: ApiState) -> Router {
    let api = api_routes();
    let media_dir = media_root_dir();

    Router::new()
        .nest_service("/media", ServeDir::new(media_dir))
        .route("/healthz", get(healthz))
        .merge(api.clone())
        .nest("/api", api)
        .with_state(state)
        .layer(TraceLayer::new_for_http())
}

pub async fn run() -> anyhow::Result<()> {
    let filter = EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| EnvFilter::new("api=info,shared=info"));
    let _ = tracing_subscriber::fmt().with_env_filter(filter).try_init();

    let addr = std::env::var("API_BIND_ADDR")
        .ok()
        .and_then(|value| value.parse::<SocketAddr>().ok())
        .or_else(|| {
            std::env::var("PORT")
                .ok()
                .and_then(|value| value.parse::<u16>().ok())
                .map(|port| SocketAddr::from(([0, 0, 0, 0], port)))
        })
        .unwrap_or_else(|| SocketAddr::from(([0, 0, 0, 0], 8080)));

    let app = build_router(ApiState::new(MemoryStore::new()));
    let listener = tokio::net::TcpListener::bind(addr).await?;
    tracing::info!("api listening on {}", listener.local_addr()?);
    axum::serve(listener, app).await?;
    Ok(())
}

async fn healthz() -> Json<HealthResponse> {
    Json(HealthResponse { status: "ok" })
}

fn media_root_dir() -> PathBuf {
    let root = std::env::var("AETHER_MEDIA_DIR")
        .map(PathBuf::from)
        .unwrap_or_else(|_| std::env::temp_dir().join("aether-media"));
    let _ = std::fs::create_dir_all(&root);
    root
}

async fn list_projects(State(state): State<ApiState>) -> Result<Json<Vec<Project>>, ApiError> {
    Ok(Json(state.store.list_projects()?))
}

async fn list_runs(State(state): State<ApiState>) -> Result<Json<Vec<GenerationRun>>, ApiError> {
    Ok(Json(state.store.list_runs()?))
}

async fn create_project(
    State(state): State<ApiState>,
    Json(request): Json<CreateProjectRequest>,
) -> Result<(StatusCode, Json<Project>), ApiError> {
    Ok((
        StatusCode::CREATED,
        Json(state.store.create_project(request)?),
    ))
}

async fn prepare_upload(
    State(state): State<ApiState>,
    Path(project_id): Path<String>,
    Json(request): Json<PrepareUploadRequest>,
) -> Result<Json<PreparedUpload>, ApiError> {
    Ok(Json(state.store.prepare_upload(&project_id, request)?))
}

async fn create_run(
    State(state): State<ApiState>,
    Json(request): Json<CreateRunRequest>,
) -> Result<(StatusCode, Json<GenerationRun>), ApiError> {
    Ok((StatusCode::ACCEPTED, Json(state.store.create_run(request)?)))
}

async fn get_run(
    State(state): State<ApiState>,
    Path(run_id): Path<String>,
) -> Result<Json<GenerationRun>, ApiError> {
    Ok(Json(state.store.get_run(&run_id)?))
}

async fn approve_script(
    State(state): State<ApiState>,
    Path(run_id): Path<String>,
) -> Result<Json<GenerationRun>, ApiError> {
    Ok(Json(state.store.approve_script(&run_id)?))
}

async fn regenerate_script(
    State(state): State<ApiState>,
    Path(run_id): Path<String>,
) -> Result<Json<GenerationRun>, ApiError> {
    Ok(Json(state.store.regenerate_script(&run_id)?))
}

async fn approve_storyboard(
    State(state): State<ApiState>,
    Path(run_id): Path<String>,
) -> Result<Json<GenerationRun>, ApiError> {
    Ok(Json(state.store.approve_storyboard(&run_id)?))
}

async fn regenerate_storyboard(
    State(state): State<ApiState>,
    Path(run_id): Path<String>,
) -> Result<Json<GenerationRun>, ApiError> {
    Ok(Json(state.store.regenerate_storyboard(&run_id)?))
}

async fn list_events(
    State(state): State<ApiState>,
    Path(run_id): Path<String>,
) -> Result<Json<Vec<RunEvent>>, ApiError> {
    Ok(Json(state.store.list_events(&run_id)?))
}

async fn stream_events(
    State(state): State<ApiState>,
    Path(run_id): Path<String>,
) -> Result<impl IntoResponse, ApiError> {
    let events = state.store.list_events(&run_id)?;
    let stream = stream_iter(
        events
            .into_iter()
            .map(|event| {
                let payload = serde_json::to_string(&event).unwrap_or_else(|_| "{}".to_string());
                Result::<Event, Infallible>::Ok(
                    Event::default()
                        .event("run_event")
                        .id(event.event_id)
                        .data(payload),
                )
            })
            .collect::<Vec<_>>(),
    );

    Ok(Sse::new(stream).keep_alive(
        KeepAlive::new()
            .interval(Duration::from_secs(10))
            .text("keep-alive"),
    ))
}

async fn list_variants(
    State(state): State<ApiState>,
    Path(run_id): Path<String>,
) -> Result<Json<Vec<RenderedVariant>>, ApiError> {
    Ok(Json(state.store.list_variants(&run_id)?))
}

async fn publish_variant(
    State(state): State<ApiState>,
    Path(variant_id): Path<String>,
) -> Result<Json<RenderedVariant>, ApiError> {
    Ok(Json(state.store.publish_variant(&variant_id)?))
}

async fn admin_overview(State(state): State<ApiState>) -> Json<AdminOverview> {
    Json(state.store.admin_overview())
}

async fn admin_summary(State(state): State<ApiState>) -> Json<AdminSummary> {
    Json(state.store.health_summary())
}

async fn admin_health(State(state): State<ApiState>) -> Json<HealthResponse> {
    let _ = state.store.health_summary();
    Json(HealthResponse { status: "ok" })
}

async fn exact_publish_fallback(
    State(state): State<ApiState>,
    OriginalUri(uri): OriginalUri,
) -> Result<Json<RenderedVariant>, ApiError> {
    let path = uri.path();
    let normalized = path.strip_prefix("/api").unwrap_or(path);
    if let Some(variant_id) = normalized
        .strip_prefix("/v1/variants/")
        .and_then(|tail| tail.strip_suffix(":publish"))
    {
        Ok(Json(state.store.publish_variant(variant_id)?))
    } else {
        Err(ApiError(ServiceError::NotFound(path.to_string())))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use http::{Request, StatusCode};
    use tower::ServiceExt;

    #[tokio::test]
    async fn create_project_and_run() {
        let app = build_router(ApiState::new(MemoryStore::new()));

        let response = app
            .clone()
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/v1/projects")
                    .header("content-type", "application/json")
                    .body(Body::from(
                        serde_json::json!({
                            "workspace_id": "workspace-a",
                            "name": "Alpha"
                        })
                        .to_string(),
                    ))
                    .expect("request"),
            )
            .await
            .expect("response");
        assert_eq!(response.status(), StatusCode::CREATED);

        let body = axum::body::to_bytes(response.into_body(), usize::MAX)
            .await
            .expect("body");
        let project: Project = serde_json::from_slice(&body).expect("json");

        let run_response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/v1/runs")
                    .header("content-type", "application/json")
                    .body(Body::from(
                        serde_json::json!({
                            "project_id": project.id,
                            "objective": "launch a clean ad",
                            "audience": "operators",
                            "tone": "confident",
                            "call_to_action": "Start now",
                            "formats": ["r9x16", "r1x1", "r16x9"]
                        })
                        .to_string(),
                    ))
                    .expect("request"),
            )
            .await
            .expect("response");
        assert_eq!(run_response.status(), StatusCode::ACCEPTED);
    }

    #[tokio::test]
    async fn api_prefix_is_supported() {
        let app = build_router(ApiState::new(MemoryStore::new()));

        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/api/v1/projects")
                    .header("content-type", "application/json")
                    .body(Body::from(
                        serde_json::json!({
                            "workspace_id": "workspace-a",
                            "name": "Alpha"
                        })
                        .to_string(),
                    ))
                    .expect("request"),
            )
            .await
            .expect("response");

        assert_eq!(response.status(), StatusCode::CREATED);
    }

    #[tokio::test]
    async fn publish_fallback_path_is_supported() {
        std::env::set_var("ALLOW_MOCK_VIDEO", "1");
        let store = MemoryStore::new();
        let project = store
            .create_project(CreateProjectRequest {
                workspace_id: "workspace-a".to_string(),
                name: "Alpha".to_string(),
                description: None,
            })
            .expect("project");
        let run = store
            .create_run(CreateRunRequest {
                project_id: project.id,
                objective: "launch".to_string(),
                audience: "operators".to_string(),
                tone: "confident".to_string(),
                call_to_action: "Start now".to_string(),
                duration_seconds: None,
                formats: vec![shared::AspectRatio::R9x16],
            })
            .expect("run");
        let approved = store.approve_storyboard(&run.id).expect("approved");
        let variant_id = approved
            .rendered_variants
            .first()
            .expect("variant")
            .id
            .clone();
        let app = build_router(ApiState::new(store));

        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri(format!("/v1/variants/{variant_id}:publish"))
                    .body(Body::empty())
                    .expect("request"),
            )
            .await
            .expect("response");

        assert_eq!(response.status(), StatusCode::OK);
    }
}
