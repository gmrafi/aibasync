# AIBA Radar (Phase 1) // Campus Routine & Room Finder

A blazing-fast, zero-friction, client-side campus utility and live routine terminal built specifically for **Army Institute of Business Administration (AIBA), Sylhet**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-06b6d4?style=flat-square&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)

---

## ⚡ মূল সুবিধাসমূহ (Core Deliverables)

1. **প্রিমিয়াম মিডনাইট-স্লেট গ্লাস ইউআই (No Harsh Black)**:
   - দৃষ্টিনন্দন ও আরামদায়ক ডিপ ওবসিডিয়ান মিডনাইট-স্লেট ক্যানভাস এবং ফ্রস্টেড গ্লাস কার্ড ডিজাইন।
2. **ব্যক্তিগত অনবোর্ডিং ও পার্সোনালাইজড গ্রিটিং**:
   - শিক্ষার্থীর নাম দিয়ে ব্যক্তিগত অভ্যর্থনা (*"Hey Mubasshir, here is your radar 📡"* বা *"Good morning, Rafi"*).
3. **ডায়নামিক ব্যাচ সিলেকশন (Zero Hardcoding)**:
   - কোনো ব্যাচ হার্ডকোড করা নেই; `routineData` ফাইলে থাকা সকল অনন্য ব্যাচ সরাসরি অপশন হিসেবে কাজ করে।
4. **স্মার্ট কন্ডিশনাল মেজর/সেকশন ফিল্টার**:
   - যেসব সিনিয়র ব্যাচে মেজর আছে (যেমন: BBA-11 এর Finance, Marketing, SCM), শুধুমাত্র তাদের জন্যই মেজরের অপশন আসবে। কমন ব্যাচগুলোর জন্য ড্রপডাউনটি সরাসরি হাইড থাকবে।
5. **লাইভ স্ট্যাটাস রাডার (Live Status Card & Countdowns)**:
   - চলমান ক্লাসের জন্য লাইভ পালস ইন্ডিকেটর এবং শেষ হওয়ার নিখুঁত কাউন্টডাউন।
   - পরবর্তী ক্লাসের রুম এবং শুরু হওয়ার কাউন্টডাউন (*"শুরু হতে ২০ মিনিট বাকি"*).
   - সব ক্লাস শেষ হলে ক্যাম্পাস-লাইফ মেসেজ এবং শুক্রবার/শনিবার ছুটির দিন নোটিশ।
6. **ফ্যাকাল্টি পপওভার (Faculty Directory)**:
   - শিক্ষকের নামের ওপর ক্লিক/ট্যাপ করামাত্র তার পুরো নাম, পদবি, বিভাগ এবং ফ্যাকাল্টি রুম নম্বর পপআপে ভেসে উঠবে।
7. **ফাঁকা রুম ডিটেক্টর (Empty Room Finder)**:
   - ক্যাম্পাসের ১৬টি রুমের মধ্যে কোন কোন রুম এই মুহূর্তে ফাঁকা এবং কতক্ষণ ফাঁকা থাকবে তা রিয়েল-টাইম ক্যালকুলেশন।
8. **ডুয়াল ভিউ (Today Timeline vs. Full Week Grid)**:
   - আজকের দিনের টাইমলাইন কার্ড (পিরিয়ড ও বিরতি স্লটসহ) এবং পুরো সপ্তাহের কমপ্যাক্ট শিডিউল।
9. **হাই-কোয়ালিটি রুটিন ইমেজ এক্সপোর্ট**:
   - এক ক্লিকে ইনস্টাগ্রাম/হোয়াটসঅ্যাপ ফ্রেন্ডলি রুটিন কার্ড PNG ইমেজ হিসেবে ডাউনলোড।
10. **অফলাইন PWA (Progressive Web App)**:
    - দুর্বল নেটওয়ার্ক বা ইন্টারনেট ছাড়াও অফলাইনে রুটিন দেখার পূর্ণ সক্ষমতা।

---

## 🚫 কঠোর নিয়ম (What NOT to Build - No Bloatware)

- কোনো CGPA ট্র্যাকার বা কাল্পনিক ক্যালকুলেটর নেই।
- কোনো অপ্রয়োজনীয় স্টাডি প্ল্যানার বা টু-ডু লিস্ট নেই।
- কোনো ব্যাকএন্ড বা পাসওয়ার্ড সাইন-আপ নেই; সবকিছু ব্রাউজারের `localStorage`-এ সুরক্ষিত।

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

## 🌐 Vercel-এ ডিপ্লয়মেন্ট (1-Click Deployment)

1. রিপোজিটরিতে কোড পুশ করুন:
   ```bash
   git add .
   git commit -m "feat: upgrade AIBA Radar with luxury UI, faculty popover and smart major filter"
   git push origin main
   ```
2. [vercel.com](https://vercel.com)-এ গিয়ে **Add New Project** সিলেক্ট করে গিটহাব রিপোজিটরিটি ইমপোর্ট করুন।
3. Framework Preset: **Next.js** রেখে **Deploy** চাপুন।

---

## 👨‍💻 Author & Credits

**Designed and Developed by [Md. Golam Mubasshir Rafi](https://www.gmrafi.com.bd/)**

- 🌐 Personal Website: [https://www.gmrafi.com.bd/](https://www.gmrafi.com.bd/)
- 🐙 GitHub: [@gmrafi](https://github.com/gmrafi)
- 📦 Repository: [https://github.com/gmrafi/aibasync](https://github.com/gmrafi/aibasync)
