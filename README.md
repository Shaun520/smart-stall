# Smart-Stall 智慧摆摊

面向摆摊经营者的移动应用：找位置、AI 海报、选品营销、库存管理的一站式平台。

## 项目结构

```
smart-stall/
├── pnpm-workspace.yaml        # pnpm workspace 配置
├── package.json               # 根脚本
└── apps/
    ├── backend/               # NestJS 后端 (端口 3005, 前缀 /stall)
    └── frontend/              # uni-app 前端 (Vue 3, HBuilderX)
```

## 技术栈

| 端 | 技术 |
|---|---|
| 前端 | uni-app (Vue 3) + HBuilderX，可打包 App / 微信小程序 |
| 后端 | NestJS 11 + MongoDB (Mongoose) + Redis (ioredis) + WebSocket |

## 快速开始

```bash
# 安装依赖（根目录执行一次即可）
pnpm install

# 启动后端 (watch 模式)
pnpm dev

# 构建后端
pnpm build
```

前端用 HBuilderX 打开 `apps/frontend`，运行前需配置好 MongoDB、Redis 及第三方 API 密钥（见 `apps/backend/.env.example`）。

## 后端模块

- `ai`：对接火山引擎（豆包/DeepSeek），支持对话、图片理解/生成、视频生成
- `auth`：JWT 登录注册、短信验证码
- `upload` / `oss`：阿里云 OSS 文件上传
- `service`：百度人脸识别、语音识别/合成、阿里短信
- `poster` / `inventory` / `todo`：海报、库存、待办管理
- `conversation` / `message` / `websocket`：AI/私聊/群聊、房间广播

## 环境要求

- Node.js ≥ 18
- pnpm ≥ 10
- MongoDB、Redis 本地实例