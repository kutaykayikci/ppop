import React, { useState, useEffect } from 'react';
import PixelCard from '../PixelCard';
import PixelButton from '../PixelButton';
import { adminSignOut } from '../../services/adminAuthService';
import { getRoomsData, getCharactersData, getPoopsData } from '../../services/adminDataService';
import PushManager from './PushManager';

const AdminDashboard = ({ user, onLogout }) => {
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
    return new Date(timestamp).toLocaleString('tr-TR');
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
          { id: 'characters', name: '👤 Karakterler', icon: '👤' },
          { id: 'poops', name: '💩 Poops', icon: '💩' },
          { id: 'push', name: '📱 Push', icon: '📱' }
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '15px'
            }}>
              {rooms.map(room => (
                <PixelCard key={room.id}>
                  <h3 style={{ fontSize: '12px', marginBottom: '10px', color: '#333' }}>
                    🏠 {room.name}
                  </h3>
                  <div style={{ fontSize: '9px', color: '#666', marginBottom: '10px' }}>
                    <div>ID: {room.id}</div>
                    <div>Oluşturulma: {formatDate(room.createdAt)}</div>
                    <div>Karakter Sayısı: {room.characterCount || 0}</div>
                  </div>
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
              ))}
            </div>
          </div>
        )}

        {activeTab === 'characters' && (
          <div>
            <h2 style={{ fontSize: '14px', color: '#333', marginBottom: '20px' }}>
              👤 Karakter Yönetimi
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '15px'
            }}>
              {characters.map(character => (
                <PixelCard key={character.id}>
                  <h3 style={{ fontSize: '12px', marginBottom: '10px', color: '#333' }}>
                    {character.emoji} {character.name}
                  </h3>
                  <div style={{ fontSize: '9px', color: '#666', marginBottom: '10px' }}>
                    <div>Oda: {character.roomName}</div>
                    <div>Oluşturulma: {formatDate(character.createdAt)}</div>
                    <div>Poop Sayısı: {character.poopCount || 0}</div>
                  </div>
                  <div style={{
                    fontSize: '8px',
                    color: '#999',
                    backgroundColor: '#f5f5f5',
                    padding: '5px',
                    borderRadius: '4px',
                    fontFamily: 'monospace'
                  }}>
                    {character.id}
                  </div>
                </PixelCard>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'poops' && (
          <div>
            <h2 style={{ fontSize: '14px', color: '#333', marginBottom: '20px' }}>
              💩 Poop Geçmişi
            </h2>
            <PixelCard>
              <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                {poops.map(poop => (
                  <div key={poop.id} style={{
                    padding: '10px',
                    borderBottom: '1px solid #eee',
                    fontSize: '9px'
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
                      {poop.characterName} - {poop.roomName}
                    </div>
                    <div style={{ color: '#666', marginBottom: '5px' }}>
                      Tarih: {poop.date} - {formatDate(poop.timestamp)}
                    </div>
                    <div style={{
                      fontSize: '8px',
                      color: '#999',
                      backgroundColor: '#f5f5f5',
                      padding: '3px',
                      borderRadius: '3px',
                      fontFamily: 'monospace'
                    }}>
                      {poop.id}
                    </div>
                  </div>
                ))}
              </div>
            </PixelCard>
          </div>
        )}

        {activeTab === 'push' && (
          <PushManager />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
