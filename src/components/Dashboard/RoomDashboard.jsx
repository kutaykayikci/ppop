import React, { useState, useEffect } from 'react';
import { getRoomCharacters } from '../../services/characterService';
import { getRoomProfiles } from '../../services/profileService';
import { getPoopsByDateRange } from '../../firebase/poopService';
import PoopCounter from '../PoopCounter';
import PixelButton from '../PixelButton';

const RoomDashboard = ({ room }) => {
  const [characters, setCharacters] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [stats, setStats] = useState({
    today: {},
    week: {},
    month: {},
    total: {}
  });
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoomData();
  }, [room.id]);

  useEffect(() => {
    if (characters.length > 0 && profiles.length > 0) {
      loadStatistics();
    }
  }, [selectedPeriod, characters, profiles]);

  const loadRoomData = async () => {
    try {
      setLoading(true);
      const [charactersData, profilesData] = await Promise.all([
        getRoomCharacters(room.id),
        getRoomProfiles(room.id)
      ]);
      
      setCharacters(charactersData);
      setProfiles(profilesData);
    } catch (error) {
      console.error('Room verilerini yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      let startDate, endDate;

      switch (selectedPeriod) {
        case 'today':
          startDate = endDate = today;
          break;
        case 'week':
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - 7);
          startDate = weekStart.toISOString().split('T')[0];
          endDate = today;
          break;
        case 'month':
          const monthStart = new Date();
          monthStart.setDate(1); // Ayın ilk günü
          startDate = monthStart.toISOString().split('T')[0];
          endDate = today;
          break;
        case 'total':
          startDate = '2024-01-01'; // Başlangıç tarihi
          endDate = today;
          break;
        default:
          startDate = endDate = today;
      }

      console.log(`${selectedPeriod} istatistikleri yükleniyor:`, { startDate, endDate });
      const poops = await getPoopsByDateRange(room.id, startDate, endDate);
      console.log('Firestore\'dan gelen poop verileri:', poops);
      
      // Karakter bazında istatistik hesapla
      const newStats = {};
      characters.forEach(character => {
        const characterPoops = poops.filter(poop => poop.characterId === character.id);
        newStats[character.id] = characterPoops.length;
      });

      setStats(prev => ({
        ...prev,
        [selectedPeriod]: newStats
      }));
    } catch (error) {
      console.error('İstatistik yükleme hatası:', error);
    }
  };

  const getPeriodTitle = () => {
    switch (selectedPeriod) {
      case 'today': return 'Bugün';
      case 'week': return 'Bu Hafta';
      case 'month': 
        const monthNames = [
          'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
          'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        const currentMonth = monthNames[new Date().getMonth()];
        return currentMonth;
      case 'total': return 'Toplam';
      default: return 'Bugün';
    }
  };

  const getWinner = () => {
    const currentStats = stats[selectedPeriod];
    const characterStats = characters.map(character => ({
      character,
      count: currentStats[character.id] || 0
    }));

    characterStats.sort((a, b) => b.count - a.count);
    
    if (characterStats.length === 0) {
      return { name: 'Henüz veri yok', count: 0, emoji: '📊' };
    }
    
    if (characterStats.length === 1) {
      return { 
        name: characterStats[0].character.name, 
        count: characterStats[0].count, 
        emoji: characterStats[0].character.emoji 
      };
    }
    
    if (characterStats[0].count === characterStats[1].count && characterStats[0].count > 0) {
      return { name: 'Berabere', count: characterStats[0].count, emoji: '🤝' };
    }
    
    return { 
      name: characterStats[0].character.name, 
      count: characterStats[0].count, 
      emoji: characterStats[0].character.emoji 
    };
  };

  const getUserProfile = (characterId) => {
    return profiles.find(profile => profile.characterId === characterId);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0'
      }}>
        <div style={{
          backgroundColor: '#fff',
          border: '3px solid #333',
          borderRadius: '8px',
          padding: '30px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '20px' }}>⏳</div>
          <div>Room verileri yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '0' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#fff',
        borderBottom: '3px solid #333',
        padding: '15px 20px',
        textAlign: 'center',
        boxShadow: '0 4px 0px rgba(0, 0, 0, 0.2)'
      }}>
        <h1 style={{
          fontSize: '18px',
          color: '#333',
          margin: '0',
          textShadow: '2px 2px 0px rgba(0, 0, 0, 0.1)'
        }}>
          💩 Poop Count - {room.name} 💩
        </h1>
        <div style={{
          fontSize: '14px',
          color: '#333',
          marginTop: '5px',
          fontWeight: 'bold',
          backgroundColor: '#f0f0f0',
          padding: '5px 10px',
          borderRadius: '4px',
          border: '2px solid #333',
          display: 'inline-block'
        }}>
          Room ID: {room.id}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '0', flex: 1 }}>
        {/* Poop Counters */}
        <div className="user-grid">
          {characters.map(character => {
            const profile = getUserProfile(character.id);
            const userColor = {
              background: character.gender === 'male' ? '#e6f7ff' : '#ffe6f2',
              border: character.color,
              text: character.color,
              button: character.color,
              buttonBorder: character.color
            };
            
            return (
              <PoopCounter 
                key={character.id}
                character={character}
                profile={profile}
                userColor={userColor}
                roomId={room.id}
              />
            );
          })}
        </div>

        {/* Statistics */}
        <div style={{ 
          backgroundColor: '#fff',
          border: '3px solid #333',
          borderRadius: '8px',
          boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.2)',
          margin: '20px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            color: '#333',
            marginBottom: '20px',
            fontSize: '16px'
          }}>
            📊 İstatistikler
          </h2>

          <div style={{ marginBottom: '20px' }}>
            {['today', 'week', 'month', 'total'].map(period => (
              <PixelButton
                key={period}
                onClick={() => setSelectedPeriod(period)}
                variant={selectedPeriod === period ? 'primary' : 'secondary'}
                size="sm"
                style={{ margin: '0 5px' }}
              >
                {period === 'today' ? 'Bugün' : 
                 period === 'week' ? 'Hafta' : 
                 period === 'month' ? getPeriodTitle() : 'Toplam'}
              </PixelButton>
            ))}
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: characters.length === 1 ? '1fr' : '1fr 1fr',
            gap: '20px',
            marginBottom: '20px'
          }}>
            {characters.map(character => {
              const profile = getUserProfile(character.id);
              const count = stats[selectedPeriod][character.id] || 0;
              
              return (
                <div key={character.id} style={{
                  backgroundColor: character.color,
                  color: '#fff',
                  padding: '15px',
                  borderRadius: '8px',
                  border: `3px solid ${character.color}`
                }}>
                  <div style={{ fontSize: '12px', marginBottom: '5px' }}>
                    {character.name} {character.emoji}
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {count}
                  </div>
                  {profile && (
                    <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '5px' }}>
                      {profile.firstName} {profile.lastName}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{
            backgroundColor: '#f0f0f0',
            padding: '15px',
            borderRadius: '8px',
            border: '3px solid #ddd'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '5px' }}>
              {getPeriodTitle()} Kazananı:
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {getWinner().emoji} {getWinner().name}
            </div>
            {getWinner().name !== 'Berabere' && getWinner().count > 0 && (
              <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '5px' }}>
                {getWinner().count} poop ile! 🏆
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#333',
        color: '#fff',
        textAlign: 'center',
        padding: '10px',
        fontSize: '8px',
        borderTop: '3px solid #000'
      }}>
        <div>💕 Sevgililer için özel olarak tasarlandı 💕</div>
        <div style={{ marginTop: '5px', opacity: 0.7 }}>
          Her poop anı değerlidir! 🎉
        </div>
      </footer>
    </div>
  );
};

export default RoomDashboard;
