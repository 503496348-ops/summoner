"""Tests for summoner CLI entry point."""
import subprocess, sys, os, pytest

SCRIPTS = os.path.join(os.path.dirname(__file__), '..', 'scripts')

def test_help():
    """CLI --help should exit 0."""
    r = subprocess.run([sys.executable, os.path.join(SCRIPTS, 'cli.py'), '--help'],
                       capture_output=True, text=True, timeout=10)
    assert r.returncode == 0
    assert 'summoner' in r.stdout.lower() or 'usage' in r.stdout.lower() or len(r.stdout) > 20

def test_info():
    """info command should return JSON."""
    r = subprocess.run([sys.executable, os.path.join(SCRIPTS, 'cli.py'), 'info'],
                       capture_output=True, text=True, timeout=10)
    assert r.returncode == 0
    assert 'status' in r.stdout or 'product' in r.stdout

def test_list_styles():
    """list-styles should return available styles."""
    r = subprocess.run([sys.executable, os.path.join(SCRIPTS, 'cli.py'), 'list-styles'],
                       capture_output=True, text=True, timeout=10)
    assert r.returncode == 0
    assert 'manga' in r.stdout or 'webtoon' in r.stdout
