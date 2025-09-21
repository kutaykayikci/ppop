import React from 'react'
import PixelCard from '@/components/PixelCard'
import PixelButton from '@/components/PixelButton'

export default function ContinueCard({ lastRoomId, onContinue }) {
  if (!lastRoomId) return null
  return (
    <div className="home-container">
      <PixelCard className="fade-in-up" style={{ marginBottom: '12px', padding: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontWeight: 'bold', color: '#333', fontSize: 'clamp(12px,2.8vw,14px)' }}>Devam Et</div>
          <div style={{ fontSize: 'clamp(10px,2.6vw,12px)', color: '#666' }}>Son oda: {lastRoomId}</div>
        </div>
        <PixelButton onClick={() => onContinue(lastRoomId)} style={{ width: '100%' }}>
          Dashboard'a Git
        </PixelButton>
      </PixelCard>
    </div>
  )
}


