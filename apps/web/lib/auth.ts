import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "aether_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export type PlatformSession = {
  name: string;
  email: string;
  workspaceId: string;
};

function base64UrlEncode(value: string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return Buffer.from(padded, "base64").toString("utf8");
}

function sessionSecret() {
  return process.env.JWT_SECRET ?? "local-dev-aether-session-secret";
}

function sign(payload: string) {
  return crypto
    .createHmac("sha256", sessionSecret())
    .update(payload)
    .digest("base64url");
}

export function workspaceIdForEmail(email: string) {
  const digest = crypto
    .createHash("sha256")
    .update(email.trim().toLowerCase())
    .digest("hex");
  return `ws_${digest.slice(0, 24)}`;
}

function encodeSession(session: PlatformSession) {
  const payload = base64UrlEncode(JSON.stringify(session));
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

function decodeSession(token: string): PlatformSession | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  if (sign(payload) !== signature) {
    return null;
  }

  try {
    const parsed = JSON.parse(base64UrlDecode(payload)) as PlatformSession;
    if (!parsed.email || !parsed.name || !parsed.workspaceId) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  return decodeSession(token);
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }
  return session;
}

export async function createSession(input: { name: string; email: string }) {
  const cookieStore = await cookies();
  const session: PlatformSession = {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    workspaceId: workspaceIdForEmail(input.email),
  };

  cookieStore.set(SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return session;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
