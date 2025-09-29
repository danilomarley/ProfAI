export interface User {
  id: string
  name: string
  email: string
  course: string
  university: string
  avatar?: string
  isUniforUser?: boolean
  lastLogin?: Date
  preferences?: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  language: 'pt-BR' | 'en-US'
  notifications: boolean
  autoSave: boolean
  profAiPersonality: 'empática' | 'técnica' | 'motivadora'
}

export interface Document {
  id: string
  title: string
  content: string
  originalContent: string
  createdAt: Date
  updatedAt: Date
  userId: string
  progress: number
  wordCount: number
  chapterCount: number
}

export interface Correction {
  id: string
  type: 'spelling' | 'grammar' | 'style' | 'abnt' | 'suggestion'
  severity: 'error' | 'warning' | 'suggestion'
  message: string
  originalText: string
  suggestedText: string
  position: {
    start: number
    end: number
  }
  accepted: boolean
  rejected: boolean
  applied?: boolean
  explanation?: string
  chapter?: string
}

export interface ProfAiMessage {
  id: string
  type: 'welcome' | 'correction' | 'motivation' | 'tip' | 'achievement' | 'explanation' | 'suggestion'
  content: string
  timestamp: Date
  read: boolean
  priority: 'low' | 'medium' | 'high'
  category?: 'grammar' | 'style' | 'structure' | 'abnt' | 'coherence' | 'citation'
  relatedText?: string
  position?: {
    start: number
    end: number
  }
  action?: {
    type: 'accept' | 'reject' | 'view' | 'learn' | 'apply' | 'ignore'
    label: string
    correctionId?: string
  }
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: Date
  progress: number
  maxProgress: number
}

export interface Version {
  id: string
  documentId: string
  content: string
  createdAt: Date
  changes: Correction[]
  wordCount: number
  description?: string
}

export interface ABNTTemplate {
  id: string
  name: string
  type: 'cover' | 'title-page' | 'abstract' | 'index' | 'chapter'
  content: string
  fields: string[]
}

export interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: 'deadline' | 'reminder' | 'milestone'
  description?: string
  completed: boolean
}

export interface EditorState {
  currentDocument: Document | null
  corrections: Correction[]
  viewMode: 'original' | 'corrected' | 'comparative'
  isLoading: boolean
  isSaving: boolean
  lastSaved: Date | null
}

export interface ProfAiState {
  messages: ProfAiMessage[]
  isVisible: boolean
  isTyping: boolean
  currentStep: 'welcome' | 'upload' | 'editing' | 'review' | 'export'
  achievements: Achievement[]
  progress: number
  silentMode: boolean
  personality: 'empática' | 'técnica' | 'motivadora'
  currentChapter?: string
  totalChapters?: number
}

export interface FileUpload {
  id: string
  name: string
  type: 'docx' | 'pdf'
  size: number
  status: 'uploading' | 'processing' | 'ready' | 'error'
  content?: string
  extractedText?: string
  metadata?: {
    author?: string
    title?: string
    pages?: number
    wordCount?: number
  }
  uploadedAt: Date
}

export interface ABNTFormatting {
  id: string
  type: 'margins' | 'spacing' | 'font' | 'titles' | 'citations' | 'references' | 'index'
  applied: boolean
  settings: Record<string, any>
  description: string
}

export interface Citation {
  id: string
  text: string
  author: string
  year: number
  title: string
  source: string
  type: 'book' | 'article' | 'website' | 'thesis' | 'other'
  abntFormat: string
  position?: {
    start: number
    end: number
  }
}

export interface Reference {
  id: string
  citationId: string
  abntFormat: string
  added: boolean
  position?: number
}

