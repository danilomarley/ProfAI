import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import TextEditor from '../TextEditor'

const mockCorrections = [
  {
    id: '1',
    type: 'spelling' as const,
    severity: 'error' as const,
    message: 'Erro de ortografia',
    originalText: 'tecnologia',
    suggestedText: 'tecnologia',
    position: { start: 0, end: 10 },
    accepted: false,
    rejected: false,
  },
  {
    id: '2',
    type: 'grammar' as const,
    severity: 'warning' as const,
    message: 'Erro gramatical',
    originalText: 'a tecnologia',
    suggestedText: 'a tecnologia',
    position: { start: 0, end: 12 },
    accepted: true,
    rejected: false,
  },
]

describe('TextEditor', () => {
  const defaultProps = {
    content: 'Este é um texto de exemplo para teste.',
    onChange: jest.fn(),
    viewMode: 'original' as const,
    corrections: mockCorrections,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the editor with content', () => {
    render(<TextEditor {...defaultProps} />)
    
    expect(screen.getByText('Este é um texto de exemplo para teste.')).toBeInTheDocument()
  })

  it('shows view mode toggle buttons', () => {
    render(<TextEditor {...defaultProps} />)
    
    expect(screen.getByText('Original')).toBeInTheDocument()
    expect(screen.getByText('Corrigido')).toBeInTheDocument()
    expect(screen.getByText('Comparativo')).toBeInTheDocument()
  })

  it('calls onChange when content is modified', () => {
    render(<TextEditor {...defaultProps} />)
    
    const editor = screen.getByRole('textbox')
    fireEvent.input(editor, { target: { textContent: 'Novo conteúdo' } })
    
    expect(defaultProps.onChange).toHaveBeenCalledWith('Novo conteúdo')
  })

  it('applies corrections in corrected view mode', () => {
    render(<TextEditor {...defaultProps} viewMode="corrected" />)
    
    // Should show corrected text with styling
    expect(screen.getByText('a tecnologia')).toHaveClass('text-suggestion')
  })

  it('shows comparative view when selected', () => {
    render(<TextEditor {...defaultProps} viewMode="comparative" />)
    
    expect(screen.getByText('Original')).toBeInTheDocument()
    expect(screen.getByText('Corrigido')).toBeInTheDocument()
  })

  it('handles keyboard shortcuts', () => {
    render(<TextEditor {...defaultProps} />)
    
    const editor = screen.getByRole('textbox')
    
    // Test Ctrl+S (save)
    fireEvent.keyDown(editor, { key: 's', ctrlKey: true })
    // Should not prevent default for save (handled by parent)
    
    // Test Ctrl+B (bold)
    fireEvent.keyDown(editor, { key: 'b', ctrlKey: true })
    // Should prevent default and execute command
  })
})

