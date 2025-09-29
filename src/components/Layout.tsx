import React, { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import Header from './Header'
import ProfAiPanel from './ProfAiPanel'
import { useAuth } from '../context/AuthContext'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <Helmet>
        <title>ProfAi - Editor de TCC</title>
        <meta name="description" content="Editor inteligente para TCC com assistente virtual ProfAi" />
        <meta name="theme-color" content="#003366" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="flex">
          <div className="flex-1">
            {children}
          </div>
          
          {isAuthenticated && (
            <ProfAiPanel />
          )}
        </main>
      </div>
    </>
  )
}

export default Layout

