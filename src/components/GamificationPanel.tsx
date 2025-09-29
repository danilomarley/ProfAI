import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Target, Star, Zap, Award, TrendingUp, Calendar, CheckCircle, FileText } from 'lucide-react'
import { Achievement, ProfAiMessage } from '../types'
import { useProfAi } from '../context/ProfAiContext'
import { useEditor } from '../context/EditorContext'

interface GamificationPanelProps {
  className?: string
}

const GamificationPanel: React.FC<GamificationPanelProps> = ({ className = '' }) => {
  const { achievements, progress, messages, personality, getMotivationalMessage } = useProfAi()
  const { currentDocument, corrections } = useEditor()
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([])
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationMessage, setCelebrationMessage] = useState('')

  // Detectar conquistas recentes
  useEffect(() => {
    const newlyUnlocked = achievements.filter(achievement => 
      achievement.unlockedAt && 
      new Date(achievement.unlockedAt).getTime() > Date.now() - 5000
    )
    
    if (newlyUnlocked.length > 0) {
      setRecentAchievements(newlyUnlocked)
      setShowCelebration(true)
      setCelebrationMessage(`🎉 ${newlyUnlocked[0].title}! ${newlyUnlocked[0].description}`)
      
      setTimeout(() => {
        setShowCelebration(false)
      }, 5000)
    }
  }, [achievements])

  const getAchievementIcon = (achievement: Achievement) => {
    switch (achievement.id) {
      case 'first-upload':
        return <Target className="w-6 h-6 text-blue-500" />
      case 'first-correction':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'chapter-complete':
        return <Star className="w-6 h-6 text-yellow-500" />
      case 'half-progress':
        return <TrendingUp className="w-6 h-6 text-orange-500" />
      case 'full-progress':
        return <Trophy className="w-6 h-6 text-purple-500" />
      default:
        return <Award className="w-6 h-6 text-gray-500" />
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'from-red-500 to-red-600'
    if (progress < 50) return 'from-orange-500 to-orange-600'
    if (progress < 75) return 'from-yellow-500 to-yellow-600'
    if (progress < 100) return 'from-blue-500 to-blue-600'
    return 'from-green-500 to-green-600'
  }

  const getMotivationalQuote = () => {
    const quotes = {
      empática: [
        "Você está fazendo um trabalho incrível! Cada passo te aproxima da excelência. 💕",
        "Estou orgulhosa do seu progresso! Continue assim, você está indo muito bem! 🌟",
        "Seu esforço não passa despercebido. Você está se tornando um escritor excepcional! ✨"
      ],
      técnica: [
        "Análise: Seu progresso está dentro dos parâmetros esperados. Continue seguindo as correções sugeridas.",
        "Dados: 85% de precisão nas correções aplicadas. Performance acima da média.",
        "Resultado: Sua metodologia de revisão está sendo eficaz. Mantenha o foco."
      ],
      motivadora: [
        "VAMOS LÁ! Você está arrasando! Cada palavra revisada é uma vitória! 🚀",
        "ISSO AÍ! Seu TCC vai ficar PERFEITO! Continue com essa energia! 💪",
        "VOCÊ CONSEGUE! Estamos quase lá! Mais um pouco e será um trabalho de EXCELÊNCIA! 🏆"
      ]
    }
    
    const personalityQuotes = quotes[personality] || quotes.empática
    return personalityQuotes[Math.floor(Math.random() * personalityQuotes.length)]
  }

  const unlockedAchievements = achievements.filter(a => a.unlockedAt)
  const totalAchievements = achievements.length
  const unlockedPercentage = (unlockedAchievements.length / totalAchievements) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-lg p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-unifor-blue" />
          Seu Progresso
        </h3>
        <div className="text-sm text-gray-500">
          {unlockedAchievements.length}/{totalAchievements} conquistas
        </div>
      </div>

      {/* Barra de Progresso Principal */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progresso Geral</span>
          <span className="text-sm font-bold text-unifor-blue">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor(progress)}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {progress < 25 && "Começando bem! Continue assim!"}
          {progress >= 25 && progress < 50 && "Ótimo progresso! Você está no caminho certo!"}
          {progress >= 50 && progress < 75 && "Excelente! Mais da metade concluída!"}
          {progress >= 75 && progress < 100 && "Quase lá! Falta pouco para terminar!"}
          {progress >= 100 && "Parabéns! Tarefa concluída com sucesso!"}
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-blue-700">{corrections.length}</p>
              <p className="text-sm text-blue-600">Correções</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-green-700">
                {corrections.filter(c => c.accepted).length}
              </p>
              <p className="text-sm text-green-600">Aceitas</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-purple-700">
                {currentDocument?.wordCount || 0}
              </p>
              <p className="text-sm text-purple-600">Palavras</p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-orange-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-orange-700">
                {Math.ceil((Date.now() - (currentDocument?.createdAt?.getTime() || Date.now())) / (1000 * 60 * 60 * 24))}
              </p>
              <p className="text-sm text-orange-600">Dias</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conquistas */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
          <Award className="w-4 h-4 mr-2 text-unifor-blue" />
          Conquistas
        </h4>
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-3 rounded-lg border-2 transition-all ${
                achievement.unlockedAt
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                {getAchievementIcon(achievement)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-gray-900">
                      {achievement.title}
                    </h5>
                    {achievement.unlockedAt && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {achievement.description}
                  </p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-unifor-blue to-unifor-light-blue h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {achievement.progress}/{achievement.maxProgress}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mensagem Motivacional */}
      <div className="bg-gradient-to-r from-unifor-blue to-unifor-light-blue rounded-lg p-4 text-white">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="w-5 h-5" />
          <span className="font-medium">Motivação do Dia</span>
        </div>
        <p className="text-sm">{getMotivationalQuote()}</p>
      </div>

      {/* Celebração de Conquista */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              className="bg-white rounded-lg p-8 max-w-md mx-4 text-center"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                🎉 Parabéns! 🎉
              </h3>
              <p className="text-gray-600 mb-4">
                {celebrationMessage}
              </p>
              <button
                onClick={() => setShowCelebration(false)}
                className="btn-primary"
              >
                Continuar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default GamificationPanel
