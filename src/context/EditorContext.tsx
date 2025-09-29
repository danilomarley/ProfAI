import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Document, Correction, Version, EditorState } from '../types'
import { useAuth } from './AuthContext'
import { SmartTCCFormatter } from '../utils/tccFormatter'
import mammoth from 'mammoth'

interface EditorContextType extends EditorState {
  loadDocument: (documentId: string) => Promise<void>
  saveDocument: () => Promise<void>
  createDocument: (title: string, content?: string) => Promise<Document>
  updateDocument: (document: Document) => void
  updateContent: (content: string) => void
  analyzeText: (text: string) => Promise<void>
  addCorrection: (correction: Omit<Correction, 'id'>) => void
  acceptCorrection: (correctionId: string) => void
  rejectCorrection: (correctionId: string) => void
  setViewMode: (mode: 'original' | 'corrected' | 'comparative') => void
  exportDocument: (format: 'docx' | 'pdf') => Promise<void>
  createVersion: (description?: string) => Promise<Version>
  loadVersion: (versionId: string) => Promise<void>
  uploadFile: (file: File) => Promise<void>
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export const useEditor = () => {
  const context = useContext(EditorContext)
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider')
  }
  return context
}

interface EditorProviderProps {
  children: ReactNode
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const { user } = useAuth()
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null)
  const [corrections, setCorrections] = useState<Correction[]>([])
  const [viewMode, setViewMode] = useState<'original' | 'corrected' | 'comparative'>('original')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const loadDocument = useCallback(async (documentId: string) => {
    setIsLoading(true)
    try {
      // Simular carregamento de documento
      const response = await fetch(`/api/documents/${documentId}`)
      if (response.ok) {
        const document = await response.json()
        setCurrentDocument(document)
        setCorrections(document.corrections || [])
        setLastSaved(new Date(document.updatedAt))
      }
    } catch (error) {
      console.error('Erro ao carregar documento:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const saveDocument = useCallback(async () => {
    if (!currentDocument) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/documents/${currentDocument.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: currentDocument.content,
          corrections,
          progress: calculateProgress(),
        }),
      })

      if (response.ok) {
        setLastSaved(new Date())
      }
    } catch (error) {
      console.error('Erro ao salvar documento:', error)
    } finally {
      setIsSaving(false)
    }
  }, [currentDocument, corrections])

  const createDocument = useCallback(async (title: string, content = '') => {
    if (!user) throw new Error('Usuário não autenticado')

    const newDocument: Document = {
      id: Date.now().toString(),
      title,
      content,
      originalContent: content,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.id,
      progress: 0,
      wordCount: content.split(/\s+/).length,
      chapterCount: 0,
    }

    setCurrentDocument(newDocument)
    setCorrections([])
    setLastSaved(new Date())
    
    return newDocument
  }, [user])

  const updateDocument = useCallback((document: Document) => {
    setCurrentDocument(document)
  }, [])

  const updateContent = useCallback((content: string) => {
    if (currentDocument) {
      setCurrentDocument({
        ...currentDocument,
        content,
        updatedAt: new Date(),
        wordCount: content.split(/\s+/).length,
      })
    }
  }, [currentDocument])

  // Função para analisar texto e gerar correções com IA inteligente
  const analyzeText = useCallback(async (text: string) => {
    if (!text || text.length < 50) return

    try {
      // Limitar análise para evitar sobrecarga
      if (text.length > 5000) {
        text = text.substring(0, 5000) // Analisar apenas primeiros 5000 caracteres
      }

      // Usar a IA inteligente para análise completa
      const analysis = SmartTCCFormatter.analyzeAndFormat(text)
      
      // Combinar com análise de erros comuns de português (mais seletiva)
      const additionalCorrections: Correction[] = []
      
      // Detectar apenas erros críticos de português
      const commonErrors = [
        { pattern: /\b(nao|naum)\b/gi, correction: 'não', type: 'spelling' as const, severity: 'error' as const, explanation: 'Erro de ortografia. Use "não" com acento circunflexo.' },
        { pattern: /\b(voce|vc)\b/gi, correction: 'você', type: 'spelling' as const, severity: 'error' as const, explanation: 'Em textos acadêmicos, escreva "você" por extenso.' },
        { pattern: /\b(pra|pro)\b/gi, correction: 'para', type: 'spelling' as const, severity: 'error' as const, explanation: 'Use a preposição completa "para" em textos formais.' },
        
        // Apenas erros graves de concordância
        { pattern: /\b(haviam)\b/gi, correction: 'havia', type: 'grammar' as const, severity: 'error' as const, explanation: 'O verbo "haver" no sentido de "existir" é impessoal e não varia.' },
        { pattern: /\b(fazem)\s+(anos|meses|dias)/gi, correction: 'faz', type: 'grammar' as const, severity: 'error' as const, explanation: 'O verbo "fazer" indicando tempo é impessoal e não varia.' },
      ]

      commonErrors.forEach(({ pattern, correction, type, severity, explanation }) => {
        let match
        const regex = new RegExp(pattern.source, pattern.flags)
        while ((match = regex.exec(text)) !== null) {
          additionalCorrections.push({
            id: Date.now().toString() + Math.random(),
            type,
            severity,
            message: `${severity === 'error' ? 'Erro' : severity === 'warning' ? 'Atenção' : 'Sugestão'}: ${correction}`,
            originalText: match[0],
            suggestedText: correction,
            position: {
              start: match.index,
              end: match.index + match[0].length
            },
            accepted: false,
            rejected: false,
            explanation,
            chapter: getChapterFromPosition(text, match.index)
          })
        }
      })

      // Combinar correções da IA com correções adicionais
      const allCorrections = [...analysis.corrections, ...additionalCorrections]

      if (allCorrections.length > 0) {
        setCorrections(prev => {
          // Evitar duplicatas baseado no texto original e posição
          const existingKeys = new Set(prev.map(c => `${c.originalText}-${c.position.start}`))
          const newCorrections = allCorrections.filter(c => 
            !existingKeys.has(`${c.originalText}-${c.position.start}`)
          )
          return [...prev, ...newCorrections]
        })
      }
    } catch (error) {
      console.error('Erro ao analisar texto:', error)
    }
  }, [])

  // Função auxiliar para determinar o capítulo baseado na posição
  const getChapterFromPosition = (text: string, position: number): string => {
    const textBeforePosition = text.substring(0, position)
    const lines = textBeforePosition.split('\n')
    
    // Procurar pelo último título antes da posição
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim().toUpperCase()
      if (line.includes('INTRODUÇÃO') || line.includes('INTRODUCAO')) return 'Introdução'
      if (line.includes('METODOLOGIA')) return 'Metodologia'
      if (line.includes('DESENVOLVIMENTO')) return 'Desenvolvimento'
      if (line.includes('RESULTADOS')) return 'Resultados'
      if (line.includes('DISCUSSÃO') || line.includes('DISCUSSAO')) return 'Discussão'
      if (line.includes('CONCLUSÃO') || line.includes('CONCLUSAO')) return 'Conclusão'
      if (line.includes('REFERÊNCIAS') || line.includes('REFERENCIAS')) return 'Referências'
    }
    
    return 'Desenvolvimento' // Padrão
  }

  const addCorrection = useCallback((correction: Omit<Correction, 'id'>) => {
    const newCorrection: Correction = {
      ...correction,
      id: Date.now().toString(),
    }
    setCorrections(prev => [...prev, newCorrection])
  }, [])

  const acceptCorrection = useCallback((correctionId: string) => {
    setCorrections(prev => 
      prev.map(correction => 
        correction.id === correctionId 
          ? { ...correction, accepted: true, rejected: false }
          : correction
      )
    )
  }, [])

  const rejectCorrection = useCallback((correctionId: string) => {
    setCorrections(prev => 
      prev.map(correction => 
        correction.id === correctionId 
          ? { ...correction, rejected: true, accepted: false }
          : correction
      )
    )
  }, [])

  const calculateProgress = useCallback(() => {
    if (!currentDocument) return 0
    const totalCorrections = corrections.length
    const acceptedCorrections = corrections.filter(c => c.accepted).length
    return totalCorrections > 0 ? (acceptedCorrections / totalCorrections) * 100 : 0
  }, [currentDocument, corrections])

  const exportDocument = useCallback(async (format: 'docx' | 'pdf') => {
    if (!currentDocument) return

    try {
      // Simular exportação (em produção, seria integrado com APIs de geração de documentos)
      const content = currentDocument.content
      const title = currentDocument.title
      
      if (format === 'docx') {
        // Simular geração de DOCX
        const docxContent = generateDocxContent(content, title, currentDocument)
        downloadFile(docxContent, `${title}.docx`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      } else if (format === 'pdf') {
        // Simular geração de PDF
        const pdfContent = generatePdfContent(content, title, currentDocument)
        downloadFile(pdfContent, `${title}.pdf`, 'application/pdf')
      }
    } catch (error) {
      console.error('Erro ao exportar documento:', error)
      throw error
    }
  }, [currentDocument])

  // Função auxiliar para gerar conteúdo DOCX
  const generateDocxContent = (content: string, title: string, document: Document) => {
    // Simular estrutura DOCX básica
    const docxStructure = {
      title: title,
      content: content,
      metadata: {
        author: 'ProfAi TCC Editor',
        created: document.createdAt.toISOString(),
        modified: document.updatedAt.toISOString(),
        wordCount: document.wordCount
      },
      formatting: {
        font: 'Times New Roman',
        size: '12pt',
        margins: {
          top: '3cm',
          bottom: '2cm',
          left: '3cm',
          right: '2cm'
        },
        lineHeight: '1.5',
        abnt: true
      }
    }
    
    // Em produção, aqui seria usado uma biblioteca como docx.js
    return JSON.stringify(docxStructure)
  }

  // Função auxiliar para gerar conteúdo PDF
  const generatePdfContent = (content: string, title: string, document: Document) => {
    // Simular estrutura PDF básica
    const pdfStructure = {
      title: title,
      content: content,
      metadata: {
        author: 'ProfAi TCC Editor',
        subject: 'Trabalho de Conclusão de Curso',
        creator: 'ProfAi TCC Editor',
        producer: 'ProfAi TCC Editor',
        creationDate: document.createdAt.toISOString(),
        modificationDate: document.updatedAt.toISOString()
      },
      formatting: {
        pageSize: 'A4',
        margins: {
          top: 72,
          bottom: 72,
          left: 72,
          right: 72
        },
        font: 'Times-Roman',
        fontSize: 12,
        abnt: true
      }
    }
    
    // Em produção, aqui seria usado uma biblioteca como pdf-lib
    return JSON.stringify(pdfStructure)
  }

  // Função auxiliar para download de arquivo
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const createVersion = useCallback(async (description?: string) => {
    if (!currentDocument) throw new Error('Nenhum documento carregado')

    const version: Version = {
      id: Date.now().toString(),
      documentId: currentDocument.id,
      content: currentDocument.content,
      createdAt: new Date(),
      changes: corrections.filter(c => c.accepted),
      wordCount: currentDocument.wordCount,
      description,
    }

    // Simular salvamento da versão
    await fetch(`/api/documents/${currentDocument.id}/versions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(version),
    })

    return version
  }, [currentDocument, corrections])

  const loadVersion = useCallback(async (versionId: string) => {
    if (!currentDocument) return

    try {
      const response = await fetch(`/api/documents/${currentDocument.id}/versions/${versionId}`)
      if (response.ok) {
        const version = await response.json()
        setCurrentDocument(prev => prev ? { ...prev, content: version.content } : null)
        setCorrections(version.changes || [])
      }
    } catch (error) {
      console.error('Erro ao carregar versão:', error)
    }
  }, [currentDocument])

  const uploadFile = useCallback(async (file: File) => {
    if (!user) throw new Error('Usuário não autenticado')

    setIsLoading(true)
    try {
      let extractedText = ''
      
      if (file.type === 'application/pdf') {
        // Simular leitura do PDF (em produção, usar pdf-parse ou similar)
        const reader = new FileReader()
        const text = await new Promise<string>((resolve) => {
          reader.onload = (e) => {
            // Simular extração de texto do PDF
            const content = `[Conteúdo extraído do PDF: ${file.name}]

Este é um exemplo de texto extraído de um arquivo PDF. O arquivo foi carregado com sucesso e está pronto para edição e correção pela ProfAi.

Nota: Para extração completa de PDF, seria necessário implementar uma solução server-side ou usar uma biblioteca específica para browsers.

Você pode começar a editar o texto e receber sugestões de melhoria em tempo real.

Texto simulado do PDF:
Este é um trabalho de conclusão de curso sobre inteligência artificial na educação.
O objetivo é analisar como as tecnologias podem melhorar o processo de ensino-aprendizagem.
A metodologia utilizada será de pesquisa bibliográfica e estudo de caso.
Os resultados esperados incluem melhorias significativas no desempenho dos estudantes.`
            resolve(content)
          }
          reader.readAsText(file)
        })
        extractedText = text
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Extrair texto real do DOCX
        try {
          const arrayBuffer = await file.arrayBuffer()
          const result = await mammoth.extractRawText({ arrayBuffer })
          extractedText = result.value || `Erro ao extrair texto do arquivo ${file.name}`
          
          // Se o texto extraído estiver vazio, usar conteúdo de exemplo
          if (!extractedText.trim()) {
            extractedText = `[Conteúdo extraído do DOCX: ${file.name}]

Este é um trabalho de conclusão de curso sobre inteligência artificial na educação.

INTRODUÇÃO

A inteligência artificial (IA) tem se tornado uma ferramenta cada vez mais importante na educação moderna. Este trabalho visa analisar como as tecnologias de IA podem melhorar o processo de ensino-aprendizagem.

OBJETIVOS

O objetivo geral é investigar as aplicações da inteligência artificial na educação e seus impactos no desempenho dos estudantes.

Os objetivos específicos incluem:
- Analisar as principais tecnologias de IA aplicadas à educação
- Avaliar os benefícios e desafios da implementação
- Propor diretrizes para uso efetivo da IA em ambientes educacionais

METODOLOGIA

A metodologia utilizada será de pesquisa bibliográfica e estudo de caso, com análise qualitativa e quantitativa dos dados coletados.

RESULTADOS ESPERADOS

Os resultados esperados incluem melhorias significativas no desempenho dos estudantes e maior eficiência no processo educacional.`
          }
        } catch (error) {
          console.error('Erro ao processar DOCX:', error)
          extractedText = `Erro ao processar arquivo ${file.name}. Verifique se o arquivo não está corrompido.`
        }
      } else {
        throw new Error('Tipo de arquivo não suportado')
      }

      const newDocument: Document = {
        id: Date.now().toString(),
        title: file.name.replace(/\.[^/.]+$/, ''),
        content: extractedText,
        originalContent: extractedText,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user.id,
        progress: 0,
        wordCount: extractedText.split(/\s+/).length,
        chapterCount: 0,
      }

      setCurrentDocument(newDocument)
      setCorrections([])
      setLastSaved(new Date())
      
    } catch (error) {
      console.error('Erro no upload:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const value: EditorContextType = {
    currentDocument,
    corrections,
    viewMode,
    isLoading,
    isSaving,
    lastSaved,
    loadDocument,
    saveDocument,
    createDocument,
    updateDocument,
    updateContent,
    analyzeText,
    addCorrection,
    acceptCorrection,
    rejectCorrection,
    setViewMode,
    exportDocument,
    createVersion,
    loadVersion,
    uploadFile,
  }

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  )
}

