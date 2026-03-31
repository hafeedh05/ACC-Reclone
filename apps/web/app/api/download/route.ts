import { NextRequest, NextResponse } from "next/server";

function sanitizeFilename(value: string) {
  return value
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function isAllowedUri(uri: string) {
  const allowedPrefixes = [
    "http://127.0.0.1:8080/media/",
    "http://localhost:8080/media/",
  ];
  return allowedPrefixes.some((prefix) => uri.startsWith(prefix));
}

export async function GET(request: NextRequest) {
  const uri = request.nextUrl.searchParams.get("uri");
  const name = request.nextUrl.searchParams.get("name") || "aether-clip.mp4";

  if (!uri || !isAllowedUri(uri)) {
    return NextResponse.json({ error: "Invalid download request." }, { status: 400 });
  }

  const response = await fetch(uri, { cache: "no-store" });
  if (!response.ok) {
    return NextResponse.json({ error: "Unable to fetch media." }, { status: response.status });
  }

  const contentType = response.headers.get("content-type") || "video/mp4";
  const buffer = await response.arrayBuffer();
  const safeName = sanitizeFilename(name) || "aether-clip.mp4";

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "Cache-Control": "no-store",
    },
  });
}
