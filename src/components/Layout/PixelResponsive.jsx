import React, { useState, useEffect } from 'react';
import { theme } from '../../theme';

const PixelResponsive = ({ 
  children,
  breakpoint = 'tablet',
  hideOn = [],
  showOn = [],
  className = '',
  style = {}
}) => {
  const [screenSize, setScreenSize] = useState('desktop');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width <= parseInt(theme.breakpoints.mobile)) {
        setScreenSize('mobile');
      } else if (width <= parseInt(theme.breakpoints.tablet)) {
        setScreenSize('tablet');
      } else if (width <= parseInt(theme.breakpoints.desktop)) {
        setScreenSize('desktop');
      } else {
        setScreenSize('wide');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let shouldShow = true;

    // Hide on specific breakpoints
    if (hideOn.includes(screenSize)) {
      shouldShow = false;
    }

    // Show only on specific breakpoints (overrides hideOn)
    if (showOn.length > 0) {
      shouldShow = showOn.includes(screenSize);
    }

    setIsVisible(shouldShow);
  }, [screenSize, hideOn, showOn]);

  if (!isVisible) return null;

  return (
    <div
      className={`pixel-responsive ${className}`}
      style={{
        width: '100%',
        ...style
      }}
    >
      {children}
    </div>
  );
};

// Hook for responsive behavior
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState('desktop');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width <= parseInt(theme.breakpoints.mobile)) {
        setScreenSize('mobile');
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (width <= parseInt(theme.breakpoints.tablet)) {
        setScreenSize('tablet');
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
      } else if (width <= parseInt(theme.breakpoints.desktop)) {
        setScreenSize('desktop');
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      } else {
        setScreenSize('wide');
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    isWide: screenSize === 'wide'
  };
};

export default PixelResponsive;
