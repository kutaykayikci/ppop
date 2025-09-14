import React, { useState, useEffect } from 'react';
import { getRoomCharacters } from '../../services/characterService';
import { getRoomProfiles } from '../../services/profileService';
import { getPoopsByDateRange } from '../../firebase/poopService';
import { calculateRoomStatistics, getComparativeStatistics } from '../../services/roomStatisticsService';
import PoopCounter from '../PoopCounter';
import PixelButton from '../PixelButton';
import soundService from '../../services/soundService';

const RoomDashboard = ({ room, onBack }) => {
  const [characters, setCharacters] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [stats, setStats] = useState({
    today: {},
    yesterday: {},
    week: {},
    month: {},
    total: {}
  });
  const [extraStats, setExtraStats] = useState({});
  const [comparativeStats, setComparativeStats] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [loading, setLoading] = useState(true);
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    loadRoomData();
  }, [room.id]);

  useEffect(() => {
    if (characters.length > 0) {
      loadStatistics();
    }
  }, [characters, selectedPeriod]);

  // Animasyonlu efektleri başlat
  useEffect(() => {
    // Floating emojiler oluştur - çok daha fazla emoji ve çeşitlilik ile
    const emojis = [
      '💩', '🚽', '🧻', '🪠', '💧', '🌟', '✨', '🎉', '💫', '🌈', '🎊', '🎈',
      '🎭', '🎨', '🎪', '🎯', '🎲', '🎸', '🎹', '🎺', '🎻', '🎼', '🎵', '🎶',
      '🏆', '🏅', '🏆', '🥇', '🥈', '🥉', '🏅', '🏆', '🎖️', '🏅', '🏆', '🏅',
      '💎', '💍', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎',
      '🌺', '🌻', '🌼', '🌷', '🌸', '🌹', '🌻', '🌺', '🌼', '🌷', '🌸', '🌹',
      '🦋', '🐝', '🦋', '🐝', '🦋', '🐝', '🦋', '🐝', '🦋', '🐝', '🦋', '🐝',
      '🍀', '🌿', '🍀', '🌿', '🍀', '🌿', '🍀', '🌿', '🍀', '🌿', '🍀', '🌿',
      '⭐', '🌟', '⭐', '🌟', '⭐', '🌟', '⭐', '🌟', '⭐', '🌟', '⭐', '🌟',
      '💖', '💕', '💖', '💕', '💖', '💕', '💖', '💕', '💖', '💕', '💖', '💕',
      '🎈', '🎊', '🎈', '🎊', '🎈', '🎊', '🎈', '🎊', '🎈', '🎊', '🎈', '🎊',
      '🔥', '💪', '🏃', '💨', '⚡', '🌪️', '🔥', '💪', '🏃', '💨', '⚡', '🌪️',
      '🎊', '🎉', '🎊', '🎉', '🎊', '🎉', '🎊', '🎉', '🎊', '🎉', '🎊', '🎉'
    ];
    const animationTypes = ['delayed', 'spiral', 'bounce', 'wave'];
    const floatingEmojisArray = [];
    
    // Çok daha fazla emoji oluştur (20-25 adet)
    for (let i = 0; i < 24; i++) {
      floatingEmojisArray.push({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 10,
        animationType: animationTypes[Math.floor(Math.random() * animationTypes.length)]
      });
    }
    
    setFloatingEmojis(floatingEmojisArray);

    // Mouse takip efekti
    const handleMouseMove = (e) => {
      // Rastgele parçacık oluştur
      if (Math.random() < 0.05) {
        createParticle(e.clientX, e.clientY);
      }
    };

    const createParticle = (x, y) => {
      const particleTypes = ['sparkle', 'trail'];
      const newParticle = {
        id: Date.now() + Math.random(),
        x: x,
        y: y,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        type: particleTypes[Math.floor(Math.random() * particleTypes.length)]
      };
      
      setParticles(prev => [...prev, newParticle]);
      
      // Parçacığı 4-5 saniye sonra temizle
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 4000 + Math.random() * 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (characters.length > 0) {
      loadAllStatistics();
    }
  }, [characters, room.id]);

  useEffect(() => {
    if (characters.length > 0) {
      loadStatistics();
    }
  }, [selectedPeriod, characters, room.id]);

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

  const loadAllStatistics = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Bugün için verileri yükle
      const todayPoops = await getPoopsByDateRange(room.id, today, today);
      
      // Bugün için istatistik hesapla
      const todayStats = {};
      characters.forEach(character => {
        const characterPoops = todayPoops.filter(poop => poop.characterId === character.id);
        todayStats[character.id] = characterPoops.length;
      });
      
      setStats(prev => ({
        ...prev,
        today: todayStats
      }));
    } catch (error) {
      console.error('Tüm istatistik yükleme hatası:', error);
    }
  };

  const loadStatistics = async () => {
    try {
      // Yeni istatistik servisini kullan
      const statistics = await calculateRoomStatistics(room.id, characters, selectedPeriod);
      
      // Karakter bazında istatistikleri ayarla
      const characterStats = {};
      characters.forEach(character => {
        characterStats[character.id] = statistics.characterStats[character.id]?.count || 0;
      });

      setStats(prev => ({
        ...prev,
        [selectedPeriod]: characterStats
      }));

      // Ekstra istatistikleri ayarla
      setExtraStats(statistics.extraStats);

      // Karşılaştırmalı istatistikleri yükle (hafta ve ay için)
      if (selectedPeriod === 'week' || selectedPeriod === 'month') {
        const comparativeData = await getComparativeStatistics(room.id, characters, selectedPeriod);
        setComparativeStats(comparativeData);
      } else {
        setComparativeStats(null);
      }

    } catch (error) {
      console.error('İstatistik yükleme hatası:', error);
      // Hata durumunda 0 değerleri ata
      const errorStats = {};
      characters.forEach(character => {
        errorStats[character.id] = 0;
      });
      setStats(prev => ({
        ...prev,
        [selectedPeriod]: errorStats
      }));
      setExtraStats({});
      setComparativeStats(null);
    }
  };

  const getPeriodTitle = () => {
    switch (selectedPeriod) {
      case 'today': return 'Bugün';
      case 'yesterday': return 'Dün';
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

  const handlePoopAdded = () => {
    // Yeni poop eklendiğinde istatistikleri yenile
    loadStatistics();
  };

  if (loading) {
    return (
      <div 
        className="animated-gradient"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Floating Emojiler */}
        {floatingEmojis.map(emoji => (
          <div
            key={emoji.id}
            className={`floating-emoji ${emoji.delay > 3 ? 'delayed' : ''}`}
            style={{
              left: `${emoji.left}%`,
              top: `${emoji.top}%`,
              animationDelay: `${emoji.delay}s`
            }}
          >
            {emoji.emoji}
          </div>
        ))}

        <div 
          className="tilt-card"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '3px solid #333',
            borderRadius: '8px',
            padding: '30px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            zIndex: 10
          }}
        >
          <div className="loading-emoji" style={{ fontSize: '32px', marginBottom: '20px' }}>⏳</div>
          <div className="loading-text">Room verileri yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="animated-gradient"
      style={{ 
        minHeight: '100vh', 
        padding: '0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Floating Emojiler */}
      {floatingEmojis.map(emoji => (
        <div
          key={emoji.id}
          className={`floating-emoji ${emoji.animationType}`}
          style={{
            left: `${emoji.left}%`,
            top: `${emoji.top}%`,
            animationDelay: `${emoji.delay}s`,
            zIndex: 1
          }}
        >
          {emoji.emoji}
        </div>
      ))}

      {/* Mouse Takip Parçacıkları */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`particle ${particle.type}`}
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            zIndex: 2
          }}
        />
      ))}
      {/* Header */}
      <header style={{
        backgroundColor: '#fff',
        borderBottom: '3px solid #333',
        padding: '15px 20px',
        textAlign: 'center',
        boxShadow: '0 4px 0px rgba(0, 0, 0, 0.2)',
        position: 'relative'
      }}>
        {/* Ana Sayfa Butonu */}
        <div style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)'
        }}>
          <PixelButton
            onClick={() => {
              soundService.playClick();
              onBack();
            }}
            variant="secondary"
            size="sm"
            className="glow-effect"
          >
            🏠 Ana Sayfa
          </PixelButton>
        </div>

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
                onPoopAdded={handlePoopAdded}
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
            {['today', 'yesterday', 'week', 'month', 'total'].map(period => (
              <PixelButton
                key={period}
                onClick={() => {
                  soundService.playClick();
                  setSelectedPeriod(period);
                }}
                variant={selectedPeriod === period ? 'primary' : 'secondary'}
                size="sm"
                style={{ margin: '0 5px' }}
                className="glow-effect"
              >
                {period === 'today' ? 'Bugün' : 
                 period === 'yesterday' ? 'Dün' :
                 period === 'week' ? 'Hafta' : 
                 period === 'month' ? (() => {
                   const monthNames = [
                     'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                     'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
                   ];
                   return monthNames[new Date().getMonth()];
                 })() : 'Toplam'}
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
              const currentStats = stats[selectedPeriod] || {};
              const count = currentStats[character.id] || 0;
              
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
            border: '3px solid #ddd',
            marginBottom: '15px'
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

          {/* Ekstra İstatistikler */}
          {extraStats && Object.keys(extraStats).length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '10px',
              marginBottom: '15px'
            }}>
              {/* Günlük Ortalama */}
              {extraStats.dailyAverage !== undefined && (
                <div style={{
                  backgroundColor: '#e8f5e8',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '2px solid #4caf50',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: '#2e7d32', marginBottom: '3px' }}>
                    📊 Günlük Ortalama
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1b5e20' }}>
                    {extraStats.dailyAverage}
                  </div>
                </div>
              )}

              {/* En Aktif Karakter */}
              {extraStats.mostActiveCharacter && (
                <div style={{
                  backgroundColor: '#fff3e0',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '2px solid #ff9800',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: '#e65100', marginBottom: '3px' }}>
                    🏆 En Aktif
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#bf360c' }}>
                    {extraStats.mostActiveCharacter.emoji} {extraStats.mostActiveCharacter.name}
                  </div>
                  <div style={{ fontSize: '10px', color: '#d84315' }}>
                    {extraStats.mostActiveCharacter.count} poop
                  </div>
                </div>
              )}

              {/* En Aktif Gün */}
              {extraStats.mostActiveDay && extraStats.mostActiveDay[0] !== 'Henüz yok' && (
                <div style={{
                  backgroundColor: '#e3f2fd',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '2px solid #2196f3',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: '#1565c0', marginBottom: '3px' }}>
                    📅 En Aktif Gün
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0d47a1' }}>
                    {new Date(extraStats.mostActiveDay[0]).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                  </div>
                  <div style={{ fontSize: '10px', color: '#1976d2' }}>
                    {extraStats.mostActiveDay[1]} poop
                  </div>
                </div>
              )}

              {/* Streak Bilgisi */}
              {extraStats.streakInfo && (extraStats.streakInfo.current > 0 || extraStats.streakInfo.longest > 0) && (
                <div style={{
                  backgroundColor: '#fce4ec',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '2px solid #e91e63',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: '#c2185b', marginBottom: '3px' }}>
                    🔥 Streak
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#880e4f' }}>
                    Mevcut: {extraStats.streakInfo.current} gün
                  </div>
                  <div style={{ fontSize: '10px', color: '#ad1457' }}>
                    En uzun: {extraStats.streakInfo.longest} gün
                  </div>
                </div>
              )}


              {/* Aktif Gün Sayısı */}
              {extraStats.activeDays !== undefined && extraStats.totalDays !== undefined && (
                <div style={{
                  backgroundColor: '#e0f2f1',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '2px solid #009688',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: '#00695c', marginBottom: '3px' }}>
                    📈 Aktivite Oranı
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#004d40' }}>
                    {Math.round((extraStats.activeDays / extraStats.totalDays) * 100)}%
                  </div>
                  <div style={{ fontSize: '10px', color: '#00796b' }}>
                    {extraStats.activeDays}/{extraStats.totalDays} gün
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Karşılaştırmalı İstatistikler */}
          {comparativeStats && comparativeStats.comparison && (
            <div style={{
              backgroundColor: '#fff8e1',
              padding: '15px',
              borderRadius: '8px',
              border: '3px solid #ffc107'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: '#f57f17' }}>
                📊 Önceki Dönemle Karşılaştırma
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#e65100', marginBottom: '3px' }}>
                    Toplam Değişim
                  </div>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: 'bold',
                    color: comparativeStats.comparison.totalChange >= 0 ? '#2e7d32' : '#d32f2f'
                  }}>
                    {comparativeStats.comparison.totalChange >= 0 ? '+' : ''}{comparativeStats.comparison.totalChange}
                  </div>
                  <div style={{ fontSize: '10px', color: '#bf360c' }}>
                    ({comparativeStats.comparison.totalChangePercent >= 0 ? '+' : ''}{comparativeStats.comparison.totalChangePercent}%)
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#e65100', marginBottom: '3px' }}>
                    Günlük Ortalama Değişim
                  </div>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: 'bold',
                    color: comparativeStats.comparison.dailyAverageChange >= 0 ? '#2e7d32' : '#d32f2f'
                  }}>
                    {comparativeStats.comparison.dailyAverageChange >= 0 ? '+' : ''}{comparativeStats.comparison.dailyAverageChange}
                  </div>
                </div>
              </div>
            </div>
          )}
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
