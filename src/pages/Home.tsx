import React from 'react'
import { Link } from 'react-router-dom'
import { Upload, BookOpen, Target, Award, Users, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: Upload,
      title: 'Upload Inteligente',
      description: 'Faça upload de seus documentos .docx e .pdf para edição online',
    },
    {
      icon: BookOpen,
      title: 'Editor Avançado',
      description: 'Editor com correções em tempo real e formatação ABNT automática',
    },
    {
      icon: Target,
      title: 'Correções Precisas',
      description: 'Ortografia, gramática, estilo e formatação acadêmica',
    },
    {
      icon: Award,
      title: 'Gamificação',
      description: 'Conquistas e progresso para manter sua motivação',
    },
    {
      icon: Users,
      title: 'Assistente ProfAi',
      description: 'Sua professora virtual para orientação personalizada',
    },
    {
      icon: Zap,
      title: 'Exportação Rápida',
      description: 'Exporte seu TCC finalizado em .docx e .pdf',
    },
  ]

  const stats = [
    { number: '1000+', label: 'TCCs Revisados' },
    { number: '95%', label: 'Satisfação' },
    { number: '50+', label: 'Cursos Atendidos' },
    { number: '24/7', label: 'Disponibilidade' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-unifor-blue via-blue-700 to-unifor-light-blue text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Seu TCC, corrigido e formatado com apoio da{' '}
              <span className="text-yellow-300">ProfAi</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Editor inteligente com assistente virtual que revisa, corrige e formata seu trabalho acadêmico seguindo as normas ABNT
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/editor" className="btn-secondary text-lg px-8 py-4">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Ir para o Editor
                </Link>
              ) : (
                <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                  Começar Agora
                </Link>
              )}
              <Link to="/about" className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-unifor-blue">
                Saiba Mais
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-unifor-blue mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades Principais
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tudo que você precisa para criar um TCC de excelência acadêmica
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-unifor-light-blue bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-unifor-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-unifor-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para transformar seu TCC?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Junte-se a centenas de estudantes que já melhoraram seus trabalhos acadêmicos com a ProfAi
            </p>
            {!isAuthenticated && (
              <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                Começar Gratuitamente
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home

