// Event Calendar Service - Themed Weeks and Rewards (scaffold)

export type ThemedWeek = {
  id: 'retro' | 'emoji_fest' | 'neon' | 'pixel'
  name: string
  startWeekOffset: number
  rewards: string[]
}

export const THEMED_WEEKS: Record<string, ThemedWeek> = {
  retro: {
    id: 'retro',
    name: 'Retro Haftası',
    startWeekOffset: 0,
    rewards: ['theme:neon', 'sfx:chiptune', 'badge:retro_master']
  },
  emoji_fest: {
    id: 'emoji_fest',
    name: 'Emoji Festivali',
    startWeekOffset: 1,
    rewards: ['icon:emoji_pack', 'badge:emoji_star']
  },
  neon: {
    id: 'neon',
    name: 'Neon Işıklar',
    startWeekOffset: 2,
    rewards: ['theme:neon_room', 'badge:neon_lover']
  },
  pixel: {
    id: 'pixel',
    name: 'Piksel Partisi',
    startWeekOffset: 3,
    rewards: ['theme:pixel_ui', 'badge:pixel_pro']
  }
}

const THEME_ORDER: ThemedWeek['id'][] = ['retro', 'emoji_fest', 'neon', 'pixel']

export const getCurrentWeekKey = (now: Date = new Date()): ThemedWeek['id'] => {
  const weekIndex = Math.floor(daysSinceEpoch(now) / 7)
  const key = THEME_ORDER[weekIndex % THEME_ORDER.length]
  return key
}

export const getCurrentWeekTheme = (now: Date = new Date()): ThemedWeek => {
  const key = getCurrentWeekKey(now)
  return THEMED_WEEKS[key]
}

export const isEventActive = (eventKey: ThemedWeek['id'], now: Date = new Date()): boolean => {
  const currentKey = getCurrentWeekKey(now)
  return currentKey === eventKey
}

export const getRewardsForEvent = (eventKey: string): string[] => {
  const event = THEMED_WEEKS[eventKey]
  return event ? event.rewards : []
}

export const getActiveEvents = (now: Date = new Date()): ThemedWeek[] => {
  const key = getCurrentWeekKey(now)
  return [THEMED_WEEKS[key]]
}

function daysSinceEpoch(date: Date): number {
  const MS_PER_DAY = 24 * 60 * 60 * 1000
  return Math.floor(date.getTime() / MS_PER_DAY)
}


