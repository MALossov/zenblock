# ZenBlock - 数字主权收复系统

![ZenBlock](https://img.shields.io/badge/ZenBlock-Digital%20Zen-blue)
![License](https://img.shields.io/badge/license-MIT-green)

通过强制性的介入与可视化的反思，帮助使用者重获对时间的掌控权。

## ✨ 功能特性

- 🛡️ **强制拦截**: 生成油猴脚本，拦截指定网站访问
- 📊 **数据可视化**: 24小时时段分布图和30天热力图
- 🌍 **多语言支持**: 中文/英文界面切换
- 🌓 **深色模式**: 支持亮色/暗色主题切换
- 📱 **响应式设计**: 完美适配各种设备
- 🎯 **多网站管理**: 支持添加多个网站并分别查看统计
- 💾 **本地部署**: SQLite 数据库，数据完全在本地

## 🚀 快速开始

### 开发环境

Windows:
```cmd
start.bat
```

Linux/Mac:
```bash
chmod +x start.sh
./start.sh
```

访问地址:
- 中文版: http://localhost:3000/zh
- 英文版: http://localhost:3000/en

### 生产部署

Windows:
```cmd
deploy.bat
```

Linux/Mac:
```bash
chmod +x deploy.sh
./deploy.sh
```

## 📖 使用指南

### 1. 生成拦截脚本

1. 在首页输入要拦截的网站域名 (如 `bilibili.com`)
2. 点击"生成拦截脚本"按钮
3. 点击"一键安装"下载脚本，或复制脚本内容

### 2. 安装脚本

**方法一：一键安装**
- 点击"一键安装"按钮下载 `.user.js` 文件
- 在浏览器中打开下载的文件
- Tampermonkey/ScriptCat 会自动识别并提示安装

**方法二：手动安装**
- 打开 Tampermonkey/ScriptCat 扩展
- 创建新脚本
- 粘贴生成的脚本代码
- 保存

### 3. 查看数据

访问仪表盘页面，可以：
- 查看今日/总计尝试次数
- 按网站筛选数据
- 查看24小时薄弱时段分布
- 查看30天热力图
- 获得随机禅意语录

## 🛠️ 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **数据库**: SQLite (Prisma ORM)
- **国际化**: next-intl
- **样式**: Tailwind CSS
- **图表**: Recharts
- **图标**: Lucide React

## 📁 项目结构

```
zenblock_new/
├── src/
│   ├── app/
│   │   ├── [locale]/           # 国际化路由
│   │   │   ├── page.tsx        # 主页 - 脚本生成器
│   │   │   ├── dashboard/      # 数据仪表盘
│   │   │   └── intercept/      # 拦截页面
│   ├── components/
│   │   ├── ThemeToggle.tsx     # 主题切换
│   │   ├── LanguageSwitcher.tsx # 语言切换
│   │   ├── ZenQuote.tsx        # 禅意语录
│   │   └── charts/             # 图表组件
│   ├── actions/                # Server Actions
│   └── lib/                    # 工具函数
├── prisma/
│   └── schema.prisma           # 数据库模型
├── messages/                   # 国际化翻译
│   ├── zh.json
│   └── en.json
├── start.bat / start.sh        # 开发启动脚本
└── deploy.bat / deploy.sh      # 生产部署脚本
```

## 🌟 核心概念

### 数据模型

**RelapseLog** - 复态记录
- `id`: 主键
- `source`: 来源网站
- `timestamp`: 时间戳
- `locale`: 语言环境

**BlockRule** - 拦截规则
- `id`: 主键
- `domain`: 域名
- `createdAt`: 创建时间

### 工作原理

1. 用户输入要拦截的网站域名
2. 系统生成油猴脚本
3. 脚本拦截目标网站并重定向到反思页面
4. 自动记录访问日志到本地数据库
5. 数据可视化展示使用习惯

## 🔧 配置

### 环境变量

创建 `.env` 文件：

```env
DATABASE_URL="file:./prisma/dev.db"
```

### 端口配置

修改 `package.json` 中的端口：

```json
{
  "scripts": {
    "dev": "next dev -p 3000",
    "start": "next start -p 3000"
  }
}
```

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题或建议，请提交 Issue。

---

**ZenBlock** - 在算法编织的多巴胺牢笼中，寻求宁静。
