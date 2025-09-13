import React, { useState } from 'react';
import { checkRoomStatus } from '../../services/roomService';
import PixelButton from '../PixelButton';

const PartnerInvite = ({ room, character, onPartnerJoined }) => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [partnerStatus, setPartnerStatus] = useState(null);

  const inviteUrl = `${window.location.origin}${window.location.pathname}?room=${room.id}&invite=true`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Kopyalama hatası:', error);
    }
  };

  const checkPartnerStatus = async () => {
    setLoading(true);
    try {
      const roomStatus = await checkRoomStatus(room.id);
      setPartnerStatus(roomStatus);
      
      if (roomStatus.isComplete) {
        // Partner katıldı, dashboard'a yönlendir
        setTimeout(() => {
          onPartnerJoined();
        }, 1000);
      }
    } catch (error) {
      console.error('Partner durumu kontrol hatası:', error);
      setPartnerStatus({ error: 'Kontrol edilemedi' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#fff',
        border: '3px solid #333',
        borderRadius: '8px',
        boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.2)',
        padding: '30px',
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '20px'
        }}>
          ✅
        </div>

        <h2 style={{
          fontSize: '24px',
          color: '#333',
          marginBottom: '20px'
        }}>
          Karakterin Tamamlandı!
        </h2>

        <div style={{
          backgroundColor: '#f8f9fa',
          border: '2px solid #333',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            fontSize: '32px',
            marginBottom: '10px'
          }}>
            {character.emoji}
          </div>
          <div style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: character.color,
            marginBottom: '5px'
          }}>
            {character.name}
          </div>
          <div style={{
            fontSize: '14px',
            color: '#666'
          }}>
            {character.gender === 'male' ? 'Erkek' : 'Kadın'} Karakter
          </div>
        </div>

        <h3 style={{
          fontSize: '18px',
          color: '#333',
          marginBottom: '20px'
        }}>
          🎯 Partnerini Davet Et
        </h3>

        <div style={{
          backgroundColor: '#e6f7ff',
          border: '2px solid #4ecdc4',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#333'
          }}>
            Room ID:
          </div>
          <div style={{
            fontSize: '16px',
            fontFamily: 'monospace',
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '4px',
            border: '2px solid #333',
            wordBreak: 'break-all'
          }}>
            {room.id}
          </div>
        </div>

        <div style={{
          fontSize: '14px',
          color: '#666',
          marginBottom: '20px',
          lineHeight: '1.5'
        }}>
          Partnerin bu Room ID'yi kullanarak odaya katılabilir ve kendi karakterini oluşturabilir.
        </div>

        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <PixelButton
            onClick={copyToClipboard}
            variant="secondary"
            size="sm"
          >
            {copied ? 'Kopyalandı!' : 'Room ID Kopyala'}
          </PixelButton>
          
          <PixelButton
            onClick={checkPartnerStatus}
            variant="primary"
            size="sm"
            disabled={loading}
          >
            {loading ? 'Kontrol Ediliyor...' : 'Partner Katıldı mı?'}
          </PixelButton>
        </div>

        {/* Partner Durumu */}
        {partnerStatus && (
          <div style={{
            backgroundColor: partnerStatus.isComplete ? '#d4edda' : '#f8d7da',
            border: `2px solid ${partnerStatus.isComplete ? '#28a745' : '#dc3545'}`,
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {partnerStatus.error ? (
              <div style={{ color: '#721c24', fontSize: '14px' }}>
                ❌ {partnerStatus.error}
              </div>
            ) : partnerStatus.isComplete ? (
              <div style={{ color: '#155724', fontSize: '14px' }}>
                ✅ Partner katıldı! Dashboard açılıyor...
              </div>
            ) : (
              <div style={{ color: '#721c24', fontSize: '14px' }}>
                ⏳ Partner henüz katılmadı ({partnerStatus.characterCount}/2 karakter)
              </div>
            )}
          </div>
        )}

        <div style={{
          fontSize: '12px',
          color: '#666',
          lineHeight: '1.4'
        }}>
          💡 İpucu: Partnerin Room ID'yi kopyalayıp "Odaya Gir" bölümünde kullanabilir<br/>
          Her iki karakter de oluşturulduğunda dashboard açılacak
        </div>
      </div>
    </div>
  );
};

export default PartnerInvite;
