type AdminOverview = {
  active_runs: number;
  queued_jobs: number;
  failed_jobs: number;
};

type AdminSummary = {
  project_count: number;
  run_count: number;
  event_count: number;
  variant_count: number;
};

export type WorkspaceProject = {
  id: string;
  workspace_id: string;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
};

export type AspectRatio = "r16x9" | "r1x1" | "r9x16";

export type WorkflowStage =
  | "ingest"
  | "normalize"
  | "writers_room"
  | "storyboard"
  | "clip_generation"
  | "clip_qc"
  | "edit_planning"
  | "assembly"
  | "delivery";

export type RunStatus =
  | "draft"
  | "awaiting_script_approval"
  | "awaiting_storyboard_approval"
  | "running"
  | "partial_success"
  | "completed"
  | "failed"
  | "cancelled";

export type ScriptSection = {
  heading: string;
  copy: string;
};

export type ScriptPackage = {
  id: string;
  version: number;
  headline: string;
  logline: string;
  voiceover: string;
  on_screen_text: string[];
  sections: ScriptSection[];
};

export type SceneSpec = {
  id: string;
  index: number;
  duration_seconds: number;
  visual_direction: string;
  camera_direction: string;
  prompt: string;
};

export type StoryboardDraft = {
  id: string;
  version: number;
  scenes: SceneSpec[];
};

export type GenerationRun = {
  id: string;
  project_id: string;
  workspace_id: string;
  status: RunStatus;
  stage: WorkflowStage;
  brief: {
    objective: string;
    audience: string;
    tone: string;
    call_to_action: string;
    duration_seconds?: number | null;
    formats: AspectRatio[];
  };
  script?: ScriptPackage | null;
  storyboard?: StoryboardDraft | null;
  created_at: string;
  updated_at: string;
};

export type RunEvent = {
  event_id: string;
  run_id: string;
  project_id: string;
  stage: WorkflowStage;
  step: string;
  status: string;
  attempt: number;
  actor: string;
  message: string;
  progress: number;
  emitted_at: string;
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

function apiBaseUrl() {
  if (process.env.NODE_ENV !== "production") {
    return "http://127.0.0.1:8080";
  }
  if (process.env.AD_COMMAND_CENTER_API_URL) {
    return process.env.AD_COMMAND_CENTER_API_URL;
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  return "https://ad-command-center-dev-api-k66jrtxjhq-uc.a.run.app";
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs = 8000,
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

async function readJson<T>(path: string): Promise<T | null> {
  const base = apiBaseUrl();
  const candidates = base.includes("localhost")
    ? [base, base.replace("localhost", "127.0.0.1")]
    : [base];

  for (const origin of candidates) {
    try {
      const response = await fetchWithTimeout(`${origin}${path}`, {
        cache: "no-store",
        next: { revalidate: 0 },
      });

      if (!response.ok) {
        continue;
      }

      return (await response.json()) as T;
    } catch {
      // try next origin
    }
  }

  return null;
}

async function writeJson<T>(path: string, payload: unknown): Promise<T | null> {
  const base = apiBaseUrl();
  const candidates = base.includes("localhost")
    ? [base, base.replace("localhost", "127.0.0.1")]
    : [base];

  for (const origin of candidates) {
    try {
      const response = await fetchWithTimeout(`${origin}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      if (!response.ok) {
        continue;
      }

      return (await response.json()) as T;
    } catch {
      // try next origin
    }
  }

  return null;
}

export async function getAdminSnapshot() {
  const [overview, summary] = await Promise.all([
    readJson<AdminOverview>("/v1/admin/overview"),
    readJson<AdminSummary>("/v1/admin/summary"),
  ]);

  return {
    overview: overview ?? {
      active_runs: 0,
      queued_jobs: 0,
      failed_jobs: 0,
    },
    summary: summary ?? {
      project_count: 0,
      run_count: 0,
      event_count: 0,
      variant_count: 0,
    },
  };
}

export async function getWorkspaceProjects(workspaceId: string) {
  const projects = (await readJson<WorkspaceProject[]>("/v1/projects")) ?? [];
  return projects
    .filter((project) => project.workspace_id === workspaceId)
    .sort((left, right) => right.updated_at.localeCompare(left.updated_at));
}

export async function getWorkspaceProject(projectId: string, workspaceId: string) {
  const projects = await getWorkspaceProjects(workspaceId);
  return projects.find((project) => project.id === projectId) ?? null;
}

export async function createWorkspaceProject(input: {
  workspaceId: string;
  name: string;
  description?: string;
}) {
  return writeJson<WorkspaceProject>("/v1/projects", {
    workspace_id: input.workspaceId,
    name: input.name,
    description: input.description?.trim() || null,
  });
}

export async function createRun(input: {
  projectId: string;
  objective: string;
  audience: string;
  tone: string;
  callToAction: string;
  durationSeconds?: number;
  formats: AspectRatio[];
}) {
  return writeJson<GenerationRun>("/v1/runs", {
    project_id: input.projectId,
    objective: input.objective,
    audience: input.audience,
    tone: input.tone,
    call_to_action: input.callToAction,
    duration_seconds: input.durationSeconds ?? null,
    formats: input.formats,
  });
}

export async function listRuns() {
  return readJson<GenerationRun[]>("/v1/runs");
}

export async function getRun(runId: string) {
  return readJson<GenerationRun>(`/v1/runs/${runId}`);
}

export async function approveScript(runId: string) {
  return writeJson<GenerationRun>(`/v1/runs/${runId}/approve-script`, {});
}

export async function regenerateScript(runId: string) {
  return writeJson<GenerationRun>(`/v1/runs/${runId}/regenerate-script`, {});
}

export async function approveStoryboard(runId: string) {
  return writeJson<GenerationRun>(`/v1/runs/${runId}/approve-storyboard`, {});
}

export async function regenerateStoryboard(runId: string) {
  return writeJson<GenerationRun>(`/v1/runs/${runId}/regenerate-storyboard`, {});
}

export async function listRunEvents(runId: string) {
  return readJson<RunEvent[]>(`/v1/runs/${runId}/events`);
}

export async function listRunVariants(runId: string) {
  return readJson<RenderedVariant[]>(`/v1/runs/${runId}/variants`);
}
