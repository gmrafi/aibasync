/**
 * CLASSR - Routine Data Helper Script
 * 
 * Usage:
 * When a new semester routine is announced:
 * 1. Open ChatGPT, Claude, or Gemini
 * 2. Upload the official routine PDF or copy-paste text
 * 3. Use the prompt below to generate TypeScript objects:
 * 
 * PROMPT:
 * "Convert this university class routine into an array of TypeScript objects matching this schema:
 * {
 *   id: string,
 *   batch: string (e.g. 'BBA-14'),
 *   majorOrSection: string (e.g. 'Charlie' or 'FIN'),
 *   day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday',
 *   period: 1 | 2 | 3,
 *   startTime: '09:30' (24h format),
 *   endTime: '11:00' (24h format),
 *   courseTitle: string,
 *   instructor: string,
 *   room: string,
 *   isClub?: boolean
 * }
 * Return clean TypeScript array only."
 * 
 * 4. Paste the output into `src/data/routine.ts` under ROUTINE_DATA!
 */

console.log("CLASSR: Routine data is statically typed in `src/data/routine.ts` for zero-latency browser execution.");
