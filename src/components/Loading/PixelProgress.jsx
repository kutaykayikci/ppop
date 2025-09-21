import React from 'react';
import { theme } from '../../theme';

const PixelProgress = ({ 
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = true,
  animated = true,
  striped = false,
  className = '',
  style = {}
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const getSizeStyles = () => {
    const sizes = {
      xs: { height: '8px', fontSize: '8px' },
      sm: { height: '12px', fontSize: '10px' },
      md: { height: '16px', fontSize: '12px' },
      lg: { height: '20px', fontSize: '14px' },
      xl: { height: '24px', fontSize: '16px' }
    };
    return sizes[size] || sizes.md;
  };

  const getVariantStyles = () => {
    const variants = {
      primary: {
        backgroundColor: theme.colors.primary,
        borderColor: '#e55a5a'
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
        borderColor: '#45b7b8'
      },
      success: {
        backgroundColor: theme.colors.success,
        borderColor: '#2e7d32'
      },
      warning: {
        backgroundColor: theme.colors.warning,
        borderColor: '#ef6c00'
      },
      error: {
        backgroundColor: theme.colors.error,
        borderColor: '#c62828'
      },
      info: {
        backgroundColor: theme.colors.info,
        borderColor: '#1565c0'
      },
      poop: {
        backgroundColor: theme.colors.brown[500],
        borderColor: theme.colors.brown[700]
      },
      neon: {
        backgroundColor: theme.colors.neon.green,
        borderColor: '#00cc33',
        boxShadow: `0 0 10px ${theme.colors.neon.green}80`
      }
    };
    return variants[variant] || variants.primary;
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const getStripedBackground = () => {
    if (!striped) return variantStyles.backgroundColor;
    return `repeating-linear-gradient(
      45deg,
      ${variantStyles.backgroundColor},
      ${variantStyles.backgroundColor} 10px,
      ${variantStyles.borderColor} 10px,
      ${variantStyles.borderColor} 20px
    )`;
  };

  return (
    <div
      className={`pixel-progress ${className}`}
      style={{
        width: '100%',
        position: 'relative',
        ...style
      }}
    >
      {/* Progress Bar Container */}
      <div
        style={{
          width: '100%',
          height: sizeStyles.height,
          backgroundColor: theme.colors.gray[200],
          border: `2px solid ${theme.colors.black}`,
          borderRadius: theme.borderRadius.sm,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: theme.shadows.inset
        }}
      >
        {/* Progress Fill */}
        <div
          className="progress-fill"
          style={{
            height: '100%',
            width: `${percentage}%`,
            background: getStripedBackground(),
            border: `1px solid ${variantStyles.borderColor}`,
            borderRadius: theme.borderRadius.xs,
            transition: animated ? `width ${theme.transitions.normal}` : 'none',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Animated Stripes */}
          {animated && striped && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(
                  45deg,
                  transparent 25%,
                  rgba(255, 255, 255, 0.2) 25%,
                  rgba(255, 255, 255, 0.2) 50%,
                  transparent 50%,
                  transparent 75%,
                  rgba(255, 255, 255, 0.2) 75%
                )`,
                backgroundSize: '20px 20px',
                animation: 'pixelStripes 1s linear infinite'
              }}
            />
          )}
          
          {/* Glow Effect for Neon Variant */}
          {variant === 'neon' && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                boxShadow: `inset 0 0 10px ${theme.colors.neon.green}`,
                borderRadius: theme.borderRadius.xs
              }}
            />
          )}
        </div>

        {/* Progress Text */}
        {showLabel && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: sizeStyles.fontSize,
              fontWeight: 'bold',
              color: theme.colors.black,
              fontFamily: theme.fonts.primary,
              textShadow: '1px 1px 0px rgba(255, 255, 255, 0.8)',
              zIndex: 1
            }}
          >
            {Math.round(percentage)}%
          </div>
        )}
      </div>

      {/* Value Labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: theme.spacing.xs,
          fontSize: sizeStyles.fontSize,
          color: theme.colors.gray[600],
          fontFamily: theme.fonts.primary
        }}
      >
        <span>{value}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default PixelProgress;
