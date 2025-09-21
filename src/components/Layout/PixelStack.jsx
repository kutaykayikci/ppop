import React from 'react';
import { theme } from '../../theme';

const PixelStack = ({ 
  children,
  direction = 'column',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  responsive = true,
  className = '',
  style = {}
}) => {
  const getGapValue = () => {
    const gaps = {
      xs: theme.spacing.xs,
      sm: theme.spacing.sm,
      md: theme.spacing.md,
      lg: theme.spacing.lg,
      xl: theme.spacing.xl,
      xxl: theme.spacing.xxl
    };
    return gaps[gap] || gaps.md;
  };

  const getResponsiveStyles = () => {
    if (!responsive) return getStaticStyles();

    return {
      display: 'flex',
      flexDirection: direction,
      gap: getGapValue(),
      alignItems: align,
      justifyContent: justify,
      flexWrap: wrap ? 'wrap' : 'nowrap'
    };
  };

  const getStaticStyles = () => ({
    display: 'flex',
    flexDirection: direction,
    gap: getGapValue(),
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap ? 'wrap' : 'nowrap'
  });

  const stackStyles = getResponsiveStyles();

  return (
    <div
      className={`pixel-stack ${className} ${responsive ? 'pixel-stack-responsive' : ''}`}
      style={{
        ...stackStyles,
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default PixelStack;
