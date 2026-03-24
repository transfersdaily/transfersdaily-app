"use client"

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !user) {
        // User is not authenticated, redirect to login
        router.push(redirectTo)
      } else if (!requireAuth && user) {
        // User is authenticated but accessing a non-auth page (like login), redirect to admin
        router.push('/admin')
      }
    }
  }, [user, isLoading, requireAuth, redirectTo, router])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If we require auth and user is not authenticated, don't render children
  if (requireAuth && !user) {
    return null
  }

  // If we don't require auth and user is authenticated, don't render children  
  if (!requireAuth && user) {
    return null
  }

  return <>{children}</>
}

// Higher-order component for protecting pages
export function withAuth<T extends object>(
  Component: React.ComponentType<T>,
  options: { requireAuth?: boolean; redirectTo?: string } = {}
) {
  const { requireAuth = true, redirectTo = '/login' } = options

  return function AuthenticatedComponent(props: T) {
    return (
      <ProtectedRoute requireAuth={requireAuth} redirectTo={redirectTo}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

// Hook for checking if user has specific permissions
export function usePermissions() {
  const { user } = useAuth()
  
  const isAdmin = Boolean(user) // Currently, any authenticated user is admin
  const isEditor = Boolean(user) // Can be expanded later
  const isUser = Boolean(user)

  const hasPermission = (permission: 'admin' | 'editor' | 'user') => {
    switch (permission) {
      case 'admin':
        return isAdmin
      case 'editor':
        return isEditor || isAdmin
      case 'user':
        return isUser || isEditor || isAdmin
      default:
        return false
    }
  }

  return {
    user,
    isAdmin,
    isEditor,
    isUser,
    hasPermission
  }
}