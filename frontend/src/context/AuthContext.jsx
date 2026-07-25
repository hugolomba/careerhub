import { createContext, useContext, useState } from 'react'
import apiClient from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('careerhub_user')
    return stored ? JSON.parse(stored) : null
  })

  async function login(email, password) {
    const { data } = await apiClient.post('/auth/login', { email, password })
    persistSession(data)
  }

  async function register(fullName, email, password) {
    const { data } = await apiClient.post('/auth/register', { fullName, email, password })
    persistSession(data)
  }

  function persistSession(data) {
    localStorage.setItem('careerhub_token', data.token)
    const userInfo = { fullName: data.fullName, email: data.email }
    localStorage.setItem('careerhub_user', JSON.stringify(userInfo))
    setUser(userInfo)
  }

  function logout() {
    localStorage.removeItem('careerhub_token')
    localStorage.removeItem('careerhub_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
