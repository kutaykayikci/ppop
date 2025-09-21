import React from 'react';
import PixelCard from '../PixelCard';
import PixelButton from '../PixelButton';
import { theme } from '../../theme';

const PixelAlert = ({ 
  title,
  message,
  type = 'info',
  showIcon = true,
  showCloseButton = true,
  actions = [],
  onClose,
  className = '',
  style = {}
}) => {
  const getTypeStyles = () => {
    const typeStyles = {
      success: {
        backgroundColor: '#e8f5e8',
        borderColor: theme.colors.success,
        textColor: '#2e7d32',
        icon: '✅',
        iconBg: theme.colors.success
      },
      error: {
        backgroundColor: '#ffebee',
        borderColor: theme.colors.error,
        textColor: '#c62828',
        icon: '❌',
        iconBg: theme.colors.error
      },
      warning: {
        backgroundColor: '#fff3e0',
        borderColor: theme.colors.warning,
        textColor: '#ef6c00',
        icon: '⚠️',
        iconBg: theme.colors.warning
      },
      info: {
        backgroundColor: '#e3f2fd',
        borderColor: theme.colors.info,
        textColor: '#1565c0',
        icon: 'ℹ️',
        iconBg: theme.colors.info
      },
      achievement: {
        backgroundColor: '#fff8e1',
        borderColor: theme.colors.game.coin,
        textColor: '#f57f17',
        icon: '🏆',
        iconBg: theme.colors.game.coin
      },
      poop: {
        backgroundColor: '#f3e5ab',
        borderColor: theme.colors.brown[500],
        textColor: theme.colors.brown[700],
        icon: '💩',
        iconBg: theme.colors.brown[500]
      }
    };
    
    return typeStyles[type] || typeStyles.info;
  };

  const typeStyles = getTypeStyles();

  return (
    <PixelCard
      className={`pixel-alert ${className}`}
      style={{
        backgroundColor: typeStyles.backgroundColor,
        border: `3px solid ${typeStyles.borderColor}`,
        padding: theme.spacing.lg,
        margin: theme.spacing.md,
        boxShadow: theme.shadows.md,
        animation: 'alertSlideIn 0.3s ease-out',
        ...style
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: theme.spacing.md
      }}>
        {/* Icon */}
        {showIcon && (
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: theme.borderRadius.md,
            backgroundColor: typeStyles.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            flexShrink: 0,
            boxShadow: theme.shadows.sm
          }}>
            {typeStyles.icon}
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1 }}>
          {/* Title */}
          {title && (
            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '14px',
              fontWeight: 'bold',
              color: typeStyles.textColor,
              fontFamily: theme.fonts.primary
            }}>
              {title}
            </h3>
          )}

          {/* Message */}
          <p style={{
            margin: '0 0 16px 0',
            fontSize: '12px',
            color: typeStyles.textColor,
            lineHeight: 1.5
          }}>
            {message}
          </p>

          {/* Actions */}
          {actions.length > 0 && (
            <div style={{
              display: 'flex',
              gap: theme.spacing.sm,
              flexWrap: 'wrap'
            }}>
              {actions.map((action, index) => (
                <PixelButton
                  key={index}
                  variant={action.variant || 'secondary'}
                  size="sm"
                  onClick={action.onClick}
                  style={{
                    fontSize: '10px',
                    padding: `${theme.spacing.sm} ${theme.spacing.md}`
                  }}
                >
                  {action.label}
                </PixelButton>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: typeStyles.textColor,
              fontSize: '16px',
              cursor: 'pointer',
              padding: theme.spacing.xs,
              borderRadius: theme.borderRadius.xs,
              opacity: 0.7,
              transition: theme.transitions.fast,
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = '1';
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = '0.7';
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            ✕
          </button>
        )}
      </div>
    </PixelCard>
  );
};

export default PixelAlert;
