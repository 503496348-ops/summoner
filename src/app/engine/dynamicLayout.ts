/**
 * Dynamic Layout Engine
 * Content-aware panel layout selection based on story beats.
 * Inspired by ai-comic-factory's dynamic layout system.
 * Analyzes panel content (action intensity, emotional weight, dialogue density)
 * to select optimal visual arrangements.
 *
 * @author AtomCollide-智械工坊
 */

import { ClapImageRatio } from "@aitube/clap"
import { LayoutName } from "../layouts"

// ─── Layout Templates ────────────────────────────────────────────────

export interface DynamicLayoutPanel {
  panel: number
  orientation: ClapImageRatio
  width: number
  height: number
  /** Relative size weight — larger panels get more visual emphasis */
  emphasisWeight: number
}

export interface DynamicLayoutTemplate {
  id: string
  label: string
  /** Category for UI grouping */
  category: 'manga' | 'western' | 'cinematic' | 'experimental'
  /** Number of panels this layout supports */
  panelCount: number
  /** Description for users */
  description: string
  /** The actual panel definitions */
  panels: DynamicLayoutPanel[]
  /** Best used for these content types */
  bestFor: ContentTag[]
}

export type ContentTag =
  | 'action'      // High energy, fighting, chase scenes
  | 'dialogue'    // Conversation-heavy panels
  | 'dramatic'    // Emotional reveals, twists
  | 'establishing' // Scene-setting, wide shots
  | 'intimate'    // Close-ups, quiet character moments
  | 'chaotic'     // Confusion, battle, multiple events
  | 'narrative'   // Standard story progression
  | 'comedic'     // Gags, reactions, timing beats

// ─── Dynamic Layout Catalog ─────────────────────────────────────────

export const dynamicLayouts: Record<string, DynamicLayoutTemplate> = {

  // === MANGA-INSPIRED LAYOUTS ===

  'manga_4koma': {
    id: 'manga_4koma',
    label: '4-Koma (Manga Strip)',
    category: 'manga',
    panelCount: 4,
    description: 'Classic manga 4-panel vertical strip. Perfect for comedic timing and short gags.',
    bestFor: ['comedic', 'narrative'],
    panels: [
      { panel: 0, orientation: ClapImageRatio.LANDSCAPE, width: 1024, height: 512, emphasisWeight: 1 },
      { panel: 1, orientation: ClapImageRatio.LANDSCAPE, width: 1024, height: 512, emphasisWeight: 1 },
      { panel: 2, orientation: ClapImageRatio.LANDSCAPE, width: 1024, height: 512, emphasisWeight: 1 },
      { panel: 3, orientation: ClapImageRatio.LANDSCAPE, width: 1024, height: 512, emphasisWeight: 2 }, // Punchline emphasis
    ],
  },

  'manga_action_burst': {
    id: 'manga_action_burst',
    label: 'Manga Action Burst',
    category: 'manga',
    panelCount: 4,
    description: 'Dynamic asymmetric layout with one large action panel dominating. Great for fight scenes and high-energy moments.',
    bestFor: ['action', 'dramatic', 'chaotic'],
    panels: [
      { panel: 0, orientation: ClapImageRatio.LANDSCAPE, width: 1024, height: 512, emphasisWeight: 1 },
      { panel: 1, orientation: ClapImageRatio.PORTRAIT, width: 512, height: 1024, emphasisWeight: 1 },
      { panel: 2, orientation: ClapImageRatio.LANDSCAPE, width: 1024, height: 768, emphasisWeight: 3 }, // Big action panel
      { panel: 3, orientation: ClapImageRatio.SQUARE, width: 512, height: 512, emphasisWeight: 1 },
    ],
  },

  'manga_dramatic': {
    id: 'manga_dramatic',
    label: 'Manga Dramatic Reveal',
    category: 'manga',
    panelCount: 4,
    description: 'Building tension layout — small panels leading to a dramatic full-width reveal.',
    bestFor: ['dramatic', 'intimate'],
    panels: [
      { panel: 0, orientation: ClapImageRatio.SQUARE, width: 512, height: 512, emphasisWeight: 1 },
      { panel: 1, orientation: ClapImageRatio.SQUARE, width: 512, height: 512, emphasisWeight: 1 },
      { panel: 2, orientation: ClapImageRatio.PORTRAIT, width: 768, height: 1024, emphasisWeight: 2 },
      { panel: 3, orientation: ClapImageRatio.LANDSCAPE, width: 1024, height: 512, emphasisWeight: 3 }, // Dramatic reveal
    ],
  },

  // === WESTERN COMIC LAYOUTS ===

  'western_classic': {
    id: 'western_classic',
    label: 'Classic Western Grid',
    category: 'western',
    panelCount: 4,
    description: 'Traditional western comic grid. Equal emphasis, balanced storytelling.',
    bestFor: ['narrative', 'dialogue'],
    panels: [
      { panel: 0, orientation: ClapImageRatio.LANDSCAPE, width: 1024, height: 768, emphasisWeight: 1 },
      { panel: 1, orientation: ClapImageRatio.LANDSCAPE, width: 1024, height: 768, emphasisWeight: 1 },
      { panel: 2, orientation: ClapImageRatio.LANDSCAPE, width: 1024, height: 768, emphasisWeight: 1 },
      { panel: 3, orientation: ClapImageRatio.LANDSCAPE, width: 1024, height: 768, emphasisWeight: 1 },
    ],
  },

  'western_hero': {
    id: 'western_hero',
    label: 'Hero Panel Layout',
    category: 'western',
    panelCount: 4,
    description: 'Small panels frame a dominant hero shot. Classic superhero reveal layout.',
    bestFor: ['action', 'dramatic'],
    panels: [
      { panel: 0, orientation: ClapImageRatio.LANDSCAPE, width: 1024, height: 512, emphasisWeight: 1 },
      { panel: 1, orientation: ClapImageRatio.LANDSCAPE, width: 1024, height: 512, emphasisWeight: 1 },
      { panel: 2, orientation: ClapImageRatio.PORTRAIT, width: 768, height: 1024, emphasisWeight: 3 }, // Hero shot
      { panel: 3, orientation: ClapImageRatio.LANDSCAPE, width: 1024, height: 512, emphasisWeight: 1 },
    ],
  },

  'western_dialogue': {
    id: 'western_dialogue',
    label: 'Dialogue Focus',
    category: 'western',
    panelCount: 4,
    description: 'Portrait panels optimized for character close-ups during conversation.',
    bestFor: ['dialogue', 'intimate'],
    panels: [
      { panel: 0, orientation: ClapImageRatio.PORTRAIT, width: 768, height: 1024, emphasisWeight: 1 },
      { panel: 1, orientation: ClapImageRatio.PORTRAIT, width: 768, height: 1024, emphasisWeight: 1 },
      { panel: 2, orientation: ClapImageRatio.PORTRAIT, width: 768, height: 1024, emphasisWeight: 1 },
      { panel: 3, orientation: ClapImageRatio.PORTRAIT, width: 768, height: 1024, emphasisWeight: 1 },
    ],
  },

  // === CINEMATIC LAYOUTS ===

  'cinematic_widescreen': {
    id: 'cinematic_widescreen',
    label: 'Cinematic Widescreen',
    category: 'cinematic',
    panelCount: 4,
    description: 'Letterboxed widescreen panels for a movie-like feel. Great for establishing shots and sweeping narratives.',
    bestFor: ['establishing', 'narrative'],
    panels: [
      { panel: 0, orientation: ClapImageRatio.LANDSCAPE, width: 1024, height: 512, emphasisWeight: 1 },
      { panel: 1, orientation: ClapImageRatio.LANDSCAPE, width: 1024, height: 512, emphasisWeight: 1 },
      { panel: 2, orientation: ClapImageRatio.LANDSCAPE, width: 1024, height: 512, emphasisWeight: 1 },
      { panel: 3, orientation: ClapImageRatio.LANDSCAPE, width: 1024, height: 512, emphasisWeight: 1 },
    ],
  },

  'cinematic_splash': {
    id: 'cinematic_splash',
    label: 'Splash Page',
    category: 'cinematic',
    panelCount: 4,
    description: 'One dominant splash panel with supporting insets. Maximum visual impact.',
    bestFor: ['establishing', 'dramatic', 'action'],
    panels: [
      { panel: 0, orientation: ClapImageRatio.LANDSCAPE, width: 1024, height: 512, emphasisWeight: 1 },
      { panel: 1, orientation: ClapImageRatio.SQUARE, width: 1024, height: 1024, emphasisWeight: 4 }, // Massive splash
      { panel: 2, orientation: ClapImageRatio.SQUARE, width: 512, height: 512, emphasisWeight: 1 },
      { panel: 3, orientation: ClapImageRatio.SQUARE, width: 512, height: 512, emphasisWeight: 1 },
    ],
  },

  // === EXPERIMENTAL LAYOUTS ===

  'experimental_grid': {
    id: 'experimental_grid',
    label: 'Irregular Grid',
    category: 'experimental',
    panelCount: 4,
    description: 'Broken grid with varied panel sizes for a modern indie comic feel.',
    bestFor: ['chaotic', 'comedic', 'narrative'],
    panels: [
      { panel: 0, orientation: ClapImageRatio.LANDSCAPE, width: 1024, height: 768, emphasisWeight: 2 },
      { panel: 1, orientation: ClapImageRatio.PORTRAIT, width: 512, height: 1024, emphasisWeight: 1 },
      { panel: 2, orientation: ClapImageRatio.SQUARE, width: 512, height: 512, emphasisWeight: 1 },
      { panel: 3, orientation: ClapImageRatio.LANDSCAPE, width: 1024, height: 512, emphasisWeight: 2 },
    ],
  },
}

// ─── Content Analysis ────────────────────────────────────────────────

/**
 * Analyzes panel content to determine content tags.
 * Uses keyword matching and heuristics to classify the narrative beat.
 */
export function analyzePanelContent(
  instructions: string,
  speech: string,
  caption: string
): ContentTag[] {
  const tags: Set<ContentTag> = new Set()
  const text = `${instructions} ${speech} ${caption}`.toLowerCase()

  // Action detection
  const actionWords = [
    'fight', 'battle', 'attack', 'punch', 'kick', 'slash', 'strike',
    'explosion', 'crash', 'charge', 'dash', 'leap', 'jump', 'run',
    'sword', 'weapon', 'gun', 'blast', 'power', 'energy', 'combat',
    'collision', 'impact', 'flying', 'speed', 'fierce', 'intense',
    'brawl', 'clash', 'duel', 'war', 'assault', 'defend',
  ]
  if (actionWords.some(w => text.includes(w))) tags.add('action')

  // Dialogue detection
  const dialogueIndicators = [
    '"', "'", 'says', 'tells', 'asks', 'replies', 'whispers',
    'shouts', 'screams', 'murmurs', 'speaks', 'talks', 'conversation',
    'dialogue', 'responds', 'exclaims',
  ]
  const speechDensity = speech.length > 20 ? 2 : speech.length > 0 ? 1 : 0
  if (dialogueIndicators.some(w => text.includes(w)) || speechDensity >= 2) {
    tags.add('dialogue')
  }

  // Dramatic detection
  const dramaticWords = [
    'reveal', 'surprise', 'shock', 'twist', 'betray', 'discover',
    'secret', 'truth', 'realize', 'moment', 'turning point', 'climax',
    'dramatic', 'gasp', 'stun', 'freeze', 'horror', 'awe',
    'confession', 'declaration', 'death', 'sacrifice', 'reunion',
  ]
  if (dramaticWords.some(w => text.includes(w))) tags.add('dramatic')

  // Establishing shot detection
  const establishingWords = [
    'landscape', 'city', 'building', 'exterior', 'interior', 'room',
    'sky', 'mountain', 'ocean', 'forest', 'street', 'village',
    'establishing', 'setting', 'environment', 'scenery', 'panorama',
    'wide shot', 'aerial', 'distance', 'horizon',
  ]
  if (establishingWords.some(w => text.includes(w))) tags.add('establishing')

  // Intimate detection
  const intimateWords = [
    'close-up', 'close up', 'face', 'eyes', 'tears', 'emotion',
    'touch', 'hand', 'embrace', 'hug', 'gentle', 'soft', 'tender',
    'whisper', 'quiet', 'alone', 'thoughtful', 'reflection', 'memory',
    'intimate', 'personal', 'inner', 'monologue',
  ]
  if (intimateWords.some(w => text.includes(w))) tags.add('intimate')

  // Chaotic detection
  const chaoticWords = [
    'chaos', 'confusion', 'crowd', 'multiple characters', 'scattered',
    'debris', 'ruins', 'mess', 'tangled', 'overwhelming', 'barrage',
    'frenzy', 'pandemonium', 'turmoil', 'mayhem',
  ]
  if (chaoticWords.some(w => text.includes(w))) tags.add('chaotic')

  // Comedic detection
  const comedicWords = [
    'funny', 'laugh', 'joke', 'gag', 'prank', 'comedy', 'humor',
    'silly', 'ridiculous', 'absurd', 'face fault', 'sweatdrop',
    'reaction', 'surprised face', 'exaggerated', 'chibi', 'slapstick',
    'punchline', 'hilarious',
  ]
  if (comedicWords.some(w => text.includes(w))) tags.add('comedic')

  // Default to narrative if nothing else matches
  if (tags.size === 0) tags.add('narrative')

  return Array.from(tags)
}

/**
 * Scores how well a layout template matches the given content tags.
 * Higher score = better match.
 */
export function scoreLayoutMatch(
  layout: DynamicLayoutTemplate,
  contentTags: ContentTag[]
): number {
  if (contentTags.length === 0) return 50 // Neutral score

  let score = 0
  let matchCount = 0

  for (const tag of contentTags) {
    if (layout.bestFor.includes(tag)) {
      matchCount++
      // First match is worth more, with diminishing returns
      score += 100 / (matchCount * 0.5 + 0.5)
    }
  }

  // Bonus for having appropriate emphasis distribution
  const hasLargePanel = layout.panels.some(p => p.emphasisWeight >= 3)
  const hasSmallPanels = layout.panels.some(p => p.emphasisWeight <= 1)

  if (contentTags.includes('dramatic') && hasLargePanel) score += 20
  if (contentTags.includes('action') && hasLargePanel) score += 15
  if (contentTags.includes('dialogue') && !hasLargePanel) score += 15
  if (contentTags.includes('narrative') && !hasLargePanel) score += 10

  return score
}

// ─── Layout Selection ────────────────────────────────────────────────

export interface PanelData {
  instructions: string
  speech: string
  caption: string
}

/**
 * Selects the optimal dynamic layout based on the content of all panels.
 * Analyzes each panel's content, scores all available layouts, and picks
 * the best match.
 */
export function selectDynamicLayout(
  panels: PanelData[],
  preferredCategory?: 'manga' | 'western' | 'cinematic' | 'experimental'
): DynamicLayoutTemplate {
  // Aggregate content tags across all panels
  const allTags: ContentTag[] = []
  for (const panel of panels) {
    allTags.push(...analyzePanelContent(panel.instructions, panel.speech, panel.caption))
  }

  // Count tag frequencies
  const tagFrequency = new Map<ContentTag, number>()
  for (const tag of allTags) {
    tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1)
  }

  // Get dominant tags (appearing more than once or present with high weight)
  const dominantTags: ContentTag[] = Array.from(tagFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag)

  // Score each layout
  let bestLayout: DynamicLayoutTemplate = dynamicLayouts['western_classic']
  let bestScore = -1

  for (const layout of Object.values(dynamicLayouts)) {
    // Filter by panel count compatibility
    if (layout.panelCount !== panels.length) continue

    // Apply category preference bonus
    let categoryBonus = 0
    if (preferredCategory && layout.category === preferredCategory) {
      categoryBonus = 30
    }

    const score = scoreLayoutMatch(layout, dominantTags) + categoryBonus

    if (score > bestScore) {
      bestScore = score
      bestLayout = layout
    }
  }

  return bestLayout
}

/**
 * Converts a DynamicLayoutTemplate to the format expected by the existing
 * layout system (LayoutSettings[]).
 */
export function dynamicLayoutToSettings(
  template: DynamicLayoutTemplate
): { panel: number; orientation: ClapImageRatio; width: number; height: number }[] {
  return template.panels.map(p => ({
    panel: p.panel,
    orientation: p.orientation,
    width: p.width,
    height: p.height,
  }))
}

/**
 * Gets a human-readable explanation of why a layout was chosen.
 * Useful for showing users the AI's reasoning.
 */
export function explainLayoutChoice(
  layout: DynamicLayoutTemplate,
  panels: PanelData[]
): string {
  const allTags: ContentTag[] = []
  for (const panel of panels) {
    allTags.push(...analyzePanelContent(panel.instructions, panel.speech, panel.caption))
  }

  const tagFrequency = new Map<ContentTag, number>()
  for (const tag of allTags) {
    tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1)
  }

  const dominantTags = Array.from(tagFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag, count]) => `${tag} (${count}x)`)

  return `Selected "${layout.label}" because the content is primarily ${dominantTags.join(', ')}. ${layout.description}`
}
