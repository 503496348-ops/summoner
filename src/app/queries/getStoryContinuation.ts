import { Preset } from "../engine/presets"
import { GeneratedPanel, LLMVendorConfig } from "@/types"
import { predictNextPanels } from "./predictNextPanels"
import { joinWords } from "@/lib/joinWords"
import { sleep } from "@/lib/sleep"
import {
  CharacterRegistry,
  updateCharacterRegistry,
} from "../engine/characterConsistency"

export type { CharacterRegistry }

export const getStoryContinuation = async ({
  preset,
  stylePrompt = "",
  userStoryPrompt = "",
  nbPanelsToGenerate,
  maxNbPanels,
  existingPanels = [],
  llmVendorConfig,
  characterRegistry,
}: {
  preset: Preset;
  stylePrompt?: string;
  userStoryPrompt?: string;
  nbPanelsToGenerate: number;
  maxNbPanels: number;
  existingPanels?: GeneratedPanel[];
  llmVendorConfig: LLMVendorConfig
  characterRegistry?: CharacterRegistry
}): Promise<{
  panels: GeneratedPanel[]
  updatedRegistry: CharacterRegistry
}> => {

  let panels: GeneratedPanel[] = []
  const startAt: number = (existingPanels.length + 1) || 0
  const endAt: number = startAt + nbPanelsToGenerate

  // Initialize or use existing character registry
  const registry: CharacterRegistry = characterRegistry || {
    characters: new Map(),
    order: [],
  }

  try {

    const prompt = joinWords([ userStoryPrompt ])

    const panelCandidates: GeneratedPanel[] = await predictNextPanels({
      preset,
      prompt,
      nbPanelsToGenerate,
      maxNbPanels,
      existingPanels,
      llmVendorConfig,
      characterRegistry: registry,
    })

    // we clean the output from the LLM
    // most importantly, we need to adjust the panel index,
    // to start from where we last finished
    for (let i = 0; i < nbPanelsToGenerate; i++) {
      panels.push({
        panel: startAt + i,
        instructions: `${panelCandidates[i]?.instructions || ""}`,
        speech: `${panelCandidates[i]?.speech || ""}`,
        caption: `${panelCandidates[i]?.caption || ""}`,
      })
    }
    
  } catch (err) {
    panels = []
    for (let p = startAt; p < endAt && p; p++) {
      panels.push({
        panel: p,
        instructions: joinWords([
          stylePrompt,
          userStoryPrompt,
          `${".".repeat(p)}`,
        ]),
        speech: "...",
        caption: "(Sorry, LLM generation failed: using degraded mode)"
      })
    }
    await sleep(2000)
  }

  // Always update the registry with whatever panels we got
  const updatedRegistry = updateCharacterRegistry(registry, panels)
  return { panels, updatedRegistry }
}
