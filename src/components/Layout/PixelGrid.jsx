import React from 'react';
import { theme } from '../../theme';

const PixelGrid = ({ 
  children,
  columns = 1,
  gap = 'md',
  responsive = true,
  align = 'stretch',
  justify = 'start',
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

  const getGridTemplateColumns = () => {
    if (typeof columns === 'number') {
      return `repeat(${columns}, 1fr)`;
    }
    
    if (typeof columns === 'object') {
      // Responsive columns: { mobile: 1, tablet: 2, desktop: 3 }
      return columns;
    }
    
    return `repeat(${columns}, 1fr)`;
  };

  const getResponsiveStyles = () => {
    if (!responsive) return {};

    const responsiveColumns = typeof columns === 'object' ? columns : {
      mobile: 1,
      tablet: Math.min(2, columns),
      desktop: columns
    };

    return {
      display: 'grid',
      gap: getGapValue(),
      alignItems: align,
      justifyContent: justify,
      gridTemplateColumns: `repeat(${responsiveColumns.mobile || 1}, 1fr)`,
      
      [`@media (min-width: ${theme.breakpoints.tablet})`]: {
        gridTemplateColumns: `repeat(${responsiveColumns.tablet || 2}, 1fr)`
      },
      
      [`@media (min-width: ${theme.breakpoints.desktop})`]: {
        gridTemplateColumns: `repeat(${responsiveColumns.desktop || columns}, 1fr)`
      }
    };
  };

  const getStaticStyles = () => ({
    display: 'grid',
    gap: getGapValue(),
    alignItems: align,
    justifyContent: justify,
    gridTemplateColumns: typeof columns === 'number' ? `repeat(${columns}, 1fr)` : 'repeat(1, 1fr)'
  });

  const gridStyles = responsive ? getResponsiveStyles() : getStaticStyles();

  return (
    <div
      className={`pixel-grid ${className}`}
      style={{
        ...gridStyles,
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default PixelGrid;
