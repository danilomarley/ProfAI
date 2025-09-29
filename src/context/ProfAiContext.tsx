import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { ProfAiMessage, Achievement, ProfAiState, Correction, Citation } from '../types'
import { useEditor } from './EditorContext'

interface ProfAiContextType extends ProfAiState {
  sendMessage: (content: string) => void
  addMessage: (message: Omit<ProfAiMessage, 'id' | 'timestamp'>) => void
  markMessageAsRead: (messageId: string) => void
  toggleVisibility: () => void
  setSilentMode: (enabled: boolean) => void
  unlockAchievement: (achievementId: string) => void
  updateProgress: (progress: number) => void
  generateCorrectionMessage: (correction: any) => ProfAiMessage
  generateMotivationalMessage: () => ProfAiMessage
  analyzeText: (text: string) => Promise<Correction[]>
  suggestCitations: (text: string) => Promise<Citation[]>
  formatABNT: (text: string) => Promise<string>
  explainCorrection: (correction: Correction) => string
  getMotivationalMessage: () => string
  setPersonality: (personality: 'empática' | 'técnica' | 'motivadora') => void
}

const ProfAiContext = createContext<ProfAiContextType | undefined>(undefined)

export const useProfAi = () => {
  const context = useContext(ProfAiContext)
  if (context === undefined) {
    throw new Error('useProfAi must be used within a ProfAiProvider')
  }
  return context
}

interface ProfAiProviderProps {
  children: ReactNode
}

const initialAchievements: Achievement[] = [
  {
    id: 'first-upload',
    title: 'Primeiro Upload',
    description: 'Faça o upload do seu primeiro documento',
    icon: '📄',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'first-correction',
    title: 'Primeira Correção',
    description: 'Aceite sua primeira sugestão de correção',
    icon: '✅',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'chapter-complete',
    title: 'Capítulo Completo',
    description: 'Complete a revisão de um capítulo inteiro',
    icon: '📚',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'half-progress',
    title: 'Meio Caminho',
    description: 'Alcance 50% de progresso na revisão',
    icon: '🎯',
    progress: 0,
    maxProgress: 50,
  },
  {
    id: 'full-progress',
    title: 'Revisão Completa',
    description: 'Complete 100% da revisão do seu TCC',
    icon: '🏆',
    progress: 0,
    maxProgress: 100,
  },
]

const motivationalMessages = [
  "Você está no caminho certo! Cada correção te aproxima da excelência acadêmica. 💪",
  "Que orgulho ver seu progresso! Sua dedicação está rendendo frutos. 🌟",
  "Continue assim! Você está desenvolvendo habilidades valiosas para sua carreira. 🚀",
  "Cada palavra revisada é um passo em direção ao sucesso. Parabéns! 👏",
  "Sua persistência é inspiradora! O resultado final será incrível. ✨",
  "Você está se tornando um escritor cada vez melhor. Continue! 📝",
  "Cada capítulo revisado é uma vitória. Você está indo muito bem! 🎉",
  "Sua atenção aos detalhes fará toda a diferença. Continue focado! 🔍",
]

export const ProfAiProvider: React.FC<ProfAiProviderProps> = ({ children }) => {
  const { currentDocument, corrections } = useEditor()
  const [messages, setMessages] = useState<ProfAiMessage[]>([])
  const [isVisible, setIsVisible] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [currentStep, setCurrentStep] = useState<'welcome' | 'upload' | 'editing' | 'review' | 'export'>('welcome')
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements)
  const [progress, setProgress] = useState(0)
  const [silentMode, setSilentMode] = useState(false)
  const [personality, setPersonality] = useState<'empática' | 'técnica' | 'motivadora'>('empática')

  // Mensagem de boas-vindas inicial
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        type: 'welcome',
        content: "Olá! Sou a ProfAi, sua assistente virtual para revisão de TCC. Estou aqui para te ajudar a criar um trabalho acadêmico de excelência. Vamos começar? 🎓",
        read: false,
      })
    }
  }, [])

  // Atualizar progresso baseado nas correções
  useEffect(() => {
    if (corrections.length > 0) {
      const acceptedCorrections = corrections.filter(c => c.accepted).length
      const newProgress = (acceptedCorrections / corrections.length) * 100
      setProgress(newProgress)
      updateProgress(newProgress)
    }
  }, [corrections])

  const sendMessage = useCallback((content: string) => {
    const message: ProfAiMessage = {
      id: Date.now().toString(),
      type: 'tip',
      content,
      timestamp: new Date(),
      read: false,
    }
    setMessages(prev => [...prev, message])
  }, [])

  const addMessage = useCallback((message: Omit<ProfAiMessage, 'id' | 'timestamp'>) => {
    const newMessage: ProfAiMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, newMessage])
  }, [])

  const markMessageAsRead = useCallback((messageId: string) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === messageId 
          ? { ...message, read: true }
          : message
      )
    )
  }, [])

  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev)
  }, [])

  const unlockAchievement = useCallback((achievementId: string) => {
    setAchievements(prev => 
      prev.map(achievement => 
        achievement.id === achievementId 
          ? { ...achievement, unlockedAt: new Date(), progress: achievement.maxProgress }
          : achievement
      )
    )

    const achievement = achievements.find(a => a.id === achievementId)
    if (achievement) {
      addMessage({
        type: 'achievement',
        content: `🏆 Conquista desbloqueada: ${achievement.title}! ${achievement.description}`,
        read: false,
      })
    }
  }, [achievements, addMessage])

  const updateProgress = useCallback((newProgress: number) => {
    setProgress(newProgress)

    // Verificar conquistas baseadas no progresso
    if (newProgress >= 50 && !achievements.find(a => a.id === 'half-progress')?.unlockedAt) {
      unlockAchievement('half-progress')
    }
    if (newProgress >= 100 && !achievements.find(a => a.id === 'full-progress')?.unlockedAt) {
      unlockAchievement('full-progress')
    }

    // Adicionar mensagem motivacional ocasional
    if (newProgress > 0 && newProgress % 25 === 0 && !silentMode) {
      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
      addMessage({
        type: 'motivation',
        content: randomMessage,
        read: false,
      })
    }
  }, [achievements, unlockAchievement, silentMode, addMessage])

  const generateCorrectionMessage = useCallback((correction: any): ProfAiMessage => {
    const messages = {
      spelling: "🔤 Encontrei um erro de ortografia. Vamos corrigir para melhorar a qualidade do seu texto!",
      grammar: "📝 Há uma questão gramatical aqui. Esta correção tornará sua frase mais clara e correta.",
      style: "✨ Esta sugestão ajudará a tornar seu texto mais fluido e acadêmico.",
      abnt: "📋 Vamos ajustar a formatação para seguir as normas ABNT corretamente.",
      suggestion: "💡 Tenho uma sugestão para melhorar esta parte do seu texto.",
    }

    return {
      id: Date.now().toString(),
      type: 'correction',
      content: messages[correction.type] || messages.suggestion,
      timestamp: new Date(),
      read: false,
      action: {
        type: 'accept',
        label: 'Aceitar',
        correctionId: correction.id,
      },
    }
  }, [])

  const generateMotivationalMessage = useCallback((): ProfAiMessage => {
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
    return {
      id: Date.now().toString(),
      type: 'motivation',
      content: randomMessage,
      timestamp: new Date(),
      read: false,
    }
  }, [])

  // Análise de texto para correções
  const analyzeText = useCallback(async (text: string): Promise<Correction[]> => {
    // Simular análise de texto (em produção, seria integrado com APIs de NLP)
    const corrections: Correction[] = []
    
    // Detectar erros comuns de português
    const commonErrors = [
      { pattern: /\b(nao|naum|nao)\b/gi, correction: 'não', type: 'spelling' as const },
      { pattern: /\b(voce|vc)\b/gi, correction: 'você', type: 'style' as const },
      { pattern: /\b(pra|pro)\b/gi, correction: 'para', type: 'style' as const },
      { pattern: /\b(tbm|tb)\b/gi, correction: 'também', type: 'style' as const },
    ]

    commonErrors.forEach(({ pattern, correction, type }) => {
      let match
      while ((match = pattern.exec(text)) !== null) {
        corrections.push({
          id: Date.now().toString() + Math.random(),
          type,
          severity: 'warning',
          message: `Considere usar "${correction}" em vez de "${match[0]}"`,
          originalText: match[0],
          suggestedText: correction,
          position: {
            start: match.index,
            end: match.index + match[0].length
          },
          accepted: false,
          rejected: false
        })
      }
    })

    return corrections
  }, [])

  // Sugestão de citações
  const suggestCitations = useCallback(async (text: string): Promise<Citation[]> => {
    // Simular busca de citações (em produção, seria integrado com APIs acadêmicas)
    const citations: Citation[] = []
    
    // Detectar possíveis citações por palavras-chave
    const keywords = text.match(/\b(tecnologia|inteligência artificial|aprendizado|educação|universidade)\b/gi)
    
    if (keywords) {
      keywords.forEach((keyword, index) => {
        citations.push({
          id: Date.now().toString() + index,
          text: keyword,
          author: 'Autor Exemplo',
          year: 2023,
          title: `Título sobre ${keyword}`,
          source: 'Revista Acadêmica',
          type: 'article',
          abntFormat: `AUTOR, Nome. Título sobre ${keyword}. Revista Acadêmica, 2023.`
        })
      })
    }

    return citations
  }, [])

  // Formatação ABNT
  const formatABNT = useCallback(async (text: string): Promise<string> => {
    // Simular formatação ABNT básica
    let formattedText = text
    
    // Aplicar formatação básica
    formattedText = formattedText
      .replace(/\n\n+/g, '\n\n') // Normalizar quebras de linha
      .replace(/\s+/g, ' ') // Normalizar espaços
      .trim()

    return formattedText
  }, [])

  // Explicação de correções
  const explainCorrection = useCallback((correction: Correction): string => {
    const explanations = {
      spelling: "Esta correção melhora a ortografia do seu texto, tornando-o mais profissional e legível.",
      grammar: "Ajustar a gramática garante que sua mensagem seja transmitida de forma clara e correta.",
      style: "Esta sugestão torna seu texto mais fluido e adequado ao contexto acadêmico.",
      abnt: "Seguir as normas ABNT é essencial para trabalhos acadêmicos e demonstra profissionalismo.",
      suggestion: "Esta sugestão pode melhorar a qualidade geral do seu texto."
    }

    return explanations[correction.type] || explanations.suggestion
  }, [])

  // Mensagem motivacional baseada na personalidade
  const getMotivationalMessage = useCallback((): string => {
    const messages = {
      empática: [
        "Você está fazendo um trabalho incrível! Cada correção te aproxima da excelência. 💕",
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

    const personalityMessages = messages[personality]
    return personalityMessages[Math.floor(Math.random() * personalityMessages.length)]
  }, [personality])

  const value: ProfAiContextType = {
    messages,
    isVisible,
    isTyping,
    currentStep,
    achievements,
    progress,
    silentMode,
    personality,
    sendMessage,
    addMessage,
    markMessageAsRead,
    toggleVisibility,
    setSilentMode,
    unlockAchievement,
    updateProgress,
    generateCorrectionMessage,
    generateMotivationalMessage,
    analyzeText,
    suggestCitations,
    formatABNT,
    explainCorrection,
    getMotivationalMessage,
    setPersonality,
  }

  return (
    <ProfAiContext.Provider value={value}>
      {children}
    </ProfAiContext.Provider>
  )
}

