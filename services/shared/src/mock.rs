use crate::domain::*;
use crate::error::ServiceResult;
use crate::providers::*;
use std::sync::Arc;

#[derive(Default, Clone, Copy)]
pub struct MockScriptProvider;

impl ScriptProvider for MockScriptProvider {
    fn generate_script(
        &self,
        brief: &CreativeBrief,
        _assets: &[InputAsset],
    ) -> ServiceResult<ScriptPackage> {
        Ok(ScriptPackage {
            id: new_id("script"),
            version: 1,
            headline: format!("{} that actually lands", brief.objective),
            logline: format!("Built for {} with a {} tone", brief.audience, brief.tone),
            voiceover: format!(
                "You asked for {}. We built a sharper, faster story with {}.",
                brief.objective, brief.call_to_action
            ),
            on_screen_text: vec![
                "Hook fast".to_string(),
                "Show proof".to_string(),
                "Close hard".to_string(),
            ],
            sections: vec![
                ScriptSection {
                    heading: "Hook".to_string(),
                    copy: "Open on the strongest promise.".to_string(),
                },
                ScriptSection {
                    heading: "Body".to_string(),
                    copy: "Layer the benefit with visual proof.".to_string(),
                },
                ScriptSection {
                    heading: "Close".to_string(),
                    copy: brief.call_to_action.clone(),
                },
            ],
        })
    }
}

#[derive(Default, Clone, Copy)]
pub struct MockVideoProvider;

impl VideoProvider for MockVideoProvider {
    fn generate_clip(
        &self,
        scene: &SceneSpec,
        aspect_ratio: AspectRatio,
    ) -> ServiceResult<ClipAsset> {
        let ratio = match aspect_ratio {
            AspectRatio::R16x9 => "16x9",
            AspectRatio::R1x1 => "1x1",
            AspectRatio::R9x16 => "9x16",
        };
        Ok(ClipAsset {
            id: new_id("clip"),
            scene_id: scene.id.clone(),
            uri: format!("mock://clips/{}-{ratio}.mp4", scene.id),
            thumbnail_uri: format!("mock://clips/{}-{ratio}.jpg", scene.id),
            duration_seconds: scene.duration_seconds,
            aspect_ratio,
        })
    }
}

#[derive(Default, Clone, Copy)]
pub struct MockVoiceProvider;

impl VoiceProvider for MockVoiceProvider {
    fn generate_voiceover(&self, script: &ScriptPackage) -> ServiceResult<String> {
        Ok(format!(
            "Voiceover for {} v{}",
            script.headline, script.version
        ))
    }
}

#[derive(Default, Clone, Copy)]
pub struct MockQCProvider;

impl QCProvider for MockQCProvider {
    fn review_clip(&self, _clip: &ClipAsset) -> ServiceResult<bool> {
        Ok(true)
    }
}

#[derive(Default, Clone, Copy)]
pub struct MockEditPlanner;

impl EditPlanner for MockEditPlanner {
    fn plan_edit(&self, run: &GenerationRun) -> ServiceResult<EditPlan> {
        let beat_sheet = run
            .storyboard
            .as_ref()
            .map(|storyboard| {
                storyboard
                    .scenes
                    .iter()
                    .map(|scene| format!("Scene {} - {}", scene.index, scene.prompt))
                    .collect()
            })
            .unwrap_or_else(|| vec!["Open with the sharpest hook".to_string()]);

        Ok(EditPlan {
            id: new_id("edit"),
            name: format!("{} edit", run.brief.objective),
            beat_sheet,
            transition_notes: vec![
                "Use a kinetic first cut.".to_string(),
                "Keep text overlays readable on mobile.".to_string(),
            ],
        })
    }
}

#[derive(Default, Clone, Copy)]
pub struct MockRenderer;

impl Renderer for MockRenderer {
    fn render_variants(
        &self,
        run: &GenerationRun,
        edit_plan: &EditPlan,
        clips: &[ClipAsset],
    ) -> ServiceResult<Vec<RenderedVariant>> {
        let ratios = if run.brief.formats.is_empty() {
            vec![AspectRatio::R9x16, AspectRatio::R1x1, AspectRatio::R16x9]
        } else {
            run.brief.formats.clone()
        };
        let names = [
            "performance_cut",
            "brand_cut",
            "feature_cut",
            "platform_cut",
        ];

        Ok(ratios
            .into_iter()
            .enumerate()
            .map(|(idx, ratio)| {
                let name = names.get(idx).unwrap_or(&"platform_cut").to_string();
                RenderedVariant {
                    id: new_id("variant"),
                    recipe_id: edit_plan.id.clone(),
                    name,
                    aspect_ratio: ratio.clone(),
                    uri: format!("mock://renders/{}/{}.mp4", run.id, idx),
                    thumbnail_uri: format!("mock://renders/{}/{}.jpg", run.id, idx),
                    published: false,
                }
            })
            .chain(
                clips
                    .iter()
                    .enumerate()
                    .take(1)
                    .map(|(idx, clip)| RenderedVariant {
                        id: new_id("variant"),
                        recipe_id: edit_plan.id.clone(),
                        name: format!("clip_preview_{idx}"),
                        aspect_ratio: clip.aspect_ratio.clone(),
                        uri: format!("mock://renders/{}/clip-{idx}.mp4", run.id),
                        thumbnail_uri: clip.thumbnail_uri.clone(),
                        published: false,
                    }),
            )
            .collect())
    }
}

#[derive(Default)]
pub struct MockProviderSuite {
    pub script: MockScriptProvider,
    pub video: MockVideoProvider,
    pub voice: MockVoiceProvider,
    pub qc: MockQCProvider,
    pub edit: MockEditPlanner,
    pub renderer: MockRenderer,
}

impl ProviderSuite {
    pub fn mock() -> Self {
        Self {
            mode: ProviderMode::Mock,
            script: Arc::new(MockScriptProvider),
            video: Arc::new(MockVideoProvider),
            voice: Arc::new(MockVoiceProvider),
            qc: Arc::new(MockQCProvider),
            edit: Arc::new(MockEditPlanner),
            renderer: Arc::new(MockRenderer),
        }
    }
}
