import React, { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { useEditor } from '../context/EditorContext'
import toast from 'react-hot-toast'

interface FileUploadProps {
  onClose: () => void
}

const FileUpload: React.FC<FileUploadProps> = ({ onClose }) => {
  const { uploadFile } = useEditor()
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      setUploadStatus('uploading')
      
      try {
        await uploadFile(file)
        setUploadStatus('success')
        toast.success('Arquivo carregado com sucesso!')
        setTimeout(() => {
          onClose()
        }, 1500)
      } catch (error) {
        setUploadStatus('error')
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao carregar arquivo'
        toast.error(errorMessage)
        console.error('Erro no upload:', error)
      }
    }
  }, [uploadFile, onClose])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-unifor-blue" />
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-500" />
      default:
        return <Upload className="w-8 h-8 text-gray-400" />
    }
  }

  const getStatusMessage = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Processando arquivo...'
      case 'success':
        return 'Arquivo carregado com sucesso!'
      case 'error':
        return 'Erro ao processar arquivo'
      default:
        return 'Arraste um arquivo aqui ou clique para selecionar'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upload de Arquivo</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-unifor-blue bg-blue-50'
                : uploadStatus === 'success'
                ? 'border-green-500 bg-green-50'
                : uploadStatus === 'error'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 hover:border-unifor-blue hover:bg-blue-50'
            }`}
          >
            <input {...getInputProps()} />
            
            <div className="flex flex-col items-center space-y-4">
              {getStatusIcon()}
              
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {getStatusMessage()}
                </p>
                {uploadedFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    {uploadedFile.name}
                  </p>
                )}
              </div>

              {uploadStatus === 'idle' && (
                <div className="text-sm text-gray-500">
                  <p>Formatos suportados: .docx, .pdf</p>
                  <p>Tamanho máximo: 10MB</p>
                </div>
              )}
            </div>
          </div>

          {/* File Info */}
          {uploadedFile && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <File className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            {uploadStatus === 'success' && (
              <button
                onClick={onClose}
                className="btn-primary"
              >
                Continuar
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default FileUpload

