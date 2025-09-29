# 🎨 Diagramas UML Visuais - ProfAi TCC Editor

## 📋 Como Visualizar os Diagramas de Caso de Uso

### 🔧 **Opções para Visualização dos Diagramas**

#### 1. 🌐 **Mermaid Live Editor** (Recomendado)
- **URL**: https://mermaid.live/
- **Como usar**:
  1. Acesse o site
  2. Cole o código Mermaid dos diagramas
  3. Visualize em tempo real
  4. Exporte como PNG/SVG

#### 2. 📝 **GitHub/GitLab** (Automático)
- Os diagramas Mermaid são renderizados automaticamente
- Basta visualizar os arquivos `.md` no repositório
- Suporte nativo para Mermaid

#### 3. 🔧 **VS Code Extensions**
- **Mermaid Preview**: Visualização em tempo real
- **Markdown Preview Enhanced**: Suporte completo
- **PlantUML**: Para diagramas UML tradicionais

#### 4. 🖥️ **Ferramentas Desktop**
- **Draw.io** (Gratuito): https://app.diagrams.net/
- **Lucidchart**: Ferramenta profissional
- **PlantUML**: Geração automática de diagramas

---

## 🎯 **Diagramas de Caso de Uso no Estilo Visual Tradicional**

### 1. 🔐 **Gestão de Usuários e Autenticação**

```plantuml
@startuml
!theme plain
skinparam backgroundColor white
skinparam actor {
  BackgroundColor lightblue
  BorderColor black
}
skinparam usecase {
  BackgroundColor lightyellow
  BorderColor black
}

left to right direction

actor "👤 Usuário" as User
actor "🏫 Sistema UNIFOR" as UNIFOR

rectangle "Sistema de Autenticação" {
  usecase "Fazer Login\nvia UNIFOR" as UC001
  usecase "Registrar\nNova Conta" as UC002
  usecase "Gerenciar\nPerfil" as UC003
  usecase "Configurar\nPreferências" as UC004
  usecase "Logout\nSeguro" as UC005
}

User --> UC001
User --> UC002
User --> UC003
User --> UC004
User --> UC005

UC001 ..> UNIFOR : <<comunica>>
UC002 ..> UNIFOR : <<valida>>

UC003 ..> UC004 : <<inclui>>

@enduml
```

### 2. 📝 **Gestão de Documentos**

```plantuml
@startuml
!theme plain
skinparam backgroundColor white

actor "👤 Usuário" as User
actor "📁 Sistema de Arquivos" as FileSystem

rectangle "Gestão de Documentos" {
  usecase "Criar Novo\nDocumento" as UC006
  usecase "Upload de\nArquivo" as UC007
  usecase "Abrir Documento\nExistente" as UC008
  usecase "Salvar\nDocumento" as UC009
  usecase "Gerenciar Lista\nde Documentos" as UC010
  
  usecase "Processar\n.docx" as ProcessDOCX
  usecase "Processar\n.pdf" as ProcessPDF
  usecase "Auto-save" as AutoSave
}

User --> UC006
User --> UC007
User --> UC008
User --> UC009
User --> UC010

UC007 ..> ProcessDOCX : <<inclui>>
UC007 ..> ProcessPDF : <<inclui>>
UC009 ..> AutoSave : <<estende>>

ProcessDOCX --> FileSystem
ProcessPDF --> FileSystem
UC009 --> FileSystem

@enduml
```

### 3. ✏️ **Editor de Texto Inteligente**

```plantuml
@startuml
!theme plain
skinparam backgroundColor white

actor "👤 Usuário" as User
actor "🤖 IA de Análise" as AI

rectangle "Editor de Texto" {
  usecase "Editar Texto\nem Tempo Real" as UC011
  usecase "Aplicar\nFormatação" as UC012
  usecase "Alternar Modos\nde Visualização" as UC013
  usecase "Usar Atalhos\nde Teclado" as UC014
  usecase "Análise Inteligente\nde Texto" as UC015
  
  usecase "Verificação\nOrtográfica" as SpellCheck
  usecase "Verificação\nGramatical" as GrammarCheck
  usecase "Análise de\nEstilo" as StyleCheck
}

User --> UC011
User --> UC012
User --> UC013
User --> UC014

UC011 ..> UC015 : <<dispara>>
UC015 --> AI

UC015 ..> SpellCheck : <<inclui>>
UC015 ..> GrammarCheck : <<inclui>>
UC015 ..> StyleCheck : <<inclui>>

@enduml
```

### 4. 🤖 **Assistente Virtual ProfAi**

```plantuml
@startuml
!theme plain
skinparam backgroundColor white

actor "👤 Usuário" as User
actor "🤖 ProfAi" as ProfAi

rectangle "Assistente Virtual" {
  usecase "Interagir com\nMensagens" as UC016
  usecase "Configurar\nPersonalidade" as UC017
  usecase "Ativar Modo\nSilencioso" as UC018
  usecase "Visualizar\nConquistas" as UC019
  usecase "Receber Dicas\nContextuais" as UC020
  
  usecase "Gerar Mensagem\nde Correção" as GenCorrection
  usecase "Enviar Mensagem\nMotivacional" as GenMotivation
  usecase "Notificar\nConquistas" as NotifyAchievement
}

User --> UC016
User --> UC017
User --> UC018
User --> UC019
User --> UC020

ProfAi --> GenCorrection
ProfAi --> GenMotivation
ProfAi --> NotifyAchievement

UC016 <.. GenCorrection : <<comunica>>
UC019 <.. NotifyAchievement : <<atualiza>>
UC020 <.. GenMotivation : <<envia>>

@enduml
```

### 5. 🔍 **Sistema de Correções**

```plantuml
@startuml
!theme plain
skinparam backgroundColor white

actor "👤 Usuário" as User
actor "🤖 IA de Correção" as CorrectionAI

rectangle "Sistema de Correções" {
  usecase "Visualizar\nCorreções" as UC021
  usecase "Aceitar\nCorreção" as UC022
  usecase "Rejeitar\nCorreção" as UC023
  usecase "Filtrar\nCorreções" as UC024
  usecase "Ver Histórico\nde Correções" as UC025
  
  usecase "Detectar\nErros" as DetectErrors
  usecase "Classificar\nSeveridade" as ClassifySeverity
  usecase "Aplicar no\nTexto" as ApplyCorrection
}

User --> UC021
User --> UC022
User --> UC023
User --> UC024
User --> UC025

CorrectionAI --> DetectErrors
CorrectionAI --> ClassifySeverity

UC021 <.. DetectErrors : <<alimenta>>
UC022 ..> ApplyCorrection : <<executa>>
UC024 ..> ClassifySeverity : <<usa>>

@enduml
```

### 6. 📐 **Formatação ABNT Automática**

```plantuml
@startuml
!theme plain
skinparam backgroundColor white

actor "👤 Usuário" as User
actor "📐 Sistema ABNT" as ABNTSystem

rectangle "Formatação ABNT" {
  usecase "Aplicar Formatação\nABNT" as UC026
  usecase "Selecionar\nTemplate" as UC027
  usecase "Configurar\nFormatação" as UC028
  usecase "Verificar\nConformidade" as UC029
  usecase "Gerar Elementos\nAutomáticos" as UC030
  
  usecase "Detectar\nEstrutura TCC" as DetectStructure
  usecase "Formatar\nTítulos" as FormatTitles
  usecase "Configurar\nMargens" as SetMargins
  usecase "Gerar\nSumário" as GenerateIndex
}

User --> UC026
User --> UC027
User --> UC028
User --> UC029
User --> UC030

ABNTSystem --> DetectStructure
ABNTSystem --> FormatTitles
ABNTSystem --> SetMargins
ABNTSystem --> GenerateIndex

UC026 ..> DetectStructure : <<usa>>
UC026 ..> FormatTitles : <<inclui>>
UC026 ..> SetMargins : <<inclui>>
UC030 ..> GenerateIndex : <<executa>>

@enduml
```

---

## 🛠️ **Como Gerar os Diagramas Visuais**

### **Método 1: PlantUML Online**
1. Acesse: http://www.plantuml.com/plantuml/uml/
2. Cole o código PlantUML acima
3. Clique em "Submit"
4. Baixe a imagem gerada

### **Método 2: VS Code com PlantUML**
1. Instale a extensão "PlantUML"
2. Crie um arquivo `.puml`
3. Cole o código
4. Use `Ctrl+Shift+P` → "PlantUML: Preview Current Diagram"

### **Método 3: Draw.io (Manual)**
1. Acesse: https://app.diagrams.net/
2. Escolha "UML" → "Use Case Diagram"
3. Recrie os diagramas manualmente
4. Exporte como PNG/SVG

### **Método 4: Lucidchart (Profissional)**
1. Acesse: https://www.lucidchart.com/
2. Crie novo diagrama UML
3. Use templates de caso de uso
4. Colabore em tempo real

---

## 📊 **Exemplo de Diagrama Completo - Sistema ProfAi**

```plantuml
@startuml
!theme plain
title Diagrama de Caso de Uso - ProfAi TCC Editor
skinparam backgroundColor #f9f9f9

left to right direction

actor "👤 Estudante" as Student
actor "👨‍🏫 Orientador" as Advisor
actor "🤖 ProfAi" as ProfAi
actor "🏫 Sistema UNIFOR" as UNIFOR

rectangle "ProfAi TCC Editor" {
  
  package "Autenticação" {
    usecase "Login via\nUNIFOR" as Login
    usecase "Gerenciar\nPerfil" as Profile
  }
  
  package "Editor" {
    usecase "Criar\nDocumento" as Create
    usecase "Editar\nTexto" as Edit
    usecase "Aplicar\nFormatação ABNT" as Format
    usecase "Exportar\nDocumento" as Export
  }
  
  package "Correções" {
    usecase "Analisar\nTexto" as Analyze
    usecase "Sugerir\nCorreções" as Suggest
    usecase "Aceitar/Rejeitar\nCorreções" as AcceptReject
  }
  
  package "Assistente IA" {
    usecase "Enviar\nMensagens" as SendMsg
    usecase "Acompanhar\nProgresso" as TrackProgress
    usecase "Desbloquear\nConquistas" as Achievements
  }
}

' Relacionamentos Estudante
Student --> Login
Student --> Profile
Student --> Create
Student --> Edit
Student --> Format
Student --> Export
Student --> AcceptReject

' Relacionamentos Orientador
Advisor --> Profile
Advisor --> TrackProgress

' Relacionamentos ProfAi
ProfAi --> Analyze
ProfAi --> Suggest
ProfAi --> SendMsg
ProfAi --> Achievements

' Relacionamentos Sistema UNIFOR
Login ..> UNIFOR : <<autentica>>

' Relacionamentos de Inclusão/Extensão
Edit ..> Analyze : <<dispara>>
Analyze ..> Suggest : <<gera>>
AcceptReject ..> TrackProgress : <<atualiza>>
TrackProgress ..> Achievements : <<verifica>>
TrackProgress ..> SendMsg : <<dispara>>

@enduml
```

---

## 🎨 **Personalização Visual**

### **Cores e Estilos Personalizados**
```plantuml
@startuml
!theme plain

' Definir cores personalizadas
skinparam backgroundColor #f8f9fa
skinparam actor {
  BackgroundColor #e3f2fd
  BorderColor #1976d2
  FontColor #1976d2
}
skinparam usecase {
  BackgroundColor #fff3e0
  BorderColor #f57c00
  FontColor #e65100
}
skinparam rectangle {
  BackgroundColor #f3e5f5
  BorderColor #7b1fa2
}

' Seu diagrama aqui...
@enduml
```

### **Ícones e Emojis**
```plantuml
@startuml
actor "👤\nUsuário" as User
actor "🤖\nProfAi" as AI
actor "🏫\nUNIFOR" as UNIFOR

usecase "🔐 Login" as Login
usecase "📝 Editar" as Edit
usecase "🎯 Corrigir" as Correct
@enduml
```

---

## 📱 **Ferramentas Recomendadas por Plataforma**

### **Windows**
- ✅ **PlantUML** + VS Code
- ✅ **Draw.io Desktop**
- ✅ **Lucidchart**
- ✅ **Visio** (Microsoft)

### **Mac**
- ✅ **PlantUML** + VS Code
- ✅ **OmniGraffle**
- ✅ **Draw.io Desktop**
- ✅ **Lucidchart**

### **Linux**
- ✅ **PlantUML** + VS Code
- ✅ **Umbrello** (KDE)
- ✅ **Draw.io Desktop**
- ✅ **Dia**

### **Online (Qualquer Plataforma)**
- ✅ **PlantUML Online**: http://www.plantuml.com/plantuml/
- ✅ **Draw.io**: https://app.diagrams.net/
- ✅ **Lucidchart**: https://www.lucidchart.com/
- ✅ **Mermaid Live**: https://mermaid.live/

---

*Diagramas UML Visuais gerados em: ${new Date().toLocaleDateString('pt-BR')}*
*Sistema: ProfAi TCC Editor v1.0.0*
*Padrão: UML 2.5 / PlantUML*
