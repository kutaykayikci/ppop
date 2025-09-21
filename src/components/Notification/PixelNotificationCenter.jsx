import React, { useState, useEffect } from 'react';
import PixelCard from '../PixelCard';
import PixelButton from '../PixelButton';
import PixelToast from './PixelToast';
import { theme } from '../../theme';

const PixelNotificationCenter = ({ 
  notifications = [],
  maxNotifications = 5,
  onMarkAsRead,
  onClearAll,
  onNotificationClick,
  className = '',
  style = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState(notifications);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const unreadCount = localNotifications.filter(n => !n.isRead).length;
  const displayNotifications = localNotifications.slice(0, maxNotifications);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      onMarkAsRead?.(notification.id);
      setLocalNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      );
    }
    onNotificationClick?.(notification);
  };

  const handleClearAll = () => {
    onClearAll?.();
    setLocalNotifications([]);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      poop: '💩',
      achievement: '🏆',
      friend: '👥',
      room: '🚪',
      leaderboard: '📊',
      system: '⚙️',
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✅'
    };
    return icons[type] || icons.info;
  };

  const getNotificationStyle = (notification) => {
    const baseStyle = {
      cursor: 'pointer',
      transition: theme.transitions.normal,
      opacity: notification.isRead ? 0.7 : 1
    };

    return baseStyle;
  };

  return (
    <div className={`pixel-notification-center ${className}`} style={{ position: 'relative', ...style }}>
      {/* Notification Bell Button */}
      <PixelButton
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          fontSize: '12px',
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          position: 'relative'
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            backgroundColor: theme.colors.error,
            color: theme.colors.white,
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            border: `2px solid ${theme.colors.white}`,
            boxShadow: theme.shadows.sm
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </PixelButton>

      {/* Notification Dropdown */}
      {isOpen && (
        <PixelCard
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: theme.spacing.xs,
            minWidth: '320px',
            maxWidth: '400px',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: theme.zIndex.dropdown,
            padding: theme.spacing.md,
            animation: 'notificationSlideIn 0.3s ease-out'
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.md,
            paddingBottom: theme.spacing.sm,
            borderBottom: `2px solid ${theme.colors.gray[200]}`
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: 'bold',
              color: theme.colors.black,
              fontFamily: theme.fonts.primary
            }}>
              Bildirimler
              {unreadCount > 0 && (
                <span style={{
                  marginLeft: theme.spacing.sm,
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.white,
                  padding: `2px ${theme.spacing.xs}`,
                  borderRadius: theme.borderRadius.xs,
                  fontSize: '10px'
                }}>
                  {unreadCount}
                </span>
              )}
            </h3>
            
            {localNotifications.length > 0 && (
              <PixelButton
                variant="secondary"
                size="xs"
                onClick={handleClearAll}
                style={{
                  fontSize: '8px',
                  padding: `${theme.spacing.xs} ${theme.spacing.sm}`
                }}
              >
                Temizle
              </PixelButton>
            )}
          </div>

          {/* Notifications List */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.sm
          }}>
            {displayNotifications.length > 0 ? (
              displayNotifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    ...getNotificationStyle(notification),
                    padding: theme.spacing.md,
                    backgroundColor: notification.isRead ? theme.colors.gray[50] : theme.colors.white,
                    border: `2px solid ${notification.isRead ? theme.colors.gray[200] : theme.colors.primary}`,
                    borderRadius: theme.borderRadius.md,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: theme.spacing.sm,
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = theme.colors.gray[100];
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = theme.shadows.sm;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = notification.isRead ? theme.colors.gray[50] : theme.colors.white;
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {/* Unread Indicator */}
                  {!notification.isRead && (
                    <div style={{
                      position: 'absolute',
                      top: theme.spacing.sm,
                      right: theme.spacing.sm,
                      width: '8px',
                      height: '8px',
                      backgroundColor: theme.colors.primary,
                      borderRadius: '50%'
                    }} />
                  )}

                  {/* Icon */}
                  <div style={{
                    fontSize: '20px',
                    flexShrink: 0
                  }}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: theme.colors.black,
                      marginBottom: theme.spacing.xs
                    }}>
                      {notification.title}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: theme.colors.gray[600],
                      lineHeight: 1.4,
                      marginBottom: theme.spacing.xs
                    }}>
                      {notification.message}
                    </div>
                    <div style={{
                      fontSize: '8px',
                      color: theme.colors.gray[500]
                    }}>
                      {new Date(notification.timestamp).toLocaleString('tr-TR')}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: theme.spacing.xl,
                color: theme.colors.gray[500],
                fontSize: '12px'
              }}>
                🔔 Henüz bildirim yok
              </div>
            )}
          </div>

          {/* Footer */}
          {localNotifications.length > maxNotifications && (
            <div style={{
              marginTop: theme.spacing.md,
              paddingTop: theme.spacing.sm,
              borderTop: `2px solid ${theme.colors.gray[200]}`,
              textAlign: 'center'
            }}>
              <PixelButton
                variant="secondary"
                size="sm"
                style={{
                  fontSize: '10px',
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`
                }}
              >
                Tümünü Gör ({localNotifications.length})
              </PixelButton>
            </div>
          )}
        </PixelCard>
      )}

      {/* Click Outside to Close */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: theme.zIndex.dropdown - 1
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default PixelNotificationCenter;
