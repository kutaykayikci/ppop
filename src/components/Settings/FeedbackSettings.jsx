import React, { useState, useEffect } from 'react';
import PixelCard from '../PixelCard';
import PixelButton from '../PixelButton';
import { 
  updateFeedbackSettings, 
  getFeedbackStats,
  showFeedback,
  FEEDBACK_TYPES,
  FEEDBACK_LEVELS,
  FEEDBACK_ANIMATIONS
} from '../../services/feedbackManager';

const FeedbackSettings = ({ onClose }) => {
  const [settings, setSettings] = useState({
    enabled: true,
    defaultLevel: FEEDBACK_LEVELS.TOAST,
    enableSound: true,
    enableVibration: true,
    enableAnimations: true,
    maxConcurrent: 3,
    autoClose: true,
    position: 'top-right',
    theme: 'pixel',
    language: 'tr'
  });

  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stats = getFeedbackStats();
      if (stats.settings) {
        setSettings(stats.settings);
      }
    } catch (error) {
      console.error('Feedback ayarları yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      updateFeedbackSettings(settings);
      
      // Başarı feedback'i göster
      showFeedback(FEEDBACK_TYPES.SYNC_COMPLETED, {}, {
        title: 'Ayarlar Kaydedildi',
        message: 'Feedback ayarlarınız başarıyla kaydedildi.',
        level: FEEDBACK_LEVELS.TOAST
      });
      
      onClose();
    } catch (error) {
      console.error('Ayarları kaydetme hatası:', error);
      showFeedback(FEEDBACK_TYPES.SYNC_FAILED, {}, {
        title: 'Kaydetme Hatası',
        message: 'Ayarlar kaydedilemedi. Lütfen tekrar deneyin.',
        level: FEEDBACK_LEVELS.TOAST
      });
    }
  };

  const testFeedback = (type, level) => {
    const testMessages = {
      [FEEDBACK_TYPES.ROOM_JOINED]: 'Test: Odaya katıldınız!',
      [FEEDBACK_TYPES.POOP_ADDED]: 'Test: Poop eklendi!',
      [FEEDBACK_TYPES.ACHIEVEMENT_UNLOCKED]: 'Test: Başarı kazandınız!',
      [FEEDBACK_TYPES.ROOM_FULL]: 'Test: Oda dolu!',
      [FEEDBACK_TYPES.NETWORK_ERROR]: 'Test: Bağlantı hatası!'
    };

    showFeedback(type, {}, {
      title: 'Test Bildirimi',
      message: testMessages[type] || 'Test mesajı',
      level: level,
      animation: settings.enableAnimations ? FEEDBACK_ANIMATIONS.BOUNCE : FEEDBACK_ANIMATIONS.NONE,
      sound: settings.enableSound ? 'success' : null,
      vibration: settings.enableVibration ? [100] : null
    });

    // Test sonucunu kaydet
    setTestResults(prev => ({
      ...prev,
      [`${type}_${level}`]: Date.now()
    }));
  };

  const resetToDefaults = () => {
    setSettings({
      enabled: true,
      defaultLevel: FEEDBACK_LEVELS.TOAST,
      enableSound: true,
      enableVibration: true,
      enableAnimations: true,
      maxConcurrent: 3,
      autoClose: true,
      position: 'top-right',
      theme: 'pixel',
      language: 'tr'
    });
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
            Ayarlar yükleniyor...
          </div>
        </PixelCard>
      </div>
    );
  }

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
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Başlık */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '2px solid #333'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333',
            margin: 0
          }}>
            🎯 Feedback Ayarları
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#666',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        {/* Genel Ayarlar */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '12px'
          }}>
            Genel Ayarlar
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Feedback Aktif/Pasif */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => handleSettingChange('enabled', e.target.checked)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ fontSize: '12px' }}>Feedback sistemini etkinleştir</span>
            </label>

            {/* Varsayılan Seviye */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '4px',
                display: 'block'
              }}>
                Varsayılan Feedback Seviyesi:
              </label>
              <select
                value={settings.defaultLevel}
                onChange={(e) => handleSettingChange('defaultLevel', e.target.value)}
                style={{
                  padding: '6px 8px',
                  fontSize: '10px',
                  border: '2px solid #333',
                  borderRadius: '4px',
                  fontFamily: "'Press Start 2P', monospace"
                }}
              >
                <option value={FEEDBACK_LEVELS.TOAST}>Toast (Kısa)</option>
                <option value={FEEDBACK_LEVELS.POPUP}>Popup (Orta)</option>
                <option value={FEEDBACK_LEVELS.MODAL}>Modal (Uzun)</option>
                <option value={FEEDBACK_LEVELS.BANNER}>Banner (Sürekli)</option>
              </select>
            </div>

            {/* Pozisyon */}
            <div>
              <label style={{
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '4px',
                display: 'block'
              }}>
                Bildirim Pozisyonu:
              </label>
              <select
                value={settings.position}
                onChange={(e) => handleSettingChange('position', e.target.value)}
                style={{
                  padding: '6px 8px',
                  fontSize: '10px',
                  border: '2px solid #333',
                  borderRadius: '4px',
                  fontFamily: "'Press Start 2P', monospace"
                }}
              >
                <option value="top-right">Sağ Üst</option>
                <option value="top-left">Sol Üst</option>
                <option value="bottom-right">Sağ Alt</option>
                <option value="bottom-left">Sol Alt</option>
                <option value="top-center">Üst Orta</option>
                <option value="bottom-center">Alt Orta</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ses ve Titreşim */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '12px'
          }}>
            Ses ve Titreşim
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={settings.enableSound}
                onChange={(e) => handleSettingChange('enableSound', e.target.checked)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ fontSize: '12px' }}>Ses efektleri</span>
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={settings.enableVibration}
                onChange={(e) => handleSettingChange('enableVibration', e.target.checked)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ fontSize: '12px' }}>Titreşim efektleri</span>
            </label>
          </div>
        </div>

        {/* Animasyonlar */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '12px'
          }}>
            Animasyonlar
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={settings.enableAnimations}
                onChange={(e) => handleSettingChange('enableAnimations', e.target.checked)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ fontSize: '12px' }}>Animasyon efektleri</span>
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={settings.autoClose}
                onChange={(e) => handleSettingChange('autoClose', e.target.checked)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ fontSize: '12px' }}>Otomatik kapatma</span>
            </label>
          </div>
        </div>

        {/* Test Bölümü */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '12px'
          }}>
            Test Bildirimleri
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '8px'
          }}>
            <PixelButton
              onClick={() => testFeedback(FEEDBACK_TYPES.ROOM_JOINED, FEEDBACK_LEVELS.TOAST)}
              size="small"
              style={{ fontSize: '8px' }}
            >
              Başarı Toast
            </PixelButton>
            
            <PixelButton
              onClick={() => testFeedback(FEEDBACK_TYPES.POOP_ADDED, FEEDBACK_LEVELS.TOAST)}
              size="small"
              style={{ fontSize: '8px' }}
            >
              Poop Toast
            </PixelButton>
            
            <PixelButton
              onClick={() => testFeedback(FEEDBACK_TYPES.ACHIEVEMENT_UNLOCKED, FEEDBACK_LEVELS.POPUP)}
              size="small"
              style={{ fontSize: '8px' }}
            >
              Başarı Popup
            </PixelButton>
            
            <PixelButton
              onClick={() => testFeedback(FEEDBACK_TYPES.ROOM_FULL, FEEDBACK_LEVELS.POPUP)}
              size="small"
              style={{ fontSize: '8px' }}
            >
              Hata Popup
            </PixelButton>
            
            <PixelButton
              onClick={() => testFeedback(FEEDBACK_TYPES.NETWORK_ERROR, FEEDBACK_LEVELS.BANNER)}
              size="small"
              style={{ fontSize: '8px' }}
            >
              Banner Test
            </PixelButton>
          </div>
        </div>

        {/* Butonlar */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          flexWrap: 'wrap'
        }}>
          <PixelButton
            onClick={resetToDefaults}
            variant="secondary"
            size="small"
          >
            Varsayılanlar
          </PixelButton>
          
          <PixelButton
            onClick={handleSave}
            variant="primary"
            size="small"
          >
            Kaydet
          </PixelButton>
        </div>
      </PixelCard>
    </div>
  );
};

export default FeedbackSettings;
