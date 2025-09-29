import React, { useState, useEffect } from 'react'
import { Save, Download, FileText, Upload, Zap, CheckCircle, XCircle, Trophy, Target } from 'lucide-react'
import { useEditor } from '../context/EditorContext'
import { useProfAi } from '../context/ProfAiContext'
import WordLikeEditor from '../components/WordLikeEditor'
import FileUpload from '../components/FileUpload'
import Header from '../components/Header'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'

const EditorUnified: React.FC = () => {
  const {
    currentDocument,
    isSaving,
    saveDocument,
    exportDocument,
    corrections,
    acceptCorrection,
    rejectCorrection,
  } = useEditor()

  const { progress, achievements } = useProfAi()
  const [showUpload, setShowUpload] = useState(false)

  // Auto-save a cada 30 segundos
  useEffect(() => {
    if (currentDocument) {
      const interval = setInterval(() => {
        saveDocument()
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [currentDocument, saveDocument])

  const handleSave = async () => {
    if (currentDocument) {
      await saveDocument()
      toast.success('Documento salvo!')
    }
  }

  const handleExport = async (format: 'docx' | 'pdf') => {
    try {
      await exportDocument(format)
      toast.success(`Exportado como ${format.toUpperCase()}!`)
    } catch (error) {
      toast.error(`Erro ao exportar como ${format.toUpperCase()}.`)
    }
  }

  const handleAcceptCorrection = (correctionId: string) => {
    acceptCorrection(correctionId)
    toast.success('Correção aplicada!')
  }

  const handleRejectCorrection = (correctionId: string) => {
    rejectCorrection(correctionId)
    toast('Correção rejeitada', { icon: 'ℹ️' })
  }

  const pendingCorrections = corrections.filter(c => !c.accepted && !c.rejected)
  const acceptedCorrections = corrections.filter(c => c.accepted)
  const unlockedAchievements = achievements.filter(a => a.unlockedAt)

  if (!currentDocument) {
    return (
      <>
        <Helmet>
          <title>ProfAi - Editor de TCC</title>
          <meta name="description" content="Editor inteligente para TCC com assistente virtual ProfAi" />
          <meta name="theme-color" content="#003366" />
        </Helmet>
        
        <div className="min-h-screen bg-gray-50">
          <Header />
          
          <div className="h-screen flex flex-col bg-gray-50">
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-unifor-blue">ProfAi TCC Editor</h1>
                <button
                  onClick={() => setShowUpload(true)}
                  className="px-4 py-2 bg-unifor-blue text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Novo Documento</span>
                </button>
              </div>
            </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="w-24 h-24 bg-unifor-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-unifor-blue" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bem-vindo ao ProfAi TCC Editor
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Sua assistente inteligente para criar TCCs perfeitos com formatação ABNT automática.
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="px-8 py-4 bg-unifor-blue text-white text-lg rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <Zap className="w-6 h-6" />
              <span>Começar Agora</span>
            </button>
          </div>
        </div>

            {showUpload && <FileUpload onClose={() => setShowUpload(false)} />}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>ProfAi - Editor de TCC</title>
        <meta name="description" content="Editor inteligente para TCC com assistente virtual ProfAi" />
        <meta name="theme-color" content="#003366" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="flex bg-gray-50" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Editor Principal */}
      <div className="flex-1 flex flex-col">
        {/* Header Simples */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {currentDocument.title}
              </h1>
              <span className="text-sm text-gray-500">
                {currentDocument.wordCount} palavras
              </span>
              {isSaving && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Salvando...</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors flex items-center space-x-1"
              >
                <Save className="w-4 h-4" />
                <span>Salvar</span>
              </button>
              <button
                onClick={() => handleExport('docx')}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>DOCX</span>
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <WordLikeEditor />
        </div>
      </div>

      {/* Barra Lateral Unificada - ProfAi */}
      <div className="w-80 bg-white shadow-xl border-l border-gray-200 flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Header da ProfAi */}
        <div className="bg-gradient-to-r from-unifor-blue to-blue-600 text-white p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">ProfAi</h2>
              <p className="text-sm text-blue-100">Sua assistente virtual</p>
            </div>
          </div>
        </div>

        {/* Conteúdo da Barra Lateral */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Progresso */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Progresso da Revisão
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-700">Revisão do TCC</span>
                <span className="text-blue-600 font-bold">{progress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">
                  ✅ {acceptedCorrections.length} aceitas
                </span>
                <span className="text-gray-600">
                  📝 {corrections.length} total
                </span>
              </div>
            </div>
          </div>

          {/* Conquistas */}
          {unlockedAchievements.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
                Conquistas ({unlockedAchievements.length})
              </h3>
              <div className="space-y-2">
                {unlockedAchievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-2">
                    <span className="text-lg">{achievement.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{achievement.title}</p>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Correções Pendentes */}
          {pendingCorrections.length > 0 && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-200">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                <XCircle className="w-5 h-5 mr-2 text-red-600" />
                🔍 Correções Sugeridas ({pendingCorrections.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {pendingCorrections.map((correction) => (
                  <div
                    key={correction.id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      correction.severity === 'error' 
                        ? 'bg-red-100 border-red-300 hover:bg-red-200' 
                        : correction.severity === 'warning'
                        ? 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200'
                        : 'bg-blue-100 border-blue-300 hover:bg-blue-200'
                    }`}
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                  >
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                          correction.severity === 'error' 
                            ? 'bg-red-200 text-red-800' 
                            : correction.severity === 'warning'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-blue-200 text-blue-800'
                        }`}>
                          {correction.type === 'spelling' ? 'Ortografia' : 
                           correction.type === 'grammar' ? 'Gramática' : 
                           correction.type === 'style' ? 'Estilo' : 'ABNT'}
                        </span>
                        <span className={`text-xs ${
                          correction.severity === 'error' ? 'text-red-600' : 
                          correction.severity === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                        }`}>
                          {correction.severity === 'error' ? 'Erro' : 
                           correction.severity === 'warning' ? 'Atenção' : 'Sugestão'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{correction.explanation}</p>
                      <div className="bg-white p-2 rounded border text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="line-through text-red-600 font-mono text-xs">{correction.originalText}</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-green-600 font-mono font-medium text-xs">{correction.suggestedText}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAcceptCorrection(correction.id)}
                        className="flex-1 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors flex items-center justify-center space-x-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>Aceitar</span>
                      </button>
                      <button
                        onClick={() => handleRejectCorrection(correction.id)}
                        className="flex-1 px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors flex items-center justify-center space-x-1"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>Rejeitar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Correções Aceitas */}
          {acceptedCorrections.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                ✅ Correções Aceitas ({acceptedCorrections.length})
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {acceptedCorrections.slice(-5).map((correction) => (
                  <div key={correction.id} className="p-2 bg-green-100 rounded border text-xs">
                    <span className="line-through text-gray-500">{correction.originalText}</span>
                    <span className="mx-2">→</span>
                    <span className="font-medium text-green-700">{correction.suggestedText}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estado Vazio */}
          {corrections.length === 0 && (
            <div className="text-center py-8">
              <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Tudo perfeito!</h3>
              <p className="text-sm text-gray-500">Continue escrevendo para receber sugestões da ProfAi</p>
            </div>
          )}

          {/* Indicador de Análise */}
          {corrections.length === 0 && currentDocument && currentDocument.content.length > 50 && (
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-blue-700">ProfAi analisando seu texto...</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
    </>
  )
}

export default EditorUnified
