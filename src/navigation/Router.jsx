import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

const RoomSelector = lazy(() => import('@/components/Room/RoomSelector'))
const CharacterCreator = lazy(() => import('@/components/Character/CharacterCreator'))
const RoomDashboard = lazy(() => import('@/components/Dashboard/RoomDashboard'))
const AdminPanel = lazy(() => import('@/components/Admin/AdminPanel'))
const GlobalNotificationBanner = lazy(() => import('@/components/Notification/GlobalNotificationBanner'))
const EventBanner = lazy(() => import('@/components/Events/EventBanner'))
const NotFound = lazy(() => import('@/components/common/NotFound'))

const Loading = () => <div />

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}> 
        <GlobalNotificationBanner />
        <EventBanner />
        <Routes>
          <Route path="/" element={<RoomSelector />} />
          <Route path="/rooms/:roomId" element={<CharacterCreator />} />
          <Route path="/dashboard/:roomId" element={<RoomDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}


