import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, User, Mail, GraduationCap, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login, loginWithUNIFOR } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    university: 'UNIFOR',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simular autenticação OAuth2/SSO da UNIFOR
      // Em produção, aqui seria feita a integração real
      await new Promise(resolve => setTimeout(resolve, 2000))

      const user = {
        id: Date.now().toString(),
        ...formData,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=0091EA&color=fff`,
      }

      login(user)
      toast.success('Login realizado com sucesso!')
      navigate('/editor')
    } catch (error) {
      toast.error('Erro ao fazer login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleUNIFORLogin = async () => {
    try {
      setIsLoading(true)
      await loginWithUNIFOR()
    } catch (error) {
      toast.error('Erro ao conectar com a UNIFOR')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-unifor-blue via-blue-700 to-unifor-light-blue flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Acesse sua conta
          </h2>
          <p className="mt-2 text-sm text-blue-100">
            Faça login com suas credenciais da UNIFOR
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="seu.email@unifor.br"
                />
              </div>
            </div>

            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                Curso
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  id="course"
                  name="course"
                  required
                  value={formData.course}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                >
                  <option value="">Selecione seu curso</option>
                  <option value="Administração">Administração</option>
                  <option value="Ciência da Computação">Ciência da Computação</option>
                  <option value="Engenharia de Software">Engenharia de Software</option>
                  <option value="Direito">Direito</option>
                  <option value="Medicina">Medicina</option>
                  <option value="Psicologia">Psicologia</option>
                  <option value="Jornalismo">Jornalismo</option>
                  <option value="Publicidade e Propaganda">Publicidade e Propaganda</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                Universidade
              </label>
              <input
                id="university"
                name="university"
                type="text"
                disabled
                value={formData.university}
                className="input-field bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Integração UNIFOR
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Em produção, este sistema será integrado ao OAuth2/SSO da UNIFOR para autenticação automática.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={handleUNIFORLogin}
                disabled={isLoading}
                className="w-full bg-unifor-blue hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Shield className="w-5 h-5 mr-2" />
                {isLoading ? 'Conectando...' : 'Entrar com SSO UNIFOR'}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-secondary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Entrando...
                  </div>
                ) : (
                  'Entrar (Modo Demo)'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Ao fazer login, você concorda com nossos{' '}
              <a href="#" className="text-unifor-blue hover:underline">
                Termos de Uso
              </a>{' '}
              e{' '}
              <a href="#" className="text-unifor-blue hover:underline">
                Política de Privacidade
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login

