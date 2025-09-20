import React, { useEffect, useState } from 'react'

export default function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const on = () => setOffline(false)
    const off = () => setOffline(true)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  if (!offline) return null
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1500,
      background: '#ffefef',
      color: '#a33',
      borderBottom: '2px solid #a33',
      padding: '8px 12px',
      textAlign: 'center',
      fontSize: 12
    }}>
      Offline görünüyorsun. Değişiklikler ağ geldiğinde senkronlanır.
    </div>
  )
}


