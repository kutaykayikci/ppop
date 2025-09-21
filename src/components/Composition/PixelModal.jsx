import React, { useEffect } from 'react';
import PixelCard from '../PixelCard';
import PixelButton from '../PixelButton';
import PixelStack from '../Layout/PixelStack';
import { theme } from '../../theme';

const PixelModal = ({ 
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  style = {}
}) => {
  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  const getSizeStyles = () => {
    const sizes = {
      xs: { width: '300px', maxWidth: '90vw' },
      sm: { width: '400px', maxWidth: '90vw' },
      md: { width: '500px', maxWidth: '90vw' },
      lg: { width: '700px', maxWidth: '90vw' },
      xl: { width: '900px', maxWidth: '90vw' },
      full: { width: '95vw', height: '95vh' }
    };
    return sizes[size] || sizes.md;
  };

  const sizeStyles = getSizeStyles();

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="pixel-modal-overlay"
      onClick={handleOverlayClick}
      style={{
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
        padding: theme.spacing.lg,
        animation: 'modalFadeIn 0.3s ease-out'
      }}
    >
      <PixelCard
        className={`pixel-modal ${className}`}
        style={{
          ...sizeStyles,
          backgroundColor: theme.colors.white,
          border: `4px solid ${theme.colors.black}`,
          borderRadius: theme.borderRadius.lg,
          boxShadow: theme.shadows.xxl,
          padding: 0,
          animation: 'modalSlideIn 0.3s ease-out',
          overflow: 'hidden',
          ...style
        }}
      >
        {/* Modal Header */}
        {(title || showCloseButton) && (
          <div style={{
            padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
            borderBottom: `2px solid ${theme.colors.gray[200]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.colors.gray[50]
          }}>
            {title && (
              <h2 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 'bold',
                color: theme.colors.black,
                fontFamily: theme.fonts.primary
              }}>
                {title}
              </h2>
            )}
            
            {showCloseButton && (
              <PixelButton
                variant="secondary"
                size="sm"
                onClick={onClose}
                style={{
                  fontSize: '12px',
                  padding: theme.spacing.sm,
                  minWidth: '32px',
                  minHeight: '32px'
                }}
              >
                ✕
              </PixelButton>
            )}
          </div>
        )}

        {/* Modal Content */}
        <div style={{
          padding: theme.spacing.xl,
          overflowY: 'auto',
          maxHeight: size === 'full' ? 'calc(95vh - 120px)' : '70vh'
        }}>
          {children}
        </div>
      </PixelCard>
    </div>
  );
};

// Modal Header Component
const PixelModalHeader = ({ 
  children,
  className = '',
  style = {}
}) => {
  return (
    <div
      className={`pixel-modal-header ${className}`}
      style={{
        padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
        borderBottom: `2px solid ${theme.colors.gray[200]}`,
        backgroundColor: theme.colors.gray[50],
        ...style
      }}
    >
      {children}
    </div>
  );
};

// Modal Body Component
const PixelModalBody = ({ 
  children,
  className = '',
  style = {}
}) => {
  return (
    <div
      className={`pixel-modal-body ${className}`}
      style={{
        padding: theme.spacing.xl,
        ...style
      }}
    >
      {children}
    </div>
  );
};

// Modal Footer Component
const PixelModalFooter = ({ 
  children,
  className = '',
  style = {}
}) => {
  return (
    <div
      className={`pixel-modal-footer ${className}`}
      style={{
        padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
        borderTop: `2px solid ${theme.colors.gray[200]}`,
        backgroundColor: theme.colors.gray[50],
        display: 'flex',
        justifyContent: 'flex-end',
        gap: theme.spacing.md,
        ...style
      }}
    >
      {children}
    </div>
  );
};

// Export all components
PixelModal.Header = PixelModalHeader;
PixelModal.Body = PixelModalBody;
PixelModal.Footer = PixelModalFooter;

export default PixelModal;
