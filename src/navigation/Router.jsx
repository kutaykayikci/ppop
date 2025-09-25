import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

const RoomSelector = lazy(() => import('@/components/Room/RoomSelector'))
const CharacterCreator = lazy(() => import('@/components/Character/CharacterCreator'))
const CharacterSetup = lazy(() => import('@/components/Character/CharacterSetup'))
const RoomDashboard = lazy(() => import('@/components/Dashboard/SimpleRoomDashboard'))
const GlobalNotificationBanner = lazy(() => import('@/components/Notification/GlobalNotificationBanner'))
const EventBanner = lazy(() => import('@/components/Events/EventBanner'))
const NotFound = lazy(() => import('@/components/common/NotFound'))

const Loading = () => (
  <div 
    className="animated-gradient"
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}
  >
    <div style={{
      backgroundColor: '#fff',
      border: '3px solid #333',
      borderRadius: '8px',
      padding: '40px',
      textAlign: 'center',
      fontFamily: '"Press Start 2P", monospace',
      boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.2)'
    }}>
      <div style={{ fontSize: '24px', marginBottom: '20px' }}>💩</div>
      <div style={{ fontSize: '12px', color: '#333', marginBottom: '20px' }}>
        Yükleniyor...
      </div>
      <div className="loading-spinner" style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #ff6b6b',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
)

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}> 
        <GlobalNotificationBanner />
        <EventBanner />
        <Routes>
          <Route path="/" element={<RoomSelector />} />
          <Route path="/character-setup" element={<CharacterSetup />} />
          <Route path="/rooms/:roomId" element={<CharacterCreator />} />
          <Route path="/dashboard/:roomId" element={<RoomDashboard />} />
          <Route path="/admin" element={<NotFound />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}


