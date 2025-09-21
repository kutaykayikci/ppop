import React from 'react'
import { PixelButton, PixelStack } from '@/components'

export default function QuickActions({ onCreate, onJoin, onShowLeaderboard, onShowOnboarding, playSound }) {
  return (
    <div className="home-container" style={{ marginBottom: '12px' }}>
      <PixelStack gap="md" align="stretch">
        <PixelButton
          onClick={() => { playSound?.('click'); onCreate(); }}
          variant="primary"
          size="lg"
          style={{ width: '100%', fontSize: '12px' }}
          className="pixel-animate-button-glow"
        >
          🚪 Yeni Oda Oluştur
        </PixelButton>

        <PixelButton
          onClick={() => { playSound?.('click'); onJoin(); }}
          variant="secondary"
          size="lg"
          style={{ width: '100%', fontSize: '12px' }}
          className="pixel-animate-button-glow"
        >
          🔑 Room ID ile Gir
        </PixelButton>

        <PixelButton
          onClick={() => { playSound?.('click'); onShowOnboarding(); }}
          variant="secondary"
          size="md"
          style={{ width: '100%', fontSize: '12px' }}
          className="pixel-animate-button-glow"
        >
          ❓ Nasıl Çalışır?
        </PixelButton>
      </PixelStack>
    </div>
  )
}


