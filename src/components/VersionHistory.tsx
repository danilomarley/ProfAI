import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, RotateCcw, Eye, Download, Calendar, FileText, GitBranch, CheckCircle } from 'lucide-react'
import { Version, Document } from '../types'
import { useEditor } from '../context/EditorContext'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface VersionHistoryProps {
  className?: string
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ className = '' }) => {
  const { currentDocument, createVersion, loadVersion } = useEditor()
  const [versions, setVersions] = useState<Version[]>([])
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newVersionDescription, setNewVersionDescription] = useState('')

  // Carregar versões do documento atual
  useEffect(() => {
    if (currentDocument) {
      loadVersions()
    }
  }, [currentDocument])

  const loadVersions = async () => {
    if (!currentDocument) return

    setIsLoading(true)
    try {
      // Simular carregamento de versões
      const mockVersions: Version[] = [
        {
          id: '1',
          documentId: currentDocument.id,
          content: currentDocument.content,
          createdAt: new Date(Date.now() - 86400000), // 1 dia atrás
          changes: [],
          wordCount: currentDocument.wordCount,
          description: 'Versão inicial do documento'
        },
        {
          id: '2',
          documentId: currentDocument.id,
          content: currentDocument.content + '\n\n[Conteúdo adicionado]',
          createdAt: new Date(Date.now() - 3600000), // 1 hora atrás
          changes: [],
          wordCount: currentDocument.wordCount + 10,
          description: 'Adicionado capítulo 1'
        }
      ]
      setVersions(mockVersions)
    } catch (error) {
      console.error('Erro ao carregar versões:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateVersion = async () => {
    if (!currentDocument) return

    try {
      const newVersion = await createVersion(newVersionDescription)
      setVersions(prev => [newVersion, ...prev])
      setShowCreateModal(false)
      setNewVersionDescription('')
    } catch (error) {
      console.error('Erro ao criar versão:', error)
    }
  }

  const handleRestoreVersion = async (versionId: string) => {
    try {
      await loadVersion(versionId)
      setSelectedVersion(null)
    } catch (error) {
      console.error('Erro ao restaurar versão:', error)
    }
  }

  const handleCompareVersions = (version1: Version, version2: Version) => {
    // Implementar comparação de versões
    console.log('Comparando versões:', version1.id, version2.id)
  }

  const getVersionIcon = (version: Version) => {
    if (version.id === versions[0]?.id) {
      return <CheckCircle className="w-4 h-4 text-green-500" />
    }
    return <GitBranch className="w-4 h-4 text-gray-500" />
  }

  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  }

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Agora mesmo'
    if (diffInHours < 24) return `${diffInHours}h atrás`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d atrás`
    return formatDate(date)
  }

  if (!currentDocument) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Nenhum documento carregado</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-lg ${className}`}
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-unifor-blue" />
            Histórico de Versões
          </h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary text-sm"
          >
            Nova Versão
          </button>
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-unifor-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando versões...</p>
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-8">
            <GitBranch className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Nenhuma versão encontrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {versions.map((version, index) => (
              <motion.div
                key={version.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedVersion?.id === version.id
                    ? 'border-unifor-blue bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedVersion(version)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getVersionIcon(version)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">
                          Versão {version.id}
                        </h4>
                        {index === 0 && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Atual
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {version.description || 'Sem descrição'}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {getRelativeTime(version.createdAt)}
                        </span>
                        <span className="flex items-center">
                          <FileText className="w-3 h-3 mr-1" />
                          {version.wordCount} palavras
                        </span>
                        <span className="flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {version.changes.length} alterações
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRestoreVersion(version.id)
                      }}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                      title="Restaurar versão"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedVersion(version)
                      }}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                      title="Ver detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Criação de Versão */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Criar Nova Versão
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição da versão
                  </label>
                  <textarea
                    value={newVersionDescription}
                    onChange={(e) => setNewVersionDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unifor-blue focus:border-transparent"
                    rows={3}
                    placeholder="Descreva as alterações feitas nesta versão..."
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateVersion}
                    className="btn-primary"
                  >
                    Criar Versão
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Detalhes da Versão */}
      <AnimatePresence>
        {selectedVersion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detalhes da Versão {selectedVersion.id}
                </h3>
                <button
                  onClick={() => setSelectedVersion(null)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Descrição:</p>
                  <p className="text-sm">{selectedVersion.description || 'Sem descrição'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Data de criação:</p>
                  <p className="text-sm">{formatDate(selectedVersion.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Estatísticas:</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Palavras:</span> {selectedVersion.wordCount}
                    </div>
                    <div>
                      <span className="font-medium">Alterações:</span> {selectedVersion.changes.length}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setSelectedVersion(null)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => handleRestoreVersion(selectedVersion.id)}
                    className="btn-primary"
                  >
                    Restaurar Versão
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default VersionHistory
