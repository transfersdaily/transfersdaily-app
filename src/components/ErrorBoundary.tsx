'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; errorInfo?: React.ErrorInfo }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 ErrorBoundary caught an error:', error)
    console.error('🚨 Error info:', errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Send error to console for debugging
    if (typeof window !== 'undefined') {
      console.error('🚨 Client-side error details:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      })
    }
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state
      
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={error!} errorInfo={errorInfo} />
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-card border border-border rounded-lg p-6">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              🚨 Application Error
            </h1>
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">Error Message:</h2>
                <p className="text-sm bg-muted p-3 rounded font-mono">
                  {error?.message || 'Unknown error'}
                </p>
              </div>
              
              {error?.stack && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Stack Trace:</h2>
                  <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-40">
                    {error.stack}
                  </pre>
                </div>
              )}
              
              {errorInfo?.componentStack && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Component Stack:</h2>
                  <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-40">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
