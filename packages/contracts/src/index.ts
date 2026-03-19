export const generationStages = [
  "ingest",
  "normalize",
  "writers_room",
  "storyboard",
  "clip_generation",
  "clip_qc",
  "edit_planning",
  "assembly",
  "delivery",
] as const;

export type GenerationStage = (typeof generationStages)[number];

export const aspectRatios = ["r16x9", "r1x1", "r9x16"] as const;

export type AspectRatio = (typeof aspectRatios)[number];

export const runStatuses = [
  "draft",
  "awaiting_script_approval",
  "awaiting_storyboard_approval",
  "running",
  "partial_success",
  "completed",
  "failed",
  "cancelled",
] as const;

export type RunStatus = (typeof runStatuses)[number];

export type RunEvent = {
  event_id: string;
  run_id: string;
  project_id: string;
  stage: GenerationStage;
  step: string;
  status: string;
  attempt: number;
  actor: string;
  artifact_ids: string[];
  message: string;
  progress: number;
  emitted_at: string;
  metrics?: Record<string, string | number>;
};

export type CreateProjectRequest = {
  workspace_id: string;
  name: string;
  description?: string;
};

export type PrepareUploadRequest = {
  filename: string;
  content_type: string;
};

export type PreparedUpload = {
  asset_id: string;
  upload_url: string;
  download_url: string;
};

export type CreateRunRequest = {
  project_id: string;
  objective: string;
  audience: string;
  tone: string;
  call_to_action: string;
  formats: AspectRatio[];
};

export type RenderedVariant = {
  id: string;
  recipe_id: string;
  name: string;
  aspect_ratio: AspectRatio;
  uri: string;
  thumbnail_uri: string;
  published: boolean;
};
