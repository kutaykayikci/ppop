import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('UI Error:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, margin: 20, border: '3px solid #333', borderRadius: 8, background: '#fff' }}>
          <div style={{ fontWeight: 'bold', marginBottom: 6 }}>Bir şeyler ters gitti</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>Sayfayı yenilemeyi deneyin. Hata devam ederse destek ile iletişime geçin.</div>
        </div>
      )
    }
    return this.props.children
  }
}
export default ErrorBoundary
