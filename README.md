# ZenBlock 🛡️ Digital Self-Discipline Savior

> **OH! NO!! Scrolling through social media until 3 AM AGAIN?!**  
> **What happened to "just 5 minutes"?! What happened to "early to bed"?!**  
> **Don't panic - Let ZenBlock rescue your self-control!**

<div align="center">

![LOGO](./public/logo.svg)

![Version](https://img.shields.io/github/v/release/MALossov/zenblock?label=version)
![License](https://img.shields.io/badge/license-MIT-green)
![Offline](https://img.shields.io/badge/offline-100%25-brightgreen)
![Docker Pulls](https://img.shields.io/docker/pulls/malossov/zenblock)
![Docker Image Size](https://img.shields.io/docker/image-size/malossov/zenblock/latest)
![GitHub Release](https://img.shields.io/github/v/release/MALossov/zenblock)

**A "Forced Intervention + Data Visualization" Tool to Reclaim Your Time**

> This is a pure vibe-coding project, never expect any quality assurance or after-sales service, unless you are willing to fix it yourself (which I also actively welcome).

English | [🇨🇳 简体中文](./README.zh.md)

</div>

---

## 😱 Do You Have These Problems?

- 📱 "Just a quick check" → 3 hours later: "OMG it's 3 AM?!"
- 🎮 "One more round then sleep" → Sunrise: "Did I... pull an all-nighter?"
- 🛒 "Quick browse" → Cart: "You have 137 items waiting"
- 📺 "Scroll for a bit" → Boss: "You're fired"

**If you recognize these symptoms, you NEED ZenBlock!**

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
- 🌓 Light/Dark theme: Protect your eyes
- 🗣️ Bilingual (EN/中文): For global users
- 💾 100% Offline: Your data stays local, privacy guaranteed
- 📱 Responsive: Check stats on any device

---

## 🚀 Quick Start

### Method 1: Docker 🐳 (Recommended)

**The easiest way to get started!** No environment configuration needed.

#### Using Pre-built Images (Easiest!)

Pull and run from Docker Hub or GitHub Container Registry:

**Option 1: Docker Hub**
```bash
# Pull the latest image
docker pull malossov/zenblock:latest

# Run the container
docker run -d \
  --name zenblock \
  -p 3000:3000 \
  -v ./zenblock-data:/app/data \
  malossov/zenblock:latest
```

**Option 2: GitHub Container Registry**
```bash
# Pull the latest image
docker pull ghcr.io/malossov/zenblock:latest

# Run the container
docker run -d \
  --name zenblock \
  -p 3000:3000 \
  -v ./zenblock-data:/app/data \
  ghcr.io/malossov/zenblock:latest
```

#### Using Docker Compose

```bash
# Start service (creates and runs container)
docker-compose -f docker/docker-compose.yml up -d

# View logs
docker-compose -f docker/docker-compose.yml logs -f zenblock

# Stop service
docker-compose -f docker/docker-compose.yml down
```

#### Using Docker Commands

```bash
# Build image
docker build -f docker/Dockerfile -t zenblock .

# Run container with data persistence
docker run -d \
  --name zenblock \
  -p 3000:3000 \
  -v ./zenblock-data:/app/data \
  zenblock

# View logs
docker logs -f zenblock

# Stop and remove container
docker stop zenblock && docker rm zenblock
```

#### Docker Configuration Details

The Docker setup includes:
- ✅ **Automatic database migration** on startup
- ✅ **Data persistence** - SQLite database stored in `./zenblock-data/` on your host
- ✅ **Health checks** - Container monitors application health every 30s
- ✅ **Production optimization** - Uses Next.js standalone output for minimal image size
- ✅ **Auto-restart** - Container restarts automatically on failure (unless-stopped policy)

**Data Location**: 
- Database files are stored in `./zenblock-data/dev.db` on your local machine
- You can backup/restore by copying this directory
- Data persists even if you remove and recreate containers

**Access Application**:
- 🇨🇳 Chinese: http://localhost:3000/zh
- 🇬🇧 English: http://localhost:3000/en

---

### Method 2: Local Development

#### Install Dependencies

```bash
npm install
# or
pnpm install
```

#### One-Click Launch

**Windows**:
```cmd
start.bat
```

**Mac/Linux**:
```bash
chmod +x start.sh
./start.sh
```

The script automatically:
1. Checks and installs dependencies
2. Syncs database
3. Starts dev server
4. Opens browser at http://localhost:3000

#### Access
- 🇨🇳 Chinese: http://localhost:3000/zh
- 🇬🇧 English: http://localhost:3000/en

---

## 📖 Usage Guide

### 🎬 Block a Website

1. Open ZenBlock homepage
2. Enter domain: `youtube.com`
3. Click "Generate Interception Script"
4. Click "Install Script" button
5. Tampermonkey auto-installs
6. ✅ Done! Opening YouTube now shows Sage Mode

**Demo Effect**:
```
You: *clicks YouTube icon*
YouTube: Loading...
ZenBlock: 🛑 Breathe. This is your 7th attempt today.
Marcus Aurelius: "Waste no more time arguing what a good man should be. Be one."
You: 💪 Alright! Time to work!
```

### 📊 View Statistics

Click "View Dashboard" to see:
- **Today's Attempts**: How many times you tried today
- **Total Attempts**: Your lifetime shame count
- **24-Hour Distribution**: When you're most vulnerable
- **30-Day Heatmap**: Visual calendar of relapses

**24-Hour Distribution Example**:
```
23:00-03:00  ████████████████████  <- Your prime relapse hours
03:00-07:00  ██                    <- Finally asleep
07:00-12:00  ████                  <- Morning willpower
12:00-18:00  ██████████            <- Afternoon collapse
```

### 🎯 Manage Multiple Sites

Track and block multiple time-wasters:
```
Your Block List:
- youtube.com   (87 attempts today)
- tiktok.com    (23 attempts today)
- amazon.com    (56 attempts today)

Total: 166 relapse attempts today
```

---

## 💡 Advanced Usage

### Custom Sage Quotes

Edit `messages/en.json` or `messages/zh.json`:
```json
{
  "ZenQuotes": [
    {
      "text": "You again?!",
      "author": "Your Conscience"
    }
  ]
}
```

### Export Data Analysis

```bash
# Access the database
docker exec -it zenblock sh
cd data

# Or if running locally
cd zenblock-data

# Export database
sqlite3 dev.db ".dump" > backup.sql
```

---

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: SQLite + Prisma
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **i18n**: next-intl
- **Deployment**: Docker + Docker Compose

**100% Offline** - No internet needed, full privacy!

---

## 🤔 FAQ

### Q: Can I bypass the blocking?
**A:** Yes, just uninstall the Tampermonkey script. But your relapse data will be recorded and your conscience will judge you.

### Q: Is my data uploaded anywhere?
**A:** Nope! All data stored locally in SQLite. Only you can see your stats.

### Q: Does Docker persist my data?
**A:** Yes! Database files are stored in `./zenblock-data/` on your host machine, so data persists across container restarts and updates.

### Q: How do I backup my data?
**A:** Simply copy the `zenblock-data/` directory. Restore by copying it back.

### Q: Can I run this on a server?
**A:** Absolutely! Use Docker deployment for best results. Just make sure to expose port 3000 and configure your firewall.

### Q: Does this actually work?
**A:** Depends on you. Tools are just tools - real self-discipline comes from within. But at least you'll see how much time you're wasting daily.

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

<div align="center">

**Remember: Time is your only real wealth**

**Start reclaiming your time NOW!** 💪

[⬆ Back to Top](#zenblock--digital-self-discipline-savior)

</div>

---

**P.S.** If you can control yourself after reading this README, congratulations - you're already on the path to self-discipline! 🎉

**P.P.S.** If you still can't control yourself after using this tool, maybe it's time to consider a digital detox vacation 🏝️
