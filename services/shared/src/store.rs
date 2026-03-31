use crate::domain::*;
use crate::error::{ServiceError, ServiceResult};
use crate::live::provider_suite_from_env;
use crate::orchestrator::{OrchestratorTick, RunMachine};
use crate::providers::ProviderSuite;
use chrono::Utc;
use serde::{Deserialize, Serialize};
use std::collections::{BTreeMap, HashMap};
use std::sync::{Arc, Mutex};

#[derive(Default)]
pub struct MemoryStoreInner {
    pub projects: HashMap<String, Project>,
    pub assets: HashMap<String, InputAsset>,
    pub runs: HashMap<String, GenerationRun>,
    pub events: HashMap<String, Vec<RunEvent>>,
    pub variants: HashMap<String, RenderedVariant>,
    pub usage: Vec<UsageLedger>,
}

#[derive(Clone)]
pub struct MemoryStore {
    inner: Arc<Mutex<MemoryStoreInner>>,
    providers: ProviderSuite,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UploadUrls {
    pub upload_url: String,
    pub download_url: String,
}

impl MemoryStore {
    pub fn new() -> Self {
        Self::with_providers(provider_suite_from_env())
    }

    pub fn with_providers(providers: ProviderSuite) -> Self {
        Self {
            inner: Arc::new(Mutex::new(MemoryStoreInner::default())),
            providers,
        }
    }

    fn lock(&self) -> ServiceResult<std::sync::MutexGuard<'_, MemoryStoreInner>> {
        self.inner
            .lock()
            .map_err(|_| ServiceError::Internal("store lock poisoned".to_string()))
    }

    pub fn health_summary(&self) -> AdminSummary {
        let inner = self.inner.lock().expect("store lock poisoned");
        AdminSummary {
            project_count: inner.projects.len(),
            run_count: inner.runs.len(),
            event_count: inner.events.values().map(Vec::len).sum(),
            variant_count: inner.variants.len(),
        }
    }

    pub fn admin_overview(&self) -> AdminOverview {
        let inner = self.inner.lock().expect("store lock poisoned");
        let active_runs = inner
            .runs
            .values()
            .filter(|run| {
                matches!(
                    run.status,
                    RunStatus::AwaitingScriptApproval
                        | RunStatus::AwaitingStoryboardApproval
                        | RunStatus::Running
                )
            })
            .count();
        let queued_jobs = inner
            .runs
            .values()
            .flat_map(|run| run.clip_jobs.iter())
            .filter(|job| job.status == "queued")
            .count();
        let failed_jobs = inner
            .runs
            .values()
            .flat_map(|run| run.clip_jobs.iter())
            .filter(|job| job.status == "failed")
            .count();

        AdminOverview {
            active_runs,
            queued_jobs,
            failed_jobs,
        }
    }

    pub fn create_project(&self, request: CreateProjectRequest) -> ServiceResult<Project> {
        let mut inner = self.lock()?;
        let now = Utc::now();
        let project = Project {
            id: new_id("proj"),
            workspace_id: request.workspace_id,
            name: request.name,
            description: request.description,
            created_at: now,
            updated_at: now,
        };
        inner.projects.insert(project.id.clone(), project.clone());
        Ok(project)
    }

    pub fn list_projects(&self) -> ServiceResult<Vec<Project>> {
        let inner = self.lock()?;
        let mut projects = inner.projects.values().cloned().collect::<Vec<_>>();
        projects.sort_by(|left, right| right.updated_at.cmp(&left.updated_at));
        Ok(projects)
    }

    pub fn get_project(&self, project_id: &str) -> ServiceResult<Project> {
        let inner = self.lock()?;
        inner
            .projects
            .get(project_id)
            .cloned()
            .ok_or_else(|| ServiceError::NotFound(format!("project {project_id}")))
    }

    pub fn prepare_upload(
        &self,
        project_id: &str,
        request: PrepareUploadRequest,
    ) -> ServiceResult<PreparedUpload> {
        let mut inner = self.lock()?;
        if !inner.projects.contains_key(project_id) {
            return Err(ServiceError::NotFound(format!("project {project_id}")));
        }
        let asset_id = new_id("asset");
        let upload_url = format!(
            "mock://uploads/{project_id}/{asset_id}/{}",
            request.filename
        );
        let download_url = format!(
            "mock://downloads/{project_id}/{asset_id}/{}",
            request.filename
        );
        inner.assets.insert(
            asset_id.clone(),
            InputAsset {
                id: asset_id.clone(),
                project_id: project_id.to_string(),
                filename: request.filename,
                content_type: request.content_type,
                upload_url: upload_url.clone(),
                created_at: Utc::now(),
            },
        );
        Ok(PreparedUpload {
            asset_id,
            upload_url,
            download_url,
        })
    }

    pub fn list_assets(&self, project_id: &str) -> ServiceResult<Vec<InputAsset>> {
        let inner = self.lock()?;
        Ok(inner
            .assets
            .values()
            .filter(|asset| asset.project_id == project_id)
            .cloned()
            .collect())
    }

    pub fn create_run(&self, request: CreateRunRequest) -> ServiceResult<GenerationRun> {
        let mut inner = self.lock()?;
        let project = inner
            .projects
            .get(&request.project_id)
            .cloned()
            .ok_or_else(|| ServiceError::NotFound(format!("project {}", request.project_id)))?;
        let assets = inner
            .assets
            .values()
            .filter(|asset| asset.project_id == request.project_id)
            .cloned()
            .collect::<Vec<_>>();
        let duration_seconds = request.duration_seconds.unwrap_or(8);
        let brief = CreativeBrief {
            objective: request.objective,
            audience: request.audience,
            tone: request.tone,
            call_to_action: request.call_to_action,
            duration_seconds: Some(duration_seconds),
            formats: request.formats.clone(),
        };
        let script = self.providers.script.generate_script(&brief, &assets)?;
        let storyboard = build_storyboard(&brief, &script, 1);
        let run = GenerationRun {
            id: new_id("run"),
            project_id: project.id.clone(),
            workspace_id: project.workspace_id,
            status: RunStatus::AwaitingScriptApproval,
            stage: WorkflowStage::WritersRoom,
            brief,
            script: Some(script),
            storyboard: Some(storyboard),
            clip_jobs: Vec::new(),
            clip_assets: Vec::new(),
            edit_plan: None,
            variant_recipes: Vec::new(),
            rendered_variants: Vec::new(),
            delivery_bundle: None,
            provider_runs: Vec::new(),
            created_at: Utc::now(),
            updated_at: Utc::now(),
        };
        inner.runs.insert(run.id.clone(), run.clone());
        drop(inner);
        self.push_event(
            &run.id,
            &run.project_id,
            WorkflowStage::WritersRoom,
            "script_draft_created",
            "draft",
            10,
            "writers_room",
            vec![
                run.script
                    .as_ref()
                    .map(|s| s.id.clone())
                    .unwrap_or_default(),
            ],
            "script draft ready",
        )?;
        Ok(run)
    }

    pub fn get_run(&self, run_id: &str) -> ServiceResult<GenerationRun> {
        let inner = self.lock()?;
        inner
            .runs
            .get(run_id)
            .cloned()
            .ok_or_else(|| ServiceError::NotFound(format!("run {run_id}")))
    }

    pub fn list_runs(&self) -> ServiceResult<Vec<GenerationRun>> {
        let inner = self.lock()?;
        Ok(inner.runs.values().cloned().collect())
    }

    pub fn list_events(&self, run_id: &str) -> ServiceResult<Vec<RunEvent>> {
        let inner = self.lock()?;
        Ok(inner.events.get(run_id).cloned().unwrap_or_default())
    }

    pub fn list_variants(&self, run_id: &str) -> ServiceResult<Vec<RenderedVariant>> {
        let inner = self.lock()?;
        let run = inner
            .runs
            .get(run_id)
            .ok_or_else(|| ServiceError::NotFound(format!("run {run_id}")))?;
        Ok(run.rendered_variants.clone())
    }

    pub fn approve_script(&self, run_id: &str) -> ServiceResult<GenerationRun> {
        let mut inner = self.lock()?;
        let run = inner
            .runs
            .get_mut(run_id)
            .ok_or_else(|| ServiceError::NotFound(format!("run {run_id}")))?;
        if let Some(script) = run.script.clone() {
            let next_version = run.storyboard.as_ref().map(|board| board.version + 1).unwrap_or(1);
            run.storyboard = Some(build_storyboard(&run.brief, &script, next_version));
        }
        run.status = RunStatus::AwaitingStoryboardApproval;
        run.stage = WorkflowStage::Storyboard;
        run.updated_at = Utc::now();
        let project_id = run.project_id.clone();
        let stage = run.stage.clone();
        let script_id = run
            .script
            .as_ref()
            .map(|script| script.id.clone())
            .unwrap_or_default();
        let snapshot = run.clone();
        drop(inner);
        self.push_event(
            run_id,
            &project_id,
            stage,
            "script_approved",
            "approved",
            40,
            "product_owner",
            vec![script_id],
            "script approved",
        )?;
        Ok(snapshot)
    }

    pub fn regenerate_script(&self, run_id: &str) -> ServiceResult<GenerationRun> {
        let mut inner = self.lock()?;
        let project_id = inner
            .runs
            .get(run_id)
            .ok_or_else(|| ServiceError::NotFound(format!("run {run_id}")))?
            .project_id
            .clone();
        let assets = inner
            .assets
            .values()
            .filter(|asset| asset.project_id == project_id)
            .cloned()
            .collect::<Vec<_>>();
        let run = inner
            .runs
            .get_mut(run_id)
            .ok_or_else(|| ServiceError::NotFound(format!("run {run_id}")))?;
        let mut script = self.providers.script.generate_script(&run.brief, &assets)?;
        script.version = run.script.as_ref().map(|existing| existing.version + 1).unwrap_or(1);
        run.script = Some(script.clone());
        run.storyboard = Some(build_storyboard(&run.brief, &script, 1));
        run.rendered_variants = Vec::new();
        run.clip_assets = Vec::new();
        run.clip_jobs = Vec::new();
        run.edit_plan = None;
        run.delivery_bundle = None;
        run.status = RunStatus::AwaitingScriptApproval;
        run.stage = WorkflowStage::WritersRoom;
        run.updated_at = Utc::now();
        let project_id = run.project_id.clone();
        let snapshot = run.clone();
        drop(inner);
        self.push_event(
            run_id,
            &project_id,
            WorkflowStage::WritersRoom,
            "script_regenerated",
            "regenerated",
            25,
            "writers_room",
            vec![script.id],
            "script regenerated",
        )?;
        Ok(snapshot)
    }


    pub fn approve_storyboard(&self, run_id: &str) -> ServiceResult<GenerationRun> {
        let mut inner = self.lock()?;
        let (snapshot, project_id, rendered_variants, edit_plan_id) = {
            let run = inner
                .runs
                .get_mut(run_id)
                .ok_or_else(|| ServiceError::NotFound(format!("run {run_id}")))?;
            let storyboard = run.storyboard.clone().ok_or_else(|| {
                ServiceError::InvalidRequest("storyboard not initialized".to_string())
            })?;
            let allow_mock = std::env::var("ALLOW_MOCK_VIDEO").is_ok();
            if !allow_mock
                && matches!(
                    self.providers.mode,
                    crate::providers::ProviderMode::Mock | crate::providers::ProviderMode::LiveScriptOnly
                )
            {
                run.status = RunStatus::Failed;
                run.stage = WorkflowStage::ClipGeneration;
                run.updated_at = Utc::now();
                let project_id = run.project_id.clone();
                drop(inner);
                self.push_event(
                    run_id,
                    &project_id,
                    WorkflowStage::ClipGeneration,
                    "clip_generation_failed",
                    "failed",
                    70,
                    "clip_lab",
                    Vec::new(),
                    "video generation is not configured",
                )?;
                return Err(ServiceError::InvalidRequest(
                    "video generation is not configured".to_string(),
                ));
            }
            let mut clips = Vec::new();
            for scene in &storyboard.scenes {
                for ratio in generation_formats(&run.brief.formats) {
                    match self.providers.video.generate_clip(scene, ratio) {
                        Ok(clip) => clips.push(clip),
                        Err(error) => {
                            run.status = RunStatus::Failed;
                            run.stage = WorkflowStage::ClipGeneration;
                            run.updated_at = Utc::now();
                            let project_id = run.project_id.clone();
                            drop(inner);
                            self.push_event(
                                run_id,
                                &project_id,
                                WorkflowStage::ClipGeneration,
                                "clip_generation_failed",
                                "failed",
                                70,
                                "clip_lab",
                                Vec::new(),
                                &format!("clip generation failed: {error}"),
                            )?;
                            return Err(error);
                        }
                    }
                }
            }
            let edit_plan = self.providers.edit.plan_edit(run)?;
            let mut clip_jobs = Vec::new();
            for scene in &storyboard.scenes {
                clip_jobs.push(ClipJob {
                    id: new_id("job"),
                    scene_id: scene.id.clone(),
                    provider: match self.providers.mode {
                        crate::providers::ProviderMode::LiveGeminiApi => "gemini_video".to_string(),
                        crate::providers::ProviderMode::LiveVertex => "vertex_video".to_string(),
                        crate::providers::ProviderMode::LiveScriptOnly => {
                            "clip_lab_mock".to_string()
                        }
                        crate::providers::ProviderMode::Mock => "clip_lab".to_string(),
                    },
                    status: "completed".to_string(),
                    attempts: 1,
                    started_at: Some(Utc::now()),
                    finished_at: Some(Utc::now()),
                });
            }
            let mut run_with_render = run.clone();
            run_with_render.clip_jobs = clip_jobs;
            run_with_render.clip_assets = clips.clone();
            run_with_render.edit_plan = Some(edit_plan.clone());
            let rendered_variants = match self
                .providers
                .renderer
                .render_variants(&run_with_render, &edit_plan, &clips)
            {
                Ok(variants) => variants,
                Err(error) => {
                    run.status = RunStatus::Failed;
                    run.stage = WorkflowStage::Assembly;
                    run.updated_at = Utc::now();
                    let project_id = run.project_id.clone();
                    drop(inner);
                    self.push_event(
                        run_id,
                        &project_id,
                        WorkflowStage::Assembly,
                        "variant_render_failed",
                        "failed",
                        90,
                        "renderer",
                        Vec::new(),
                        &format!("variant render failed: {error}"),
                    )?;
                    return Err(error);
                }
            };
            let delivery_bundle = DeliveryBundle {
                id: new_id("bundle"),
                variant_ids: rendered_variants
                    .iter()
                    .map(|variant| variant.id.clone())
                    .collect(),
                export_count: rendered_variants.len() as u32,
            };
            run.status = RunStatus::Completed;
            run.stage = WorkflowStage::Delivery;
            run.clip_jobs = run_with_render.clip_jobs;
            run.clip_assets = clips.clone();
            run.edit_plan = Some(edit_plan.clone());
            run.rendered_variants = rendered_variants.clone();
            run.variant_recipes = vec![VariantRecipe {
                id: new_id("recipe"),
                name: "default_bundle".to_string(),
                hook: "best hook".to_string(),
                scene_ids: storyboard
                    .scenes
                    .iter()
                    .map(|scene| scene.id.clone())
                    .collect(),
                aspect_ratios: run.brief.formats.clone(),
            }];
            run.delivery_bundle = Some(delivery_bundle);
            run.updated_at = Utc::now();
            (
                run.clone(),
                run.project_id.clone(),
                rendered_variants,
                edit_plan.id.clone(),
            )
        };
        for variant in rendered_variants.clone() {
            inner.variants.insert(variant.id.clone(), variant);
        }
        drop(inner);
        self.push_event(
            run_id,
            &project_id,
            WorkflowStage::Delivery,
            "storyboard_approved",
            "approved",
            80,
            "product_owner",
            vec![edit_plan_id],
            "storyboard approved",
        )?;
        self.push_event(
            run_id,
            &project_id,
            WorkflowStage::Delivery,
            "variants_rendered",
            "completed",
            100,
            "renderer",
            snapshot
                .rendered_variants
                .iter()
                .map(|v| v.id.clone())
                .collect(),
            "variants rendered",
        )?;
        Ok(snapshot)
    }

    pub fn regenerate_storyboard(&self, run_id: &str) -> ServiceResult<GenerationRun> {
        let mut inner = self.lock()?;
        let run = inner
            .runs
            .get_mut(run_id)
            .ok_or_else(|| ServiceError::NotFound(format!("run {run_id}")))?;
        let script = run
            .script
            .clone()
            .ok_or_else(|| ServiceError::InvalidRequest("script not initialized".to_string()))?;
        let next_version = run.storyboard.as_ref().map(|board| board.version + 1).unwrap_or(1);
        let storyboard = build_storyboard(&run.brief, &script, next_version);
        run.storyboard = Some(storyboard.clone());
        run.rendered_variants = Vec::new();
        run.clip_assets = Vec::new();
        run.clip_jobs = Vec::new();
        run.edit_plan = None;
        run.delivery_bundle = None;
        run.updated_at = Utc::now();
        let project_id = run.project_id.clone();
        let snapshot = run.clone();
        drop(inner);
        self.push_event(
            run_id,
            &project_id,
            WorkflowStage::Storyboard,
            "storyboard_regenerated",
            "regenerated",
            55,
            "storyboard_lead",
            vec![storyboard.id],
            "storyboard regenerated",
        )?;
        Ok(snapshot)
    }

    pub fn publish_variant(&self, variant_id: &str) -> ServiceResult<RenderedVariant> {
        let mut inner = self.lock()?;
        if let Some(variant) = inner.variants.get_mut(variant_id) {
            variant.published = true;
            return Ok(variant.clone());
        }
        let mut found: Option<RenderedVariant> = None;
        for run in inner.runs.values_mut() {
            if let Some(variant) = run
                .rendered_variants
                .iter_mut()
                .find(|variant| variant.id == variant_id)
            {
                variant.published = true;
                found = Some(variant.clone());
                break;
            }
        }
        if let Some(variant) = found {
            inner.variants.insert(variant.id.clone(), variant.clone());
            Ok(variant)
        } else {
            Err(ServiceError::NotFound(format!("variant {variant_id}")))
        }
    }

    pub fn tick_run(&self, run_id: &str) -> ServiceResult<OrchestratorTick> {
        let run = self.get_run(run_id)?;
        let run_id = run.id.clone();
        Ok(OrchestratorTick {
            run_id,
            action: RunMachine::next_action(&run),
            stage: run.stage,
            status: run.status,
        })
    }

    pub fn push_event(
        &self,
        run_id: &str,
        project_id: &str,
        stage: WorkflowStage,
        step: &str,
        status: &str,
        progress: u8,
        actor: &str,
        artifact_ids: Vec<String>,
        message: &str,
    ) -> ServiceResult<RunEvent> {
        let mut inner = self.lock()?;
        let event = RunEvent {
            event_id: new_id("event"),
            run_id: run_id.to_string(),
            project_id: project_id.to_string(),
            stage,
            step: step.to_string(),
            status: status.to_string(),
            attempt: 1,
            actor: actor.to_string(),
            artifact_ids,
            message: message.to_string(),
            progress,
            emitted_at: Utc::now(),
            metrics: BTreeMap::new(),
        };
        inner
            .events
            .entry(run_id.to_string())
            .or_default()
            .push(event.clone());
        Ok(event)
    }
}

fn split_scene_durations(total_seconds: u32) -> Vec<u32> {
    let min = 5;
    let max = 8;
    let mut total = total_seconds.max(min);
    let mut count = (total + max - 1) / max;
    if count == 0 {
        count = 1;
    }
    let mut base = total / count;
    let mut remainder = total % count;

    if base < min {
        count = (total + min - 1) / min;
        if count == 0 {
            count = 1;
        }
        base = total / count;
        remainder = total % count;
    }

    let mut durations = Vec::new();
    for _ in 0..count {
        let mut duration = base + if remainder > 0 { remainder -= 1; 1 } else { 0 };
        duration = duration.clamp(min, max);
        durations.push(duration);
    }
    if durations.is_empty() {
        durations.push(min);
    }
    durations
}

fn build_storyboard(brief: &CreativeBrief, script: &ScriptPackage, version: u32) -> StoryboardDraft {
    let total_seconds = brief.duration_seconds.unwrap_or(8);
    let durations = split_scene_durations(total_seconds);
    let mut prompts: Vec<String> = Vec::new();

    if !script.sections.is_empty() {
        prompts.extend(
            script
                .sections
                .iter()
                .map(|section| format!("{}: {}", section.heading, section.copy)),
        );
    } else if !script.voiceover.trim().is_empty() {
        prompts.extend(
            script
                .voiceover
                .split('.')
                .map(|sentence| sentence.trim())
                .filter(|sentence| !sentence.is_empty())
                .map(|sentence| sentence.to_string()),
        );
    }

    if prompts.is_empty() {
        prompts.push(brief.objective.clone());
    }

    let visual_notes = [
        "cinematic opener",
        "product detail",
        "lifestyle context",
        "feature focus",
        "brand lockup",
        "closing frame",
    ];
    let camera_notes = ["push in", "steady glide", "slow pan", "locked frame", "arc", "pull back"];

    let scenes = durations
        .iter()
        .enumerate()
        .map(|(index, duration)| SceneSpec {
            id: new_id("scene"),
            index: (index + 1) as u32,
            duration_seconds: *duration,
            visual_direction: visual_notes[index % visual_notes.len()].to_string(),
            camera_direction: camera_notes[index % camera_notes.len()].to_string(),
            prompt: prompts[index % prompts.len()].clone(),
        })
        .collect();

    StoryboardDraft {
        id: new_id("story"),
        version,
        scenes,
    }
}

fn generation_formats(formats: &[AspectRatio]) -> Vec<AspectRatio> {
    let video_model = std::env::var("GEMINI_VIDEO_MODEL").unwrap_or_default();
    let disallow_square = video_model.starts_with("veo-2");
    let requested = if formats.is_empty() {
        vec![AspectRatio::R9x16, AspectRatio::R1x1, AspectRatio::R16x9]
    } else {
        formats.to_vec()
    };

    let mut result = Vec::new();
    if requested.iter().any(|ratio| *ratio == AspectRatio::R9x16) {
        result.push(AspectRatio::R9x16);
    }
    if !disallow_square && requested.iter().any(|ratio| *ratio == AspectRatio::R1x1) {
        result.push(AspectRatio::R1x1);
    }
    if requested.iter().any(|ratio| *ratio == AspectRatio::R16x9) {
        result.push(AspectRatio::R16x9);
    }
    if result.is_empty() {
        result.push(AspectRatio::R16x9);
    }
    result
}
