# 可鹿 AI 心理咨询平台 (Kelu AI Counseling Platform)

本项目是一个面向心理咨询场景的 AI 增强型线上双端（咨询师端/用户端）协作平台。采用“时间池 (Availability Pool)”模型进行资源管理，并提供基于 Material Design 3 (M3) 规范的现代极简 UI/UX 体验。

## 🌟 核心特性

- **双端融合架构 (Dual-Entry Architecture)**：
  - 在同一个 React 项目中同时承载 C 端应用与 B 端工作台，底层 Zustand Store 数据完全打通，实现“用户下单 -> 咨询师接单”的数据流转闭环。
  - 访问 `/client` 进入用户端（C 端）。
  - 访问 `/counselor` 进入咨询师工作台（B 端）。
- **AI 增强咨询室 (AI-Enhanced Consultation Room)**：
  - **严格分离的服务模型**：视频咨询（支持画面与画中画）与音频咨询（呼吸波形光环动效）独立布局，从根本上防止服务越界。
  - **沉浸式 UI**：M3 规范的悬浮控制舱（Glassmorphism），操作聚焦且不遮挡主画面。
  - **AI 实时辅助面板 (AIAssistantPanel)**：半透明侧边栏，提供双端语音实时转录、AI 情绪波动洞察推送。
  - **咨询师专属工具**：内置临床观察笔记 (Scratchpad) 以及隐藏的最高级别危机风险一键上报功能。
  - **咨询闭环**：通话结束后，无缝衔接 AI 自动生成的咨询总结与复盘。
- **极致交互体验**：参考 Notion AI，全量使用 Framer Motion 实现丝滑的弹性（Spring）与共享布局（Layout）动效。

## 🛠 技术栈

- **前端框架**：React 18 + Vite
- **路由管理**：React Router v6
- **状态管理**：Zustand
- **样式方案**：Tailwind CSS
- **动画库**：Framer Motion (motion/react)
- **图标库**：Lucide React

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动本地开发服务器
npm run dev
```

本地服务器启动后，默认运行在 `http://localhost:3001`。

## 📋 目录架构简介

- `src/App.tsx` - B 端（咨询师工作台）入口与根组件。
- `src/client-app/ClientApp.tsx` - C 端（用户端）入口与根组件。
- `src/client-app/store.ts` - 驱动全局数据的 Zustand 状态管理中心。
- `src/client-app/pages/Counseling/VoiceCall.tsx` - AI 增强音视频咨询室核心组件。
- `src/components/` - B 端专属 UI 组件库。
- `src/client-app/components/` - C 端专属 UI 组件库。