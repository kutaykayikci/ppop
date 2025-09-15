import React, { useEffect, useState } from 'react'
import PixelCard from '@/components/PixelCard'
import PixelButton from '@/components/PixelButton'
import { POOP_THEMES, CHARACTER_COSTUMES, ROOM_DECORATIONS, COUNTER_THEMES } from '@/services/themeService'
import { useThemeStore } from '@/store/themeStore'

export default function ThemeShop({ onClose }) {
  const { themes, setTheme } = useThemeStore()
  const [tab, setTab] = useState('poop')

  const catalog = {
    poop: POOP_THEMES,
    costume: CHARACTER_COSTUMES,
    room: ROOM_DECORATIONS,
    counter: COUNTER_THEMES
  }

  const list = Object.values(catalog[tab])

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <PixelCard style={{ width: '90%', maxWidth: 700, maxHeight: '80vh', overflow: 'auto', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '2px solid #333' }}>
          <div style={{ fontWeight: 'bold' }}>🎨 Tema Mağazası</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ display: 'flex', gap: 6, margin: '12px 0', flexWrap: 'wrap' }}>
          {['poop','costume','room','counter'].map(t => (
            <PixelButton key={t} variant={tab === t ? 'primary' : 'secondary'} size="sm" onClick={() => setTab(t)}>
              {t}
            </PixelButton>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
          {list.map(item => (
            <div key={item.id} style={{ border: '3px solid #333', borderRadius: 8, padding: 12, background: '#fff' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{item.emoji || '🎨'}</div>
              <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 12 }}>{item.name}</div>
              <div style={{ fontSize: 10, opacity: 0.8, marginBottom: 8 }}>{item.description}</div>
              <PixelButton size="sm" onClick={() => setTheme(tab, item.id)}>
                Seç
              </PixelButton>
            </div>
          ))}
        </div>
      </PixelCard>
    </div>
  )
}


