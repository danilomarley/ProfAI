import React, { useState, useEffect, useRef, useMemo } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { motion } from 'framer-motion'
import { useEditor } from '../context/EditorContext'
import { useProfAi } from '../context/ProfAiContext'
import { SmartTCCFormatter } from '../utils/tccFormatter'
import toast from 'react-hot-toast'

interface WordLikeEditorProps {
  className?: string
}

const WordLikeEditor: React.FC<WordLikeEditorProps> = ({ className = '' }) => {
  const { currentDocument, updateContent, corrections, analyzeText } = useEditor()
  const { isAnalyzing } = useProfAi()
  const [editorValue, setEditorValue] = useState('')
  const quillRef = useRef<ReactQuill>(null)

  // Configuração do Quill para simular Word
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ]
    },
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: true
    },
    clipboard: {
      matchVisual: false
    }
  }), [])

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ]

  // Atualizar o valor do editor quando o documento mudar
  useEffect(() => {
    if (currentDocument) {
      setEditorValue(currentDocument.content)
    }
  }, [currentDocument])

  // Debounce para análise de texto com IA inteligente (menos frequente)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (editorValue.length > 100) { // Aumentado o mínimo
        // Converter HTML para texto plano para análise
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = editorValue
        const plainText = tempDiv.textContent || tempDiv.innerText || ''
        
        // Analisar apenas se houve mudança significativa
        if (plainText.length > 100) {
          analyzeText(plainText)
        }
      }
    }, 3000) // Aumentado para 3s para reduzir análises excessivas

    return () => clearTimeout(timeoutId)
  }, [editorValue, analyzeText])

  // Função para lidar com mudanças no editor
  const handleEditorChange = (content: string, delta: any, source: any, editor: any) => {
    setEditorValue(content)
    updateContent(content)
  }

  // Aplicar correções aceitas no texto do editor
  useEffect(() => {
    if (corrections.length > 0 && quillRef.current) {
      const quill = quillRef.current.getEditor()
      const acceptedCorrections = corrections.filter(c => c.accepted && !c.applied)
      
      if (acceptedCorrections.length > 0) {
        // Aplicar correções uma por vez para evitar conflitos
        acceptedCorrections.forEach((correction, index) => {
          setTimeout(() => {
            const currentText = quill.getText()
            const textIndex = currentText.indexOf(correction.originalText)
            
            if (textIndex !== -1) {
              // Selecionar o texto a ser substituído
              quill.setSelection(textIndex, correction.originalText.length)
              
              // Substituir o texto
              quill.deleteText(textIndex, correction.originalText.length)
              quill.insertText(textIndex, correction.suggestedText)
              
              // Marcar como aplicada
              correction.applied = true
              
              // Atualizar o estado após a última correção
              if (index === acceptedCorrections.length - 1) {
                setTimeout(() => {
                  setEditorValue(quill.getContents())
                  updateContent(quill.getText())
                }, 100)
              }
            }
          }, index * 200) // Delay entre correções para evitar conflitos
        })
      }
    }
  }, [corrections, updateContent])

  // Função para formatação ABNT automática inteligente
  const handleAutoFormatABNT = () => {
    if (!quillRef.current) return

    const quill = quillRef.current.getEditor()
    const text = quill.getText()
    
    try {
      // Limpar formatação existente
      const length = quill.getLength()
      quill.removeFormat(0, length)
      
      // Aplicar formatação ABNT básica primeiro
      quill.formatText(0, length, {
        'font': 'serif',
        'size': '12pt'
      })
      
      // Configurar espaçamento e margens
      quill.format('line-height', '1.6')
      quill.format('align', 'justify')
      
      // Processar linha por linha para formatação inteligente de TCC
      const lines = text.split('\n')
      let currentIndex = 0
      
      lines.forEach((line, index) => {
        const trimmedLine = line.trim()
        const lineStart = currentIndex
        const lineLength = line.length
        
        if (trimmedLine.length > 0) {
          // Detectar capa e folha de rosto
          if (/^(UNIVERSIDADE\s+FEDERAL|FACULDADE\s+DE|LICENCIATURA\s+EM)/i.test(trimmedLine)) {
            quill.formatText(lineStart, lineLength, {
              'bold': true,
              'align': 'center',
              'size': '14pt',
              'font': 'serif'
            })
            
          // Detectar títulos de seções principais
          } else if (/^(RESUMO|ABSTRACT|SUMÁRIO|INTRODUÇÃO|OBJETIVOS|METODOLOGIA|DESENVOLVIMENTO|CONCLUSÃO|REFERÊNCIAS|AGRADECIMENTOS|LISTA\s+DE)$/i.test(trimmedLine)) {
            quill.formatText(lineStart, lineLength, {
              'bold': true,
              'align': 'center',
              'size': '14pt',
              'font': 'serif',
              'header': 1
            })
            
          // Detectar subtítulos numerados (1, 1.1, 1.2, etc.)
          } else if (/^\d+(\.\d+)*\.?\s+[A-ZÁÊÔÇÃÍÚÀÈÒÙ]/i.test(trimmedLine)) {
            const level = (trimmedLine.match(/\./g) || []).length + 1
            quill.formatText(lineStart, lineLength, {
              'bold': level <= 2,
              'size': level === 1 ? '14pt' : '12pt',
              'font': 'serif',
              'header': Math.min(level, 3),
              'align': 'left'
            })
            
          // Detectar nome do autor (linha com apenas nome)
          } else if (/^[A-Z][a-z]+\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(trimmedLine) && trimmedLine.length < 50) {
            quill.formatText(lineStart, lineLength, {
              'bold': true,
              'align': 'center',
              'size': '12pt',
              'font': 'serif'
            })
            
          // Detectar título do trabalho (linha em maiúsculas, mas não seção)
          } else if (trimmedLine === trimmedLine.toUpperCase() && 
                     trimmedLine.length > 10 && 
                     trimmedLine.length < 150 &&
                     !/^(UNIVERSIDADE|FACULDADE|RESUMO|ABSTRACT|SUMÁRIO|INTRODUÇÃO|OBJETIVOS|METODOLOGIA|DESENVOLVIMENTO|CONCLUSÃO|REFERÊNCIAS|AGRADECIMENTOS|LISTA)/i.test(trimmedLine)) {
            
            quill.formatText(lineStart, lineLength, {
              'bold': true,
              'align': 'center',
              'size': '16pt',
              'font': 'serif'
            })
            
          // Detectar listas e alíneas
          } else if (/^[•\-\*]\s+/.test(trimmedLine) || /^[a-z]\)\s+/.test(trimmedLine)) {
            quill.formatText(lineStart, lineLength, {
              'list': 'bullet'
            })
            
          // Parágrafos normais
          } else if (trimmedLine.length > 20) {
            quill.formatText(lineStart, lineLength, {
              'align': 'justify',
              'indent': 1,
              'size': '12pt',
              'font': 'serif'
            })
          }
        }
        
        currentIndex += lineLength + 1 // +1 para quebra de linha
      })
      
      // Aplicar espaçamento entre linhas
      quill.formatText(0, length, {
        'line-height': '1.5'
      })
      
      // Atualizar estado
      setEditorValue(quill.getContents())
      updateContent(quill.getText())
      
      // Usar IA para análise adicional
      const analysis = SmartTCCFormatter.analyzeAndFormat(text)
      
      // Mostrar feedback
      toast.success(
        `✅ Formatação ABNT aplicada!\n\n` +
        `📝 Fonte Times New Roman 12pt\n` +
        `📏 Espaçamento 1.5 entre linhas\n` +
        `📋 Títulos e subtítulos formatados\n` +
        `📄 Parágrafos justificados com recuo\n` +
        `🎯 ${analysis.corrections.length} sugestões de melhoria`
      )
      
      // Aplicar correções da IA
      if (analysis.corrections.length > 0) {
        setTimeout(() => {
          analyzeText(quill.getText())
        }, 1000)
      }
      
    } catch (error) {
      console.error('Erro na formatação ABNT:', error)
      toast.error('Erro ao aplicar formatação ABNT. Tente novamente.')
    }
  }

  // Aplicar correções visuais melhoradas
  useEffect(() => {
    if (corrections.length > 0 && quillRef.current) {
      const quill = quillRef.current.getEditor()
      
      // Limpar formatações anteriores de correção
      const text = quill.getText()
      const length = quill.getLength()
      
      // Primeiro, limpar todas as formatações de correção
      quill.formatText(0, length, {
        'background': false,
        'color': false,
        'underline': false,
        'strike': false
      })
      
      // Aplicar correções com destaque visual melhorado
      corrections.forEach((correction, correctionIndex) => {
        const index = text.indexOf(correction.originalText)
        
        if (index !== -1) {
          const textLength = correction.originalText.length
          
          if (correction.accepted) {
            // Texto aceito - verde claro com borda
            quill.formatText(index, textLength, {
              'background': '#d1fae5',
              'color': '#065f46',
              'underline': true,
              'strike': false
            })
            
            // Adicionar indicador visual de sucesso
            setTimeout(() => {
              const bounds = quill.getBounds(index, textLength)
              createVisualIndicator(bounds, 'accepted', correction.suggestedText)
            }, 100)
            
          } else if (correction.rejected) {
            // Texto rejeitado - cinza claro
            quill.formatText(index, textLength, {
              'background': '#f3f4f6',
              'color': '#6b7280',
              'underline': false,
              'strike': false
            })
            
          } else {
            // Aplicar classes CSS baseadas na severidade
            let className = 'correction-error'
            
            if (correction.severity === 'error') {
              className = 'correction-error'
            } else if (correction.severity === 'warning') {
              className = 'correction-warning'
            } else if (correction.severity === 'suggestion') {
              className = 'correction-suggestion'
            }
            
            // Aplicar formatação com classe CSS
            const range = { index, length: textLength }
            quill.formatText(index, textLength, {
              'background': correction.severity === 'error' ? '#fee2e2' : 
                          correction.severity === 'warning' ? '#fef3c7' : '#dbeafe',
              'color': correction.severity === 'error' ? '#dc2626' : 
                      correction.severity === 'warning' ? '#d97706' : '#2563eb',
              'strike': correction.severity === 'error',
              'underline': correction.severity !== 'error'
            })
            
            // Adicionar classe CSS ao elemento
            setTimeout(() => {
              const editorElement = quill.root
              const textNodes = editorElement.querySelectorAll('span')
              textNodes.forEach(node => {
                if (node.textContent?.includes(correction.originalText)) {
                  node.classList.add(className)
                }
              })
            }, 100)
            
            // Adicionar indicador visual interativo
            setTimeout(() => {
              const bounds = quill.getBounds(index, textLength)
              createVisualIndicator(bounds, correction.severity, correction.suggestedText, correctionIndex)
            }, 100)
          }
        }
      })
    }
  }, [corrections])

  // Função para criar indicadores visuais das correções
  const createVisualIndicator = (
    bounds: any, 
    type: 'accepted' | 'error' | 'warning' | 'suggestion', 
    suggestion: string,
    correctionIndex?: number
  ) => {
    // Remover indicadores anteriores
    const existingIndicators = document.querySelectorAll('.correction-indicator')
    existingIndicators.forEach(indicator => indicator.remove())
    
    if (!quillRef.current) return
    
    const editorContainer = quillRef.current.getEditor().container
    const indicator = document.createElement('div')
    indicator.className = `correction-indicator absolute z-50 pointer-events-none`
    
    // Posicionar o indicador
    indicator.style.left = `${bounds.left + bounds.width}px`
    indicator.style.top = `${bounds.top - 5}px`
    
    // Estilizar baseado no tipo
    let iconColor = '#dc2626'
    let icon = '⚠️'
    
    switch (type) {
      case 'accepted':
        iconColor = '#059669'
        icon = '✅'
        break
      case 'error':
        iconColor = '#dc2626'
        icon = '❌'
        break
      case 'warning':
        iconColor = '#d97706'
        icon = '⚠️'
        break
      case 'suggestion':
        iconColor = '#2563eb'
        icon = '💡'
        break
    }
    
    indicator.innerHTML = `
      <div class="bg-white border-2 rounded-full w-6 h-6 flex items-center justify-center shadow-lg" 
           style="border-color: ${iconColor}; animation: pulse 2s infinite;">
        <span style="font-size: 12px;">${icon}</span>
      </div>
    `
    
    // Adicionar tooltip com sugestão
    if (suggestion && type !== 'accepted') {
      indicator.title = `Sugestão: ${suggestion}`
      indicator.className += ' cursor-help'
      indicator.style.pointerEvents = 'auto'
      
      // Adicionar evento de clique para aceitar correção
      if (correctionIndex !== undefined) {
        indicator.onclick = () => {
          const correction = corrections[correctionIndex]
          if (correction) {
            // Implementar aceitação rápida da correção
            toast.info(`Clique na barra lateral para aceitar: "${suggestion}"`)
          }
        }
      }
    }
    
    editorContainer.appendChild(indicator)
    
    // Remover após 5 segundos
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator)
      }
    }, 5000)
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
        {/* Header com informações */}
        <div className="bg-gray-50 border-b border-gray-200 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                {currentDocument.title}
              </span>
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
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAutoFormatABNT}
                className="px-3 py-1.5 bg-unifor-blue text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1"
                title="Aplicar formatação ABNT automática"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>ABNT</span>
              </button>
              {corrections.length > 0 && (
                <span className="text-sm text-blue-600">
                  {corrections.filter(c => c.accepted).length}/{corrections.length} correções aceitas
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Editor Quill */}
        <div className="flex-1 overflow-hidden" style={{ height: 'calc(100vh - 250px)' }}>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={editorValue}
            onChange={handleEditorChange}
            modules={modules}
            formats={formats}
            placeholder="Digite seu texto aqui..."
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          />
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
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-200 border border-red-300 rounded"></div>
                  <span className="text-xs text-gray-600">Erros</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-200 border border-green-300 rounded"></div>
                  <span className="text-xs text-gray-600">Aceitas</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </motion.div>
  )
}

export default WordLikeEditor
