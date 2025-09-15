import React, { useState } from 'react';
import PixelCard from '../PixelCard';
import PixelButton from '../PixelButton';
import { 
  showSuccessPopup,
  showWarningPopup,
  showErrorPopup,
  showInfoPopup,
  showPartnerPopup,
  showAchievementPopup,
  showMotivationPopup,
  showDailyReminderPopup,
  showRoomActivityPopup,
  showCharacterUpdatePopup,
  getPopupStats
} from '../../services/popupManagerService';

const PopupDemo = ({ onClose }) => {
  const [stats, setStats] = useState(getPopupStats());

  const updateStats = () => {
    setStats(getPopupStats());
  };

  const demoPopups = [
    {
      name: 'Başarı Popup',
      action: () => {
        showSuccessPopup(
          'İşlem Başarılı!',
          'Poop sayınız başarıyla güncellendi.',
          {
            actions: [
              { id: 'view_stats', label: 'İstatistikleri Gör', data: {} },
              { id: 'continue', label: 'Devam Et', data: {} }
            ]
          }
        );
        updateStats();
      }
    },
    {
      name: 'Uyarı Popup',
      action: () => {
        showWarningPopup(
          'Dikkat!',
          'Günlük hedefinize ulaşmak için 3 poop daha gerekiyor.',
          {
            actions: [
              { id: 'remind_later', label: 'Sonra Hatırlat', data: {} },
              { id: 'set_goal', label: 'Hedef Belirle', data: {} }
            ]
          }
        );
        updateStats();
      }
    },
    {
      name: 'Hata Popup',
      action: () => {
        showErrorPopup(
          'Bir Hata Oluştu',
          'Poop sayınız güncellenirken bir sorun yaşandı.',
          {
            actions: [
              { id: 'retry', label: 'Tekrar Dene', data: {} },
              { id: 'contact_support', label: 'Destek İletişim', data: {} }
            ]
          }
        );
        updateStats();
      }
    },
    {
      name: 'Bilgi Popup',
      action: () => {
        showInfoPopup(
          'Yeni Özellik',
          'Artık partnerinizle birlikte poop sayabilirsiniz!',
          {
            actions: [
              { id: 'learn_more', label: 'Daha Fazla Bilgi', data: {} },
              { id: 'invite_partner', label: 'Partner Davet Et', data: {} }
            ]
          }
        );
        updateStats();
      }
    },
    {
      name: 'Partner Popup',
      action: () => {
        showPartnerPopup(
          'Partner Aktivitesi',
          'Ahmet bugün 15 poop yaptı! Siz de hedefinize ulaşın.',
          {
            actions: [
              { id: 'view_partner', label: 'Partneri Görüntüle', data: {} },
              { id: 'compete', label: 'Yarışmaya Katıl', data: {} }
            ]
          }
        );
        updateStats();
      }
    },
    {
      name: 'Başarı Popup',
      action: () => {
        showAchievementPopup({
          id: 'demo_achievement',
          name: 'İlk 10 Poop',
          description: 'İlk 10 poop sayınızı tamamladınız!',
          rarity: 'common',
          icon: '🏆'
        });
        updateStats();
      }
    },
    {
      name: 'Motivasyon Popup',
      action: () => {
        showMotivationPopup(
          'Harika gidiyorsun! Her gün düzenli poop saymak sağlığınız için çok önemli. Devam edin!',
          'daily'
        );
        updateStats();
      }
    },
    {
      name: 'Günlük Hatırlatıcı',
      action: () => {
        showDailyReminderPopup(
          'Günlük poop sayma zamanı! Bugün henüz hiç poop saymadınız.',
          {
            actions: [
              { id: 'start_counting', label: 'Saymaya Başla', data: {} },
              { id: 'snooze', label: '5 Dakika Sonra', data: {} }
            ]
          }
        );
        updateStats();
      }
    },
    {
      name: 'Oda Aktivitesi',
      action: () => {
        showRoomActivityPopup(
          'Yeni Oda Üyesi',
          'Elif ailenizin odasına katıldı!',
          {
            actions: [
              { id: 'welcome', label: 'Hoş Geldin De', data: {} },
              { id: 'view_room', label: 'Odayı Görüntüle', data: {} }
            ]
          }
        );
        updateStats();
      }
    },
    {
      name: 'Karakter Güncellemesi',
      action: () => {
        showCharacterUpdatePopup(
          'Karakteriniz Gelişti',
          'Karakteriniz yeni bir seviyeye ulaştı ve yeni özellikler kazandı!',
          {
            actions: [
              { id: 'view_character', label: 'Karakteri Görüntüle', data: {} },
              { id: 'customize', label: 'Özelleştir', data: {} }
            ]
          }
        );
        updateStats();
      }
    }
  ];

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
            🔔 Popup Demo
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

        {/* İstatistikler */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
              {stats.active}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Aktif</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
              {stats.queued}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Kuyrukta</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffc107' }}>
              {stats.maxConcurrent}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Maksimum</div>
          </div>
        </div>

        {/* Demo Butonları */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px',
          marginBottom: '20px'
        }}>
          {demoPopups.map((demo, index) => (
            <PixelButton
              key={index}
              onClick={demo.action}
              style={{
                backgroundColor: getButtonColor(index),
                color: 'white',
                border: 'none',
                padding: '10px',
                fontSize: '12px',
                textAlign: 'center'
              }}
            >
              {demo.name}
            </PixelButton>
          ))}
        </div>

        {/* Açıklama */}
        <div style={{
          padding: '15px',
          backgroundColor: '#e9ecef',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#495057',
          lineHeight: '1.4'
        }}>
          <strong>Popup Sistemi Özellikleri:</strong>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>Çoklu popup desteği (maksimum 3 eş zamanlı)</li>
            <li>Öncelik sıralaması</li>
            <li>Ses efektleri</li>
            <li>Animasyonlu giriş/çıkış</li>
            <li>Aksiyon butonları</li>
            <li>Farklı pozisyonlar</li>
            <li>Otomatik kapanma</li>
            <li>Popup ayarları</li>
          </ul>
        </div>

        {/* Kapat Butonu */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '2px solid #333'
        }}>
          <PixelButton
            onClick={onClose}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '8px 20px',
              fontSize: '12px'
            }}
          >
            Kapat
          </PixelButton>
        </div>
      </PixelCard>
    </div>
  );
};

// Buton renklerini belirle
const getButtonColor = (index) => {
  const colors = [
    '#28a745', // Success - Yeşil
    '#ffc107', // Warning - Sarı
    '#dc3545', // Error - Kırmızı
    '#17a2b8', // Info - Mavi
    '#6f42c1', // Partner - Mor
    '#fd7e14', // Achievement - Turuncu
    '#20c997', // Motivation - Turkuaz
    '#e83e8c', // Daily - Pembe
    '#6c757d', // Room - Gri
    '#007bff'  // Character - Mavi
  ];
  return colors[index % colors.length];
};

export default PopupDemo;
