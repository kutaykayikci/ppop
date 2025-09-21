import React, { useState, useEffect } from 'react'

export default function MicroInteractions({ children, type = 'default' }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [particles, setParticles] = useState([])

  const createParticle = (x, y, color = '#ff6b6b') => {
    const newParticle = {
      id: Date.now() + Math.random(),
      x: x,
      y: y,
      color: color,
      size: Math.random() * 4 + 2,
      velocityX: (Math.random() - 0.5) * 4,
      velocityY: (Math.random() - 0.5) * 4,
      life: 1
    }
    
    setParticles(prev => [...prev, newParticle])
    
    // Remove particle after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id))
    }, 1000)
  }

  const handleMouseEnter = (e) => {
    setIsHovered(true)
    
    // Create hover particles
    if (type === 'sparkle') {
      const rect = e.currentTarget.getBoundingClientRect()
      createParticle(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        '#ffd700'
      )
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleClick = (e) => {
    setIsClicked(true)
    
    // Create click particles
    const rect = e.currentTarget.getBoundingClientRect()
    const colors = ['#ff6b6b', '#4ecdc4', '#6c5ce7', '#ffd700']
    
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        createParticle(
          rect.left + rect.width / 2 + (Math.random() - 0.5) * 20,
          rect.top + rect.height / 2 + (Math.random() - 0.5) * 20,
          colors[Math.floor(Math.random() * colors.length)]
        )
      }, i * 50)
    }
    
    // Reset click state
    setTimeout(() => setIsClicked(false), 200)
  }

  const getInteractionStyles = () => {
    const baseStyles = {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden'
    }

    switch (type) {
      case 'button':
        return {
          ...baseStyles,
          transform: isHovered ? 'translateY(-2px) scale(1.05)' : 'translateY(0) scale(1)',
          boxShadow: isHovered 
            ? '0 8px 32px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.3)'
            : '0 4px 16px rgba(0,0,0,0.1)',
          animation: isClicked ? 'pixel-shake 0.3s ease-in-out' : 'none'
        }
      
      case 'card':
        return {
          ...baseStyles,
          transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
          boxShadow: isHovered 
            ? '0 12px 48px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.3)'
            : '0 6px 20px rgba(0,0,0,0.1)',
          animation: isClicked ? 'pixel-bounce 0.6s ease-in-out' : 'none'
        }
      
      case 'icon':
        return {
          ...baseStyles,
          transform: isHovered ? 'scale(1.2) rotate(10deg)' : 'scale(1) rotate(0deg)',
          animation: isClicked ? 'pixel-pulse 0.4s ease-in-out' : 'none'
        }
      
      case 'sparkle':
        return {
          ...baseStyles,
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          animation: isHovered ? 'pixel-glow 1.5s ease-in-out infinite' : 'none',
          filter: isHovered ? 'brightness(1.2) saturate(1.2)' : 'brightness(1) saturate(1)'
        }
      
      default:
        return {
          ...baseStyles,
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
          opacity: isHovered ? 0.9 : 1
        }
    }
  }

  return (
    <div
      style={getInteractionStyles()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      
      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 1000,
            animation: 'pixel-fade-out 1s ease-out forwards'
          }}
        />
      ))}
      
      {/* Shine Effect */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
          animation: 'pixel-slide-in 0.6s ease-out',
          pointerEvents: 'none'
        }} />
      )}
      
      {/* Glow Effect */}
      {isHovered && type === 'sparkle' && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #6c5ce7)',
          borderRadius: 'inherit',
          zIndex: -1,
          opacity: 0.3,
          animation: 'pixel-glow 2s ease-in-out infinite'
        }} />
      )}
    </div>
  )
}
