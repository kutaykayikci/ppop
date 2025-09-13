import React, { useState, useEffect } from 'react';
import PixelButton from './PixelButton';
import PixelCard from './PixelCard';
import { addPoopEntry, getTodayPoops } from '../firebase/poopService';

const PoopCounter = ({ user, userColor }) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [animation, setAnimation] = useState('');

  useEffect(() => {
    loadTodayCount();
  }, []);

  const loadTodayCount = async () => {
    try {
      const todayPoops = await getTodayPoops();
      const userPoops = todayPoops.filter(poop => poop.user === user);
      setCount(userPoops.length);
      console.log(`${user} için bugünkü poop sayısı:`, userPoops.length);
    } catch (error) {
      console.error('Bugünkü poop sayısını yükleme hatası:', error);
      setCount(0);
    }
  };

  const handlePoopClick = async () => {
    if (loading) return;
    
    setLoading(true);
    setAnimation('bounce');
    
    try {
      console.log(`${user} için poop ekleniyor...`);
      const result = await addPoopEntry(user);
      console.log('Poop başarıyla eklendi, ID:', result);
      
      // Veritabanından güncel sayıyı al
      await loadTodayCount();
      
      // Başarı animasyonu
      setTimeout(() => {
        setAnimation('shake');
        setTimeout(() => setAnimation(''), 500);
      }, 300);
      
    } catch (error) {
      console.error('Poop ekleme hatası:', error);
      alert(`Hata: ${error.message || 'Poop eklenemedi!'}`);
      setAnimation('shake');
      setTimeout(() => setAnimation(''), 500);
    } finally {
      setLoading(false);
      setTimeout(() => setAnimation(''), 1000);
    }
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <PixelCard 
      style={{ 
        backgroundColor: userColor.background,
        borderColor: userColor.border,
        position: 'relative'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ 
          color: userColor.text,
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          {user} 💩
        </h2>
        
        <div style={{ 
          fontSize: '48px', 
          marginBottom: '20px',
          animation: animation ? `${animation} 1s ease-in-out` : 'none'
        }}>
          {count}
        </div>
        
        <div style={{ 
          fontSize: '10px', 
          color: userColor.text,
          marginBottom: '20px',
          opacity: 0.7
        }}>
          Bugünkü Sayı
        </div>
        
        <PixelButton
          onClick={handlePoopClick}
          disabled={loading}
          style={{
            backgroundColor: userColor.button,
            borderColor: userColor.buttonBorder,
            color: '#fff',
            fontSize: '12px',
            padding: '15px 30px'
          }}
        >
          {loading ? 'Ekleniyor...' : '+1 Poop!'}
        </PixelButton>
        
        <div style={{ 
          fontSize: '8px', 
          color: userColor.text,
          marginTop: '15px',
          opacity: 0.6
        }}>
          Son: {formatTime()}
        </div>
      </div>
    </PixelCard>
  );
};

export default PoopCounter;
