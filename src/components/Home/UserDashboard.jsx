import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import PixelButton from '../PixelButton';
import PixelCard from '../PixelCard';
import UserProfile from '../Profile/UserProfile';
import { logoutUser } from '../../services/userAuthService';
import soundService from '../../services/soundService';
import './UserDashboard.css';

const UserDashboard = ({ onCreateRoom, onJoinRoom }) => {
  const navigate = useNavigate();
  const { 
    user, 
    userProfile, 
    userRooms, 
    setUserRooms, 
    clearUserData 
  } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [particles, setParticles] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleLogout = async () => {
    try {
      soundService.playClick();
      await logoutUser();
      clearUserData();
    } catch (error) {
      console.error('Cikis yapilirken hata:', error);
    }
  };

  const handleRoomNavigation = (roomId) => {
    soundService.playClick();
    navigate(`/dashboard/${roomId}`);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date.seconds ? date.seconds * 1000 : date).toLocaleDateString('tr-TR');
  };

  // Animasyon efektlerini başlat
  useEffect(() => {
    // Floating emojiler oluştur
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
    
    // Performance için emoji sayısını azalt (6 adet)
    for (let i = 0; i < 6; i++) {
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
      // Performance için parçacık oluşturma sıklığını azalt
      if (Math.random() < 0.01) {
        createParticle(e.clientX, e.clientY);
      }
    };

    const createParticle = (x, y) => {
      const particleTypes = ['sparkle', 'trail'];
      const newParticle = {
        id: `particle-${Date.now()}-${Math.random()}`,
        x: x,
        y: y,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        type: particleTypes[Math.floor(Math.random() * particleTypes.length)]
      };
      
      setParticles(prev => [...prev, newParticle]);
      
      // Parçacığı 3-4 saniye sonra temizle
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 3000 + Math.random() * 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Window resize dinleyicisi
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      className="animated-gradient"
      style={{ 
        minHeight: 'auto', 
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
        backgroundColor: 'var(--color-bg)',
        borderBottom: `3px solid var(--color-border)`,
        padding: '15px 20px',
        textAlign: 'center',
        boxShadow: '0 4px 0px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        minHeight: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          paddingLeft: '20px',
          paddingRight: '20px',
          maxWidth: 'calc(100vw - 40px)',
          width: '100%'
        }}>
          <h1 
            style={{
              fontSize: isMobile ? '14px' : '18px',
              color: 'var(--color-text)',
              margin: '0',
              textShadow: '2px 2px 0px rgba(0, 0, 0, 0.1)',
              lineHeight: '1.2'
            }}
          >
            Hoş Geldin, {userProfile?.displayName || user?.displayName || 'Kullanıcı'}!
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '15px', flex: 1 }}>
        {/* Kullanici Profil Karti - Kompakt */}
        <div style={{
          backgroundColor: '#fff',
          border: '3px solid #333',
          borderRadius: '12px',
          padding: '15px',
          marginBottom: '15px',
          boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.2)',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '15px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h2 style={{
                margin: '0 0 8px 0',
                fontSize: '16px',
                color: '#333',
                fontWeight: 'bold'
              }}>
                Profil Bilgileri
              </h2>
              <p style={{
                margin: '0 0 5px 0',
                fontSize: '14px',
                color: '#666'
              }}>
                {userProfile?.displayName || user?.displayName || 'Kullanıcı'}
              </p>
              <p style={{
                margin: '0',
                fontSize: '12px',
                color: '#999'
              }}>
                {user?.email}
              </p>
            </div>
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'center',
              width: '100%',
              maxWidth: '300px'
            }}>
              <PixelButton 
                variant="secondary" 
                size="small" 
                onClick={() => {
                  soundService.playClick();
                  setShowProfile(true);
                }}
                style={{ 
                  fontSize: '10px', 
                  padding: '8px 16px',
                  flex: 1
                }}
              >
                Profil
              </PixelButton>
              <PixelButton 
                variant="secondary" 
                size="small" 
                onClick={handleLogout}
                style={{ 
                  fontSize: '10px', 
                  padding: '8px 16px',
                  flex: 1
                }}
              >
                Çıkış
              </PixelButton>
            </div>
          </div>
          
          {/* Kompakt İstatistikler - 3 Sütun */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px'
          }}>
            <div style={{
              backgroundColor: '#f8f9fa',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                {userProfile?.totalPoopCount || 0}
              </div>
              <div style={{ fontSize: '9px', color: '#666' }}>Toplam Poop</div>
            </div>
            <div style={{
              backgroundColor: '#f8f9fa',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                {userRooms.length}
              </div>
              <div style={{ fontSize: '9px', color: '#666' }}>Odalar</div>
            </div>
            <div style={{
              backgroundColor: '#f8f9fa',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                {userProfile?.achievements?.length || 0}
              </div>
              <div style={{ fontSize: '9px', color: '#666' }}>Başarım</div>
            </div>
          </div>
        </div>

        {/* Hizli Aksiyonlar - Kompakt */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <PixelButton 
            onClick={() => {
              soundService.playClick();
              onCreateRoom();
            }}
            size="large"
            style={{
              background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%) !important',
              color: '#fff !important',
              border: '3px solid #333 !important',
              fontSize: '14px !important',
              padding: '16px !important',
              minHeight: '50px !important'
            }}
          >
            Yeni Oda Oluştur
          </PixelButton>
          <PixelButton 
            onClick={() => {
              soundService.playClick();
              onJoinRoom();
            }}
            variant="secondary" 
            size="large"
            style={{
              background: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%) !important',
              color: '#fff !important',
              border: '3px solid #333 !important',
              fontSize: '14px !important',
              padding: '16px !important',
              minHeight: '50px !important'
            }}
          >
            Odaya Katıl
          </PixelButton>
        </div>

        {/* Kullanicinin Odalari - Kompakt */}
        {userRooms.length > 0 && (
          <div style={{
            backgroundColor: '#fff',
            border: '3px solid #333',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '15px',
            boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              color: '#333',
              fontWeight: 'bold'
            }}>
              Odalarım
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '12px'
            }}>
              {userRooms.map(room => (
                <div key={room.id} style={{
                  backgroundColor: '#f8f9fa',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                  minHeight: '60px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#333',
                      marginBottom: '8px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '200px'
                    }}>
                      {room.id}
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      fontSize: '9px',
                      color: '#666',
                      flexWrap: 'wrap'
                    }}>
                      <span>Poop: {room.userPoopCount || 0}</span>
                      <span>Üyeler: {room.users?.length || 0}/{room.maxUsers || room.capacity || 5}</span>
                      <span style={{
                        color: room.status === 'active' ? '#00b894' : 
                               room.status === 'waiting_for_partner' ? '#fdcb6e' : '#636e72',
                        fontWeight: 'bold'
                      }}>
                        {room.status === 'active' ? 'Aktif' : 
                         room.status === 'waiting_for_partner' ? 'Bekliyor' : 'Tamamlandı'}
                      </span>
                    </div>
                  </div>
                  <PixelButton 
                    size="small" 
                    onClick={() => handleRoomNavigation(room.id)}
                    style={{
                      background: '#0984e3 !important',
                      color: '#fff !important',
                      border: '2px solid #333 !important',
                      minWidth: '50px',
                      fontSize: '9px',
                      padding: '6px 8px'
                    }}
                  >
                    Gir
                  </PixelButton>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bos durum - Kompakt */}
        {userRooms.length === 0 && (
          <div style={{
            backgroundColor: '#fff',
            border: '3px solid #333',
            borderRadius: '12px',
            padding: '30px',
            textAlign: 'center',
            boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.2)',
            marginBottom: '20px'
          }}>
            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '16px',
              color: '#333',
              fontWeight: 'bold'
            }}>
              Henüz hiç odanda yok!
            </h3>
            <p style={{
              margin: '0',
              fontSize: '12px',
              color: '#666',
              lineHeight: '1.4'
            }}>
              İlk odanı oluştur veya arkadaşlarının odasına katıl
            </p>
          </div>
        )}
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
        <div>💕 Arkadaşlar için özel olarak tasarlandı 💕</div>
        <div style={{ marginTop: '5px', opacity: 0.7 }}>
          Her poop anı değerlidir! 🎉
        </div>
      </footer>

      {/* User Profile Modal */}
      <UserProfile
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </div>
  );
};

export default UserDashboard;
