import React from 'react'
import PixelCard from '@/components/PixelCard'
import PixelButton from '@/components/PixelButton'

export default function OnboardingModal({ onClose, onPrimary }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex: 1200, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <PixelCard style={{ width: 520, maxWidth: '90%', padding: 20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'2px solid #333', paddingBottom:10, marginBottom:10 }}>
          <div style={{ fontWeight:'bold' }}>👋 Hoş geldin!</div>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:18, cursor:'pointer' }}>×</button>
        </div>
        <div style={{ fontSize:12, lineHeight:1.5, marginBottom:12 }}>
          Odanı seç, karakterini ekle ve ilk hedefini belirle. Hazır olduğunda saymaya başla!
        </div>
        <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
          <PixelButton variant="secondary" onClick={onClose}>Daha Sonra</PixelButton>
          <PixelButton onClick={onPrimary}>Hemen Başla</PixelButton>
        </div>
      </PixelCard>
    </div>
  )
}


