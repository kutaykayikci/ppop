import React, { useState, useEffect } from 'react';
import { FEEDBACK_ANIMATIONS } from '../../services/feedbackManager';

const FeedbackBanner = ({ 
  id,
  title,
  message,
  icon,
  type = 'info',
  persistent = false,
  animation = FEEDBACK_ANIMATIONS.PULSE,
  onClose,
  onAction,
  actions = [],
  position = 'top',
  theme = 'pixel'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Giriş animasyonu
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    if (persistent) return; // Kalıcı banner'lar kapatılamaz
    
    setIsExiting(true);
    setTimeout(() => {
      if (onClose) onClose(id);
    }, 300);
  };

  const handleAction = (actionId) => {
    if (onAction) {
      onAction(actionId);
    }
    if (!persistent) {
      handleClose();
    }
  };

  const getBannerStyles = () => {
    const baseStyles = {
      position: 'fixed',
      left: 0,
      right: 0,
      zIndex: 9999,
      padding: '12px 20px',
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '10px',
      lineHeight: '1.4',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      userSelect: 'none',
      transition: 'all 0.3s ease',
      transform: 'translateY(-100%)',
      opacity: 0
    };

    // Pozisyon
    const positions = {
      'top': { top: 0 },
      'bottom': { bottom: 0 }
    };

    // Tip renkleri
    const typeColors = {
      success: { bg: '#00b894', border: '#00a085', text: '#fff' },
      error: { bg: '#e74c3c', border: '#c0392b', text: '#fff' },
      warning: { bg: '#f39c12', border: '#e67e22', text: '#fff' },
      info: { bg: '#3498db', border: '#2980b9', text: '#fff' },
      offline: { bg: '#95a5a6', border: '#7f8c8d', text: '#fff' },
      update: { bg: '#9b59b6', border: '#8e44ad', text: '#fff' }
    };

    const colors = typeColors[type] || typeColors.info;
    const positionStyles = positions[position] || positions['top'];

    return {
      ...baseStyles,
      ...positionStyles,
      backgroundColor: colors.bg,
      borderBottom: `3px solid ${colors.border}`,
      color: colors.text,
      transform: isVisible && !isExiting ? 'translateY(0)' : 'translateY(-100%)',
      opacity: isVisible && !isExiting ? 1 : 0
    };
  };

  const getAnimationClass = () => {
    if (isExiting) return 'feedback-exit';
    
    switch (animation) {
      case FEEDBACK_ANIMATIONS.PULSE:
        return 'feedback-pulse';
      case FEEDBACK_ANIMATIONS.SLIDE:
        return 'feedback-slide';
      case FEEDBACK_ANIMATIONS.SHAKE:
        return 'feedback-shake';
      default:
        return 'feedback-fade';
    }
  };

  return (
    <div
      className={`feedback-banner ${getAnimationClass()}`}
      style={getBannerStyles()}
      role="alert"
      aria-live="polite"
    >
      {/* İkon */}
      {icon && (
        <div style={{
          fontSize: '16px',
          flexShrink: 0
        }}>
          {icon}
        </div>
      )}

      {/* İçerik */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div style={{
            fontWeight: 'bold',
            marginBottom: '2px',
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
      </div>

      {/* Aksiyonlar */}
      {actions.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '8px',
          flexShrink: 0
        }}>
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                handleAction(action.id);
              }}
              style={{
                padding: '6px 12px',
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

      {/* Kapatma butonu (sadece kalıcı olmayan banner'lar için) */}
      {!persistent && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '4px',
            marginLeft: '8px',
            flexShrink: 0
          }}
          aria-label="Kapat"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default FeedbackBanner;
