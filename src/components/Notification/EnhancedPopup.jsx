import React, { useEffect, useMemo } from 'react';

const positions = {
  'top-right':   { top: 12, right: 12, alignItems: 'flex-end' },
  'top-left':    { top: 12, left: 12, alignItems: 'flex-start' },
  'bottom-right':{ bottom: 12, right: 12, alignItems: 'flex-end' },
  'bottom-left': { bottom: 12, left: 12, alignItems: 'flex-start' },
  'top-center':  { top: 12, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' },
  'center':      { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', alignItems: 'center' }
};

const typeColors = {
  success: '#4caf50',
  warning: '#ff9800',
  error:   '#f44336',
  info:    '#2196f3',
  partner: '#ec407a',
  achievement: '#ff6b6b',
  motivation: '#42a5f5',
  daily_reminder: '#ffd54f',
  room_activity: '#90caf9',
  character_update: '#a5d6a7'
};

export default function EnhancedPopup({
  title,
  message,
  icon = '💡',
  type = 'info',
  duration = 4000,
  position = 'top-right',
  sound = false,
  actions = [],
  onAction,
  onClose
}) {
  useEffect(() => {
    const t = setTimeout(() => onClose && onClose(), duration);
    const onKey = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    window.addEventListener('keydown', onKey);

    if (sound) {
      try { new Audio('/click.mp3')?.play?.(); } catch {}
    }
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
    };
  }, [duration, onClose, sound]);

  const posStyle = useMemo(() => positions[position] || positions['top-right'], [position]);
  const accent = typeColors[type] || typeColors.info;

  return (
    <div style={{
      position: 'fixed',
      zIndex: 10002,
      pointerEvents: 'auto',
      display: 'flex',
      ...posStyle
    }}>
      <div style={{
        minWidth: 260,
        maxWidth: 360,
        background: '#fff',
        color: '#333',
        border: '3px solid #333',
        borderRadius: 8,
        boxShadow: '6px 6px 0px rgba(0,0,0,0.2)',
        padding: 16,
        margin: 8
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ fontSize: 22, lineHeight: '22px' }}>{icon}</div>
          <div style={{ flex: 1 }}>
            {title && (
              <div style={{ fontWeight: 'bold', marginBottom: 6, borderBottom: `3px solid ${accent}`, paddingBottom: 6 }}>
                {title}
              </div>
            )}
            {message && <div style={{ fontSize: 12, lineHeight: 1.4 }}>{message}</div>}
            {actions?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                {actions.map((a) => (
                  <button
                    key={a.id}
                    className="pixel-button"
                    style={{ padding: '8px 12px', fontSize: 10 }}
                    onClick={() => {
                      onAction && onAction(a.id, a.data);
                      if (a.closeOnClick !== false) onClose && onClose();
                    }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            aria-label="Kapat"
            onClick={() => onClose && onClose()}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 16,
              cursor: 'pointer',
              marginLeft: 6
            }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}




