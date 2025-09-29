import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BookOpen, User, Settings, LogOut, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useProfAi } from '../context/ProfAiContext'

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { toggleVisibility, isVisible } = useProfAi()
  const location = useLocation()

  const navigation = [
    { name: 'Início', href: '/', icon: BookOpen },
    { name: 'Editor', href: '/editor', icon: BookOpen },
    { name: 'Histórico', href: '/history', icon: BookOpen },
    { name: 'Ajuda', href: '/help', icon: BookOpen },
    { name: 'Sobre', href: '/about', icon: BookOpen },
  ]

  return (
    <header className="bg-unifor-blue shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-unifor-light-blue rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">ProfAi</span>
            </Link>
          </div>

          {/* Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-unifor-light-blue text-white'
                        : 'text-gray-200 hover:text-white hover:bg-blue-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* ProfAi Toggle */}
                <button
                  onClick={toggleVisibility}
                  className={`p-2 rounded-lg transition-colors ${
                    isVisible 
                      ? 'bg-unifor-light-blue text-white' 
                      : 'text-gray-200 hover:text-white hover:bg-blue-700'
                  }`}
                  title={isVisible ? 'Ocultar ProfAi' : 'Mostrar ProfAi'}
                >
                  <User className="w-5 h-5" />
                </button>

                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-gray-200">{user?.course}</p>
                  </div>
                  <div className="w-8 h-8 bg-unifor-light-blue rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="p-2 text-gray-200 hover:text-white hover:bg-blue-700 rounded-lg transition-colors"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn-primary"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

