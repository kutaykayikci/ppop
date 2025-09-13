import React, { useState, useEffect } from 'react';
import PoopCounter from './components/PoopCounter';
import PixelButton from './components/PixelButton';
import { getPoopsByDateRange } from './firebase/poopService';
import './index.css';

function App() {
  const [stats, setStats] = useState({
    today: { rümeysa: 0, kutay: 0 },
    week: { rümeysa: 0, kutay: 0 },
    total: { rümeysa: 0, kutay: 0 }
  });
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  useEffect(() => {
    loadStatistics();
  }, [selectedPeriod]);

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
        case 'total':
          startDate = '2024-01-01'; // Başlangıç tarihi
          endDate = today;
          break;
        default:
          startDate = endDate = today;
      }

      console.log(`${selectedPeriod} istatistikleri yükleniyor:`, { startDate, endDate });
      const poops = await getPoopsByDateRange(startDate, endDate);
      console.log('Firestore\'dan gelen poop verileri:', poops);
      
      const newStats = {
        rümeysa: poops.filter(poop => poop.user === 'rümeysa').length,
        kutay: poops.filter(poop => poop.user === 'kutay').length
      };

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
      case 'total': return 'Toplam';
      default: return 'Bugün';
    }
  };

  const getWinner = () => {
    const currentStats = stats[selectedPeriod];
    if (currentStats.rümeysa > currentStats.kutay) {
      return { name: 'Rümeysa', count: currentStats.rümeysa, emoji: '👑' };
    } else if (currentStats.kutay > currentStats.rümeysa) {
      return { name: 'Kutay', count: currentStats.kutay, emoji: '👑' };
    } else {
      return { name: 'Berabere', count: currentStats.rümeysa, emoji: '🤝' };
    }
  };

  const userColors = {
    rümeysa: {
      background: '#ffe6f2',
      border: '#ff6b9d',
      text: '#d63384',
      button: '#ff6b9d',
      buttonBorder: '#e55a8a'
    },
    kutay: {
      background: '#e6f7ff',
      border: '#4ecdc4',
      text: '#0066cc',
      button: '#4ecdc4',
      buttonBorder: '#45b7b8'
    }
  };

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
          💩 Poop Count - Sevgililer Takibi 💩
        </h1>
        
      </header>

      {/* Main Content */}
      <main style={{ padding: '0', flex: 1 }}>
        {/* Poop Counters */}
        <div className="user-grid">
          <PoopCounter 
            user="rümeysa" 
            userColor={userColors.rümeysa}
          />
          <PoopCounter 
            user="kutay" 
            userColor={userColors.kutay}
          />
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
            {['today', 'week', 'total'].map(period => (
              <PixelButton
                key={period}
                onClick={() => setSelectedPeriod(period)}
                variant={selectedPeriod === period ? 'primary' : 'secondary'}
                size="sm"
                style={{ margin: '0 5px' }}
              >
                {period === 'today' ? 'Bugün' : 
                 period === 'week' ? 'Hafta' : 'Toplam'}
              </PixelButton>
            ))}
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              backgroundColor: '#ff6b6b',
              color: '#fff',
              padding: '15px',
              borderRadius: '8px',
              border: '3px solid #e55a5a'
            }}>
              <div style={{ fontSize: '12px', marginBottom: '5px' }}>Rümeysa 💖</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {stats[selectedPeriod].rümeysa}
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#4ecdc4',
              color: '#fff',
              padding: '15px',
              borderRadius: '8px',
              border: '3px solid #45b7b8'
            }}>
              <div style={{ fontSize: '12px', marginBottom: '5px' }}>Kutay 💙</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {stats[selectedPeriod].kutay}
              </div>
            </div>
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
            {getWinner().name !== 'Berabere' && (
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
}

export default App;
