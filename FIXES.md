# ZenBlock 项目修复说明

## 已修复的问题

### 1. 多语言配置问题 ✅
- **问题**: messages/zh.json 和 en.json 缺少完整的翻译项
- **修复**: 
  - 添加了 Dashboard、Common 等命名空间的完整翻译
  - 修正了英文翻译中的中文字符错误
  - 增加了所有页面所需的翻译键值

### 2. next-intl 配置问题 ✅
- **问题**: next.config.ts 中未正确指定 i18n 配置文件路径
- **修复**: 更新为 `createNextIntlPlugin('./src/i18n/request.ts')`

### 3. ZenQuote 组件服务端渲染问题 ✅
- **问题**: ZenQuote 组件使用了 React Hooks (useState, useEffect)，但在服务端组件中使用
- **修复**: 在文件顶部添加 `'use client'` 指令，将其转换为客户端组件

### 4. 脚本生成功能改进 ✅
- **问题**: 生成的 Tampermonkey 脚本缺少正确的部署地址和 locale 信息
- **修复**:
  - generate-script action 现在接收 locale 和 baseUrl 参数
  - ScriptGenerator 组件自动获取当前 URL 和 locale
  - 生成的脚本包含完整的元数据和正确的跳转 URL

### 5. Dashboard 页面完善 ✅
- **问题**: Dashboard 页面使用模拟数据，未连接真实数据库
- **修复**:
  - 连接 Prisma 数据库，读取真实的 relapse 日志
  - 实现了按小时统计的图表数据
  - 实现了 30 天热力图数据
  - 添加了今日尝试、总计尝试、上次尝试等统计卡片
  - 更新图表组件以支持新的数据格式和多语言

### 6. 图表组件更新 ✅
- **DailyRelapseChart**: 
  - 更新数据接口为 `{ hour: number, count: number }`
  - 添加多语言支持
  - 改进视觉样式（红色柱状图，圆角，网格线）
  
- **RelapseHeatmap**:
  - 更新数据接口为 `{ date: string, count: number }`
  - 实现基于强度的颜色方案
  - 添加悬停提示和图例

### 7. 单文件 Lite 版本 ✅
- **位置**: `public/zenblock-lite.html`
- **特性**:
  - 完全独立的单 HTML 文件，无需部署
  - 使用 localStorage 存储数据（替代数据库）
  - 包含完整功能：脚本生成、拦截页面、仪表盘
  - 支持中英双语切换
  - 响应式设计，适配移动端
  - 数据可视化（使用 Recharts CDN）

## 新增功能

### 页面导航
- 首页添加"查看数据仪表盘"按钮
- Dashboard 添加"返回首页"按钮
- Intercept 页面添加"返回控制台"按钮

### 数据统计
- 今日尝试次数统计
- 总计尝试次数
- 上次尝试时间
- 24小时意志力薄弱时段分布图
- 30天破戒热力图

## 使用说明

### 标准版本（需要部署）

1. 安装依赖:
```bash
cd zenblock_new
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

4. 访问: http://localhost:3000

### Lite 版本（单文件，无需部署）

1. 直接在浏览器中打开 `public/zenblock-lite.html`
2. 或者托管到任何静态服务器上（如 GitHub Pages）
3. 数据存储在浏览器的 localStorage 中

## 文件结构变化

```
zenblock_new/
├── messages/
│   ├── en.json (已更新 - 完整翻译)
│   └── zh.json (已更新 - 完整翻译)
├── public/
│   └── zenblock-lite.html (新增 - 单文件版本)
├── src/
│   ├── actions/
│   │   └── generate-script.ts (已更新 - 支持 locale 和 baseUrl)
│   ├── app/
│   │   └── [locale]/
│   │       ├── page.tsx (已更新 - 添加 Dashboard 链接)
│   │       ├── ScriptGenerator.tsx (已更新 - 传递 locale)
│   │       ├── dashboard/
│   │       │   └── page.tsx (已更新 - 连接真实数据)
│   │       └── intercept/
│   │           └── page.tsx (保持不变)
│   ├── components/
│   │   ├── ZenQuote.tsx (已更新 - 添加 'use client')
│   │   └── charts/
│   │       ├── DailyRelapseChart.tsx (已更新 - 新数据格式)
│   │       └── RelapseHeatmap.tsx (已更新 - 新数据格式)
│   └── i18n/
│       └── request.ts (保持不变)
└── next.config.ts (已更新 - 正确的 i18n 路径)
```

## 技术栈

### 标准版本
- Next.js 16.1.1 (App Router)
- React 19.2.3
- TypeScript 5
- Prisma (SQLite)
- next-intl 4.6.1
- Recharts 3.6.0
- Tailwind CSS 4

### Lite 版本
- React 18.2.0 (UMD)
- Recharts 2.12.7 (UMD)
- Tailwind CSS (CDN)
- localStorage API

## 多语言支持

支持的语言：
- 中文 (zh)
- 英文 (en)

默认语言：中文

切换方式：
- 标准版：通过 URL 路径 (/zh 或 /en)
- Lite版：页面右上角的语言切换按钮

## 注意事项

1. **数据库迁移**: 首次运行前务必执行 `npx prisma migrate dev`
2. **Lite 版本限制**: 
   - 数据仅存储在本地浏览器
   - 清除浏览器数据会丢失所有记录
   - 不支持跨设备同步
3. **生产部署**: 
   - 需要配置正确的 baseUrl
   - 建议使用环境变量管理配置
   - 可以使用 Docker 部署

## 未来改进建议

1. 添加数据导出功能
2. 实现云端数据同步
3. 添加更多斯多葛哲学语录
4. 支持自定义主题颜色
5. 添加周报/月报功能
6. 实现多域名批量管理

## 问题反馈

如有问题，请检查：
1. Node.js 版本是否 >= 18
2. 是否正确运行了数据库迁移
3. 端口 3000 是否被占用
4. 浏览器控制台是否有错误信息
