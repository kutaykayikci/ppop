import { db } from '@/firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { sendPushNotification } from '@/services/notificationService'

export type Standing = { characterId: string; name: string; emoji: string }

export const grantReward = async (roomId: string, characterId: string, type: string, payload: Record<string, unknown>) => {
  try {
    await addDoc(collection(db, 'rewards'), {
      roomId,
      characterId,
      type,
      payload,
      createdAt: serverTimestamp()
    })
    return true
  } catch (e) {
    console.error('Reward grant error:', e)
    return false
  }
}

export const awardWeeklyWinners = async (roomId: string, standings: Standing[]) => {
  try {
    const winners = standings.slice(0, 3)
    for (let i = 0; i < winners.length; i++) {
      const w = winners[i]
      const rewardType = i === 0 ? 'badge:weekly_champion' : i === 1 ? 'badge:weekly_runner' : 'badge:weekly_bronze'
      await grantReward(roomId, w.characterId, 'badge', { code: rewardType })
      if (i === 0) {
        await grantReward(roomId, w.characterId, 'theme_unlock', { theme: 'neon' })
      }
      await sendPushNotification({
        title: '🏆 Haftalık Ödül!',
        body: `${w.name} haftanın ${i + 1}. sırasında!`,
        icon: w.emoji,
        type: 'achievement'
      }, { roomId, characterId: w.characterId, rewardType })
    }
    return { success: true, count: winners.length }
  } catch (e) {
    console.error('Weekly awards error:', e)
    return { success: false }
  }
}


