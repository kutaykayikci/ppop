import React, { useState, useEffect } from 'react';
import PixelCard from '../PixelCard';
import { theme } from '../../theme';

const PixelToast = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  position = 'top-right',
  onClose,
  isVisible = true,
  className = '',
  style = {}
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsActive(true);
      setIsExiting(false);
      
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsActive(false);
      onClose?.();
    }, 300);
  };

  const getTypeStyles = () => {
    const typeStyles = {
      success: {
        backgroundColor: theme.colors.success,
        borderColor: '#2e7d32',
        icon: '✅',
        glowColor: theme.colors.success
      },
      error: {
        backgroundColor: theme.colors.error,
        borderColor: '#c62828',
        icon: '❌',
        glowColor: theme.colors.error
      },
      warning: {
        backgroundColor: theme.colors.warning,
        borderColor: '#ef6c00',
        icon: '⚠️',
        glowColor: theme.colors.warning
      },
      info: {
        backgroundColor: theme.colors.info,
        borderColor: '#1565c0',
        icon: 'ℹ️',
        glowColor: theme.colors.info
      },
      achievement: {
        backgroundColor: theme.colors.game.coin,
        borderColor: '#f57f17',
        icon: '🏆',
        glowColor: theme.colors.game.coin
      },
      poop: {
        backgroundColor: theme.colors.brown[500],
        borderColor: theme.colors.brown[700],
        icon: '💩',
        glowColor: theme.colors.brown[500]
      }
    };
    
    return typeStyles[type] || typeStyles.info;
  };

  const getPositionStyles = () => {
    const positionStyles = {
      'top-left': { top: theme.spacing.lg, left: theme.spacing.lg },
      'top-right': { top: theme.spacing.lg, right: theme.spacing.lg },
      'top-center': { top: theme.spacing.lg, left: '50%', transform: 'translateX(-50%)' },
      'bottom-left': { bottom: theme.spacing.lg, left: theme.spacing.lg },
      'bottom-right': { bottom: theme.spacing.lg, right: theme.spacing.lg },
      'bottom-center': { bottom: theme.spacing.lg, left: '50%', transform: 'translateX(-50%)' }
    };
    
    return positionStyles[position] || positionStyles['top-right'];
  };

  const typeStyles = getTypeStyles();
  const positionStyles = getPositionStyles();

  if (!isActive) return null;

  return (
    <div
      className={`pixel-toast ${className}`}
      style={{
        position: 'fixed',
        zIndex: theme.zIndex.notification,
        minWidth: '300px',
        maxWidth: '400px',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'translateX(100%)' : 'translateX(0)',
        transition: `all ${theme.transitions.normal}`,
        ...positionStyles,
        ...style
      }}
    >
      <PixelCard
        style={{
          backgroundColor: typeStyles.backgroundColor,
          border: `3px solid ${typeStyles.borderColor}`,
          color: theme.colors.white,
          padding: theme.spacing.md,
          boxShadow: `0 0 20px ${typeStyles.glowColor}40`,
          animation: 'toastSlideIn 0.3s ease-out'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing.sm
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            flex: 1
          }}>
            <span style={{ fontSize: '20px' }}>
              {typeStyles.icon}
            </span>
            <div style={{
              fontSize: '12px',
              fontWeight: 'bold',
              lineHeight: 1.4,
              flex: 1
            }}>
              {message}
            </div>
          </div>
          
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.white,
              fontSize: '16px',
              cursor: 'pointer',
              padding: theme.spacing.xs,
              borderRadius: theme.borderRadius.xs,
              opacity: 0.8,
              transition: theme.transitions.fast
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = '1';
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = '0.8';
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            ✕
          </button>
        </div>
      </PixelCard>
    </div>
  );
};

export default PixelToast;
