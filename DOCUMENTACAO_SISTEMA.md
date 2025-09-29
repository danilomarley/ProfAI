# 📚 Documentação do Sistema ProfAi TCC Editor

## 🎯 Visão Geral do Sistema

O **ProfAi TCC Editor** é uma plataforma inteligente de edição acadêmica que combina inteligência artificial com pedagogia para auxiliar estudantes na criação de trabalhos de conclusão de curso (TCC) de excelência. O sistema oferece correções em tempo real, formatação ABNT automática e uma assistente virtual personalizada.

---

## 🏗️ Arquitetura do Sistema

### Stack Tecnológica

**Frontend:**
- React 18 + TypeScript
- Vite (Build Tool)
- TailwindCSS (Estilização)
- React Quill (Editor de Texto)
- Framer Motion (Animações)
- React Router (Navegação)

**Backend:**
- Node.js + Express
- PostgreSQL (Banco de Dados)
- JWT (Autenticação)
- OAuth2/SSO (Integração UNIFOR)

**Infraestrutura:**
- Docker + Docker Compose
- Nginx (Proxy Reverso)
- SSL/TLS (Segurança)

---

## 📋 Diagramas de Caso de Uso por Funcionalidade

### 1. 🔐 **Gestão de Usuários e Autenticação**

```mermaid
graph TB
    subgraph "Gestão de Usuários"
        U[👤 Usuário] --> L[Fazer Login via UNIFOR]
        U --> R[Registrar Conta]
        U --> P[Gerenciar Perfil]
        U --> C[Configurar Preferências]
        U --> S[Sair do Sistema]
        
        L --> OAuth[🔑 OAuth2/SSO UNIFOR]
        R --> V[Validar Credenciais]
        P --> UP[Atualizar Dados Pessoais]
        C --> Theme[Configurar Tema]
        C --> Lang[Configurar Idioma]
        C --> Notif[Configurar Notificações]
        C --> AI[Configurar Personalidade ProfAi]
    end
```

**Atores:** Usuário, Sistema OAuth UNIFOR
**Casos de Uso:**
- UC001: Fazer Login via UNIFOR
- UC002: Registrar Nova Conta
- UC003: Gerenciar Perfil do Usuário
- UC004: Configurar Preferências do Sistema
- UC005: Logout Seguro

---

### 2. 📝 **Gestão de Documentos**

```mermaid
graph TB
    subgraph "Gestão de Documentos"
        U[👤 Usuário] --> CD[Criar Novo Documento]
        U --> UD[Fazer Upload de Arquivo]
        U --> OD[Abrir Documento Existente]
        U --> SD[Salvar Documento]
        U --> DD[Deletar Documento]
        U --> LD[Listar Documentos]
        
        UD --> DOCX[📄 Processar .docx]
        UD --> PDF[📄 Processar .pdf]
        DOCX --> Extract1[Extrair Texto com Mammoth]
        PDF --> Extract2[Extrair Texto Simples]
        
        SD --> AS[Auto-save a cada 30s]
        SD --> MS[Salvar Manual]
        
        CD --> Template[Aplicar Template TCC]
        OD --> Load[Carregar Conteúdo]
        LD --> Filter[Filtrar por Data/Tipo]
    end
```

**Atores:** Usuário, Sistema de Arquivos
**Casos de Uso:**
- UC006: Criar Novo Documento TCC
- UC007: Upload de Arquivo (.docx/.pdf)
- UC008: Abrir Documento Existente
- UC009: Salvar Documento (Manual/Automático)
- UC010: Gerenciar Lista de Documentos

---

### 3. ✏️ **Editor de Texto Inteligente**

```mermaid
graph TB
    subgraph "Editor de Texto"
        U[👤 Usuário] --> ET[Editar Texto]
        U --> FT[Formatar Texto]
        U --> VM[Alterar Modo de Visualização]
        U --> KS[Usar Atalhos de Teclado]
        
        ET --> RT[Digitação em Tempo Real]
        RT --> AI[🤖 Análise de IA]
        AI --> Spell[Verificação Ortográfica]
        AI --> Gram[Verificação Gramatical]
        AI --> Style[Análise de Estilo]
        AI --> ABNT[Verificação ABNT]
        
        FT --> Bold[Negrito]
        FT --> Italic[Itálico]
        FT --> Under[Sublinhado]
        FT --> List[Listas]
        FT --> Align[Alinhamento]
        FT --> Font[Fonte e Tamanho]
        
        VM --> Original[Modo Original]
        VM --> Corrected[Modo Corrigido]
        VM --> Compare[Modo Comparativo]
        
        KS --> Accept[Ctrl+Enter: Aceitar]
        KS --> Reject[Ctrl+Delete: Rejeitar]
        KS --> Save[Ctrl+S: Salvar]
    end
```

**Atores:** Usuário, IA de Análise de Texto
**Casos de Uso:**
- UC011: Editar Texto em Tempo Real
- UC012: Aplicar Formatação de Texto
- UC013: Alternar Modos de Visualização
- UC014: Usar Atalhos de Teclado
- UC015: Análise Inteligente de Texto

---

### 4. 🤖 **Assistente Virtual ProfAi**

```mermaid
graph TB
    subgraph "Assistente ProfAi"
        U[👤 Usuário] --> IM[Interagir com Mensagens]
        U --> CP[Configurar Personalidade]
        U --> SM[Ativar Modo Silencioso]
        U --> VA[Ver Conquistas]
        U --> VP[Visualizar Progresso]
        
        ProfAi[🤖 ProfAi] --> WM[Enviar Mensagem de Boas-vindas]
        ProfAi --> CM[Gerar Mensagem de Correção]
        ProfAi --> MM[Enviar Mensagem Motivacional]
        ProfAi --> TM[Dar Dicas Acadêmicas]
        ProfAi --> AM[Notificar Conquistas]
        
        IM --> Read[Marcar como Lida]
        IM --> Action[Executar Ação]
        
        CP --> Emp[Personalidade Empática]
        CP --> Tech[Personalidade Técnica]
        CP --> Mot[Personalidade Motivadora]
        
        VA --> Badges[🏆 Visualizar Badges]
        VP --> Progress[📊 Barra de Progresso]
        VP --> Stats[📈 Estatísticas]
    end
```

**Atores:** Usuário, ProfAi (IA)
**Casos de Uso:**
- UC016: Interagir com Mensagens da ProfAi
- UC017: Configurar Personalidade da IA
- UC018: Ativar/Desativar Modo Silencioso
- UC019: Visualizar Conquistas e Progresso
- UC020: Receber Dicas Contextuais

---

### 5. 🔍 **Sistema de Correções**

```mermaid
graph TB
    subgraph "Sistema de Correções"
        U[👤 Usuário] --> VC[Ver Correções Sugeridas]
        U --> AC[Aceitar Correção]
        U --> RC[Rejeitar Correção]
        U --> HC[Ver Histórico de Correções]
        U --> FC[Filtrar Correções]
        
        IA[🤖 IA] --> DC[Detectar Erros]
        IA --> GC[Gerar Correções]
        IA --> CC[Classificar Severidade]
        
        DC --> Ortho[Erros Ortográficos]
        DC --> Gram[Erros Gramaticais]
        DC --> Style[Problemas de Estilo]
        DC --> ABNT[Não Conformidade ABNT]
        
        CC --> Error[🔴 Erro Crítico]
        CC --> Warning[🟡 Aviso]
        CC --> Suggestion[🔵 Sugestão]
        
        AC --> Apply[Aplicar no Texto]
        AC --> Update[Atualizar Progresso]
        
        FC --> Type[Por Tipo]
        FC --> Severity[Por Severidade]
        FC --> Chapter[Por Capítulo]
        FC --> Status[Por Status]
    end
```

**Atores:** Usuário, IA de Correção
**Casos de Uso:**
- UC021: Visualizar Correções Sugeridas
- UC022: Aceitar/Rejeitar Correções
- UC023: Filtrar Correções por Critério
- UC024: Ver Histórico de Correções
- UC025: Análise Automática de Texto

---

### 6. 📐 **Formatação ABNT Automática**

```mermaid
graph TB
    subgraph "Formatação ABNT"
        U[👤 Usuário] --> AF[Aplicar Formatação ABNT]
        U --> ST[Selecionar Template]
        U --> CF[Configurar Formatação]
        U --> VF[Verificar Conformidade]
        
        ABNT[📐 Sistema ABNT] --> Margins[Configurar Margens]
        ABNT --> Spacing[Configurar Espaçamento]
        ABNT --> Fonts[Configurar Fontes]
        ABNT --> Titles[Formatar Títulos]
        ABNT --> Citations[Formatar Citações]
        ABNT --> References[Formatar Referências]
        ABNT --> Index[Gerar Sumário]
        
        ST --> Cover[Template Capa]
        ST --> TitlePage[Template Folha de Rosto]
        ST --> Abstract[Template Resumo]
        ST --> Chapter[Template Capítulo]
        
        AF --> Detect[Detectar Estrutura TCC]
        Detect --> University[Identificar Universidade]
        Detect --> Author[Identificar Autor]
        Detect --> Title[Identificar Título]
        Detect --> Sections[Identificar Seções]
        Detect --> Paragraphs[Identificar Parágrafos]
        
        VF --> Check[Verificar Normas]
        Check --> Report[Gerar Relatório]
    end
```

**Atores:** Usuário, Sistema de Formatação ABNT
**Casos de Uso:**
- UC026: Aplicar Formatação ABNT Automática
- UC027: Selecionar Template ABNT
- UC028: Configurar Parâmetros de Formatação
- UC029: Verificar Conformidade com Normas
- UC030: Gerar Elementos Automáticos (Sumário, etc.)

---

### 7. 📚 **Gestão de Citações e Referências**

```mermaid
graph TB
    subgraph "Citações e Referências"
        U[👤 Usuário] --> SC[Buscar Citações]
        U --> IC[Inserir Citação]
        U --> FC[Formatar Citação ABNT]
        U --> GR[Gerar Referências]
        U --> VR[Verificar Referências]
        
        Scholar[📖 Google Scholar API] --> Search[Buscar Artigos]
        Scholar --> Meta[Extrair Metadados]
        
        SC --> Keywords[Por Palavras-chave]
        SC --> Author[Por Autor]
        SC --> Title[Por Título]
        SC --> Year[Por Ano]
        
        IC --> Direct[Citação Direta]
        IC --> Indirect[Citação Indireta]
        IC --> Block[Citação em Bloco]
        
        FC --> Format[Aplicar Formato ABNT]
        FC --> Validate[Validar Formato]
        
        GR --> Auto[Geração Automática]
        GR --> Manual[Inserção Manual]
        GR --> Sort[Ordenação Alfabética]
        
        VR --> Complete[Verificar Completude]
        VR --> Consistency[Verificar Consistência]
        VR --> Duplicates[Detectar Duplicatas]
    end
```

**Atores:** Usuário, Google Scholar API
**Casos de Uso:**
- UC031: Buscar Citações no Google Scholar
- UC032: Inserir Citação no Texto
- UC033: Formatar Citação em ABNT
- UC034: Gerar Lista de Referências
- UC035: Verificar Consistência das Referências

---

### 8. 📊 **Controle de Versões e Histórico**

```mermaid
graph TB
    subgraph "Controle de Versões"
        U[👤 Usuário] --> CV[Criar Versão]
        U --> LV[Listar Versões]
        U --> VV[Visualizar Versão]
        U --> RV[Restaurar Versão]
        U --> CV2[Comparar Versões]
        U --> DV[Deletar Versão]
        
        System[⚙️ Sistema] --> AS[Auto-save Periódico]
        System --> Snapshot[Criar Snapshot]
        System --> Track[Rastrear Mudanças]
        
        CV --> Description[Adicionar Descrição]
        CV --> Timestamp[Registrar Timestamp]
        CV --> Changes[Salvar Alterações]
        
        CV2 --> SideBySide[Comparação Lado a Lado]
        CV2 --> Diff[Visualização Diff]
        CV2 --> Highlight[Destacar Diferenças]
        
        LV --> Filter[Filtrar por Data]
        LV --> Sort[Ordenar por Critério]
        
        RV --> Confirm[Confirmar Restauração]
        RV --> Backup[Backup Atual]
    end
```

**Atores:** Usuário, Sistema de Versionamento
**Casos de Uso:**
- UC036: Criar Nova Versão do Documento
- UC037: Listar Versões Existentes
- UC038: Comparar Versões do Documento
- UC039: Restaurar Versão Anterior
- UC040: Gerenciar Histórico de Versões

---

### 9. 📤 **Exportação e Compartilhamento**

```mermaid
graph TB
    subgraph "Exportação"
        U[👤 Usuário] --> ED[Exportar Documento]
        U --> CF[Configurar Formato]
        U --> PM[Preservar Metadados]
        U --> VE[Validar Exportação]
        
        ED --> DOCX[📄 Exportar como DOCX]
        ED --> PDF[📄 Exportar como PDF]
        
        DOCX --> WordFormat[Formato Microsoft Word]
        DOCX --> Styles[Preservar Estilos]
        DOCX --> Images[Incluir Imagens]
        
        PDF --> Layout[Preservar Layout]
        PDF --> Fonts[Incorporar Fontes]
        PDF --> Metadata[Incluir Metadados]
        
        CF --> Quality[Configurar Qualidade]
        CF --> Pages[Selecionar Páginas]
        CF --> Watermark[Adicionar Marca d'água]
        
        PM --> Author[Autor]
        PM --> Title[Título]
        PM --> Keywords[Palavras-chave]
        PM --> Subject[Assunto]
        PM --> CreationDate[Data de Criação]
        
        VE --> Check[Verificar Integridade]
        VE --> Preview[Visualizar Preview]
        VE --> Download[Iniciar Download]
    end
```

**Atores:** Usuário, Sistema de Exportação
**Casos de Uso:**
- UC041: Exportar Documento como DOCX
- UC042: Exportar Documento como PDF
- UC043: Configurar Opções de Exportação
- UC044: Preservar Metadados no Export
- UC045: Validar Documento Exportado

---

### 10. 🎮 **Sistema de Gamificação**

```mermaid
graph TB
    subgraph "Gamificação"
        U[👤 Usuário] --> VP[Ver Progresso]
        U --> UC[Desbloquear Conquistas]
        U --> VB[Ver Badges]
        U --> CE[Compartilhar Estatísticas]
        
        System[🎮 Sistema] --> TP[Calcular Progresso]
        System --> DA[Detectar Conquistas]
        System --> GM[Gerar Mensagens]
        System --> US[Atualizar Estatísticas]
        
        VP --> ProgressBar[📊 Barra de Progresso]
        VP --> Percentage[Porcentagem Completa]
        VP --> WordCount[Contagem de Palavras]
        VP --> TimeSpent[Tempo Gasto]
        
        UC --> FirstUpload[🏆 Primeiro Upload]
        UC --> FirstCorrection[✅ Primeira Correção]
        UC --> ChapterComplete[📚 Capítulo Completo]
        UC --> HalfWay[🎯 Meio Caminho (50%)]
        UC --> FullReview[🏅 Revisão Completa]
        UC --> ABNTMaster[📐 Mestre ABNT]
        UC --> SpeedWriter[⚡ Escritor Rápido]
        
        VB --> Earned[Badges Conquistadas]
        VB --> Progress[Progresso das Badges]
        VB --> Locked[Badges Bloqueadas]
        
        GM --> Motivational[Mensagens Motivacionais]
        GM --> Celebration[Mensagens de Celebração]
        GM --> Encouragement[Mensagens de Encorajamento]
    end
```

**Atores:** Usuário, Sistema de Gamificação
**Casos de Uso:**
- UC046: Visualizar Progresso da Revisão
- UC047: Desbloquear Conquistas
- UC048: Gerenciar Sistema de Badges
- UC049: Receber Mensagens Motivacionais
- UC050: Acompanhar Estatísticas de Uso

---

## 🔄 Fluxos Principais do Sistema

### Fluxo 1: Criação e Edição de TCC
```
1. Usuário faz login → 2. Cria novo documento → 3. Escreve/edita texto → 
4. IA analisa em tempo real → 5. Usuário aceita/rejeita correções → 
6. Aplica formatação ABNT → 7. Salva documento → 8. Exporta resultado final
```

### Fluxo 2: Upload e Revisão de Documento Existente
```
1. Usuário faz upload (.docx/.pdf) → 2. Sistema extrai texto → 
3. IA analisa documento completo → 4. Apresenta correções na sidebar → 
5. Usuário revisa correções → 6. Aplica formatação ABNT → 7. Exporta versão corrigida
```

### Fluxo 3: Interação com ProfAi
```
1. ProfAi envia mensagem de boas-vindas → 2. Usuário interage com editor → 
3. ProfAi detecta progresso → 4. Envia dicas contextuais → 
5. Usuário atinge marcos → 6. ProfAi celebra conquistas → 7. Motiva continuidade
```

---

## 📊 Métricas e KPIs do Sistema

### Métricas de Usuário
- **Taxa de Retenção**: % usuários que retornam após primeira sessão
- **Tempo Médio de Sessão**: Duração média de uso do editor
- **Documentos por Usuário**: Quantidade média de TCCs por usuário
- **Taxa de Conclusão**: % de documentos finalizados vs iniciados

### Métricas de Qualidade
- **Precisão das Correções**: % de correções aceitas vs sugeridas
- **Cobertura ABNT**: % de conformidade com normas após formatação
- **Satisfação do Usuário**: Score baseado em feedback e avaliações
- **Redução de Erros**: % de melhoria na qualidade textual

### Métricas de Engajamento
- **Interações com ProfAi**: Número médio de mensagens por sessão
- **Conquistas Desbloqueadas**: % de usuários que atingem marcos
- **Uso de Funcionalidades**: Frequência de uso de cada feature
- **Feedback Positivo**: % de avaliações positivas da IA

---

## 🔒 Considerações de Segurança

### Autenticação e Autorização
- **OAuth2/SSO** integrado com sistema UNIFOR
- **JWT Tokens** com expiração configurável
- **Rate Limiting** para prevenir abuso de APIs
- **Validação de entrada** em todas as rotas

### Proteção de Dados
- **Criptografia** de dados sensíveis em trânsito e repouso
- **Sanitização** de conteúdo para prevenir XSS
- **Backup automático** de documentos dos usuários
- **Conformidade LGPD** para proteção de dados pessoais

### Monitoramento
- **Logs de auditoria** para todas as ações críticas
- **Monitoramento de performance** e disponibilidade
- **Alertas automáticos** para comportamentos suspeitos
- **Análise de vulnerabilidades** periódica

---

## 🚀 Roadmap de Desenvolvimento

### Fase 1 - MVP (Concluída) ✅
- ✅ Editor de texto básico com React Quill
- ✅ Sistema de correções com IA
- ✅ Formatação ABNT automática
- ✅ ProfAi com personalidade adaptativa
- ✅ Sistema de gamificação básico
- ✅ Export para DOCX/PDF

### Fase 2 - Melhorias (Em Desenvolvimento) 🔄
- 🔄 Integração com Google Scholar API
- 🔄 Sistema de templates ABNT avançados
- 🔄 Controle de versões robusto
- 🔄 Análise de plágio básica
- 🔄 Colaboração em tempo real

### Fase 3 - Expansão (Planejada) 📋
- 📋 Integração com calendário UNIFOR
- 📋 Sistema de orientação virtual
- 📋 Análise de coerência e coesão avançada
- 📋 Suporte a múltiplos idiomas
- 📋 API pública para integrações

### Fase 4 - Inovação (Futuro) 🔮
- 🔮 IA generativa para sugestões de conteúdo
- 🔮 Análise de sentimento do texto
- 🔮 Integração com bases de dados acadêmicas
- 🔮 Sistema de peer review automatizado
- 🔮 Realidade aumentada para visualização 3D

---

## 📞 Suporte e Manutenção

### Canais de Suporte
- **Email**: suporte@profai.unifor.br
- **Chat Online**: Disponível 24/7 no sistema
- **FAQ**: Base de conhecimento integrada
- **Tutoriais**: Vídeos e guias passo a passo

### Manutenção Preventiva
- **Backups diários** automáticos
- **Atualizações de segurança** mensais
- **Monitoramento contínuo** de performance
- **Testes automatizados** em pipeline CI/CD

### SLA (Service Level Agreement)
- **Disponibilidade**: 99.9% uptime garantido
- **Tempo de Resposta**: < 2 segundos para operações básicas
- **Suporte**: Resposta em até 4 horas úteis
- **Recuperação**: RTO < 1 hora, RPO < 15 minutos

---

*Documentação gerada automaticamente em: ${new Date().toLocaleDateString('pt-BR')}*
*Versão do Sistema: 1.0.0*
*Última Atualização: ${new Date().toLocaleDateString('pt-BR')}*
