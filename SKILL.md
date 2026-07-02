---
name: summoner
version: 1.0.0
description: "AI小说转漫画生成平台。输入小说文本，AI自动拆解剧情、提取角色、生成漫画分格（含对话气泡、内心独白、音效）。当需要将小说/故事转换为漫画、生成漫画分镜时使用。"
author: AtomCollide-智械工坊团队
license: Apache-2.0
triggers:
  - 漫画生成
  - 小说转漫画
  - AI漫画
  - comic generation
  - 召物少年
  - summoner
---

# 召物少年-Summoner

> 📖 详细文档见 `references/` 目录

## Product Metadata / 产品元数据

| Field | Value |
|-------|-------|
| **Product Name** | 召物少年-Summoner |
| **Internal ID** | summoner |
| **Category** | AI创作工具 / AI Creative Tools |
| **Team** | AtomCollide-智械工坊 |
| **License** | Apache-2.0 |
| **Tech Stack** | Next.js 14, React 18, TypeScript, Tailwind CSS, Zustand |
| **Repository** | https://github.com/503496348-ops/summoner |

## Description / 描述

AI小说转漫画生成平台。输入小说文本，AI自动拆解剧情、提取角色、生成漫画分格（含对话气泡、内心独白、音效）。支持多种漫画风格。

AI-powered novel-to-comics generation platform. Input story text and the AI automatically decomposes the plot, extracts characters, and generates comic panels with speech bubbles, inner monologues, and sound effects.

## Key Capabilities / 核心能力

- **Story Decomposition**: LLM-powered plot analysis and scene extraction
- **Character Extraction**: Automatic character identification and consistency
- **Panel Generation**: Dynamic comic panel layout with multiple styles
- **Speech Bubbles**: Dialogue and inner monologue rendering
- **Sound Effects**: SFX text integration
- **Multi-Engine**: SDXL, DALL-E, Replicate rendering backends
- **Multi-LLM**: OpenAI, Anthropic, Groq, HuggingFace support

## Architecture / 架构

- **Frontend**: Next.js App Router + React + Tailwind + shadcn/ui
- **State**: Zustand store with localStorage persistence
- **LLM Layer**: Abstracted provider interface via `predict()` function
- **Rendering**: Multi-provider image generation with automatic fallbacks
- **Fonts**: 13 custom comic fonts
- **Presets**: 4 main comic style categories with extensible config

## 工作流

使用此技能时，按以下步骤执行：
- [ ] 1. 确认用户需求和使用场景
- [ ] 2. 加载相关代码和配置
- [ ] 3. 执行核心功能
- [ ] 4. 验证输出结果
- [ ] 5. 反馈给用户
## 2026-07-02 融合增强

- 召物少年新增漫画页分层布局契约：背景、分格框架、角色资产与可编辑气泡分离，便于后续局部修订。

