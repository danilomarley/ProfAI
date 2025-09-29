import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FileText, Settings, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { ABNTFormatting, Citation, Reference } from '../types'
import { useProfAi } from '../context/ProfAiContext'

interface ABNTFormatterProps {
  onApplyFormatting: (formattedText: string) => void
  className?: string
}

const ABNTFormatter: React.FC<ABNTFormatterProps> = ({ onApplyFormatting, className = '' }) => {
  const { formatABNT, suggestCitations } = useProfAi()
  const [isProcessing, setIsProcessing] = useState(false)
  const [formattingOptions, setFormattingOptions] = useState<ABNTFormatting[]>([
    {
      id: 'margins',
      type: 'margins',
      applied: false,
      settings: { top: '3cm', bottom: '2cm', left: '3cm', right: '2cm' },
      description: 'Ajustar margens conforme ABNT NBR 14724'
    },
    {
      id: 'spacing',
      type: 'spacing',
      applied: false,
      settings: { lineHeight: '1.5', paragraphSpacing: '6pt' },
      description: 'Configurar espaçamento entre linhas e parágrafos'
    },
    {
      id: 'font',
      type: 'font',
      applied: false,
      settings: { family: 'Times New Roman', size: '12pt' },
      description: 'Aplicar fonte Times New Roman 12pt'
    },
    {
      id: 'titles',
      type: 'titles',
      applied: false,
      settings: { hierarchy: true, numbering: true },
      description: 'Formatar títulos e subtítulos com numeração'
    },
    {
      id: 'citations',
      type: 'citations',
      applied: false,
      settings: { style: 'author-year', brackets: true },
      description: 'Formatar citações no padrão autor-data'
    },
    {
      id: 'references',
      type: 'references',
      applied: false,
      settings: { alphabetical: true, hanging: true },
      description: 'Organizar referências em ordem alfabética'
    }
  ])

  const [citations, setCitations] = useState<Citation[]>([])
  const [references, setReferences] = useState<Reference[]>([])

  const handleFormattingToggle = useCallback((formattingId: string) => {
    setFormattingOptions(prev =>
      prev.map(option =>
        option.id === formattingId
          ? { ...option, applied: !option.applied }
          : option
      )
    )
  }, [])

  const handleApplyFormatting = useCallback(async () => {
    setIsProcessing(true)
    try {
      // Simular formatação ABNT
      let formattedText = ''
      
      // Aplicar formatações selecionadas
      const appliedFormats = formattingOptions.filter(option => option.applied)
      
      for (const format of appliedFormats) {
        switch (format.type) {
          case 'margins':
            formattedText += `/* Margens: ${format.settings.top} ${format.settings.right} ${format.settings.bottom} ${format.settings.left} */\n`
            break
          case 'spacing':
            formattedText += `/* Espaçamento: ${format.settings.lineHeight} entre linhas, ${format.settings.paragraphSpacing} entre parágrafos */\n`
            break
          case 'font':
            formattedText += `/* Fonte: ${format.settings.family} ${format.settings.size} */\n`
            break
          case 'titles':
            formattedText += `/* Títulos formatados com numeração hierárquica */\n`
            break
          case 'citations':
            formattedText += `/* Citações formatadas no padrão autor-data */\n`
            break
          case 'references':
            formattedText += `/* Referências organizadas alfabeticamente */\n`
            break
        }
      }

      // Aplicar formatação real
      const result = await formatABNT(formattedText)
      onApplyFormatting(result)
      
    } catch (error) {
      console.error('Erro na formatação ABNT:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [formattingOptions, formatABNT, onApplyFormatting])

  const handleSuggestCitations = useCallback(async () => {
    try {
      const suggestedCitations = await suggestCitations('texto de exemplo')
      setCitations(suggestedCitations)
    } catch (error) {
      console.error('Erro ao sugerir citações:', error)
    }
  }, [suggestCitations])

  const getFormattingIcon = (type: string) => {
    switch (type) {
      case 'margins':
        return <FileText className="w-5 h-5 text-blue-500" />
      case 'spacing':
        return <Settings className="w-5 h-5 text-green-500" />
      case 'font':
        return <FileText className="w-5 h-5 text-purple-500" />
      case 'titles':
        return <FileText className="w-5 h-5 text-orange-500" />
      case 'citations':
        return <FileText className="w-5 h-5 text-red-500" />
      case 'references':
        return <FileText className="w-5 h-5 text-indigo-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-lg p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-unifor-blue" />
          Formatação ABNT
        </h3>
        <button
          onClick={handleApplyFormatting}
          disabled={isProcessing}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Formatando...' : 'Aplicar Formatação'}
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formattingOptions.map((option) => (
            <div
              key={option.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                option.applied
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleFormattingToggle(option.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getFormattingIcon(option.type)}
                  <div>
                    <h4 className="font-medium text-gray-900 capitalize">
                      {option.type}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {option.applied ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sugestões de Citações */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900">
              Sugestões de Citações
            </h4>
            <button
              onClick={handleSuggestCitations}
              className="text-sm text-unifor-blue hover:underline"
            >
              Buscar Citações
            </button>
          </div>

          {citations.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {citations.map((citation) => (
                <div
                  key={citation.id}
                  className="p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {citation.author} ({citation.year})
                      </p>
                      <p className="text-xs text-gray-600">
                        {citation.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {citation.abntFormat}
                      </p>
                    </div>
                    <button className="text-xs text-unifor-blue hover:underline">
                      Adicionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status da Formatação */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Info className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Formatação ABNT NBR 14724
              </p>
              <p className="text-xs text-blue-700">
                A formatação será aplicada seguindo as normas da ABNT para trabalhos acadêmicos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ABNTFormatter
