'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('digifarm_user')
      if (savedUser) {
        const parsed = JSON.parse(savedUser)
        setUser(parsed)
        setRole(parsed.role)
        setIsAuthenticated(true)
      }
    } catch (e) {
      console.error('Failed to load user from localStorage')
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    setRole(userData.role)
    setIsAuthenticated(true)
    localStorage.setItem('digifarm_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setRole(null)
    setIsAuthenticated(false)
    localStorage.removeItem('digifarm_user')
  }

  const checkOnboardingStatus = () => {
    if (role === 'farmer') {
      return localStorage.getItem('digifarm_onboarding_complete') === 'true'
    }
    return true
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        role, 
        isAuthenticated, 
        loading,
        login, 
        logout,
        checkOnboardingStatus 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}