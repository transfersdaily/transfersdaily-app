'use client'

import { useState, useEffect } from 'react'

interface BackendStatusIndicatorProps {
  className?: string
}

export default function BackendStatusIndicator({ className = '' }: BackendStatusIndicatorProps) {
  const [isBackendDown, setIsBackendDown] = useState(false)
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    // Listen for backend errors
    const handleBackendError = () => {
      setIsBackendDown(true)
      setShowIndicator(true)
    }

    // Listen for successful API calls
    const handleBackendSuccess = () => {
      setIsBackendDown(false)
      // Keep showing indicator for a few seconds to show recovery
      setTimeout(() => setShowIndicator(false), 3000)
    }

    // Listen for console errors that indicate backend issues
    const originalError = console.error
    console.error = (...args) => {
      const message = args.join(' ')
      if (message.includes('502') || message.includes('Backend service unavailable') || message.includes('Failed to fetch')) {
        handleBackendError()
      }
      originalError.apply(console, args)
    }

    // Listen for successful API responses
    const originalLog = console.log
    console.log = (...args) => {
      const message = args.join(' ')
      if (message.includes('API Success') || message.includes('Found matching article')) {
        handleBackendSuccess()
      }
      originalLog.apply(console, args)
    }

    return () => {
      console.error = originalError
      console.log = originalLog
    }
  }, [])

  if (!showIndicator) return null

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <div className={`
        px-4 py-2 rounded-lg shadow-lg text-sm font-medium
        ${isBackendDown 
          ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
          : 'bg-green-100 text-green-800 border border-green-300'
        }
      `}>
        <div className="flex items-center space-x-2">
          <div className={`
            w-2 h-2 rounded-full
            ${isBackendDown ? 'bg-yellow-500' : 'bg-green-500'}
          `} />
          <span>
            {isBackendDown 
              ? 'Using cached content - Backend updating' 
              : 'Backend service restored'
            }
          </span>
        </div>
      </div>
    </div>
  )
}
