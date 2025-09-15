import React, { useEffect, useState } from 'react'

export default function TapConfetti({ onClose }) {
  const [confetti, setConfetti] = useState([])

  useEffect(() => {
    const id = setInterval(() => addBurst(), 600)
    return () => clearInterval(id)
  }, [])

  const addBurst = (x = Math.random() * 100, y = Math.random() * 100) => {
    const colors = ['#ff6b6b','#4ecdc4','#45b7d1','#ffd93d','#6c5ce7','#ff8fab']
    const pieces = []
    for (let i=0;i<14;i++) {
      pieces.push({
        id: Date.now()+Math.random(),
        left: x + (Math.random()*20-10),
        top: y + (Math.random()*20-10),
        color: colors[Math.floor(Math.random()*colors.length)],
        size: 6+Math.random()*6,
        rotate: Math.random()*360,
        delay: Math.random()*50
      })
    }
    setConfetti(prev => [...prev, ...pieces])
    setTimeout(() => setConfetti(prev => prev.slice(pieces.length)), 1200)
  }

  return (
    <div onClick={(e)=>{
      const rect = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX-rect.left)/rect.width)*100
      const y = ((e.clientY-rect.top)/rect.height)*100
      addBurst(x,y)
    }} style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:1100,
      display:'flex', alignItems:'center', justifyContent:'center'
    }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        {confetti.map(p => (
          <div key={p.id} style={{
            position:'absolute', left:`${p.left}%`, top:`${p.top}%`, width:p.size, height:p.size,
            background:p.color, transform:`rotate(${p.rotate}deg)`, borderRadius:2,
            animation:'fall 1.2s ease-out forwards', animationDelay:`${p.delay}ms`
          }} />
        ))}
      </div>
      <div style={{
        background:'#fff', border:'3px solid #333', borderRadius:12, padding:16,
        boxShadow:'6px 6px 0 rgba(0,0,0,0.2)', textAlign:'center'
      }}>
        <div style={{ fontWeight:'bold', marginBottom:8 }}>Tap-to-Confetti</div>
        <div style={{ fontSize:12, marginBottom:12 }}>Ekrana dokun, konfeti patlat! 🎉</div>
        <button onClick={onClose} className="pixel-button" style={{ fontSize:12, padding:'8px 12px' }}>Kapat</button>
      </div>
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0); opacity:1 }
          100% { transform: translateY(100px) rotate(180deg); opacity:0 }
        }
      `}</style>
    </div>
  )
}


