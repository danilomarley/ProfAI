import React, { createContext, useContext, useRef } from 'react'

interface EditorRefContextType {
  editorRef: React.RefObject<any>
  setEditorRef: (ref: React.RefObject<any>) => void
}

const EditorRefContext = createContext<EditorRefContextType | undefined>(undefined)

export const useEditorRef = () => {
  const context = useContext(EditorRefContext)
  if (!context) {
    throw new Error('useEditorRef must be used within an EditorRefProvider')
  }
  return context
}

export const EditorRefProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const editorRef = useRef<any>(null)

  const setEditorRef = (ref: React.RefObject<any>) => {
    editorRef.current = ref.current
  }

  return (
    <EditorRefContext.Provider value={{ editorRef, setEditorRef }}>
      {children}
    </EditorRefContext.Provider>
  )
}
