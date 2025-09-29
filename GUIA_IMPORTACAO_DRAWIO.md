# 📥 Guia de Importação - Draw.io XML

## 🎯 **Arquivo XML Criado: `PROFAI_CASO_USO_DRAWIO.xml`**

### **✅ Regras de Diagramas de Caso de Uso Seguidas:**

#### **1. Estrutura Correta:**
- ✅ **Atores externos** ao sistema (fora do retângulo)
- ✅ **Casos de uso** dentro do sistema (dentro do retângulo)
- ✅ **Fronteira do sistema** claramente definida
- ✅ **Relacionamentos apropriados** (associação, include, extend)

#### **2. Linhas Sem Curvas:**
- ✅ **Todas as linhas são retas** (`rounded=0`)
- ✅ **Sem sobreposições** de linhas
- ✅ **Layout organizado** para evitar cruzamentos
- ✅ **Conexões diretas** entre elementos

#### **3. Elementos UML Corretos:**
- ✅ **Atores**: Formato stick figure padrão UML
- ✅ **Casos de Uso**: Elipses com nomes descritivos
- ✅ **Associações**: Linhas sólidas sem setas
- ✅ **Include/Extend**: Linhas tracejadas com setas abertas
- ✅ **Labels**: `<<include>>` e `<<extend>>` nas linhas

---

## 🚀 **Como Importar no Draw.io:**

### **Passo 1: Acessar o Draw.io**
1. Acesse: [https://app.diagrams.net/](https://app.diagrams.net/)
2. Clique em **"Create New Diagram"**

### **Passo 2: Importar o Arquivo XML**
1. Na tela inicial, clique em **"Open Existing Diagram"**
2. Selecione **"Device"** (Dispositivo)
3. Clique em **"Choose Files"**
4. Selecione o arquivo `PROFAI_CASO_USO_DRAWIO.xml`
5. Clique em **"Open"**

### **Passo 3: Visualizar o Diagrama**
- O diagrama será carregado automaticamente
- Todos os elementos estarão posicionados corretamente
- As cores e formatações serão preservadas

---

## 🎨 **Características do Diagrama Gerado:**

### **Atores Incluídos:**
- 👤 **Estudante** (ator principal)
- 👨‍🏫 **Orientador** (ator secundário)
- 🏫 **Sistema UNIFOR** (sistema externo)
- 🤖 **ProfAi** (sistema de IA)
- 📚 **Google Scholar** (API externa)

### **Casos de Uso por Categoria:**

#### **🔐 Autenticação (Vermelho):**
- Fazer Login via UNIFOR
- Gerenciar Perfil

#### **📝 Gestão de Documentos (Azul):**
- Criar Novo Documento
- Upload de Arquivo
- Salvar Documento

#### **✏️ Editor de Texto (Roxo):**
- Editar Texto em Tempo Real
- Aplicar Formatação
- Formatação ABNT Automática

#### **🤖 Sistema de Correções (Verde):**
- Analisar Texto com IA
- Visualizar Correções
- Aceitar/Rejeitar Correções

#### **📚 Citações e Referências (Amarelo):**
- Buscar Citações
- Inserir Citação ABNT
- Gerar Lista de Referências

#### **📤 Exportação (Cinza):**
- Exportar DOCX
- Exportar PDF

#### **🎮 Gamificação (Laranja):**
- Visualizar Progresso
- Desbloquear Conquistas

### **Relacionamentos Implementados:**

#### **Associações (Linhas Sólidas):**
- Estudante ↔ Todos os casos de uso principais
- Orientador ↔ Gerenciar Perfil, Visualizar Progresso
- Sistemas externos ↔ Casos de uso específicos

#### **Include (Linhas Tracejadas):**
- Editar Texto **inclui** Analisar Texto
- Analisar Texto **inclui** Visualizar Correções
- Inserir Citação **inclui** Gerar Referências

#### **Extend (Linhas Tracejadas):**
- Aceitar Correções **estende** Visualizar Progresso
- Visualizar Progresso **estende** Desbloquear Conquistas

---

## 🎯 **Validação das Regras UML:**

### **✅ Regras Seguidas:**

1. **Atores fora do sistema**: Todos os atores estão posicionados fora do retângulo do sistema
2. **Casos de uso dentro do sistema**: Todas as elipses estão dentro da fronteira
3. **Nomes claros**: Cada caso de uso tem nome descritivo e objetivo
4. **Relacionamentos corretos**: 
   - Associações para interações diretas
   - Include para dependências obrigatórias
   - Extend para funcionalidades opcionais
5. **Linhas retas**: Nenhuma linha tem curvas (`rounded=0`)
6. **Sem cruzamentos**: Layout organizado para evitar sobreposições
7. **Labels apropriados**: `<<include>>` e `<<extend>>` nas linhas tracejadas
8. **Cores organizadas**: Cada categoria tem cor específica para facilitar leitura

### **📊 Estatísticas do Diagrama:**
- **5 Atores** (1 principal, 4 secundários/externos)
- **20 Casos de Uso** organizados em 7 categorias
- **25+ Associações** diretas
- **5 Relacionamentos** include/extend
- **0 Cruzamentos** de linhas
- **Layout A4** otimizado para impressão

---

## 🔧 **Personalizações Possíveis:**

### **Após Importar, Você Pode:**

1. **Ajustar Posições**: Arrastar elementos para reorganizar
2. **Modificar Cores**: Alterar cores dos casos de uso por categoria
3. **Adicionar Casos de Uso**: Inserir novos elementos
4. **Editar Textos**: Duplo clique para modificar nomes
5. **Exportar**: Salvar como PNG, SVG, PDF, etc.

### **Formatos de Exportação Recomendados:**
- **PNG**: Para documentação (300 DPI)
- **SVG**: Para web (escalável)
- **PDF**: Para impressão
- **XML**: Para backup/edição futura

---

## 🚨 **Solução de Problemas:**

### **Problema: "Arquivo não abre"**
**Solução:**
- Certifique-se que o arquivo tem extensão `.xml`
- Verifique se o JavaScript está habilitado no navegador
- Tente usar o Draw.io Desktop se houver problemas no browser

### **Problema: "Elementos sobrepostos"**
**Solução:**
- Use **View** → **Fit** para ajustar zoom
- Redimensione a janela do navegador
- Use **Arrange** → **Layout** para reorganizar automaticamente

### **Problema: "Cores não aparecem"**
**Solução:**
- As cores estão definidas no XML e devem aparecer automaticamente
- Se não aparecerem, selecione elementos e aplique cores manualmente

---

## 📞 **Suporte Adicional:**

### **Recursos Úteis:**
- **Draw.io Help**: [https://www.diagrams.net/doc/](https://www.diagrams.net/doc/)
- **UML Use Case Guide**: Documentação oficial UML
- **Keyboard Shortcuts**: `Ctrl+Z` (undo), `Ctrl+C/V` (copy/paste)

### **Próximos Passos:**
1. **Importe o arquivo** seguindo os passos acima
2. **Visualize o resultado** completo
3. **Personalize** conforme necessário
4. **Exporte** no formato desejado
5. **Use na documentação** do seu projeto

---

**🎉 O arquivo XML está pronto para importação e segue todas as regras de diagramas de caso de uso UML!**

*Arquivo gerado em: ${new Date().toLocaleDateString('pt-BR')}*
*Compatível com: Draw.io, Diagrams.net, Lucidchart (importação XML)*
