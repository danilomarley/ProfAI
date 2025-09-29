import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Volume2, VolumeX, Trophy, Target } from 'lucide-react'
import { useProfAi } from '../context/ProfAiContext'
import { motion, AnimatePresence } from 'framer-motion'

const ProfAiPanel: React.FC = () => {
  const {
    messages,
    isVisible,
    isTyping,
    progress,
    achievements,
    silentMode,
    sendMessage,
    markMessageAsRead,
    toggleVisibility,
    setSilentMode,
  } = useProfAi()

  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className="fixed bottom-6 right-6 w-14 h-14 bg-unifor-blue hover:bg-blue-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    )
  }

  const unlockedAchievements = achievements.filter(a => a.unlockedAt)
  const recentMessages = messages.slice(-5)

  return (
    <motion.div
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      className="w-80 bg-white shadow-xl border-l border-gray-200 flex flex-col h-screen"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-unifor-blue to-unifor-light-blue p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold">ProfAi</h3>
              <p className="text-xs opacity-90">Sua assistente virtual</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSilentMode(!silentMode)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              title={silentMode ? 'Ativar notificações' : 'Modo silencioso'}
            >
              {silentMode ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleVisibility}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span>Progresso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="p-4 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-center space-x-2 mb-2">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Conquistas</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {unlockedAchievements.slice(-3).map((achievement) => (
              <div
                key={achievement.id}
                className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"
                title={achievement.description}
              >
                {achievement.icon} {achievement.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {recentMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`profai-message ${message.read ? 'opacity-70' : ''}`}
              onClick={() => markMessageAsRead(message.id)}
            >
              <p className="text-sm">{message.content}</p>
              {message.action && (
                <button
                  className="mt-2 text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Handle action
                  }}
                >
                  {message.action.label}
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="profai-message"
          >
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              <span className="text-sm">ProfAi está digitando...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && inputValue.trim()) {
                sendMessage(inputValue.trim())
                setInputValue('')
              }
            }}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unifor-light-blue focus:border-transparent text-sm"
          />
          <button
            onClick={() => {
              if (inputValue.trim()) {
                sendMessage(inputValue.trim())
                setInputValue('')
              }
            }}
            className="p-2 bg-unifor-blue hover:bg-blue-800 text-white rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProfAiPanel

