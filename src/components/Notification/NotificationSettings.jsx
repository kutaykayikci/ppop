import React, { useState, useEffect } from 'react';
import PixelCard from '../PixelCard';
import PixelButton from '../PixelButton';
import { 
  getNotificationSettings, 
  saveNotificationSettings,
  scheduleDailyReminders,
  clearReminders,
  checkNotificationPermission
} from '../../services/notificationService';

const NotificationSettings = ({ roomId, characterId, onClose }) => {
  const [settings, setSettings] = useState({
    dailyReminders: true,
    achievementNotifications: true,
    partnerActivity: true,
    motivationMessages: true,
    reminderTimes: {
      morning: true,
      afternoon: true,
      evening: false
    }
  });
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
    checkPermissions();
  }, [roomId, characterId]);

  const loadSettings = async () => {
    try {
      const savedSettings = getNotificationSettings(roomId, characterId);
      setSettings(savedSettings);
    } catch (error) {
      console.error('Bildirim ayarları yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPermissions = async () => {
    const permission = await checkNotificationPermission();
    setHasPermission(permission);
  };

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleReminderTimeChange = (time, value) => {
    setSettings(prev => ({
      ...prev,
      reminderTimes: {
        ...prev.reminderTimes,
        [time]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      saveNotificationSettings(roomId, characterId, settings);
      
      // Günlük hatırlatıcıları yeniden ayarla
      if (settings.dailyReminders) {
        clearReminders(roomId, characterId);
        scheduleDailyReminders(roomId, characterId);
      } else {
        clearReminders(roomId, characterId);
      }
      
      onClose();
    } catch (error) {
      console.error('Ayarları kaydetme hatası:', error);
    }
  };

  const requestPermission = async () => {
    const permission = await checkNotificationPermission();
    setHasPermission(permission);
    
    if (permission) {
      alert('Bildirim izni verildi! Artık hatırlatıcılar alabilirsin.');
    } else {
      alert('Bildirim izni reddedildi. Ayarlardan izni tekrar verebilirsin.');
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
        maxWidth: '400px',
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
            🔔 Bildirim Ayarları
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

        {/* İzin durumu */}
        <div style={{
          padding: '10px',
          backgroundColor: hasPermission ? '#d4edda' : '#f8d7da',
          border: `2px solid ${hasPermission ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <div style={{
            fontSize: '10px',
            color: hasPermission ? '#155724' : '#721c24',
            fontWeight: 'bold',
            marginBottom: '5px'
          }}>
            {hasPermission ? '✅ Bildirim İzni Verildi' : '❌ Bildirim İzni Gerekli'}
          </div>
          <div style={{
            fontSize: '8px',
            color: hasPermission ? '#155724' : '#721c24'
          }}>
            {hasPermission 
              ? 'Bildirimler aktif ve çalışıyor'
              : 'Bildirim alabilmek için izin vermelisin'
            }
          </div>
          {!hasPermission && (
            <PixelButton
              onClick={requestPermission}
              style={{
                marginTop: '10px',
                fontSize: '8px',
                padding: '8px 16px',
                backgroundColor: '#007bff',
                borderColor: '#0056b3',
                color: '#fff'
              }}
            >
              İzin Ver
            </PixelButton>
          )}
        </div>

        {/* Bildirim ayarları */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '12px', marginBottom: '15px', color: '#333' }}>
            📱 Bildirim Türleri
          </h3>
          
          {[
            { key: 'dailyReminders', label: 'Günlük Hatırlatıcılar', icon: '⏰' },
            { key: 'achievementNotifications', label: 'Başarı Bildirimleri', icon: '🏆' },
            { key: 'partnerActivity', label: 'Partner Aktivitesi', icon: '👫' },
            { key: 'motivationMessages', label: 'Motivasyon Mesajları', icon: '💪' }
          ].map(({ key, label, icon }) => (
            <div key={key} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: '1px solid #eee'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px' }}>{icon}</span>
                <span style={{ fontSize: '10px', color: '#333' }}>{label}</span>
              </div>
              <label style={{
                position: 'relative',
                display: 'inline-block',
                width: '40px',
                height: '20px'
              }}>
                <input
                  type="checkbox"
                  checked={settings[key]}
                  onChange={(e) => handleSettingChange(key, e.target.checked)}
                  style={{ display: 'none' }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: settings[key] ? '#ff6b6b' : '#ccc',
                  borderRadius: '20px',
                  transition: '0.3s'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '',
                    height: '16px',
                    width: '16px',
                    left: settings[key] ? '22px' : '2px',
                    bottom: '2px',
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    transition: '0.3s'
                  }} />
                </span>
              </label>
            </div>
          ))}
        </div>

        {/* Hatırlatıcı saatleri */}
        {settings.dailyReminders && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '12px', marginBottom: '15px', color: '#333' }}>
              ⏰ Hatırlatıcı Saatleri
            </h3>
            
            {[
              { key: 'morning', label: 'Sabah (09:00)', icon: '🌅' },
              { key: 'afternoon', label: 'Öğleden Sonra (15:00)', icon: '☀️' },
              { key: 'evening', label: 'Akşam (19:00)', icon: '🌅' }
            ].map(({ key, label, icon }) => (
              <div key={key} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px' }}>{icon}</span>
                  <span style={{ fontSize: '9px', color: '#333' }}>{label}</span>
                </div>
                <label style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '30px',
                  height: '15px'
                }}>
                  <input
                    type="checkbox"
                    checked={settings.reminderTimes[key]}
                    onChange={(e) => handleReminderTimeChange(key, e.target.checked)}
                    style={{ display: 'none' }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: settings.reminderTimes[key] ? '#ff6b6b' : '#ccc',
                    borderRadius: '15px',
                    transition: '0.3s'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '',
                      height: '12px',
                      width: '12px',
                      left: settings.reminderTimes[key] ? '16px' : '1px',
                      bottom: '1.5px',
                      backgroundColor: '#fff',
                      borderRadius: '50%',
                      transition: '0.3s'
                    }} />
                  </span>
                </label>
              </div>
            ))}
          </div>
        )}

        {/* Butonlar */}
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center'
        }}>
          <PixelButton
            onClick={onClose}
            style={{
              backgroundColor: '#6c757d',
              borderColor: '#5a6268',
              color: '#fff',
              fontSize: '10px',
              padding: '10px 20px'
            }}
          >
            İptal
          </PixelButton>
          <PixelButton
            onClick={handleSave}
            style={{
              backgroundColor: '#28a745',
              borderColor: '#1e7e34',
              color: '#fff',
              fontSize: '10px',
              padding: '10px 20px'
            }}
          >
            Kaydet
          </PixelButton>
        </div>
      </PixelCard>
    </div>
  );
};

export default NotificationSettings;
