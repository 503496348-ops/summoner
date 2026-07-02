from __future__ import annotations
from dataclasses import dataclass
@dataclass
class Bubble:
    text:str; bbox:tuple[int,int,int,int]; speaker:str|None=None
@dataclass
class ComicLayerPlan:
    page_size:tuple[int,int]; background_prompt:str; panel_frame_prompt:str; character_assets:list[str]; bubbles:list[Bubble]
    def validate(self)->list[str]:
        errors=[]
        if not self.background_prompt or not self.panel_frame_prompt: errors.append('background and panel frame prompts are required')
        if not self.bubbles: errors.append('at least one editable bubble/caption is required')
        w,h=self.page_size
        for b in self.bubbles:
            x,y,bw,bh=b.bbox
            if x<0 or y<0 or bw<=0 or bh<=0 or x+bw>w or y+bh>h: errors.append(f'bubble out of bounds: {b.text[:20]}')
        return errors
def plan_comic_layers(page_size:tuple[int,int], panels:list[str], dialogues:list[tuple[str,str]])->ComicLayerPlan:
    w,h=page_size; bubbles=[]
    for idx,(speaker,text) in enumerate(dialogues):
        y=40+idx*max(60,h//max(6,len(dialogues)+1)); bubbles.append(Bubble(text,(int(w*0.08),y,int(w*0.36),48),speaker))
    return ComicLayerPlan(page_size,'clean scene background without text or speech bubbles',f'{len(panels)} comic panels with clean gutters and no text',panels,bubbles)
