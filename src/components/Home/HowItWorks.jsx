import React from 'react'
import PixelCard from '@/components/PixelCard'

export default function HowItWorks() {
  const steps = [
    { emoji: '🏠', title: 'Oda', text: 'Benzersiz room ID ile oda oluştur' },
    { emoji: '👤', title: 'Karakter', text: 'Avatar ve isim seç' },
    { emoji: '🎯', title: 'Hedef', text: 'Günlük mini hedef belirle' },
  ]
  return (
    <div className="home-container">
      <PixelCard style={{ padding: '14px', marginBottom: '12px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333', fontSize: 'clamp(12px,2.8vw,14px)' }}>Nasıl Çalışır?</div>
        <div style={{ display: 'flex', gap: '8px' }}>
        {steps.map(s => (
          <div key={s.title} style={{ flex: 1, background: '#fff', border: '2px solid #333', borderRadius: 6, padding: 10 }}>
            <div style={{ fontSize: 'clamp(16px,4vw,18px)' }}>{s.emoji}</div>
            <div style={{ fontWeight: 'bold', fontSize: 'clamp(10px,2.6vw,12px)' }}>{s.title}</div>
            <div style={{ fontSize: 'clamp(9px,2.4vw,11px)', color: '#666' }}>{s.text}</div>
          </div>
        ))}
        </div>
      </PixelCard>
    </div>
  )
}


