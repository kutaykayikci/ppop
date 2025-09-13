import React, { useState, useEffect } from 'react';
import PixelCard from '../PixelCard';
import PixelButton from '../PixelButton';
import { 
  sendPushToAllUsers, 
  sendPushToRoom, 
  sendPushToCharacter,
  getPushHistory,
  savePushNotification
} from '../../services/pushService';

const PushManager = () => {
  const [pushData, setPushData] = useState({
    title: '',
    body: '',
    imageUrl: '',
    targetType: 'all', // all, room, character
    targetId: '',
    scheduledTime: ''
  });
  const [rooms, setRooms] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [pushHistory, setPushHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [roomsData, charactersData, historyData] = await Promise.all([
        import('../../services/adminDataService').then(m => m.getRoomsData()),
        import('../../services/adminDataService').then(m => m.getCharactersData()),
        getPushHistory()
      ]);
      
      setRooms(roomsData);
      setCharacters(charactersData);
      setPushHistory(historyData);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setPushData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendPush = async () => {
    if (!pushData.title || !pushData.body) {
      alert('Başlık ve açıklama alanları zorunludur!');
      return;
    }

    try {
      setSending(true);
      
      // Push bildirimini kaydet
      const pushNotification = {
        title: pushData.title,
        body: pushData.body,
        imageUrl: pushData.imageUrl || '/poop-emoji.svg',
        targetType: pushData.targetType,
        targetId: pushData.targetId || null,
        scheduledTime: pushData.scheduledTime || new Date().toISOString(),
        sentAt: new Date().toISOString(),
        status: 'sent'
      };

      await savePushNotification(pushNotification);

      // Push gönder
      let result;
      if (pushData.targetType === 'all') {
        result = await sendPushToAllUsers(pushNotification);
      } else if (pushData.targetType === 'room') {
        result = await sendPushToRoom(pushData.targetId, pushNotification);
      } else if (pushData.targetType === 'character') {
        result = await sendPushToCharacter(pushData.targetId, pushNotification);
      }

      if (result.success) {
        alert('Push bildirimi başarıyla gönderildi!');
        setPushData({
          title: '',
          body: '',
          imageUrl: '',
          targetType: 'all',
          targetId: '',
          scheduledTime: ''
        });
        loadData(); // Geçmişi yenile
      } else {
        alert('Push gönderilirken hata oluştu: ' + result.error);
      }
    } catch (error) {
      console.error('Push gönderme hatası:', error);
      alert('Push gönderilirken hata oluştu!');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  if (loading) {
    return (
      <PixelCard style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '12px', color: '#333' }}>
          📱 Push yöneticisi yükleniyor...
        </div>
      </PixelCard>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '14px', color: '#333', marginBottom: '20px' }}>
        📱 Push Bildirim Yöneticisi
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px'
      }}>
        {/* Push Gönderme Formu */}
        <PixelCard>
          <h3 style={{ fontSize: '12px', marginBottom: '15px', color: '#333' }}>
            📤 Yeni Push Gönder
          </h3>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              fontSize: '10px',
              color: '#333',
              marginBottom: '5px'
            }}>
              📝 Başlık *
            </label>
            <input
              type="text"
              value={pushData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="pixel-input"
              style={{ width: '100%', fontSize: '10px' }}
              placeholder="Push bildirim başlığı"
              maxLength={50}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              fontSize: '10px',
              color: '#333',
              marginBottom: '5px'
            }}>
              📄 Açıklama *
            </label>
            <textarea
              value={pushData.body}
              onChange={(e) => handleInputChange('body', e.target.value)}
              style={{
                width: '100%',
                minHeight: '80px',
                fontSize: '10px',
                padding: '10px',
                border: '3px solid #333',
                borderRadius: '4px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              placeholder="Push bildirim açıklaması"
              maxLength={200}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              fontSize: '10px',
              color: '#333',
              marginBottom: '5px'
            }}>
              🖼️ Görsel URL (opsiyonel)
            </label>
            <input
              type="url"
              value={pushData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              className="pixel-input"
              style={{ width: '100%', fontSize: '10px' }}
              placeholder="https://example.com/image.png"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              fontSize: '10px',
              color: '#333',
              marginBottom: '5px'
            }}>
              🎯 Hedef Seç
            </label>
            <select
              value={pushData.targetType}
              onChange={(e) => handleInputChange('targetType', e.target.value)}
              style={{
                width: '100%',
                fontSize: '10px',
                padding: '10px',
                border: '3px solid #333',
                borderRadius: '4px',
                fontFamily: 'inherit'
              }}
            >
              <option value="all">🌍 Tüm Kullanıcılar</option>
              <option value="room">🏠 Belirli Oda</option>
              <option value="character">👤 Belirli Karakter</option>
            </select>
          </div>

          {pushData.targetType === 'room' && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                fontSize: '10px',
                color: '#333',
                marginBottom: '5px'
              }}>
                🏠 Oda Seç
              </label>
              <select
                value={pushData.targetId}
                onChange={(e) => handleInputChange('targetId', e.target.value)}
                style={{
                  width: '100%',
                  fontSize: '10px',
                  padding: '10px',
                  border: '3px solid #333',
                  borderRadius: '4px',
                  fontFamily: 'inherit'
                }}
              >
                <option value="">Oda seçin...</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.name} ({room.characterCount} karakter)
                  </option>
                ))}
              </select>
            </div>
          )}

          {pushData.targetType === 'character' && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                fontSize: '10px',
                color: '#333',
                marginBottom: '5px'
              }}>
                👤 Karakter Seç
              </label>
              <select
                value={pushData.targetId}
                onChange={(e) => handleInputChange('targetId', e.target.value)}
                style={{
                  width: '100%',
                  fontSize: '10px',
                  padding: '10px',
                  border: '3px solid #333',
                  borderRadius: '4px',
                  fontFamily: 'inherit'
                }}
              >
                <option value="">Karakter seçin...</option>
                {characters.map(character => (
                  <option key={character.id} value={character.id}>
                    {character.emoji} {character.name} - {character.roomName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '10px',
              color: '#333',
              marginBottom: '5px'
            }}>
              ⏰ Zamanlama (opsiyonel)
            </label>
            <input
              type="datetime-local"
              value={pushData.scheduledTime}
              onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
              className="pixel-input"
              style={{ width: '100%', fontSize: '10px' }}
            />
          </div>

          <PixelButton
            onClick={handleSendPush}
            disabled={sending || !pushData.title || !pushData.body}
            style={{
              width: '100%',
              fontSize: '12px',
              padding: '15px',
              backgroundColor: sending ? '#6c757d' : '#28a745',
              borderColor: sending ? '#5a6268' : '#1e7e34',
              color: '#fff'
            }}
          >
            {sending ? '📤 Gönderiliyor...' : '🚀 Push Gönder'}
          </PixelButton>
        </PixelCard>

        {/* Push Geçmişi */}
        <PixelCard>
          <h3 style={{ fontSize: '12px', marginBottom: '15px', color: '#333' }}>
            📜 Push Geçmişi
          </h3>
          
          <div style={{ maxHeight: '400px', overflow: 'auto' }}>
            {pushHistory.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: '#666',
                fontSize: '10px',
                padding: '20px'
              }}>
                Henüz push gönderilmemiş
              </div>
            ) : (
              pushHistory.map(push => (
                <div key={push.id} style={{
                  padding: '10px',
                  borderBottom: '1px solid #eee',
                  fontSize: '9px'
                }}>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '5px'
                  }}>
                    📱 {push.title}
                  </div>
                  <div style={{
                    color: '#666',
                    marginBottom: '5px',
                    lineHeight: 1.3
                  }}>
                    {push.body}
                  </div>
                  <div style={{
                    fontSize: '8px',
                    color: '#999'
                  }}>
                    {formatDate(push.sentAt)} - 
                    {push.targetType === 'all' ? ' Tüm kullanıcılar' : 
                     push.targetType === 'room' ? ` Oda: ${push.targetId}` :
                     ` Karakter: ${push.targetId}`}
                  </div>
                </div>
              ))
            )}
          </div>
        </PixelCard>
      </div>

      {/* Hızlı Push Şablonları */}
      <PixelCard style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '12px', marginBottom: '15px', color: '#333' }}>
          ⚡ Hızlı Şablonlar
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px'
        }}>
          {[
            {
              title: '🎉 Başarı Tebriği',
              body: 'Harika gidiyorsun! Sen bir şampiyonsun! 🏆',
              icon: '🏆'
            },
            {
              title: '⏰ Hatırlatıcı',
              body: 'Bugün henüz poop yapmadın! Hadi başla! 💩',
              icon: '⏰'
            },
            {
              title: '🔥 Streak Motivasyonu',
              body: 'Streak serin devam ediyor! Harika! 🔥',
              icon: '🔥'
            },
            {
              title: '👫 Partner Aktivitesi',
              body: 'Partnerin de aktif! Sen de katıl! 👫',
              icon: '👫'
            }
          ].map((template, index) => (
            <div
              key={index}
              onClick={() => {
                setPushData(prev => ({
                  ...prev,
                  title: template.title,
                  body: template.body
                }));
              }}
              style={{
                padding: '10px',
                border: '2px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'center',
                fontSize: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.borderColor = '#ff6b6b';
                e.target.style.backgroundColor = '#fff5f5';
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = '#ddd';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ fontSize: '16px', marginBottom: '5px' }}>
                {template.icon}
              </div>
              <div style={{ fontWeight: 'bold', color: '#333' }}>
                {template.title}
              </div>
            </div>
          ))}
        </div>
      </PixelCard>
    </div>
  );
};

export default PushManager;
