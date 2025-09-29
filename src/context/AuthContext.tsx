import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '../types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (userData: User) => void
  loginWithUNIFOR: () => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há dados de usuário salvos no localStorage
    const savedUser = localStorage.getItem('profai_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error)
        localStorage.removeItem('profai_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem('profai_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('profai_user')
  }

  const loginWithUNIFOR = async () => {
    try {
      // Redirecionar para o SSO da UNIFOR
      const uniforSSOUrl = 'https://ead.unifor.br/ava/login/page/acesso.php'
      const redirectUri = `${window.location.origin}/auth/callback`
      const clientId = process.env.REACT_APP_UNIFOR_CLIENT_ID || 'profai-tcc-editor'
      
      const authUrl = `${uniforSSOUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid profile email`
      
      window.location.href = authUrl
    } catch (error) {
      console.error('Erro no login UNIFOR:', error)
      throw error
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('profai_user', JSON.stringify(updatedUser))
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithUNIFOR,
    logout,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

