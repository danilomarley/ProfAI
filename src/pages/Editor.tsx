import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Save, Download, Eye, EyeOff, RotateCcw, FileText, AlertCircle } from 'lucide-react'
import { useEditor } from '../context/EditorContext'
import { useProfAi } from '../context/ProfAiContext'
import WordLikeEditor from '../components/WordLikeEditor'
import Toolbar from '../components/Toolbar'
import FileUpload from '../components/FileUpload'
import CorrectionPanel from '../components/CorrectionPanel'
import ProgressBar from '../components/ProgressBar'
import ABNTFormatter from '../components/ABNTFormatter'
import VersionHistory from '../components/VersionHistory'
import GamificationPanel from '../components/GamificationPanel'
import ExportPanel from '../components/ExportPanel'
import AIAssistant from '../components/AIAssistant'
import toast from 'react-hot-toast'

const Editor: React.FC = () => {
  const {
    currentDocument,
    corrections,
    viewMode,
    isLoading,
    isSaving,
    lastSaved,
    createDocument,
    updateContent,
    saveDocument,
    setViewMode,
    exportDocument,
  } = useEditor()

  const { addMessage, generateCorrectionMessage } = useProfAi()
  const [showUpload, setShowUpload] = useState(false)
  const [showABNT, setShowABNT] = useState(false)
  const [showVersions, setShowVersions] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [showGamification, setShowGamification] = useState(false)

  // Auto-save a cada 30 segundos
  useEffect(() => {
    if (currentDocument) {
      const interval = setInterval(() => {
        saveDocument()
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [currentDocument, saveDocument])

  const handleNewDocument = async () => {
    const title = prompt('Digite o título do seu TCC:')
    if (title) {
      try {
        await createDocument(title)
        toast.success('Novo documento criado!')
        addMessage({
          type: 'welcome',
          content: `Ótimo! Vamos começar a trabalhar no seu TCC "${title}". Faça o upload de um arquivo ou comece a escrever diretamente no editor.`,
          read: false,
        })
      } catch (error) {
        toast.error('Erro ao criar documento')
      }
    }
  }

  const handleSave = async () => {
    try {
      await saveDocument()
      toast.success('Documento salvo!')
    } catch (error) {
      toast.error('Erro ao salvar documento')
    }
  }

  const handleExport = async (format: 'docx' | 'pdf') => {
    try {
      await exportDocument(format)
      toast.success(`Documento exportado como ${format.toUpperCase()}!`)
    } catch (error) {
      toast.error('Erro ao exportar documento')
    }
  }

  const handleContentChange = (content: string) => {
    updateContent(content)
  }

  // Simular correções automáticas
  useEffect(() => {
    if (currentDocument && currentDocument.content.length > 100) {
      // Simular detecção de erros comuns
      const commonErrors = [
        {
          type: 'spelling' as const,
          originalText: 'tecnologia',
          suggestedText: 'tecnologia',
          message: 'Verifique a grafia desta palavra',
          position: { start: 0, end: 10 },
        },
        {
          type: 'grammar' as const,
          originalText: 'a tecnologia',
          suggestedText: 'a tecnologia',
          message: 'Considere usar artigo definido',
          position: { start: 0, end: 12 },
        },
      ]

      // Adicionar algumas correções de exemplo
      if (corrections.length === 0) {
        commonErrors.forEach((error, index) => {
          setTimeout(() => {
            const correction = {
              ...error,
              id: `correction-${index}`,
              accepted: false,
              rejected: false,
            }
            addMessage(generateCorrectionMessage(correction))
          }, 2000 + index * 1000)
        })
      }
    }
  }, [currentDocument, corrections.length, addMessage, generateCorrectionMessage])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-unifor-blue"></div>
      </div>
    )
  }

  if (!currentDocument) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-unifor-light-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-unifor-blue" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Bem-vindo ao Editor ProfAi
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Comece criando um novo documento ou faça upload de um arquivo existente
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleNewDocument}
              className="btn-primary text-lg px-8 py-4"
            >
              <FileText className="w-5 h-5 mr-2" />
              Novo Documento
            </button>
            <button
              onClick={() => setShowUpload(true)}
              className="btn-outline text-lg px-8 py-4"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload de Arquivo
            </button>
          </div>
        </motion.div>

        {showUpload && (
          <FileUpload
            onClose={() => setShowUpload(false)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Skip Link para acessibilidade */}
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <h1 className="heading-responsive text-gray-900 truncate">
              {currentDocument.title}
            </h1>
            {isSaving && (
              <div className="flex items-center text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-unifor-blue mr-2"></div>
                Salvando...
              </div>
            )}
            {lastSaved && !isSaving && (
              <span className="text-sm text-gray-500">
                Salvo em {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowCorrections(!showCorrections)}
              className={`p-2 rounded-lg transition-colors ${
                showCorrections
                  ? 'bg-unifor-light-blue text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title={showCorrections ? 'Ocultar correções' : 'Mostrar correções'}
              aria-label={showCorrections ? 'Ocultar correções' : 'Mostrar correções'}
            >
              {showCorrections ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            <button
              onClick={() => setShowABNT(!showABNT)}
              className={`p-2 rounded-lg transition-colors ${
                showABNT
                  ? 'bg-green-500 text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title={showABNT ? 'Ocultar ABNT' : 'Mostrar formatação ABNT'}
              aria-label={showABNT ? 'Ocultar ABNT' : 'Mostrar formatação ABNT'}
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={() => setShowVersions(!showVersions)}
              className={`p-2 rounded-lg transition-colors ${
                showVersions
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title={showVersions ? 'Ocultar versões' : 'Mostrar histórico de versões'}
              aria-label={showVersions ? 'Ocultar versões' : 'Mostrar histórico de versões'}
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={() => setShowGamification(!showGamification)}
              className={`p-2 rounded-lg transition-colors ${
                showGamification
                  ? 'bg-yellow-500 text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title={showGamification ? 'Ocultar gamificação' : 'Mostrar progresso e conquistas'}
              aria-label={showGamification ? 'Ocultar gamificação' : 'Mostrar progresso e conquistas'}
            >
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={() => setShowExport(!showExport)}
              className={`p-2 rounded-lg transition-colors ${
                showExport
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title={showExport ? 'Ocultar exportação' : 'Mostrar opções de exportação'}
              aria-label={showExport ? 'Ocultar exportação' : 'Mostrar opções de exportação'}
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={handleSave}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Salvar"
              aria-label="Salvar documento"
            >
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="relative">
              <button
                onClick={() => handleExport('docx')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Exportar DOCX"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <ProgressBar />
        </div>
      </div>

      {/* Main Content */}
      <div id="main-content" className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar Left - Gamification */}
        {showGamification && (
          <div className="editor-sidebar lg:w-80 overflow-y-auto">
            <GamificationPanel />
          </div>
        )}

        {/* Editor */}
        <div className="editor-main flex flex-col" style={{ minHeight: '700px' }}>
          <div className="flex-1 overflow-hidden" style={{ minHeight: '600px' }}>
            <WordLikeEditor />
          </div>
        </div>

        {/* Sidebar Right - Panels */}
        <div className="editor-sidebar lg:w-80 overflow-y-auto">
          {showCorrections && <CorrectionPanel />}
          {showABNT && <ABNTFormatter onApplyFormatting={(text) => console.log('Formatação aplicada:', text)} />}
          {showVersions && <VersionHistory />}
          {showExport && <ExportPanel />}
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  )
}

export default Editor

