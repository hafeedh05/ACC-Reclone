import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!name || !email || !email.includes("@")) {
    return NextResponse.redirect(new URL("/sign-in?error=invalid", request.url));
  }

  await createSession({ name, email });
  return NextResponse.redirect(new URL("/app", request.url));
}
