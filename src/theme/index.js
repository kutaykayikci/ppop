import { colors } from './colors.js';

export const theme = {
  colors,
  
  // Pixel tarzı fontlar
  fonts: {
    primary: '"Press Start 2P", monospace',
    secondary: '"Comic Sans MS", cursive',
    retro: '"Courier New", monospace',
    game: '"Orbitron", monospace'
  },
  
  // 8px Grid Sistemi - Pixel Perfect
  spacing: {
    xs: '4px',    // 0.5x
    sm: '8px',    // 1x
    md: '16px',   // 2x
    lg: '24px',   // 3x
    xl: '32px',   // 4x
    xxl: '48px',  // 6x
    xxxl: '64px', // 8x
    xxxxl: '80px' // 10x
  },
  
  // Pixel tarzı border radius (minimal)
  borderRadius: {
    none: '0',
    xs: '1px',
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '12px'
  },
  
  // Pixel-perfect gölgeler
  shadows: {
    none: 'none',
    xs: '1px 1px 0px rgba(0, 0, 0, 0.1)',
    sm: '2px 2px 0px rgba(0, 0, 0, 0.2)',
    md: '4px 4px 0px rgba(0, 0, 0, 0.2)',
    lg: '6px 6px 0px rgba(0, 0, 0, 0.2)',
    xl: '8px 8px 0px rgba(0, 0, 0, 0.2)',
    xxl: '12px 12px 0px rgba(0, 0, 0, 0.2)',
    inset: 'inset 2px 2px 0px rgba(0, 0, 0, 0.1)',
    glow: '0 0 10px rgba(255, 107, 107, 0.5)',
    neon: '0 0 20px rgba(0, 255, 65, 0.8)'
  },
  
  // Pixel animasyonları
  transitions: {
    instant: '0s',
    fast: '0.1s ease-out',
    normal: '0.2s ease-out',
    slow: '0.3s ease-out',
    slower: '0.5s ease-out'
  },
  
  // Pixel animasyon easing
  easing: {
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    pixel: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    retro: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    game: 'cubic-bezier(0.25, 0.8, 0.25, 1)'
  },
  
  // Responsive breakpoints
  breakpoints: {
    mobile: '480px',   // 30x16 grid
    tablet: '768px',   // 48x32 grid
    desktop: '1024px', // 64x48 grid
    wide: '1280px'     // 80x60 grid
  },
  
  // Z-index layers
  zIndex: {
    base: 1,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modal: 40,
    popover: 50,
    tooltip: 60,
    notification: 70,
    max: 100
  }
};

export default theme;
