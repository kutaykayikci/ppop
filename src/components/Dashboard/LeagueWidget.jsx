import React, { useEffect, useState } from 'react'
import PixelCard from '@/components/PixelCard'
import { computeWeeklyStandings } from '@/services/leagueService'
import { awardWeeklyWinners } from '@/services/rewardsService'

export default function LeagueWidget({ roomId, characters }) {
  const [standings, setStandings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!roomId || !characters || characters.length === 0) return
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const data = await computeWeeklyStandings(roomId, characters)
        if (mounted) setStandings(data)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [roomId, characters])

  return (
    <PixelCard style={{ margin: '20px', padding: '16px' }}>
      <div style={{ fontWeight:'bold', marginBottom: 10, fontSize: 14 }}>🏆 Oda Ligi (Haftalık)</div>
      {loading ? (
        <div style={{ fontSize: 12, opacity: 0.7 }}>Yükleniyor...</div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns: '1fr', gap: 8 }}>
          {standings.slice(0,5).map((s, idx) => (
            <div key={s.characterId} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', border:'2px solid #333', borderRadius:8, padding:'8px 10px', background:'#fff' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:22, height:22, borderRadius:6, background:s.color, border:'2px solid #333' }} />
                <div style={{ fontSize:12 }}>{idx+1}. {s.emoji} {s.name}</div>
              </div>
              <div style={{ fontSize:12, fontWeight:'bold' }}>{s.count}</div>
            </div>
          ))}
          <div style={{ textAlign:'right', marginTop: 8 }}>
            <button className="pixel-button" style={{ fontSize:10, padding:'6px 10px' }} onClick={async()=>{
              await awardWeeklyWinners(roomId, standings)
            }}>Ödülleri Dağıt</button>
          </div>
        </div>
      )}
    </PixelCard>
  )
}


