# ZenBlock 快速开始指南

## 🚀 快速启动

### 方式一：使用启动脚本（推荐）

**Windows 用户:**
```bash
start.bat
```

**Mac/Linux 用户:**
```bash
chmod +x start.sh
./start.sh
```

### 方式二：手动启动

1. 安装依赖:
```bash
npm install
```

2. 初始化数据库:
```bash
npx prisma migrate dev
```

3. 启动开发服务器:
```bash
npm run dev
```

4. 打开浏览器访问:
- 中文版: http://localhost:3000/zh
- 英文版: http://localhost:3000/en

## 📦 单文件 Lite 版本

如果你不想部署服务器，可以直接使用单文件版本：

1. 在浏览器中打开 `public/zenblock-lite.html`
2. 或者部署到任何静态服务器（GitHub Pages、Netlify 等）

**特点:**
- ✅ 无需安装依赖
- ✅ 无需数据库
- ✅ 完全离线可用
- ✅ 数据存储在浏览器本地

## 🎯 使用流程

### 1. 生成拦截脚本

1. 访问首页
2. 输入要拦截的网站域名（如：bilibili.com）
3. 点击"生成拦截脚本"
4. 复制生成的脚本

### 2. 安装 Tampermonkey 脚本

1. 安装 Tampermonkey 浏览器扩展
   - [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. 打开 Tampermonkey，创建新脚本
3. 粘贴复制的脚本
4. 保存

### 3. 测试拦截效果

1. 尝试访问你拦截的网站
2. 页面会自动跳转到 ZenBlock 拦截页面
3. 你会看到：
   - 今日尝试次数
   - 上次尝试时间
   - 意志力薄弱时段图表
   - 斯多葛哲学名言

### 4. 查看数据仪表盘

1. 点击"查看数据仪表盘"
2. 查看详细统计数据：
   - 今日/总计尝试次数
   - 24小时意志力分布图
   - 30天破戒热力图

## 🌍 多语言切换

- **标准版**: 访问 `/zh` 或 `/en` 路径
- **Lite 版**: 点击右上角的语言切换按钮

## 🛠️ 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint

# 数据库操作
npx prisma studio          # 打开数据库管理界面
npx prisma migrate dev     # 创建新的数据库迁移
npx prisma migrate deploy  # 应用数据库迁移
npx prisma db push         # 快速同步数据库（开发用）
```

## 📊 数据管理

### 查看数据库

```bash
npx prisma studio
```

这将打开一个 Web 界面，可以查看和编辑数据库中的数据。

### 导出数据

数据库文件位置: `prisma/dev.db`

你可以直接复制此文件进行备份。

### 清空数据

```bash
# 删除数据库文件
rm prisma/dev.db

# 重新创建数据库
npx prisma migrate dev
```

## 🎨 自定义配置

### 修改默认语言

编辑 `src/lib/routing.ts`:

```typescript
export const routing = defineRouting({
  locales: ['en', 'zh'],
  defaultLocale: 'zh'  // 改为 'en' 设置英文为默认
});
```

### 添加新语言

1. 在 `messages/` 目录下创建新的语言文件（如 `ja.json`）
2. 复制 `zh.json` 的内容并翻译
3. 更新 `src/lib/routing.ts` 添加新语言
4. 更新 `src/i18n/request.ts` 添加验证

### 修改样式

项目使用 Tailwind CSS，你可以：
- 直接修改组件的 className
- 在 `src/app/globals.css` 中添加自定义样式
- 修改 `tailwind.config.js` 自定义主题

## 🐛 常见问题

### 端口被占用

如果 3000 端口被占用，可以修改端口：

```bash
# Windows
set PORT=3001 && npm run dev

# Mac/Linux
PORT=3001 npm run dev
```

### 数据库错误

如果遇到数据库相关错误：

```bash
# 删除旧数据库
rm -rf prisma/dev.db prisma/migrations

# 重新初始化
npx prisma migrate dev --name init
```

### 构建错误

清除缓存并重新构建：

```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📝 项目结构

```
zenblock_new/
├── prisma/              # 数据库相关
│   ├── schema.prisma   # 数据模型定义
│   └── dev.db          # SQLite 数据库文件
├── public/             # 静态文件
│   └── zenblock-lite.html  # 单文件版本
├── src/
│   ├── actions/        # Server Actions (后端逻辑)
│   ├── app/           # Next.js App Router 页面
│   ├── components/    # React 组件
│   ├── i18n/          # 国际化配置
│   └── lib/           # 工具函数
├── messages/          # 多语言翻译文件
└── package.json       # 项目配置
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 MIT 许可证。

## 💡 灵感来源

本项目受到斯多葛哲学的启发，旨在帮助人们重获对注意力的控制权。

> "幸福的生活所需甚少；一切都在你的内心，在你的思维方式中。"
> 
> —— 马可·奥勒留
