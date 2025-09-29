import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useEditor } from '../context/EditorContext'
import { useProfAi } from '../context/ProfAiContext'

interface SimpleTextEditorProps {
  className?: string
}

const SimpleTextEditor: React.FC<SimpleTextEditorProps> = ({ className = '' }) => {
  const { currentDocument, updateContent, corrections, analyzeText } = useEditor()
  const { isAnalyzing } = useProfAi()
  const [editorValue, setEditorValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Atualizar o valor do editor quando o documento mudar
  useEffect(() => {
    if (currentDocument) {
      setEditorValue(currentDocument.content)
    }
  }, [currentDocument])

  // Debounce para análise de texto
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (editorValue.length > 10) {
        analyzeText(editorValue)
      }
    }, 2000) // Aguarda 2 segundos após parar de digitar

    return () => clearTimeout(timeoutId)
  }, [editorValue, analyzeText])

  // Função para lidar com mudanças no editor
  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setEditorValue(value)
    updateContent(value)
  }

  // Função para aplicar formatação
  const applyFormatting = (format: string) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = editorValue.substring(start, end)
    
    let formattedText = ''
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'texto em negrito'}**`
        break
      case 'italic':
        formattedText = `*${selectedText || 'texto em itálico'}*`
        break
      case 'underline':
        formattedText = `<u>${selectedText || 'texto sublinhado'}</u>`
        break
      case 'h1':
        formattedText = `# ${selectedText || 'Título 1'}`
        break
      case 'h2':
        formattedText = `## ${selectedText || 'Título 2'}`
        break
      case 'h3':
        formattedText = `### ${selectedText || 'Título 3'}`
        break
      case 'list':
        formattedText = `- ${selectedText || 'Item da lista'}`
        break
      case 'orderedList':
        formattedText = `1. ${selectedText || 'Item numerado'}`
        break
      case 'quote':
        formattedText = `> ${selectedText || 'Citação'}`
        break
      case 'link':
        formattedText = `[${selectedText || 'texto do link'}](url)`
        break
      default:
        formattedText = selectedText
    }

    const newValue = editorValue.substring(0, start) + formattedText + editorValue.substring(end)
    setEditorValue(newValue)
    updateContent(newValue)
    
    // Reposicionar cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(start + formattedText.length, start + formattedText.length)
      }
    }, 0)
  }

  // Função para renderizar texto com destaques
  const renderTextWithHighlights = () => {
    if (corrections.length === 0) return editorValue

    let highlightedText = editorValue
    
    // Aplicar destaques para cada correção
    corrections.forEach((correction, index) => {
      const className = correction.accepted ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800 line-through'
      const replacement = `<span class="${className}" title="${correction.message}">${correction.originalText}</span>`
      highlightedText = highlightedText.replace(correction.originalText, replacement)
    })

    return highlightedText
  }

  if (!currentDocument) {
    return (
      <div className={`flex-1 bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">Carregando documento...</p>
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
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyFormatting('bold')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Negrito"
            >
              <strong>B</strong>
            </button>
            <button
              onClick={() => applyFormatting('italic')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Itálico"
            >
              <em>I</em>
            </button>
            <button
              onClick={() => applyFormatting('underline')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Sublinhado"
            >
              <u>U</u>
            </button>
            <div className="w-px h-8 bg-gray-300 mx-2"></div>
            <button
              onClick={() => applyFormatting('h1')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Título 1"
            >
              H1
            </button>
            <button
              onClick={() => applyFormatting('h2')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Título 2"
            >
              H2
            </button>
            <button
              onClick={() => applyFormatting('h3')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Título 3"
            >
              H3
            </button>
            <div className="w-px h-8 bg-gray-300 mx-2"></div>
            <button
              onClick={() => applyFormatting('list')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Lista"
            >
              •
            </button>
            <button
              onClick={() => applyFormatting('orderedList')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Lista numerada"
            >
              1.
            </button>
            <button
              onClick={() => applyFormatting('quote')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Citação"
            >
              "
            </button>
            <button
              onClick={() => applyFormatting('link')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Link"
            >
              🔗
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {currentDocument.wordCount} palavras
              </span>
              {isAnalyzing && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Analisando...</span>
                </div>
              )}
            </div>
            {corrections.length > 0 && (
              <span className="text-sm text-blue-600">
                {corrections.filter(c => c.accepted).length}/{corrections.length} correções aceitas
              </span>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={editorValue}
            onChange={handleEditorChange}
            className="w-full h-full p-4 border-none outline-none resize-none font-mono text-sm leading-relaxed"
            placeholder="Digite seu texto aqui..."
            spellCheck={false}
          />
          
          {/* Overlay para destaques */}
          {corrections.length > 0 && (
            <div 
              className="absolute inset-0 p-4 pointer-events-none font-mono text-sm leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: renderTextWithHighlights() }}
            />
          )}
        </div>

        {/* Status Bar */}
        {corrections.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {corrections.filter(c => c.severity === 'error').length} erros,{' '}
                {corrections.filter(c => c.severity === 'warning').length} avisos,{' '}
                {corrections.filter(c => c.severity === 'suggestion').length} sugestões
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default SimpleTextEditor
