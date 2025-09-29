import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processando autenticação...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const error = searchParams.get('error')

        if (error) {
          throw new Error('Erro na autenticação: ' + error)
        }

        if (!code) {
          throw new Error('Código de autorização não encontrado')
        }

        // Simular troca do código por token
        setMessage('Validando credenciais...')
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Simular dados do usuário da UNIFOR
        const userData = {
          id: Date.now().toString(),
          name: 'Usuário UNIFOR',
          email: 'usuario@unifor.br',
          course: 'Ciência da Computação',
          university: 'UNIFOR',
          avatar: 'https://ui-avatars.com/api/?name=UNIFOR&background=003366&color=fff',
          isUniforUser: true
        }

        login(userData)
        setStatus('success')
        setMessage('Login realizado com sucesso!')
        
        toast.success('Bem-vindo à ProfAi!')
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          navigate('/editor')
        }, 2000)

      } catch (error) {
        console.error('Erro no callback OAuth:', error)
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Erro desconhecido')
        
        toast.error('Erro na autenticação')
        
        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }
    }

    handleCallback()
  }, [searchParams, login, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-unifor-blue via-blue-700 to-unifor-light-blue flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center"
      >
        <div className="mb-6">
          {status === 'loading' && (
            <Loader2 className="w-16 h-16 text-unifor-blue animate-spin mx-auto" />
          )}
          {status === 'success' && (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          )}
          {status === 'error' && (
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {status === 'loading' && 'Processando...'}
          {status === 'success' && 'Sucesso!'}
          {status === 'error' && 'Erro na Autenticação'}
        </h2>

        <p className="text-gray-600 mb-6">
          {message}
        </p>

        {status === 'loading' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              Aguarde enquanto validamos suas credenciais da UNIFOR...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700">
              Você será redirecionado para o editor em instantes.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">
              Você será redirecionado para a página de login.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default AuthCallback
