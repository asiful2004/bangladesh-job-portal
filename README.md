# চাকরি বার্তা (Chakri Barta) - Professional Bangladesh Job News & Career Portal

![Chakri Barta Logo](assets/images/logo.svg)

**চাকরি বার্তা** হলো একটি আধুনিক, দ্রুতগতির, শতভাগ রেসপন্সিভ এবং এসইও-বান্ধব বাংলাদেশ ভিত্তিক জব নিউজ ও ক্যারিয়ার ইনফরমেশন পোর্টাল। এই প্রকল্পটি মূলত অর্গানিক সার্চ ট্রাফিক আকর্ষণ এবং **Adsterra** বিজ্ঞাপন নেটওয়ার্কের মাধ্যমে নির্ভরযোগ্য রেভিনিউ আয়ের লক্ষ্যে প্রস্তুত করা হয়েছে।

---

## 🌟 মূল বৈশিষ্ট্যসমূহ (Key Highlights)

- **১০০% স্ট্যাটিক আর্কিটেকচার (100% Static):** কোনো PHP, Node.js ব্যাকএন্ড বা MySQL ডাটাবেজের প্রয়োজন নেই।
- **Adsterra মনিটাইজেশন আর্কিটেকচার:** ডেডিকেটেড রিউজেবল অ্যাড কন্টেইনার (`AdSlotTop`, `AdSlotSidebar`, `AdSlotInArticle`, `AdSlotBetweenCards`, `AdSlotBottom`)। ফিক্সড অ্যাসপেক্ট রেশিওর কারণে লেআউট শিফট (CLS) প্রতিরোধ করে।
- **স্বয়ংক্রিয় চাকরির মেয়াদ গণনা (Dynamic Expiration):**
  - **চলমান (Active):** সবুজ ব্যাজ ও অবশিষ্ট দিনের কাউন্টার।
  - **শীঘ্রই শেষ (Closing Soon - ≤ ৩ দিন):** কমলা রঙের সতর্কতামূলক কাউন্টডাউন ব্যানার।
  - **মেয়াদ উত্তীর্ণ (Expired):** স্বয়ংক্রিয় লাল সতর্কতা ও আবেদন বাটন নিষ্ক্রিয়করণ।
- **উন্নত এসইও এবং Schema.org structured data:**
  - সক্রিয় সার্কুলারের জন্য গুগল ভ্যালিড `JobPosting` স্কিমা (`datePosted`, `validThrough`, `hiringOrganization`, ইত্যাদি)।
  - মেয়াদোত্তীর্ণ সার্কুলারের জন্য স্বয়ংক্রিয়ভাবে `Article` স্কিমায় রূপান্তর (যাতে গুগল পেনাল্টি না দেয়)।
  - হোমপেজে `WebSite` এবং `Organization` স্কিমা ও ব্রেডক্রাম্ব স্কিমা।
- **ডার্ক মোড ও লাইট মোড:** ব্যবহারকারীর পছন্দ ব্রাউজারের `localStorage` এ সংরক্ষিত থাকে।
- **ব্রাউজারভিত্তিক বুকমার্কিং সিস্টেম:** ব্যবহারকারী পছন্দের চাকরি সংরক্ষণ করতে পারেন যা `localStorage` এ থাকে।
- **জাভাস্ক্রিপ্ট সার্চ ইঞ্জিন:** পদবি, প্রতিষ্ঠান, জেলা, ক্যাটাগরি এবং কি-ওয়ার্ড দিয়ে রিয়েল-টাইম সার্চ ও সাজেশন্স।
- **সার্কুলার ভিউয়ার ও জুম মোডাল:** মূল অফিসিয়াল বিজ্ঞপ্তি ডাউনলোড বা ফুলস্ক্রিনে দেখার সুবিধা।
- **সোশ্যাল মিডিয়া শেয়ারিং ও প্রিন্ট:** ফেসবুক, হোয়াটসঅ্যাপ, লিঙ্কডইন ও টেলিগ্রামে ওয়ান-ক্লিক শেয়ার এবং ফরম্যাটেড প্রিন্ট সুবিধা।

---

## 🛠️ টেকনোলজি স্ট্যাক (Technology Stack)

- **Frontend:** Semantic HTML5, Modular CSS3, Vanilla JavaScript (ES6+).
- **Data Management:** JSON (`jobs.json`, `categories.json`, `featured.json`, `breaking-news.json`).
- **Icons & Images:** কাস্টম ভেক্টর SVG (নো এক্সটার্নাল হেভি লাইব্রেরি - ফাস্টেস লোডিং)।
- **Typography:** Google Fonts (`Hind Siliguri` বাংলার জন্য, `Inter` ইংরেজির জন্য)।

---

## 📁 ফোল্ডার স্ট্রাকচার (Folder Structure)

```text
/
├── index.html                  # মূল হোমপেজ
├── job.html                    # একক সার্কুলার বিস্তারিত পেজ
├── category.html               # ক্যাটাগরিভিত্তিক ফিল্টারিং ও পেজিনেশন পেজ
├── search.html                 # উন্নত অনুসন্ধান পেজ
├── bookmarks.html              # সংরক্ষিত বুকমার্ক পেজ
├── about.html                  # আমাদের সম্পর্কে
├── contact.html                # যোগাযোগ ও ফর্ম পেজ
├── privacy-policy.html         # প্রাইভেসি পলিসি (Adsterra ও কুকিজ কমপ্লায়েন্ট)
├── disclaimer.html             # দায়মুক্তি ও আর্থিক সতর্কতা
├── terms.html                  # ব্যবহারের শর্তাবলি
├── 404.html                    # কাস্টম ৪০৪ এরর পেজ
├── robots.txt                  # সার্চ ইঞ্জিন নির্দেশিকা
├── sitemap.xml                 # এক্সএমএল সাইটম্যাপ
├── PUBLISHING_GUIDE.md         # নতুন চাকরি প্রকাশের পূর্ণাঙ্গ গাইড
├── README.md                   # প্রজেক্ট পরিচিতি ও ডেপ্লয়মেন্ট গাইড
│
└── assets/
    ├── css/
    │   ├── style.css           # মূল সিএসএস
    │   ├── dark-mode.css       # ডার্ক মোড স্টাইল
    │   └── responsive.css      # মোবাইল ও ট্যাবলেট রেসপন্সিভ স্টাইল
    ├── js/
    │   ├── ads-config.js       # Adsterra অ্যাড কনফিগারেশন মডিউল
    │   ├── app.js              # মূল অ্যাপ্লিকেশন কো-অর্ডিনেটর
    │   ├── jobs.js             # জব ডাটা ও কার্ড রেন্ডারিং ইঞ্জিন
    │   ├── search.js           # ক্লায়েন্ট-সাইড সার্চ ইঞ্জিন
    │   ├── filters.js          # ক্যাটাগরি পেজিনেশন ও ফিল্টার
    │   ├── theme.js            # ডার্ক/লাইট মোড ম্যানেজার
    │   └── seo.js              # ডাইনামিক এসইও ও স্কিমা জেনারেটর
    ├── data/
    │   ├── jobs.json           # সকল সার্কুলারের সেন্ট্রাল ডাটাবেজ
    │   ├── categories.json     # ১৪টি চাকরির ক্যাটাগরি ডাটা
    │   ├── featured.json       # স্পটলাইট ফিচার্ড চাকরির তালিকা
    │   └── breaking-news.json  # রানিং ব্রেকিং টিকার নিউজ
    └── images/
        ├── logo.svg            # পোর্টাল লোগো
        ├── favicon.svg         # ফেভিকন
        ├── jobs/               # প্রতিষ্ঠানের ভেক্টর লোগো
        └── circulars/          # নমুনা সার্কুলার ডকুমেন্টস
```

---

## 💰 Adsterra মনিটাইজেশন কনফিগারেশন (Monetization Setup)

বিজ্ঞাপন সেটিংস নিয়ন্ত্রণ করতে `assets/js/ads-config.js` ফাইলটি ওপেন করুন:

```javascript
const ADS_CONFIG = {
  // বিজ্ঞাপন চালু বা সম্পূর্ণ বন্ধ করতে:
  enabled: true,

  // ডেমো মোড: ডেভেলপমেন্ট বা রিভিউয়ের সময় true রাখুন। 
  // আসল Adsterra কোড বসানোর পর false করে দিন:
  demoMode: false,

  slots: {
    header: {
      enabled: true,
      format: "728x90",
      scriptSnippet: `<script type="text/javascript">
        // আপনার Adsterra 728x90 ব্যানার কোড এখানে পেস্ট করুন
      </script>`
    },
    sidebar: {
      enabled: true,
      format: "300x250",
      scriptSnippet: `<script type="text/javascript">
        // আপনার Adsterra 300x250 কোড
      </script>`
    }
    // ... অন্যান্য স্লটসমূহ
  }
};
```

---

## 🚀 ডিপ্লয়মেন্ট নির্দেশিকা (Deployment Guide)

যেহেতু এটি একটি ১০০% পিওর স্ট্যাটিক ওয়েবসাইট, এটি নিচের যেকোনো প্ল্যাটফর্মে বিনামূল্যে হোস্ট করা যাবে:

### ১. Cloudflare Pages (সর্বোত্তম পারফরম্যান্স)
1. [Cloudflare Dashboard](https://dash.cloudflare.com/) এ লগইন করুন।
2. **Workers & Pages** > **Create application** > **Pages** নির্বাচন করুন।
3. আপনার গিটহাব রিপোজিটরি কানেক্ট করুন অথবা সরাসরি ফোল্ডারটি ড্র্যাগ অ্যান্ড ড্রপ করে আপলোড করুন।
4. Build command ফাঁকা রাখুন, Output directory: `/` (Root)।
5. **Save and Deploy** এ ক্লিক করুন। আপনার ওয়েবসাইট গ্লোবাল এজ সিডিএন-এ লাইভ হয়ে যাবে!

### ২. Netlify
1. [Netlify](https://app.netlify.com/) এ গিয়ে **Add new site** > **Deploy manually** নির্বাচন করুন।
2. প্রজেক্টের রুট ফোল্ডারটি ড্র্যাগ অ্যান্ড ড্রপ করে ছেড়ে দিন।
3. ১ মিনিটের মধ্যে সাইট লাইভ হয়ে যাবে এবং কাস্টম ডোমেইন যুক্ত করতে পারবেন।

### ৩. Vercel
1. Vercel CLI দিয়ে: `vercel deploy` অথবা ড্যাশবোর্ড থেকে গিট রিপোজিটরি ইমপোর্ট করুন।
2. Framework Preset: **Other** সিলেক্ট করে ডিপ্লয় করুন।

### ৪. GitHub Pages
1. রিপোজিটরির **Settings** > **Pages** ট্যাবে যান।
2. Source: **Deploy from a branch** > `main` বা `master` সিলেক্ট করে Save করুন।

### ৫. Traditional cPanel Hosting
1. cPanel এর **File Manager** এ যান।
2. `public_html` ফোল্ডারে প্রবেশ করুন।
3. প্রজেক্টের সকল ফাইল ও ফোল্ডার সরাসরি `public_html` এর ভেতর আপলোড করে দিন।

---

## 📝 নতুন চাকরির সার্কুলার প্রকাশ করার নিয়ম

বিস্তারিত নির্দেশিকা দেখতে `PUBLISHING_GUIDE.md` ফাইলটি দেখুন। সংক্ষেপে:
1. `assets/data/jobs.json` এ নতুন অবজেক্ট যোগ করুন।
2. `assets/images/jobs/` এ প্রতিষ্ঠানের লোগো রাখুন।
3. `git commit -m "New circular added"` এবং `git push` করলেই স্বয়ংক্রিয়ভাবে লাইভ হয়ে যাবে।

---

## ⚖️ কপিরাইট ও লাইসেন্স

© ২০২৬ চাকরি বার্তা (Chakri Barta). সর্বস্বত্ব সংরক্ষিত।
প্রকল্পটি মুক্তভাবে ডিপ্লয় এবং কাস্টমাইজযোগ্য।
