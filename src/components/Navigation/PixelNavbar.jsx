import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PixelButton from '../PixelButton';
import PixelCard from '../PixelCard';
import { theme } from '../../theme';

const PixelNavbar = ({ 
  user, 
  onLogin, 
  onLogout, 
  className = '',
  style = {},
  showUserMenu = true 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Ana Sayfa', icon: '🏠' },
    { path: '/leaderboard', label: 'Liderlik', icon: '🏆' },
    { path: '/rooms', label: 'Odalar', icon: '🚪' },
    { path: '/profile', label: 'Profil', icon: '👤' }
  ];

  const handleNavClick = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <nav 
      className={`pixel-navbar ${className}`}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: theme.zIndex.sticky,
        backgroundColor: theme.colors.white,
        borderBottom: `3px solid ${theme.colors.black}`,
        boxShadow: theme.shadows.md,
        ...style
      }}
    >
      <div className="navbar-container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <div 
          className="navbar-logo"
          onClick={() => handleNavClick('/')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            fontSize: '16px',
            fontWeight: 'bold',
            color: theme.colors.primary,
            fontFamily: theme.fonts.primary
          }}
        >
          💩 Poop Hero
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-desktop" style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.md
        }}>
          {navItems.map(item => (
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
                gap: theme.spacing.xs,
                opacity: isActivePath(item.path) ? 1 : 0.8
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </PixelButton>
          ))}
        </div>

        {/* User Menu */}
        {showUserMenu && (
          <div className="navbar-user" style={{ position: 'relative' }}>
            {user ? (
              <div>
                <PixelButton
                  variant="secondary"
                  size="sm"
                  onClick={toggleUserMenu}
                  style={{
                    fontSize: '10px',
                    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.xs
                  }}
                >
                  <span>👤</span>
                  {user.displayName || 'Kullanıcı'}
                </PixelButton>
                
                {isUserMenuOpen && (
                  <PixelCard
                    className="user-dropdown"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: theme.spacing.xs,
                      minWidth: '200px',
                      zIndex: theme.zIndex.dropdown,
                      padding: theme.spacing.md
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                      <div style={{ fontSize: '12px', color: theme.colors.gray[600] }}>
                        {user.email}
                      </div>
                      <PixelButton
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          handleNavClick('/profile');
                          setIsUserMenuOpen(false);
                        }}
                        style={{ fontSize: '10px' }}
                      >
                        Profil Ayarları
                      </PixelButton>
                      <PixelButton
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          onLogout();
                          setIsUserMenuOpen(false);
                        }}
                        style={{ fontSize: '10px' }}
                      >
                        Çıkış Yap
                      </PixelButton>
                    </div>
                  </PixelCard>
                )}
              </div>
            ) : (
              <PixelButton
                variant="primary"
                size="sm"
                onClick={onLogin}
                style={{
                  fontSize: '10px',
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`
                }}
              >
                Giriş Yap
              </PixelButton>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        <div className="navbar-mobile-toggle" style={{
          display: 'none',
          '@media (max-width: 768px)': {
            display: 'block'
          }
        }}>
          <PixelButton
            variant="secondary"
            size="sm"
            onClick={toggleMenu}
            style={{
              fontSize: '12px',
              padding: theme.spacing.sm,
              minWidth: '44px',
              minHeight: '44px'
            }}
          >
            {isMenuOpen ? '✕' : '☰'}
          </PixelButton>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <PixelCard
          className="navbar-mobile-menu"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: theme.zIndex.dropdown,
            margin: 0,
            borderRadius: 0,
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none'
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.sm,
            padding: theme.spacing.md
          }}>
            {navItems.map(item => (
              <PixelButton
                key={item.path}
                variant={isActivePath(item.path) ? 'primary' : 'secondary'}
                size="md"
                onClick={() => handleNavClick(item.path)}
                style={{
                  fontSize: '12px',
                  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm,
                  justifyContent: 'flex-start',
                  width: '100%'
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </PixelButton>
            ))}
            
            {!user && (
              <PixelButton
                variant="primary"
                size="md"
                onClick={() => {
                  onLogin();
                  setIsMenuOpen(false);
                }}
                style={{
                  fontSize: '12px',
                  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                  width: '100%',
                  marginTop: theme.spacing.sm
                }}
              >
                Giriş Yap
              </PixelButton>
            )}
          </div>
        </PixelCard>
      )}
    </nav>
  );
};

export default PixelNavbar;
