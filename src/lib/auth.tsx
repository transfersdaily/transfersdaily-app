"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from './supabase/client'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  emailVerified: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Check initial session
    supabase.auth.getUser().then(({ data: { user: sbUser } }) => {
      if (sbUser) {
        setUser({
          id: sbUser.id,
          email: sbUser.email || '',
          firstName: sbUser.user_metadata?.first_name || '',
          lastName: sbUser.user_metadata?.last_name || '',
          emailVerified: !!sbUser.email_confirmed_at,
        })
      }
      setIsLoading(false)
    })

    // Listen for auth state changes (auto-refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            firstName: session.user.user_metadata?.first_name || '',
            lastName: session.user.user_metadata?.last_name || '',
            emailVerified: !!session.user.email_confirmed_at,
          })
        } else {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Sign in error:', error)
      throw new Error('Failed to sign in. Please check your credentials.')
    }

    window.location.href = '/admin'
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error)
      throw error
    }
    setUser(null)
    window.location.href = '/'
  }

  const value = {
    user,
    isLoading,
    signIn: handleSignIn,
    signOut: handleSignOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
