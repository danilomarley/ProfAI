# 📋 Casos de Uso Detalhados - ProfAi TCC Editor

## 🎯 Especificação Técnica dos Casos de Uso

---

## 1. 🔐 **UC001 - Fazer Login via UNIFOR**

### Informações Básicas
- **ID**: UC001
- **Nome**: Fazer Login via UNIFOR
- **Ator Principal**: Usuário
- **Atores Secundários**: Sistema OAuth UNIFOR
- **Tipo**: Primário
- **Complexidade**: Média

### Pré-condições
- Usuário possui credenciais válidas da UNIFOR
- Sistema OAuth da UNIFOR está disponível
- Aplicação está acessível via HTTPS

### Pós-condições
- Usuário está autenticado no sistema
- Token JWT é gerado e armazenado
- Sessão do usuário é iniciada
- Redirecionamento para dashboard principal

### Fluxo Principal
1. Usuário acessa a página de login
2. Sistema exibe opção "Login UNIFOR"
3. Usuário clica em "Login UNIFOR"
4. Sistema redireciona para OAuth UNIFOR
5. Usuário insere credenciais da UNIFOR
6. UNIFOR valida credenciais
7. UNIFOR retorna código de autorização
8. Sistema troca código por token de acesso
9. Sistema obtém dados do usuário
10. Sistema cria/atualiza perfil do usuário
11. Sistema gera JWT token
12. Sistema redireciona para dashboard

### Fluxos Alternativos
**A1 - Credenciais Inválidas**
- 6a. UNIFOR rejeita credenciais
- 6b. Sistema exibe mensagem de erro
- 6c. Retorna ao passo 5

**A2 - Erro de Comunicação**
- 4a. Falha na comunicação com UNIFOR
- 4b. Sistema exibe mensagem de erro técnico
- 4c. Oferece opção de tentar novamente

### Fluxos de Exceção
**E1 - Sistema UNIFOR Indisponível**
- Sistema detecta indisponibilidade
- Exibe mensagem informativa
- Oferece login alternativo (se disponível)

### Regras de Negócio
- RN001: Apenas usuários da UNIFOR podem acessar
- RN002: Token JWT expira em 24 horas
- RN003: Máximo 5 tentativas de login por hora

---

## 2. 📝 **UC006 - Criar Novo Documento TCC**

### Informações Básicas
- **ID**: UC006
- **Nome**: Criar Novo Documento TCC
- **Ator Principal**: Usuário
- **Tipo**: Primário
- **Complexidade**: Baixa

### Pré-condições
- Usuário está autenticado
- Usuário tem permissão para criar documentos

### Pós-condições
- Novo documento é criado no sistema
- Documento é associado ao usuário
- Editor é aberto com documento vazio
- ProfAi envia mensagem de boas-vindas

### Fluxo Principal
1. Usuário clica em "Novo Documento"
2. Sistema solicita título do TCC
3. Usuário insere título
4. Sistema valida título
5. Sistema cria documento no banco
6. Sistema abre editor com documento
7. ProfAi envia mensagem de boas-vindas
8. Sistema exibe template inicial (opcional)

### Fluxos Alternativos
**A1 - Título Duplicado**
- 4a. Sistema detecta título existente
- 4b. Solicita confirmação ou novo título
- 4c. Usuário confirma ou altera título

**A2 - Usar Template**
- 8a. Usuário escolhe usar template
- 8b. Sistema carrega template ABNT
- 8c. Editor é preenchido com estrutura

### Regras de Negócio
- RN004: Título deve ter entre 5 e 200 caracteres
- RN005: Usuário pode ter máximo 10 documentos ativos
- RN006: Documento é salvo automaticamente a cada 30s

---

## 3. 🤖 **UC015 - Análise Inteligente de Texto**

### Informações Básicas
- **ID**: UC015
- **Nome**: Análise Inteligente de Texto
- **Ator Principal**: Sistema de IA
- **Ator Secundário**: Usuário
- **Tipo**: Automático
- **Complexidade**: Alta

### Pré-condições
- Documento está aberto no editor
- Texto tem pelo menos 100 caracteres
- Sistema de IA está disponível

### Pós-condições
- Correções são identificadas e catalogadas
- Sugestões são exibidas na sidebar
- ProfAi gera mensagens contextuais
- Progresso é atualizado

### Fluxo Principal
1. Sistema detecta mudança no texto (debounce 3s)
2. Sistema extrai texto plano do editor
3. Sistema limita análise a 5000 caracteres
4. SmartTCCFormatter analisa estrutura TCC
5. Sistema identifica elementos ABNT
6. Sistema detecta erros ortográficos
7. Sistema detecta erros gramaticais
8. Sistema analisa estilo e coesão
9. Sistema combina todas as correções
10. Sistema filtra duplicatas
11. Sistema prioriza por severidade
12. Sistema atualiza interface
13. ProfAi gera mensagem contextual

### Fluxos Alternativos
**A1 - Texto Muito Curto**
- 1a. Texto tem menos de 100 caracteres
- 1b. Sistema não executa análise
- 1c. Aguarda mais conteúdo

**A2 - Erro na Análise**
- 4a. Falha no processamento de IA
- 4b. Sistema registra erro
- 4c. Exibe mensagem de erro temporário

### Regras de Negócio
- RN007: Análise só ocorre após 3s de inatividade
- RN008: Máximo 5000 caracteres por análise
- RN009: Correções são priorizadas por severidade
- RN010: Duplicatas são automaticamente removidas

---

## 4. 📐 **UC026 - Aplicar Formatação ABNT Automática**

### Informações Básicas
- **ID**: UC026
- **Nome**: Aplicar Formatação ABNT Automática
- **Ator Principal**: Usuário
- **Ator Secundário**: Sistema ABNT
- **Tipo**: Primário
- **Complexidade**: Alta

### Pré-condições
- Documento está aberto no editor
- Documento contém texto para formatar
- Sistema de formatação ABNT está disponível

### Pós-condições
- Texto está formatado conforme normas ABNT
- Elementos TCC são identificados e formatados
- Usuário recebe feedback do processo
- Análise adicional é executada

### Fluxo Principal
1. Usuário clica no botão "ABNT"
2. Sistema obtém texto completo do editor
3. Sistema limpa formatação existente
4. Sistema aplica formatação base (Times 12pt)
5. Sistema divide texto em linhas
6. Para cada linha, sistema:
   - Identifica tipo de elemento
   - Aplica formatação específica
7. Sistema configura espaçamento (1.6)
8. Sistema atualiza editor com formatação
9. Sistema executa análise de IA adicional
10. Sistema exibe mensagem de sucesso

### Detalhamento da Formatação por Tipo

#### Capa e Folha de Rosto
- **Padrão**: "UNIVERSIDADE FEDERAL", "FACULDADE DE"
- **Formatação**: 14pt, negrito, centralizado, fonte serif

#### Títulos Principais
- **Padrão**: "RESUMO", "INTRODUÇÃO", "CONCLUSÃO"
- **Formatação**: 14pt, negrito, centralizado, Header 1

#### Títulos Numerados
- **Padrão**: "1 INTRODUÇÃO", "2 METODOLOGIA"
- **Formatação**: 14pt, negrito, alinhado à esquerda, Header 1

#### Subtítulos
- **Padrão**: "1.1 Objetivos", "2.1 Materiais"
- **Formatação**: 12pt, negrito, alinhado à esquerda, Header 2

#### Nome do Autor
- **Padrão**: Nome próprio isolado
- **Formatação**: 12pt, negrito, centralizado

#### Título do Trabalho
- **Padrão**: Texto em maiúsculas (não seção)
- **Formatação**: 16pt, negrito, centralizado

#### Listas
- **Padrão**: Linhas iniciadas com "•", "-", "*"
- **Formatação**: Lista com marcadores

#### Parágrafos
- **Padrão**: Texto normal
- **Formatação**: 12pt, justificado, recuo primeira linha

### Fluxos Alternativos
**A1 - Texto Sem Estrutura TCC**
- 6a. Sistema não identifica elementos TCC
- 6b. Aplica formatação padrão para texto acadêmico
- 6c. Informa usuário sobre estrutura recomendada

**A2 - Formatação Parcial**
- 6a. Alguns elementos não são identificados
- 6b. Sistema formata elementos reconhecidos
- 6c. Sugere ajustes manuais para elementos não identificados

### Regras de Negócio
- RN011: Fonte padrão é Times New Roman 12pt
- RN012: Espaçamento entre linhas é 1.6
- RN013: Títulos principais são centralizados
- RN014: Parágrafos são justificados com recuo
- RN015: Margens seguem padrão ABNT (3cm esq/sup, 2cm dir/inf)

---

## 5. 🎮 **UC046 - Visualizar Progresso da Revisão**

### Informações Básicas
- **ID**: UC046
- **Nome**: Visualizar Progresso da Revisão
- **Ator Principal**: Usuário
- **Ator Secundário**: Sistema de Gamificação
- **Tipo**: Primário
- **Complexidade**: Média

### Pré-condições
- Usuário está autenticado
- Documento está sendo editado
- Sistema possui correções identificadas

### Pós-condições
- Progresso é calculado e exibido
- Estatísticas são atualizadas
- Conquistas são verificadas
- Interface reflete progresso atual

### Fluxo Principal
1. Sistema calcula progresso baseado em correções
2. Sistema atualiza barra de progresso
3. Sistema exibe estatísticas detalhadas
4. Sistema verifica conquistas desbloqueáveis
5. Sistema atualiza interface com progresso
6. ProfAi gera mensagem motivacional (se aplicável)

### Cálculo de Progresso
```
Progresso = (Correções Aceitas / Total de Correções) × 100
```

### Estatísticas Exibidas
- **Progresso Geral**: Porcentagem de revisão completa
- **Correções Aceitas**: Número de correções aplicadas
- **Correções Pendentes**: Número de correções aguardando
- **Palavras Revisadas**: Contagem de palavras processadas
- **Tempo de Sessão**: Duração da sessão atual
- **Conquistas**: Badges desbloqueadas

### Conquistas Disponíveis
- 🏆 **Primeiro Upload**: Fazer upload do primeiro documento
- ✅ **Primeira Correção**: Aceitar primeira sugestão
- 📚 **Capítulo Completo**: Completar revisão de um capítulo
- 🎯 **Meio Caminho**: Alcançar 50% de progresso
- 🏅 **Revisão Completa**: Completar 100% da revisão
- 📐 **Mestre ABNT**: Aplicar formatação ABNT 5 vezes
- ⚡ **Escritor Rápido**: Escrever 1000 palavras em uma sessão

### Regras de Negócio
- RN016: Progresso é calculado em tempo real
- RN017: Conquistas são desbloqueadas automaticamente
- RN018: Estatísticas são persistidas no banco
- RN019: Progresso é resetado para novos documentos

---

## 6. 📤 **UC041 - Exportar Documento como DOCX**

### Informações Básicas
- **ID**: UC041
- **Nome**: Exportar Documento como DOCX
- **Ator Principal**: Usuário
- **Ator Secundário**: Sistema de Exportação
- **Tipo**: Primário
- **Complexidade**: Alta

### Pré-condições
- Documento está aberto e salvo
- Usuário tem permissão de exportação
- Sistema de exportação está disponível

### Pós-condições
- Arquivo DOCX é gerado
- Formatação ABNT é preservada
- Metadados são incluídos
- Download é iniciado automaticamente

### Fluxo Principal
1. Usuário clica em "Exportar DOCX"
2. Sistema valida documento atual
3. Sistema converte HTML para formato Word
4. Sistema aplica estilos ABNT no documento
5. Sistema inclui metadados do documento
6. Sistema gera arquivo DOCX
7. Sistema inicia download do arquivo
8. Sistema registra exportação no histórico
9. ProfAi parabeniza pela conclusão

### Metadados Incluídos
- **Título**: Título do documento
- **Autor**: Nome do usuário
- **Assunto**: Área de estudo/curso
- **Palavras-chave**: Extraídas automaticamente
- **Data de Criação**: Data original do documento
- **Data de Modificação**: Última alteração
- **Universidade**: UNIFOR (se aplicável)
- **Orientador**: Se informado pelo usuário

### Estilos ABNT Aplicados
- **Fonte**: Times New Roman 12pt
- **Espaçamento**: 1.5 entre linhas
- **Margens**: 3cm (esq/sup), 2cm (dir/inf)
- **Títulos**: Formatação hierárquica
- **Parágrafos**: Justificados com recuo
- **Citações**: Formatação específica ABNT
- **Referências**: Lista formatada automaticamente

### Fluxos Alternativos
**A1 - Documento Não Salvo**
- 2a. Sistema detecta alterações não salvas
- 2b. Sistema salva automaticamente
- 2c. Continua com exportação

**A2 - Erro na Geração**
- 6a. Falha na geração do arquivo
- 6b. Sistema registra erro
- 6c. Exibe mensagem de erro ao usuário
- 6d. Oferece opção de tentar novamente

### Regras de Negócio
- RN020: Arquivo mantém toda formatação ABNT
- RN021: Metadados são obrigatórios
- RN022: Arquivo é gerado em formato compatível Office 2016+
- RN023: Tamanho máximo do arquivo: 50MB

---

## 7. 🔍 **Matriz de Rastreabilidade**

| Funcionalidade | Casos de Uso Relacionados | Prioridade | Status |
|---|---|---|---|
| **Autenticação** | UC001, UC002, UC003, UC004, UC005 | Alta | ✅ Implementado |
| **Gestão Documentos** | UC006, UC007, UC008, UC009, UC010 | Alta | ✅ Implementado |
| **Editor Inteligente** | UC011, UC012, UC013, UC014, UC015 | Alta | ✅ Implementado |
| **ProfAi** | UC016, UC017, UC018, UC019, UC020 | Alta | ✅ Implementado |
| **Correções** | UC021, UC022, UC023, UC024, UC025 | Alta | ✅ Implementado |
| **Formatação ABNT** | UC026, UC027, UC028, UC029, UC030 | Alta | ✅ Implementado |
| **Citações** | UC031, UC032, UC033, UC034, UC035 | Média | 🔄 Em Desenvolvimento |
| **Versionamento** | UC036, UC037, UC038, UC039, UC040 | Média | 🔄 Em Desenvolvimento |
| **Exportação** | UC041, UC042, UC043, UC044, UC045 | Alta | ✅ Implementado |
| **Gamificação** | UC046, UC047, UC048, UC049, UC050 | Baixa | ✅ Implementado |

---

## 8. 📊 **Métricas de Casos de Uso**

### Complexidade por Funcionalidade
```
Alta Complexidade (7-10 pontos):
- UC015: Análise Inteligente de Texto (10)
- UC026: Formatação ABNT Automática (9)
- UC041: Exportar DOCX (8)
- UC042: Exportar PDF (8)

Média Complexidade (4-6 pontos):
- UC001: Login UNIFOR (6)
- UC025: Análise Automática (6)
- UC046: Visualizar Progresso (5)
- UC038: Comparar Versões (5)

Baixa Complexidade (1-3 pontos):
- UC006: Criar Documento (3)
- UC009: Salvar Documento (2)
- UC022: Aceitar Correção (2)
- UC047: Desbloquear Conquista (1)
```

### Frequência de Uso Estimada
```
Muito Alta (>100 vezes/sessão):
- UC015: Análise Inteligente
- UC011: Editar Texto
- UC009: Salvar Documento

Alta (10-100 vezes/sessão):
- UC022: Aceitar/Rejeitar Correções
- UC021: Visualizar Correções
- UC046: Visualizar Progresso

Média (1-10 vezes/sessão):
- UC026: Formatação ABNT
- UC041: Exportar DOCX
- UC016: Interagir com ProfAi

Baixa (<1 vez/sessão):
- UC001: Login
- UC006: Criar Documento
- UC007: Upload Arquivo
```

---

## 9. 🧪 **Cenários de Teste**

### Cenário de Teste 1: Fluxo Completo de TCC
```
Dado que o usuário está logado
Quando ele cria um novo documento "Meu TCC de Pedagogia"
E faz upload de um arquivo .docx
E o sistema extrai o texto
E aplica formatação ABNT
E aceita 80% das correções sugeridas
E exporta como PDF
Então o documento final deve estar formatado corretamente
E todas as correções aceitas devem estar aplicadas
E o progresso deve mostrar 80% completo
```

### Cenário de Teste 2: Interação com ProfAi
```
Dado que o usuário está editando um documento
Quando ele digita texto com erros ortográficos
E aguarda 3 segundos
Então o sistema deve identificar os erros
E a ProfAi deve enviar mensagem explicativa
E as correções devem aparecer na sidebar
E o usuário deve poder aceitar/rejeitar cada correção
```

### Cenário de Teste 3: Formatação ABNT Inteligente
```
Dado que o usuário tem um texto TCC não formatado
Quando ele clica no botão "ABNT"
Então o sistema deve identificar:
- Universidade e faculdade (formato capa)
- Títulos principais (RESUMO, INTRODUÇÃO)
- Subtítulos numerados (1.1, 1.2)
- Nome do autor
- Parágrafos normais
E aplicar formatação específica para cada elemento
E exibir mensagem de sucesso
```

---

*Casos de Uso Detalhados gerados em: ${new Date().toLocaleDateString('pt-BR')}*
*Sistema: ProfAi TCC Editor v1.0.0*
*Padrão: UML 2.5 / IEEE 830*
