import { getPoopsByDateRange } from '@/firebase/poopService'

export type CharacterLite = { id: string; name: string; emoji: string; color: string }
export type Standing = { characterId: string; name: string; emoji: string; color: string; count: number }

const getWeekRange = (now: Date = new Date()) => {
  const end = new Date(now)
  const start = new Date(now)
  start.setDate(start.getDate() - 6)
  const fmt = (d: Date) => d.toISOString().split('T')[0]
  return { startDate: fmt(start), endDate: fmt(end) }
}

export const computeWeeklyStandings = async (roomId: string, characters: CharacterLite[], now: Date = new Date()): Promise<Standing[]> => {
  const { startDate, endDate } = getWeekRange(now)
  const poops = await getPoopsByDateRange(roomId, startDate, endDate)
  const counts = new Map<string, number>()
  characters.forEach((c) => counts.set(c.id, 0))
  poops.forEach((p: any) => {
    if (counts.has(p.characterId)) counts.set(p.characterId, (counts.get(p.characterId) || 0) + 1)
  })
  const standings: Standing[] = characters.map((c) => ({
    characterId: c.id,
    name: c.name,
    emoji: c.emoji,
    color: c.color,
    count: counts.get(c.id) || 0
  }))
  standings.sort((a, b) => b.count - a.count)
  return standings
}


