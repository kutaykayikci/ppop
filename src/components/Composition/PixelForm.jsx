import React from 'react';
import PixelCard from '../PixelCard';
import PixelButton from '../PixelButton';
import PixelStack from '../Layout/PixelStack';
import { theme } from '../../theme';

const PixelForm = ({ 
  children,
  onSubmit,
  title,
  submitText = 'Gönder',
  cancelText,
  onCancel,
  loading = false,
  disabled = false,
  className = '',
  style = {}
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!disabled && !loading) {
      onSubmit?.(e);
    }
  };

  return (
    <PixelCard
      className={`pixel-form ${className}`}
      style={{
        padding: theme.spacing.xl,
        ...style
      }}
    >
      <form onSubmit={handleSubmit}>
        <PixelStack gap="lg" align="stretch">
          {/* Form Header */}
          {title && (
            <div style={{
              textAlign: 'center',
              marginBottom: theme.spacing.md
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 'bold',
                color: theme.colors.black,
                fontFamily: theme.fonts.primary
              }}>
                {title}
              </h2>
            </div>
          )}

          {/* Form Fields */}
          <PixelStack gap="md" align="stretch">
            {children}
          </PixelStack>

          {/* Form Actions */}
          <PixelStack 
            direction="row" 
            gap="md" 
            justify="center"
            responsive={true}
          >
            {cancelText && onCancel && (
              <PixelButton
                type="button"
                variant="secondary"
                size="md"
                onClick={onCancel}
                disabled={disabled || loading}
                style={{
                  fontSize: '12px',
                  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                  minWidth: '120px'
                }}
              >
                {cancelText}
              </PixelButton>
            )}
            
            <PixelButton
              type="submit"
              variant="primary"
              size="md"
              disabled={disabled || loading}
              style={{
                fontSize: '12px',
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                minWidth: '120px'
              }}
            >
              {loading ? '⏳' : submitText}
            </PixelButton>
          </PixelStack>
        </PixelStack>
      </form>
    </PixelCard>
  );
};

// Form Field Component
const PixelFormField = ({ 
  label,
  error,
  required = false,
  children,
  className = '',
  style = {}
}) => {
  return (
    <div
      className={`pixel-form-field ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.xs,
        ...style
      }}
    >
      {label && (
        <label style={{
          fontSize: '12px',
          fontWeight: 'bold',
          color: theme.colors.black,
          fontFamily: theme.fonts.primary
        }}>
          {label}
          {required && <span style={{ color: theme.colors.error, marginLeft: theme.spacing.xs }}>*</span>}
        </label>
      )}
      
      {children}
      
      {error && (
        <div style={{
          fontSize: '10px',
          color: theme.colors.error,
          fontFamily: theme.fonts.primary
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

// Input Component
const PixelInput = ({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false,
  className = '',
  style = {}
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`pixel-input ${className}`}
      style={{
        fontFamily: theme.fonts.primary,
        fontSize: '12px',
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        border: `3px solid ${error ? theme.colors.error : theme.colors.black}`,
        backgroundColor: theme.colors.white,
        color: theme.colors.black,
        borderRadius: theme.borderRadius.sm,
        boxShadow: theme.shadows.inset,
        transition: theme.transitions.normal,
        width: '100%',
        boxSizing: 'border-box',
        ...style
      }}
      onFocus={(e) => {
        e.target.style.borderColor = theme.colors.primary;
        e.target.style.boxShadow = `${theme.shadows.inset}, 0 0 0 2px ${theme.colors.primary}40`;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = error ? theme.colors.error : theme.colors.black;
        e.target.style.boxShadow = theme.shadows.inset;
      }}
    />
  );
};

// Textarea Component
const PixelTextarea = ({ 
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false,
  rows = 4,
  className = '',
  style = {}
}) => {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      rows={rows}
      className={`pixel-textarea ${className}`}
      style={{
        fontFamily: theme.fonts.primary,
        fontSize: '12px',
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        border: `3px solid ${error ? theme.colors.error : theme.colors.black}`,
        backgroundColor: theme.colors.white,
        color: theme.colors.black,
        borderRadius: theme.borderRadius.sm,
        boxShadow: theme.shadows.inset,
        transition: theme.transitions.normal,
        width: '100%',
        boxSizing: 'border-box',
        resize: 'vertical',
        minHeight: `${rows * 20}px`,
        ...style
      }}
      onFocus={(e) => {
        e.target.style.borderColor = theme.colors.primary;
        e.target.style.boxShadow = `${theme.shadows.inset}, 0 0 0 2px ${theme.colors.primary}40`;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = error ? theme.colors.error : theme.colors.black;
        e.target.style.boxShadow = theme.shadows.inset;
      }}
    />
  );
};

// Select Component
const PixelSelect = ({ 
  children,
  value,
  onChange,
  disabled = false,
  error = false,
  className = '',
  style = {}
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`pixel-select ${className}`}
      style={{
        fontFamily: theme.fonts.primary,
        fontSize: '12px',
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        border: `3px solid ${error ? theme.colors.error : theme.colors.black}`,
        backgroundColor: theme.colors.white,
        color: theme.colors.black,
        borderRadius: theme.borderRadius.sm,
        boxShadow: theme.shadows.inset,
        transition: theme.transitions.normal,
        width: '100%',
        boxSizing: 'border-box',
        ...style
      }}
      onFocus={(e) => {
        e.target.style.borderColor = theme.colors.primary;
        e.target.style.boxShadow = `${theme.shadows.inset}, 0 0 0 2px ${theme.colors.primary}40`;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = error ? theme.colors.error : theme.colors.black;
        e.target.style.boxShadow = theme.shadows.inset;
      }}
    >
      {children}
    </select>
  );
};

// Export all components
PixelForm.Field = PixelFormField;
PixelForm.Input = PixelInput;
PixelForm.Textarea = PixelTextarea;
PixelForm.Select = PixelSelect;

export default PixelForm;
