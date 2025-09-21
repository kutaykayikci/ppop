import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PixelButton from '../PixelButton';
import PixelCard from '../PixelCard';
import { theme } from '../../theme';

const PixelSidebar = ({ 
  isOpen, 
  onClose, 
  user, 
  onLogin, 
  onLogout,
  className = '',
  style = {}
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({});

  const navigationSections = [
    {
      title: 'Ana Menü',
      icon: '🏠',
      items: [
        { path: '/', label: 'Ana Sayfa', icon: '🏠' },
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/rooms', label: 'Odalarım', icon: '🚪' }
      ]
    },
    {
      title: 'Oyun',
      icon: '🎮',
      items: [
        { path: '/leaderboard', label: 'Liderlik', icon: '🏆' },
        { path: '/achievements', label: 'Başarımlar', icon: '🎯' },
        { path: '/minigames', label: 'Mini Oyunlar', icon: '🎲' }
      ]
    },
    {
      title: 'Profil',
      icon: '👤',
      items: [
        { path: '/profile', label: 'Profil', icon: '👤' },
        { path: '/settings', label: 'Ayarlar', icon: '⚙️' },
        { path: '/help', label: 'Yardım', icon: '❓' }
      ]
    }
  ];

  const handleNavClick = (path) => {
    navigate(path);
    onClose();
  };

  const toggleSection = (sectionTitle) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const isActivePath = (path) => location.pathname === path;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="sidebar-overlay"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: theme.zIndex.modal - 1,
          opacity: isOpen ? 1 : 0,
          transition: theme.transitions.normal
        }}
      />

      {/* Sidebar */}
      <aside
        className={`pixel-sidebar ${className}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '280px',
          backgroundColor: theme.colors.white,
          borderRight: `3px solid ${theme.colors.black}`,
          boxShadow: theme.shadows.lg,
          zIndex: theme.zIndex.modal,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: `transform ${theme.transitions.normal}`,
          display: 'flex',
          flexDirection: 'column',
          ...style
        }}
      >
        {/* Header */}
        <div className="sidebar-header" style={{
          padding: theme.spacing.lg,
          borderBottom: `2px solid ${theme.colors.gray[200]}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: theme.colors.primary,
            fontFamily: theme.fonts.primary,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm
          }}>
            💩 Poop Hero
          </div>
          <PixelButton
            variant="secondary"
            size="sm"
            onClick={onClose}
            style={{
              fontSize: '12px',
              padding: theme.spacing.xs,
              minWidth: '32px',
              minHeight: '32px'
            }}
          >
            ✕
          </PixelButton>
        </div>

        {/* User Info */}
        {user && (
          <div className="sidebar-user" style={{
            padding: theme.spacing.lg,
            borderBottom: `2px solid ${theme.colors.gray[200]}`,
            backgroundColor: theme.colors.gray[50]
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              marginBottom: theme.spacing.sm
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: theme.borderRadius.sm,
                backgroundColor: theme.colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                👤
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: theme.colors.black
                }}>
                  {user.displayName || 'Kullanıcı'}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: theme.colors.gray[600]
                }}>
                  {user.email}
                </div>
              </div>
            </div>
            <PixelButton
              variant="secondary"
              size="sm"
              onClick={onLogout}
              style={{
                fontSize: '10px',
                width: '100%'
              }}
            >
              Çıkış Yap
            </PixelButton>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="sidebar-content" style={{
          flex: 1,
          overflowY: 'auto',
          padding: theme.spacing.md
        }}>
          {navigationSections.map((section, index) => (
            <div key={section.title} style={{ marginBottom: theme.spacing.lg }}>
              <button
                className="section-header"
                onClick={() => toggleSection(section.title)}
                style={{
                  width: '100%',
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: theme.borderRadius.sm,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: theme.colors.black,
                  fontFamily: theme.fonts.primary,
                  marginBottom: theme.spacing.xs,
                  transition: theme.transitions.fast
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = theme.colors.gray[100];
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                  <span>{section.icon}</span>
                  {section.title}
                </span>
                <span style={{
                  transform: expandedSections[section.title] ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: theme.transitions.fast
                }}>
                  ▶
                </span>
              </button>

              {expandedSections[section.title] && (
                <div className="section-items" style={{
                  marginLeft: theme.spacing.lg,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.spacing.xs
                }}>
                  {section.items.map(item => (
                    <PixelButton
                      key={item.path}
                      variant={isActivePath(item.path) ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => handleNavClick(item.path)}
                      style={{
                        fontSize: '10px',
                        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing.sm,
                        justifyContent: 'flex-start',
                        width: '100%',
                        opacity: isActivePath(item.path) ? 1 : 0.8
                      }}
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </PixelButton>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sidebar-footer" style={{
          padding: theme.spacing.md,
          borderTop: `2px solid ${theme.colors.gray[200]}`,
          backgroundColor: theme.colors.gray[50],
          fontSize: '8px',
          color: theme.colors.gray[600],
          textAlign: 'center'
        }}>
          💕 Arkadaşlar için özel olarak tasarlandı 💕
        </div>
      </aside>
    </>
  );
};

export default PixelSidebar;
