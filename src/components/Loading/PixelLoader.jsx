import React from 'react';
import { theme } from '../../theme';

const PixelLoader = ({ 
  size = 'md',
  type = 'spinner',
  color = 'primary',
  text = '',
  className = '',
  style = {}
}) => {
  const getSizeStyles = () => {
    const sizes = {
      xs: { width: '16px', height: '16px', fontSize: '8px' },
      sm: { width: '24px', height: '24px', fontSize: '10px' },
      md: { width: '32px', height: '32px', fontSize: '12px' },
      lg: { width: '48px', height: '48px', fontSize: '14px' },
      xl: { width: '64px', height: '64px', fontSize: '16px' }
    };
    return sizes[size] || sizes.md;
  };

  const getColorValue = () => {
    const colors = {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      success: theme.colors.success,
      warning: theme.colors.warning,
      error: theme.colors.error,
      info: theme.colors.info,
      white: theme.colors.white,
      black: theme.colors.black
    };
    return colors[color] || colors.primary;
  };

  const sizeStyles = getSizeStyles();
  const colorValue = getColorValue();

  const renderSpinner = () => (
    <div
      className="pixel-spinner"
      style={{
        width: sizeStyles.width,
        height: sizeStyles.height,
        border: `3px solid ${theme.colors.gray[200]}`,
        borderTop: `3px solid ${colorValue}`,
        borderRadius: '50%',
        animation: 'pixelSpin 1s linear infinite',
        ...style
      }}
    />
  );

  const renderDots = () => (
    <div
      className="pixel-dots"
      style={{
        display: 'flex',
        gap: '4px',
        alignItems: 'center',
        ...style
      }}
    >
      {[0, 1, 2].map(index => (
        <div
          key={index}
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: colorValue,
            borderRadius: '50%',
            animation: `pixelDots 1.4s ease-in-out ${index * 0.16}s infinite both`
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className="pixel-pulse"
      style={{
        width: sizeStyles.width,
        height: sizeStyles.height,
        backgroundColor: colorValue,
        borderRadius: '50%',
        animation: 'pixelPulse 1.5s ease-in-out infinite',
        ...style
      }}
    />
  );

  const renderBars = () => (
    <div
      className="pixel-bars"
      style={{
        display: 'flex',
        gap: '2px',
        alignItems: 'flex-end',
        height: sizeStyles.height,
        ...style
      }}
    >
      {[0, 1, 2, 3].map(index => (
        <div
          key={index}
          style={{
            width: '4px',
            height: '100%',
            backgroundColor: colorValue,
            animation: `pixelBars 1.2s ease-in-out ${index * 0.1}s infinite both`
          }}
        />
      ))}
    </div>
  );

  const renderEmoji = () => (
    <div
      className="pixel-emoji-loader"
      style={{
        fontSize: sizeStyles.fontSize,
        animation: 'pixelBounce 1s ease-in-out infinite',
        ...style
      }}
    >
      💩
    </div>
  );

  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'bars':
        return renderBars();
      case 'emoji':
        return renderEmoji();
      default:
        return renderSpinner();
    }
  };

  return (
    <div
      className={`pixel-loader ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.spacing.sm
      }}
    >
      {renderLoader()}
      {text && (
        <div
          style={{
            fontSize: sizeStyles.fontSize,
            color: colorValue,
            fontFamily: theme.fonts.primary,
            textAlign: 'center',
            animation: 'pixelTextPulse 2s ease-in-out infinite'
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default PixelLoader;
