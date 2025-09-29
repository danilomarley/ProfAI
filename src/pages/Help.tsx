import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Search, 
  MessageCircle, 
  FileText, 
  Settings, 
  Download,
  Upload,
  Edit3,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = [
    {
      id: 'getting-started',
      title: 'Primeiros Passos',
      icon: BookOpen,
      articles: [
        {
          title: 'Como fazer login',
          content: 'Para acessar o sistema, use suas credenciais da UNIFOR...',
        },
        {
          title: 'Criando seu primeiro documento',
          content: 'Clique em "Novo Documento" e comece a escrever...',
        },
        {
          title: 'Fazendo upload de arquivos',
          content: 'Arraste arquivos .docx ou .pdf para a área de upload...',
        },
      ]
    },
    {
      id: 'editor',
      title: 'Editor de Texto',
      icon: Edit3,
      articles: [
        {
          title: 'Formatação básica',
          content: 'Use a barra de ferramentas para aplicar negrito, itálico...',
        },
        {
          title: 'Modos de visualização',
          content: 'Alternar entre original, corrigido e comparativo...',
        },
        {
          title: 'Atalhos de teclado',
          content: 'Ctrl+S para salvar, Ctrl+B para negrito...',
        },
      ]
    },
    {
      id: 'corrections',
      title: 'Sistema de Correções',
      icon: CheckCircle,
      articles: [
        {
          title: 'Tipos de correções',
          content: 'Ortografia, gramática, estilo e formatação ABNT...',
        },
        {
          title: 'Aceitar ou rejeitar sugestões',
          content: 'Clique em "Aceitar" ou "Rejeitar" para cada correção...',
        },
        {
          title: 'Painel de correções',
          content: 'Visualize todas as correções no painel lateral...',
        },
      ]
    },
    {
      id: 'profai',
      title: 'Assistente ProfAi',
      icon: MessageCircle,
      articles: [
        {
          title: 'Como funciona a ProfAi',
          content: 'A ProfAi é sua assistente virtual para revisão de TCC...',
        },
        {
          title: 'Mensagens e notificações',
          content: 'Receba dicas e orientações personalizadas...',
        },
        {
          title: 'Sistema de conquistas',
          content: 'Desbloqueie conquistas conforme seu progresso...',
        },
      ]
    },
    {
      id: 'abnt',
      title: 'Formatação ABNT',
      icon: FileText,
      articles: [
        {
          title: 'Aplicação automática',
          content: 'O sistema aplica formatação ABNT automaticamente...',
        },
        {
          title: 'Templates disponíveis',
          content: 'Use templates prontos para capa, sumário, referências...',
        },
        {
          title: 'Citações e referências',
          content: 'Gere citações e referências no padrão ABNT...',
        },
      ]
    },
    {
      id: 'export',
      title: 'Exportação',
      icon: Download,
      articles: [
        {
          title: 'Formatos suportados',
          content: 'Exporte em .docx e .pdf mantendo a formatação...',
        },
        {
          title: 'Configurações de exportação',
          content: 'Personalize metadados e configurações...',
        },
      ]
    }
  ]

  const faqs = [
    {
      question: 'Posso usar o sistema sem estar logado?',
      answer: 'Não, é necessário fazer login com suas credenciais da UNIFOR para acessar todas as funcionalidades.',
    },
    {
      question: 'Quais formatos de arquivo são suportados?',
      answer: 'Atualmente suportamos arquivos .docx (Word) e .pdf para upload e edição.',
    },
    {
      question: 'As correções são automáticas?',
      answer: 'Sim, o sistema detecta automaticamente erros de ortografia, gramática e formatação, mas você pode aceitar ou rejeitar cada sugestão.',
    },
    {
      question: 'Posso restaurar versões anteriores?',
      answer: 'Sim, o sistema salva automaticamente versões do seu documento que podem ser restauradas a qualquer momento.',
    },
    {
      question: 'Como funciona a integração com a UNIFOR?',
      answer: 'O sistema está integrado ao OAuth2/SSO da UNIFOR para autenticação automática e segura.',
    },
  ]

  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.articles.some(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Central de Ajuda</h1>
          <p className="text-xl text-gray-600 mb-8">
            Encontre respostas para suas dúvidas e aprenda a usar todas as funcionalidades
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar ajuda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unifor-light-blue focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {filteredCategories.map((category, categoryIndex) => {
                const Icon = category.icon
                const isActive = activeCategory === category.id

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                  >
                    <button
                      onClick={() => setActiveCategory(isActive ? null : category.id)}
                      className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-unifor-light-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-unifor-blue" />
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                              {category.title}
                            </h2>
                            <p className="text-sm text-gray-600">
                              {category.articles.length} artigos
                            </p>
                          </div>
                        </div>
                        {isActive ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-200"
                      >
                        <div className="p-6 space-y-4">
                          {category.articles.map((article, articleIndex) => (
                            <div
                              key={articleIndex}
                              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                              <h3 className="font-medium text-gray-900 mb-2">
                                {article.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {article.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <MessageCircle className="w-5 h-5 text-unifor-blue" />
                    <span className="text-sm font-medium">Falar com ProfAi</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <Settings className="w-5 h-5 text-unifor-blue" />
                    <span className="text-sm font-medium">Configurações</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <FileText className="w-5 h-5 text-unifor-blue" />
                    <span className="text-sm font-medium">Templates ABNT</span>
                  </button>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Perguntas Frequentes</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {faq.question}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="bg-gradient-to-r from-unifor-blue to-unifor-light-blue rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Precisa de mais ajuda?</h3>
                <p className="text-sm text-blue-100 mb-4">
                  Nossa equipe está sempre pronta para ajudar você.
                </p>
                <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Entrar em Contato
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Help

