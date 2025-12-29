# ZenBlock 版本变更历史

本文件记录 ZenBlock 项目的所有重要变更。

## [未发布] - 2025-12-29

### 代码规范优化

#### 修复 (Fixed)
- **多语言规范**: 修复 `layout.tsx` 中使用三元表达式处理 description 的问题
  - 将 description 文本移至 `messages/zh.json` 和 `messages/en.json`
  - 使用 `t('description')` 代替硬编码文本
  - 文件: `src/app/[locale]/layout.tsx`

- **SVG 图标处理**: 修复内联 SVG 的使用
  - 创建 `public/favicon.svg` 文件
  - 移除 data URI 内联 SVG
  - 使用标准的文件引用方式
  - 文件: `public/favicon.svg`, `src/app/[locale]/layout.tsx`

#### 离线支持 (Offline Support)
- **移除 Google Fonts 依赖**: 
  - 删除 `next/font/google` 的 Geist 和 Geist_Mono 字体
  - 使用系统字体栈: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif`
  - 更新文件: `src/app/[locale]/layout.tsx`, `src/app/globals.css`

- **确认离线兼容性**:
  - ✅ lucide-react: NPM 包，离线可用
  - ✅ recharts: NPM 包，离线可用
  - ✅ Next.js: 静态资源，离线可用
  - ✅ Tailwind CSS: 编译时处理，离线可用

#### 新增功能 (Added)
- **下拉式语言切换器**:
  - 替换原有的切换按钮为下拉选择框
  - 显示当前使用的语言名称（中文/English）
  - 支持点击外部关闭下拉菜单
  - 文件: `src/components/LanguageSwitcher.tsx`

- **ZenQuote 多语言化**:
  - 将所有哲学语录移至 i18n 文件
  - 添加 `ZenQuotes` 数组到 `messages/zh.json` 和 `messages/en.json`
  - 支持中英文不同的语录内容
  - 文件: `src/components/ZenQuote.tsx`

#### 多语言内容 (i18n)
- 添加翻译键:
  - `Common.description`: 网站描述
  - `Common.currentLanguage`: 当前语言
  - `ZenQuotes`: 5条斯多葛哲学语录数组

---

## [1.0.0] - 2025-12-29

### 初始发布 (Initial Release)

#### 核心功能 (Features)
- 🛡️ **脚本生成器**: 生成 Tampermonkey/ScriptCat 拦截脚本
- 📊 **数据仪表盘**: 24小时时段分布图和30天热力图
- 🌍 **多语言支持**: 完整的中英文界面
- 🌓 **深色模式**: 亮色/暗色主题切换
- 📱 **响应式设计**: 适配各种设备尺寸
- 🎯 **多网站管理**: 支持多个网站的独立统计

#### 技术架构 (Technical)
- Next.js 15 (App Router)
- TypeScript (Strict Mode)
- SQLite (Prisma ORM)
- Tailwind CSS
- next-intl (i18n)
- Recharts (图表)
- Lucide React (图标)

#### 数据库 (Database)
- `RelapseLog`: 访问记录表
  - 字段: id, source, timestamp, locale
  - 索引: timestamp, source, (source, timestamp)
- `BlockRule`: 拦截规则表
  - 字段: id, domain, createdAt

#### 组件 (Components)
- `ThemeToggle`: 主题切换按钮
- `LanguageSwitcher`: 语言选择器（下拉式）
- `ZenQuote`: 随机禅意语录
- `ScriptGenerator`: 脚本生成和下载
- `DashboardClient`: 网站筛选器
- `DailyRelapseChart`: 24小时柱状图
- `RelapseHeatmap`: 30天热力图

#### 部署 (Deployment)
- `start.bat`: Windows 开发环境启动
- `start.sh`: Linux/Mac 开发环境启动
- `deploy.bat`: Windows 生产环境部署
- `deploy.sh`: Linux/Mac 生产环境部署

---

## 变更类型说明

- **Added**: 新增功能
- **Changed**: 功能变更
- **Deprecated**: 即将废弃的功能
- **Removed**: 已移除的功能
- **Fixed**: Bug 修复
- **Security**: 安全性修复
- **i18n**: 多语言相关
- **Offline Support**: 离线支持相关

---

## 版本规范

本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范：

- **主版本号**: 不兼容的 API 修改
- **次版本号**: 向下兼容的功能性新增
- **修订号**: 向下兼容的问题修正

---

## 贡献指南

所有变更必须在此文件中记录，包括：
1. 变更日期
2. 变更类型
3. 详细描述
4. 影响的文件列表

提交格式示例：
```
### 新增功能 (Added)
- **功能名称**: 功能描述
  - 详细说明 1
  - 详细说明 2
  - 文件: `路径/文件名`
```
