import React, { useEffect, useState } from 'react'
import { getCurrentWeekTheme } from '@/services/eventCalendarService'

const ICONS = {
  retro: '🕹️',
  emoji_fest: '🎊',
  neon: '🌈',
  pixel: '🧩'
}

export default function EventBanner() {
  const [event, setEvent] = useState(null)

  useEffect(() => {
    setEvent(getCurrentWeekTheme())
    const id = setInterval(() => setEvent(getCurrentWeekTheme()), 60 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  if (!event) return null

  const icon = ICONS[event.id] || '🎉'

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'linear-gradient(90deg, #ffecd2, #fcb69f)',
      color: '#333',
      borderBottom: '3px solid #333',
      boxShadow: '0 4px 0 rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '8px 12px',
        fontWeight: 'bold',
        fontSize: 12
      }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span>Bu Hafta: {event.name}</span>
      </div>
    </div>
  )
}


