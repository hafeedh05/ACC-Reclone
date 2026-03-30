"use server";

import { redirect } from "next/navigation";
import { createRun, type AspectRatio } from "@/lib/aether-api";
import { requireSession } from "@/lib/auth";

const allowedFormats: AspectRatio[] = ["r9x16", "r1x1", "r16x9"];
const defaultFormats: AspectRatio[] = ["r9x16"];

function parseFormats(formData: FormData) {
  const selected = formData
    .getAll("formats")
    .map((value) => String(value))
    .filter((value): value is AspectRatio => allowedFormats.includes(value as AspectRatio));

  return selected.length ? selected : defaultFormats;
}

export async function createRunAction(formData: FormData) {
  await requireSession();
  const projectId = String(formData.get("projectId") ?? "").trim();
  const objective = String(formData.get("objective") ?? "").trim();
  const audience = String(formData.get("audience") ?? "").trim();
  const tone = String(formData.get("tone") ?? "").trim();
  const callToAction = String(formData.get("call_to_action") ?? "").trim();

  if (!projectId || !objective) {
    redirect(`/app/projects/${projectId || ""}?view=brief&error=missing`);
  }

  const run = await createRun({
    projectId,
    objective,
    audience: audience || "General audience",
    tone: tone || "Premium, calm, controlled",
    callToAction: callToAction || "Learn more",
    formats: parseFormats(formData),
  });

  if (!run) {
    redirect(`/app/projects/${projectId}?view=brief&error=failed`);
  }

  redirect(`/app/command-center?run=${run.id}`);
}
