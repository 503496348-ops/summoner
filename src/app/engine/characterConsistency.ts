/**
 * Character Consistency Manager
 * Inspired by DiffSensei's multi-character control approach.
 * Maintains character identity across all panels by building structured
 * character profiles and injecting them into the generation pipeline.
 *
 * @author AtomCollide-智械工坊
 */

export interface CharacterProfile {
  /** Unique character ID */
  id: string
  /** Character name (as identified by LLM) */
  name: string
  /** Persistent visual description seed — injected into every panel prompt */
  visualSeed: string
  /** Gender for pronoun consistency in dialogue */
  gender: 'male' | 'female' | 'other'
  /** Approximate age bracket */
  age: 'child' | 'teen' | 'young_adult' | 'adult' | 'elderly'
  /** Key distinguishing features (hair, eye color, scars, etc.) */
  distinguishingFeatures: string[]
  /** Default clothing description */
  clothing: string
  /** Body type descriptor */
  bodyType: string
  /** Times this character has appeared (for tracking) */
  appearances: number
  /** Last known expression (for subtle continuity) */
  lastExpression: string
  /** Character role in story */
  role: 'protagonist' | 'antagonist' | 'supporting' | 'background'
}

export interface CharacterRegistry {
  /** Map of character name → profile */
  characters: Map<string, CharacterProfile>
  /** Ordered list of character names for consistent ordering */
  order: string[]
}

/**
 * Extracts a stable character fingerprint from a visual description string.
 * This ensures the same character gets the same core visual elements even
 * when the LLM rephrases the description.
 */
export function extractVisualFingerprint(description: string): string {
  const features: string[] = []

  // Hair patterns
  const hairMatch = description.match(/(long|short|shoulder-length|buzz-cut|ponytail|braided|curly|straight|wavy)\s+(black|brown|blonde|red|white|silver|blue|pink|purple|green)\s+hair/i)
    || description.match(/(black|brown|blonde|red|white|silver|blue|pink|purple|green)\s+(long|short|shoulder-length|buzz-cut|ponytail|braided|curly|straight|wavy)\s+hair/i)
  if (hairMatch) features.push(hairMatch[0])

  // Eye patterns
  const eyeMatch = description.match(/(blue|brown|green|hazel|amber|gray|grey|red|golden|violet)\s+eyes?/i)
  if (eyeMatch) features.push(eyeMatch[0])

  // Skin tone
  const skinMatch = description.match(/(fair|pale|tan|dark|olive|brown|light)\s+(skin|complexion)/i)
  if (skinMatch) features.push(skinMatch[0])

  // Distinguishing marks
  const markMatch = description.match(/(scar|tattoo|birthmark|freckles|glasses|eyepatch)\w*/gi)
  if (markMatch) features.push(...markMatch)

  return features.join(', ') || description.slice(0, 120)
}

/**
 * Extracts character name from LLM-generated panel description.
 * Tries multiple strategies: quoted names, "Character:" patterns, 
 * known name formats.
 */
function extractCharacterNames(instructions: string): string[] {
  const names: string[] = []

  // Strategy 1: Quoted character names like "Elena" or 'Kai'
  const quotedPattern = /["']([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)["']/g
  let match
  while ((match = quotedPattern.exec(instructions)) !== null) {
    names.push(match[1])
  }

  // Strategy 2: "Character: Name" or "Protagonist: Name" patterns
  const labelPattern = /(?:character|protagonist|antagonist|hero|heroine|villain|narrator|person|man|woman|boy|girl|child|figure)\s*[:=]\s*["']?([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)["']?/gi
  while ((match = labelPattern.exec(instructions)) !== null) {
    if (!names.includes(match[1])) names.push(match[1])
  }

  // Strategy 3: Japanese/Chinese names (2-3 characters)
  const cjkPattern = /[\u4e00-\u9fff]{2,3}(?:\s[\u4e00-\u9fff]{1,2})?/g
  while ((match = cjkPattern.exec(instructions)) !== null) {
    if (match[0].length >= 2 && !names.includes(match[0])) {
      names.push(match[0])
    }
  }

  return [...new Set(names)]
}

/**
 * Determines character gender from description text.
 */
function inferGender(description: string): 'male' | 'female' | 'other' {
  const lower = description.toLowerCase()
  const maleIndicators = ['he ', 'his ', 'him ', 'man ', 'boy ', 'male', 'father', 'brother', 'son', 'prince', 'king', 'lord', 'gentleman', 'sir ']
  const femaleIndicators = ['she ', 'her ', 'woman ', 'girl ', 'female', 'mother', 'sister', 'daughter', 'princess', 'queen', 'lady', 'miss ', 'ms ']

  let maleScore = maleIndicators.reduce((s, w) => s + (lower.includes(w) ? 1 : 0), 0)
  let femaleScore = femaleIndicators.reduce((s, w) => s + (lower.includes(w) ? 1 : 0), 0)

  if (maleScore > femaleScore) return 'male'
  if (femaleScore > maleScore) return 'female'
  return 'other'
}

/**
 * Infers character age bracket from description.
 */
function inferAge(description: string): 'child' | 'teen' | 'young_adult' | 'adult' | 'elderly' {
  const lower = description.toLowerCase()
  if (lower.match(/child|kid|young boy|young girl|little|tiny|small child/)) return 'child'
  if (lower.match(/teen|teenage|adolescent|young/)) return 'teen'
  if (lower.match(/young adult|college|university|early 20s/)) return 'young_adult'
  if (lower.match(/elder|old|aged|wrinkled|gray-haired|grey-haired|grandfather|grandmother/)) return 'elderly'
  return 'adult'
}

/**
 * Builds a compact visual seed string for consistent character generation.
 * This gets prepended/appended to every panel prompt that features this character.
 */
function buildVisualSeed(profile: CharacterProfile): string {
  const parts: string[] = []

  if (profile.gender !== 'other') {
    parts.push(profile.gender === 'male' ? 'male character' : 'female character')
  }

  if (profile.age !== 'adult') {
    const ageMap: Record<string, string> = {
      child: 'young child',
      teen: 'teenage',
      young_adult: 'young adult',
      elderly: 'elderly',
    }
    parts.push(ageMap[profile.age] || '')
  }

  if (profile.bodyType) parts.push(profile.bodyType)

  if (profile.clothing) parts.push(`wearing ${profile.clothing}`)

  if (profile.distinguishingFeatures.length > 0) {
    parts.push(`with ${profile.distinguishingFeatures.join(', ')}`)
  }

  return parts.filter(Boolean).join(', ')
}

/**
 * Creates or updates a character registry from generated panel data.
 * Call this each time new panels are generated to track character appearances.
 */
export function updateCharacterRegistry(
  existing: CharacterRegistry,
  panels: { instructions: string; speech: string; caption: string }[]
): CharacterRegistry {
  const registry: CharacterRegistry = {
    characters: new Map(existing.characters),
    order: [...existing.order],
  }

  for (const panel of panels) {
    const fullText = `${panel.instructions} ${panel.caption}`
    const names = extractCharacterNames(fullText)

    for (const name of names) {
      const existingChar = registry.characters.get(name)

      if (existingChar) {
        // Update existing character — increment appearances, update expression
        existingChar.appearances++
        existingChar.lastExpression = extractExpression(fullText, name)
        registry.characters.set(name, existingChar)
      } else {
        // Create new character profile
        const gender = inferGender(fullText)
        const age = inferAge(fullText)
        const distinguishingFeatures = extractDistinguishingFeatures(fullText)
        const clothing = extractClothing(fullText)
        const bodyType = extractBodyType(fullText)

        const profile: CharacterProfile = {
          id: `char_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
          name,
          visualSeed: '',
          gender,
          age,
          distinguishingFeatures,
          clothing,
          bodyType,
          appearances: 1,
          lastExpression: extractExpression(fullText, name),
          role: inferRole(fullText, name),
        }
        profile.visualSeed = buildVisualSeed(profile)

        registry.characters.set(name, profile)
        registry.order.push(name)
      }
    }
  }

  return registry
}

/**
 * Generates a character consistency prefix to inject into panel prompts.
 * This is the key function — it tells the image generator exactly how
 * each character should look, maintaining cross-panel consistency.
 */
export function generateConsistencyPrompt(
  registry: CharacterRegistry,
  panelInstructions: string,
  presetStyle: string = ''
): string {
  if (registry.characters.size === 0) return panelInstructions

  // Detect which characters appear in this panel
  const mentionedNames = extractCharacterNames(panelInstructions)
  const activeCharacters: CharacterProfile[] = []

  for (const name of mentionedNames) {
    const profile = registry.characters.get(name)
    if (profile) activeCharacters.push(profile)
  }

  if (activeCharacters.length === 0) return panelInstructions

  // Build consistency block
  const consistencyLines: string[] = []

  consistencyLines.push('[CHARACTER CONSISTENCY — maintain exact appearance]')

  for (const char of activeCharacters) {
    const parts: string[] = []
    parts.push(`"${char.name}":`)
    parts.push(char.visualSeed)
    if (char.lastExpression && char.lastExpression !== 'neutral') {
      parts.push(`expression: ${char.lastExpression}`)
    }
    consistencyLines.push(parts.join(' '))
  }

  consistencyLines.push('[/CHARACTER CONSISTENCY]')

  // Inject before the panel instructions
  return `${consistencyLines.join('\n')}\n\n${panelInstructions}`
}

/**
 * Gets a summary of all tracked characters for multi-panel context.
 * Used when generating continuation panels to maintain story-wide consistency.
 */
export function getCharacterSummary(registry: CharacterRegistry): string {
  if (registry.characters.size === 0) return ''

  const lines: string[] = ['ACTIVE CHARACTERS IN THIS STORY:']

  for (const name of registry.order) {
    const char = registry.characters.get(name)
    if (!char) continue

    const parts = [
      `- ${char.name}`,
      `(${char.role})`,
      `${char.gender}, ${char.age.replace('_', ' ')}`,
      `| Look: ${char.visualSeed}`,
      `| Appeared ${char.appearances} time(s)`,
    ]
    lines.push(parts.join(' '))
  }

  return lines.join('\n')
}

// --- Internal helper functions ---

function extractExpression(text: string, characterName: string): string {
  const lower = text.toLowerCase()
  const expressions = [
    'smiling', 'laughing', 'crying', 'angry', 'furious', 'sad',
    'happy', 'surprised', 'shocked', 'scared', 'terrified',
    'determined', 'confused', 'thoughtful', 'stern', 'gentle',
    'excited', 'exhausted', 'peaceful', 'anxious', 'worried',
    'grinning', 'frowning', 'winking', 'blushing', 'smirking',
    'serious', 'contemplative', 'neutral',
  ]

  // Look for expressions near the character name
  const nameIndex = lower.indexOf(characterName.toLowerCase())
  const contextWindow = nameIndex >= 0
    ? lower.slice(Math.max(0, nameIndex - 100), nameIndex + 200)
    : lower

  for (const expr of expressions) {
    if (contextWindow.includes(expr)) return expr
  }

  return 'neutral'
}

function extractDistinguishingFeatures(text: string): string[] {
  const features: string[] = []
  const lower = text.toLowerCase()

  // Hair features
  const hairPatterns = [
    /(?:long|short|shoulder-length|buzz-cut|ponytail|braid|curly|straight|wavy|spiky|messy)\s+\w+\s+hair/gi,
    /(?:black|brown|blonde|red|white|silver|blue|pink|purple|green|auburn)\s+hair/gi,
    /hair(?:\s+(?:tied|pulled back|flowing|spiky|messy|neat|wild))?/gi,
  ]
  for (const p of hairPatterns) {
    const m = lower.match(p)
    if (m) features.push(...m.map(f => f.trim()))
  }

  // Eye features
  const eyeMatch = lower.match(/(blue|brown|green|hazel|amber|gray|grey|red|golden|violet|piercing|sharp|soft)\s+eyes?/g)
  if (eyeMatch) features.push(...eyeMatch)

  // Distinctive marks
  const marks = lower.match(/(scar|tattoo|birthmark|freckles|glasses|eyepatch|beard|mustache|goatee)\w*/g)
  if (marks) features.push(...marks)

  return [...new Set(features)].slice(0, 5) // Limit to 5 features
}

function extractClothing(text: string): string {
  const lower = text.toLowerCase()
  const clothingPatterns = [
    /wearing\s+(?:a\s+)?(.+?)(?:\.|,|\s+and\s+(?:a\s+)?(?:his|her|their)|\s+while)/i,
    /(?:dressed in|clothed in)\s+(?:a\s+)?(.+?)(?:\.|,)/i,
    /(school\s+uniform|military\s+uniform|armor|suit|dress|robe|cloak|jacket|hoodie|t-shirt|kimono|gown)/i,
  ]

  for (const pattern of clothingPatterns) {
    const match = text.match(pattern)
    if (match) return match[1]?.trim() || match[0].trim()
  }

  return ''
}

function extractBodyType(text: string): string {
  const lower = text.toLowerCase()
  const types = [
    'muscular', 'slim', 'slender', 'athletic', 'stocky', 'petite',
    'tall', 'short', 'heavy', 'thin', 'toned', 'lean',
    'broad-shouldered', 'willowy', 'lanky', 'compact',
  ]

  for (const type of types) {
    if (lower.includes(type)) return type
  }

  return ''
}

function inferRole(text: string, name: string): CharacterProfile['role'] {
  const lower = text.toLowerCase()
  const nameLower = name.toLowerCase()

  if (lower.includes(`${nameLower} is the protagonist`) || lower.includes(`main character`)) {
    return 'protagonist'
  }
  if (lower.includes('villain') || lower.includes('antagonist') || lower.includes('enemy')) {
    return 'antagonist'
  }
  if (lower.includes('background') || lower.includes('bystander') || lower.includes('extra')) {
    return 'background'
  }

  // Default: first mentioned is likely protagonist
  return 'protagonist'
}
