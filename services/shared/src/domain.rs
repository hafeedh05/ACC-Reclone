use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;
use uuid::Uuid;

pub fn new_id(prefix: &str) -> String {
    format!("{prefix}-{}", Uuid::new_v4().simple())
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum WorkflowStage {
    Ingest,
    Normalize,
    WritersRoom,
    Storyboard,
    ClipGeneration,
    ClipQc,
    EditPlanning,
    Assembly,
    Delivery,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum RunStatus {
    Draft,
    AwaitingScriptApproval,
    AwaitingStoryboardApproval,
    Running,
    PartialSuccess,
    Completed,
    Failed,
    Cancelled,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum AssetKind {
    Image,
    Video,
    Audio,
    Document,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum AspectRatio {
    R16x9,
    R1x1,
    R9x16,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub workspace_id: String,
    pub email: String,
    pub display_name: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Workspace {
    pub id: String,
    pub name: String,
    pub slug: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Project {
    pub id: String,
    pub workspace_id: String,
    pub name: String,
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InputAsset {
    pub id: String,
    pub project_id: String,
    pub filename: String,
    pub content_type: String,
    pub upload_url: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreativeBrief {
    pub objective: String,
    pub audience: String,
    pub tone: String,
    pub call_to_action: String,
    pub formats: Vec<AspectRatio>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScriptSection {
    pub heading: String,
    pub copy: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScriptPackage {
    pub id: String,
    pub version: u32,
    pub headline: String,
    pub logline: String,
    pub voiceover: String,
    pub on_screen_text: Vec<String>,
    pub sections: Vec<ScriptSection>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SceneSpec {
    pub id: String,
    pub index: u32,
    pub duration_seconds: u32,
    pub visual_direction: String,
    pub camera_direction: String,
    pub prompt: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StoryboardDraft {
    pub id: String,
    pub version: u32,
    pub scenes: Vec<SceneSpec>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClipJob {
    pub id: String,
    pub scene_id: String,
    pub provider: String,
    pub status: String,
    pub attempts: u32,
    pub started_at: Option<DateTime<Utc>>,
    pub finished_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClipAsset {
    pub id: String,
    pub scene_id: String,
    pub uri: String,
    pub thumbnail_uri: String,
    pub duration_seconds: u32,
    pub aspect_ratio: AspectRatio,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EditPlan {
    pub id: String,
    pub name: String,
    pub beat_sheet: Vec<String>,
    pub transition_notes: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VariantRecipe {
    pub id: String,
    pub name: String,
    pub hook: String,
    pub scene_ids: Vec<String>,
    pub aspect_ratios: Vec<AspectRatio>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RenderedVariant {
    pub id: String,
    pub recipe_id: String,
    pub name: String,
    pub aspect_ratio: AspectRatio,
    pub uri: String,
    pub thumbnail_uri: String,
    pub published: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DeliveryBundle {
    pub id: String,
    pub variant_ids: Vec<String>,
    pub export_count: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProviderRun {
    pub id: String,
    pub provider_name: String,
    pub kind: String,
    pub status: String,
    pub input_digest: String,
    pub output_uri: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RunEvent {
    pub event_id: String,
    pub run_id: String,
    pub project_id: String,
    pub stage: WorkflowStage,
    pub step: String,
    pub status: String,
    pub attempt: u32,
    pub actor: String,
    pub artifact_ids: Vec<String>,
    pub message: String,
    pub progress: u8,
    pub emitted_at: DateTime<Utc>,
    pub metrics: BTreeMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UsageLedger {
    pub id: String,
    pub workspace_id: String,
    pub run_id: Option<String>,
    pub units: u64,
    pub currency: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GenerationRun {
    pub id: String,
    pub project_id: String,
    pub workspace_id: String,
    pub status: RunStatus,
    pub stage: WorkflowStage,
    pub brief: CreativeBrief,
    pub script: Option<ScriptPackage>,
    pub storyboard: Option<StoryboardDraft>,
    pub clip_jobs: Vec<ClipJob>,
    pub clip_assets: Vec<ClipAsset>,
    pub edit_plan: Option<EditPlan>,
    pub variant_recipes: Vec<VariantRecipe>,
    pub rendered_variants: Vec<RenderedVariant>,
    pub delivery_bundle: Option<DeliveryBundle>,
    pub provider_runs: Vec<ProviderRun>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateProjectRequest {
    pub workspace_id: String,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateRunRequest {
    pub project_id: String,
    pub objective: String,
    pub audience: String,
    pub tone: String,
    pub call_to_action: String,
    pub formats: Vec<AspectRatio>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PrepareUploadRequest {
    pub filename: String,
    pub content_type: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PreparedUpload {
    pub asset_id: String,
    pub upload_url: String,
    pub download_url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AdminSummary {
    pub project_count: usize,
    pub run_count: usize,
    pub event_count: usize,
    pub variant_count: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AdminOverview {
    pub active_runs: usize,
    pub queued_jobs: usize,
    pub failed_jobs: usize,
}
