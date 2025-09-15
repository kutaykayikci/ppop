import React, { useState, useEffect } from 'react';
import { getDailyMotivation } from '../../services/motivationService';

const GlobalNotificationBanner = () => {
  const [currentMessage, setCurrentMessage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Sayfa yüklendiğinde ilk mesajı göster
    showRandomMessage();
    
    // Her 30 saniyede bir yeni mesaj göster
    const interval = setInterval(() => {
      showRandomMessage();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const showRandomMessage = () => {
    const motivation = getDailyMotivation();
    setCurrentMessage(motivation);
    setIsVisible(true);
    
    // 5 saniye sonra gizle
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || !currentMessage) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10001,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '15px 20px',
      textAlign: 'center',
      borderBottom: '3px solid #333',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      animation: 'slide-down 0.5s ease-out'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <span style={{ fontSize: '24px' }}>
          {currentMessage.emoji}
        </span>
        
        <span style={{
          fontSize: window.innerWidth < 768 ? '14px' : '16px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
        }}>
          {currentMessage.text}
        </span>
        
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '5px',
            borderRadius: '50%',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          ×
        </button>
      </div>
      
      {/* Progress bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '3px',
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
      }}>
        <div style={{
          height: '100%',
          backgroundColor: '#FFD700',
          width: '100%',
          animation: 'progress-bar 5s linear forwards'
        }} />
      </div>
      
      {/* CSS Animasyonları */}
      <style>{`
        @keyframes slide-down {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes progress-bar {
          0% {
            width: 100%;
          }
          100% {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default GlobalNotificationBanner;
