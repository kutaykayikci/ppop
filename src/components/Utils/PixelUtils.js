import { theme } from '../../theme';

// Utility functions for pixel design system
export const PixelUtils = {
  // Spacing utilities
  spacing: {
    xs: theme.spacing.xs,
    sm: theme.spacing.sm,
    md: theme.spacing.md,
    lg: theme.spacing.lg,
    xl: theme.spacing.xl,
    xxl: theme.spacing.xxl,
    xxxl: theme.spacing.xxxl,
    xxxxl: theme.spacing.xxxxl
  },

  // Color utilities
  colors: theme.colors,

  // Breakpoint utilities
  breakpoints: theme.breakpoints,

  // Generate responsive styles
  responsive: {
    mobile: (styles) => ({
      [`@media (max-width: ${theme.breakpoints.mobile})`]: styles
    }),
    tablet: (styles) => ({
      [`@media (min-width: ${theme.breakpoints.tablet}) and (max-width: ${theme.breakpoints.desktop})`]: styles
    }),
    desktop: (styles) => ({
      [`@media (min-width: ${theme.breakpoints.desktop})`]: styles
    }),
    wide: (styles) => ({
      [`@media (min-width: ${theme.breakpoints.wide})`]: styles
    })
  },

  // Generate pixel-perfect shadows
  shadow: (size = 'md') => theme.shadows[size] || theme.shadows.md,

  // Generate pixel-perfect border radius
  radius: (size = 'sm') => theme.borderRadius[size] || theme.borderRadius.sm,

  // Generate pixel-perfect transitions
  transition: (type = 'normal') => theme.transitions[type] || theme.transitions.normal,

  // Generate pixel-perfect easing
  easing: (type = 'pixel') => theme.easing[type] || theme.easing.pixel,

  // Generate z-index
  zIndex: (level = 'base') => theme.zIndex[level] || theme.zIndex.base,

  // Generate font family
  font: (type = 'primary') => theme.fonts[type] || theme.fonts.primary,

  // Generate pixel-perfect button styles
  button: {
    primary: {
      backgroundColor: theme.colors.primary,
      borderColor: '#e55a5a',
      color: theme.colors.white,
      boxShadow: theme.shadows.md
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      borderColor: '#45b7b8',
      color: theme.colors.white,
      boxShadow: theme.shadows.md
    },
    success: {
      backgroundColor: theme.colors.success,
      borderColor: '#2e7d32',
      color: theme.colors.white,
      boxShadow: theme.shadows.md
    },
    warning: {
      backgroundColor: theme.colors.warning,
      borderColor: '#ef6c00',
      color: theme.colors.white,
      boxShadow: theme.shadows.md
    },
    error: {
      backgroundColor: theme.colors.error,
      borderColor: '#c62828',
      color: theme.colors.white,
      boxShadow: theme.shadows.md
    }
  },

  // Generate pixel-perfect card styles
  card: {
    base: {
      backgroundColor: theme.colors.white,
      border: `3px solid ${theme.colors.black}`,
      borderRadius: theme.borderRadius.lg,
      boxShadow: theme.shadows.lg,
      padding: theme.spacing.lg
    },
    hover: {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows.xl
    }
  },

  // Generate pixel-perfect input styles
  input: {
    base: {
      fontFamily: theme.fonts.primary,
      fontSize: '12px',
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      border: `3px solid ${theme.colors.black}`,
      backgroundColor: theme.colors.white,
      color: theme.colors.black,
      borderRadius: theme.borderRadius.sm,
      boxShadow: theme.shadows.inset,
      transition: theme.transitions.normal
    },
    focus: {
      borderColor: theme.colors.primary,
      boxShadow: `${theme.shadows.inset}, 0 0 0 2px ${theme.colors.primary}40`
    },
    error: {
      borderColor: theme.colors.error,
      boxShadow: `${theme.shadows.inset}, 0 0 0 2px ${theme.colors.error}40`
    }
  },

  // Generate pixel-perfect progress styles
  progress: {
    base: {
      height: '16px',
      backgroundColor: theme.colors.gray[200],
      border: `2px solid ${theme.colors.black}`,
      borderRadius: theme.borderRadius.sm,
      overflow: 'hidden',
      boxShadow: theme.shadows.inset
    },
    fill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      border: `1px solid #e55a5a`,
      borderRadius: theme.borderRadius.xs,
      transition: theme.transitions.normal
    }
  },

  // Generate pixel-perfect modal styles
  modal: {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: theme.zIndex.modal,
      padding: theme.spacing.lg
    },
    content: {
      backgroundColor: theme.colors.white,
      border: `4px solid ${theme.colors.black}`,
      borderRadius: theme.borderRadius.lg,
      boxShadow: theme.shadows.xxl,
      padding: 0,
      maxWidth: '90vw',
      maxHeight: '90vh',
      overflow: 'hidden'
    }
  },

  // Generate pixel-perfect toast styles
  toast: {
    base: {
      position: 'fixed',
      zIndex: theme.zIndex.notification,
      minWidth: '300px',
      maxWidth: '400px',
      backgroundColor: theme.colors.white,
      border: `3px solid ${theme.colors.black}`,
      borderRadius: theme.borderRadius.md,
      boxShadow: theme.shadows.lg,
      padding: theme.spacing.md
    },
    success: {
      backgroundColor: theme.colors.success,
      borderColor: '#2e7d32',
      color: theme.colors.white
    },
    error: {
      backgroundColor: theme.colors.error,
      borderColor: '#c62828',
      color: theme.colors.white
    },
    warning: {
      backgroundColor: theme.colors.warning,
      borderColor: '#ef6c00',
      color: theme.colors.white
    },
    info: {
      backgroundColor: theme.colors.info,
      borderColor: '#1565c0',
      color: theme.colors.white
    }
  },

  // Generate pixel-perfect loader styles
  loader: {
    spinner: {
      width: '32px',
      height: '32px',
      border: `3px solid ${theme.colors.gray[200]}`,
      borderTop: `3px solid ${theme.colors.primary}`,
      borderRadius: '50%',
      animation: 'pixelSpin 1s linear infinite'
    },
    dots: {
      display: 'flex',
      gap: '4px',
      alignItems: 'center'
    },
    dot: {
      width: '8px',
      height: '8px',
      backgroundColor: theme.colors.primary,
      borderRadius: '50%',
      animation: 'pixelDots 1.4s ease-in-out infinite'
    }
  },

  // Generate pixel-perfect grid styles
  grid: {
    base: {
      display: 'grid',
      gap: theme.spacing.md
    },
    cols: {
      1: { gridTemplateColumns: 'repeat(1, 1fr)' },
      2: { gridTemplateColumns: 'repeat(2, 1fr)' },
      3: { gridTemplateColumns: 'repeat(3, 1fr)' },
      4: { gridTemplateColumns: 'repeat(4, 1fr)' },
      5: { gridTemplateColumns: 'repeat(5, 1fr)' },
      6: { gridTemplateColumns: 'repeat(6, 1fr)' }
    }
  },

  // Generate pixel-perfect flex styles
  flex: {
    base: {
      display: 'flex'
    },
    row: {
      flexDirection: 'row'
    },
    col: {
      flexDirection: 'column'
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    between: {
      justifyContent: 'space-between'
    },
    around: {
      justifyContent: 'space-around'
    },
    evenly: {
      justifyContent: 'space-evenly'
    },
    wrap: {
      flexWrap: 'wrap'
    },
    nowrap: {
      flexWrap: 'nowrap'
    }
  },

  // Generate pixel-perfect typography styles
  typography: {
    h1: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: theme.colors.black,
      fontFamily: theme.fonts.primary,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: theme.colors.black,
      fontFamily: theme.fonts.primary,
      lineHeight: 1.2
    },
    h3: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: theme.colors.black,
      fontFamily: theme.fonts.primary,
      lineHeight: 1.3
    },
    h4: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: theme.colors.black,
      fontFamily: theme.fonts.primary,
      lineHeight: 1.3
    },
    body: {
      fontSize: '12px',
      color: theme.colors.black,
      fontFamily: theme.fonts.primary,
      lineHeight: 1.4
    },
    small: {
      fontSize: '10px',
      color: theme.colors.gray[600],
      fontFamily: theme.fonts.primary,
      lineHeight: 1.4
    },
    caption: {
      fontSize: '8px',
      color: theme.colors.gray[500],
      fontFamily: theme.fonts.primary,
      lineHeight: 1.4
    }
  },

  // Generate pixel-perfect animation styles
  animation: {
    fadeIn: {
      animation: 'pixelFadeIn 0.5s ease-out'
    },
    slideInRight: {
      animation: 'pixelSlideInRight 0.5s ease-out'
    },
    slideInLeft: {
      animation: 'pixelSlideInLeft 0.5s ease-out'
    },
    slideInUp: {
      animation: 'pixelSlideInUp 0.5s ease-out'
    },
    slideInDown: {
      animation: 'pixelSlideInDown 0.5s ease-out'
    },
    scaleIn: {
      animation: 'pixelScaleIn 0.3s ease-out'
    },
    bounce: {
      animation: 'pixelBounce 1s infinite'
    },
    pulse: {
      animation: 'pixelPulse 2s ease-in-out infinite'
    },
    shake: {
      animation: 'pixelShake 0.5s ease-in-out'
    },
    wiggle: {
      animation: 'pixelWiggle 0.5s ease-in-out'
    }
  },

  // Generate pixel-perfect hover styles
  hover: {
    lift: {
      transition: theme.transitions.normal,
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows.xl
      }
    },
    glow: {
      transition: theme.transitions.normal,
      '&:hover': {
        boxShadow: `0 0 20px ${theme.colors.primary}80`
      }
    },
    scale: {
      transition: theme.transitions.normal,
      '&:hover': {
        transform: 'scale(1.05)'
      }
    },
    rotate: {
      transition: theme.transitions.normal,
      '&:hover': {
        transform: 'rotate(5deg)'
      }
    }
  },

  // Generate pixel-perfect focus styles
  focus: {
    ring: {
      '&:focus': {
        outline: 'none',
        boxShadow: `0 0 0 2px ${theme.colors.primary}40`
      }
    },
    visible: {
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 2px ${theme.colors.primary}40`
      }
    }
  },

  // Generate pixel-perfect responsive styles
  responsive: {
    mobile: {
      fontSize: '10px',
      padding: theme.spacing.sm
    },
    tablet: {
      fontSize: '12px',
      padding: theme.spacing.md
    },
    desktop: {
      fontSize: '14px',
      padding: theme.spacing.lg
    }
  },

  // Generate pixel-perfect theme styles
  theme: {
    light: {
      backgroundColor: theme.colors.white,
      color: theme.colors.black,
      borderColor: theme.colors.black
    },
    dark: {
      backgroundColor: theme.colors.retro.bg,
      color: theme.colors.retro.text,
      borderColor: theme.colors.retro.border
    },
    neon: {
      backgroundColor: theme.colors.black,
      color: theme.colors.neon.green,
      borderColor: theme.colors.neon.green,
      boxShadow: `0 0 20px ${theme.colors.neon.green}80`
    }
  }
};

// Helper functions
export const createPixelStyle = (baseStyle, variants = {}) => {
  return (variant = 'default') => ({
    ...baseStyle,
    ...variants[variant]
  });
};

export const combinePixelStyles = (...styles) => {
  return styles.reduce((acc, style) => ({ ...acc, ...style }), {});
};

export const createResponsiveStyle = (mobile, tablet, desktop) => ({
  ...mobile,
  [`@media (min-width: ${theme.breakpoints.tablet})`]: tablet,
  [`@media (min-width: ${theme.breakpoints.desktop})`]: desktop
});

export const createPixelAnimation = (name, keyframes, duration = '0.5s', easing = 'ease-out') => ({
  animation: `${name} ${duration} ${easing}`,
  '@keyframes': keyframes
});

export const createPixelShadow = (x = 4, y = 4, blur = 0, color = 'rgba(0, 0, 0, 0.2)') => ({
  boxShadow: `${x}px ${y}px ${blur}px ${color}`
});

export const createPixelBorder = (width = 3, style = 'solid', color = theme.colors.black) => ({
  border: `${width}px ${style} ${color}`
});

export const createPixelRadius = (size = 'sm') => ({
  borderRadius: theme.borderRadius[size] || theme.borderRadius.sm
});

export const createPixelTransition = (property = 'all', duration = 'normal', easing = 'pixel') => ({
  transition: `${property} ${theme.transitions[duration] || theme.transitions.normal} ${theme.easing[easing] || theme.easing.pixel}`
});

export default PixelUtils;
