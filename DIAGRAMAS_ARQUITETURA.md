# 🏗️ Diagramas de Arquitetura - ProfAi TCC Editor

## 📐 Arquitetura Geral do Sistema

```mermaid
graph TB
    subgraph "Frontend (React + TypeScript)"
        UI[🖥️ Interface do Usuário]
        Editor[✏️ Editor de Texto]
        ProfAi[🤖 Assistente ProfAi]
        Auth[🔐 Autenticação]
    end
    
    subgraph "Backend (Node.js + Express)"
        API[🔌 API REST]
        Auth_Service[🔑 Serviço de Auth]
        Document_Service[📄 Serviço de Documentos]
        AI_Service[🧠 Serviço de IA]
        Export_Service[📤 Serviço de Export]
    end
    
    subgraph "Banco de Dados"
        PostgreSQL[(🗄️ PostgreSQL)]
    end
    
    subgraph "Serviços Externos"
        UNIFOR[🏫 OAuth UNIFOR]
        Scholar[📚 Google Scholar API]
        Storage[☁️ File Storage]
    end
    
    subgraph "Infraestrutura"
        Docker[🐳 Docker Containers]
        Nginx[🌐 Nginx Proxy]
        SSL[🔒 SSL/TLS]
    end
    
    UI --> API
    Editor --> Document_Service
    ProfAi --> AI_Service
    Auth --> Auth_Service
    
    API --> PostgreSQL
    Auth_Service --> UNIFOR
    AI_Service --> Scholar
    Export_Service --> Storage
    
    Docker --> Nginx
    Nginx --> SSL
```

---

## 🔄 Fluxo de Dados Principal

```mermaid
sequenceDiagram
    participant U as 👤 Usuário
    participant F as 🖥️ Frontend
    participant B as ⚙️ Backend
    participant DB as 🗄️ Database
    participant AI as 🤖 IA Service
    participant PA as 🎓 ProfAi
    
    U->>F: 1. Digita texto no editor
    F->>F: 2. Debounce (3s)
    F->>AI: 3. Analisa texto
    AI->>AI: 4. Processa correções
    AI->>F: 5. Retorna sugestões
    F->>PA: 6. Notifica ProfAi
    PA->>PA: 7. Gera mensagem contextual
    PA->>F: 8. Exibe correções + mensagem
    F->>U: 9. Mostra na sidebar
    
    U->>F: 10. Aceita correção
    F->>F: 11. Aplica no editor
    F->>B: 12. Salva documento
    B->>DB: 13. Persiste dados
    DB->>B: 14. Confirma salvamento
    B->>F: 15. Retorna sucesso
    F->>PA: 16. Atualiza progresso
    PA->>F: 17. Celebra conquista
```

---

## 🧩 Arquitetura de Componentes Frontend

```mermaid
graph TB
    subgraph "App.tsx - Aplicação Principal"
        Router[🛣️ React Router]
        Providers[🔄 Context Providers]
    end
    
    subgraph "Contexts (Estado Global)"
        AuthContext[🔐 AuthContext]
        EditorContext[📝 EditorContext]
        ProfAiContext[🤖 ProfAiContext]
    end
    
    subgraph "Pages (Páginas)"
        Home[🏠 Home]
        EditorUnified[✏️ EditorUnified]
        History[📚 History]
        About[ℹ️ About]
        Login[🔑 Login]
    end
    
    subgraph "Components (Componentes)"
        Header[📋 Header]
        WordLikeEditor[📝 WordLikeEditor]
        FileUpload[📤 FileUpload]
        Toolbar[🛠️ Toolbar]
        Sidebar[📊 Sidebar]
    end
    
    subgraph "Utils (Utilitários)"
        TCCFormatter[📐 SmartTCCFormatter]
        ExportUtils[📤 Export Utils]
        ValidationUtils[✅ Validation Utils]
    end
    
    Router --> Pages
    Providers --> Contexts
    Pages --> Components
    Components --> Utils
    
    EditorUnified --> WordLikeEditor
    EditorUnified --> Sidebar
    WordLikeEditor --> TCCFormatter
    FileUpload --> ValidationUtils
```

---

## 🗄️ Modelo de Dados (Banco PostgreSQL)

```mermaid
erDiagram
    USERS {
        uuid id PK
        string name
        string email UK
        string course
        string university
        string avatar_url
        boolean is_unifor_user
        timestamp last_login
        jsonb preferences
        timestamp created_at
        timestamp updated_at
    }
    
    DOCUMENTS {
        uuid id PK
        uuid user_id FK
        string title
        text content
        text original_content
        integer progress
        integer word_count
        integer chapter_count
        timestamp created_at
        timestamp updated_at
    }
    
    CORRECTIONS {
        uuid id PK
        uuid document_id FK
        string type
        string severity
        text message
        text original_text
        text suggested_text
        jsonb position
        boolean accepted
        boolean rejected
        boolean applied
        text explanation
        string chapter
        timestamp created_at
    }
    
    VERSIONS {
        uuid id PK
        uuid document_id FK
        text content
        jsonb changes
        integer word_count
        text description
        timestamp created_at
    }
    
    ACHIEVEMENTS {
        uuid id PK
        uuid user_id FK
        string achievement_type
        string title
        text description
        string icon
        integer progress
        integer max_progress
        timestamp unlocked_at
        timestamp created_at
    }
    
    PROFAI_MESSAGES {
        uuid id PK
        uuid user_id FK
        uuid document_id FK
        string type
        text content
        string priority
        string category
        jsonb position
        jsonb action
        boolean read
        timestamp created_at
    }
    
    FILE_UPLOADS {
        uuid id PK
        uuid user_id FK
        uuid document_id FK
        string filename
        string file_type
        integer file_size
        string status
        text extracted_text
        jsonb metadata
        timestamp uploaded_at
    }
    
    CITATIONS {
        uuid id PK
        uuid document_id FK
        text citation_text
        string author
        integer year
        string title
        string source
        string type
        text abnt_format
        jsonb position
        timestamp created_at
    }
    
    USERS ||--o{ DOCUMENTS : "creates"
    USERS ||--o{ ACHIEVEMENTS : "earns"
    USERS ||--o{ PROFAI_MESSAGES : "receives"
    USERS ||--o{ FILE_UPLOADS : "uploads"
    
    DOCUMENTS ||--o{ CORRECTIONS : "has"
    DOCUMENTS ||--o{ VERSIONS : "has"
    DOCUMENTS ||--o{ CITATIONS : "contains"
    DOCUMENTS ||--o{ FILE_UPLOADS : "from"
    DOCUMENTS ||--o{ PROFAI_MESSAGES : "about"
```

---

## 🔌 Arquitetura de APIs

```mermaid
graph TB
    subgraph "API Gateway"
        Gateway[🚪 API Gateway]
        Auth_Middleware[🔐 Auth Middleware]
        Rate_Limiter[⏱️ Rate Limiter]
        CORS[🌐 CORS Handler]
    end
    
    subgraph "Authentication Service"
        OAuth[🔑 OAuth Handler]
        JWT[🎫 JWT Service]
        Session[📝 Session Manager]
    end
    
    subgraph "Document Service"
        CRUD[📄 Document CRUD]
        Upload[📤 File Upload]
        Export[📥 Export Service]
        Version[🔄 Version Control]
    end
    
    subgraph "AI Service"
        TextAnalysis[🔍 Text Analysis]
        Corrections[✅ Correction Engine]
        ABNTFormatter[📐 ABNT Formatter]
        SmartSuggestions[💡 Smart Suggestions]
    end
    
    subgraph "ProfAi Service"
        MessageGenerator[💬 Message Generator]
        PersonalityEngine[🎭 Personality Engine]
        ProgressTracker[📊 Progress Tracker]
        AchievementSystem[🏆 Achievement System]
    end
    
    subgraph "External APIs"
        UNIFOR_OAuth[🏫 UNIFOR OAuth]
        GoogleScholar[📚 Google Scholar]
        FileStorage[☁️ File Storage]
    end
    
    Gateway --> Auth_Middleware
    Auth_Middleware --> Rate_Limiter
    Rate_Limiter --> CORS
    
    CORS --> Authentication Service
    CORS --> Document Service
    CORS --> AI Service
    CORS --> ProfAi Service
    
    OAuth --> UNIFOR_OAuth
    Upload --> FileStorage
    SmartSuggestions --> GoogleScholar
```

---

## 🔄 Pipeline de Processamento de Texto

```mermaid
flowchart TD
    Start([📝 Usuário digita texto]) --> Debounce{⏱️ Debounce 3s}
    Debounce -->|Texto estável| MinLength{📏 Mín. 100 chars?}
    MinLength -->|Sim| Extract[🔤 Extrair texto plano]
    MinLength -->|Não| End([❌ Não processar])
    
    Extract --> Limit[✂️ Limitar 5000 chars]
    Limit --> SmartAnalysis[🧠 SmartTCCFormatter]
    
    SmartAnalysis --> DetectStructure[🏗️ Detectar estrutura TCC]
    DetectStructure --> University[🏫 Universidade]
    DetectStructure --> Titles[📋 Títulos]
    DetectStructure --> Subtitles[📝 Subtítulos]
    DetectStructure --> Paragraphs[📄 Parágrafos]
    DetectStructure --> Lists[📋 Listas]
    
    SmartAnalysis --> CommonErrors[🔍 Erros comuns]
    CommonErrors --> Spelling[📝 Ortografia]
    CommonErrors --> Grammar[📚 Gramática]
    CommonErrors --> Style[🎨 Estilo]
    
    University --> FormatCorrections[📐 Gerar correções ABNT]
    Titles --> FormatCorrections
    Subtitles --> FormatCorrections
    Paragraphs --> FormatCorrections
    Lists --> FormatCorrections
    
    Spelling --> CombineCorrections[🔗 Combinar correções]
    Grammar --> CombineCorrections
    Style --> CombineCorrections
    FormatCorrections --> CombineCorrections
    
    CombineCorrections --> FilterDuplicates[🚫 Filtrar duplicatas]
    FilterDuplicates --> PrioritizeCorrections[⭐ Priorizar por severidade]
    PrioritizeCorrections --> UpdateUI[🖥️ Atualizar interface]
    
    UpdateUI --> NotifyProfAi[🤖 Notificar ProfAi]
    NotifyProfAi --> GenerateMessage[💬 Gerar mensagem contextual]
    GenerateMessage --> ShowResults([✅ Exibir resultados])
```

---

## 🎨 Fluxo de Formatação ABNT

```mermaid
flowchart TD
    UserClick([👤 Usuário clica "ABNT"]) --> GetText[📄 Obter texto do editor]
    GetText --> ClearFormat[🧹 Limpar formatação existente]
    ClearFormat --> ApplyBase[📝 Aplicar base: Times 12pt]
    
    ApplyBase --> SplitLines[✂️ Dividir em linhas]
    SplitLines --> ProcessLine{🔄 Para cada linha}
    
    ProcessLine --> DetectType{🔍 Detectar tipo}
    
    DetectType -->|UNIVERSIDADE FEDERAL| University[🏫 Formato Capa]
    DetectType -->|RESUMO, INTRODUÇÃO| MainTitle[📋 Título Principal]
    DetectType -->|1 INTRODUÇÃO| NumberedTitle[🔢 Título Numerado]
    DetectType -->|1.1 Objetivos| Subtitle[📝 Subtítulo]
    DetectType -->|Nome Próprio| Author[👤 Nome Autor]
    DetectType -->|TÍTULO MAIÚSCULO| WorkTitle[📚 Título Trabalho]
    DetectType -->|• Lista| List[📋 Lista]
    DetectType -->|Texto normal| Paragraph[📄 Parágrafo]
    
    University --> Format1[📐 14pt, negrito, centro]
    MainTitle --> Format2[📐 14pt, negrito, centro, H1]
    NumberedTitle --> Format3[📐 14pt, negrito, esquerda, H1]
    Subtitle --> Format4[📐 12pt, negrito, esquerda, H2]
    Author --> Format5[📐 12pt, negrito, centro]
    WorkTitle --> Format6[📐 16pt, negrito, centro]
    List --> Format7[📐 Lista com marcadores]
    Paragraph --> Format8[📐 12pt, justificado, recuo]
    
    Format1 --> NextLine{➡️ Próxima linha?}
    Format2 --> NextLine
    Format3 --> NextLine
    Format4 --> NextLine
    Format5 --> NextLine
    Format6 --> NextLine
    Format7 --> NextLine
    Format8 --> NextLine
    
    NextLine -->|Sim| ProcessLine
    NextLine -->|Não| ApplySpacing[📏 Aplicar espaçamento 1.6]
    
    ApplySpacing --> UpdateEditor[🔄 Atualizar editor]
    UpdateEditor --> RunAnalysis[🧠 Executar análise IA]
    RunAnalysis --> ShowSuccess[✅ Mostrar sucesso]
    ShowSuccess --> End([🎉 Formatação concluída])
```

---

## 🤖 Arquitetura da ProfAi

```mermaid
graph TB
    subgraph "ProfAi Core"
        PersonalityEngine[🎭 Personality Engine]
        MessageGenerator[💬 Message Generator]
        ContextAnalyzer[🔍 Context Analyzer]
        ProgressTracker[📊 Progress Tracker]
    end
    
    subgraph "Personality Types"
        Empathetic[😊 Empática]
        Technical[🔧 Técnica]
        Motivational[🚀 Motivadora]
    end
    
    subgraph "Message Types"
        Welcome[👋 Boas-vindas]
        Correction[✅ Correção]
        Motivation[💪 Motivação]
        Tips[💡 Dicas]
        Achievement[🏆 Conquistas]
        Explanation[📚 Explicação]
    end
    
    subgraph "Context Inputs"
        UserProgress[📈 Progresso do Usuário]
        DocumentType[📄 Tipo de Documento]
        CurrentChapter[📖 Capítulo Atual]
        ErrorTypes[❌ Tipos de Erro]
        TimeOfDay[🕐 Hora do Dia]
        SessionLength[⏱️ Duração da Sessão]
    end
    
    subgraph "Adaptive Behavior"
        BeginnerMode[🌱 Modo Iniciante]
        IntermediateMode[📚 Modo Intermediário]
        ExpertMode[🎓 Modo Especialista]
    end
    
    PersonalityEngine --> Empathetic
    PersonalityEngine --> Technical
    PersonalityEngine --> Motivational
    
    MessageGenerator --> Welcome
    MessageGenerator --> Correction
    MessageGenerator --> Motivation
    MessageGenerator --> Tips
    MessageGenerator --> Achievement
    MessageGenerator --> Explanation
    
    ContextAnalyzer --> UserProgress
    ContextAnalyzer --> DocumentType
    ContextAnalyzer --> CurrentChapter
    ContextAnalyzer --> ErrorTypes
    ContextAnalyzer --> TimeOfDay
    ContextAnalyzer --> SessionLength
    
    ProgressTracker --> BeginnerMode
    ProgressTracker --> IntermediateMode
    ProgressTracker --> ExpertMode
    
    PersonalityEngine --> MessageGenerator
    ContextAnalyzer --> PersonalityEngine
    ProgressTracker --> ContextAnalyzer
```

---

## 🔒 Arquitetura de Segurança

```mermaid
graph TB
    subgraph "Frontend Security"
        CSP[🛡️ Content Security Policy]
        XSS[🚫 XSS Protection]
        InputValidation[✅ Input Validation]
        TokenStorage[🔐 Secure Token Storage]
    end
    
    subgraph "API Security"
        HTTPS[🔒 HTTPS/TLS]
        CORS[🌐 CORS Policy]
        RateLimit[⏱️ Rate Limiting]
        AuthMiddleware[🔑 Auth Middleware]
    end
    
    subgraph "Authentication"
        OAuth2[🎫 OAuth2/UNIFOR]
        JWT[🔑 JWT Tokens]
        RefreshToken[🔄 Refresh Tokens]
        SessionMgmt[📝 Session Management]
    end
    
    subgraph "Data Protection"
        Encryption[🔐 Data Encryption]
        Sanitization[🧹 Data Sanitization]
        Validation[✅ Input Validation]
        Backup[💾 Secure Backup]
    end
    
    subgraph "Infrastructure Security"
        Firewall[🔥 Firewall]
        VPN[🌐 VPN Access]
        Monitoring[👁️ Security Monitoring]
        Logging[📋 Audit Logging]
    end
    
    subgraph "Compliance"
        LGPD[📋 LGPD Compliance]
        DataRetention[🗄️ Data Retention]
        UserConsent[✅ User Consent]
        DataPortability[📤 Data Portability]
    end
    
    CSP --> HTTPS
    XSS --> CORS
    InputValidation --> RateLimit
    TokenStorage --> AuthMiddleware
    
    OAuth2 --> JWT
    JWT --> RefreshToken
    RefreshToken --> SessionMgmt
    
    Encryption --> Sanitization
    Sanitization --> Validation
    Validation --> Backup
    
    Firewall --> VPN
    VPN --> Monitoring
    Monitoring --> Logging
    
    LGPD --> DataRetention
    DataRetention --> UserConsent
    UserConsent --> DataPortability
```

---

## 📊 Monitoramento e Observabilidade

```mermaid
graph TB
    subgraph "Application Metrics"
        ResponseTime[⏱️ Response Time]
        Throughput[📈 Throughput]
        ErrorRate[❌ Error Rate]
        UserSessions[👥 Active Sessions]
    end
    
    subgraph "Business Metrics"
        DocumentsCreated[📄 Documents Created]
        CorrectionsAccepted[✅ Corrections Accepted]
        ExportsGenerated[📤 Exports Generated]
        UserRetention[🔄 User Retention]
    end
    
    subgraph "Infrastructure Metrics"
        CPUUsage[💻 CPU Usage]
        MemoryUsage[🧠 Memory Usage]
        DiskSpace[💾 Disk Space]
        NetworkIO[🌐 Network I/O]
    end
    
    subgraph "AI Metrics"
        CorrectionAccuracy[🎯 Correction Accuracy]
        ProcessingTime[⚡ AI Processing Time]
        ModelPerformance[🤖 Model Performance]
        FalsePositives[⚠️ False Positives]
    end
    
    subgraph "Alerting System"
        PerformanceAlerts[🚨 Performance Alerts]
        ErrorAlerts[❌ Error Alerts]
        SecurityAlerts[🔒 Security Alerts]
        BusinessAlerts[📊 Business Alerts]
    end
    
    subgraph "Dashboards"
        OperationalDashboard[📊 Operational Dashboard]
        BusinessDashboard[📈 Business Dashboard]
        SecurityDashboard[🔒 Security Dashboard]
        AIPerformanceDashboard[🤖 AI Performance Dashboard]
    end
    
    ResponseTime --> PerformanceAlerts
    ErrorRate --> ErrorAlerts
    UserSessions --> SecurityAlerts
    DocumentsCreated --> BusinessAlerts
    
    PerformanceAlerts --> OperationalDashboard
    BusinessAlerts --> BusinessDashboard
    SecurityAlerts --> SecurityDashboard
    ModelPerformance --> AIPerformanceDashboard
```

---

## 🚀 Deployment Architecture

```mermaid
graph TB
    subgraph "Development Environment"
        DevFrontend[🖥️ React Dev Server]
        DevBackend[⚙️ Node.js Dev Server]
        DevDB[🗄️ PostgreSQL Dev]
    end
    
    subgraph "Staging Environment"
        StagingFrontend[🖥️ Nginx + React Build]
        StagingBackend[⚙️ Node.js + PM2]
        StagingDB[🗄️ PostgreSQL Staging]
    end
    
    subgraph "Production Environment"
        LoadBalancer[⚖️ Load Balancer]
        ProdFrontend1[🖥️ Frontend Instance 1]
        ProdFrontend2[🖥️ Frontend Instance 2]
        ProdBackend1[⚙️ Backend Instance 1]
        ProdBackend2[⚙️ Backend Instance 2]
        ProdDB[🗄️ PostgreSQL Cluster]
        Redis[🔴 Redis Cache]
    end
    
    subgraph "CI/CD Pipeline"
        GitHub[📁 GitHub Repository]
        Actions[🔄 GitHub Actions]
        Tests[🧪 Automated Tests]
        Build[🏗️ Build Process]
        Deploy[🚀 Deployment]
    end
    
    subgraph "Monitoring & Logging"
        Prometheus[📊 Prometheus]
        Grafana[📈 Grafana]
        ELK[📋 ELK Stack]
        Alerts[🚨 Alert Manager]
    end
    
    GitHub --> Actions
    Actions --> Tests
    Tests --> Build
    Build --> Deploy
    
    Deploy --> StagingFrontend
    Deploy --> ProdFrontend1
    Deploy --> ProdFrontend2
    
    LoadBalancer --> ProdFrontend1
    LoadBalancer --> ProdFrontend2
    ProdFrontend1 --> ProdBackend1
    ProdFrontend2 --> ProdBackend2
    ProdBackend1 --> ProdDB
    ProdBackend2 --> ProdDB
    ProdBackend1 --> Redis
    ProdBackend2 --> Redis
    
    ProdFrontend1 --> Prometheus
    ProdBackend1 --> ELK
    Prometheus --> Grafana
    Grafana --> Alerts
```

---

*Diagramas de Arquitetura gerados em: ${new Date().toLocaleDateString('pt-BR')}*
*Sistema: ProfAi TCC Editor v1.0.0*
