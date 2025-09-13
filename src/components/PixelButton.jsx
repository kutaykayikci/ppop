import React from 'react';

const PixelButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'pixel-button';
  const variantClass = variant === 'primary' ? 'primary' : 'secondary';
  const sizeClass = size === 'sm' ? 'small' : size === 'lg' ? 'large' : '';
  const disabledClass = disabled ? 'disabled' : '';
  
  const classes = [baseClasses, variantClass, sizeClass, disabledClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default PixelButton;
