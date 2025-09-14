import React, { useState, useEffect } from 'react';
import PixelCard from '../PixelCard';
import PixelButton from '../PixelButton';
import { sendBulkNotification, getPushStatistics } from '../../services/smartPushService';
import { getAllNotificationPermissions } from '../../services/permissionService';

const PushManager = () => {
  const [pushForm, setPushForm] = useState({
    title: '',
    message: '',
    targetType: 'all',
    targetValue: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pushStats, setPushStats] = useState(null);
  const [permissionStats, setPermissionStats] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const [pushStatsData, permissionData] = await Promise.all([
        getPushStatistics('week'),
        getAllNotificationPermissions()
      ]);
      
      setPushStats(pushStatsData.stats);
      setPermissionStats(permissionData.stats);
    } catch (error) {
      console.error('İstatistik yükleme hatası:', error);
    }
  };

  const handleSendPush = async () => {
    if (!pushForm.title.trim() || !pushForm.message.trim()) {
      alert('Başlık ve mesaj alanları zorunludur!');
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendBulkNotification(
        pushForm.title,
        pushForm.message,
        pushForm.targetType,
        pushForm.targetValue || null
      );

      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        // Formu temizle
        setPushForm({
          title: '',
          message: '',
          targetType: 'all',
          targetValue: ''
        });

        // İstatistikleri yenile
        await loadStatistics();
      } else {
        alert(`Push gönderimi başarısız: ${result.error || result.message}`);
      }
    } catch (error) {
      console.error('Push gönderimi hatası:', error);
      alert(`Hata: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getQuickTemplates = () => [
    {
      title: "🎉 Yeni Özellik!",
      message: "Uygulamaya yeni özellikler eklendi! Hemen kontrol et!",
      type: "announcement"
    },
    {
      title: "💩 Poop Challenge!",
      message: "Bu hafta en çok poop yapan kazanır! Hadi başla!",
      type: "challenge"
    },
    {
      title: "🏆 Başarı Bildirimi",
      message: "Harika işler yapıyorsunuz! Devam edin!",
      type: "motivation"
    },
    {
      title: "📊 İstatistikler",
      message: "Bu hafta toplam poop sayınızı kontrol edin!",
      type: "stats"
    }
  ];

  const useTemplate = (template) => {
    setPushForm(prev => ({
      ...prev,
      title: template.title,
      message: template.message
    }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ 
        color: '#333', 
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        📱 Push Bildirim Yöneticisi
      </h2>

      {/* İstatistikler */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px',
        marginBottom: '30px'
      }}>
        <PixelCard title="📊 Push İstatistikleri">
          {pushStats ? (
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div>📤 Toplam Gönderim: <strong>{pushStats.total}</strong></div>
              <div>✅ Başarılı: <strong style={{ color: '#27ae60' }}>{pushStats.sent}</strong></div>
              <div>❌ Başarısız: <strong style={{ color: '#e74c3c' }}>{pushStats.failed}</strong></div>
              <div>👥 Partner Aktiviteleri: <strong>{pushStats.partnerActivity}</strong></div>
            </div>
          ) : (
            <div>Yükleniyor...</div>
          )}
        </PixelCard>

        <PixelCard title="🔔 İzin İstatistikleri">
          {permissionStats ? (
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div>👥 Toplam Kullanıcı: <strong>{permissionStats.total}</strong></div>
              <div>✅ İzin Veren: <strong style={{ color: '#27ae60' }}>{permissionStats.granted}</strong></div>
              <div>❌ İzin Vermeyen: <strong style={{ color: '#e74c3c' }}>{permissionStats.denied}</strong></div>
              <div>📊 İzin Oranı: <strong>{Math.round((permissionStats.granted / permissionStats.total) * 100)}%</strong></div>
            </div>
          ) : (
            <div>Yükleniyor...</div>
          )}
        </PixelCard>
      </div>

      {/* Push Gönderim Formu */}
      <PixelCard title="📤 Yeni Push Bildirimi">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Hedef Seçimi */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Hedef:
            </label>
            <select
              value={pushForm.targetType}
              onChange={(e) => setPushForm(prev => ({ ...prev, targetType: e.target.value, targetValue: '' }))}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #333',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                fontSize: '14px'
              }}
            >
              <option value="all">Tüm Kullanıcılar</option>
              <option value="room">Belirli Oda</option>
              <option value="character">Belirli Karakter</option>
            </select>
          </div>

          {/* Hedef Değeri */}
          {pushForm.targetType !== 'all' && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                {pushForm.targetType === 'room' ? 'Oda ID:' : 'Karakter ID:'}
              </label>
              <input
                type="text"
                value={pushForm.targetValue}
                onChange={(e) => setPushForm(prev => ({ ...prev, targetValue: e.target.value }))}
                placeholder={pushForm.targetType === 'room' ? 'Oda ID girin' : 'Karakter ID girin'}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #333',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa',
                  fontSize: '14px'
                }}
              />
            </div>
          )}

          {/* Başlık */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Başlık:
            </label>
            <input
              type="text"
              value={pushForm.title}
              onChange={(e) => setPushForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Bildirim başlığı..."
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #333',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Mesaj */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Mesaj:
            </label>
            <textarea
              value={pushForm.message}
              onChange={(e) => setPushForm(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Bildirim mesajı..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #333',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Gönder Butonu */}
          <PixelButton
            onClick={handleSendPush}
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? '#95a5a6' : '#3498db',
              color: 'white',
              fontSize: '16px',
              padding: '12px 24px',
              margin: '10px 0'
            }}
          >
            {isLoading ? '📤 Gönderiliyor...' : '📤 Push Gönder'}
          </PixelButton>

          {/* Başarı Mesajı */}
          {showSuccess && (
            <div style={{
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              color: '#155724',
              padding: '10px',
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '14px'
            }}>
              ✅ Push bildirimi başarıyla gönderildi!
            </div>
          )}
        </div>
      </PixelCard>

      {/* Hazır Şablonlar */}
      <PixelCard title="📋 Hazır Şablonlar" style={{ marginTop: '20px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '10px' 
        }}>
          {getQuickTemplates().map((template, index) => (
            <div key={index} style={{
              border: '2px solid #333',
              borderRadius: '8px',
              padding: '12px',
              backgroundColor: '#f8f9fa',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => useTemplate(template)}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#e9ecef';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#f8f9fa';
              e.target.style.transform = 'translateY(0)';
            }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                {template.title}
              </div>
              <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
                {template.message}
              </div>
              <div style={{ 
                fontSize: '10px', 
                color: '#999', 
                marginTop: '5px',
                textAlign: 'right'
              }}>
                Kullan
              </div>
            </div>
          ))}
        </div>
      </PixelCard>
    </div>
  );
};

export default PushManager;