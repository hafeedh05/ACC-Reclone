import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createPublicPageMetadata } from "../seo";
import { createSession, getSession } from "@/lib/auth";

export const metadata: Metadata = createPublicPageMetadata({
  title: "Sign in",
  description: "Sign in to your Aether Hyve workspace.",
  canonicalPath: "/sign-in",
});

async function signInAction(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!name || !email || !email.includes("@")) {
    redirect("/sign-in?error=invalid");
  }

  await createSession({ name, email });
  redirect("/app");
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (session) {
    redirect("/app");
  }

  const { error } = await searchParams;

  return (
    <main className="aether-auth-page" id="main-content">
      <section className="aether-auth-hero">
        <p className="aether-kicker">AETHER HYVE</p>
        <h1>Sign in to the platform.</h1>
        <p>
          Every workspace is scoped to the signed-in operator. Projects, approvals, and live runs
          stay tied to that account.
        </p>
        <div className="aether-auth-hero__proof">
          <span>User-scoped workspace</span>
          <span>Protected command center</span>
          <span>Live generation pipeline</span>
        </div>
      </section>

      <section className="aether-auth-card">
        <div className="aether-auth-card__head">
          <h2>Workspace access</h2>
          <p>Use your name and work email to enter the platform.</p>
        </div>

        {error === "invalid" ? (
          <p className="aether-auth-error">Enter a valid name and email address.</p>
        ) : null}

        <form action={signInAction} className="aether-auth-form">
          <label>
            <span>Name</span>
            <input name="name" type="text" placeholder="Ahmad Youssef" required />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" placeholder="ahmad@hyvelabs.tech" required />
          </label>
          <button type="submit" className="aether-btn aether-btn--primary">
            Enter workspace
          </button>
        </form>

        <div className="aether-auth-card__meta">
          <Link href="/">Back to marketing site</Link>
          <Link href="/pricing">Review pricing</Link>
        </div>
      </section>
    </main>
  );
}
