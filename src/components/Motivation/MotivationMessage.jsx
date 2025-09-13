import React, { useState, useEffect } from 'react';
import PixelCard from '../PixelCard';

const MotivationMessage = ({ message, type = 'general', onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Animasyonu başlat
    setTimeout(() => setIsVisible(true), 100);
    setTimeout(() => setIsAnimating(true), 200);
    
    // Belirtilen süre sonra kapat
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose && onClose(), 300);
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!message) return null;

  // Tip'e göre renk seçimi
  const getTypeColor = () => {
    switch (type) {
      case 'achievement':
        return '#F39C12'; // Altın
      case 'streak':
        return '#E74C3C'; // Kırmızı
      case 'daily':
        return '#3498DB'; // Mavi
      case 'partner':
        return '#9B59B6'; // Mor
      case 'special':
        return '#1ABC9C'; // Turkuaz
      default:
        return '#2ECC71'; // Yeşil
    }
  };

  const typeColor = getTypeColor();

  return (
    <div 
      className="motivation-message"
      style={{
        position: 'fixed',
        top: '80px',
        left: '50%',
        transform: isVisible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-100%)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 999,
        maxWidth: '90%',
        width: '400px'
      }}
    >
      <PixelCard 
        style={{
          backgroundColor: '#fff',
          borderColor: typeColor,
          borderWidth: '3px',
          position: 'relative',
          overflow: 'hidden',
          animation: isAnimating ? 'motivation-pulse 0.8s ease-out' : 'none'
        }}
      >
        {/* Arka plan efekti */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(45deg, ${typeColor}15, transparent, ${typeColor}15)`,
            animation: isAnimating ? 'motivation-glow 2s ease-in-out infinite' : 'none'
          }}
        />
        
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          {/* Emoji */}
          <div style={{
            fontSize: '32px',
            marginBottom: '10px',
            animation: isAnimating ? 'motivation-bounce 0.6s ease-out' : 'none'
          }}>
            {message.emoji}
          </div>

          {/* Mesaj */}
          <p style={{
            fontSize: '12px',
            color: '#333',
            margin: 0,
            lineHeight: 1.3,
            fontWeight: 'bold'
          }}>
            {message.text}
          </p>

          {/* Kapatma butonu */}
          <button
            onClick={() => {
              setIsAnimating(false);
              setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => onClose && onClose(), 300);
              }, 300);
            }}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#999',
              fontSize: '14px',
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

        {/* Parçacık efektleri */}
        {isAnimating && (
          <div className="motivation-particles">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '6px',
                  height: '6px',
                  backgroundColor: typeColor,
                  borderRadius: '50%',
                  left: `${15 + i * 15}%`,
                  top: '50%',
                  animation: `motivation-particle 1.5s ease-out forwards`,
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

export default MotivationMessage;
