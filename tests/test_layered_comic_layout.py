import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from tools.layered_comic_layout import plan_comic_layers

def test_comic_layer_plan_validates():
    plan=plan_comic_layers((1200,1600), ['主角站在门口','远景城市'], [('A','我们开始吧'),('B','收到')])
    assert not plan.validate(), plan.validate()
