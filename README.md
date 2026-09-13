# AIBA Sync // Campus Routine & Utility Platform

A blazing-fast, zero-friction, client-side campus utility and live academic routine terminal built specifically for **Army Institute of Business Administration (AIBA), Sylhet**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06b6d4?style=flat-square&logo=tailwindcss)
![PWA](https://img.shields.io/badge/PWA-Installable-166534?style=flat-square)
![Release](https://img.shields.io/badge/Release-v0.0.6-166534?style=flat-square)

> AIBA Sync turns the Fall 2026 academic routine into a fast, mobile-first campus desk for students and teachers.

## What It Does | অ্যাপটি কী করে

### ১. Academic routine | একাডেমিক রুটিন

- Weekly routine grid for BBA-11 through BBA-15.
  BBA-11 থেকে BBA-15 পর্যন্ত পূর্ণ সাপ্তাহিক রুটিন দেখা যায়।
- Today view and weekly view with period timings, breaks, courses, rooms and instructors.
  আজকের ক্লাস এবং পুরো সপ্তাহের ক্লাস আলাদা view-তে দেখা যায়।
- Academic day flow is represented as period 1, tea break, period 2, lunch break and period 3.
  দিনের flow: Period 1 (09:30–11:00), Tea Break (11:00–11:30), Period 2 (11:30–13:00), Lunch Break (13:00–13:30), Period 3 (13:30–15:00)।
- Sticky day context and horizontal timetable scrolling keep the schedule usable on narrow screens.
  মোবাইলে horizontal scroll করলেও দিনের context সহজে বোঝা যায়।
- Subject-aware visual treatment for Finance, Accounting, Marketing, Supply Chain, HRM and MIS courses.
  বিষয় দ্রুত চেনার জন্য restrained subject color accents ব্যবহার করা হয়েছে।
- Course accents use a restrained academic palette so subjects can be scanned quickly without turning the timetable into a colorful dashboard.

The routine is intentionally the product’s main surface: users can see what is happening now, what is next and the full weekly schedule without navigating through a marketing-style landing page.

### ২. Student profiles | শিক্ষার্থী প্রোফাইল

- Batch and section selection for BBA-12, BBA-13, BBA-14 and BBA-15.
  Junior batches-এর section এবং batch অনুযায়ী রুটিন filter হয়।
- BBA-11 major selection across Finance, Accounting, Marketing, Supply Chain Management, HRM and MIS.
  BBA-11-এর major discipline আলাদাভাবে নির্বাচন করা যায়।
- BBA-11 minor selection with course-aware filtering for MIS, HRM, SCM, MKT, FIN and ACC.
  Minor নির্বাচন করলে সংশ্লিষ্ট minor class-ও রুটিনে যুক্ত হয়।
- Preferences are stored locally on the user’s device without registration.
  কোনো registration বা password ছাড়াই profile device-এ সংরক্ষিত থাকে।

### ৩. Teacher profiles | শিক্ষক মোড

- Dedicated teacher mode that does not fall back to student batch logic.
  শিক্ষক mode কখনো student batch-এর default logic ব্যবহার করে না।
- Personal class view filtered by the selected faculty code.
  নির্বাচিত শিক্ষক শুধু নিজের class schedule দেখতে পারেন।
- Master routine view for all batches.
  প্রয়োজন হলে সব batch-এর master routine দেখা যায়।
- Faculty names, designations and institution affiliations shown through the faculty directory.
  শিক্ষক directory-তে নাম, পদবি এবং প্রতিষ্ঠান পরিষ্কারভাবে দেখানো হয়।

### ৪. Live routine status | লাইভ ক্লাস রাডার

- Current class detection with a live remaining-time countdown.
  বর্তমানে কোন ক্লাস চলছে এবং শেষ হতে কত সময় বাকি তা দেখা যায়।
- Next-class countdown with course, room and instructor details.
  পরবর্তী ক্লাসের সময়, বিষয়, room এবং instructor দেখা যায়।
- Weekend and end-of-day states.
  শুক্রবার/শনিবার এবং দিনের সব ক্লাস শেষ হওয়ার জন্য আলাদা state আছে।
- The public first page stays focused on the real routine; test controls are not shown in the public routine surface.
  ব্যবহারকারীর first page-এ শুধু বাস্তব routine experience রাখা হয়েছে।

### ৫. Faculty directory | ফ্যাকাল্টি ডিরেক্টরি

- Searchable faculty directory from the header and More menu.
  header search বা More menu থেকে শিক্ষক খোঁজা যায়।
- Faculty details show only the currently verified identity fields: name, designation and institution.
  আপাতত শুধু নাম, পদবি এবং প্রতিষ্ঠান দেখানো হয়; department বা teaching lounge রাখা হয়নি।
- AIBA faculty and SUST faculty affiliations are kept visibly distinct.
  AIBA এবং SUST-এর affiliation আলাদা করে বোঝা যায়।
- Official profile links are shown only where a verified profile URL is available.
  verified profile link না থাকলে কোনো placeholder তথ্য দেখানো হয় না।

### ৬. Academic utilities | একাডেমিক ইউটিলিটি

- Academic calendar and notice modal.
  academic dates, holidays এবং notices দেখার calendar আছে।
- Faculty search directly from the header.
  header থেকেই faculty search করা যায়।
- Light and dark themes.
  light এবং dark theme switch করা যায়।
- Installable PWA experience with an install prompt where supported.
  supported device-এ app install করা যায়।
- Routine card export code is retained for a later release and is currently hidden from the main navigation.
  export feature মুছে ফেলা হয়নি; আপাতত navigation থেকে hidden রাখা হয়েছে।

### Product principles

- No sign-up or registration is required for the routine experience.
- Profile and theme preferences stay on the user’s device through `localStorage`.
- The application keeps the first page focused on academic routine work instead of adding unrelated campus bloat.
- Analytics is optional infrastructure and never blocks the public routine experience.

## Upcoming Ideas

The More section contains clearly marked roadmap ideas rather than pretending they are live features:

- Class reminders.
- Campus bus tracker.
- Routine card export.
- Assignment cover page generator.
- Attendance tracker.
- Exam schedule.
- Campus notices.
- Personal notes.

## UI Direction

AIBA Sync uses a restrained green-led academic interface rather than a marketing landing page:

- Solid, bordered navigation with a live seconds clock and faculty search.
- shadcn-style primitives for buttons, inputs, badges and consistent focus states.
- Lucide icons with a mobile bottom navigation bar.
- Institutional footer with the official AIBA website, version and project attribution.
- Hero and routine sections remain the primary experience; secondary tools stay behind More or dedicated modals.

## Data and privacy

- Routine, faculty and calendar data are maintained as typed application data in the repository.
- User profile and theme preferences are stored in `localStorage`.
- The main routine experience does not require sign-in or registration.
- Optional analytics tracking sends routine-view events to `/api/track` when a production database is configured.
- Tracking fails open: an unavailable analytics database does not block the routine app.
- The admin analytics page is protected by `ADMIN_PASSWORD`.

## Technology

- **Framework:** [Next.js 16 App Router](https://nextjs.org/) with React 19 and TypeScript.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with project theme tokens.
- **UI primitives:** shadcn-style Button, Input and Badge primitives using Radix Slot, Class Variance Authority and Tailwind Merge.
- **Icons:** [Lucide React](https://lucide.dev/).
- **Fonts:** [Noto Sans Bengali](https://fonts.google.com/specimen/Noto+Sans+Bengali) and Geist Mono.
- **PWA:** Web app manifest and service worker registration.
- **Export support:** `html-to-image`, currently kept for a later release.
- **Analytics:** Neon serverless PostgreSQL through the optional API routes.

## Run locally

```bash
npm install
npx next dev --hostname 127.0.0.1 --port 3000
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

For a production build:

```bash
npm run build
npm start
```

## Optional environment variables

Create a local `.env.local` only when you need analytics/admin functionality:

```env
DATABASE_URL=your_neon_database_url
ADMIN_PASSWORD=your_admin_password
TRACKING_SALT=your_tracking_salt
```

The public routine interface remains usable when these values are not configured.

## Project map

```text
src/
  app/             App Router pages, layout and API routes
  components/      Routine, faculty, calendar, export and UI components
  data/            Typed routine and faculty records
  lib/              Storage, tracking, database and time utilities
public/            Manifest, service worker and static assets
```

## Author

Designed and developed for AIBA Sylhet by [Md. Golam Mubasshir Rafi](https://www.gmrafi.com.bd/).

- Official institution website: [aibasylhet.edu.bd](https://aibasylhet.edu.bd/)
- Developer website: [gmrafi.com.bd](https://www.gmrafi.com.bd/)
- Repository: [github.com/gmrafi/aibasync](https://github.com/gmrafi/aibasync)

## Release

Current release: **v0.0.6**
