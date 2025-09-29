import React from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Users, 
  Target, 
  Award, 
  Heart, 
  Lightbulb,
  CheckCircle,
  Globe,
  Shield,
  Zap
} from 'lucide-react'

const About: React.FC = () => {
  const team = [
    {
      name: 'Equipe ProfAi',
      role: 'Desenvolvimento',
      description: 'Especialistas em IA e desenvolvimento web',
      avatar: '👥',
    },
    {
      name: 'Professores UNIFOR',
      role: 'Consultoria Acadêmica',
      description: 'Orientação pedagógica e revisão de conteúdo',
      avatar: '🎓',
    },
    {
      name: 'Estudantes',
      role: 'Testadores Beta',
      description: 'Feedback e sugestões de melhoria',
      avatar: '👨‍🎓',
    },
  ]

  const values = [
    {
      icon: Heart,
      title: 'Paixão pela Educação',
      description: 'Acreditamos no poder transformador da educação e no potencial de cada estudante.',
    },
    {
      icon: Lightbulb,
      title: 'Inovação Tecnológica',
      description: 'Utilizamos as mais avançadas tecnologias para criar soluções educacionais eficazes.',
    },
    {
      icon: Shield,
      title: 'Qualidade e Confiabilidade',
      description: 'Garantimos a qualidade e precisão de todas as correções e sugestões.',
    },
    {
      icon: Globe,
      title: 'Acessibilidade',
      description: 'Nossa plataforma é acessível para todos os estudantes, independente de suas necessidades.',
    },
  ]

  const features = [
    {
      icon: BookOpen,
      title: 'Editor Inteligente',
      description: 'Correções em tempo real com IA avançada',
    },
    {
      icon: Target,
      title: 'Formatação ABNT',
      description: 'Aplicação automática das normas acadêmicas',
    },
    {
      icon: Award,
      title: 'Gamificação',
      description: 'Sistema de conquistas e progresso motivacional',
    },
    {
      icon: Zap,
      title: 'Assistente ProfAi',
      description: 'Orientação personalizada e suporte contínuo',
    },
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
              Sobre o <span className="text-yellow-300">ProfAi</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
              Uma plataforma revolucionária que combina inteligência artificial com pedagogia 
              para transformar a experiência de escrita acadêmica
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Nossa Missão
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Democratizar o acesso à revisão acadêmica de qualidade, oferecendo uma ferramenta 
              inteligente que não apenas corrige textos, mas ensina e motiva estudantes a 
              desenvolverem suas habilidades de escrita científica.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-unifor-light-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-unifor-blue" />
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

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Nossos Valores
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Os princípios que guiam nossa missão e desenvolvimento
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-unifor-light-blue bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-unifor-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-600">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Nossa Equipe
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profissionais dedicados a criar a melhor experiência educacional
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-24 h-24 bg-unifor-light-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                  {member.avatar}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-unifor-blue font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-gray-600">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Tecnologia de Ponta
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Utilizamos as mais avançadas tecnologias para garantir precisão e eficiência
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'React', description: 'Interface moderna e responsiva' },
              { name: 'Node.js', description: 'Backend robusto e escalável' },
              { name: 'PostgreSQL', description: 'Banco de dados confiável' },
              { name: 'IA/ML', description: 'Algoritmos de correção inteligentes' },
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card text-center hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {tech.name}
                </h3>
                <p className="text-gray-600">
                  {tech.description}
                </p>
              </motion.div>
            ))}
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
              Junte-se à Revolução Educacional
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Faça parte da nova geração de estudantes que escrevem melhor com a ProfAi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-secondary text-lg px-8 py-4">
                Começar Agora
              </button>
              <button className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-unifor-blue">
                Saiba Mais
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About

