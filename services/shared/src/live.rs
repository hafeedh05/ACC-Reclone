use crate::domain::*;
use crate::error::{ServiceError, ServiceResult};
use crate::mock::{MockEditPlanner, MockQCProvider, MockVoiceProvider};
use crate::providers::{ProviderMode, ProviderSuite, Renderer, ScriptProvider, VideoProvider};
use base64::Engine;
use reqwest::header::{AUTHORIZATION, HeaderMap, HeaderValue};
use reqwest::{Client, RequestBuilder};
use serde::Deserialize;
use serde_json::{Value, json};
use std::env;
use std::fs;
use std::future::Future;
use std::path::PathBuf;
use std::process::Command;
use std::sync::Arc;
use std::thread;
use std::time::Duration;
use tokio::runtime::{Builder, Handle};

const OPENAI_RESPONSES_URL: &str = "https://api.openai.com/v1/responses";
const GEMINI_BASE_URL: &str = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_VERTEX_REGION: &str = "us-central1";
const DEFAULT_OPENAI_MODEL: &str = "gpt-5.4";
const DEFAULT_GEMINI_SCRIPT_MODEL: &str = "gemini-2.0-flash";
const DEFAULT_GEMINI_MODEL: &str = "veo-3.1-generate-preview";

#[derive(Clone)]
pub struct OpenAiScriptProvider {
    client: Client,
    api_key: String,
    model: String,
}

#[derive(Clone)]
pub struct GoogleScriptProvider {
    client: Client,
    api_key: String,
    model: String,
}

#[derive(Clone)]
pub struct GoogleVideoProvider {
    client: Client,
    mode: GoogleVideoMode,
    model: String,
    project_id: Option<String>,
    region: String,
}

#[derive(Clone)]
enum GoogleVideoMode {
    GeminiApiKey(String),
    VertexAdc,
}

#[derive(Clone, Copy, Default)]
pub struct PassthroughRenderer;

#[derive(Debug, Deserialize)]
struct StructuredScript {
    headline: String,
    logline: String,
    voiceover: String,
    on_screen_text: Vec<String>,
    sections: Vec<StructuredScriptSection>,
}

#[derive(Debug, Deserialize)]
struct StructuredScriptSection {
    heading: String,
    copy: String,
}

pub fn provider_suite_from_env() -> ProviderSuite {
    let http_client = Client::builder()
        .timeout(Duration::from_secs(180))
        .build()
        .unwrap_or_else(|_| Client::new());

    let openai_key = clean_env_var("OPENAI_API_KEY")
        .or_else(|| clean_env_var("OPENAI_KEY"))
        .filter(|value| is_live_credential(value));
    let gemini_key = clean_env_var("GEMINI_API_KEY")
        .or_else(|| clean_env_var("GOOGLE_API_KEY"))
        .filter(|value| is_live_credential(value));
    let has_gemini_key = gemini_key.is_some();
    let project_id = clean_env_var("PROJECT_ID").or_else(|| clean_env_var("GCP_PROJECT_ID"));
    let region = clean_env_var("REGION")
        .or_else(|| clean_env_var("GCP_REGION"))
        .unwrap_or_else(|| DEFAULT_VERTEX_REGION.to_string());
    let openai_model =
        clean_env_var("OPENAI_SCRIPT_MODEL").unwrap_or_else(|| DEFAULT_OPENAI_MODEL.to_string());
    let gemini_script_model = clean_env_var("GEMINI_SCRIPT_MODEL")
        .unwrap_or_else(|| DEFAULT_GEMINI_SCRIPT_MODEL.to_string());
    let gemini_video_model =
        clean_env_var("GEMINI_VIDEO_MODEL").unwrap_or_else(|| DEFAULT_GEMINI_MODEL.to_string());

    let script: Arc<dyn ScriptProvider> = if let Some(api_key) = openai_key.clone() {
        Arc::new(OpenAiScriptProvider {
            client: http_client.clone(),
            api_key,
            model: openai_model,
        })
    } else if let Some(api_key) = gemini_key.clone() {
        Arc::new(GoogleScriptProvider {
            client: http_client.clone(),
            api_key,
            model: gemini_script_model,
        })
    } else {
        ProviderSuite::mock().script
    };

    let video_runtime = if let Some(api_key) = gemini_key.clone() {
        Some((
            ProviderMode::LiveGeminiApi,
            Arc::new(GoogleVideoProvider {
                client: http_client.clone(),
                mode: GoogleVideoMode::GeminiApiKey(api_key),
                model: gemini_video_model.clone(),
                project_id: None,
                region: DEFAULT_VERTEX_REGION.to_string(),
            }) as Arc<dyn VideoProvider>,
        ))
    } else if project_id.is_some() {
        Some((
            ProviderMode::LiveVertex,
            Arc::new(GoogleVideoProvider {
                client: http_client.clone(),
                mode: GoogleVideoMode::VertexAdc,
                model: gemini_video_model,
                project_id,
                region,
            }) as Arc<dyn VideoProvider>,
        ))
    } else {
        None
    };

    let mode = if let Some((mode, _)) = video_runtime.as_ref() {
        *mode
    } else if openai_key.is_some() || has_gemini_key {
        ProviderMode::LiveScriptOnly
    } else {
        ProviderMode::Mock
    };

    let video = video_runtime
        .map(|(_, provider)| provider)
        .unwrap_or_else(|| ProviderSuite::mock().video);

    ProviderSuite {
        mode,
        script,
        video,
        voice: Arc::new(MockVoiceProvider),
        qc: Arc::new(MockQCProvider),
        edit: Arc::new(MockEditPlanner),
        renderer: Arc::new(PassthroughRenderer),
    }
}

impl ScriptProvider for OpenAiScriptProvider {
    fn generate_script(
        &self,
        brief: &CreativeBrief,
        assets: &[InputAsset],
    ) -> ServiceResult<ScriptPackage> {
        let request = json!({
            "model": self.model,
            "input": [
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "input_text",
                            "text": "You are the lead script writer for a premium ad generation workflow. Return JSON only."
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "input_text",
                            "text": build_script_prompt(brief, assets)
                        }
                    ]
                }
            ],
            "text": {
                "format": {
                    "type": "json_schema",
                    "name": "script_package",
                    "strict": true,
                    "schema": {
                        "type": "object",
                        "additionalProperties": false,
                        "properties": {
                            "headline": { "type": "string" },
                            "logline": { "type": "string" },
                            "voiceover": { "type": "string" },
                            "on_screen_text": {
                                "type": "array",
                                "items": { "type": "string" }
                            },
                            "sections": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "additionalProperties": false,
                                    "properties": {
                                        "heading": { "type": "string" },
                                        "copy": { "type": "string" }
                                    },
                                    "required": ["heading", "copy"]
                                }
                            }
                        },
                        "required": ["headline", "logline", "voiceover", "on_screen_text", "sections"]
                    }
                }
            }
        });

        let body = request_json(
            self.client
                .post(OPENAI_RESPONSES_URL)
                .bearer_auth(&self.api_key)
                .json(&request),
            "openai responses",
        )?;
        let output_text = first_output_text(&body).ok_or_else(|| {
            ServiceError::Internal("openai response did not include output text".to_string())
        })?;
        let structured: StructuredScript = serde_json::from_str(&output_text).map_err(|error| {
            ServiceError::Internal(format!("openai response JSON parse failed: {error}"))
        })?;

        Ok(ScriptPackage {
            id: new_id("script"),
            version: 1,
            headline: structured.headline,
            logline: structured.logline,
            voiceover: structured.voiceover,
            on_screen_text: structured.on_screen_text,
            sections: structured
                .sections
                .into_iter()
                .map(|section| ScriptSection {
                    heading: section.heading,
                    copy: section.copy,
                })
                .collect(),
        })
    }
}

impl ScriptProvider for GoogleScriptProvider {
    fn generate_script(
        &self,
        brief: &CreativeBrief,
        assets: &[InputAsset],
    ) -> ServiceResult<ScriptPackage> {
        let prompt = format!(
            "{}\nReturn JSON only with no markdown or commentary. Keep it compact: voiceover under 80 words, max 4 sections, max 4 on_screen_text lines. Use \\\\n for line breaks inside strings. Respond with an object shaped like:\n{{\"headline\":\"\",\"logline\":\"\",\"voiceover\":\"\",\"on_screen_text\":[\"\"],\"sections\":[{{\"heading\":\"\",\"copy\":\"\"}}]}}",
            build_script_prompt(brief, assets)
        );
        let request = json!({
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        { "text": prompt }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 700,
                "responseMimeType": "application/json",
                "thinkingConfig": {
                    "thinkingBudget": 0
                }
            }
        });
        let endpoint = format!(
            "{}/models/{}:generateContent?key={}",
            GEMINI_BASE_URL, self.model, self.api_key
        );
        let body = request_json(self.client.post(endpoint).json(&request), "gemini script")?;
        let output_text = first_gemini_text(&body).ok_or_else(|| {
            ServiceError::Internal("gemini response did not include output text".to_string())
        })?;
        let json_payload = extract_json_payload(&output_text).ok_or_else(|| {
            ServiceError::Internal("gemini response did not include valid JSON".to_string())
        })?;
        let normalized = normalize_json_strings(&json_payload);
        let structured: StructuredScript = serde_json::from_str(&normalized).map_err(|error| {
            ServiceError::Internal(format!("gemini response JSON parse failed: {error}"))
        })?;

        Ok(ScriptPackage {
            id: new_id("script"),
            version: 1,
            headline: structured.headline,
            logline: structured.logline,
            voiceover: structured.voiceover,
            on_screen_text: structured.on_screen_text,
            sections: structured
                .sections
                .into_iter()
                .map(|section| ScriptSection {
                    heading: section.heading,
                    copy: section.copy,
                })
                .collect(),
        })
    }
}

impl VideoProvider for GoogleVideoProvider {
    fn generate_clip(
        &self,
        scene: &SceneSpec,
        aspect_ratio: AspectRatio,
    ) -> ServiceResult<ClipAsset> {
        let prompt = format!(
            "{}. Visual direction: {}. Camera direction: {}. Deliver a premium ad shot with no on-screen text.",
            scene.prompt, scene.visual_direction, scene.camera_direction
        );

        match &self.mode {
            GoogleVideoMode::GeminiApiKey(api_key) => {
                self.generate_with_gemini_key(scene, aspect_ratio, &prompt, api_key)
            }
            GoogleVideoMode::VertexAdc => self.generate_with_vertex(scene, aspect_ratio, &prompt),
        }
    }
}

impl Renderer for PassthroughRenderer {
    fn render_variants(
        &self,
        run: &GenerationRun,
        edit_plan: &EditPlan,
        clips: &[ClipAsset],
    ) -> ServiceResult<Vec<RenderedVariant>> {
        let requested = if run.brief.formats.is_empty() {
            vec![AspectRatio::R9x16, AspectRatio::R1x1, AspectRatio::R16x9]
        } else {
            run.brief.formats.clone()
        };

        let names = ["Performance Cut", "Brand Cut", "Feature Cut", "Platform Cut"];

        requested
            .into_iter()
            .enumerate()
            .map(|(index, ratio)| {
                let clip = find_clip_for_ratio(clips, ratio).ok_or_else(|| {
                    let ratio_label = match ratio {
                        AspectRatio::R9x16 => "9:16",
                        AspectRatio::R1x1 => "1:1",
                        AspectRatio::R16x9 => "16:9",
                    };
                    ServiceError::InvalidRequest(
                        format!("no generated clips available for {ratio_label} rendering"),
                    )
                })?;
                Ok(RenderedVariant {
                    id: new_id("variant"),
                    recipe_id: edit_plan.id.clone(),
                    name: names.get(index).unwrap_or(&"platform_cut").to_string(),
                    aspect_ratio: ratio,
                    uri: clip.uri.clone(),
                    thumbnail_uri: clip.thumbnail_uri.clone(),
                    published: false,
                })
            })
            .collect()
    }
}

impl GoogleVideoProvider {
    fn generate_with_gemini_key(
        &self,
        scene: &SceneSpec,
        aspect_ratio: AspectRatio,
        prompt: &str,
        api_key: &str,
    ) -> ServiceResult<ClipAsset> {
        let endpoint = format!("{GEMINI_BASE_URL}/models/{}:predictLongRunning", self.model);
        let request = json!({
            "instances": [{ "prompt": prompt }],
            "parameters": google_video_parameters(aspect_ratio, scene.duration_seconds),
        });
        let operation = request_json(
            self.client
                .post(endpoint)
                .header("x-goog-api-key", api_key)
                .json(&request),
            "gemini video create",
        )?;

        let operation_name = operation
            .get("name")
            .and_then(Value::as_str)
            .ok_or_else(|| ServiceError::Internal("gemini operation name missing".to_string()))?;

        let final_response = self.poll_google_operation(
            &format!("{GEMINI_BASE_URL}/{operation_name}"),
            GoogleAuth::ApiKey(api_key.to_string()),
        )?;

        self.clip_from_video_response(scene, aspect_ratio, &final_response, Some(api_key), None)
    }

    fn generate_with_vertex(
        &self,
        scene: &SceneSpec,
        aspect_ratio: AspectRatio,
        prompt: &str,
    ) -> ServiceResult<ClipAsset> {
        let project_id = self.project_id.clone().ok_or_else(|| {
            ServiceError::Internal("vertex video generation requires PROJECT_ID".to_string())
        })?;
        let endpoint = format!(
            "https://{}-aiplatform.googleapis.com/v1/projects/{}/locations/{}/publishers/google/models/{}:predictLongRunning",
            self.region, project_id, self.region, self.model
        );
        let token = google_access_token(&self.client)?;
        let request = json!({
            "instances": [{ "prompt": prompt }],
            "parameters": google_video_parameters(aspect_ratio, scene.duration_seconds),
        });
        let operation = request_json(
            self.client
                .post(endpoint)
                .header(AUTHORIZATION, format!("Bearer {token}"))
                .json(&request),
            "vertex video create",
        )?;
        let operation_name = operation
            .get("name")
            .and_then(Value::as_str)
            .ok_or_else(|| ServiceError::Internal("vertex operation name missing".to_string()))?;
        let final_response = self.poll_google_operation(
            &format!(
                "https://{}-aiplatform.googleapis.com/v1/{}",
                self.region, operation_name
            ),
            GoogleAuth::Bearer(token),
        )?;
        self.clip_from_video_response(
            scene,
            aspect_ratio,
            &final_response,
            None,
            Some(&self.region),
        )
    }

    fn poll_google_operation(&self, url: &str, auth: GoogleAuth) -> ServiceResult<Value> {
        for _ in 0..48 {
            let request = self.client.get(url);
            let request = match &auth {
                GoogleAuth::ApiKey(key) => request.header("x-goog-api-key", key),
                GoogleAuth::Bearer(token) => {
                    request.header(AUTHORIZATION, format!("Bearer {token}"))
                }
            };
            let response = request_json(request, "google operation poll")?;
            if response
                .get("done")
                .and_then(Value::as_bool)
                .unwrap_or(false)
            {
                if response.get("error").is_some() {
                    return Err(ServiceError::Internal(format!(
                        "google operation failed: {}",
                        response["error"]
                    )));
                }
                return Ok(response);
            }
            thread::sleep(Duration::from_secs(10));
        }

        Err(ServiceError::Internal(
            "google video generation timed out while polling".to_string(),
        ))
    }

    fn clip_from_video_response(
        &self,
        scene: &SceneSpec,
        aspect_ratio: AspectRatio,
        response: &Value,
        api_key: Option<&str>,
        _region: Option<&str>,
    ) -> ServiceResult<ClipAsset> {
        let video_node = response
            .pointer("/response/generateVideoResponse/generatedSamples/0/video")
            .or_else(|| response.pointer("/response/generatedVideos/0/video"))
            .ok_or_else(|| {
                ServiceError::Internal(
                    "google video response did not contain a video payload".to_string(),
                )
            })?;

        let uri = video_node
            .get("uri")
            .and_then(Value::as_str)
            .map(ToOwned::to_owned);
        let bytes = video_node
            .get("bytesBase64Encoded")
            .and_then(Value::as_str)
            .or_else(|| video_node.get("videoBytes").and_then(Value::as_str));

        let local_uri = if let Some(uri) = uri {
            download_or_return_video_uri(&self.client, &uri, api_key)?
        } else if let Some(encoded) = bytes {
            save_base64_video(encoded, scene.id.as_str())?
        } else {
            return Err(ServiceError::Internal(
                "google video response did not contain a downloadable URI or bytes".to_string(),
            ));
        };

        Ok(ClipAsset {
            id: new_id("clip"),
            scene_id: scene.id.clone(),
            uri: local_uri.clone(),
            thumbnail_uri: local_uri,
            duration_seconds: scene.duration_seconds,
            aspect_ratio,
        })
    }
}

fn find_clip_for_ratio(clips: &[ClipAsset], ratio: AspectRatio) -> Option<&ClipAsset> {
    clips.iter().find(|clip| clip.aspect_ratio == ratio)
}

fn build_script_prompt(brief: &CreativeBrief, assets: &[InputAsset]) -> String {
    let asset_summary = if assets.is_empty() {
        "No uploaded assets were provided yet.".to_string()
    } else {
        assets
            .iter()
            .map(|asset| format!("{} ({})", asset.filename, asset.content_type))
            .collect::<Vec<_>>()
            .join(", ")
    };
    let call_to_action = if brief.call_to_action.trim().is_empty()
        || brief.call_to_action.trim().eq_ignore_ascii_case("optional")
    {
        "None (do not invent one)".to_string()
    } else {
        brief.call_to_action.clone()
    };
    let duration_hint = brief
        .duration_seconds
        .map(|seconds| format!("{seconds}s"))
        .unwrap_or_else(|| "Not specified".to_string());

    format!(
        "Create a premium ad script package for this brief.\nObjective: {}\nAudience: {}\nTone: {}\nTarget duration: {}\nCall to action: {}\nFormats: {}\nAssets: {}\n\nHonor the objective literally. If tone conflicts with the objective, prioritize the objective. Do not invent unrelated products, brands, or industries.\n\nReturn a disciplined script with one clear headline, a concise logline, a natural voiceover paragraph, 3 to 5 on-screen text lines, and 3 sections (Hook, Body, Close). Keep it commercially useful and avoid mentioning model providers.",
        brief.objective,
        brief.audience,
        brief.tone,
        duration_hint,
        call_to_action,
        brief
            .formats
            .iter()
            .map(|format| match format {
                AspectRatio::R16x9 => "16:9",
                AspectRatio::R1x1 => "1:1",
                AspectRatio::R9x16 => "9:16",
            })
            .collect::<Vec<_>>()
            .join(", "),
        asset_summary
    )
}

fn google_video_parameters(aspect_ratio: AspectRatio, duration_seconds: u32) -> Value {
    let duration = duration_seconds.clamp(5, 8);
    json!({
        "aspectRatio": match aspect_ratio {
            AspectRatio::R9x16 => "9:16",
            AspectRatio::R1x1 => "1:1",
            AspectRatio::R16x9 => "16:9",
        },
        "durationSeconds": duration,
        "sampleCount": 1,
        "resolution": "720p"
    })
}

fn run_async<F, T>(future: F) -> ServiceResult<T>
where
    F: Future<Output = ServiceResult<T>>,
{
    if let Ok(handle) = Handle::try_current() {
        tokio::task::block_in_place(|| handle.block_on(future))
    } else {
        Builder::new_current_thread()
            .enable_all()
            .build()
            .map_err(|error| {
                ServiceError::Internal(format!("tokio runtime build failed: {error}"))
            })?
            .block_on(future)
    }
}

fn request_json(request: RequestBuilder, context: &str) -> ServiceResult<Value> {
    run_async(async move {
        let response = request.send().await.map_err(|error| {
            ServiceError::Internal(format!("{context} request failed: {error}"))
        })?;
        parse_json_response(response, context).await
    })
}

async fn parse_json_response(response: reqwest::Response, context: &str) -> ServiceResult<Value> {
    let status = response.status();
    let body = response.text().await.map_err(|error| {
        ServiceError::Internal(format!("{context} response read failed: {error}"))
    })?;

    if !status.is_success() {
        return Err(ServiceError::Internal(format!(
            "{context} request failed with {status}: {body}"
        )));
    }

    serde_json::from_str(&body).map_err(|error| {
        ServiceError::Internal(format!("{context} response JSON parse failed: {error}"))
    })
}

fn first_output_text(body: &Value) -> Option<String> {
    body.get("output")
        .and_then(Value::as_array)
        .and_then(|items| {
            items.iter().find_map(|item| {
                item.get("content")
                    .and_then(Value::as_array)
                    .and_then(|content| {
                        content.iter().find_map(|part| {
                            part.get("text")
                                .and_then(Value::as_str)
                                .map(ToOwned::to_owned)
                        })
                    })
            })
        })
}

fn first_gemini_text(body: &Value) -> Option<String> {
    let parts = body
        .get("candidates")
        .and_then(Value::as_array)
        .and_then(|items| items.first())
        .and_then(|item| item.get("content"))
        .and_then(|content| content.get("parts"))
        .and_then(Value::as_array)?;
    let mut combined = String::new();
    for part in parts {
        if let Some(text) = part.get("text").and_then(Value::as_str) {
            combined.push_str(text);
        }
    }
    if combined.trim().is_empty() {
        None
    } else {
        Some(combined)
    }
}

fn strip_code_fences(text: &str) -> String {
    let trimmed = text.trim();
    if let Some(stripped) = trimmed.strip_prefix("```") {
        let stripped = stripped
            .trim_start_matches("json")
            .trim_start_matches('\n')
            .trim_end_matches("```");
        return stripped.trim().to_string();
    }
    trimmed.to_string()
}

fn extract_json_payload(text: &str) -> Option<String> {
    let cleaned = strip_code_fences(text);
    if serde_json::from_str::<Value>(&cleaned).is_ok() {
        return Some(cleaned);
    }
    let start = cleaned.find('{')?;
    let end = cleaned.rfind('}')?;
    if end <= start {
        return None;
    }
    let slice = &cleaned[start..=end];
    if serde_json::from_str::<Value>(slice).is_ok() {
        Some(slice.to_string())
    } else {
        None
    }
}

fn normalize_json_strings(input: &str) -> String {
    let mut out = String::with_capacity(input.len() + 8);
    let mut in_string = false;
    let mut escape = false;
    for ch in input.chars() {
        if in_string {
            if escape {
                out.push(ch);
                escape = false;
                continue;
            }
            match ch {
                '\\' => {
                    out.push(ch);
                    escape = true;
                }
                '"' => {
                    out.push(ch);
                    in_string = false;
                }
                '\n' => out.push_str("\\n"),
                '\r' => out.push_str("\\r"),
                _ => out.push(ch),
            }
        } else if ch == '"' {
            in_string = true;
            out.push(ch);
        } else {
            out.push(ch);
        }
    }
    out
}


fn google_access_token(client: &Client) -> ServiceResult<String> {
    if let Ok(token) = metadata_access_token(client) {
        return Ok(token);
    }

    let output = Command::new("gcloud")
        .args(["auth", "print-access-token"])
        .output()
        .map_err(|error| {
            ServiceError::Internal(format!("failed to invoke gcloud for access token: {error}"))
        })?;

    if !output.status.success() {
        return Err(ServiceError::Internal(format!(
            "gcloud auth print-access-token failed: {}",
            String::from_utf8_lossy(&output.stderr)
        )));
    }

    let token = String::from_utf8_lossy(&output.stdout).trim().to_string();
    if token.is_empty() {
        Err(ServiceError::Internal(
            "gcloud returned an empty access token".to_string(),
        ))
    } else {
        Ok(token)
    }
}

fn metadata_access_token(client: &Client) -> ServiceResult<String> {
    let mut headers = HeaderMap::new();
    headers.insert("Metadata-Flavor", HeaderValue::from_static("Google"));
    let body = request_json(
        client
            .get("http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token")
            .headers(headers),
        "metadata token",
    )?;
    body.get("access_token")
        .and_then(Value::as_str)
        .map(ToOwned::to_owned)
        .ok_or_else(|| {
            ServiceError::Internal("metadata token response missing access_token".to_string())
        })
}

fn download_or_return_video_uri(
    client: &Client,
    uri: &str,
    api_key: Option<&str>,
) -> ServiceResult<String> {
    if uri.starts_with("http://") || uri.starts_with("https://") {
        let mut request = client.get(uri);
        if let Some(key) = api_key {
            request = request.header("x-goog-api-key", key);
        }
        let maybe_bytes = run_async(async move {
            let response = request.send().await.map_err(|error| {
                ServiceError::Internal(format!("google video download failed: {error}"))
            })?;
            if !response.status().is_success() {
                return Ok(None);
            }
            let bytes = response.bytes().await.map_err(|error| {
                ServiceError::Internal(format!("google video byte download failed: {error}"))
            })?;
            Ok(Some(bytes.to_vec()))
        })?;
        if let Some(bytes) = maybe_bytes {
            let path = write_video_file(bytes.as_ref(), "clip")?;
            return Ok(file_uri_for_path(&path));
        }
    }

    Ok(uri.to_string())
}

fn save_base64_video(encoded: &str, prefix: &str) -> ServiceResult<String> {
    let bytes = base64::engine::general_purpose::STANDARD
        .decode(encoded)
        .map_err(|error| ServiceError::Internal(format!("video base64 decode failed: {error}")))?;
    let safe_prefix = if prefix.trim().is_empty() { "clip" } else { "clip" };
    let path = write_video_file(&bytes, safe_prefix)?;
    Ok(file_uri_for_path(&path))
}

fn write_video_file(bytes: &[u8], prefix: &str) -> ServiceResult<PathBuf> {
    let root = media_root_dir();
    fs::create_dir_all(&root)
        .map_err(|error| ServiceError::Internal(format!("video directory create failed: {error}")))?;
    let path = root.join(format!("{}.mp4", new_id(prefix)));
    fs::write(&path, bytes)
        .map_err(|error| ServiceError::Internal(format!("video write failed: {error}")))?;
    Ok(path)
}

fn file_uri_for_path(path: &PathBuf) -> String {
    if let Ok(base) = env::var("AETHER_MEDIA_BASE_URL") {
        if let Some(filename) = path.file_name().and_then(|name| name.to_str()) {
            return format!("{}/{}", base.trim_end_matches('/'), filename);
        }
    }
    format!("file://{}", path.display())
}

fn media_root_dir() -> PathBuf {
    env::var("AETHER_MEDIA_DIR")
        .map(PathBuf::from)
        .unwrap_or_else(|_| env::temp_dir().join("aether-media"))
}

fn is_live_credential(value: &str) -> bool {
    !value.trim().is_empty() && !value.starts_with("REPLACE_")
}

fn clean_env_var(key: &str) -> Option<String> {
    env::var(key)
        .ok()
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty())
}

enum GoogleAuth {
    ApiKey(String),
    Bearer(String),
}
