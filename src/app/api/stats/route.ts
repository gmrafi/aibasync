import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { fetchStats } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is not configured" },
      { status: 500 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    password?: unknown;
  };
  const provided = typeof body.password === "string" ? body.password : "";

  if (!provided || !safeEqual(provided, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stats = await fetchStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("[stats] query failed", error);
    return NextResponse.json(
      { error: "Database query failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method Not Allowed — use POST with your password" },
    { status: 405 }
  );
}
