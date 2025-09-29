import React from 'react'
import { useEditor } from '../context/EditorContext'
import { useProfAi } from '../context/ProfAiContext'

const ProgressBar: React.FC = () => {
  const { currentDocument, corrections } = useEditor()
  const { progress } = useProfAi()

  if (!currentDocument) return null

  const totalCorrections = corrections.length
  const acceptedCorrections = corrections.filter(c => c.accepted).length
  const pendingCorrections = corrections.filter(c => !c.accepted && !c.rejected).length

  const progressPercentage = totalCorrections > 0 ? (acceptedCorrections / totalCorrections) * 100 : 0

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span>Progresso da Revisão</span>
        <span>{Math.round(progressPercentage)}%</span>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{acceptedCorrections} de {totalCorrections} correções aceitas</span>
        {pendingCorrections > 0 && (
          <span className="text-yellow-600">{pendingCorrections} pendentes</span>
        )}
      </div>
    </div>
  )
}

export default ProgressBar

