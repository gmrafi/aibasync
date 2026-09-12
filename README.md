# AIBA Sync // Campus Routine & Utility Platform

A blazing-fast, zero-friction, client-side campus utility and live academic routine terminal built specifically for **Army Institute of Business Administration (AIBA), Sylhet**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-06b6d4?style=flat-square&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![PWA Ready](https://img.shields.io/badge/PWA-Installable-purple?style=flat-square)
![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)

---

## 🏛️ মূল সুবিধাসমূহ (Core Features)

### ১. সাপ্তাহিক রুটিন ম্যাট্রিক্স (Academic Standard Timetable Matrix)
- **বিশ্ববিদ্যালয় স্ট্যান্ডার্ড লেআউট**: বামে দিনসমূহ (রবিবার থেকে বৃহস্পতিবার সারি হিসেবে) এবং উপরে পিরিয়ডসমূহ (কলাম হিসেবে) সাজানো পূর্ণাঙ্গ একাডেমিশিয়ান টাইমটেবিল।
- **স্বাভাবিক পাঠ-প্রবাহ (Left-to-Right Timeline)**: প্রতিদিনের ক্লাস সময়ানুসারে ক্রমান্বয়ে সাজানো:
  - `পিরিয়ড ১` (09:30 AM - 11:00 AM)
  - `চা বিরতি` (11:00 AM - 11:30 AM)
  - `পিরিয়ড ২` (11:30 AM - 01:00 PM)
  - `মধ্যাহ্ন বিরতি` (01:00 PM - 01:30 PM)
  - `পিরিয়ড ৩` (01:30 PM - 03:00 PM)
- **স্টিকি ডে কলাম (Sticky Day Column)**: মোবাইল বা ল্যাপটপে অনুভূমিক স্ক্রল করলেও দিনের নাম বামে স্থির থাকে।
- **হাই-কন্ট্রাস্ট বোল্ড টাইপোগ্রাফি**: সকল বিষয়ের নাম, রুম নম্বর এবং শিক্ষকের তথ্য বোল্ড ও স্পষ্ট ফন্টে প্রদর্শিত, যাতে কোনো অস্পষ্টতা না থাকে।
- **বিষয়ভিত্তিক কালার কোডিং**:
  - ফিন্যান্স (Finance) • Emerald
  - অ্যাকাউন্টিং (Accounting) • Amber
  - ম্যানেজমেন্ট / HRM • Indigo
  - মার্কেটিং (Marketing) • Rose
  - এমআইএস ও প্রযুক্তি • Cyan

---

### ২. ডুয়াল রোল মোড (Student & Teacher Dynamic Modes)
- **শিক্ষার্থী মোড (Student Mode)**:
  - ব্যাচ নির্বাচন (BBA-11 থেকে BBA-15, MBA)।
  - **BBA-11 স্পেশাল মেজর ও মাইনর ইন্টিগ্রেশন**: একই সাথে মেজর (`FIN`, `ACC`, `MKT`, `SCM`) এবং মাইনর (`MIS-M`, `HRM-M` বা `None`) পছন্দ অনুযায়ী স্বয়ংক্রিয় রুটিন ফিল্টারিং।
- **শিক্ষক মোড (Teacher Mode)**:
  - ফ্যাকাল্টি নির্বাচন (AIBA-র সকল শিক্ষক ও প্রভাষকের ইনিশিয়াল ও কোডসহ তালিকা)।
  - ব্যক্তিগত ক্লাস সূচি এবং এক ক্লিকে যেকোনো ব্যাচের মাস্টার রুটিন দেখার কুইক-সুইচার সুবিধা।

---

### ৩. লাইভ ক্লাস রাডার ও কাউন্টডাউন (Live Class Radar)
- **রিয়েল-টাইম ক্লাস ট্র্যাকিং**: বর্তমানে কোন ক্লাস চলছে তা লাইভ অ্যানিমেটেড পালস এবং ক্লাস শেষ হওয়ার সঠিক কাউন্টডাউনসহ দৃশ্যমান।
- **পরবর্তী ক্লাসের পূর্বাভাস**: পরবর্তী ক্লাস কখন, কোন বিষয়ে এবং কোন রুমে হবে তার তাৎক্ষণিক কাউন্টডাউন।
- **অফ-পিরিয়ড ও ছুটির দিন হ্যান্ডলিং**: শুক্র ও শনিবার সাপ্তাহিক ছুটির দিনসহ ক্যাম্পাসের স্বাভাবিক কার্যসময়ের বাইরে মার্জিত নোটিশ।

---

### ৪. ফাঁকা রুম ডিটেক্টর (Empty Room Finder)
- ক্যাম্পাসের ১৬টি ক্লাস রুমের মধ্যে বর্তমানে কোন কোন রুম ফাঁকা আছে এবং পরবর্তী ক্লাস শুরু হতে কত মিনিট বাকি তা স্বয়ংক্রিয়ভাবে হিসাব করে বের করার টুল।
- তাৎক্ষণিক গ্রুপ স্টাডি বা অবসরে বসার রুম খুঁজে পাওয়ার নির্ভরযোগ্য সমাধান।

---

### ৫. ফ্যাকাল্টি ডিরেক্টরি (Verified Faculty Directory)
- শিক্ষকদের নামের উপর ট্যাপ করামাত্র তাদের পূর্ণ নাম, পদবি, ডিপার্টমেন্ট এবং অফিস লোকেশন ভেসে ওঠে।
- **টিচিং লাউঞ্জ স্ট্যান্ডার্ডাইজেশন**: ক্যাম্পাসের সকল শিক্ষকের অফিস লোকেশন সুনির্দিষ্টভাবে **টিচিং লাউঞ্জ (২য় তলা)** হিসেবে সংরক্ষিত।
- বহিরাগত অতিথি শিক্ষকদের **অ্যাডজাঙ্কট ফ্যাকাল্টি (Adjunct Faculty)** হিসেবে যথাযথ প্রাতিষ্ঠানিক মর্যাদা প্রদান।
- শিক্ষকদের প্রাতিষ্ঠানিক ওয়েব প্রোফাইলের সরাসরি লিঙ্ক।

---

### ৬. পিডব্লিউএ ও অফলাইন সাপোর্ট (Progressive Web App)
- বিশ্ববিদ্যালয়ের অফিসিয়াল লোগো সংবলিত স্মার্ট ফ্যাভিকন ও অ্যাপ আইকন।
- মোবাইল ও ডেস্কটপে সরাসরি ইনস্টলযোগ্য (Install App)।
- একবার লোড হলে ইন্টারনেট সংযোগ ছাড়াও অফলাইনে নির্বিঘ্নে কাজ করে।

---

### ৭. রুটিন কার্ড ইমেজ এক্সপোর্ট (HD Image Export)
- এক ট্যাপে নিজের পার্সোনালাইজড ক্লাস রুটিন কার্ড হাই-রেজোলিউশন PNG ছবি হিসেবে ডাউনলোড করার সুবিধা, যা ফোনের ওয়ালপেপার বা ফটো গ্যালারিতে রাখা যায়।

---

## 🚫 কঠোর নিয়ম (Zero Bloatware Architecture)

- **বিশুদ্ধ একাডেমিক ফোকাস**: ক্লাব অ্যাক্টিভিটি বা নন-একাডেমিক ইভেন্ট বাদ দিয়ে শুধুমাত্র নিয়মিত ক্লাসসূচি রাখা হয়েছে।
- কোনো অপ্রয়োজনীয় সাইন-আপ, পাসওয়ার্ড বা ক্লাউড ট্র্যাকার নেই।
- যাবতীয় প্রেফারেন্স সম্পূর্ণ নিরাপদভাবে ব্যবহারকারীর নিজস্ব ডিভাইসের `localStorage`-এ সংরক্ষিত হয়।

---

## 🛠️ টেকনোলজি স্ট্যাক (Tech Stack)

- **Framework**: [Next.js 16 (App Router + Turbopack)](https://nextjs.org/)
- **UI & Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: [Noto Sans Bengali](https://fonts.google.com/specimen/Noto+Sans+Bengali) & Inter
- **Export Engine**: `html-to-image`
- **Celebration**: `canvas-confetti`

---

## 🚀 লোকাল ডেভেলপমেন্ট (Run Locally)

```bash
# ডিপেন্ডেন্সি ইনস্টল করুন
npm install

# লোকাল সার্ভার চালু করুন
npm run dev

# ব্রাউজারে ওপেন করুন: http://localhost:3000
```

---

## 👨‍💻 Author & Credits

**Designed and Developed by [Md. Golam Mubasshir Rafi](https://www.gmrafi.com.bd/)**

- 🌐 Personal Website: [https://www.gmrafi.com.bd/](https://www.gmrafi.com.bd/)
- 🐙 GitHub: [@gmrafi](https://github.com/gmrafi)
- 📦 Repository: [https://github.com/gmrafi/aibasync](https://github.com/gmrafi/aibasync)
