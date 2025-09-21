import React, { useState } from 'react';
import PixelCard from '../PixelCard';
import PixelButton from '../PixelButton';
import FeedbackSettings from '../Settings/FeedbackSettings';
import FeedbackTest from './FeedbackTest';
import { 
  showFeedback, 
  FEEDBACK_TYPES, 
  FEEDBACK_LEVELS, 
  FEEDBACK_ANIMATIONS,
  showRoomFull,
  showRoomJoined,
  showPoopAdded,
  showAchievementUnlocked,
  showNetworkError
} from '../../services/feedbackManager';

const FeedbackDemo = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('demo');
  const [showSettings, setShowSettings] = useState(false);
  const [showTest, setShowTest] = useState(false);

  const demoScenarios = [
    {
      title: 'Oda Dolu Senaryosu',
      description: 'Kullanıcı dolu bir odaya katılmaya çalışıyor',
      action: () => showRoomFull({
        onAction: (actionId) => {
          if (actionId === 'create_room') {
            showFeedback(FEEDBACK_TYPES.ROOM_CREATED, {}, {
              title: 'Oda Oluşturuldu',
              message: 'Yeni oda başarıyla oluşturuldu!',
              level: FEEDBACK_LEVELS.TOAST
            });
          }
        }
      })
    },
    {
      title: 'Başarılı Katılım',
      description: 'Kullanıcı başarıyla odaya katılıyor',
      action: () => showRoomJoined('Test Oda')
    },
    {
      title: 'Poop Ekleme',
      description: 'Kullanıcı yeni poop ekliyor',
      action: () => showPoopAdded(5, {
        animation: FEEDBACK_ANIMATIONS.BOUNCE,
        sound: 'poop',
        vibration: [50, 50, 50]
      })
    },
    {
      title: 'Başarı Kazanma',
      description: 'Kullanıcı yeni bir başarı kazanıyor',
      action: () => showAchievementUnlocked({
        name: 'İlk Poop',
        description: 'İlk poopunu ekledin!',
        icon: '💩',
        emoji: '💩'
      }, {
        animation: FEEDBACK_ANIMATIONS.BOUNCE,
        sound: 'achievement',
        vibration: [200, 100, 200, 100, 200]
      })
    },
    {
      title: 'Ağ Hatası',
      description: 'İnternet bağlantısı kesiliyor',
      action: () => showNetworkError()
    },
    {
      title: 'Motivasyon Mesajı',
      description: 'Kullanıcıya motivasyon mesajı gösteriliyor',
      action: () => showFeedback(FEEDBACK_TYPES.MOTIVATION_MESSAGE, {}, {
        title: 'Harika Gidiyorsun!',
        message: 'Bugün çok aktifsin! Devam et!',
        level: FEEDBACK_LEVELS.TOAST,
        animation: FEEDBACK_ANIMATIONS.PULSE
      })
    }
  ];

  const renderDemo = () => (
    <div>
      <h3 style={{
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '16px'
      }}>
        🎭 Feedback Senaryoları
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px'
      }}>
        {demoScenarios.map((scenario, index) => (
          <PixelCard key={index} style={{
            padding: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
          onClick={scenario.action}
          >
            <h4 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '8px'
            }}>
              {scenario.title}
            </h4>
            <p style={{
              fontSize: '12px',
              color: '#666',
              marginBottom: '12px',
              lineHeight: '1.4'
            }}>
              {scenario.description}
            </p>
            <PixelButton
              size="small"
              style={{ fontSize: '10px' }}
            >
              Senaryoyu Çalıştır
            </PixelButton>
          </PixelCard>
        ))}
      </div>
    </div>
  );

  const renderTabs = () => (
    <div style={{
      display: 'flex',
      borderBottom: '2px solid #333',
      marginBottom: '20px'
    }}>
      {[
        { id: 'demo', label: 'Demo', icon: '🎭' },
        { id: 'settings', label: 'Ayarlar', icon: '⚙️' },
        { id: 'test', label: 'Test', icon: '🧪' }
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            padding: '12px 16px',
            border: 'none',
            backgroundColor: activeTab === tab.id ? '#333' : 'transparent',
            color: activeTab === tab.id ? '#fff' : '#333',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            borderBottom: activeTab === tab.id ? '3px solid #4caf50' : '3px solid transparent',
            transition: 'all 0.2s ease'
          }}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </div>
  );

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
        maxWidth: '900px',
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
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#333',
            margin: 0
          }}>
            🎯 Merkezi Feedback Sistemi
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        {renderTabs()}

        {/* Tab Content */}
        {activeTab === 'demo' && renderDemo()}
        {activeTab === 'settings' && (
          <FeedbackSettings onClose={() => setActiveTab('demo')} />
        )}
        {activeTab === 'test' && (
          <FeedbackTest onClose={() => setActiveTab('demo')} />
        )}

        {/* Bilgi */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#f5f5f5',
          border: '2px solid #ddd',
          borderRadius: '6px'
        }}>
          <h4 style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '8px'
          }}>
            📋 Sistem Özellikleri
          </h4>
          <ul style={{
            fontSize: '12px',
            color: '#666',
            margin: 0,
            paddingLeft: '16px'
          }}>
            <li>Tek merkezi feedback yönetimi</li>
            <li>5 farklı gösterim seviyesi (Toast, Popup, Modal, Banner, Inline)</li>
            <li>7 farklı animasyon tipi</li>
            <li>Ses ve titreşim desteği</li>
            <li>Responsive tasarım</li>
            <li>Erişilebilirlik desteği</li>
            <li>Kullanıcı ayarları</li>
            <li>Test ve debug araçları</li>
          </ul>
        </div>
      </PixelCard>
    </div>
  );
};

export default FeedbackDemo;
