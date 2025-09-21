import React, { useState, useEffect } from 'react';
import { FEEDBACK_ANIMATIONS } from '../../services/feedbackManager';

const FeedbackToast = ({ 
  id,
  title,
  message,
  icon,
  type = 'info',
  duration = 3000,
  animation = FEEDBACK_ANIMATIONS.FADE,
  onClose,
  onAction,
  actions = [],
  position = 'top-right',
  theme = 'pixel'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Giriş animasyonu
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Otomatik kapatma
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onClose) onClose(id);
    }, 300);
  };

  const handleAction = (actionId) => {
    if (onAction) {
      onAction(actionId);
    }
    handleClose();
  };

  const getToastStyles = () => {
    const baseStyles = {
      position: 'fixed',
      zIndex: 10000,
      maxWidth: '400px',
      minWidth: '300px',
      padding: '16px',
      borderRadius: '8px',
      border: '2px solid #333',
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '10px',
      lineHeight: '1.4',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'all 0.3s ease',
      transform: 'translateX(100%)',
      opacity: 0
    };

    // Pozisyon
    const positions = {
      'top-right': { top: '20px', right: '20px' },
      'top-left': { top: '20px', left: '20px' },
      'bottom-right': { bottom: '20px', right: '20px' },
      'bottom-left': { bottom: '20px', left: '20px' },
      'top-center': { top: '20px', left: '50%', transform: 'translateX(-50%)' },
      'bottom-center': { bottom: '20px', left: '50%', transform: 'translateX(-50%)' }
    };

    // Tip renkleri
    const typeColors = {
      success: { bg: '#00b894', border: '#00a085', text: '#fff' },
      error: { bg: '#e74c3c', border: '#c0392b', text: '#fff' },
      warning: { bg: '#f39c12', border: '#e67e22', text: '#fff' },
      info: { bg: '#3498db', border: '#2980b9', text: '#fff' },
      achievement: { bg: '#9b59b6', border: '#8e44ad', text: '#fff' },
      motivation: { bg: '#e67e22', border: '#d35400', text: '#fff' }
    };

    const colors = typeColors[type] || typeColors.info;
    const positionStyles = positions[position] || positions['top-right'];

    return {
      ...baseStyles,
      ...positionStyles,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      color: colors.text,
      transform: isVisible && !isExiting ? 'translateX(0)' : 'translateX(100%)',
      opacity: isVisible && !isExiting ? 1 : 0
    };
  };

  const getAnimationClass = () => {
    if (isExiting) return 'feedback-exit';
    
    switch (animation) {
      case FEEDBACK_ANIMATIONS.BOUNCE:
        return 'feedback-bounce';
      case FEEDBACK_ANIMATIONS.SLIDE:
        return 'feedback-slide';
      case FEEDBACK_ANIMATIONS.SHAKE:
        return 'feedback-shake';
      case FEEDBACK_ANIMATIONS.PULSE:
        return 'feedback-pulse';
      case FEEDBACK_ANIMATIONS.ZOOM:
        return 'feedback-zoom';
      case FEEDBACK_ANIMATIONS.FLIP:
        return 'feedback-flip';
      default:
        return 'feedback-fade';
    }
  };

  return (
    <div
      className={`feedback-toast ${getAnimationClass()}`}
      style={getToastStyles()}
      onClick={handleClose}
      role="alert"
      aria-live="polite"
    >
      {/* İkon */}
      {icon && (
        <div style={{
          fontSize: '16px',
          flexShrink: 0,
          marginTop: '2px'
        }}>
          {icon}
        </div>
      )}

      {/* İçerik */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div style={{
            fontWeight: 'bold',
            marginBottom: '4px',
            fontSize: '11px'
          }}>
            {title}
          </div>
        )}
        
        <div style={{
          fontSize: '10px',
          lineHeight: '1.3',
          wordWrap: 'break-word'
        }}>
          {message}
        </div>

        {/* Aksiyonlar */}
        {actions.length > 0 && (
          <div style={{
            marginTop: '8px',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(action.id);
                }}
                style={{
                  padding: '4px 8px',
                  fontSize: '8px',
                  border: '1px solid #333',
                  borderRadius: '4px',
                  backgroundColor: action.primary ? '#333' : 'transparent',
                  color: action.primary ? '#fff' : '#333',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = action.primary ? '#555' : '#f0f0f0';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = action.primary ? '#333' : 'transparent';
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Kapatma butonu */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          fontSize: '12px',
          cursor: 'pointer',
          padding: '2px',
          marginLeft: '8px',
          flexShrink: 0
        }}
        aria-label="Kapat"
      >
        ×
      </button>
    </div>
  );
};

export default FeedbackToast;
