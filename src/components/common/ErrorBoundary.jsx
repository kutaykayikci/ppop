import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    }
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          backgroundColor: '#fff',
          border: '3px solid #ff6b6b',
          borderRadius: '8px',
          margin: '20px',
          fontFamily: '"Press Start 2P", monospace'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '20px' }}>💥</div>
          <h2 style={{ 
            fontSize: '16px', 
            color: '#ff6b6b', 
            marginBottom: '20px' 
          }}>
            Bir hata oluştu!
          </h2>
          <p style={{ 
            fontSize: '10px', 
            color: '#666', 
            marginBottom: '20px',
            lineHeight: '1.4'
          }}>
            Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={this.handleRetry}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4ecdc4',
                color: '#fff',
                border: '3px solid #333',
                borderRadius: '4px',
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              Tekrar Dene
            </button>
            <button
              onClick={this.handleReload}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ff6b6b',
                color: '#fff',
                border: '3px solid #333',
                borderRadius: '4px',
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              Sayfayı Yenile
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', fontSize: '8px' }}>
                Hata Detayları (Geliştirici)
              </summary>
              <pre style={{ 
                fontSize: '8px', 
                color: '#666', 
                marginTop: '10px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
export default ErrorBoundary
