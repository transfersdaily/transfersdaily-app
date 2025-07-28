"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { AUTH_CONFIG, STORAGE_KEYS } from './config'

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

// Helper function to make Cognito API calls
async function cognitoRequest(action: string, params: Record<string, unknown>) {
  console.log('Making Cognito request:', action, params)
  console.log('Using config:', AUTH_CONFIG)
  
  const response = await fetch(AUTH_CONFIG.cognitoUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': `AWSCognitoIdentityProviderService.${action}`
    },
    body: JSON.stringify({
      ClientId: AUTH_CONFIG.userPoolClientId,
      ...params
    })
  })

  console.log('Response status:', response.status)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.log('Error response:', errorText)
    try {
      const error = JSON.parse(errorText)
      throw new Error(error.message || error.__type || `${action} failed`)
    } catch {
      throw new Error(`${action} failed with status ${response.status}`)
    }
  }

  const result = await response.json()
  console.log('Success response:', result)
  return result
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthState()
  }, [])

  async function checkAuthState() {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.user)
      const accessToken = localStorage.getItem(STORAGE_KEYS.accessToken)
      
      if (storedUser && accessToken) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error('Error checking auth state:', error)
      // Clear invalid stored data
      localStorage.removeItem(STORAGE_KEYS.user)
      localStorage.removeItem(STORAGE_KEYS.accessToken)
      localStorage.removeItem(STORAGE_KEYS.idToken)
      localStorage.removeItem(STORAGE_KEYS.refreshToken)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (email: string, password: string) => {
    try {
      const response = await cognitoRequest('InitiateAuth', {
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password
        }
      })

      console.log('Auth response:', response)

      if (response.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
        const newPassword = prompt('Please enter a new permanent password (min 12 chars, uppercase, lowercase, number, symbol):')
        if (!newPassword) {
          throw new Error('New password is required')
        }
        
        const challengeResponse = await cognitoRequest('RespondToAuthChallenge', {
          ChallengeName: 'NEW_PASSWORD_REQUIRED',
          Session: response.Session,
          ChallengeResponses: {
            USERNAME: email,
            NEW_PASSWORD: newPassword,
            'userAttributes.given_name': 'Admin',
            'userAttributes.family_name': 'User'
          },
          ClientId: AUTH_CONFIG.userPoolClientId
        })
        
        if (challengeResponse.AuthenticationResult) {
          const { AccessToken, RefreshToken, IdToken } = challengeResponse.AuthenticationResult
          
          localStorage.setItem(STORAGE_KEYS.accessToken, AccessToken)
          if (RefreshToken) localStorage.setItem(STORAGE_KEYS.refreshToken, RefreshToken)
          if (IdToken) localStorage.setItem(STORAGE_KEYS.idToken, IdToken)
          
          const userInfo = {
            id: email,
            email,
            firstName: '',
            lastName: '',
            emailVerified: true
          }
          
          localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userInfo))
          setUser(userInfo)
          
          window.location.href = '/admin'
        }
      } else if (response.AuthenticationResult) {
        const { AccessToken, RefreshToken, IdToken } = response.AuthenticationResult
        
        localStorage.setItem(STORAGE_KEYS.accessToken, AccessToken)
        if (RefreshToken) localStorage.setItem(STORAGE_KEYS.refreshToken, RefreshToken)
        if (IdToken) localStorage.setItem(STORAGE_KEYS.idToken, IdToken)
        
        const userInfo = {
          id: email,
          email,
          firstName: '',
          lastName: '',
          emailVerified: true
        }
        
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userInfo))
        setUser(userInfo)
        
        window.location.href = '/admin'
      } else {
        throw new Error('Unexpected response from authentication service')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      throw new Error('Failed to sign in. Please check your credentials.')
    }
  }



  const handleSignOut = async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEYS.accessToken)
      
      if (accessToken) {
        // Attempt to sign out from Cognito
        try {
          await fetch(AUTH_CONFIG.cognitoUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-amz-json-1.1',
              'X-Amz-Target': 'AWSCognitoIdentityProviderService.GlobalSignOut'
            },
            body: JSON.stringify({
              AccessToken: accessToken
            })
          })
        } catch (error) {
          console.warn('Error signing out from Cognito:', error)
        }
      }
      
      // Clear local storage
      localStorage.removeItem(STORAGE_KEYS.user)
      localStorage.removeItem(STORAGE_KEYS.accessToken)
      localStorage.removeItem(STORAGE_KEYS.idToken)
      localStorage.removeItem(STORAGE_KEYS.refreshToken)
      localStorage.removeItem(STORAGE_KEYS.preferences)
      
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
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
