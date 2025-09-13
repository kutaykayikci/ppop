import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
      fontFamily: '"Press Start 2P", monospace'
    },
    card: {
      backgroundColor: '#fff',
      border: '3px solid #333',
      borderRadius: '8px',
      boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.2)',
      padding: '30px',
      textAlign: 'center',
      maxWidth: '400px'
    },
    button: {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '10px',
      padding: '12px 24px',
      border: '3px solid #333',
      background: '#fff',
      color: '#333',
      cursor: 'pointer',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.2)',
      borderRadius: '4px',
      margin: '5px'
    },
    primaryButton: {
      backgroundColor: '#ff6b6b',
      color: '#fff',
      borderColor: '#e55a5a'
    },
    secondaryButton: {
      backgroundColor: '#4ecdc4',
      color: '#fff',
      borderColor: '#45b7b8'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={{ fontSize: '24px', color: '#333', marginBottom: '20px' }}>
          💩 Poop Count
        </h1>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
          Sevgililer Takibi
        </p>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px', fontWeight: 'bold' }}>{count}</div>
          <button 
            style={{...styles.button, ...styles.primaryButton}}
            onClick={() => setCount(count + 1)}
          >
            +1 Poop
          </button>
          <button 
            style={{...styles.button, ...styles.secondaryButton}}
            onClick={() => setCount(0)}
          >
            Reset
          </button>
        </div>

        <div style={{
          backgroundColor: '#ff6b6b',
          color: '#fff',
          padding: '15px',
          borderRadius: '4px',
          fontSize: '14px',
          marginBottom: '20px'
        }}>
          ✅ GitHub Pages'te çalışıyor!
        </div>
        
        <div style={{ fontSize: '12px', color: '#999' }}>
          Build: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default App;