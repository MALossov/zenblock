# Docker 镜像自动发布配置指南

本项目使用 GitHub Actions 自动构建 Docker 镜像并同时发布到：
- **Docker Hub**: `malossov/zenblock`
- **GitHub Container Registry (ghcr.io)**: `ghcr.io/malossov/zenblock`

## 配置步骤

### 1. 在 Docker Hub 创建仓库

1. 登录 [Docker Hub](https://hub.docker.com/)
2. 点击 "Create Repository"
3. 仓库名称设为：`zenblock`
4. 可见性选择：Public（公开）或 Private（私有）
5. 点击 "Create"

### 2. 创建 Docker Hub Access Token

1. 在 Docker Hub 点击右上角头像 → Account Settings
2. 选择 "Security" 标签
3. 点击 "New Access Token"
4. Token 名称：`github-actions`
5. 权限选择：`Read, Write, Delete`
6. 点击 "Generate"
7. **重要**：立即复制生成的 token，关闭后将无法再次查看

### 3. 在 GitHub 配置 Secrets

1. 打开你的 GitHub 仓库
2. 点击 Settings → Secrets and variables → Actions
3. 点击 "New repository secret"
4. 添加以下两个 secrets：

   **Secret 1:**
   - Name: `DOCKER_USERNAME`
   - Value: 你的 Docker Hub 用户名（如：`malossov`）

   **Secret 2:**
   - Name: `DOCKER_PASSWORD`
   - Value: 刚才创建的 Access Token

**注意**：GitHub Container Registry (ghcr.io) 不需要额外配置，GitHub Actions 会自动使用 `GITHUB_TOKEN`。

### 4. 触发构建

配置完成后，以下操作会自动触发镜像构建和发布：

#### 自动触发：
- 推送代码到 `master` 分支
- 创建 Pull Request 到 `master` 分支（仅构建不推送）
- 创建版本标签（如：`v1.0.2`）

#### 手动触发：
1. 打开 GitHub 仓库的 Actions 标签
2. 选择 "Build and Push Docker Image" workflow
3. 点击 "Run workflow"
4. 选择分支，点击 "Run workflow"

## 版本管理

### 自动版本管理

项目包含自动版本同步工作流，会自动从 `package.json` 读取版本号并创建 tag。

### 使用版本管理脚本

**Windows:**
```cmd
REM 升级补丁版本 (1.0.0 -> 1.0.1)
version-bump.bat patch

REM 升级次版本 (1.0.0 -> 1.1.0)
version-bump.bat minor

REM 升级主版本 (1.0.0 -> 2.0.0)
version-bump.bat major
```

**Linux/Mac:**
```bash
# 升级补丁版本
chmod +x version-bump.sh
./version-bump.sh patch

# 升级次版本
./version-bump.sh minor

# 升级主版本
./version-bump.sh major
```

脚本会自动：
1. 更新 `package.json` 中的版本号
2. 更新 README 文件中的版本徽章
3. 提交更改

然后推送到 GitHub：
```bash
git push origin master
```

GitHub Actions 会自动：
1. 检测版本变化
2. 创建版本 tag
3. 触发 Docker 镜像构建
4. 创建 GitHub Release

## 发布的镜像标签

工作流会自动生成以下标签：

### Docker Hub
- `malossov/zenblock:latest` - master 分支的最新构建
- `malossov/zenblock:master` - master 分支
- `malossov/zenblock:v1.0.2` - 版本标签
- `malossov/zenblock:1.0.2` - 版本号（去除 v）
- `malossov/zenblock:1.0` - 主版本号.次版本号
- `malossov/zenblock:1` - 主版本号

### GitHub Container Registry
- `ghcr.io/malossov/zenblock:latest`
- `ghcr.io/malossov/zenblock:master`
- `ghcr.io/malossov/zenblock:v1.0.2`
- `ghcr.io/malossov/zenblock:1.0.2`
- `ghcr.io/malossov/zenblock:1.0`
- `ghcr.io/malossov/zenblock:1`

## 使用发布的镜像

### 从 Docker Hub 拉取

```bash
# 拉取最新版本
docker pull malossov/zenblock:latest

# 拉取指定版本
docker pull malossov/zenblock:1.0.2
```

### 从 GitHub Container Registry 拉取

```bash
# 拉取最新版本
docker pull ghcr.io/malossov/zenblock:latest

# 拉取指定版本
docker pull ghcr.io/malossov/zenblock:1.0.2
```

### 运行容器

```bash
docker run -d \
  --name zenblock \
  -p 3000:3000 \
  -v ./zenblock-data:/app/data \
  malossov/zenblock:latest
```

或使用 ghcr.io：

```bash
docker run -d \
  --name zenblock \
  -p 3000:3000 \
  -v ./zenblock-data:/app/data \
  ghcr.io/malossov/zenblock:latest
```

## 多平台支持

镜像支持以下平台：
- `linux/amd64` - x86_64 架构（常见服务器和 PC）
- `linux/arm64` - ARM64 架构（Apple Silicon、树莓派等）

## GitHub Release

每次创建 tag 时，会自动创建 GitHub Release，包含：
- 📝 变更日志（自动生成）
- 🐳 Docker 镜像拉取命令
- 📚 文档链接
- 🚀 快速启动指南

查看所有 Release：https://github.com/MALossov/zenblock/releases

## 完整发布流程示例

### 发布新版本 v1.0.2

**方法 1：使用脚本（推荐）**

```bash
# Windows
version-bump.bat patch
git push origin master

# Linux/Mac
./version-bump.sh patch
git push origin master
```

**方法 2：手动操作**

```bash
# 1. 更新版本号
# 编辑 package.json，将 version 改为 "1.0.2"

# 2. 提交更改
git add package.json
git commit -m "chore: bump version to 1.0.2"
git push origin master

# 3. GitHub Actions 会自动创建 tag 和构建镜像
```

**方法 3：直接创建 tag**

```bash
# 1. 创建并推送 tag
git tag v1.0.2
git push origin v1.0.2

# 2. GitHub Actions 会自动：
#    - 构建 Docker 镜像
#    - 推送到 Docker Hub 和 ghcr.io
#    - 创建 GitHub Release
```

### 查看构建进度

1. 打开：https://github.com/MALossov/zenblock/actions
2. 查看工作流运行状态：
   - "Build and Push Docker Image" - 构建和推送镜像
   - "Create Release" - 创建 GitHub Release
   - "Sync Version and Create Tag" - 自动版本同步

## 故障排查

### Docker Hub 推送失败

- 检查 `DOCKER_USERNAME` 和 `DOCKER_PASSWORD` secrets 是否正确
- 确认 Access Token 没有过期且有写入权限
- 查看 GitHub Actions 日志获取详细错误

### GitHub Container Registry 推送失败

- 确认仓库有正确的权限设置
- 检查 workflow 的 `permissions` 配置
- ghcr.io 镜像默认是私有的，需要在 GitHub 包设置中改为公开

### 版本 tag 没有自动创建

- 确认 `package.json` 已正确更新并推送
- 检查 "Sync Version and Create Tag" workflow 是否运行
- 查看 workflow 日志确认是否有错误

### 无法拉取 ghcr.io 镜像

```bash
# 如果镜像是私有的，需要先登录
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# 然后拉取
docker pull ghcr.io/malossov/zenblock:latest
```

## 本地测试

在推送前可以本地测试构建：

```bash
# 构建镜像
docker build -f docker/Dockerfile -t zenblock:test .

# 多平台构建（需要 buildx）
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -f docker/Dockerfile \
  -t zenblock:test .

# 运行测试
docker run -d -p 3000:3000 zenblock:test

# 验证
curl http://localhost:3000/api/health
```

## 缓存优化

工作流已配置构建缓存：
- 第一次构建：~5-10 分钟
- 后续构建（有缓存）：~2-3 分钟

## 相关链接

- **Docker Hub**: https://hub.docker.com/r/malossov/zenblock
- **GitHub Container Registry**: https://github.com/MALossov/zenblock/pkgs/container/zenblock
- **GitHub Releases**: https://github.com/MALossov/zenblock/releases
- **GitHub Actions**: https://github.com/MALossov/zenblock/actions
- **Docker Buildx 文档**: https://docs.docker.com/buildx/working-with-buildx/
- **GitHub Packages 文档**: https://docs.github.com/en/packages
