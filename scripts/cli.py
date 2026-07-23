#!/usr/bin/env python3
"""Summoner — 漫画生成工具 CLI"""
import argparse, json, sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

def cmd_generate(args):
    """Generate comic layout plan."""
    from tools.layered_comic_layout import plan_comic_layers, Bubble, ComicLayerPlan
    bubbles = []
    for item in args.bubbles:
        parts = item.split(':')
        if len(parts) >= 2:
            bubbles.append(Bubble(text=parts[0], bbox=(0,0,100,100), speaker=parts[1]))
        else:
            bubbles.append(Bubble(text=parts[0], bbox=(0,0,100,100)))
    plan = plan_comic_layers(bubbles)
    print(json.dumps({"bubbles": len(bubbles), "layers": str(plan)}, ensure_ascii=False, indent=2))

def cmd_list_styles(args):
    """List available comic styles."""
    styles = [
        {"name": "manga", "desc": "日式漫画风格"},
        {"name": "webtoon", "desc": "韩式条漫风格"},
        {"name": "comic", "desc": "美式漫画风格"},
        {"name": "panel", "desc": "四格漫画风格"},
    ]
    for s in styles:
        print(f"  {s['name']:12s} — {s['desc']}")


def cmd_info(args):
    """Show product info."""
    print(json.dumps({"product": "Summoner", "type": "漫画分层布局生成", "status": "ok"}, ensure_ascii=False, indent=2))
def main():
    p = argparse.ArgumentParser(description='Summoner 漫画生成工具')
    sub = p.add_subparsers(dest='command')

    gen = sub.add_parser('generate', help='生成漫画布局')
    gen.add_argument('--bubbles', nargs='+', required=True, help='气泡 text:speaker')
    gen.add_argument('--output', '-o', help='输出文件路径')

    sub.add_parser('list-styles', help='列出可用漫画风格')
    sub.add_parser('info', help='产品信息')

    args = p.parse_args()
    if args.command == 'generate': cmd_generate(args)
    elif args.command == 'list-styles': cmd_list_styles(args)
    elif args.command == 'info': cmd_info(args)
    else: p.print_help()

if __name__ == '__main__':
    main()
