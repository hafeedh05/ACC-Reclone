import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const metric = await request.json().catch(() => null);

  if (metric) {
    console.info("[web-vitals]", JSON.stringify(metric));
  }

  return new NextResponse(null, { status: 204 });
}
