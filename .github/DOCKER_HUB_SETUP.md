# Docker Hub 自动发布配置指南

本项目使用 GitHub Actions 自动构建 Docker 镜像并发布到 Docker Hub。

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

### 4. 触发构建

配置完成后，以下操作会自动触发镜像构建和发布：

#### 自动触发：
- 推送代码到 `master` 分支
- 创建 Pull Request 到 `master` 分支
- 创建版本标签（如：`v1.0.1`）

#### 手动触发：
1. 打开 GitHub 仓库的 Actions 标签
2. 选择 "Build and Push Docker Image" workflow
3. 点击 "Run workflow"
4. 选择分支，点击 "Run workflow"

## 发布的镜像标签

工作流会自动生成以下标签：

- `latest` - 始终指向 master 分支的最新构建
- `master` - master 分支的最新构建
- `v1.0.1` - 版本标签（需要先创建 git tag）
- `1.0.1` - 版本号（去除 v 前缀）
- `1.0` - 主版本号.次版本号
- `1` - 主版本号

## 使用发布的镜像

### 拉取最新版本

```bash
docker pull malossov/zenblock:latest
```

### 拉取指定版本

```bash
docker pull malossov/zenblock:1.0.1
```

### 运行容器

```bash
docker run -d \
  --name zenblock \
  -p 3000:3000 \
  -v ./zenblock-data:/app/data \
  malossov/zenblock:latest
```

## 多平台支持

镜像支持以下平台：
- `linux/amd64` - x86_64 架构（常见服务器和 PC）
- `linux/arm64` - ARM64 架构（Apple Silicon、树莓派等）

## 版本发布流程

### 发布新版本

1. 更新版本号（如修改 package.json）
2. 提交代码并推送

```bash
git add .
git commit -m "chore: bump version to 1.0.2"
git push origin master
```

3. 创建并推送版本标签

```bash
git tag v1.0.2
git push origin v1.0.2
```

4. GitHub Actions 会自动：
   - 构建镜像
   - 标记为 `latest`, `v1.0.2`, `1.0.2`, `1.0`, `1`
   - 推送到 Docker Hub

## 查看构建状态

1. 打开 GitHub 仓库的 Actions 标签
2. 查看 "Build and Push Docker Image" workflow
3. 点击具体的运行记录查看日志

## 故障排查

### 构建失败

- 检查 Docker Hub Secrets 是否正确配置
- 确认 Access Token 没有过期
- 查看 GitHub Actions 日志中的具体错误信息

### 镜像推送失败

- 确认 Docker Hub 仓库存在且有写入权限
- 检查 Access Token 权限是否包含 Write
- 查看网络连接是否正常

### 无法拉取镜像

- 确认镜像名称正确：`malossov/zenblock`
- 如果是私有仓库，需要先登录：`docker login`
- 检查网络连接

## 本地测试

在推送前可以本地测试构建：

```bash
# 构建镜像
docker build -f docker/Dockerfile -t zenblock:test .

# 运行测试
docker run -d -p 3000:3000 zenblock:test

# 验证
curl http://localhost:3000/api/health
```

## 缓存优化

工作流已配置构建缓存，可以加快后续构建速度：
- 第一次构建：~5-10 分钟
- 后续构建（有缓存）：~2-3 分钟

## 相关链接

- Docker Hub 仓库: https://hub.docker.com/r/malossov/zenblock
- GitHub Actions 文档: https://docs.github.com/en/actions
- Docker Buildx 文档: https://docs.docker.com/buildx/working-with-buildx/
