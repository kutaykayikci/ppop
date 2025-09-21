import React from 'react';
import { theme } from '../../theme';

const PixelSkeleton = ({ 
  variant = 'text',
  width,
  height,
  lines = 1,
  animated = true,
  className = '',
  style = {}
}) => {
  const getVariantStyles = () => {
    const variants = {
      text: {
        height: height || '16px',
        borderRadius: theme.borderRadius.xs
      },
      rect: {
        height: height || '100px',
        borderRadius: theme.borderRadius.sm
      },
      circle: {
        height: height || width || '40px',
        width: width || height || '40px',
        borderRadius: '50%'
      },
      button: {
        height: height || '32px',
        borderRadius: theme.borderRadius.sm,
        width: width || '100px'
      },
      card: {
        height: height || '200px',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md
      }
    };
    return variants[variant] || variants.text;
  };

  const variantStyles = getVariantStyles();

  const renderSkeletonElement = (key) => (
    <div
      key={key}
      className={`pixel-skeleton ${animated ? 'animated' : ''}`}
      style={{
        backgroundColor: theme.colors.gray[200],
        border: `2px solid ${theme.colors.gray[300]}`,
        boxShadow: theme.shadows.inset,
        width: width || variantStyles.width || '100%',
        height: variantStyles.height,
        borderRadius: variantStyles.borderRadius,
        ...style
      }}
    />
  );

  const renderTextLines = () => {
    const lineWidths = ['100%', '80%', '90%', '70%'];
    return Array.from({ length: lines }, (_, index) => (
      <div
        key={index}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.xs,
          width: '100%'
        }}
      >
        {renderSkeletonElement(index)}
      </div>
    ));
  };

  const renderCard = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.md,
        padding: variantStyles.padding
      }}
    >
      {/* Card Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
        {renderSkeletonElement('avatar')}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
          {renderSkeletonElement('title')}
          {renderSkeletonElement('subtitle')}
        </div>
      </div>
      
      {/* Card Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
        {renderSkeletonElement('content1')}
        {renderSkeletonElement('content2')}
        {renderSkeletonElement('content3')}
      </div>
      
      {/* Card Actions */}
      <div style={{ display: 'flex', gap: theme.spacing.sm }}>
        {renderSkeletonElement('button1')}
        {renderSkeletonElement('button2')}
      </div>
    </div>
  );

  const renderList = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
      {Array.from({ length: lines }, (_, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
          {renderSkeletonElement(`avatar-${index}`)}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
            {renderSkeletonElement(`text-${index}-1`)}
            {renderSkeletonElement(`text-${index}-2`)}
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (variant) {
      case 'text':
        return renderTextLines();
      case 'card':
        return renderCard();
      case 'list':
        return renderList();
      default:
        return renderSkeletonElement('single');
    }
  };

  return (
    <div
      className={`pixel-skeleton-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.sm,
        width: '100%'
      }}
    >
      {renderContent()}
    </div>
  );
};

export default PixelSkeleton;
