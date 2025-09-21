import React, { useState } from 'react';
import PixelCard from '../PixelCard';
import PixelButton from '../PixelButton';
import { 
  showFeedback, 
  FEEDBACK_TYPES, 
  FEEDBACK_LEVELS, 
  FEEDBACK_ANIMATIONS,
  getFeedbackStats,
  closeAllFeedbacks
} from '../../services/feedbackManager';

const FeedbackTest = ({ onClose }) => {
  const [testResults, setTestResults] = useState({});
  const [stats, setStats] = useState(null);

  const runTest = (type, level, animation) => {
    const testId = `${type}_${level}_${animation}`;
    const startTime = Date.now();
    
    showFeedback(type, {}, {
      title: 'Test Bildirimi',
      message: `${type} - ${level} - ${animation} testi`,
      level: level,
      animation: animation,
      sound: 'success',
      vibration: [100],
      onClose: () => {
        const endTime = Date.now();
        setTestResults(prev => ({
          ...prev,
          [testId]: {
            duration: endTime - startTime,
            success: true,
            timestamp: new Date()
          }
        }));
        updateStats();
      }
    });
  };

  const updateStats = () => {
    const currentStats = getFeedbackStats();
    setStats(currentStats);
  };

  const testAllCombinations = () => {
    const types = [
      FEEDBACK_TYPES.ROOM_JOINED,
      FEEDBACK_TYPES.POOP_ADDED,
      FEEDBACK_TYPES.ACHIEVEMENT_UNLOCKED,
      FEEDBACK_TYPES.ROOM_FULL,
      FEEDBACK_TYPES.NETWORK_ERROR
    ];
    
    const levels = [
      FEEDBACK_LEVELS.TOAST,
      FEEDBACK_LEVELS.POPUP,
      FEEDBACK_LEVELS.BANNER
    ];
    
    const animations = [
      FEEDBACK_ANIMATIONS.FADE,
      FEEDBACK_ANIMATIONS.BOUNCE,
      FEEDBACK_ANIMATIONS.SLIDE,
      FEEDBACK_ANIMATIONS.PULSE
    ];

    let delay = 0;
    types.forEach(type => {
      levels.forEach(level => {
        animations.forEach(animation => {
          setTimeout(() => {
            runTest(type, level, animation);
          }, delay);
          delay += 2000; // 2 saniye aralıklarla
        });
      });
    });
  };

  const clearAll = () => {
    closeAllFeedbacks();
    setTestResults({});
    setStats(null);
  };

  const getTestSummary = () => {
    const total = Object.keys(testResults).length;
    const successful = Object.values(testResults).filter(r => r.success).length;
    const failed = total - successful;
    
    return { total, successful, failed };
  };

  const summary = getTestSummary();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <PixelCard style={{
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Başlık */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '2px solid #333'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333',
            margin: 0
          }}>
            🧪 Feedback Test Merkezi
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#666',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        {/* Test Sonuçları */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '12px'
          }}>
            Test Sonuçları
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              padding: '12px',
              backgroundColor: '#e8f5e8',
              border: '2px solid #4caf50',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2e7d32' }}>
                {summary.total}
              </div>
              <div style={{ fontSize: '10px', color: '#2e7d32' }}>
                Toplam Test
              </div>
            </div>
            
            <div style={{
              padding: '12px',
              backgroundColor: '#e8f5e8',
              border: '2px solid #4caf50',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2e7d32' }}>
                {summary.successful}
              </div>
              <div style={{ fontSize: '10px', color: '#2e7d32' }}>
                Başarılı
              </div>
            </div>
            
            <div style={{
              padding: '12px',
              backgroundColor: '#ffebee',
              border: '2px solid #f44336',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#c62828' }}>
                {summary.failed}
              </div>
              <div style={{ fontSize: '10px', color: '#c62828' }}>
                Başarısız
              </div>
            </div>
          </div>
        </div>

        {/* Sistem İstatistikleri */}
        {stats && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '12px'
            }}>
              Sistem İstatistikleri
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '12px'
            }}>
              <div style={{
                padding: '12px',
                backgroundColor: '#f5f5f5',
                border: '2px solid #ddd',
                borderRadius: '6px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#333' }}>
                  Aktif Feedback
                </div>
                <div style={{ fontSize: '18px', color: '#2196f3' }}>
                  {stats.active}
                </div>
              </div>
              
              <div style={{
                padding: '12px',
                backgroundColor: '#f5f5f5',
                border: '2px solid #ddd',
                borderRadius: '6px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#333' }}>
                  Kuyrukta
                </div>
                <div style={{ fontSize: '18px', color: '#ff9800' }}>
                  {stats.queued}
                </div>
              </div>
              
              <div style={{
                padding: '12px',
                backgroundColor: '#f5f5f5',
                border: '2px solid #ddd',
                borderRadius: '6px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#333' }}>
                  Maksimum
                </div>
                <div style={{ fontSize: '18px', color: '#9c27b0' }}>
                  {stats.maxConcurrent}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Butonları */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '12px'
          }}>
            Tekil Testler
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '8px'
          }}>
            <PixelButton
              onClick={() => runTest(FEEDBACK_TYPES.ROOM_JOINED, FEEDBACK_LEVELS.TOAST, FEEDBACK_ANIMATIONS.BOUNCE)}
              size="small"
              style={{ fontSize: '8px' }}
            >
              Başarı Toast
            </PixelButton>
            
            <PixelButton
              onClick={() => runTest(FEEDBACK_TYPES.POOP_ADDED, FEEDBACK_LEVELS.TOAST, FEEDBACK_ANIMATIONS.BOUNCE)}
              size="small"
              style={{ fontSize: '8px' }}
            >
              Poop Toast
            </PixelButton>
            
            <PixelButton
              onClick={() => runTest(FEEDBACK_TYPES.ACHIEVEMENT_UNLOCKED, FEEDBACK_LEVELS.POPUP, FEEDBACK_ANIMATIONS.BOUNCE)}
              size="small"
              style={{ fontSize: '8px' }}
            >
              Başarı Popup
            </PixelButton>
            
            <PixelButton
              onClick={() => runTest(FEEDBACK_TYPES.ROOM_FULL, FEEDBACK_LEVELS.POPUP, FEEDBACK_ANIMATIONS.SHAKE)}
              size="small"
              style={{ fontSize: '8px' }}
            >
              Hata Popup
            </PixelButton>
            
            <PixelButton
              onClick={() => runTest(FEEDBACK_TYPES.NETWORK_ERROR, FEEDBACK_LEVELS.BANNER, FEEDBACK_ANIMATIONS.PULSE)}
              size="small"
              style={{ fontSize: '8px' }}
            >
              Banner Test
            </PixelButton>
            
            <PixelButton
              onClick={() => runTest(FEEDBACK_TYPES.MOTIVATION_MESSAGE, FEEDBACK_LEVELS.TOAST, FEEDBACK_ANIMATIONS.FADE)}
              size="small"
              style={{ fontSize: '8px' }}
            >
              Motivasyon
            </PixelButton>
          </div>
        </div>

        {/* Toplu Test */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '12px'
          }}>
            Toplu Testler
          </h3>
          
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <PixelButton
              onClick={testAllCombinations}
              variant="primary"
              size="small"
            >
              Tüm Kombinasyonları Test Et
            </PixelButton>
            
            <PixelButton
              onClick={updateStats}
              variant="secondary"
              size="small"
            >
              İstatistikleri Yenile
            </PixelButton>
            
            <PixelButton
              onClick={clearAll}
              variant="secondary"
              size="small"
            >
              Tümünü Temizle
            </PixelButton>
          </div>
        </div>

        {/* Test Detayları */}
        {Object.keys(testResults).length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '12px'
            }}>
              Test Detayları
            </h3>
            
            <div style={{
              maxHeight: '200px',
              overflow: 'auto',
              border: '2px solid #ddd',
              borderRadius: '6px',
              padding: '12px'
            }}>
              {Object.entries(testResults).map(([testId, result]) => (
                <div key={testId} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '4px 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ fontSize: '10px', color: '#333' }}>
                    {testId}
                  </span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '10px',
                      color: result.success ? '#4caf50' : '#f44336'
                    }}>
                      {result.success ? '✓' : '✗'}
                    </span>
                    <span style={{ fontSize: '10px', color: '#666' }}>
                      {result.duration}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kapatma Butonu */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <PixelButton
            onClick={onClose}
            variant="primary"
            size="small"
          >
            Kapat
          </PixelButton>
        </div>
      </PixelCard>
    </div>
  );
};

export default FeedbackTest;
