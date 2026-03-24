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

function apiBaseUrl() {
  return (
    process.env.AD_COMMAND_CENTER_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "https://ad-command-center-dev-api-k66jrtxjhq-uc.a.run.app"
  );
}

async function readJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${apiBaseUrl()}${path}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
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
