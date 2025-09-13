import React, { useState, useEffect } from 'react';
import PixelCard from '../PixelButton';
import PixelButton from '../PixelButton';
import { 
  POOP_THEMES, 
  CHARACTER_COSTUMES, 
  ROOM_DECORATIONS, 
  COUNTER_THEMES,
  getUnlockedThemes,
  saveUserTheme
} from '../../services/themeService';

const ThemeSelector = ({ roomId, characterId, currentThemes, onThemeChange, onClose }) => {
  const [activeTab, setActiveTab] = useState('poop');
  const [unlockedThemes, setUnlockedThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUnlockedThemes();
  }, [roomId, characterId]);

  const loadUnlockedThemes = async () => {
    try {
      const unlocked = await getUnlockedThemes(roomId, characterId);
      setUnlockedThemes(unlocked);
    } catch (error) {
      console.error('Açılmış temalar yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeSelect = async (themeType, themeId) => {
    try {
      await saveUserTheme(roomId, characterId, themeType, themeId);
      onThemeChange(themeType, themeId);
    } catch (error) {
      console.error('Tema seçme hatası:', error);
    }
  };

  const getThemeList = () => {
    switch (activeTab) {
      case 'poop':
        return POOP_THEMES;
      case 'costume':
        return CHARACTER_COSTUMES;
      case 'room':
        return ROOM_DECORATIONS;
      case 'counter':
        return COUNTER_THEMES;
      default:
        return POOP_THEMES;
    }
  };

  const getCurrentTheme = () => {
    return currentThemes[activeTab] || 'default';
  };

  const isThemeUnlocked = (themeId) => {
    return themeId === 'default' || themeId === 'classic' || themeId === 'basic' || unlockedThemes.includes(themeId);
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: '#95A5A6',
      rare: '#3498DB',
      epic: '#9B59B6',
      legendary: '#F39C12'
    };
    return colors[rarity] || '#95A5A6';
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <PixelCard style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#333' }}>
            Temalar yükleniyor...
          </div>
        </PixelCard>
      </div>
    );
  }

  const themes = getThemeList();
  const currentTheme = getCurrentTheme();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <PixelCard style={{
        maxWidth: '500px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Başlık */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '2px solid #333',
          paddingBottom: '10px'
        }}>
          <h2 style={{ fontSize: '14px', margin: 0, color: '#333' }}>
            🎨 Tema Seçici
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#999'
            }}
          >
            ×
          </button>
        </div>

        {/* Tab'lar */}
        <div style={{
          display: 'flex',
          gap: '5px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'poop', name: '💩 Poop', icon: '💩' },
            { id: 'costume', name: '👤 Kostüm', icon: '👤' },
            { id: 'room', name: '🏠 Oda', icon: '🏠' },
            { id: 'counter', name: '📊 Sayaç', icon: '📊' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 12px',
                fontSize: '8px',
                border: '2px solid #333',
                backgroundColor: activeTab === tab.id ? '#333' : '#fff',
                color: activeTab === tab.id ? '#fff' : '#333',
                cursor: 'pointer',
                borderRadius: '4px',
                fontFamily: 'inherit'
              }}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* Tema listesi */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '10px'
        }}>
          {Object.values(themes).map(theme => {
            const isUnlocked = isThemeUnlocked(theme.id);
            const isSelected = currentTheme === theme.id;
            const rarityColor = getRarityColor(theme.rarity);

            return (
              <div
                key={theme.id}
                onClick={() => isUnlocked && handleThemeSelect(activeTab, theme.id)}
                style={{
                  padding: '15px',
                  border: `3px solid ${isSelected ? '#ff6b6b' : isUnlocked ? rarityColor : '#ddd'}`,
                  backgroundColor: isUnlocked ? '#fff' : '#f5f5f5',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  opacity: isUnlocked ? 1 : 0.5,
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {/* Seçili işareti */}
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    fontSize: '12px'
                  }}>
                    ✅
                  </div>
                )}

                {/* Kilit işareti */}
                {!isUnlocked && (
                  <div style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    fontSize: '12px'
                  }}>
                    🔒
                  </div>
                )}

                {/* Rarity badge */}
                <div style={{
                  position: 'absolute',
                  top: '5px',
                  left: '5px',
                  fontSize: '6px',
                  backgroundColor: rarityColor,
                  color: '#fff',
                  padding: '2px 4px',
                  borderRadius: '8px',
                  textTransform: 'uppercase',
                  fontWeight: 'bold'
                }}>
                  {theme.rarity}
                </div>

                {/* Emoji/İkon */}
                <div style={{
                  fontSize: '24px',
                  marginBottom: '8px'
                }}>
                  {theme.emoji || '🎨'}
                </div>

                {/* İsim */}
                <div style={{
                  fontSize: '8px',
                  fontWeight: 'bold',
                  marginBottom: '4px',
                  color: isUnlocked ? '#333' : '#999'
                }}>
                  {theme.name}
                </div>

                {/* Açıklama */}
                <div style={{
                  fontSize: '6px',
                  color: '#666',
                  lineHeight: 1.2
                }}>
                  {theme.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* Kapatma butonu */}
        <div style={{
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <PixelButton
            onClick={onClose}
            style={{
              backgroundColor: '#ff6b6b',
              borderColor: '#e55a5a',
              color: '#fff',
              fontSize: '10px',
              padding: '10px 20px'
            }}
          >
            Kapat
          </PixelButton>
        </div>
      </PixelCard>
    </div>
  );
};

export default ThemeSelector;
