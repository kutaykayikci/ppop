import React from 'react'
import Router from '@/navigation/Router'
import ErrorBoundary from '@/components/common/ErrorBoundary.jsx'

export default function App() {
  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  )
}