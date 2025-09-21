import React from 'react';
import PixelContainer from '../Layout/PixelContainer';
import PixelStack from '../Layout/PixelStack';
import PixelNavbar from '../Navigation/PixelNavbar';
import PixelBreadcrumb from '../Navigation/PixelBreadcrumb';
import { theme } from '../../theme';

const PixelPage = ({ 
  children,
  title,
  subtitle,
  showNavbar = true,
  showBreadcrumb = false,
  breadcrumbItems = [],
  navbarProps = {},
  headerActions = null,
  className = '',
  style = {}
}) => {
  return (
    <div
      className={`pixel-page ${className}`}
      style={{
        minHeight: '100vh',
        backgroundColor: theme.colors.white,
        ...style
      }}
    >
      {/* Navigation */}
      {showNavbar && (
        <PixelNavbar {...navbarProps} />
      )}

      {/* Breadcrumb */}
      {showBreadcrumb && (
        <PixelBreadcrumb items={breadcrumbItems} />
      )}

      {/* Page Header */}
      {(title || subtitle || headerActions) && (
        <div style={{
          backgroundColor: theme.colors.gray[50],
          borderBottom: `2px solid ${theme.colors.gray[200]}`,
          padding: `${theme.spacing.xl} 0`
        }}>
          <PixelContainer>
            <PixelStack direction="row" justify="space-between" align="center" responsive>
              <div>
                {title && (
                  <h1 style={{
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: theme.colors.black,
                    fontFamily: theme.fonts.primary,
                    marginBottom: subtitle ? theme.spacing.xs : 0
                  }}>
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: theme.colors.gray[600],
                    fontFamily: theme.fonts.primary
                  }}>
                    {subtitle}
                  </p>
                )}
              </div>
              
              {headerActions && (
                <div style={{
                  display: 'flex',
                  gap: theme.spacing.md,
                  alignItems: 'center'
                }}>
                  {headerActions}
                </div>
              )}
            </PixelStack>
          </PixelContainer>
        </div>
      )}

      {/* Page Content */}
      <main style={{
        padding: `${theme.spacing.xl} 0`,
        flex: 1
      }}>
        <PixelContainer>
          {children}
        </PixelContainer>
      </main>

      {/* Page Footer */}
      <footer style={{
        backgroundColor: theme.colors.black,
        color: theme.colors.white,
        padding: `${theme.spacing.lg} 0`,
        marginTop: 'auto'
      }}>
        <PixelContainer>
          <div style={{
            textAlign: 'center',
            fontSize: '10px',
            fontFamily: theme.fonts.primary
          }}>
            <div>💕 Arkadaşlar için özel olarak tasarlandı 💕</div>
            <div style={{ marginTop: theme.spacing.xs, opacity: 0.7 }}>
              Her poop anı değerlidir! 🎉
            </div>
          </div>
        </PixelContainer>
      </footer>
    </div>
  );
};

// Page Section Component
const PixelPageSection = ({ 
  children,
  title,
  subtitle,
  actions = null,
  className = '',
  style = {}
}) => {
  return (
    <section
      className={`pixel-page-section ${className}`}
      style={{
        marginBottom: theme.spacing.xxxl,
        ...style
      }}
    >
      {(title || subtitle || actions) && (
        <div style={{
          marginBottom: theme.spacing.lg,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: theme.spacing.md
        }}>
          <div>
            {title && (
              <h2 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 'bold',
                color: theme.colors.black,
                fontFamily: theme.fonts.primary,
                marginBottom: subtitle ? theme.spacing.xs : 0
              }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: theme.colors.gray[600],
                fontFamily: theme.fonts.primary
              }}>
                {subtitle}
              </p>
            )}
          </div>
          
          {actions && (
            <div style={{
              display: 'flex',
              gap: theme.spacing.sm,
              alignItems: 'center'
            }}>
              {actions}
            </div>
          )}
        </div>
      )}
      
      {children}
    </section>
  );
};

// Export components
PixelPage.Section = PixelPageSection;

export default PixelPage;
