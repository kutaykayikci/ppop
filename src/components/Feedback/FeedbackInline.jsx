import React, { useState, useEffect } from 'react';
import { FEEDBACK_ANIMATIONS } from '../../services/feedbackManager';

const FeedbackInline = ({ 
  id,
  title,
  message,
  icon,
  type = 'info',
  animation = FEEDBACK_ANIMATIONS.FADE,
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

  const getInlineStyles = () => {
    const baseStyles = {
      padding: '12px 16px',
      borderRadius: '6px',
      border: '2px solid #333',
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '10px',
      lineHeight: '1.4',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      margin: '8px 0',
      userSelect: 'none',
      transition: 'all 0.3s ease',
      transform: 'translateY(-10px)',
      opacity: 0
    };

    // Tip renkleri
    const typeColors = {
      success: { bg: '#d4edda', border: '#00b894', text: '#155724', icon: '#00b894' },
      error: { bg: '#f8d7da', border: '#e74c3c', text: '#721c24', icon: '#e74c3c' },
      warning: { bg: '#fff3cd', border: '#f39c12', text: '#856404', icon: '#f39c12' },
      info: { bg: '#d1ecf1', border: '#3498db', text: '#0c5460', icon: '#3498db' },
      achievement: { bg: '#e2e3f0', border: '#9b59b6', text: '#4a4a6a', icon: '#9b59b6' },
      motivation: { bg: '#fdebd0', border: '#e67e22', text: '#8b4513', icon: '#e67e22' }
    };

    const colors = typeColors[type] || typeColors.info;

    return {
      ...baseStyles,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      color: colors.text,
      transform: isVisible && !isExiting ? 'translateY(0)' : 'translateY(-10px)',
      opacity: isVisible && !isExiting ? 1 : 0
    };
  };

  const getAnimationClass = () => {
    if (isExiting) return 'feedback-exit';
    
    switch (animation) {
      case FEEDBACK_ANIMATIONS.SLIDE:
        return 'feedback-slide';
      case FEEDBACK_ANIMATIONS.BOUNCE:
        return 'feedback-bounce';
      case FEEDBACK_ANIMATIONS.PULSE:
        return 'feedback-pulse';
      case FEEDBACK_ANIMATIONS.SHAKE:
        return 'feedback-shake';
      default:
        return 'feedback-fade';
    }
  };

  const getTypeStyles = () => {
    const typeStyles = {
      success: { iconColor: '#00b894' },
      error: { iconColor: '#e74c3c' },
      warning: { iconColor: '#f39c12' },
      info: { iconColor: '#3498db' },
      achievement: { iconColor: '#9b59b6' },
      motivation: { iconColor: '#e67e22' }
    };

    return typeStyles[type] || typeStyles.info;
  };

  const typeStyles = getTypeStyles();

  return (
    <div
      className={`feedback-inline ${getAnimationClass()}`}
      style={getInlineStyles()}
      role="alert"
      aria-live="polite"
    >
      {/* İkon */}
      {icon && (
        <div style={{
          fontSize: '14px',
          flexShrink: 0,
          marginTop: '2px',
          color: typeStyles.iconColor
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
            gap: '6px',
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
                  padding: '3px 8px',
                  fontSize: '8px',
                  border: '1px solid #333',
                  borderRadius: '3px',
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
          marginLeft: '6px',
          flexShrink: 0,
          opacity: 0.7,
          transition: 'opacity 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = '0.7';
        }}
        aria-label="Kapat"
      >
        ×
      </button>
    </div>
  );
};

export default FeedbackInline;
