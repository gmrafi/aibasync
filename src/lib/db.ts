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
  ipHash: string | null;
  userAgent: string | null;
  deviceType: string | null;
  referrer: string | null;
}

export async function insertTrackingEvent(
  input: TrackingEventInsert
): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO tracking_events (
      event_type, name, batch, major_or_section, minor, role,
      teacher_code, ip_hash, user_agent, device_type, referrer
    ) VALUES (
      ${input.eventType}, ${input.name}, ${input.batch}, ${input.majorOrSection},
      ${input.minor}, ${input.role}, ${input.teacherCode}, ${input.ipHash},
      ${input.userAgent}, ${input.deviceType}, ${input.referrer}
    )
  `;
}

/** Aggregate stats for the /admin dashboard. */
export async function fetchStats() {
  const sql = getSql();

  const [
    total,
    uniqueVisitors,
    today,
    daysActive,
    byBatch,
    byMajor,
    byRole,
    byDevice,
    daily,
    recent,
  ] = await Promise.all([
    sql`SELECT count(*)::int AS count FROM tracking_events`,
    sql`SELECT count(DISTINCT ip_hash)::int AS count FROM tracking_events WHERE ip_hash IS NOT NULL`,
    sql`SELECT count(*)::int AS count FROM tracking_events WHERE created_at >= date_trunc('day', now())`,
    sql`SELECT count(DISTINCT (created_at AT TIME ZONE 'Asia/Dhaka')::date)::int AS count FROM tracking_events`,
    sql`SELECT batch, count(*)::int AS count FROM tracking_events GROUP BY batch ORDER BY count(*) DESC LIMIT 12`,
    sql`SELECT major_or_section, count(*)::int AS count FROM tracking_events WHERE major_or_section IS NOT NULL GROUP BY major_or_section ORDER BY count(*) DESC LIMIT 12`,
    sql`SELECT role, count(*)::int AS count FROM tracking_events GROUP BY role ORDER BY count(*) DESC`,
    sql`SELECT device_type, count(*)::int AS count FROM tracking_events GROUP BY device_type ORDER BY count(*) DESC`,
    sql`SELECT to_char(created_at AT TIME ZONE 'Asia/Dhaka', 'YYYY-MM-DD') AS day, count(*)::int AS count
        FROM tracking_events
        WHERE created_at >= now() - interval '14 days'
        GROUP BY day ORDER BY day ASC`,
    sql`SELECT id, name, batch, major_or_section, role, device_type, created_at
        FROM tracking_events ORDER BY id DESC LIMIT 25`,
  ]);

  return {
    total: total[0]?.count ?? 0,
    uniqueVisitors: uniqueVisitors[0]?.count ?? 0,
    today: today[0]?.count ?? 0,
    daysActive: daysActive[0]?.count ?? 0,
    byBatch,
    byMajor,
    byRole,
    byDevice,
    daily,
    recent,
  };
}
