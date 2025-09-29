import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Download, RotateCcw, FileText, Upload } from 'lucide-react'
import { useEditor } from '../context/EditorContext'
import { useProfAi } from '../context/ProfAiContext'
import WordLikeEditor from '../components/WordLikeEditor'
import FileUpload from '../components/FileUpload'
import VersionHistory from '../components/VersionHistory'
import AIAssistant from '../components/AIAssistant'
import toast from 'react-hot-toast'

const EditorClean: React.FC = () => {
  const {
    currentDocument,
    isSaving,
    lastSaved,
    saveDocument,
    isLoading,
    exportDocument,
  } = useEditor()

  const { addMessage, generateCorrectionMessage } = useProfAi()
  const [showUpload, setShowUpload] = useState(false)
  const [showVersions, setShowVersions] = useState(false)

  // Auto-save a cada 30 segundos
  useEffect(() => {
    if (currentDocument) {
      const interval = setInterval(() => {
        saveDocument()
      }, 30000) // Salva a cada 30 segundos
      return () => clearInterval(interval)
    }
  }, [currentDocument, saveDocument])

  const handleSave = async () => {
    if (currentDocument) {
      await saveDocument()
      toast.success('Documento salvo com sucesso!')
    }
  }

  const handleExport = async (format: 'docx' | 'pdf') => {
    try {
      await exportDocument(format)
      toast.success(`Documento exportado como ${format.toUpperCase()}!`)
    } catch (error) {
      toast.error(`Erro ao exportar documento como ${format.toUpperCase()}.`)
    }
  }

  if (!currentDocument) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header simples */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              ProfAi TCC Editor
            </h1>
            <button
              onClick={() => setShowUpload(true)}
              className="px-4 py-2 bg-unifor-blue text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Upload className="w-5 h-5" />
              <span>Novo Documento</span>
            </button>
          </div>
        </div>

        {/* Área de boas-vindas */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="w-24 h-24 bg-unifor-light-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-unifor-blue" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bem-vindo ao ProfAi TCC Editor
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Comece seu projeto de TCC fazendo upload de um documento ou criando um novo.
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="px-8 py-4 bg-unifor-blue text-white text-lg rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <FileText className="w-6 h-6" />
              <span>Começar Agora</span>
            </button>
          </div>
        </div>

        {showUpload && <FileUpload onClose={() => setShowUpload(false)} />}
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Skip Link para acessibilidade */}
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>
      
      {/* Header limpo e funcional */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900 truncate">
              {currentDocument.title}
            </h1>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <span>{currentDocument.wordCount} palavras</span>
              {isSaving && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Salvando...</span>
                </div>
              )}
              {lastSaved && !isSaving && (
                <span>Salvo em {lastSaved.toLocaleTimeString()}</span>
              )}
            </div>
          </div>

          {/* Botões de ação principais */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
              title="Salvar documento"
            >
              <Save className="w-4 h-4" />
              <span>Salvar</span>
            </button>

            <button
              onClick={() => handleExport('docx')}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              title="Exportar como DOCX"
            >
              <Download className="w-4 h-4" />
              <span>DOCX</span>
            </button>

            <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
              title="Exportar como PDF"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>

            <button
              onClick={() => setShowVersions(!showVersions)}
              className={`px-4 py-2 text-sm rounded-md transition-colors flex items-center space-x-2 ${
                showVersions
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              title="Histórico de versões"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Versões</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor principal */}
        <div id="main-content" className="flex-1 flex flex-col">
          <WordLikeEditor />
        </div>

        {/* Painel lateral (apenas versões quando necessário) */}
        {showVersions && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-white border-l border-gray-200 overflow-hidden"
          >
            <VersionHistory />
          </motion.div>
        )}
      </div>

      {/* AI Assistant (único ponto de correções) */}
      <AIAssistant />
    </div>
  )
}

export default EditorClean
