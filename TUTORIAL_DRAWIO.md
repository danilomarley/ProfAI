# 🎨 Tutorial: Como Criar Diagramas no Draw.io

## 🚀 **Passo a Passo Completo**

### **1. Acessar o Draw.io**
- **URL**: https://app.diagrams.net/
- Clique em **"Create New Diagram"**
- Escolha **"Blank Diagram"**
- Nomeie como "ProfAi-Casos-de-Uso"

### **2. Configurar a Página**
- **File** → **Page Setup**
- **Format**: A4 ou Letter
- **Orientation**: Landscape (paisagem)
- **Background**: White

---

## 🎯 **Criando o Diagrama "Gestão de Usuários"**

### **Passo 1: Adicionar Atores**
1. **Painel Esquerdo** → Procure por "UML"
2. **Arraste** o elemento "Actor" para a tela
3. **Duplo clique** no ator → Digite "👤 Usuário"
4. **Arraste** outro "Actor" → Digite "🏫 Sistema UNIFOR"
5. **Posicione** os atores nas laterais

### **Passo 2: Criar Retângulo de Sistema**
1. **Painel Esquerdo** → "General" → "Rectangle"
2. **Arraste** um retângulo grande no centro
3. **Duplo clique** → Digite "Sistema de Autenticação"
4. **Formatação**:
   - **Fill**: Transparente ou cinza claro
   - **Stroke**: Preto, 2px
   - **Font**: Bold, 14px

### **Passo 3: Adicionar Casos de Uso**
1. **Painel Esquerdo** → "UML" → "Use Case" (elipse)
2. **Arraste** 5 elipses dentro do retângulo
3. **Nomeie cada uma**:
   - "Fazer Login\nvia UNIFOR"
   - "Registrar\nNova Conta"
   - "Gerenciar\nPerfil"
   - "Configurar\nPreferências"
   - "Logout\nSeguro"

### **Passo 4: Conectar com Linhas**
1. **Painel Esquerdo** → "General" → "Connector"
2. **Conecte** Usuário aos casos de uso (linhas sólidas)
3. **Para linhas tracejadas**:
   - Selecione a linha
   - **Format Panel** → **Line** → **Dashed**
4. **Adicionar labels**:
   - Duplo clique na linha
   - Digite "<<comunica>>" ou "<<inclui>>"

### **Passo 5: Formatação Final**
1. **Cores dos Atores**:
   - Selecione ator → **Fill**: Light Blue
   - **Stroke**: Dark Blue
2. **Cores dos Casos de Uso**:
   - Selecione elipse → **Fill**: Light Yellow
   - **Stroke**: Orange
3. **Alinhamento**:
   - Selecione elementos → **Arrange** → **Align**

---

## 📋 **Template Pronto para Copiar**

### **Elementos Necessários:**

#### **Atores:**
- 👤 Usuário
- 🏫 Sistema UNIFOR
- 🤖 ProfAi
- 📁 Sistema de Arquivos

#### **Casos de Uso (Elipses):**
- Fazer Login via UNIFOR
- Registrar Nova Conta
- Gerenciar Perfil
- Configurar Preferências
- Logout Seguro

#### **Relacionamentos:**
- **Linha Sólida** (→): Associação normal
- **Linha Tracejada** (⇢): Include/Extend
- **Labels**: <<comunica>>, <<inclui>>, <<estende>>

---

## 🎨 **Configurações de Estilo Recomendadas**

### **Atores:**
- **Shape**: Actor (boneco)
- **Fill**: #E3F2FD (azul claro)
- **Stroke**: #1976D2 (azul escuro)
- **Font**: Arial, 12px, Bold

### **Casos de Uso:**
- **Shape**: Ellipse
- **Fill**: #FFF3E0 (amarelo claro)
- **Stroke**: #F57C00 (laranja)
- **Font**: Arial, 11px, Normal

### **Retângulos de Sistema:**
- **Fill**: Transparente
- **Stroke**: #424242 (cinza escuro), 2px
- **Font**: Arial, 14px, Bold

### **Linhas:**
- **Associação**: Sólida, 1px, preta
- **Include/Extend**: Tracejada, 1px, preta
- **Setas**: Simples, tamanho médio

---

## 📊 **Layouts Recomendados**

### **Layout 1: Horizontal**
```
[Ator1] ──→ (Caso de Uso 1) ←── [Ator2]
        ──→ (Caso de Uso 2)
        ──→ (Caso de Uso 3)
```

### **Layout 2: Vertical**
```
    [Ator1]
       │
       ▼
┌─────────────────┐
│ (Caso de Uso 1) │
│ (Caso de Uso 2) │
│ (Caso de Uso 3) │
└─────────────────┘
```

### **Layout 3: Circular**
```
        (Caso de Uso 1)
           ↗     ↖
[Ator1] ──→     ←── [Ator2]
           ↘     ↗
        (Caso de Uso 2)
```

---

## 🔧 **Dicas Avançadas**

### **1. Usar Layers (Camadas)**
- **View** → **Layers**
- Crie camadas separadas para:
  - Atores
  - Casos de Uso
  - Relacionamentos
  - Labels

### **2. Criar Templates**
- **File** → **Save As Template**
- Salve seu estilo para reutilizar

### **3. Exportar em Alta Qualidade**
- **File** → **Export As** → **PNG**
- **Resolution**: 300 DPI
- **Transparent Background**: ✓
- **Border Width**: 10px

### **4. Colaboração**
- **Share** → **Link**
- Permita edição para trabalho em equipe

---

## 🚨 **Solucionando Problemas Comuns**

### **Problema: Elementos não se alinham**
**Solução:**
- Selecione elementos → **Arrange** → **Align**
- Use **Grid** → **View** → **Grid**

### **Problema: Texto cortado nas elipses**
**Solução:**
- Duplo clique na elipse
- **Text** → **Formatted Text**
- Ajuste o tamanho da fonte

### **Problema: Linhas não conectam**
**Solução:**
- Use **Connection Points** (pontos azuis)
- **View** → **Connection Points**

### **Problema: Exportação com baixa qualidade**
**Solução:**
- **File** → **Export As** → **SVG** (melhor qualidade)
- Ou PNG com 300 DPI

---

## 📱 **Atalhos Úteis**

| Ação | Atalho |
|------|--------|
| **Copiar** | Ctrl+C |
| **Colar** | Ctrl+V |
| **Duplicar** | Ctrl+D |
| **Agrupar** | Ctrl+G |
| **Desagrupar** | Ctrl+Shift+G |
| **Zoom In** | Ctrl++ |
| **Zoom Out** | Ctrl+- |
| **Fit Page** | Ctrl+H |
| **Undo** | Ctrl+Z |
| **Redo** | Ctrl+Y |

---

## 🎯 **Checklist Final**

Antes de finalizar seu diagrama, verifique:

- [ ] **Todos os atores** estão identificados
- [ ] **Casos de uso** têm nomes claros
- [ ] **Relacionamentos** estão corretos
- [ ] **Labels** nas linhas estão visíveis
- [ ] **Cores** seguem padrão consistente
- [ ] **Alinhamento** está organizado
- [ ] **Texto** está legível
- [ ] **Exportação** em alta qualidade

---

## 💾 **Salvando e Compartilhando**

### **Formatos Recomendados:**
- **.drawio**: Para editar depois
- **.png**: Para documentação
- **.svg**: Para web (escalável)
- **.pdf**: Para impressão

### **Compartilhamento:**
- **Google Drive**: Integração nativa
- **OneDrive**: Suporte completo
- **GitHub**: Commit dos arquivos .drawio
- **Link Público**: Para colaboração

---

*Tutorial Draw.io criado em: ${new Date().toLocaleDateString('pt-BR')}*
*Testado com: Draw.io Web, Desktop e Mobile*
