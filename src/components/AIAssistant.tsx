import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, CheckCircle, XCircle, Lightbulb, Zap, ChevronDown, ChevronUp } from 'lucide-react'
import { useEditor } from '../context/EditorContext'
import { useProfAi } from '../context/ProfAiContext'

interface AIAssistantProps {
  className?: string
}

const AIAssistant: React.FC<AIAssistantProps> = ({ className = '' }) => {
  const { corrections, acceptCorrection, rejectCorrection } = useEditor()
  const { isAnalyzing, getMotivationalMessage } = useProfAi()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [currentTip, setCurrentTip] = useState('')
  const [hoveredCorrection, setHoveredCorrection] = useState<string | null>(null)

  // Dicas da ProfAi
  const tips = [
    "💡 Use títulos hierárquicos (H1, H2, H3) para organizar seu TCC",
    "📝 Mantenha parágrafos com 3-5 linhas para melhor legibilidade",
    "🔍 Revise sempre a concordância verbal e nominal",
    "📚 Use citações diretas com menos de 3 linhas entre aspas",
    "✨ Prefira voz ativa ao invés de voz passiva quando possível",
    "📖 Mantenha consistência na formatação de referências",
    "🎯 Seja claro e objetivo na escrita acadêmica",
    "📊 Use conectivos para melhorar a coesão textual"
  ]

  useEffect(() => {
    // Atualizar dica periodicamente
    const interval = setInterval(() => {
      const randomTip = tips[Math.floor(Math.random() * tips.length)]
      setCurrentTip(randomTip)
    }, 10000) // A cada 10 segundos

    // Definir dica inicial
    setCurrentTip(tips[0])

    return () => clearInterval(interval)
  }, [])

  // Abrir automaticamente quando houver correções
  useEffect(() => {
    if (corrections.length > 0 && !isOpen) {
      setIsOpen(true)
    }
  }, [corrections.length])

  const pendingCorrections = corrections.filter(c => !c.accepted && !c.rejected)
  const acceptedCorrections = corrections.filter(c => c.accepted)

  const handleAcceptCorrection = (correctionId: string) => {
    acceptCorrection(correctionId)
    // Feedback visual
    setHoveredCorrection(null)
  }

  const handleRejectCorrection = (correctionId: string) => {
    rejectCorrection(correctionId)
    setHoveredCorrection(null)
  }

  return (
    <>
      {/* Botão flutuante da AI */}
      <motion.div
        className={`fixed bottom-6 right-6 z-50 ${className}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
            isOpen 
              ? 'bg-unifor-blue text-white' 
              : 'bg-white text-unifor-blue border-2 border-unifor-blue hover:bg-unifor-blue hover:text-white'
          }`}
        >
          <MessageCircle className="w-6 h-6" />
          
          {/* Badge de notificação */}
          {pendingCorrections.length > 0 && (
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {pendingCorrections.length}
            </motion.div>
          )}
          
          {/* Indicador de análise */}
          {isAnalyzing && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-blue-300"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          )}
        </button>
      </motion.div>

      {/* Painel da AI */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-unifor-blue to-blue-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">ProfAi</h3>
                    <p className="text-xs text-blue-100">Sua assistente de TCC</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                  >
                    {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 max-h-96 overflow-y-auto">
                    {/* Dica atual */}
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800">{currentTip}</p>
                      </div>
                    </div>

                    {/* Correções pendentes */}
                    {pendingCorrections.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                          <XCircle className="w-4 h-4 text-red-500 mr-2" />
                          Sugestões da ProfAi ({pendingCorrections.length})
                        </h4>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {pendingCorrections.map((correction) => (
                            <div
                              key={correction.id}
                              className={`p-3 rounded-lg border transition-all ${
                                correction.severity === 'error' 
                                  ? 'bg-red-50 border-red-200' 
                                  : correction.severity === 'warning'
                                  ? 'bg-yellow-50 border-yellow-200'
                                  : 'bg-blue-50 border-blue-200'
                              }`}
                              onMouseEnter={() => setHoveredCorrection(correction.id)}
                              onMouseLeave={() => setHoveredCorrection(null)}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                      correction.severity === 'error' 
                                        ? 'bg-red-100 text-red-700' 
                                        : correction.severity === 'warning'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-blue-100 text-blue-700'
                                    }`}>
                                      {correction.type === 'spelling' ? 'Ortografia' : 
                                       correction.type === 'grammar' ? 'Gramática' : 
                                       correction.type === 'style' ? 'Estilo' : 'ABNT'}
                                    </span>
                                    <span className={`text-xs ${
                                      correction.severity === 'error' 
                                        ? 'text-red-600' 
                                        : correction.severity === 'warning'
                                        ? 'text-yellow-600'
                                        : 'text-blue-600'
                                    }`}>
                                      {correction.severity === 'error' ? 'Erro' : 
                                       correction.severity === 'warning' ? 'Atenção' : 'Sugestão'}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 mb-2">{correction.explanation}</p>
                                  <div className="text-sm bg-white p-2 rounded border">
                                    <div className="flex items-center space-x-2">
                                      <span className="line-through text-red-600 font-mono">{correction.originalText}</span>
                                      <span className="text-gray-400">→</span>
                                      <span className="text-green-600 font-mono font-medium">{correction.suggestedText}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleAcceptCorrection(correction.id)}
                                  className="flex-1 px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors flex items-center justify-center space-x-1"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Aceitar</span>
                                </button>
                                <button
                                  onClick={() => handleRejectCorrection(correction.id)}
                                  className="flex-1 px-3 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors flex items-center justify-center space-x-1"
                                >
                                  <XCircle className="w-4 h-4" />
                                  <span>Rejeitar</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Correções aceitas */}
                    {acceptedCorrections.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Correções Aceitas ({acceptedCorrections.length})
                        </h4>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {acceptedCorrections.slice(-3).map((correction) => (
                            <div key={correction.id} className="p-2 bg-green-50 rounded border border-green-200">
                              <p className="text-xs text-green-800">
                                <span className="line-through text-gray-500">{correction.originalText}</span>
                                <span className="mx-2">→</span>
                                <span className="font-medium">{correction.suggestedText}</span>
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Estado vazio */}
                    {corrections.length === 0 && (
                      <div className="text-center py-6">
                        <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 mb-2">Tudo certo por aqui!</p>
                        <p className="text-xs text-gray-400">Continue escrevendo para receber sugestões</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AIAssistant
