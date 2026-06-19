# 召物少年-Summoner

> AI小说转漫画生成平台 | AI Novel-to-Comics Generation Platform

## 简介

**召物少年-Summoner** 是一个AI驱动的小说转漫画生成平台。输入小说文本，AI自动拆解剧情、提取角色、生成漫画分格（含对话气泡、内心独白、音效）。支持多种漫画风格。

**Summoner** is an AI-powered platform that transforms novels into comics. Input your story text, and the AI automatically decomposes the plot, extracts characters, and generates comic panels complete with speech bubbles, inner monologues, and sound effects. Multiple comic styles supported.

## Features / 功能

- 🎨 **多风格漫画生成** / Multiple comic art styles
- 📖 **智能剧情拆解** / Intelligent story decomposition
- 👤 **角色自动提取** / Automatic character extraction
- 💬 **对话气泡生成** / Speech bubble generation
- 🧠 **内心独白** / Inner monologue support
- 🔊 **音效文字** / Sound effect text
- 📐 **分格布局** / Panel layout generation
- 🔤 **多字体支持** / Multiple comic fonts
- 🖼️ **多渲染引擎** / Multiple rendering engines (SDXL, DALL-E, Replicate)

## Tech Stack / 技术栈

- Next.js 14 + React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Zustand state management
- Multiple LLM providers (OpenAI, Anthropic, Groq, HuggingFace)
- Multiple image generation engines

## Getting Started / 快速开始

```bash
npm install
cp .env.example .env.local  # Configure your API keys
npm run dev
```

## Environment Variables / 环境变量

See `.env.example` for all configurable options including LLM and rendering engine settings.

## License

Apache-2.0

## Author

**AtomCollide-智械工坊**

---

*召物少年-Summoner — 让每个故事都有画面*
