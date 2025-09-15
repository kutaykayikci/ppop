export type MiniGame = {
  id: 'tap_confetti' | 'reaction_test' | 'speed_click'
  name: string
  unlockStreak: number
}

export const MINI_GAMES: Record<string, MiniGame> = {
  tap_confetti: {
    id: 'tap_confetti',
    name: 'Tap-to-Confetti',
    unlockStreak: 3
  },
  reaction_test: {
    id: 'reaction_test',
    name: 'Reaction Test',
    unlockStreak: 7
  },
  speed_click: {
    id: 'speed_click',
    name: 'Speed Click',
    unlockStreak: 14
  }
}

export const getUnlockedMiniGames = (streak: number): MiniGame[] => {
  return Object.values(MINI_GAMES).filter(g => streak >= g.unlockStreak)
}

export const isMiniGameUnlocked = (gameId: string, streak: number): boolean => {
  const game = MINI_GAMES[gameId]
  return !!game && streak >= game.unlockStreak
}

export const getNextUnlockInfo = (streak: number): MiniGame | null => {
  const locked = Object.values(MINI_GAMES)
    .filter(g => streak < g.unlockStreak)
    .sort((a, b) => a.unlockStreak - b.unlockStreak)
  return locked[0] || null
}


