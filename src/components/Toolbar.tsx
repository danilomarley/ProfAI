import React from 'react'
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered,
  Quote,
  Link,
  Image,
  Table,
  Type,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react'
import { useEditorRef } from '../context/EditorRefContext'

const Toolbar: React.FC = () => {
  const { editorRef } = useEditorRef()
  const executeCommand = (command: string, value?: string) => {
    if (editorRef?.current) {
      const editor = editorRef.current
      const selection = editor.getSelection()
      
      switch (command) {
        case 'bold':
          editor.trigger('keyboard', 'editor.action.insertSnippet', {
            snippetText: '**${1:${TM_SELECTED_TEXT}}**'
          })
          break
        case 'italic':
          editor.trigger('keyboard', 'editor.action.insertSnippet', {
            snippetText: '*${1:${TM_SELECTED_TEXT}}*'
          })
          break
        case 'underline':
          editor.trigger('keyboard', 'editor.action.insertSnippet', {
            snippetText: '<u>${1:${TM_SELECTED_TEXT}}</u>'
          })
          break
        case 'formatBlock':
          if (value === 'h1') {
            editor.trigger('keyboard', 'editor.action.insertSnippet', {
              snippetText: '# ${1:${TM_SELECTED_TEXT}}'
            })
          } else if (value === 'h2') {
            editor.trigger('keyboard', 'editor.action.insertSnippet', {
              snippetText: '## ${1:${TM_SELECTED_TEXT}}'
            })
          } else if (value === 'h3') {
            editor.trigger('keyboard', 'editor.action.insertSnippet', {
              snippetText: '### ${1:${TM_SELECTED_TEXT}}'
            })
          } else if (value === 'blockquote') {
            editor.trigger('keyboard', 'editor.action.insertSnippet', {
              snippetText: '> ${1:${TM_SELECTED_TEXT}}'
            })
          }
          break
        case 'insertUnorderedList':
          editor.trigger('keyboard', 'editor.action.insertSnippet', {
            snippetText: '- ${1:${TM_SELECTED_TEXT}}'
          })
          break
        case 'insertOrderedList':
          editor.trigger('keyboard', 'editor.action.insertSnippet', {
            snippetText: '1. ${1:${TM_SELECTED_TEXT}}'
          })
          break
        case 'createLink':
          editor.trigger('keyboard', 'editor.action.insertSnippet', {
            snippetText: '[${1:${TM_SELECTED_TEXT}}](${2:url})'
          })
          break
        case 'insertImage':
          editor.trigger('keyboard', 'editor.action.insertSnippet', {
            snippetText: '![${1:alt}](${2:url})'
          })
          break
        case 'insertTable':
          editor.trigger('keyboard', 'editor.action.insertSnippet', {
            snippetText: '| ${1:Coluna 1} | ${2:Coluna 2} |\n| --- | --- |\n| ${3:Dados} | ${4:Dados} |'
          })
          break
        default:
          editor.trigger('keyboard', 'editor.action.formatDocument', {})
      }
    }
  }

  const toolbarItems = [
    {
      group: 'Formatação',
      items: [
        { icon: Bold, command: 'bold', title: 'Negrito (Ctrl+B)' },
        { icon: Italic, command: 'italic', title: 'Itálico (Ctrl+I)' },
        { icon: Underline, command: 'underline', title: 'Sublinhado (Ctrl+U)' },
      ]
    },
    {
      group: 'Títulos',
      items: [
        { icon: Heading1, command: 'formatBlock', value: 'h1', title: 'Título 1' },
        { icon: Heading2, command: 'formatBlock', value: 'h2', title: 'Título 2' },
        { icon: Heading3, command: 'formatBlock', value: 'h3', title: 'Título 3' },
      ]
    },
    {
      group: 'Alinhamento',
      items: [
        { icon: AlignLeft, command: 'justifyLeft', title: 'Alinhar à esquerda' },
        { icon: AlignCenter, command: 'justifyCenter', title: 'Centralizar' },
        { icon: AlignRight, command: 'justifyRight', title: 'Alinhar à direita' },
      ]
    },
    {
      group: 'Listas',
      items: [
        { icon: List, command: 'insertUnorderedList', title: 'Lista com marcadores' },
        { icon: ListOrdered, command: 'insertOrderedList', title: 'Lista numerada' },
      ]
    },
    {
      group: 'Elementos',
      items: [
        { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Citação' },
        { icon: Link, command: 'createLink', title: 'Inserir link' },
        { icon: Image, command: 'insertImage', title: 'Inserir imagem' },
        { icon: Table, command: 'insertTable', title: 'Inserir tabela' },
      ]
    }
  ]

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex flex-wrap items-center gap-1">
        {toolbarItems.map((group, groupIndex) => (
          <div key={group.group} className="flex items-center">
            {groupIndex > 0 && (
              <div className="w-px h-6 bg-gray-300 mx-2" />
            )}
            <div className="flex items-center space-x-1">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon
                return (
                  <button
                    key={itemIndex}
                    onClick={() => executeCommand(item.command, item.value)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                    title={item.title}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                )
              })}
            </div>
          </div>
        ))}
        
        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        {/* ABNT Tools */}
        <div className="flex items-center space-x-1">
          <button
            className="p-2 text-unifor-blue hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            title="Formatação ABNT"
          >
            <Type className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Toolbar

