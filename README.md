# CLASSR // AIBA Sylhet Routine Terminal

A blazing-fast, zero-friction, client-side campus routine and utility web app built specifically for **Army Institute of Business Administration (AIBA), Sylhet**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-06b6d4?style=flat-square&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)

---

## ⚡ মূল সুবিধাসমূহ (Core Features)

1. **জিরো-ব্যাকএন্ড ও ০ মিলি-সেকেন্ড লোডিং স্পিড**:
   - কোনো সাইনআপ বা ডাটাবেজ নেই।
   - সম্পূর্ণ ক্লায়েন্ট-সাইড ফিল্টারিং এবং লোকালস্টোরেজ পারসিস্টেন্স।
2. **লাইভ স্ট্যাটাস হিরো কার্ড (Live Status & Next Class Countdown)**:
   - ব্রাউজারের সময়ের সাথে মিলিয়ে চলমান ক্লাসের পালস ইন্ডিকেটর এবং শেষ হওয়ার কাউন্টডাউন।
   - পরবর্তী ক্লাসের রুম এবং শুরু হওয়ার নিখুঁত কাউন্টডাউন (যেমন: *শুরু হতে ৩৫ মিনিট বাকি*)।
   - সব ক্লাস শেষ হলে রিল্যাক্সড ভাইব নোটিশ এবং শুক্রবার/শনিবার ছুটির দিন ডিটেক্টর।
3. **ফাঁকা রুম ডিটেক্টর (Empty Room Finder)**:
   - এই মুহূর্তে ক্যাম্পাসের ২য় ও ৩য় তলার কোন কোন রুম ফাঁকা আছে এবং কতক্ষণ ফাঁকা থাকবে তা রিয়েল-টাইম ক্যালকুলেট করে এক ক্লিকে দেখা যায়।
4. **রিমেম্বার মাই চয়েস (LocalStorage)**:
   - প্রথমবার ঢুকে ব্যাচ (BBA-11 থেকে BBA-15) এবং সেকশন/মেজর সিলেক্ট করলেই আজীবনের জন্য ব্রাউজারে সেভ।
5. **ডুয়াল মোড ভিউ (Today Timeline vs. Full Week View)**:
   - আজকের দিনের টাইমলাইন কার্ড (পিরিয়ড ও বিরতি স্লটসহ) এবং রবি থেকে বৃহস্পতিবারের পুরো কমপ্যাক্ট শিডিউল।
6. **হাই-কোয়ালিটি রুটিন ইমেজ এক্সপোর্ট**:
   - এক ক্লিকে ইনস্টাগ্রাম/হোয়াটসঅ্যাপ ফ্রেন্ডলি ডার্ক-মোড রুটিন কার্ড PNG ইমেজ হিসেবে ডাউনলোড।
7. **অফলাইন PWA (Progressive Web App)**:
   - দুর্বল নেটওয়ার্ক বা বেসমেন্টে ইন্টারনেট কানেকশন ছাড়াও অফলাইনে রুটিন দেখার পূর্ণ সক্ষমতা।
8. **অফিশিয়াল ফল ২০২৬ একাডেমিক ক্যালেন্ডার**:
   - ছুটির তালিকা, মিডটার্ম ও ফাইনাল পরীক্ষার শিডিউল এক ক্লিকে দৃশ্যমান।

---

## 🚀 লোকাল ডেভেলপমেন্ট (Run Locally)

```bash
# ১. ডিপেন্ডেন্সি ইনস্টল করুন
npm install

# ২. লোকাল সার্ভার চালু করুন
npm run dev

# ব্রাউজারে ওপেন করুন: http://localhost:3000
```

---

## 🌐 Vercel-এ ডিপ্লয়মেন্ট (1-Click Deployment)

এই প্রজেক্টটি কোনো সার্ভার-সাইড ডাটাবেজের ওপর নির্ভরশীল না হওয়ায় এটি Vercel-এ ১০০% স্ট্যাটিক্যালি ক্যাশড হয়ে বিদ্যুতগতিতে রান করবে:

1. কোডটি আপনার গিটহাব রিপোজিটরিতে পুশ করুন:
   ```bash
   git add .
   git commit -m "feat: complete CLASSR routine terminal for AIBA Sylhet"
   git push origin main
   ```
2. [vercel.com](https://vercel.com)-এ গিয়ে **Add New Project** সিলেক্ট করে গিটহাব রিপোজিটরিটি ইমপোর্ট করুন।
3. Framework Preset: **Next.js** সিলেক্ট রেখে **Deploy** চাপুন। কোনো Environment Variable কনফিগার করার প্রয়োজন নেই!

---

## 📝 নতুন সেমিস্টারের রুটিন আপডেট করার উপায়

রুটিন সেমিস্টারে মাত্র ১-২ বার পরিবর্তন হয়। কোনো জটিল স্ক্র্যাপার ছাড়াই মাত্র ২ মিনিটে আপডেট করতে:
- `src/data/routine.ts` ফাইলে যান।
- `ROUTINE_DATA` অ্যারেতে নতুন ক্লাসের তথ্য পেস্ট করে দিন।
- গিটহাবে পুশ করলেই Vercel স্বয়ংক্রিয়ভাবে নতুন রুটিন লাইভ করে দেবে!

---

## 👨‍💻 Author & Credits

**Designed and Developed by [Md. Golam Mubasshir Rafi](https://www.gmrafi.com.bd/)**

- 🌐 Website: [https://www.gmrafi.com.bd/](https://www.gmrafi.com.bd/)
- 🐙 GitHub: [@gmrafi](https://github.com/gmrafi)
- 📦 Repository: [https://github.com/gmrafi/aibasync](https://github.com/gmrafi/aibasync)

