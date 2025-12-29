# ZenBlock 🛡️ Digital Self-Discipline Savior

> **OH! NO!! Scrolling through TikTok/YouTube until 3 AM AGAIN?!**  
> **What happened to "just 5 minutes"?!**  
> **What happened to "early to bed"?!**  
> **Don't panic - Let ZenBlock rescue your self-control!**

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Offline](https://img.shields.io/badge/offline-100%25-brightgreen)

**A "Forced Intervention + Data Visualization" Tool to Reclaim Your Time**

English | [简体中文](./README.zh.md)

</div>

---

## 😱 Do You Have These Problems?

- 📱 "Just a quick check on YouTube" → 3 hours later: "OMG it's 3 AM?!"
- 🎮 "One more game then sleep" → Sunrise: "Did I... pull an all-nighter?"
- 🛒 "Quick browse on Amazon" → Cart: "You have 137 items waiting"
- 📺 "Scroll TikTok for a bit" → Boss: "You're fired"

**If you recognize these symptoms, congratulations - you need ZenBlock!**

---

## 🎯 What Can ZenBlock Do?

### 💪 Powerful Blocking
- 🚫 One-click generation of Tampermonkey scripts to block your "time black holes"
- 🔒 Try to open site → Instantly redirected to "Sage Mode" page
- 🧘 Heal your dopamine addiction with Stoic philosophy quotes

### 📊 Data Visualization
- 📈 24-hour heatmap: See when you're most vulnerable
- 📅 30-day calendar view: Spot your "relapse days" at a glance
- 🎯 Multi-site tracking: Precisely target each bad habit

### 🌍 Thoughtful Design
- 🌓 Light/Dark theme: Protect your late-night eyes
- 🗣️ Bilingual (EN/中文): For global self-discipline seekers
- 💾 100% Offline: Your data stays local, privacy guaranteed
- 📱 Responsive: Check your shame stats on mobile too

---

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
# Clone repository
git clone https://github.com/yourusername/zenblock.git
cd zenblock/zenblock_new

# Install dependencies (pnpm recommended - faster!)
npm install
# or
pnpm install
```

### Step 2: One-Click Launch

**Windows Users** (just double-click):
```cmd
start.bat
```

**Mac/Linux Users**:
```bash
chmod +x start.sh
./start.sh
```

### Step 3: Start Using

Open in browser:
- 🇨🇳 Chinese: http://localhost:3000/zh
- 🇬🇧 English: http://localhost:3000/en

---

## 📖 Usage Guide

### 🎬 Scenario 1: Block YouTube

1. Open ZenBlock homepage
2. Enter in input box: `youtube.com`
3. Click "Generate Interception Script"
4. Click "Install Script" button
5. Tampermonkey auto-recognizes and installs
6. ✅ Done! Now opening YouTube shows the Sage Mode page

**Demo Effect**:
```
You: *clicks YouTube icon*
YouTube: Loading...
ZenBlock: 🛑 Breathe. This is your 7th attempt today.
You: 😱 Only 7 times?! (actually 70)
Marcus Aurelius: "Waste no more time arguing what a good man should be. Be one."
You: 💪 Alright! Time to work!
```

### 📊 Scenario 2: View Stats

Click "View Dashboard" to see:

- **Today's Attempts**: 87 times ← 😱 what?!
- **Total Attempts**: 1,234 times ← 🤡 I'm devastated
- **Last Attempt**: 2 minutes ago ← 😅 caught red-handed

**24-Hour Distribution**:
```
23:00-03:00  ████████████████████  <- Your prime relapse hours
03:00-07:00  ██                    <- Finally asleep
07:00-12:00  ████                  <- Morning willpower
12:00-18:00  ██████████            <- Afternoon collapse
```

**Heatmap**:
```
Blood Red = You're doomed
All Green = You've achieved enlightenment
```

### 🎯 Scenario 3: Manage Multiple Sites

```
Your Block List:
- youtube.com   (87 attempts today)
- tiktok.com    (23 attempts today)
- amazon.com    (56 attempts today)
- reddit.com    (12 attempts today)

Total: 178 relapse attempts
Conclusion: You need a hobby
```

---

## 🛠️ Production Deployment

Want to run on a server? No problem!

**Windows**:
```cmd
deploy.bat
```

**Linux/Mac**:
```bash
chmod +x deploy.sh
./deploy.sh
```

Deployment script automatically:
1. ✅ Installs production dependencies
2. ✅ Initializes database
3. ✅ Builds application
4. ✅ Starts production server

---

## 🤔 FAQ

### Q: Can I bypass the blocking?
**A:** Yes, just uninstall the Tampermonkey script. But:
- Your relapse data will be recorded
- You'll see how weak you are
- Your conscience will judge you

### Q: Is my data uploaded anywhere?
**A:** Nope! All data stored in local SQLite. Only you can see how much you fail.

### Q: Can I still access blocked sites?
**A:** Yes! After reading the sage quote, click "Back to Console" to uninstall the script.

### Q: Why called ZenBlock?
**A:** Zen (禅) + Block = Find inner peace through intervention 🧘

### Q: Does this actually work?
**A:** Depends on you. Tools are just tools - real self-discipline comes from within.  
(But at least you'll see how much time you waste daily)

---

## 💡 Advanced Usage

### 1. Whitelist Time Periods
```javascript
// Modify Tampermonkey script with time check
const hour = new Date().getHours();
if (hour >= 9 && hour <= 18) {
    // Only block during work hours
    window.location.href = blockUrl;
}
```

### 2. Custom Sage Quotes
Edit `messages/en.json`:
```json
"ZenQuotes": [
  {
    "text": "You again?!",
    "author": "Your Conscience"
  }
]
```

### 3. Export Data Analysis
```bash
# Export database
sqlite3 prisma/dev.db ".dump" > my_shame.sql

# Analyze with Python
python analyze_my_life.py
```

---

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router) - because it's fast
- **Language**: TypeScript - because type safety
- **Database**: SQLite + Prisma - because simple
- **Styling**: Tailwind CSS - because CSS is boring
- **Charts**: Recharts - because pretty
- **i18n**: next-intl - because global

**100% Offline** - No internet needed, 100% privacy!

---

## 🤝 Contributing

Contributions welcome!

1. Fork this repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Submit Pull Request

---

## 📄 License

MIT License - Use freely, don't blame me

---

## 🙏 Acknowledgments

- **Marcus Aurelius** - Thanks for Meditations
- **All procrastinators** - Without you, no project
- **YouTube/TikTok/Amazon** - Thanks for teaching me time is precious

---

## 🎨 Screenshots Preview

### Homepage - Script Generator
```
┌─────────────────────────────────┐
│  ZenBlock Digital Zen           │
│  Reclaim Your Attention         │
├─────────────────────────────────┤
│  [youtube.com            ]      │
│  [Generate Script]              │
├─────────────────────────────────┤
│  // Generated script            │
│  [Copy] [Install]               │
└─────────────────────────────────┘
```

### Intercept Page - Sage Mode
```
┌─────────────────────────────────┐
│          Breathe.               │
│                                 │
│  You were seeking dopamine.    │
│  You found peace instead.      │
│                                 │
│  This is your 42nd attempt     │
│                                 │
│  "The happiness of your life   │
│   depends on the quality of    │
│   your thoughts."              │
│  — Marcus Aurelius             │
└─────────────────────────────────┘
```

### Dashboard - Data Slap
```
┌─────────────────────────────────┐
│  Today: 87  Total: 1234         │
├─────────────────────────────────┤
│  📊 24h Distribution [chart]    │
│  📅 30d Heatmap [heatmap]       │
└─────────────────────────────────┘
```

---

<div align="center">

### 🌟 If This Project Helped You, Give it a Star!

**Remember: Time is your only real wealth**

**Start reclaiming your time NOW!** 💪

[⬆ Back to Top](#zenblock--digital-self-discipline-savior)

</div>

---

**P.S.** If you still can't open YouTube after reading this README, congrats - you're on the path to self-discipline! 🎉

**P.P.S.** If you clicked here from YouTube... well... you know 😏
