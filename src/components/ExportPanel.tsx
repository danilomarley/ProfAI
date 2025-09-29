import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, File, Settings, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useEditor } from '../context/EditorContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

interface ExportPanelProps {
  className?: string
}

interface ExportOptions {
  format: 'docx' | 'pdf'
  includeMetadata: boolean
  includeCorrections: boolean
  includeComments: boolean
  abntFormatting: boolean
  quality: 'draft' | 'final'
}

const ExportPanel: React.FC<ExportPanelProps> = ({ className = '' }) => {
  const { currentDocument, exportDocument } = useEditor()
  const { user } = useAuth()
  const [isExporting, setIsExporting] = useState(false)
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'docx',
    includeMetadata: true,
    includeCorrections: true,
    includeComments: false,
    abntFormatting: true,
    quality: 'final'
  })

  const handleExport = async () => {
    if (!currentDocument) {
      toast.error('Nenhum documento carregado')
      return
    }

    setIsExporting(true)
    try {
      await exportDocument(exportOptions.format)
      toast.success(`Documento exportado como ${exportOptions.format.toUpperCase()}!`)
    } catch (error) {
      console.error('Erro na exportação:', error)
      toast.error('Erro ao exportar documento')
    } finally {
      setIsExporting(false)
    }
  }

  const handleOptionChange = (option: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({
      ...prev,
      [option]: value
    }))
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-500" />
      case 'pdf':
        return <File className="w-5 h-5 text-red-500" />
      default:
        return <File className="w-5 h-5 text-gray-500" />
    }
  }

  const getQualityInfo = (quality: string) => {
    switch (quality) {
      case 'draft':
        return {
          label: 'Rascunho',
          description: 'Exportação rápida, qualidade básica',
          color: 'text-yellow-600'
        }
      case 'final':
        return {
          label: 'Final',
          description: 'Alta qualidade, processamento completo',
          color: 'text-green-600'
        }
      default:
        return {
          label: 'Padrão',
          description: 'Qualidade balanceada',
          color: 'text-blue-600'
        }
    }
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
      className={`bg-white rounded-lg shadow-lg p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Download className="w-5 h-5 mr-2 text-unifor-blue" />
          Exportar Documento
        </h3>
        <div className="text-sm text-gray-500">
          {currentDocument.wordCount} palavras
        </div>
      </div>

      <div className="space-y-6">
        {/* Formato de Exportação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Formato de Exportação
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['docx', 'pdf'].map((format) => (
              <button
                key={format}
                onClick={() => handleOptionChange('format', format)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  exportOptions.format === format
                    ? 'border-unifor-blue bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {getFormatIcon(format)}
                  <div className="text-left">
                    <p className="font-medium text-gray-900 uppercase">
                      {format}
                    </p>
                    <p className="text-xs text-gray-600">
                      {format === 'docx' ? 'Microsoft Word' : 'Portable Document Format'}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Opções de Exportação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Opções de Exportação
          </label>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={exportOptions.includeMetadata}
                onChange={(e) => handleOptionChange('includeMetadata', e.target.checked)}
                className="w-4 h-4 text-unifor-blue border-gray-300 rounded focus:ring-unifor-blue"
              />
              <span className="text-sm text-gray-700">
                Incluir metadados (autor, data, universidade)
              </span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={exportOptions.includeCorrections}
                onChange={(e) => handleOptionChange('includeCorrections', e.target.checked)}
                className="w-4 h-4 text-unifor-blue border-gray-300 rounded focus:ring-unifor-blue"
              />
              <span className="text-sm text-gray-700">
                Incluir correções aplicadas
              </span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={exportOptions.includeComments}
                onChange={(e) => handleOptionChange('includeComments', e.target.checked)}
                className="w-4 h-4 text-unifor-blue border-gray-300 rounded focus:ring-unifor-blue"
              />
              <span className="text-sm text-gray-700">
                Incluir comentários da ProfAi
              </span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={exportOptions.abntFormatting}
                onChange={(e) => handleOptionChange('abntFormatting', e.target.checked)}
                className="w-4 h-4 text-unifor-blue border-gray-300 rounded focus:ring-unifor-blue"
              />
              <span className="text-sm text-gray-700">
                Aplicar formatação ABNT
              </span>
            </label>
          </div>
        </div>

        {/* Qualidade da Exportação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Qualidade da Exportação
          </label>
          <div className="space-y-2">
            {['draft', 'final'].map((quality) => {
              const info = getQualityInfo(quality)
              return (
                <label key={quality} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="quality"
                    value={quality}
                    checked={exportOptions.quality === quality}
                    onChange={(e) => handleOptionChange('quality', e.target.value)}
                    className="w-4 h-4 text-unifor-blue border-gray-300 focus:ring-unifor-blue"
                  />
                  <div>
                    <span className={`text-sm font-medium ${info.color}`}>
                      {info.label}
                    </span>
                    <p className="text-xs text-gray-600">
                      {info.description}
                    </p>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* Informações do Documento */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Informações do Documento
          </h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium">Título:</span> {currentDocument.title}</p>
            <p><span className="font-medium">Autor:</span> {user?.name || 'Usuário'}</p>
            <p><span className="font-medium">Universidade:</span> {user?.university || 'UNIFOR'}</p>
            <p><span className="font-medium">Última atualização:</span> {currentDocument.updatedAt.toLocaleDateString('pt-BR')}</p>
            <p><span className="font-medium">Progresso:</span> {Math.round(currentDocument.progress)}%</p>
          </div>
        </div>

        {/* Botão de Exportação */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Exportando...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Exportar {exportOptions.format.toUpperCase()}
            </>
          )}
        </button>

        {/* Dicas de Exportação */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                Dicas de Exportação
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Use formato DOCX para edição posterior no Word</li>
                <li>• Use formato PDF para apresentação final</li>
                <li>• A formatação ABNT será aplicada automaticamente</li>
                <li>• Metadados incluem informações do autor e data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ExportPanel
