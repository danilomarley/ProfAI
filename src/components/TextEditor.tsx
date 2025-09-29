import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Correction, EditorState } from '../types'
import { useEditor } from '../context/EditorContext'
import { useProfAi } from '../context/ProfAiContext'
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'

interface TextEditorProps {
  className?: string
}

const TextEditor: React.FC<TextEditorProps> = ({ className = '' }) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const { currentDocument, corrections, viewMode, isLoading, isSaving, addCorrection, acceptCorrection, rejectCorrection, updateDocument } = useEditor()
  const { analyzeText, explainCorrection } = useProfAi()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedCorrection, setSelectedCorrection] = useState<Correction | null>(null)

  // Análise automática do texto
  const analyzeContent = useCallback(async (text: string) => {
    if (!text.trim()) return

    setIsAnalyzing(true)
    try {
      const newCorrections = await analyzeText(text)
      newCorrections.forEach(correction => {
        addCorrection(correction)
      })
    } catch (error) {
      console.error('Erro na análise do texto:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [analyzeText, addCorrection])

  // Debounced analysis
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentDocument?.content) {
        analyzeContent(currentDocument.content)
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [currentDocument?.content, analyzeContent])

  const handleInput = useCallback(() => {
    if (editorRef.current && currentDocument) {
      const newContent = editorRef.current.innerHTML
      updateDocument({
        ...currentDocument,
        content: newContent,
        updatedAt: new Date()
      })
    }
  }, [currentDocument, updateDocument])

  const renderContentWithCorrections = () => {
    if (!currentDocument?.content) return ''

    let content = currentDocument.content

    if (viewMode === 'original') {
      return content
    }

    if (viewMode === 'corrected') {
      corrections
        .filter(c => c.accepted)
        .forEach(correction => {
          const originalText = correction.originalText
          const suggestedText = correction.suggestedText
          content = content.replace(originalText, suggestedText)
        })
      return content
    }

    if (viewMode === 'comparative') {
      // Aplicar todas as correções com destaque visual
      corrections.forEach(correction => {
        const originalText = correction.originalText
        const suggestedText = correction.suggestedText
        
        if (correction.accepted) {
          content = content.replace(originalText, `<span class="text-green-600 underline">${suggestedText}</span>`)
        } else if (correction.rejected) {
          content = content.replace(originalText, `<span class="text-red-500 line-through">${originalText}</span>`)
        } else {
          content = content.replace(originalText, `<span class="text-yellow-500 bg-yellow-100 px-1 rounded cursor-pointer" data-correction-id="${correction.id}">${originalText}</span>`)
        }
      })
      return content
    }

    return content
  }

  const handleCorrectionClick = (correctionId: string) => {
    const correction = corrections.find(c => c.id === correctionId)
    if (correction) {
      setSelectedCorrection(correction)
    }
  }

  const getCorrectionIcon = (correction: Correction) => {
    switch (correction.severity) {
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'suggestion':
        return <Info className="w-4 h-4 text-blue-500" />
      default:
        return <Info className="w-4 h-4 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <div className={`flex-1 bg-white rounded-lg shadow-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-unifor-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando editor...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex-1 bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
      role="main"
      aria-label="Editor de texto"
    >
    <div className="h-full flex flex-col">
        {/* Toolbar */}
        <div className="bg-gray-50 border-b border-gray-200 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-sm font-medium text-gray-700">
                Modo: {viewMode === 'original' ? 'Original' : viewMode === 'corrected' ? 'Corrigido' : 'Comparativo'}
              </span>
              {isAnalyzing && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Analisando...</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {corrections.length} correções encontradas
              </span>
              {isSaving && (
                <span className="text-sm text-green-600">Salvando...</span>
              )}
            </div>
          </div>
      </div>

        {/* Editor */}
        <div className="flex-1 p-4 sm:p-6 relative">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className="min-h-full outline-none prose prose-sm sm:prose-lg max-w-none focus:outline-none"
            dangerouslySetInnerHTML={{ __html: renderContentWithCorrections() }}
            onClick={(e) => {
              const target = e.target as HTMLElement
              if (target.dataset.correctionId) {
                handleCorrectionClick(target.dataset.correctionId)
              }
            }}
            role="textbox"
            aria-label="Editor de texto do documento"
            tabIndex={0}
          />
        </div>

        {/* Corrections Panel */}
        {corrections.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Correções Sugeridas</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {corrections.slice(0, 5).map((correction) => (
                <div
                  key={correction.id}
                  className={`flex items-center justify-between p-2 rounded-lg border ${
                    correction.accepted ? 'bg-green-50 border-green-200' :
                    correction.rejected ? 'bg-red-50 border-red-200' :
                    'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {getCorrectionIcon(correction)}
                    <span className="text-sm text-gray-700">{correction.message}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!correction.accepted && !correction.rejected && (
                      <>
                        <button
                          onClick={() => acceptCorrection(correction.id)}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                          title="Aceitar correção"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => rejectCorrection(correction.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Rejeitar correção"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Correction Details Modal */}
        {selectedCorrection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Detalhes da Correção
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Tipo:</p>
                  <p className="text-sm font-medium">{selectedCorrection.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Mensagem:</p>
                  <p className="text-sm">{selectedCorrection.message}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Explicação:</p>
                  <p className="text-sm">{explainCorrection(selectedCorrection)}</p>
                  </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setSelectedCorrection(null)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Fechar
                  </button>
                </div>
              </div>
              </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default TextEditor