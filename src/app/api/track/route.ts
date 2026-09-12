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

function detectBrowser(userAgent: string): string {
  const u = userAgent.toLowerCase();
  if (u.includes("edg/")) return "Edge";
  if (u.includes("opr/") || u.includes("opera")) return "Opera";
  if (u.includes("chrome")) return "Chrome";
  if (u.includes("firefox")) return "Firefox";
  if (u.includes("safari")) return "Safari";
  return "অন্যান্য";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    // Client IP comes from Vercel's proxy headers; geo comes from Vercel's own
    // geolocation headers (no third-party API involved).
    const forwarded = request.headers.get("x-forwarded-for");
    const rawIp =
      forwarded?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;
    const country = safeText(request.headers.get("x-vercel-ip-country"), 10);
    const region = safeText(
      request.headers.get("x-vercel-ip-country-region"),
      100
    );
    const city = safeText(request.headers.get("x-vercel-ip-city"), 150);

    const salt = process.env.TRACKING_SALT || "aibasync-default-salt";
    const ipHash = rawIp
      ? createHash("sha256").update(rawIp + salt).digest("hex")
      : null;

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
      ipAddress: rawIp,
      country,
      region,
      city,
      ipHash,
      userAgent: userAgent.slice(0, 500) || null,
      deviceType: detectDevice(userAgent),
      browser: detectBrowser(userAgent),
      referrer,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[track] failed to record event", error);
    // Fail open — analytics must never break the app.
    return new NextResponse(null, { status: 204 });
  }
}
