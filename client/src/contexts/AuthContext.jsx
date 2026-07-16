import React, { createContext, useContext, useState, useEffect } from 'react'
import api, { setAccessToken } from '../api/axios'
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
    // On app load, attempt a silent refresh to rehydrate the access token
    // from the httpOnly refresh token cookie (sent automatically)
    async function silentRefresh() {
      try {
        const res = await api.post('/auth/refresh')
        const data = res?.data?.data
        if (data?.accessToken) {
          setAccessToken(data.accessToken)
        }
        const u = data?.user
        if (u) setUser(u)
      } catch (err) {
        // No valid refresh cookie — user is not logged in
        setUser(null)
        setAccessToken(null)
      } finally {
        setIsLoading(false)
      }
    }
    silentRefresh()
  }, [])

  async function login(credentials) {
    setIsLoading(true)
    try {
      const res = await api.post('/auth/login', credentials)
      const data = res?.data?.data
      if (data?.accessToken) {
        setAccessToken(data.accessToken)
      }
      const u = data?.user
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
      const data = res?.data?.data
      if (data?.accessToken) {
        setAccessToken(data.accessToken)
      }
      const u = data?.user
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
      // ignore — cookie may already be cleared
    } finally {
      setUser(null)
      setAccessToken(null)
      setIsLoading(false)
      navigate('/login')
    }
  }

  const value = { user, setUser, isLoading, login, register, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
