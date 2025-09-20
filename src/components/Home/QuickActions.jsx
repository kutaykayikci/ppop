import React from 'react'
import PixelButton from '@/components/PixelButton'

export default function QuickActions({ onCreate, onJoin, onShowLeaderboard, onShowOnboarding, playSound }) {
  return (
    <div className="home-container home-stack" style={{ marginBottom: '12px' }}>
      <PixelButton
        onClick={() => { playSound?.('click'); onCreate(); }}
        variant="primary"
        size="lg"
        style={{ width: '100%' }}
        className="glow-effect"
      >
        🆕 Yeni Oda Oluştur
      </PixelButton>

      <PixelButton
        onClick={() => { playSound?.('click'); onJoin(); }}
        variant="secondary"
        size="lg"
        style={{ width: '100%' }}
        className="glow-effect"
      >
        🔑 Room ID ile Gir
      </PixelButton>

      <div style={{ display: 'flex', gap: '8px' }}>
        <PixelButton
          onClick={() => { playSound?.('click'); onShowLeaderboard(); }}
          variant="special"
          size="md"
          style={{ flex: 1 }}
          className="glow-effect"
        >
          🏆 Liderlik
        </PixelButton>

        <PixelButton
          onClick={() => { playSound?.('click'); onShowOnboarding(); }}
          variant="secondary"
          size="md"
          style={{ flex: 1 }}
          className="glow-effect"
        >
          🎓 Nasıl Çalışır?
        </PixelButton>
      </div>
    </div>
  )
}


