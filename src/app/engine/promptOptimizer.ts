"use server"

const OPTIMIZATION_THRESHOLD = 200 // Only optimize prompts under this character count

const SYSTEM_PROMPT = `You are an expert comic/manga prompt engineer for AI image generation. Your job is to take a short, simple prompt and enhance it into a detailed, vivid image generation prompt optimized for producing high-quality comic/manga style artwork.

When enhancing a prompt, add details about:
- Art style (e.g., manga, anime, watercolor, ink wash, cel-shaded, realistic, chibi)
- Lighting and atmosphere (e.g., dramatic rim lighting, soft golden hour glow, neon-lit night)
- Composition and camera angle (e.g., close-up, wide shot, bird's eye view, dynamic angle)
- Character appearance (e.g., hair color, clothing, expression, pose, accessories)
- Color palette (e.g., vibrant neon, muted earth tones, monochrome with accent color)
- Mood and emotion (e.g., tense, serene, melancholic, energetic)

IMPORTANT RULES:
1. Keep the original intent and subject of the prompt — do NOT change what is being depicted
2. Return ONLY the enhanced prompt text, nothing else — no explanations, no quotes, no preamble
3. Keep it concise but rich in detail — aim for 50-150 words
4. Make it flow naturally as a single prompt string
5. Do not include negative prompts or technical parameters`

export async function optimizePrompt(
  rawPrompt: string,
  apiKey: string,
  llmModel?: string
): Promise<string> {
  // Skip optimization for already-detailed prompts
  if (rawPrompt.length >= OPTIMIZATION_THRESHOLD) {
    return rawPrompt
  }

  if (!apiKey) {
    return rawPrompt
  }

  const model = llmModel || "Qwen/Qwen3-32B"

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15s timeout

    const res = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: rawPrompt },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
      signal: controller.signal,
      cache: "no-store",
    })

    clearTimeout(timeoutId)

    if (res.status !== 200) {
      console.error("Prompt optimization API error:", res.status, await res.text())
      return rawPrompt
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[]
    }

    const optimized = data?.choices?.[0]?.message?.content?.trim()

    if (!optimized || optimized.length < 10) {
      console.warn("Prompt optimization returned empty/too short result, using original")
      return rawPrompt
    }

    console.log(`[PromptOptimizer] Optimized: "${rawPrompt}" -> "${optimized}"`)
    return optimized
  } catch (err) {
    console.error("Prompt optimization failed, falling back to original prompt:", err)
    return rawPrompt
  }
}
