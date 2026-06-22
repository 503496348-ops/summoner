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
- 🖼️ **多渲染引擎** / Multiple rendering engines (SDXL, DALL-E, Replicate, SiliconFlow)

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

## ⚠️ Image Generation Configuration (Required)

**You MUST configure at least one image generation API key.** Without a valid API key for one of the supported rendering engines, the app **cannot generate images**.

Choose **one** of the following rendering engines and configure the corresponding environment variables in your `.env.local`:

### Supported Rendering Engines

| Engine | Env Vars Required | Notes |
|--------|-------------------|-------|
| **INFERENCE_API** (Hugging Face) | `AUTH_HF_API_TOKEN`, `RENDERING_HF_INFERENCE_API_BASE_MODEL` | Free tier available. PRO account recommended for higher rate limits. Default model: `stabilityai/stable-diffusion-xl-base-1.0` |
| **REPLICATE** | `AUTH_REPLICATE_API_TOKEN`, `RENDERING_REPLICATE_API_MODEL`, `RENDERING_REPLICATE_API_MODEL_VERSION` | $5 free credit for new accounts. Default model: `stabilityai/sdxl` |
| **OPENAI** (DALL-E) | `AUTH_OPENAI_API_KEY` | Paid service. Default model: `dall-e-3`. Base URL configurable via `RENDERING_OPENAI_API_BASE_URL` |
| **SILICONFLOW** (硅基流动) | `SILICONFLOW_API_KEY` | Free tier available. **Recommended for Chinese users / 推荐中国用户使用**. Default model: `Qwen/Qwen-Image`. Get your key at https://cloud.siliconflow.cn/ |

Set the `RENDERING_ENGINE` variable to select your engine:

```bash
# Choose one:
RENDERING_ENGINE="INFERENCE_API"    # Hugging Face
RENDERING_ENGINE="REPLICATE"        # Replicate
RENDERING_ENGINE="OPENAI"           # OpenAI DALL-E
RENDERING_ENGINE="SILICONFLOW"      # SiliconFlow 硅基流动
```

You can also override the rendering engine from the **Settings** dialog in the app UI — no need to restart the server.

## LLM Engine Configuration (Optional)

The story generation feature supports multiple LLM providers:

| Engine | Env Vars Required | Notes |
|--------|-------------------|-------|
| **INFERENCE_API** (Hugging Face) | `AUTH_HF_API_TOKEN` | Free tier available |
| **OPENAI** | `AUTH_OPENAI_API_KEY` | ChatGPT models |
| **GROQ** | `AUTH_GROQ_API_KEY` | Fast open-source models |
| **ANTHROPIC** | `AUTH_ANTHROPIC_API_KEY` | Claude models |

## Environment Variables / 环境变量

See `.env.example` for all configurable options including LLM and rendering engine settings.

## License

Apache-2.0

## Author

**AtomCollide-智械工坊**

---

*召物少年-Summoner — 让每个故事都有画面*

---

## 🚀 加入AtomCollide-AI智能体实验室

**元素碰撞-AtomCollide-AI 智能体实验室** 是一个专注于AI领域的开源组织，汇聚了众多优秀学习者。

### 核心价值

**找工作：更省力，也更精准**
- 一线大厂内推通道（字节、阿里、腾讯等）
- 全链路求职赋能包（面试题库、简历优化、晋升指导）
- 线下技术沙龙 & 人脉网络

**学AI测试：真正落地，拒绝空谈**
- 从0到1实战落地体系（Skills、MCP、RAG、AI IDE等）
- 独家自研资料与工具矩阵
- 前沿技术同步与提效方案

### 加入社群

- [知识库入口](https://vcnvmnln7wit.feishu.cn/wiki/WpK2wAcV8i6P8tke8X9cLcmDnSh)
- [AI探索交流群](https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=074vd565-6084-455c-ac52-9703e89a0697)

---

*AtomCollide-智械工坊团队出品*

