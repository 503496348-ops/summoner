---
name: summoner
version: 1.0.0
description: 召物少年（Summoner）— AI小说转漫画生成平台。输入小说文本，AI自动拆解剧情、生成漫画分格
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
