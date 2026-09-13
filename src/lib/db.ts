import { neon } from "@neondatabase/serverless";

type NeonSql = ReturnType<typeof neon>;

let client: NeonSql | null = null;

function getSql(): NeonSql {
  if (!client) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not configured");
    }
    client = neon(connectionString);
  }
  return client;
}

export interface TrackingEventInsert {
  eventType: string;
  name: string | null;
  batch: string | null;
  majorOrSection: string | null;
  minor: string | null;
  role: string | null;
  teacherCode: string | null;
  ipAddress: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  ipHash: string | null;
  userAgent: string | null;
  deviceType: string | null;
  browser: string | null;
  referrer: string | null;
}

export async function insertTrackingEvent(
  input: TrackingEventInsert
): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO tracking_events (
      event_type, name, batch, major_or_section, minor, role,
      teacher_code, ip_address, country, region, city, ip_hash,
      user_agent, device_type, browser, referrer
    ) VALUES (
      ${input.eventType}, ${input.name}, ${input.batch}, ${input.majorOrSection},
      ${input.minor}, ${input.role}, ${input.teacherCode}, ${input.ipAddress},
      ${input.country}, ${input.region}, ${input.city}, ${input.ipHash},
      ${input.userAgent}, ${input.deviceType}, ${input.browser}, ${input.referrer}
    )
  `;
}

export function referrerHost(referrer: string | null): string | null {
  if (!referrer) return null;
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return referrer.slice(0, 80);
  }
}

/** Aggregate stats for the /admin dashboard. */
export async function fetchStats() {
  const sql = getSql();

  const [total, today, daysActive, byBatch, byMajor, byRole, byDevice, byBrowser, byReferrer, byEvent, daily, hourly, keyCounts, visitors, recent] =
    await Promise.all([
      sql`SELECT count(*)::int AS count FROM tracking_events`,
      sql`SELECT count(*)::int AS count FROM tracking_events WHERE created_at >= date_trunc('day', now())`,
      sql`SELECT count(DISTINCT (created_at AT TIME ZONE 'Asia/Dhaka')::date)::int AS count FROM tracking_events`,
      sql`SELECT batch, count(*)::int AS count FROM tracking_events GROUP BY batch ORDER BY count(*) DESC LIMIT 12`,
      sql`SELECT major_or_section, count(*)::int AS count FROM tracking_events WHERE major_or_section IS NOT NULL GROUP BY major_or_section ORDER BY count(*) DESC LIMIT 12`,
      sql`SELECT role, count(*)::int AS count FROM tracking_events GROUP BY role ORDER BY count(*) DESC`,
      sql`SELECT device_type, count(*)::int AS count FROM tracking_events GROUP BY device_type ORDER BY count(*) DESC`,
      sql`SELECT browser, count(*)::int AS count FROM tracking_events WHERE browser IS NOT NULL GROUP BY browser ORDER BY count(*) DESC`,
      sql`SELECT referrer, count(*)::int AS count FROM tracking_events WHERE referrer IS NOT NULL GROUP BY referrer ORDER BY count(*) DESC LIMIT 8`,
      sql`SELECT event_type, count(*)::int AS count FROM tracking_events GROUP BY event_type ORDER BY count(*) DESC`,
      sql`SELECT to_char(created_at AT TIME ZONE 'Asia/Dhaka', 'YYYY-MM-DD') AS day, count(*)::int AS count
          FROM tracking_events
          WHERE created_at >= now() - interval '14 days'
          GROUP BY day ORDER BY day ASC`,
      sql`SELECT to_char(created_at AT TIME ZONE 'Asia/Dhaka', 'HH24') AS hour, count(*)::int AS count
          FROM tracking_events
          WHERE created_at >= now() - interval '7 days'
          GROUP BY hour ORDER BY hour ASC`,
      sql`SELECT COALESCE(ip_address, ip_hash) AS key, count(*)::int AS c
          FROM tracking_events
          WHERE COALESCE(ip_address, ip_hash) IS NOT NULL
          GROUP BY key`,
      sql`SELECT ip_address, max(name) AS name, max(batch) AS batch,
                 max(country) AS country, max(region) AS region, max(city) AS city,
                 count(*)::int AS visits,
                 min(created_at) AS first_seen, max(created_at) AS last_seen
          FROM tracking_events
          WHERE ip_address IS NOT NULL
          GROUP BY ip_address
          ORDER BY last_seen DESC LIMIT 25`,
      sql`SELECT id, name, batch, major_or_section, role, device_type, browser,
                 ip_address, country, region, city, created_at
          FROM tracking_events ORDER BY id DESC LIMIT 25`,
    ]);

  const keys = keyCounts as unknown as { key: string; c: number }[];
  const uniqueVisitors = keys.length;
  const newVisitors = keys.filter((k) => k.c === 1).length;
  const returningVisitors = keys.filter((k) => k.c > 1).length;

  return {
    total: (total as unknown as { count: number }[])[0]?.count ?? 0,
    uniqueVisitors,
    newVisitors,
    returningVisitors,
    today: (today as unknown as { count: number }[])[0]?.count ?? 0,
    daysActive: (daysActive as unknown as { count: number }[])[0]?.count ?? 0,
    byBatch: byBatch as unknown as { batch: string | null; count: number }[],
    byMajor: byMajor as unknown as { major_or_section: string | null; count: number }[],
    byRole: byRole as unknown as { role: string | null; count: number }[],
    byDevice: byDevice as unknown as { device_type: string | null; count: number }[],
    byBrowser: byBrowser as unknown as { browser: string | null; count: number }[],
    byReferrer: (byReferrer as unknown as { referrer: string | null; count: number }[]).map(
      (r) => ({ referrer: referrerHost(r.referrer), count: r.count })
    ),
    byEvent: byEvent as unknown as { event_type: string | null; count: number }[],
    daily: daily as unknown as { day: string; count: number }[],
    hourly: hourly as unknown as { hour: string; count: number }[],
    visitors: visitors as unknown as {
      ip_address: string | null;
      name: string | null;
      batch: string | null;
      country: string | null;
      region: string | null;
      city: string | null;
      visits: number;
      first_seen: string;
      last_seen: string;
    }[],
    recent: recent as unknown as {
      id: number;
      name: string | null;
      batch: string | null;
      major_or_section: string | null;
      role: string | null;
      device_type: string | null;
      browser: string | null;
      ip_address: string | null;
      country: string | null;
      region: string | null;
      city: string | null;
      created_at: string;
    }[],
  };
}
