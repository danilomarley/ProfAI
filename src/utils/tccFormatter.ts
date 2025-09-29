import { Correction } from '../types'

interface TCCSection {
  type: 'title' | 'subtitle' | 'paragraph' | 'list' | 'quote' | 'reference'
  content: string
  level?: number
  position: { start: number; end: number }
}

export class SmartTCCFormatter {
  private static readonly TITLE_PATTERNS = [
    /^(UNIVERSIDADE\s+FEDERAL|FACULDADE\s+DE|LICENCIATURA\s+EM)/i,
    /^(INTRODUÇÃO|INTRODUCAO|OBJETIVO|OBJETIVOS|METODOLOGIA|DESENVOLVIMENTO|CONCLUSÃO|CONCLUSAO|REFERÊNCIAS|REFERENCIAS)$/i,
    /^(RESUMO|ABSTRACT|SUMÁRIO|LISTA\s+DE|AGRADECIMENTOS|DEDICATÓRIA|EPÍGRAFE)$/i,
    /^(APÊNDICE|ANEXO)\s+[A-Z]/i,
    /^(CAPÍTULO|CAPITULO)\s+\d+/i,
    /^(SEÇÃO|SECAO)\s+\d+/i,
    /^\d+\.?\s+[A-ZÁÊÔÇÃÍÚÀÈÒÙ]/,
    /^[A-ZÁÊÔÇÃÍÚÀÈÒÙ][A-ZÁÊÔÇÃÍÚÀÈÒÙ\s]{8,}$/
  ]

  private static readonly SUBTITLE_PATTERNS = [
    /^\d+\.\d+\.?\s+[A-Za-záêôçã]/,
    /^[A-Za-záêôçã][A-Za-záêôçã\s]{3,20}$/
  ]

  private static readonly LIST_PATTERNS = [
    /^[•\-\*]\s+/,
    /^[a-z]\)\s+/,
    /^\d+\.\s+/,
    /^[IVX]+\.\s+/
  ]

  private static readonly QUOTE_PATTERNS = [
    /^".*"$/,
    /^'.*'$/,
    /^["""].*["""]$/
  ]

  private static readonly REFERENCE_PATTERNS = [
    /^[A-Z][A-Z\s,]+\.\s+.*\.\s+\d{4}\./,
    /^[A-Z]+,\s+[A-Z][a-z]+.*\d{4}/
  ]

  static analyzeAndFormat(text: string): {
    formattedText: string
    corrections: Correction[]
    sections: TCCSection[]
  } {
    const lines = text.split('\n')
    const sections: TCCSection[] = []
    const corrections: Correction[] = []
    const formattedLines: string[] = []

    let currentPosition = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      const originalLine = lines[i]
      
      if (!line) {
        formattedLines.push('')
        currentPosition += originalLine.length + 1
        continue
      }

      const lineStart = currentPosition
      const lineEnd = currentPosition + originalLine.length

      // Detectar tipo de seção
      const sectionType = this.detectSectionType(line)
      
      sections.push({
        type: sectionType.type,
        content: line,
        level: sectionType.level,
        position: { start: lineStart, end: lineEnd }
      })

      // Aplicar formatação baseada no tipo
      const formatted = this.formatSection(line, sectionType, i === 0)
      
      // Gerar correções se necessário
      if (formatted.text !== originalLine) {
        corrections.push({
          id: `format-${i}-${Date.now()}`,
          type: 'abnt',
          severity: 'suggestion',
          message: formatted.reason,
          originalText: originalLine,
          suggestedText: formatted.text,
          position: { start: lineStart, end: lineEnd },
          accepted: false,
          rejected: false,
          explanation: formatted.explanation,
          chapter: this.getChapterFromContent(line)
        })
      }

      formattedLines.push(formatted.text)
      currentPosition = lineEnd + 1
    }

    // Adicionar correções estruturais
    const structuralCorrections = this.generateStructuralCorrections(sections, text)
    corrections.push(...structuralCorrections)

    return {
      formattedText: formattedLines.join('\n'),
      corrections,
      sections
    }
  }

  private static detectSectionType(line: string): { type: TCCSection['type']; level?: number } {
    // Títulos principais
    for (const pattern of this.TITLE_PATTERNS) {
      if (pattern.test(line)) {
        return { type: 'title', level: 1 }
      }
    }

    // Subtítulos
    for (const pattern of this.SUBTITLE_PATTERNS) {
      if (pattern.test(line)) {
        const level = (line.match(/\d+\./g) || []).length + 1
        return { type: 'subtitle', level }
      }
    }

    // Listas
    for (const pattern of this.LIST_PATTERNS) {
      if (pattern.test(line)) {
        return { type: 'list' }
      }
    }

    // Citações
    for (const pattern of this.QUOTE_PATTERNS) {
      if (pattern.test(line)) {
        return { type: 'quote' }
      }
    }

    // Referências
    for (const pattern of this.REFERENCE_PATTERNS) {
      if (pattern.test(line)) {
        return { type: 'reference' }
      }
    }

    return { type: 'paragraph' }
  }

  private static formatSection(
    line: string, 
    sectionType: { type: TCCSection['type']; level?: number },
    isFirstLine: boolean
  ): { text: string; reason: string; explanation: string } {
    switch (sectionType.type) {
      case 'title':
        return this.formatTitle(line, sectionType.level || 1, isFirstLine)
      case 'subtitle':
        return this.formatSubtitle(line, sectionType.level || 2)
      case 'paragraph':
        return this.formatParagraph(line)
      case 'list':
        return this.formatList(line)
      case 'quote':
        return this.formatQuote(line)
      case 'reference':
        return this.formatReference(line)
      default:
        return { text: line, reason: '', explanation: '' }
    }
  }

  private static formatTitle(line: string, level: number, isFirstLine: boolean): { text: string; reason: string; explanation: string } {
    let formatted = line.toUpperCase().trim()
    
    // Remover pontos finais de títulos
    if (formatted.endsWith('.')) {
      formatted = formatted.slice(0, -1)
    }

    // Centralizar títulos principais
    if (level === 1 && !isFirstLine) {
      formatted = `\n\n${formatted}\n`
    }

    // Numeração automática se necessário
    if (level > 1 && !/^\d+/.test(formatted)) {
      // Aqui você poderia implementar numeração automática baseada no contexto
    }

    return {
      text: formatted,
      reason: 'Formatação de título ABNT aplicada',
      explanation: 'Títulos devem estar em maiúsculas, centralizados e sem ponto final segundo ABNT NBR 14724.'
    }
  }

  private static formatSubtitle(line: string, level: number): { text: string; reason: string; explanation: string } {
    let formatted = line.trim()
    
    // Capitalizar primeira letra de cada palavra importante
    formatted = formatted.replace(/\b\w+/g, (word) => {
      const lowerWords = ['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'na', 'no', 'nas', 'nos', 'a', 'o', 'as', 'os']
      return lowerWords.includes(word.toLowerCase()) ? word.toLowerCase() : 
             word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })

    // Remover ponto final
    if (formatted.endsWith('.')) {
      formatted = formatted.slice(0, -1)
    }

    return {
      text: `\n${formatted}\n`,
      reason: 'Formatação de subtítulo ABNT aplicada',
      explanation: 'Subtítulos devem ter capitalização adequada e espaçamento correto.'
    }
  }

  private static formatParagraph(line: string): { text: string; reason: string; explanation: string } {
    let formatted = line.trim()
    
    // Recuo de primeira linha (simulado com espaços)
    if (!formatted.startsWith('    ')) {
      formatted = `    ${formatted}`
    }

    // Justificar texto (adicionar espaçamento se necessário)
    // Em um editor real, isso seria feito via CSS

    return {
      text: formatted,
      reason: 'Recuo de parágrafo aplicado',
      explanation: 'Parágrafos devem ter recuo de 1,25cm na primeira linha conforme ABNT.'
    }
  }

  private static formatList(line: string): { text: string; reason: string; explanation: string } {
    let formatted = line.trim()
    
    // Padronizar marcadores de lista
    if (/^[•\-\*]\s+/.test(formatted)) {
      formatted = formatted.replace(/^[•\-\*]\s+/, '• ')
    }

    // Adicionar recuo
    if (!formatted.startsWith('  ')) {
      formatted = `  ${formatted}`
    }

    return {
      text: formatted,
      reason: 'Formatação de lista padronizada',
      explanation: 'Listas devem usar marcadores padronizados e recuo adequado.'
    }
  }

  private static formatQuote(line: string): { text: string; reason: string; explanation: string } {
    let formatted = line.trim()
    
    // Recuo para citações longas (mais de 3 linhas ou 40 palavras)
    const wordCount = formatted.split(/\s+/).length
    if (wordCount > 40) {
      formatted = `        ${formatted.replace(/^["'""]|["'""]$/g, '')}`
      return {
        text: `\n${formatted}\n`,
        reason: 'Citação longa formatada',
        explanation: 'Citações com mais de 3 linhas devem ter recuo de 4cm e sem aspas.'
      }
    }

    return {
      text: formatted,
      reason: 'Citação curta mantida',
      explanation: 'Citações curtas permanecem no parágrafo com aspas.'
    }
  }

  private static formatReference(line: string): { text: string; reason: string; explanation: string } {
    let formatted = line.trim()
    
    // Formatação básica de referência ABNT
    // AUTOR, Nome. Título. Local: Editora, Ano.
    
    return {
      text: formatted,
      reason: 'Referência formatada',
      explanation: 'Referências devem seguir o padrão ABNT NBR 6023.'
    }
  }

  private static generateStructuralCorrections(sections: TCCSection[], text: string): Correction[] {
    const corrections: Correction[] = []
    
    // Verificar se tem introdução
    const hasIntroduction = sections.some(s => 
      s.type === 'title' && /INTRODUÇÃO|INTRODUCAO/i.test(s.content)
    )
    
    if (!hasIntroduction) {
      corrections.push({
        id: `struct-intro-${Date.now()}`,
        type: 'abnt',
        severity: 'warning',
        message: 'TCC deve conter uma seção de Introdução',
        originalText: text.split('\n')[0] || '',
        suggestedText: 'INTRODUÇÃO\n\n' + (text.split('\n')[0] || ''),
        position: { start: 0, end: 0 },
        accepted: false,
        rejected: false,
        explanation: 'Todo TCC deve ter uma seção de Introdução claramente identificada.',
        chapter: 'Estrutura'
      })
    }

    // Verificar se tem conclusão
    const hasConclusion = sections.some(s => 
      s.type === 'title' && /CONCLUSÃO|CONCLUSAO/i.test(s.content)
    )
    
    if (!hasConclusion) {
      corrections.push({
        id: `struct-conclusion-${Date.now()}`,
        type: 'abnt',
        severity: 'warning',
        message: 'TCC deve conter uma seção de Conclusão',
        originalText: '',
        suggestedText: '\n\nCONCLUSÃO\n\n',
        position: { start: text.length, end: text.length },
        accepted: false,
        rejected: false,
        explanation: 'Todo TCC deve ter uma seção de Conclusão.',
        chapter: 'Estrutura'
      })
    }

    // Verificar referências
    const hasReferences = sections.some(s => 
      s.type === 'title' && /REFERÊNCIAS|REFERENCIAS/i.test(s.content)
    )
    
    if (!hasReferences) {
      corrections.push({
        id: `struct-references-${Date.now()}`,
        type: 'abnt',
        severity: 'error',
        message: 'TCC deve conter seção de Referências',
        originalText: '',
        suggestedText: '\n\nREFERÊNCIAS\n\n',
        position: { start: text.length, end: text.length },
        accepted: false,
        rejected: false,
        explanation: 'Seção de Referências é obrigatória em trabalhos acadêmicos.',
        chapter: 'Estrutura'
      })
    }

    return corrections
  }

  private static getChapterFromContent(content: string): string {
    if (/INTRODUÇÃO|INTRODUCAO/i.test(content)) return 'Introdução'
    if (/METODOLOGIA/i.test(content)) return 'Metodologia'
    if (/DESENVOLVIMENTO/i.test(content)) return 'Desenvolvimento'
    if (/CONCLUSÃO|CONCLUSAO/i.test(content)) return 'Conclusão'
    if (/REFERÊNCIAS|REFERENCIAS/i.test(content)) return 'Referências'
    return 'Desenvolvimento'
  }

  static quickFormat(text: string): string {
    // Formatação rápida para uma linha de texto
    if (!text || text.length < 5) return text

    // Se parece com título
    if (this.TITLE_PATTERNS.some(pattern => pattern.test(text))) {
      return text.toUpperCase().trim().replace(/\.$/, '')
    }

    // Se parece com subtítulo
    if (this.SUBTITLE_PATTERNS.some(pattern => pattern.test(text))) {
      return text.replace(/\b\w+/g, (word) => {
        const lowerWords = ['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'na', 'no']
        return lowerWords.includes(word.toLowerCase()) ? word.toLowerCase() : 
               word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      }).replace(/\.$/, '')
    }

    // Parágrafo normal - adicionar recuo
    return `    ${text.trim()}`
  }
}
