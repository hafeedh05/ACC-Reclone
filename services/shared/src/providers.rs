use crate::domain::*;
use crate::error::ServiceResult;
use std::sync::Arc;

pub trait ScriptProvider: Send + Sync {
    fn generate_script(
        &self,
        brief: &CreativeBrief,
        assets: &[InputAsset],
    ) -> ServiceResult<ScriptPackage>;
}

pub trait VideoProvider: Send + Sync {
    fn generate_clip(
        &self,
        scene: &SceneSpec,
        aspect_ratio: AspectRatio,
    ) -> ServiceResult<ClipAsset>;
}

pub trait VoiceProvider: Send + Sync {
    fn generate_voiceover(&self, script: &ScriptPackage) -> ServiceResult<String>;
}

pub trait QCProvider: Send + Sync {
    fn review_clip(&self, clip: &ClipAsset) -> ServiceResult<bool>;
}

pub trait EditPlanner: Send + Sync {
    fn plan_edit(&self, run: &GenerationRun) -> ServiceResult<EditPlan>;
}

pub trait Renderer: Send + Sync {
    fn render_variants(
        &self,
        run: &GenerationRun,
        edit_plan: &EditPlan,
        clips: &[ClipAsset],
    ) -> ServiceResult<Vec<RenderedVariant>>;
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ProviderMode {
    Mock,
    LiveScriptOnly,
    LiveVertex,
    LiveGeminiApi,
}

#[derive(Clone)]
pub struct ProviderSuite {
    pub mode: ProviderMode,
    pub script: Arc<dyn ScriptProvider>,
    pub video: Arc<dyn VideoProvider>,
    pub voice: Arc<dyn VoiceProvider>,
    pub qc: Arc<dyn QCProvider>,
    pub edit: Arc<dyn EditPlanner>,
    pub renderer: Arc<dyn Renderer>,
}
