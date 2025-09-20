import React from 'react'
import PixelCard from '@/components/PixelCard'

export default function HomeHero() {
  return (
    <div className="fade-in-up home-container" style={{ textAlign: 'center', marginBottom: '12px' }}>
      <PixelCard style={{
        padding: 'clamp(12px, 3vw, 18px)',
        border: '3px solid #333',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9))'
      }}>
        <div style={{ fontSize: 'clamp(14px, 3.6vw, 18px)', fontWeight: 'bold', color: '#333', marginBottom: '6px' }}>
          💩 Poop Count
        </div>
        <div style={{ fontSize: 'clamp(10px, 2.8vw, 12px)', color: '#555' }}>
          Sevgilinle günlük mini hedefler, eğlenceli rekabet ve başarılar!
        </div>
      </PixelCard>
    </div>
  )
}


