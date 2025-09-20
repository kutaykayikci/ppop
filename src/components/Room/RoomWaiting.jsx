import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { getRoomById, joinRoomWithUser } from '@/services/roomService';
import PixelButton from '@/components/PixelButton';
import PixelCard from '@/components/PixelCard';

const RoomWaiting = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppStore();
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isRoomCreator, setIsRoomCreator] = useState(false);
  const [isUserInRoom, setIsUserInRoom] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/');
      return;
    }
    
    loadRoom();
  }, [roomId, user, isAuthenticated]);

  const loadRoom = async () => {
    try {
      console.log('RoomWaiting: Yüklenen room ID:', roomId)
      const roomData = await getRoomById(roomId);
      console.log('RoomWaiting: Bulunan room data:', roomData)
      if (!roomData) {
        setError('Oda bulunamadi');
        return;
      }

      setRoom(roomData);
      
      // Kullanıcı bu odada mı kontrol et
      const userInRoom = roomData.users?.find(u => u.uid === user.uid);
      setIsUserInRoom(!!userInRoom);
      
      // Kullanıcı oda sahibi mi kontrol et
      setIsRoomCreator(userInRoom?.isCreator || false);
      
      // Kullanıcı odada değilse - Manuel katılım gerekir (otomatik katılma kaldırıldı)
      if (!userInRoom) {
        console.log('Kullanıcı odada değil, manuel katılım gerekiyor');
      }

      // Oda dolu mu kontrol et - eğer doluysa dashboard'a git
      if (roomData.users?.length >= roomData.maxUsers) {
        navigate(`/dashboard/${roomId}`);
        return;
      }

    } catch (error) {
      console.error('Oda yükleme hatası:', error);
      setError('Oda bilgileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinRoom = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      await joinRoomWithUser(roomId, user.uid, user?.displayName || 'User');
      // Odayı yeniden yükle
      const updatedRoom = await getRoomById(roomId);
      setRoom(updatedRoom);
      setIsUserInRoom(true);
    } catch (joinError) {
      console.error('Odaya katılma hatası:', joinError);
      setError('Odaya katılamadı: ' + joinError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = () => {
    if (room?.users?.length >= 2) {
      navigate(`/rooms/${roomId}/characters`);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <PixelCard>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2>🔄 Oda bilgileri yükleniyor...</h2>
          </div>
        </PixelCard>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <PixelCard>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2>❌ Hata</h2>
            <p style={{ color: '#666', marginTop: '10px' }}>{error}</p>
            <PixelButton 
              onClick={() => navigate('/')}
              style={{ marginTop: '20px' }}
            >
              Ana Sayfaya Dön
            </PixelButton>
          </div>
        </PixelCard>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <PixelCard style={{ maxWidth: '600px', width: '100%' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>
            🏠 {room?.name}
          </h1>
          
          {/* Kullanıcı durumuna göre başlık */}
          {!isUserInRoom && (
            <div style={{
              background: '#fff3cd',
              border: '2px solid #ffc107',
              borderRadius: '8px',
              padding: '15px',
              margin: '15px 0'
            }}>
              <h3>🚪 Odaya Katılmak İster Misin?</h3>
              <p>Bu odaya henüz katılmadın. Katılmak için butona tıkla!</p>
            </div>
          )}
          
          {isUserInRoom && isRoomCreator && (
            <div style={{
              background: '#e3f2fd',
              border: '2px solid #1976d2',
              borderRadius: '8px',
              padding: '15px',
              margin: '15px 0'
            }}>
              <h3>👑 Oda Sahibi</h3>
              <p>Arkadaşlarını davet et ve oyunu başlat!</p>
            </div>
          )}
          
          {isUserInRoom && !isRoomCreator && (
            <div style={{
              background: '#d4edda',
              border: '2px solid #28a745',
              borderRadius: '8px',
              padding: '15px',
              margin: '15px 0'
            }}>
              <h3>✅ Odaya Katıldın</h3>
              <p>Diğer oyuncuları bekle veya oda sahibinin oyunu başlatmasını bekle!</p>
            </div>
          )}
          
          <div style={{
            background: '#f8f9fa',
            border: '2px solid #333',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0'
          }}>
            <h3>📋 Oda Bilgileri</h3>
            <div style={{ margin: '15px 0' }}>
              <strong>Oda ID:</strong> 
              <span 
                style={{ 
                  marginLeft: '10px',
                  padding: '5px 10px',
                  background: '#e9ecef',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  cursor: 'pointer'
                }}
                onClick={copyRoomId}
                title="Kopyalamak için tıkla"
              >
                {roomId} {copied ? '✅' : '📋'}
              </span>
            </div>
            <div>
              <strong>Oyuncular:</strong> {room?.users?.length || 0} / {room?.maxUsers ?? 5}
            </div>
          </div>

          <div style={{
            background: '#e3f2fd',
            border: '2px solid #1976d2',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0'
          }}>
            <h3>👥 Mevcut Oyuncular</h3>
            {room?.users?.map((player, index) => (
              <div key={player.uid} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px',
                margin: '5px 0',
                background: '#fff',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
                <span>
                  {player.isCreator ? '👑' : '👤'} {player.displayName}
                </span>
                {player.isCreator && (
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    Oda Sahibi
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Oyuncu durumu - sadece odada olanlar için göster */}
          {isUserInRoom && (
            <>
              {room?.users?.length < 2 ? (
                <div style={{
                  background: '#fff3cd',
                  border: '2px solid #ffc107',
                  borderRadius: '8px',
                  padding: '20px',
                  margin: '20px 0'
                }}>
                  <h3>⏳ Daha Fazla Oyuncu Gerekli</h3>
                  <p>En az 2 oyuncu olduğunda oyun başlatılabilir.</p>
                  {isRoomCreator && (
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      Arkadaşlarınla Oda ID'sini paylaş!
                    </p>
                  )}
                </div>
              ) : isRoomCreator ? (
                <div style={{
                  background: '#d4edda',
                  border: '2px solid #28a745',
                  borderRadius: '8px',
                  padding: '20px',
                  margin: '20px 0'
                }}>
                  <h3>✅ Hazır!</h3>
                  <p>Yeterli oyuncu var, oyunu başlatabilirsin!</p>
                </div>
              ) : (
                <div style={{
                  background: '#e3f2fd',
                  border: '2px solid #1976d2',
                  borderRadius: '8px',
                  padding: '20px',
                  margin: '20px 0'
                }}>
                  <h3>⏳ Oda Sahibini Bekle</h3>
                  <p>Oda sahibi oyunu başlatacak, hazır ol!</p>
                </div>
              )}
            </>
          )}

          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '30px'
          }}>
            <PixelButton 
              onClick={() => navigate('/')}
              variant="secondary"
            >
              ← Ana Sayfa
            </PixelButton>
            
            {/* Kullanıcı odada değilse - Katıl butonu göster */}
            {!isUserInRoom && (
              <PixelButton 
                onClick={handleJoinRoom}
                variant="primary"
                style={{ fontSize: '16px', padding: '15px 30px' }}
                disabled={loading}
              >
                {loading ? '⏳ Katılıyor...' : '🚪 Odaya Katıl'}
              </PixelButton>
            )}
            
            {/* Kullanıcı odada ise - ID kopyala ve oyun başlat butonları */}
            {isUserInRoom && (
              <>
                <PixelButton 
                  onClick={copyRoomId}
                  variant="secondary"
                >
                  {copied ? '✅ Kopyalandı' : '📋 ID Kopyala'}
                </PixelButton>

                {/* Sadece oda sahibi ve yeterli oyuncu varsa oyun başlatabilir */}
                {isRoomCreator && room?.users?.length >= 2 && (
                  <PixelButton 
                    onClick={handleStartGame}
                    variant="primary"
                    style={{ fontSize: '16px', padding: '15px 30px' }}
                  >
                    🎮 Oyunu Başlat
                  </PixelButton>
                )}
              </>
            )}
          </div>
        </div>
      </PixelCard>
    </div>
  );
};

export default RoomWaiting;
