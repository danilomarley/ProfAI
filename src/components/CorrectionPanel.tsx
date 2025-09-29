import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Info, Filter } from 'lucide-react'
import { useEditor } from '../context/EditorContext'
import { Correction } from '../types'

const CorrectionPanel: React.FC = () => {
  const { corrections, acceptCorrection, rejectCorrection, currentDocument } = useEditor()
  const [filter, setFilter] = useState<'all' | 'error' | 'warning' | 'suggestion'>('all')
  const [hoveredCorrection, setHoveredCorrection] = useState<string | null>(null)

  const getSeverityIcon = (severity: Correction['severity']) => {
    switch (severity) {
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

  const getSeverityColor = (severity: Correction['severity']) => {
    switch (severity) {
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'suggestion':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const getTypeLabel = (type: Correction['type']) => {
    switch (type) {
      case 'spelling':
        return 'Ortografia'
      case 'grammar':
        return 'Gramática'
      case 'style':
        return 'Estilo'
      case 'abnt':
        return 'ABNT'
      case 'suggestion':
        return 'Sugestão'
      default:
        return 'Outro'
    }
  }

  const getPreviewText = (correction: Correction) => {
    if (!currentDocument) return ''
    
    const beforeText = correction.originalText
    const afterText = correction.suggestedText
    
    return `"${beforeText}" → "${afterText}"`
  }

  const handleAcceptCorrection = (correctionId: string) => {
    acceptCorrection(correctionId)
    setHoveredCorrection(null)
  }

  const filteredCorrections = corrections.filter(correction => {
    if (filter === 'all') return true
    return correction.severity === filter
  })

  const pendingCorrections = corrections.filter(c => !c.accepted && !c.rejected)
  const acceptedCorrections = corrections.filter(c => c.accepted)
  const rejectedCorrections = corrections.filter(c => c.rejected)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Correções</h3>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="all">Todas</option>
              <option value="error">Erros</option>
              <option value="warning">Avisos</option>
              <option value="suggestion">Sugestões</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="font-semibold text-blue-600">{pendingCorrections.length}</div>
            <div className="text-blue-500">Pendentes</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="font-semibold text-green-600">{acceptedCorrections.length}</div>
            <div className="text-green-500">Aceitas</div>
          </div>
          <div className="text-center p-2 bg-red-50 rounded">
            <div className="font-semibold text-red-600">{rejectedCorrections.length}</div>
            <div className="text-red-500">Rejeitadas</div>
          </div>
        </div>
      </div>

      {/* Corrections List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredCorrections.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>Nenhuma correção encontrada</p>
          </div>
        ) : (
          filteredCorrections.map((correction) => (
            <motion.div
              key={correction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-lg p-3 ${getSeverityColor(correction.severity)} ${
                correction.accepted ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getSeverityIcon(correction.severity)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-medium text-gray-600">
                      {getTypeLabel(correction.type)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {correction.severity}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-900 mb-2">
                    {correction.message}
                  </p>
                  
                  <div className="space-y-1">
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Original:</span>
                      <span className="ml-1 text-red-600 line-through">
                        {correction.originalText}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Sugestão:</span>
                      <span className="ml-1 text-green-600 underline">
                        {correction.suggestedText}
                      </span>
                    </div>
                  </div>
                  
                  {!correction.accepted && !correction.rejected && (
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={() => handleAcceptCorrection(correction.id)}
                        onMouseEnter={() => setHoveredCorrection(correction.id)}
                        onMouseLeave={() => setHoveredCorrection(null)}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-colors relative"
                        title={getPreviewText(correction)}
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>Aceitar</span>
                        {hoveredCorrection === correction.id && (
                          <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-10">
                            {getPreviewText(correction)}
                          </div>
                        )}
                      </button>
                      <button
                        onClick={() => rejectCorrection(correction.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>Rejeitar</span>
                      </button>
                    </div>
                  )}
                  
                  {correction.accepted && (
                    <div className="flex items-center space-x-1 text-green-600 text-xs mt-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Aceita</span>
                    </div>
                  )}
                  
                  {correction.rejected && (
                    <div className="flex items-center space-x-1 text-red-600 text-xs mt-2">
                      <XCircle className="w-3 h-3" />
                      <span>Rejeitada</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

export default CorrectionPanel

