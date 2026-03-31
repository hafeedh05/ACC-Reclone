"use server";

import { redirect } from "next/navigation";
import {
  approveScript,
  approveStoryboard,
  regenerateScript,
  regenerateStoryboard,
} from "@/lib/aether-api";
import { requireSession } from "@/lib/auth";

function getRunId(formData: FormData) {
  return String(formData.get("runId") ?? "").trim();
}

export async function approveScriptAction(formData: FormData) {
  await requireSession();
  const runId = getRunId(formData);
  if (!runId) {
    redirect("/app/command-center");
  }
  const run = await approveScript(runId);
  if (!run) {
    redirect(`/app/command-center?run=${runId}&error=failed`);
  }
  redirect(`/app/command-center?run=${runId}`);
}

export async function regenerateScriptAction(formData: FormData) {
  await requireSession();
  const runId = getRunId(formData);
  if (!runId) {
    redirect("/app/command-center");
  }
  const run = await regenerateScript(runId);
  if (!run) {
    redirect(`/app/command-center?run=${runId}&error=failed`);
  }
  redirect(`/app/command-center?run=${runId}`);
}

export async function approveStoryboardAction(formData: FormData) {
  await requireSession();
  const runId = getRunId(formData);
  if (!runId) {
    redirect("/app/command-center");
  }
  const run = await approveStoryboard(runId);
  if (!run) {
    redirect(`/app/command-center?run=${runId}&error=failed`);
  }
  redirect(`/app/command-center?run=${runId}`);
}

export async function regenerateStoryboardAction(formData: FormData) {
  await requireSession();
  const runId = getRunId(formData);
  if (!runId) {
    redirect("/app/command-center");
  }
  const run = await regenerateStoryboard(runId);
  if (!run) {
    redirect(`/app/command-center?run=${runId}&error=failed`);
  }
  redirect(`/app/command-center?run=${runId}`);
}
