import React, { useState, useEffect } from 'react';
import PixelCard from '../PixelCard';
import PixelButton from '../PixelButton';
import { adminSignOut } from '../../services/adminAuthService';
import { getRoomsData, getCharactersData, getPoopsData } from '../../services/adminDataService';

const AdminDashboard = ({ user, onLogout, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [rooms, setRooms] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [poops, setPoops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalCharacters: 0,
    totalPoops: 0,
    todayPoops: 0,
    activeUsers: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [roomsData, charactersData, poopsData] = await Promise.all([
        getRoomsData(),
        getCharactersData(),
        getPoopsData()
      ]);

      setRooms(roomsData);
      setCharacters(charactersData);
      setPoops(poopsData);

      // İstatistikleri hesapla
      const today = new Date().toISOString().split('T')[0];
      const todayPoops = poopsData.filter(poop => poop.date === today);
      
      const uniqueUsers = new Set(poopsData.map(poop => poop.characterId));
      
      setStats({
        totalRooms: roomsData.length,
        totalCharacters: charactersData.length,
        totalPoops: poopsData.length,
        todayPoops: todayPoops.length,
        activeUsers: uniqueUsers.size
      });
    } catch (error) {
      console.error('Dashboard verilerini yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await adminSignOut();
    onLogout();
  };

  const formatDate = (timestamp) => {
    try {
      if (!timestamp) return 'Tarih bilinmiyor';
      
      let date;
      if (timestamp instanceof Date) {
        date = timestamp;
      } else if (timestamp.toDate) {
        // Firestore Timestamp
        date = timestamp.toDate();
      } else {
        date = new Date(timestamp);
      }
      
      if (isNaN(date.getTime())) {
        return 'Geçersiz tarih';
      }
      
      return date.toLocaleString('tr-TR');
    } catch (error) {
      console.error('Tarih formatlama hatası:', error);
      return 'Tarih hatası';
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)'
      }}>
        <PixelCard style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#333' }}>
            📊 Dashboard yükleniyor...
          </div>
        </PixelCard>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div>
          <h1 style={{
            fontSize: '16px',
            color: '#fff',
            margin: 0,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🔐 Admin Dashboard
          </h1>
          <p style={{
            fontSize: '10px',
            color: '#fff',
            margin: '5px 0 0 0',
            opacity: 0.8
          }}>
            Hoş geldin, {user.email}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {onBack && (
            <PixelButton
              onClick={onBack}
              style={{
                backgroundColor: '#6c757d',
                borderColor: '#5a6268',
                color: '#fff',
                fontSize: '10px',
                padding: '10px 15px'
              }}
            >
              🏠 Ana Sayfa
            </PixelButton>
          )}
          <PixelButton
            onClick={handleLogout}
            style={{
              backgroundColor: '#dc3545',
              borderColor: '#c82333',
              color: '#fff',
              fontSize: '10px',
              padding: '10px 15px'
            }}
          >
            🚪 Çıkış
          </PixelButton>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '5px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'overview', name: '📊 Genel', icon: '📊' },
          { id: 'rooms', name: '🏠 Odalar', icon: '🏠' },
          { id: 'poops', name: '💩 Poops', icon: '💩' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 15px',
              fontSize: '10px',
              border: '2px solid #333',
              backgroundColor: activeTab === tab.id ? '#333' : '#fff',
              color: activeTab === tab.id ? '#fff' : '#333',
              cursor: 'pointer',
              borderRadius: '4px',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ fontSize: '14px', color: '#333', marginBottom: '20px' }}>
              📊 Genel İstatistikler
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              marginBottom: '20px'
            }}>
              <PixelCard style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>🏠</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff6b6b' }}>
                  {stats.totalRooms}
                </div>
                <div style={{ fontSize: '10px', color: '#666' }}>Toplam Oda</div>
              </PixelCard>
              
              <PixelCard style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>👤</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#4ecdc4' }}>
                  {stats.totalCharacters}
                </div>
                <div style={{ fontSize: '10px', color: '#666' }}>Toplam Karakter</div>
              </PixelCard>
              
              <PixelCard style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>💩</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffa726' }}>
                  {stats.totalPoops}
                </div>
                <div style={{ fontSize: '10px', color: '#666' }}>Toplam Poop</div>
              </PixelCard>
              
              <PixelCard style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>📅</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#66bb6a' }}>
                  {stats.todayPoops}
                </div>
                <div style={{ fontSize: '10px', color: '#666' }}>Bugünkü Poop</div>
              </PixelCard>
              
              <PixelCard style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>👥</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ab47bc' }}>
                  {stats.activeUsers}
                </div>
                <div style={{ fontSize: '10px', color: '#666' }}>Aktif Kullanıcı</div>
              </PixelCard>
            </div>

            <PixelCard>
              <h3 style={{ fontSize: '12px', marginBottom: '15px', color: '#333' }}>
                📈 Son Aktiviteler
              </h3>
              <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                {poops.slice(-10).reverse().map(poop => (
                  <div key={poop.id} style={{
                    padding: '10px',
                    borderBottom: '1px solid #eee',
                    fontSize: '9px'
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#333' }}>
                      {poop.characterName} - {poop.roomName}
                    </div>
                    <div style={{ color: '#666' }}>
                      {formatDate(poop.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            </PixelCard>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div>
            <h2 style={{ fontSize: '14px', color: '#333', marginBottom: '20px' }}>
              🏠 Oda Yönetimi
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '15px'
            }}>
              {rooms.map(room => {
                const roomCharacters = characters.filter(char => char.roomId === room.roomId);
                return (
                  <PixelCard key={room.id}>
                    <h3 style={{ fontSize: '12px', marginBottom: '10px', color: '#333' }}>
                      🏠 {room.name}
                    </h3>
                    <div style={{ fontSize: '9px', color: '#666', marginBottom: '10px' }}>
                      <div>ID: {room.id}</div>
                      <div>Oluşturulma: {formatDate(room.createdAt)}</div>
                      <div>Karakter Sayısı: {roomCharacters.length}</div>
                    </div>
                    
                    {roomCharacters.length > 0 && (
                      <div style={{ marginBottom: '10px' }}>
                        <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
                          👥 Odadaki Karakterler:
                        </div>
                        {roomCharacters.map(character => (
                          <div key={character.id} style={{
                            fontSize: '8px',
                            color: '#666',
                            backgroundColor: '#f8f9fa',
                            padding: '5px',
                            borderRadius: '3px',
                            marginBottom: '3px',
                            border: '1px solid #e9ecef'
                          }}>
                            <div style={{ fontWeight: 'bold', color: '#333' }}>
                              {character.emoji} {character.name}
                            </div>
                            <div>Cinsiyet: {character.gender === 'male' ? '👨 Erkek' : '👩 Kadın'}</div>
                            <div>Renk: <span style={{ color: character.color }}>●</span> {character.color}</div>
                            <div>Poop Sayısı: {character.poopCount || 0}</div>
                            <div>Oluşturulma: {formatDate(character.createdAt)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div style={{
                      fontSize: '8px',
                      color: '#999',
                      backgroundColor: '#f5f5f5',
                      padding: '5px',
                      borderRadius: '4px',
                      fontFamily: 'monospace'
                    }}>
                      {room.id}
                    </div>
                  </PixelCard>
                );
              })}
            </div>
          </div>
        )}


        {activeTab === 'poops' && (
          <div>
            <h2 style={{ fontSize: '14px', color: '#333', marginBottom: '20px' }}>
              💩 Poop Geçmişi
            </h2>
            
            {/* İstatistikler */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <PixelCard style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', marginBottom: '5px' }}>💩</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ff6b6b' }}>
                  {poops.length}
                </div>
                <div style={{ fontSize: '8px', color: '#666' }}>Toplam Poop</div>
              </PixelCard>
              
              <PixelCard style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', marginBottom: '5px' }}>📅</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#4ecdc4' }}>
                  {stats.todayPoops}
                </div>
                <div style={{ fontSize: '8px', color: '#666' }}>Bugünkü Poop</div>
              </PixelCard>
              
              <PixelCard style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', marginBottom: '5px' }}>📊</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffa726' }}>
                  {poops.length > 0 ? (poops.length / stats.totalCharacters).toFixed(1) : 0}
                </div>
                <div style={{ fontSize: '8px', color: '#666' }}>Karakter Başına Ort.</div>
              </PixelCard>
            </div>

            {/* Poop Listesi */}
            <PixelCard>
              <h3 style={{ fontSize: '12px', marginBottom: '15px', color: '#333' }}>
                📜 Tüm Poop Kayıtları
              </h3>
              <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                {poops.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    color: '#666',
                    fontSize: '10px',
                    padding: '40px'
                  }}>
                    Henüz poop kaydı bulunmuyor
                  </div>
                ) : (
                  poops.slice().reverse().map(poop => (
                    <div key={poop.id} style={{
                      padding: '12px',
                      borderBottom: '1px solid #eee',
                      fontSize: '9px',
                      backgroundColor: '#fafafa',
                      marginBottom: '5px',
                      borderRadius: '4px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginBottom: '8px' 
                      }}>
                        <div style={{ fontSize: '16px' }}>
                          {poop.characterEmoji || '👤'}
                        </div>
                        <div style={{ fontWeight: 'bold', color: '#333' }}>
                          {poop.characterName || 'Bilinmeyen Karakter'}
                        </div>
                        <div style={{ color: '#666', fontSize: '8px' }}>
                          - {poop.roomName || 'Bilinmeyen Oda'}
                        </div>
                      </div>
                      
                      <div style={{ color: '#666', marginBottom: '5px' }}>
                        📅 Tarih: {poop.date} 
                        <span style={{ marginLeft: '10px' }}>
                          🕐 Saat: {formatDate(poop.timestamp)}
                        </span>
                      </div>
                      
                      <div style={{ 
                        fontSize: '8px', 
                        color: '#888',
                        marginBottom: '5px'
                      }}>
                        Cinsiyet: {poop.characterGender === 'male' ? '👨 Erkek' : poop.characterGender === 'female' ? '👩 Kadın' : '❓ Bilinmeyen'} | 
                        Renk: <span style={{ color: poop.characterColor }}>●</span> {poop.characterColor}
                      </div>
                      
                      <div style={{
                        fontSize: '7px',
                        color: '#999',
                        backgroundColor: '#f0f0f0',
                        padding: '3px',
                        borderRadius: '3px',
                        fontFamily: 'monospace',
                        wordBreak: 'break-all'
                      }}>
                        ID: {poop.id}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PixelCard>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
