# ZenBlock 🛡️ 数字自律神器

> **OH! NO!! 又双叒叕刷到凌晨3点？！**  
> **说好的"就看5分钟"呢？！说好的早睡呢？！**  
> **别慌，让 ZenBlock 来拯救你的自制力！**

<div align="center">

![LOGO](./public/logo.svg)

![Version](https://img.shields.io/badge/version-1.0.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Offline](https://img.shields.io/badge/offline-100%25-brightgreen)

**一个让你重获时间掌控权的「强制拦截 + 数据可视化」工具**

[English](./README.md) | 简体中文

</div>

---

## 😱 你是否遇到这些问题？

- 📱 "就看一眼B站" → 3小时后："卧槽都凌晨了？！"
- 🎮 "打一局就睡" → 天亮了："我好像通宵了..."
- 🛒 "随便逛逛淘宝" → 购物车："您有137件商品待支付"
- 📺 "刷一会抖音" → 老板："你被开除了"

**如果你也有这些症状，恭喜你，你需要 ZenBlock！**

---

## 🎯 ZenBlock 能做什么？

### 💪 强力拦截
- 🚫 一键生成油猴脚本，拦截你指定的"时间黑洞"
- 🔒 打开网站 → 立即跳转到"贤者模式"页面
- 🧘 用斯多葛哲学语录治愈你的多巴胺成瘾

### 📊 数据可视化
- 📈 24小时热力图：看看你在哪个时间段最容易破戒
- 📅 30天日历视图：一眼看出你的"沦陷日"
- 🎯 多网站分别统计：精准打击你的每个坏习惯

### 🌍 贴心设计
- 🌓 亮/暗主题切换：保护你熬夜的眼睛
- 🗣️ 中英文双语：全球自律人士的选择
- 💾 完全离线：数据在本地，隐私有保障
- 📱 响应式设计：手机也能看数据打脸

---

## 🚀 快速开始

### 方法一：Docker 🐳（推荐）

**最简单的启动方式！** 无需配置任何环境。

#### 使用 Docker Compose

```bash
# 启动服务（创建并运行容器）
docker-compose -f docker/docker-compose.yml up -d

# 查看日志
docker-compose -f docker/docker-compose.yml logs -f zenblock

# 停止服务
docker-compose -f docker/docker-compose.yml down
```

#### 使用 Docker 命令

```bash
# 构建镜像
docker build -f docker/Dockerfile -t zenblock .

# 运行容器（带数据持久化）
docker run -d \
  --name zenblock \
  -p 3000:3000 \
  -v ./zenblock-data:/app/data \
  zenblock

# 查看日志
docker logs -f zenblock

# 停止并删除容器
docker stop zenblock && docker rm zenblock
```

#### Docker 配置详情

Docker 部署包含以下特性：
- ✅ **自动数据库迁移** - 容器启动时自动执行
- ✅ **数据持久化** - SQLite 数据库存储在主机的 `./zenblock-data/` 目录
- ✅ **健康检查** - 容器每30秒自动检查应用健康状态
- ✅ **生产优化** - 使用 Next.js standalone 输出，镜像体积最小
- ✅ **自动重启** - 容器失败时自动重启（unless-stopped 策略）

**数据存储位置**: 
- 数据库文件存储在本地 `./zenblock-data/dev.db`
- 可以通过复制此目录进行备份/恢复
- 即使删除并重建容器，数据也不会丢失

**访问应用**:
- 🇨🇳 中文版：http://localhost:3000/zh
- 🇬🇧 英文版：http://localhost:3000/en

---

### 方法二：本地开发

#### 安装依赖

```bash
# 克隆仓库
git clone https://github.com/yourusername/zenblock.git
cd zenblock/zenblock_new

# 安装依赖（建议使用 pnpm，更快！）
npm install
# 或者
pnpm install
```

#### 一键启动

**Windows 用户**（双击即可）：
```cmd
start.bat
```

**Mac/Linux 用户**：
```bash
chmod +x start.sh
./start.sh
```

脚本会自动：
1. 检查并安装依赖
2. 同步数据库
3. 启动开发服务器
4. 打开浏览器访问 http://localhost:3000

#### 访问
- 🇨🇳 中文版：http://localhost:3000/zh
- 🇬🇧 英文版：http://localhost:3000/en

---

## 📖 使用教程

### 🎬 拦截网站

1. 打开 ZenBlock 主页
2. 输入框输入：`bilibili.com`
3. 点击「生成拦截脚本」
4. 点击「一键安装」按钮
5. 油猴自动识别并安装
6. ✅ 完成！现在打开B站会看到贤者时刻页面

**效果演示**：
```
你：双击B站图标
B站：正在加载...
ZenBlock：🛑 深呼吸。这是你今天第7次想看B站了。
马可·奥勒留："浪费时间就是浪费生命。"
你：💪 好！去学习！
```

### 📊 查看数据统计

点击「查看仪表盘」，你会看到：
- **今日尝试**：今天你试图打开网站的次数
- **总计尝试**：你一生的耻辱次数
- **24小时分布图**：什么时候你最容易破戒
- **30天热力图**：可视化日历显示你的沦陷日

**24小时分布示例**：
```
23:00-03:00  ████████████████████  <- 你的黄金破戒时段
03:00-07:00  ██                    <- 终于睡了
07:00-12:00  ████                  <- 早上还能忍住
12:00-18:00  ██████████            <- 下午又开始了
```

### 🎯 管理多个网站

追踪并拦截多个时间杀手：
```
你的拦截清单：
- bilibili.com  （今日87次）
- douyin.com    （今日23次）
- taobao.com    （今日56次）

总计：166次破戒尝试
```

---

##  高级玩法

### 自定义贤者语录

编辑 `messages/zh.json` 或 `messages/en.json`：
```json
{
  "ZenQuotes": [
    {
      "text": "你又来了？！",
      "author": "你的良心"
    }
  ]
}
```

### 导出数据分析

```bash
# 访问数据库
docker exec -it zenblock sh
cd data

# 或者本地运行时
cd zenblock-data

# 导出数据库
sqlite3 dev.db ".dump" > backup.sql
```

---

## 📦 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **数据库**: SQLite + Prisma
- **样式**: Tailwind CSS
- **图表**: Recharts
- **国际化**: next-intl
- **部署**: Docker + Docker Compose

**完全离线** - 无需联网，隐私100%！

---

## 🤔 常见问题

### Q: 我可以绕过拦截吗？
**A:** 可以，卸载油猴脚本就行。但是你的破戒数据会被记录，你的良心会受到谴责。

### Q: 数据会上传吗？
**A:** 不会！所有数据存在本地 SQLite，只有你能看到自己有多菜。

### Q: Docker 会保留我的数据吗？
**A:** 会！数据库文件存储在主机的 `./zenblock-data/` 目录，容器重启或更新都不会丢失数据。

### Q: 如何备份数据？
**A:** 直接复制 `zenblock-data/` 目录。恢复时复制回去即可。

### Q: 可以在服务器上运行吗？
**A:** 当然可以！使用 Docker 部署效果最佳。记得开放3000端口并配置防火墙。

### Q: 这玩意真的有用吗？
**A:** 看你。工具只是工具，真正的自律在于你自己。但至少你能看到自己每天浪费多少时间。

---

## 🤝 贡献指南

欢迎各路大神贡献代码！

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交改动：`git commit -m '添加了牛逼的功能'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

---

## 📄 开源协议

MIT License - 随便用，出事别找我

---

## 🙏 致谢

- **马可·奥勒留** - 感谢你的《沉思录》
- **所有拖延症患者** - 没有你们就没有这个项目
- **B站/抖音/淘宝** - 感谢你们让我意识到时间的宝贵

---

<div align="center">

**记住：时间是你唯一真正拥有的财富**

**现在就开始夺回你的时间掌控权！** 💪

[⬆ 回到顶部](#zenblock--数字自律神器)

</div>

---

**P.S.** 如果你看完这个 README 后依然能控制住自己不刷视频，恭喜你，你已经开始自律了！🎉

**P.P.S.** 如果你用了这个工具还控制不住... 也许该考虑数字排毒旅行了 🏝️
