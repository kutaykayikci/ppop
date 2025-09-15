import React, { useEffect, useRef, useState } from 'react'

export default function ReactionTest({ onClose }) {
  const [state, setState] = useState('ready') // ready -> wait -> tap -> result
  const [message, setMessage] = useState('Hazır ol...')
  const startRef = useRef(0)
  const [score, setScore] = useState(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (state === 'wait') {
      const delay = 1000 + Math.random()*2000
      timeoutRef.current = setTimeout(() => {
        setState('tap')
        setMessage('Şimdi! Tıkla!')
        startRef.current = performance.now()
      }, delay)
    }
    return () => clearTimeout(timeoutRef.current)
  }, [state])

  const handleClick = () => {
    if (state === 'ready') {
      setState('wait')
      setMessage('Yeşili bekle...')
      return
    }
    if (state === 'wait') {
      setState('ready')
      setMessage('Erken! Tekrar dene.')
      return
    }
    if (state === 'tap') {
      const delta = Math.round(performance.now() - startRef.current)
      setScore(delta)
      setState('result')
      setMessage(`Tepki süresi: ${delta} ms`)
    }
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:1100, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div onClick={handleClick} style={{
        width: 320, height: 220, background:'#fff', border:'3px solid #333', borderRadius:12,
        display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
        boxShadow:'6px 6px 0 rgba(0,0,0,0.2)', position:'relative',
        backgroundColor: state==='tap' ? '#d4edda' : state==='wait' ? '#fff3cd' : '#fff'
      }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontWeight:'bold', marginBottom:8 }}>Reaction Test</div>
          <div style={{ fontSize:12 }}>{message}</div>
          {score !== null && <div style={{ marginTop:8, fontSize:12 }}>Skor: {score} ms</div>}
          <div style={{ fontSize:10, opacity:0.7, marginTop:6 }}>(Kartın herhangi bir yerine tıkla)</div>
        </div>
        <button onClick={(e)=>{ e.stopPropagation(); onClose(); }} className="pixel-button" style={{ position:'absolute', top:8, right:8, fontSize:10, padding:'4px 8px' }}>Kapat</button>
      </div>
    </div>
  )
}


