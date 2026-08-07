# Smart-Stall 智慧摆摊

面向摆摊经营者的移动应用平台，围绕「**找位置 → 选品 → 设计广告 → 开张经营**」全流程提供一站式服务：

- **智能选址**：地图找位置、语音搜索、路线规划
- **AI 营销**：AI 海报生成与编辑、一键营销向导（选址规划 → 商品配置 → 广告设计 → 完成发布）
- **智能助手**：AI 对话「小智」（支持图文与语音播报）、天气策略官、AI 选品
- **经营工具**：库存管理、订单管理、待办事项、营业状态管理

## 目录结构

```
smart-stall/
├── pnpm-workspace.yaml          # pnpm workspace 配置 (apps/*)
├── package.json                 # 根脚本 (dev/build/start/lint)
├── README.md
└── apps/
    ├── backend/                 # NestJS 后端
    │   ├── src/
    │   │   ├── ai/              # AI 能力对接
    │   │   ├── auth/            # 认证与注册
    │   │   ├── conversation/    # 会话管理
    │   │   ├── inventory/       # 库存管理
    │   │   ├── message/         # 消息管理
    │   │   ├── oss/             # 阿里云 OSS 存储
    │   │   ├── poster/          # 海报管理
    │   │   ├── redis/           # Redis 全局模块
    │   │   ├── service/         # 第三方服务（短信/人脸/语音）
    │   │   ├── todo/            # 待办事项
    │   │   ├── upload/          # 文件上传
    │   │   ├── user/            # 用户模块
    │   │   ├── websocket/       # WebSocket 网关
    │   │   ├── transform/       # 全局响应拦截器
    │   │   └── http-exception/  # 全局异常过滤器
    │   └── .env                 # 本地环境变量（不入库）
    └── frontend/                # uni-app 前端
        ├── pages/               # 页面（33 个）
        │   ├── index/           # 首页（营业状态、营收概览）
        │   ├── login/           # 登录 / 注册 / 找回密码
        │   ├── map/             # 找位置 / 路线导航 / 地点搜索
        │   ├── my/              # 我的 / 个人资料 / 订单 / 库存
        │   └── function/        # AI 海报 / AI 对话 / 天气 / 待办 / 一键营销等
        ├── apis/                # 接口封装（ai/chat/file/inventory/poster/todo/user）
        ├── utils/               # 工具库（http 请求、音频、文本解析、地区数据）
        ├── components/          # 自定义组件（海报抽屉、格式化消息）
        └── uni_modules/         # DCloud uni-ui 官方组件库
```

## 技术栈

| 端 | 技术 |
|---|---|
| 前端 | uni-app (Vue 3) + HBuilderX，可打包 App / H5 / 微信小程序 |
| 后端 | NestJS 11 · TypeScript |
| 数据库 | MongoDB（Mongoose，6 张集合） |
| 缓存 | Redis（ioredis，短信验证码） |
| 实时通信 | WebSocket（ws，端口 3001，路径 /ws） |
| 文件存储 | 阿里云 OSS |
| 外部 AI | 火山引擎（豆包图文生成/理解、DeepSeek 对话、视频生成）、博查图片搜索 |
| 其他服务 | 阿里云短信、百度人脸识别 / 语音识别(ASR) / 语音合成(TTS)、百度地图 |

## 快速开始

### 环境要求

- Node.js ≥ 18
- pnpm ≥ 10
- MongoDB、Redis 本地实例

### 安装与启动

```bash
# 1. 根目录安装依赖（一次即可，前后端共享）
pnpm install

# 2. 配置环境变量
cp apps/backend/.env.example apps/backend/.env
# 编辑 .env，填入 MongoDB / Redis / 各第三方密钥

# 3. 启动后端（watch 模式，端口 3005）
pnpm dev

# 4. 构建 / 生产启动 / 代码检查
pnpm build
pnpm start
pnpm lint
```

### 前端运行

用 **HBuilderX** 打开 `apps/frontend` 目录，选择运行目标（App / 微信小程序 / 浏览器）即可。接口地址在 `apps/frontend/utils/http.js` 中配置（默认 `http://localhost:3005/stall`）。

## 后端接口总览

所有接口统一前缀 `/stall`，响应统一格式：`{ errno: 0, data }`（成功）或 `{ errno: -1, message }`（失败）。除登录注册等公开接口外，均需请求头携带 `Authorization: Bearer <token>`。

| 模块 | 接口 | 说明 |
|---|---|---|
| auth | `POST /auth/login` | 账号/手机号 + 密码登录，返回 JWT（access 1d + refresh 30d） |
| auth | `POST /auth/register-with-code` | 短信验证码注册 |
| auth | `POST /auth/send-register-code` | 发送注册验证码 |
| auth | `POST /auth/send-reset-password-code` | 发送重置密码验证码 |
| auth | `POST /auth/reset-password-with-code` | 验证码重置密码 |
| auth | `POST /auth/refresh-token` | 刷新 access token |
| auth | `GET /auth/profile` | 获取当前用户信息 |
| user | `PUT /user` | 修改个人资料 |
| ai | `POST /ai/chat` | AI 对话（流式，支持图片、联网搜索） |
| ai | `POST /ai/image/understand` | 图片理解（豆包） |
| ai | `POST /ai/image/generate` | 文生图（海报生成） |
| ai | `POST /ai/image/search` | 图片搜索（博查） |
| ai | `POST /ai/video/generate` + `GET /ai/video/generate/:id` | 提交 / 轮询视频生成任务 |
| upload | `POST /upload/image` / `POST /upload/file` / `POST /upload/multiple` | 单图 / 单文件 / 多图（≤5 张）上传至 OSS |
| poster | `POST/GET/PUT/DELETE /poster[/:id]` | 海报 CRUD（按用户隔离） |
| inventory | `POST/GET/PUT/DELETE /inventory[/:id]` | 库存商品 CRUD（含上/下架状态） |
| todo | `POST/GET/PUT/DELETE /todo[/:id]` | 待办事项 CRUD |
| conversation | `POST/GET/DELETE /conversation[/:id]` | 会话创建 / 列表 / 删除（AI/私聊/群聊） |
| message | `POST /message`、`GET /message?conversationId=` | 发送 / 拉取消息 |
| service | `POST /service/face/add` / `face/get` / `face/verify` | 人脸注册 / 查询 / 1:1 验证（百度） |
| service | `POST /service/voice/recognize` | 语音识别（百度 ASR） |

> 旧版 `user` 模块接口已 307 重定向至 `auth` 对应接口，前端可平滑过渡。

### 数据模型（MongoDB 集合）

| 集合 | 关键字段 |
|---|---|
| `users` | username(唯一)、phone(唯一)、password、avatar、nickname、gender、email、sign |
| `conversations` | userId、title、type(AI/private/group) |
| `messages` | conversationId、senderId(-1 为 AI)、type、content、image |
| `inventories` | userId、name、price、image、total/available/reserved/ordered、status、sku、sign、category |
| `posters` | ownerId、title、description、image、size、style、viewCount、downloadCount |
| `todos` | userId、startTime、endTime、tasks[] |

## 核心功能说明

### 一键营销（one-click-market）

四步向导，是平台的旗舰流程：

1. **智能选址规划** → 按行业 / 客群筛选推荐摆摊点位
2. **商品配置** → AI 选品与定价策略
3. **广告设计** → 上传商品图，AI 生成海报
4. **完成发布** → 预览并选择发布平台（全国省市地区数据在 `utils/data.js`）

### AI 海报

- 素材上传 → 豆包**图片理解**自动识别商品信息 → 文生图生成海报（支持多种风格：简洁/彩色/极简/复古）
- 生成后可继续编辑，海报持久化保存，支持查看与下载计数

### AI 对话「小智」

- 流式对话，支持上传图片、联网搜索
- 回复自动格式化渲染（标题/列表/加粗），支持百度 TTS 语音播报

### 实时通信

WebSocket 网关（端口 3001，路径 `/ws`）：连接建立即下发 `connection_established`；支持 `join_room` / `leave_room` / `chat`（房间广播）/ `ping-pong` 心跳。

## 开发约定

- **工作区命令**：所有 pnpm 命令在根目录执行；`pnpm --filter backend <script>` 可单独操作后端
- **响应格式**：后端统一 `{ errno, data | message }`，前端 `utils/http.js` 已封装自动解析、401 自动刷新 token（带请求队列）
- **密钥安全**：`.env` 不入库，新环境复制 `.env.example` 填写
- **前端 mock 说明**：部分页面（天气策略、收藏、消息中心、一键营销部分步骤）当前使用本地模拟数据，后续接入真实接口

## 常见问题

| 问题 | 处理 |
|---|---|
| 后端启动报 MongoDB 连接失败 | 确认本地 MongoDB 已启动，`MONGO_HOST/PORT` 正确 |
| 短信验证码收不到 | 检查 Redis 是否运行、`ALIYUN_SMS_APP_CODE` 是否有效 |
| 图片上传失败 | 检查 OSS 密钥与 bucket 配置 |
| HBuilderX 运行前端报错 | 重新打开 `apps/frontend` 并重新编译（`unpackage` 为构建产物，已 gitignore） |
