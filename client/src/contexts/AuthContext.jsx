import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Try to refresh session on app start
    async function refresh() {
      try {
        const res = await api.post('/auth/refresh')
        // backend may return user data
        if (res?.data?.user) setUser(res.data.user)
      } catch (err) {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    refresh()
  }, [])

  async function login(credentials) {
    setIsLoading(true)
    try {
      const res = await api.post('/auth/login', credentials)
      // assume backend returns user in response
      const u = res?.data?.user ?? res?.data
      setUser(u)
      return u
    } finally {
      setIsLoading(false)
    }
  }

  async function register(payload) {
    setIsLoading(true)
    try {
      const res = await api.post('/auth/register', payload)
      const u = res?.data?.user ?? res?.data
      setUser(u)
      return u
    } finally {
      setIsLoading(false)
    }
  }

  async function logout() {
    setIsLoading(true)
    try {
      await api.post('/auth/logout')
    } catch (err) {
      // ignore
    } finally {
      setUser(null)
      setIsLoading(false)
      navigate('/login')
    }
  }

  const value = { user, isLoading, login, register, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
