import React from 'react';
import './index.css';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#fff',
        border: '3px solid #333',
        borderRadius: '8px',
        boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.2)',
        padding: '30px',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <h1 style={{ fontSize: '24px', color: '#333', marginBottom: '20px' }}>
          💩 Poop Count
        </h1>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
          Sevgililer Takibi
        </p>
        <div style={{
          backgroundColor: '#ff6b6b',
          color: '#fff',
          padding: '15px',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          ✅ GitHub Pages'te çalışıyor!
        </div>
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
          Build: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default App;
