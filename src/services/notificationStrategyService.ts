import { sendPushNotification } from '@/services/notificationService'

export const scheduleWeeklySummary = (): void => {
  const dayMs = 24 * 60 * 60 * 1000
  setInterval(async () => {
    try {
      if (!canSend('weekly_summary', 1, dayMs)) return
      await sendPushNotification({
        title: '📈 Haftalık Özet',
        body: 'Haftalık performans özeti hazır!',
        type: 'info'
      })
      recordSend('weekly_summary')
    } catch {
      // no-op
    }
  }, dayMs)
}

const canSend = (key: string, maxCount: number, windowMs: number): boolean => {
  try {
    const raw = localStorage.getItem(`notif_cap_${key}`)
    const data = raw ? JSON.parse(raw) as { t: number; c: number } : { t: Date.now(), c: 0 }
    const now = Date.now()
    if (now - data.t > windowMs) return true
    return data.c < maxCount
  } catch { return true }
}

const recordSend = (key: string): void => {
  try {
    const raw = localStorage.getItem(`notif_cap_${key}`)
    const data = raw ? JSON.parse(raw) as { t: number; c: number } : { t: Date.now(), c: 0 }
    const now = Date.now()
    if (now - data.t > 24 * 60 * 60 * 1000) {
      localStorage.setItem(`notif_cap_${key}`, JSON.stringify({ t: now, c: 1 }))
    } else {
      localStorage.setItem(`notif_cap_${key}`, JSON.stringify({ t: data.t, c: (data.c || 0) + 1 }))
    }
  } catch {}
}


