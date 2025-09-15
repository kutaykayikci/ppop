import { getPoopsByDateRange } from '@/firebase/poopService'

export const detectRecentSynergy = async (roomId: string, characterId: string, windowSec: number = 120) => {
  const today = new Date().toISOString().split('T')[0]
  const poops = await getPoopsByDateRange(roomId, today, today)
  const now = Date.now() / 1000
  const recent = poops.filter((p: any) => p.characterId !== characterId)
    .filter((p: any) => {
      const t = p.timestamp?.seconds || (new Date(p.createdAt).getTime() / 1000)
      return now - t <= windowSec
    })
  if (recent.length === 0) return null
  recent.sort((a: any, b: any) => {
    const ta = a.timestamp?.seconds || (new Date(a.createdAt).getTime() / 1000)
    const tb = b.timestamp?.seconds || (new Date(b.createdAt).getTime() / 1000)
    return (now - ta) - (now - tb)
  })
  return recent[0]
}


