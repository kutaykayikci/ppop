import React from 'react'
import PixelCard from '@/components/PixelCard'
import PixelButton from '@/components/PixelButton'

export default function Highlights({ onOpenLeaderboard }) {
  return (
    <div className="home-container" style={{ marginBottom: '12px' }}>
      <PixelCard style={{ padding: '14px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#333', fontSize: 'clamp(12px,2.8vw,14px)' }}>Öne Çıkanlar</div>
            <div style={{ fontSize: 'clamp(10px,2.6vw,12px)', color: '#666' }}>Günlük görevler ve mini başarılar yakında!</div>
          </div>
          <PixelButton size="sm" onClick={onOpenLeaderboard} className="glow-effect">🏆 Liderlik</PixelButton>
        </div>
      </PixelCard>
    </div>
  )
}


