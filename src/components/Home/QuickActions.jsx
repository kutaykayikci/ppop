import React from 'react'
import PixelButton from '@/components/PixelButton'

export default function QuickActions({ onCreate, onJoin, onShowLeaderboard, onShowOnboarding, playSound }) {
  return (
    <div className="home-container home-stack" style={{ marginBottom: '12px' }}>
      <PixelButton
        onClick={() => { playSound?.('click'); onCreate(); }}
        variant="primary"
        size="lg"
        style={{ width: '100%', fontSize: '12px' }}
        className="glow-effect"
      >
        Yeni Oda Oluştur
      </PixelButton>

      <PixelButton
        onClick={() => { playSound?.('click'); onJoin(); }}
        variant="secondary"
        size="lg"
        style={{ width: '100%', fontSize: '12px' }}
        className="glow-effect"
      >
        Room ID ile Gir
      </PixelButton>

      <PixelButton
        onClick={() => { playSound?.('click'); onShowOnboarding(); }}
        variant="secondary"
        size="md"
        style={{ width: '100%', fontSize: '12px' }}
        className="glow-effect"
      >
        Nasıl Çalışır?
      </PixelButton>
    </div>
  )
}


