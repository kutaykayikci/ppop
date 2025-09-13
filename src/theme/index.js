import { colors } from './colors.js';

export const theme = {
  colors,
  
  // Pixel tarzı fontlar
  fonts: {
    primary: '"Press Start 2P", monospace',
    secondary: '"Comic Sans MS", cursive'
  },
  
  // Pixel tarzı boyutlar
  sizes: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px'
  },
  
  // Pixel tarzı border radius (minimal)
  borderRadius: {
    none: '0',
    sm: '2px',
    md: '4px',
    lg: '8px'
  },
  
  // Gölgeler
  shadows: {
    sm: '2px 2px 0px rgba(0, 0, 0, 0.2)',
    md: '4px 4px 0px rgba(0, 0, 0, 0.2)',
    lg: '6px 6px 0px rgba(0, 0, 0, 0.2)',
    xl: '8px 8px 0px rgba(0, 0, 0, 0.2)'
  },
  
  // Animasyonlar
  transitions: {
    fast: '0.1s ease-in-out',
    normal: '0.2s ease-in-out',
    slow: '0.3s ease-in-out'
  }
};

export default theme;
