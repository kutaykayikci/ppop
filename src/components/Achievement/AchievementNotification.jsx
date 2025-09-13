import React, { useState, useEffect } from 'react';
import PixelCard from '../PixelCard';
import { RARITY_COLORS } from '../../services/achievementService';

const AchievementNotification = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Animasyonu başlat
    setTimeout(() => setIsVisible(true), 100);
    setTimeout(() => setIsAnimating(true), 200);
    
    // 4 saniye sonra kapat
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300);
      }, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!achievement) return null;

  const rarityColor = RARITY_COLORS[achievement.rarity] || '#95A5A6';

  return (
    <div 
      className={`achievement-notification ${isVisible ? 'visible' : ''}`}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        transform: isVisible ? 'translateX(0)' : 'translateX(400px)',
        transition: 'transform 0.3s ease-in-out',
        maxWidth: '300px'
      }}
    >
      <PixelCard 
        style={{
          backgroundColor: '#fff',
          borderColor: rarityColor,
          borderWidth: '3px',
          position: 'relative',
          overflow: 'hidden',
          animation: isAnimating ? 'achievement-celebration 0.6s ease-out' : 'none'
        }}
      >
        {/* Arka plan efekti */}
        <div 
          className="achievement-glow"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(45deg, ${rarityColor}20, transparent, ${rarityColor}20)`,
            animation: isAnimating ? 'achievement-glow 2s ease-in-out infinite' : 'none'
          }}
        />
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Başlık */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px'
          }}>
            <div style={{
              fontSize: '24px',
              animation: isAnimating ? 'achievement-bounce 0.6s ease-out' : 'none'
            }}>
              {achievement.emoji}
            </div>
            <div>
              <h3 style={{
                color: rarityColor,
                fontSize: '12px',
                margin: 0,
                fontWeight: 'bold'
              }}>
                🏆 BAŞARI KAZANDIN!
              </h3>
              <h4 style={{
                color: '#333',
                fontSize: '10px',
                margin: 0,
                fontWeight: 'normal'
              }}>
                {achievement.name}
              </h4>
            </div>
          </div>

          {/* Açıklama */}
          <p style={{
            fontSize: '8px',
            color: '#666',
            margin: 0,
            lineHeight: 1.2
          }}>
            {achievement.description}
          </p>

          {/* Rarity badge */}
          <div style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            backgroundColor: rarityColor,
            color: '#fff',
            fontSize: '6px',
            padding: '2px 6px',
            borderRadius: '10px',
            textTransform: 'uppercase',
            fontWeight: 'bold'
          }}>
            {achievement.rarity}
          </div>

          {/* Kapatma butonu */}
          <button
            onClick={() => {
              setIsAnimating(false);
              setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => onClose(), 300);
              }, 300);
            }}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#999',
              fontSize: '12px',
              cursor: 'pointer',
              padding: '2px',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        {/* Konfetiler */}
        {isAnimating && (
          <div className="achievement-confetti">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  position: 'absolute',
                  width: '4px',
                  height: '4px',
                  backgroundColor: rarityColor,
                  left: `${20 + i * 10}%`,
                  top: '50%',
                  animation: `confetti-fall 1.5s ease-out forwards`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        )}
      </PixelCard>
    </div>
  );
};

export default AchievementNotification;
