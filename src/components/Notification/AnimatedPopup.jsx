import React, { useState, useEffect } from 'react';

const AnimatedPopup = ({ 
  title, 
  message, 
  icon, 
  type = 'info', 
  duration = 4000, 
  onClose,
  show = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsAnimating(true);
      
      // Animasyon tamamlandıktan sonra
      setTimeout(() => setIsAnimating(false), 300);
      
      // Belirtilen süre sonra kapat
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }
  }, [show, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  const getPopupStyle = () => {
    const baseStyle = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 10000,
      maxWidth: '350px',
      minWidth: '300px',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      backdropFilter: 'blur(10px)',
      border: '2px solid #333',
      transform: isAnimating ? 'translateX(0)' : 'translateX(100%)',
      opacity: isAnimating ? 1 : 0,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      overflow: 'hidden'
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(46, 204, 113, 0.95)',
          borderColor: '#27ae60',
          color: '#fff'
        };
      case 'warning':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(241, 196, 15, 0.95)',
          borderColor: '#f39c12',
          color: '#fff'
        };
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(231, 76, 60, 0.95)',
          borderColor: '#e74c3c',
          color: '#fff'
        };
      case 'partner':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(155, 89, 182, 0.95)',
          borderColor: '#9b59b6',
          color: '#fff'
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: 'rgba(52, 152, 219, 0.95)',
          borderColor: '#3498db',
          color: '#fff'
        };
    }
  };

  const getIconStyle = () => {
    return {
      fontSize: '24px',
      marginRight: '12px',
      animation: isAnimating ? 'bounce 0.6s ease-in-out' : 'none'
    };
  };

  if (!isVisible) return null;

  return (
    <div style={getPopupStyle()} onClick={handleClose}>
      {/* Animasyonlu arka plan */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(45deg, 
          ${type === 'success' ? '#27ae60, #2ecc71' : 
            type === 'warning' ? '#f39c12, #f1c40f' :
            type === 'error' ? '#e74c3c, #c0392b' :
            type === 'partner' ? '#9b59b6, #8e44ad' :
            '#3498db, #2980b9'
          })`,
        opacity: 0.1,
        animation: isAnimating ? 'shimmer 2s ease-in-out infinite' : 'none'
      }} />
      
      {/* İçerik */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        zIndex: 1
      }}>
        {icon && (
          <span style={getIconStyle()}>
            {icon}
          </span>
        )}
        
        <div style={{ flex: 1 }}>
          {title && (
            <div style={{
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '4px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              {title}
            </div>
          )}
          
          {message && (
            <div style={{
              fontSize: '14px',
              opacity: 0.9,
              lineHeight: '1.4'
            }}>
              {message}
            </div>
          )}
        </div>
        
        {/* Kapat butonu */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
            marginLeft: '10px'
          }}
          onMouseOver={(e) => e.target.style.color = '#fff'}
          onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}
        >
          ×
        </button>
      </div>
      
      {/* Progress bar */}
      {duration > 0 && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: 'rgba(255,255,255,0.3)',
          borderRadius: '0 0 12px 12px'
        }}>
          <div style={{
            height: '100%',
            backgroundColor: '#fff',
            width: '100%',
            animation: `progress ${duration}ms linear`,
            borderRadius: '0 0 12px 12px'
          }} />
        </div>
      )}
      
      {/* CSS Animasyonları */}
      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0,-8px,0);
          }
          70% {
            transform: translate3d(0,-4px,0);
          }
          90% {
            transform: translate3d(0,-2px,0);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes progress {
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

export default AnimatedPopup;
