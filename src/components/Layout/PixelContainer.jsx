import React from 'react';
import { theme } from '../../theme';

const PixelContainer = ({ 
  children,
  maxWidth = '1200px',
  padding = true,
  center = true,
  fluid = false,
  className = '',
  style = {}
}) => {
  const getContainerStyles = () => {
    const baseStyles = {
      width: '100%',
      margin: center ? '0 auto' : '0',
      padding: padding ? `0 ${theme.spacing.lg}` : 0
    };

    if (fluid) {
      return baseStyles;
    }

    return {
      ...baseStyles,
      maxWidth: maxWidth
    };
  };

  return (
    <div
      className={`pixel-container ${className}`}
      style={{
        ...getContainerStyles(),
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default PixelContainer;
