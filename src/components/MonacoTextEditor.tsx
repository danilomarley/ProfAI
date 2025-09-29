import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useEditor } from '../context/EditorContext'
import { useProfAi } from '../context/ProfAiContext'
import { useEditorRef } from '../context/EditorRefContext'
import Editor from '@monaco-editor/react'

interface MonacoTextEditorProps {
  className?: string
}

const MonacoTextEditor: React.FC<MonacoTextEditorProps> = ({ className = '' }) => {
  const { currentDocument, updateContent, corrections, viewMode, analyzeText } = useEditor()
  const { isAnalyzing } = useProfAi()
  const { setEditorRef } = useEditorRef()
  const [editorValue, setEditorValue] = useState('')
  const [isEditorReady, setIsEditorReady] = useState(false)
  const editorRef = useRef<any>(null)

  // Atualizar o valor do editor quando o documento mudar
  useEffect(() => {
    if (currentDocument) {
      setEditorValue(currentDocument.content)
    }
  }, [currentDocument])

  // Função para lidar com mudanças no editor
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorValue(value)
      updateContent(value)
    }
  }

  // Debounce para análise de texto
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (editorValue.length > 50) {
        analyzeText(editorValue)
      }
    }, 2000) // Aguarda 2 segundos após parar de digitar

    return () => clearTimeout(timeoutId)
  }, [editorValue, analyzeText])

  // Função para aplicar correções visuais
  const applyCorrections = (value: string) => {
    if (viewMode === 'original' || corrections.length === 0) {
      return value
    }

    let correctedValue = value
    
    corrections.forEach((correction) => {
      if (correction.accepted) {
        // Aplicar correção aceita
        correctedValue = correctedValue.replace(correction.originalText, correction.suggestedText)
      }
    })

    return correctedValue
  }

  // Função para obter o valor do editor baseado no modo de visualização
  const getEditorValue = () => {
    if (!currentDocument) return ''
    
    switch (viewMode) {
      case 'original':
        return currentDocument.originalContent || currentDocument.content
      case 'corrected':
        return applyCorrections(currentDocument.content)
      case 'comparative':
        return currentDocument.content
      default:
        return currentDocument.content
    }
  }

  // Função para configurar o editor quando estiver pronto
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    setEditorRef(editorRef)
    
    // Configurar o editor
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 1.5,
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      folding: true,
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      cursorStyle: 'line',
      glyphMargin: true,
      contextmenu: true,
      mouseWheelZoom: true,
      smoothScrolling: true,
    })

    // Configurar tema
    monaco.editor.defineTheme('profai-theme', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '0000FF' },
        { token: 'string', foreground: 'A31515' },
        { token: 'number', foreground: '098658' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#000000',
        'editorLineNumber.foreground': '#999999',
        'editor.selectionBackground': '#add6ff',
        'editor.inactiveSelectionBackground': '#e5ebf1',
      },
    })

    monaco.editor.setTheme('profai-theme')
    setIsEditorReady(true)
  }

  // Função para aplicar correções visuais no editor
  const applyVisualCorrections = () => {
    if (!editorRef.current || !isEditorReady) return

    const editor = editorRef.current
    const model = editor.getModel()
    
    if (!model || corrections.length === 0) return

    // Limpar decorações anteriores
    editor.deltaDecorations(editor.getModel()?.getAllDecorations() || [], [])

    // Aplicar decorações para correções
    const decorations = corrections.map((correction, index) => {
      const text = model.getValue()
      const textIndex = text.indexOf(correction.originalText)
      
      if (textIndex === -1) return null

      const position = model.getPositionAt(textIndex)
      const endPosition = model.getPositionAt(textIndex + correction.originalText.length)

      return {
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: endPosition.lineNumber,
          endColumn: endPosition.column,
        },
        options: {
          inlineClassName: correction.accepted ? 'correction-accepted' : 'correction-pending',
          hoverMessage: {
            value: `**${correction.type}**: ${correction.message}\n\n**Explicação**: ${correction.explanation}`,
          },
          glyphMarginClassName: correction.accepted ? 'correction-glyph-accepted' : 'correction-glyph-pending',
        },
      }
    }).filter(Boolean)

    editor.deltaDecorations([], decorations)
  }

  // Aplicar correções visuais quando as correções mudarem
  useEffect(() => {
    if (isEditorReady && corrections.length > 0) {
      applyVisualCorrections()
    }
  }, [corrections, isEditorReady])

  // Aplicar correções visuais quando o editor estiver pronto
  useEffect(() => {
    if (isEditorReady) {
      applyVisualCorrections()
    }
  }, [isEditorReady])

  if (!currentDocument) {
    return (
      <div className={`flex-1 bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum documento carregado
            </h3>
            <p className="text-gray-600">
              Faça upload de um arquivo ou crie um novo documento para começar.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex-1 bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
      style={{ minHeight: '600px' }}
    >
      <div className="h-full flex flex-col" style={{ minHeight: '600px' }}>
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
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {currentDocument.wordCount} palavras
              </span>
              {corrections.length > 0 && (
                <span className="text-sm text-blue-600">
                  {corrections.filter(c => c.accepted).length}/{corrections.length} correções aceitas
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 relative" style={{ minHeight: '500px', height: '500px' }}>
          <Editor
            height="500px"
            width="100%"
            language="markdown"
            value={getEditorValue()}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              fontSize: 14,
              lineHeight: 1.5,
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              lineNumbers: 'on',
              folding: true,
              selectOnLineNumbers: true,
              roundedSelection: false,
              readOnly: false,
              cursorStyle: 'line',
              glyphMargin: true,
              contextmenu: true,
              mouseWheelZoom: true,
              smoothScrolling: true,
            }}
            theme="profai-theme"
          />
        </div>

        {/* Status Bar */}
        {corrections.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Correções: {corrections.length}
                </span>
                <span className="text-sm text-green-600">
                  Aceitas: {corrections.filter(c => c.accepted).length}
                </span>
                <span className="text-sm text-orange-600">
                  Pendentes: {corrections.filter(c => !c.accepted).length}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {currentDocument.wordCount} palavras
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .correction-pending {
          background-color: #fef2f2 !important;
          border-bottom: 2px solid #ef4444 !important;
          text-decoration: line-through !important;
          color: #dc2626 !important;
        }
        
        .correction-accepted {
          background-color: #f0fdf4 !important;
          border-bottom: 2px solid #22c55e !important;
          text-decoration: underline !important;
          color: #16a34a !important;
        }
        
        .correction-glyph-pending::before {
          content: "⚠";
          color: #ef4444;
          font-size: 16px;
        }
        
        .correction-glyph-accepted::before {
          content: "✓";
          color: #22c55e;
          font-size: 16px;
        }
      `}</style>
    </motion.div>
  )
}

export default MonacoTextEditor
