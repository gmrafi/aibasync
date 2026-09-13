/**
 * Client-side silent tracker.
 * Sends a fire-and-forget POST to /api/track whenever a visitor
 * completes the batch/selection dialog (name is optional).
 */

export interface TrackPayload {
  event?: string;
  name?: string;
  batch?: string;
  majorOrSection?: string;
  minor?: string;
  role?: string;
  teacherCode?: string;
}

function send(payload: TrackPayload): void {
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      /* analytics must never break the UI — silent */
    });
  } catch {
    /* noop */
  }
}

/** Called when the user submits the batch/selection dialog. */
export function trackRoutineView(payload: Omit<TrackPayload, "event">): void {
  send({ ...payload, event: "routine_view" });
}

/** Called once when the public routine page is loaded. */
export function trackPageVisit(payload: Omit<TrackPayload, "event"> = {}): void {
  send({ ...payload, event: "page_view" });
}
