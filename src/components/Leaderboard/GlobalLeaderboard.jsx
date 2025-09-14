import React, { useState, useEffect } from 'react';
import PixelCard from '../PixelCard';
import PixelButton from '../PixelButton';
import { getGlobalLeaderboard, getUserGlobalRank } from '../../services/leaderboardService';

const GlobalLeaderboard = ({ roomId, characterId, onClose }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeframe, setTimeframe] = useState('all');
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLeaderboard();
    if (roomId && characterId) {
      loadUserRank();
    }
  }, [timeframe, roomId, characterId]);

  const loadLeaderboard = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getGlobalLeaderboard(timeframe);
      
      if (result.success) {
        setLeaderboard(result.leaderboard);
      } else {
        setError(result.error || 'Liderlik tablosu yüklenemedi');
      }
    } catch (error) {
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const loadUserRank = async () => {
    try {
      const result = await getUserGlobalRank(roomId, characterId);
      if (result.success) {
        setUserRank(result);
      }
    } catch (error) {
      console.error('Kullanıcı sıralaması yükleme hatası:', error);
    }
  };

  const getTimeframeText = (timeframe) => {
    switch (timeframe) {
      case 'today': return 'Bugün';
      case 'week': return 'Bu Hafta';
      case 'month': return 'Bu Ay';
      default: return 'Tüm Zamanlar';
    }
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return '#FFD700'; // Altın
    if (rank === 2) return '#C0C0C0'; // Gümüş
    if (rank === 3) return '#CD7F32'; // Bronz
    return '#333';
  };

  const formatLastPoop = (lastPoopTime) => {
    if (!lastPoopTime) return 'Bilinmiyor';
    
    const now = new Date();
    const poopTime = new Date(lastPoopTime);
    const diffHours = Math.floor((now - poopTime) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Az önce';
    if (diffHours < 24) return `${diffHours} saat önce`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} gün önce`;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '20px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: '3px solid #333',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '2px solid #eee'
        }}>
          <h2 style={{ 
            color: '#333', 
            margin: 0,
            fontSize: '24px',
            textShadow: '2px 2px 0px rgba(0, 0, 0, 0.1)'
          }}>
            🏆 Global Liderlik Tablosu
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px',
              borderRadius: '4px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ✕
          </button>
        </div>

        {/* Timeframe Selector */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          {['all', 'today', 'week', 'month'].map((tf) => (
            <PixelButton
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                backgroundColor: timeframe === tf ? '#ff6b6b' : '#6c757d',
                color: '#fff',
                padding: '8px 16px',
                fontSize: '14px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {getTimeframeText(tf)}
            </PixelButton>
          ))}
        </div>

        {/* User Rank */}
        {userRank && userRank.rank && (
          <div style={{
            backgroundColor: '#e3f2fd',
            border: '2px solid #2196f3',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>
              🎯 Senin Sıralaman
            </h3>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1976d2' }}>
              {getRankEmoji(userRank.rank)} {userRank.rank} / {userRank.totalUsers}
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          paddingRight: '10px'
        }}>
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>💩</div>
              <div>Liderlik tablosu yükleniyor...</div>
            </div>
          ) : error ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#e74c3c'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>😞</div>
              <div>{error}</div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📊</div>
              <div>Henüz veri yok</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {leaderboard.map((user, index) => (
                <div
                  key={`${user.roomId}_${user.characterId}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: index < 3 ? '#fff3cd' : '#f8f9fa',
                    border: '2px solid #333',
                    borderRadius: '8px',
                    borderColor: index < 3 ? getRankColor(index + 1) : '#333'
                  }}
                >
                  {/* Rank */}
                  <div style={{
                    minWidth: '40px',
                    textAlign: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: getRankColor(index + 1)
                  }}>
                    {getRankEmoji(index + 1)}
                  </div>

                  {/* Character */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flex: 1,
                    minWidth: 0
                  }}>
                    <span style={{ fontSize: '24px' }}>{user.characterEmoji}</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{
                        fontWeight: 'bold',
                        color: user.characterColor,
                        fontSize: '16px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {user.characterName}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#666',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        Son: {formatLastPoop(user.lastPoopTime)}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{
                    textAlign: 'right',
                    minWidth: '80px'
                  }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#333'
                    }}>
                      {user.poopCount} 💩
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      Seviye {user.level}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '20px',
          paddingTop: '15px',
          borderTop: '2px solid #eee',
          textAlign: 'center',
          fontSize: '12px',
          color: '#666'
        }}>
          💩 Poop Count - {getTimeframeText(timeframe)} Global Sıralaması
        </div>
      </div>
    </div>
  );
};

export default GlobalLeaderboard;
