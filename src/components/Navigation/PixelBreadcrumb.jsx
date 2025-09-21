import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PixelButton from '../PixelButton';
import { theme } from '../../theme';

const PixelBreadcrumb = ({ 
  items = [],
  separator = '▶',
  className = '',
  style = {}
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Eğer items verilmemişse, mevcut path'ten otomatik oluştur
  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbsFromPath(location.pathname);

  function generateBreadcrumbsFromPath(pathname) {
    const pathSegments = pathname.split('/').filter(segment => segment);
    const items = [
      { label: 'Ana Sayfa', path: '/', icon: '🏠' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = formatSegmentLabel(segment);
      const icon = getSegmentIcon(segment);
      
      items.push({
        label,
        path: currentPath,
        icon,
        isLast: index === pathSegments.length - 1
      });
    });

    return items;
  }

  function formatSegmentLabel(segment) {
    const labelMap = {
      'dashboard': 'Dashboard',
      'profile': 'Profil',
      'settings': 'Ayarlar',
      'rooms': 'Odalar',
      'leaderboard': 'Liderlik',
      'achievements': 'Başarımlar',
      'help': 'Yardım'
    };
    
    return labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  }

  function getSegmentIcon(segment) {
    const iconMap = {
      'dashboard': '📊',
      'profile': '👤',
      'settings': '⚙️',
      'rooms': '🚪',
      'leaderboard': '🏆',
      'achievements': '🎯',
      'help': '❓'
    };
    
    return iconMap[segment] || '📁';
  }

  const handleBreadcrumbClick = (path) => {
    navigate(path);
  };

  return (
    <nav 
      className={`pixel-breadcrumb ${className}`}
      style={{
        padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
        backgroundColor: theme.colors.gray[50],
        borderBottom: `1px solid ${theme.colors.gray[200]}`,
        ...style
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.xs,
        flexWrap: 'wrap'
      }}>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <PixelButton
              variant={item.isLast ? 'primary' : 'secondary'}
              size="xs"
              onClick={() => !item.isLast && handleBreadcrumbClick(item.path)}
              disabled={item.isLast}
              style={{
                fontSize: '8px',
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.xs,
                minHeight: '24px',
                opacity: item.isLast ? 1 : 0.8,
                cursor: item.isLast ? 'default' : 'pointer'
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </PixelButton>
            
            {index < breadcrumbItems.length - 1 && (
              <span style={{
                fontSize: '8px',
                color: theme.colors.gray[500],
                margin: `0 ${theme.spacing.xs}`
              }}>
                {separator}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default PixelBreadcrumb;
