---
name: summoner
description: "漫画分层布局生成 — 为气泡、面板、图层自动规划布局方案"
license: MIT
metadata:
  author: 503496348-ops
  version: 1.0.0
---

# Summoner — 漫画分层布局生成

## 触发条件

- "漫画"
- "分镜"
- "分层布局"
- "comic layout"
- "分格"

为漫画页面的气泡、面板和图层自动规划布局方案。

## 核心能力

| 命令 | 说明 |
|------|------|
| `summoner generate` | 根据气泡列表生成分层布局方案 |
| `summoner list-styles` | 列出可用的漫画风格（manga/webtoon/comic/panel） |

## 快速开始

```bash
# 生成漫画布局
python3 scripts/cli.py generate --bubbles "你好:Alice" "再见:Bob"

# 查看可用风格
python3 scripts/cli.py list-styles
```

## 架构

- `tools/layered_comic_layout.py` — 核心布局算法（Bubble/ComicLayerPlan 数据结构）
- `scripts/cli.py` — 统一 CLI 入口

## 测试

```bash
python3 -m pytest tests/ -q
```
