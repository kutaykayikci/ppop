import React, { useState, useEffect } from 'react';
import PixelCard from '../PixelCard';
import PixelButton from '../PixelButton';
import { FEEDBACK_ANIMATIONS } from '../../services/feedbackManager';

const FeedbackModal = ({ 
  id,
  title,
  message,
  icon,
  type = 'info',
  animation = FEEDBACK_ANIMATIONS.ZOOM,
  onClose,
  onAction,
  actions = [],
  theme = 'pixel'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Giriş animasyonu
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const getModalStyles = () => {
    const baseStyles = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      transition: 'all 0.3s ease',
      opacity: isVisible && !isExiting ? 1 : 0
    };

    return baseStyles;
  };

  const getContentStyles = () => {
    const baseStyles = {
      maxWidth: '500px',
      width: '100%',
      maxHeight: '80vh',
      overflow: 'auto',
      transition: 'all 0.3s ease',
      transform: isVisible && !isExiting ? 'scale(1)' : 'scale(0.8)',
      opacity: isVisible && !isExiting ? 1 : 0
    };

    return baseStyles;
  };

  const getAnimationClass = () => {
    if (isExiting) return 'feedback-exit';
    
    switch (animation) {
      case FEEDBACK_ANIMATIONS.ZOOM:
        return 'feedback-zoom';
      case FEEDBACK_ANIMATIONS.SLIDE:
        return 'feedback-slide';
      case FEEDBACK_ANIMATIONS.BOUNCE:
        return 'feedback-bounce';
      case FEEDBACK_ANIMATIONS.FLIP:
        return 'feedback-flip';
      default:
        return 'feedback-fade';
    }
  };

  const getTypeStyles = () => {
    const typeStyles = {
      success: { borderColor: '#00b894', iconColor: '#00b894' },
      error: { borderColor: '#e74c3c', iconColor: '#e74c3c' },
      warning: { borderColor: '#f39c12', iconColor: '#f39c12' },
      info: { borderColor: '#3498db', iconColor: '#3498db' },
      achievement: { borderColor: '#9b59b6', iconColor: '#9b59b6' },
      motivation: { borderColor: '#e67e22', iconColor: '#e67e22' }
    };

    return typeStyles[type] || typeStyles.info;
  };

  const typeStyles = getTypeStyles();

  return (
    <div
      className={`feedback-modal ${getAnimationClass()}`}
      style={getModalStyles()}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? `modal-title-${id}` : undefined}
      aria-describedby={`modal-message-${id}`}
    >
      <div style={getContentStyles()}>
        <PixelCard style={{
          border: `3px solid ${typeStyles.borderColor}`,
          position: 'relative'
        }}>
          {/* Başlık */}
          {title && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '2px solid #333'
            }}>
              {icon && (
                <div style={{
                  fontSize: '24px',
                  color: typeStyles.iconColor
                }}>
                  {icon}
                </div>
              )}
              <h2 
                id={`modal-title-${id}`}
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#333',
                  margin: 0,
                  flex: 1
                }}
              >
                {title}
              </h2>
            </div>
          )}

          {/* Mesaj */}
          <div 
            id={`modal-message-${id}`}
            style={{
              fontSize: '12px',
              lineHeight: '1.5',
              color: '#333',
              marginBottom: '20px',
              wordWrap: 'break-word'
            }}
          >
            {message}
          </div>

          {/* Aksiyonlar */}
          {actions.length > 0 && (
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              flexWrap: 'wrap'
            }}>
              {actions.map((action, index) => (
                <PixelButton
                  key={index}
                  onClick={() => handleAction(action.id)}
                  variant={action.primary ? 'primary' : 'secondary'}
                  size="small"
                  style={{
                    fontSize: '10px',
                    padding: '8px 16px'
                  }}
                >
                  {action.label}
                </PixelButton>
              ))}
            </div>
          )}

          {/* Kapatma butonu */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#666',
              padding: '4px',
              borderRadius: '4px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f0f0f0';
              e.target.style.color = '#333';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#666';
            }}
            aria-label="Kapat"
          >
            ×
          </button>
        </PixelCard>
      </div>
    </div>
  );
};

export default FeedbackModal;
