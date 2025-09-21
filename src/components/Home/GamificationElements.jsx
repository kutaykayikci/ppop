import React, { useState, useEffect } from 'react'
import PixelCard from '@/components/PixelCard'

export default function GamificationElements() {
  const [achievements, setAchievements] = useState([])
  const [level, setLevel] = useState(1)
  const [experience, setExperience] = useState(0)
  const [streak, setStreak] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Simulate loading achievements
    const timer = setTimeout(() => {
      setAchievements([
        { id: 1, name: 'İlk Poop', emoji: '💩', description: 'İlk poopunu saydın!', rarity: 'common', unlocked: true },
        { id: 2, name: 'Günlük Rutin', emoji: '📅', description: '7 gün üst üste poop saydın', rarity: 'rare', unlocked: true },
        { id: 3, name: 'Sosyal Kelebek', emoji: '🦋', description: '5 farklı odaya katıldın', rarity: 'epic', unlocked: false },
        { id: 4, name: 'Poop Ustası', emoji: '🏆', description: '100 poop saydın', rarity: 'legendary', unlocked: false }
      ])
      setLevel(3)
      setExperience(750)
      setStreak(12)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const getRarityColor = (rarity) => {
    const colors = {
      common: '#95A5A6',
      rare: '#3498DB',
      epic: '#9B59B6',
      legendary: '#F39C12'
    }
    return colors[rarity] || '#95A5A6'
  }

  const getRarityGlow = (rarity) => {
    const glows = {
      common: '0 0 5px rgba(149, 165, 166, 0.3)',
      rare: '0 0 10px rgba(52, 152, 219, 0.4)',
      epic: '0 0 15px rgba(155, 89, 182, 0.5)',
      legendary: '0 0 20px rgba(243, 156, 18, 0.6)'
    }
    return glows[rarity] || '0 0 5px rgba(149, 165, 166, 0.3)'
  }

  const experienceToNextLevel = 1000
  const progressPercentage = (experience / experienceToNextLevel) * 100

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Level Progress */}
      <PixelCard 
        className="gamification-card"
        style={{
          padding: '20px',
          marginBottom: '16px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,249,250,0.9))',
          border: '3px solid #333',
          borderRadius: '12px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            fontSize: '32px',
            animation: isAnimating ? 'pixel-bounce 1s ease-in-out infinite' : 'none'
          }}>
            🏆
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '4px'
            }}>
              Seviye {level}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#666'
            }}>
              {experience} / {experienceToNextLevel} XP
            </div>
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#ff6b6b',
            textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
          }}>
            {streak} 🔥
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          height: '12px',
          backgroundColor: '#f0f0f0',
          borderRadius: '6px',
          overflow: 'hidden',
          border: '2px solid #333',
          position: 'relative'
        }}>
          <div style={{
            height: '100%',
            width: `${progressPercentage}%`,
            background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4)',
            borderRadius: '4px',
            transition: 'width 1s ease-in-out',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              animation: 'pixel-float 2s ease-in-out infinite'
            }} />
          </div>
        </div>

        {/* Floating Particles */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          fontSize: '12px',
          animation: 'pixel-float 3s ease-in-out infinite',
          animationDelay: '0s'
        }}>
          ✨
        </div>
        <div style={{
          position: 'absolute',
          bottom: '15px',
          left: '20px',
          fontSize: '10px',
          animation: 'pixel-float 4s ease-in-out infinite',
          animationDelay: '1s'
        }}>
          ⭐
        </div>
      </PixelCard>

      {/* Achievements */}
      <PixelCard 
        className="gamification-card"
        style={{
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,249,250,0.9))',
          border: '3px solid #333',
          borderRadius: '12px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          🏅 Başarılar
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          {achievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: `2px solid ${achievement.unlocked ? getRarityColor(achievement.rarity) : '#ddd'}`,
                backgroundColor: achievement.unlocked 
                  ? `rgba(${achievement.rarity === 'legendary' ? '243, 156, 18' : '0, 0, 0'}, 0.05)`
                  : '#f8f9fa',
                opacity: achievement.unlocked ? 1 : 0.6,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                animationDelay: `${index * 100}ms`
              }}
              onMouseEnter={(e) => {
                if (achievement.unlocked) {
                  e.target.style.transform = 'translateY(-2px) scale(1.02)'
                  e.target.style.boxShadow = `0 4px 12px rgba(0,0,0,0.1), ${getRarityGlow(achievement.rarity)}`
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)'
                e.target.style.boxShadow = 'none'
              }}
            >
              {/* Shine Effect */}
              {achievement.unlocked && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  transition: 'left 0.6s ease',
                  pointerEvents: 'none'
                }} />
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  fontSize: '24px',
                  animation: achievement.unlocked ? 'pixel-bounce 2s ease-in-out infinite' : 'none',
                  animationDelay: `${index * 0.2}s`
                }}>
                  {achievement.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: achievement.unlocked ? '#333' : '#999',
                    marginBottom: '4px'
                  }}>
                    {achievement.name}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: achievement.unlocked ? '#666' : '#ccc',
                    lineHeight: '1.3'
                  }}>
                    {achievement.description}
                  </div>
                </div>
                {achievement.unlocked && (
                  <div style={{
                    fontSize: '12px',
                    color: getRarityColor(achievement.rarity),
                    fontWeight: 'bold'
                  }}>
                    ✓
                  </div>
                )}
              </div>

              {/* Rarity Indicator */}
              <div style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getRarityColor(achievement.rarity),
                boxShadow: achievement.unlocked ? getRarityGlow(achievement.rarity) : 'none'
              }} />
            </div>
          ))}
        </div>

        {/* Floating Particles */}
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          fontSize: '14px',
          animation: 'pixel-float 3s ease-in-out infinite',
          animationDelay: '0s'
        }}>
          🎉
        </div>
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '25px',
          fontSize: '12px',
          animation: 'pixel-float 4s ease-in-out infinite',
          animationDelay: '1.5s'
        }}>
          💫
        </div>
      </PixelCard>

      <style jsx>{`
        .gamification-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .gamification-card:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        }
        
        .achievement-item {
          animation: pixel-fade-in 0.6s ease-out both;
        }
        
        .achievement-item.unlocked {
          animation: pixel-fade-in 0.6s ease-out both;
        }
        
        .achievement-item.locked {
          filter: grayscale(0.5);
        }
        
        .achievement-item:hover::before {
          left: 100%;
        }
      `}</style>
    </div>
  )
}
