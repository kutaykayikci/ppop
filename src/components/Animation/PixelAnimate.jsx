import React, { useState, useEffect, useRef } from 'react';

const PixelAnimate = ({ 
  children,
  animation = 'fadeIn',
  duration = 500,
  delay = 0,
  trigger = 'onMount',
  threshold = 0.1,
  once = true,
  className = '',
  style = {}
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  const animationClasses = {
    // Entrance animations
    fadeIn: 'pixel-animate-fade-in',
    slideInRight: 'pixel-animate-slide-in-right',
    slideInLeft: 'pixel-animate-slide-in-left',
    slideInUp: 'pixel-animate-slide-in-up',
    slideInDown: 'pixel-animate-slide-in-down',
    scaleIn: 'pixel-animate-scale-in',
    rotateIn: 'pixel-animate-rotate-in',
    
    // Exit animations
    fadeOut: 'pixel-animate-fade-out',
    slideOutRight: 'pixel-animate-slide-out-right',
    slideOutLeft: 'pixel-animate-slide-out-left',
    scaleOut: 'pixel-animate-scale-out',
    
    // Continuous animations
    bounce: 'pixel-animate-bounce',
    pulse: 'pixel-animate-pulse',
    spin: 'pixel-animate-spin',
    wiggle: 'pixel-animate-wiggle',
    shake: 'pixel-animate-shake',
    
    // Poop animations
    poopExplosion: 'pixel-animate-poop-explosion',
    countJump: 'pixel-animate-count-jump',
    
    // Achievement animations
    achievementCelebration: 'pixel-animate-achievement-celebration',
    achievementGlow: 'pixel-animate-achievement-glow',
    achievementBounce: 'pixel-animate-achievement-bounce',
    
    // Particle animations
    particleFloat: 'pixel-animate-particle-float',
    particleSparkle: 'pixel-animate-particle-sparkle',
    
    // Floating animations
    floatSlow: 'pixel-animate-float-slow',
    floatFast: 'pixel-animate-float-fast',
    floatSpiral: 'pixel-animate-float-spiral',
    
    // Button animations
    buttonPress: 'pixel-animate-button-press',
    buttonGlow: 'pixel-animate-button-glow',
    
    // Card animations
    cardHover: 'pixel-animate-card-hover',
    cardTilt: 'pixel-animate-card-tilt',
    
    // Text animations
    textPulse: 'pixel-animate-text-pulse',
    textGlow: 'pixel-animate-text-glow',
    textShake: 'pixel-animate-text-shake'
  };

  const getAnimationClass = () => {
    return animationClasses[animation] || animationClasses.fadeIn;
  };

  useEffect(() => {
    if (trigger === 'onMount') {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [trigger, delay]);

  useEffect(() => {
    if (trigger === 'onScroll' && elementRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!once || !hasAnimated) {
                setIsVisible(true);
                setHasAnimated(true);
              }
            } else if (!once) {
              setIsVisible(false);
            }
          });
        },
        { threshold }
      );

      observer.observe(elementRef.current);
      return () => observer.disconnect();
    }
  }, [trigger, threshold, once, hasAnimated]);

  const handleClick = () => {
    if (trigger === 'onClick') {
      setIsVisible(true);
    }
  };

  const handleHover = () => {
    if (trigger === 'onHover') {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'onHover' && !once) {
      setIsVisible(false);
    }
  };

  const getElementProps = () => {
    const props = {
      ref: elementRef,
      className: `${getAnimationClass()} ${className}`.trim(),
      style: {
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`,
        ...style
      }
    };

    if (trigger === 'onClick') {
      props.onClick = handleClick;
    }

    if (trigger === 'onHover') {
      props.onMouseEnter = handleHover;
      props.onMouseLeave = handleMouseLeave;
    }

    return props;
  };

  return (
    <div {...getElementProps()}>
      {children}
    </div>
  );
};

// Animation Presets Component
const PixelAnimatePresets = {
  // Quick entrance animations
  FadeIn: (props) => <PixelAnimate animation="fadeIn" {...props} />,
  SlideInRight: (props) => <PixelAnimate animation="slideInRight" {...props} />,
  SlideInLeft: (props) => <PixelAnimate animation="slideInLeft" {...props} />,
  SlideInUp: (props) => <PixelAnimate animation="slideInUp" {...props} />,
  ScaleIn: (props) => <PixelAnimate animation="scaleIn" {...props} />,
  
  // Poop specific animations
  PoopExplosion: (props) => <PixelAnimate animation="poopExplosion" duration={800} {...props} />,
  CountJump: (props) => <PixelAnimate animation="countJump" duration={1000} {...props} />,
  
  // Achievement animations
  AchievementCelebration: (props) => <PixelAnimate animation="achievementCelebration" duration={600} {...props} />,
  AchievementGlow: (props) => <PixelAnimate animation="achievementGlow" duration={2000} {...props} />,
  
  // Continuous animations
  Bounce: (props) => <PixelAnimate animation="bounce" duration={1000} {...props} />,
  Pulse: (props) => <PixelAnimate animation="pulse" duration={2000} {...props} />,
  Spin: (props) => <PixelAnimate animation="spin" duration={1000} {...props} />,
  Wiggle: (props) => <PixelAnimate animation="wiggle" duration={500} {...props} />,
  
  // Floating animations
  FloatSlow: (props) => <PixelAnimate animation="floatSlow" duration={4000} {...props} />,
  FloatFast: (props) => <PixelAnimate animation="floatFast" duration={3000} {...props} />,
  FloatSpiral: (props) => <PixelAnimate animation="floatSpiral" duration={5000} {...props} />
};

// Animation Sequence Component
const PixelAnimateSequence = ({ 
  children, 
  stagger = 100, 
  animation = 'fadeIn',
  className = '',
  style = {}
}) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={className} style={style}>
      {childrenArray.map((child, index) => (
        <PixelAnimate
          key={index}
          animation={animation}
          delay={index * stagger}
          trigger="onMount"
        >
          {child}
        </PixelAnimate>
      ))}
    </div>
  );
};

// Export components
PixelAnimate.Presets = PixelAnimatePresets;
PixelAnimate.Sequence = PixelAnimateSequence;

export default PixelAnimate;
