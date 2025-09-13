import React from 'react';

const PixelCard = ({ 
  children, 
  className = '',
  onClick,
  style = {},
  ...props 
}) => {
  const classes = ['pixel-card', className].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onClick={onClick}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

export default PixelCard;
