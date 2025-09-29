import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, RotateCcw, Eye, Download, Calendar, FileText } from 'lucide-react'
import { Version } from '../types'

const History: React.FC = () => {
  const [versions, setVersions] = useState<Version[]>([])
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento de versões
    const mockVersions: Version[] = [
      {
        id: '1',
        documentId: 'doc-1',
        content: 'Versão inicial do documento...',
        createdAt: new Date('2024-01-15T10:00:00'),
        changes: [],
        wordCount: 1500,
        description: 'Versão inicial',
      },
      {
        id: '2',
        documentId: 'doc-1',
        content: 'Documento com correções de ortografia...',
        createdAt: new Date('2024-01-15T14:30:00'),
        changes: [],
        wordCount: 1520,
        description: 'Correções de ortografia',
      },
      {
        id: '3',
        documentId: 'doc-1',
        content: 'Documento com formatação ABNT aplicada...',
        createdAt: new Date('2024-01-16T09:15:00'),
        changes: [],
        wordCount: 1550,
        description: 'Formatação ABNT',
      },
    ]

    setTimeout(() => {
      setVersions(mockVersions)
      setIsLoading(false)
    }, 1000)
  }, [])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const handleRestoreVersion = (version: Version) => {
    // Implementar restauração da versão
    console.log('Restaurando versão:', version.id)
  }

  const handleViewVersion = (version: Version) => {
    setSelectedVersion(version)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-unifor-blue"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Histórico de Versões</h1>
          <p className="text-gray-600">
            Visualize e restaure versões anteriores do seu documento
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Versions List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Versões Salvas</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {versions.length} versões encontradas
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {versions.map((version, index) => (
                  <motion.div
                    key={version.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-unifor-light-blue bg-opacity-10 rounded-full flex items-center justify-center">
                            <FileText className="w-4 h-4 text-unifor-blue" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {version.description || `Versão ${index + 1}`}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {formatDate(version.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{version.wordCount} palavras</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{version.changes.length} alterações</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewVersion(version)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRestoreVersion(version)}
                          className="p-2 text-unifor-blue hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Restaurar"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Version Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Pré-visualização</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedVersion ? 'Versão selecionada' : 'Selecione uma versão'}
                </p>
              </div>

              <div className="p-6">
                {selectedVersion ? (
                  <div>
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-900 mb-2">
                        {selectedVersion.description || 'Versão'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(selectedVersion.createdAt)}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedVersion.content.substring(0, 500)}
                        {selectedVersion.content.length > 500 && '...'}
                      </p>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleRestoreVersion(selectedVersion)}
                        className="flex-1 btn-primary text-sm py-2"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Restaurar
                      </button>
                      <button
                        className="flex-1 btn-outline text-sm py-2"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>Selecione uma versão para visualizar</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default History

