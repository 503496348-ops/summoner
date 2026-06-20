import { GeneratedPanel, LLMVendorConfig } from "@/types"
import { cleanJson } from "@/lib/cleanJson"
import { dirtyGeneratedPanelCleaner } from "@/lib/dirtyGeneratedPanelCleaner"
import { dirtyGeneratedPanelsParser } from "@/lib/dirtyGeneratedPanelsParser"
import { sleep } from "@/lib/sleep"
import { CharacterRegistry, generateConsistencyPrompt } from "../engine/characterConsistency"

import { Preset } from "../engine/presets"
import { predict } from "./predict"
import { getSystemPrompt } from "./getSystemPrompt"
import { getUserPrompt } from "./getUserPrompt"

export const predictNextPanels = async ({
  preset,
  prompt = "",
  nbPanelsToGenerate,
  maxNbPanels,
  existingPanels = [],
  llmVendorConfig,
  characterRegistry,
}: {
  preset: Preset
  prompt: string
  nbPanelsToGenerate: number
  maxNbPanels: number
  existingPanels: GeneratedPanel[]
  llmVendorConfig: LLMVendorConfig
  characterRegistry?: CharacterRegistry
}): Promise<GeneratedPanel[]> => {
  
  const existingPanelsTemplate = existingPanels.length
    ? ` To help you, here are the previous panels, their speeches and captions (note: if you see an anomaly here eg. no speech, no caption or the same description repeated multiple times, do not hesitate to fix the story): ${JSON.stringify(existingPanels, null, 2)}`
    : ''

  const firstNextOrLast =
    existingPanels.length === 0
      ? "first"
      : (maxNbPanels - existingPanels.length) === maxNbPanels
      ? "last"
      : "next"

  const systemPrompt = getSystemPrompt({
    preset,
    firstNextOrLast,
    maxNbPanels,
    nbPanelsToGenerate,
    characterRegistry,
  })

  const userPrompt = getUserPrompt({
    prompt,
    existingPanelsTemplate,
  })

  let result = ""

  // we don't require a lot of token for our task,
  // but to be safe, let's count ~200 tokens per panel
  const nbTokensPerPanel = 200

  const nbMaxNewTokens = nbPanelsToGenerate * nbTokensPerPanel

  try {
    result = `${await predict({
      systemPrompt,
      userPrompt,
      nbMaxNewTokens,
      llmVendorConfig
    })}`.trim()
    console.log("LLM result (1st trial):", result)
    if (!result.length) {
      throw new Error("empty result on 1st trial!")
    }
  } catch (err) {
    await sleep(2000)

    try {
      result = `${await predict({
        systemPrompt: systemPrompt + " \n ",
        userPrompt,
        nbMaxNewTokens,
        llmVendorConfig
      })}`.trim()
      console.log("LLM result (2nd trial):", result)
      if (!result.length) {
        throw new Error("empty result on 2nd trial!")
      }
    } catch (err) {
      console.error(`prediction of the story failed twice 💩`)
      throw new Error(`failed to generate the story twice 💩 ${err}`)
    }
  }

  const tmp = cleanJson(result)
  
  let generatedPanels: GeneratedPanel[] = []

  try {
    generatedPanels = dirtyGeneratedPanelsParser(tmp)
  } catch (err) {
    generatedPanels = (
      tmp.split("*")
      .map(item => item.trim())
      .map((cap, i) => ({
        panel: i,
        caption: cap,
        speech: cap,
        instructions: cap,
      }))
    )
  }

  // Apply character consistency prompts to each panel's instructions
  if (characterRegistry && characterRegistry.characters.size > 0) {
    generatedPanels = generatedPanels.map(panel => ({
      ...panel,
      instructions: generateConsistencyPrompt(
        characterRegistry,
        panel.instructions,
        preset.imagePrompt('').join(', ')
      ),
    }))
  }

  return generatedPanels.map(res => dirtyGeneratedPanelCleaner(res))
}
