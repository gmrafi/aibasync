import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { insertTrackingEvent } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeText(value: unknown, maxLength = 300): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, maxLength);
  return trimmed.length > 0 ? trimmed : null;
}

function detectDevice(userAgent: string): string {
  if (/iPad|Tablet/i.test(userAgent)) return "tablet";
  if (/Mobi|iPhone|Android|Phone/i.test(userAgent)) return "mobile";
  return "desktop";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    // Real client IP comes from x-forwarded-for on Vercel.
    const forwarded = request.headers.get("x-forwarded-for");
    const rawIp =
      forwarded?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const salt = process.env.TRACKING_SALT || "aibasync-default-salt";
    const ipHash = createHash("sha256")
      .update(rawIp + salt)
      .digest("hex");

    const userAgent = request.headers.get("user-agent") || "";
    const referrer = safeText(request.headers.get("referer"), 500);

    await insertTrackingEvent({
      eventType: safeText(body.event, 50) || "routine_view",
      name: safeText(body.name, 200),
      batch: safeText(body.batch, 100),
      majorOrSection: safeText(body.majorOrSection, 100),
      minor: safeText(body.minor, 100),
      role: safeText(body.role, 50),
      teacherCode: safeText(body.teacherCode, 50),
      ipHash,
      userAgent: userAgent.slice(0, 500) || null,
      deviceType: detectDevice(userAgent),
      referrer,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[track] failed to record event", error);
    // Fail open — analytics must never break the app.
    return new NextResponse(null, { status: 204 });
  }
}
