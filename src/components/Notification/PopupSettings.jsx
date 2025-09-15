import React, { useState, useEffect } from 'react';
import PixelCard from '../PixelCard';
import PixelButton from '../PixelButton';

const PopupSettings = ({ roomId, characterId, onClose }) => {
  const [settings, setSettings] = useState({
    enabled: true,
    sound: true,
    duration: 5000,
    maxConcurrent: 3,
    position: 'top-right',
    types: {
      achievement: true,
      motivation: true,
      partner: true,
      daily_reminder: true,
      room_activity: true,
      character_update: true,
      success: true,
      warning: true,
      error: true,
      info: true
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, [roomId, characterId]);

  const loadSettings = async () => {
    try {
      const savedSettings = localStorage.getItem(`popup_settings_${roomId}_${characterId}`);
      if (savedSettings) {
        setSettings({ ...settings, ...JSON.parse(savedSettings) });
      }
    } catch (error) {
      console.error('Popup ayarları yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      localStorage.setItem(`popup_settings_${roomId}_${characterId}`, JSON.stringify(settings));
      // Global popup manager ayarlarını güncelle
      if (window.popupManager) {
        window.popupManager.updateSettings(settings);
      }
    } catch (error) {
      console.error('Popup ayarları kaydetme hatası:', error);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTypeChange = (type, value) => {
    setSettings(prev => ({
      ...prev,
      types: {
        ...prev.types,
        [type]: value
      }
    }));
  };

  const testPopup = async (type) => {
    const { createPopup, POPUP_TYPES } = await import('../../services/popupManagerService');
    
    const testMessages = {
      achievement: { title: 'Test Başarı', message: 'Bu bir test başarı bildirimidir!' },
      motivation: { message: 'Bu bir test motivasyon mesajıdır!' },
      partner: { title: 'Partner Aktivitesi', message: 'Partneriniz bir şey yaptı!' },
      daily_reminder: { title: 'Günlük Hatırlatıcı', message: 'Poop saymanızı unutmayın!' },
      room_activity: { title: 'Oda Aktivitesi', message: 'Odada yeni bir aktivite var!' },
      character_update: { title: 'Karakter Güncellemesi', message: 'Karakteriniz güncellendi!' },
      success: { title: 'Başarılı', message: 'İşlem başarıyla tamamlandı!' },
      warning: { title: 'Uyarı', message: 'Bu bir uyarı mesajıdır!' },
      error: { title: 'Hata', message: 'Bir hata oluştu!' },
      info: { title: 'Bilgi', message: 'Bu bir bilgi mesajıdır!' }
    };

    const testMessage = testMessages[type];
    if (testMessage) {
      createPopup({
        type: POPUP_TYPES[type.toUpperCase()] || POPUP_TYPES.INFO,
        title: testMessage.title,
        message: testMessage.message,
        duration: settings.duration
      });
    }
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
        <PixelCard style={{ padding: '20px' }}>
          <div style={{ textAlign: 'center' }}>Yükleniyor...</div>
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
          <h2 style={{ fontSize: '16px', margin: 0, color: '#333' }}>
            🔔 Popup Bildirim Ayarları
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

        {/* Genel Ayarlar */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '10px', color: '#333' }}>
            Genel Ayarlar
          </h3>
          
          {/* Popup'ları etkinleştir */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            padding: '8px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px'
          }}>
            <label style={{ fontSize: '12px', color: '#333' }}>
              Popup Bildirimleri
            </label>
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => handleSettingChange('enabled', e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
          </div>

          {/* Ses efektleri */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            padding: '8px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px'
          }}>
            <label style={{ fontSize: '12px', color: '#333' }}>
              Ses Efektleri
            </label>
            <input
              type="checkbox"
              checked={settings.sound}
              onChange={(e) => handleSettingChange('sound', e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
          </div>

          {/* Görüntülenme süresi */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            padding: '8px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px'
          }}>
            <label style={{ fontSize: '12px', color: '#333' }}>
              Görüntülenme Süresi (ms)
            </label>
            <input
              type="number"
              value={settings.duration}
              onChange={(e) => handleSettingChange('duration', parseInt(e.target.value))}
              min="1000"
              max="10000"
              step="500"
              style={{
                width: '80px',
                padding: '4px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            />
          </div>

          {/* Maksimum eş zamanlı popup */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            padding: '8px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px'
          }}>
            <label style={{ fontSize: '12px', color: '#333' }}>
              Maksimum Eş Zamanlı Popup
            </label>
            <input
              type="number"
              value={settings.maxConcurrent}
              onChange={(e) => handleSettingChange('maxConcurrent', parseInt(e.target.value))}
              min="1"
              max="5"
              style={{
                width: '60px',
                padding: '4px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            />
          </div>

          {/* Popup pozisyonu */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            padding: '8px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px'
          }}>
            <label style={{ fontSize: '12px', color: '#333' }}>
              Popup Pozisyonu
            </label>
            <select
              value={settings.position}
              onChange={(e) => handleSettingChange('position', e.target.value)}
              style={{
                padding: '4px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              <option value="top-right">Sağ Üst</option>
              <option value="top-left">Sol Üst</option>
              <option value="bottom-right">Sağ Alt</option>
              <option value="bottom-left">Sol Alt</option>
            </select>
          </div>
        </div>

        {/* Popup Tipleri */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '10px', color: '#333' }}>
            Popup Tipleri
          </h3>
          
          {Object.entries(settings.types).map(([type, enabled]) => (
            <div key={type} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
              padding: '6px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px'
            }}>
              <label style={{ fontSize: '12px', color: '#333', textTransform: 'capitalize' }}>
                {type.replace('_', ' ')}
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => testPopup(type)}
                  style={{
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontSize: '10px',
                    cursor: 'pointer'
                  }}
                >
                  Test
                </button>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => handleTypeChange(type, e.target.checked)}
                  style={{ transform: 'scale(1.1)' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Kaydet Butonu */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '2px solid #333'
        }}>
          <PixelButton
            onClick={saveSettings}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              fontSize: '12px'
            }}
          >
            Kaydet
          </PixelButton>
          
          <PixelButton
            onClick={onClose}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              fontSize: '12px'
            }}
          >
            İptal
          </PixelButton>
        </div>
      </PixelCard>
    </div>
  );
};

export default PopupSettings;
