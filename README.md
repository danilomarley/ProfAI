# 📝 ProfAi TCC Editor

> **Editor inteligente para TCCs com IA integrada para correções automáticas e formatação ABNT**

Um editor de texto moderno e profissional desenvolvido especificamente para a criação de trabalhos acadêmicos (TCC, dissertações, teses) com recursos avançados de correção automática, formatação ABNT e assistente de IA.

## 🚀 **Funcionalidades Principais**

### ✨ **Editor Avançado**
- 📄 **Editor de texto rico** com Monaco Editor
- 🎨 **Interface moderna** e intuitiva
- 📱 **Responsivo** para todos os dispositivos
- 🔄 **Sincronização em tempo real**

### 🤖 **Inteligência Artificial**
- 🧠 **Correções automáticas** de gramática e estilo
- 📚 **Sugestões de melhoria** contextuais
- 🎯 **Detecção de plágio** integrada
- 💡 **Assistente de escrita** inteligente

### 📋 **Formatação ABNT**
- 📖 **Formatação automática** segundo normas ABNT
- 🔍 **Verificação de conformidade** em tempo real
- 📊 **Templates pré-configurados** para diferentes tipos de trabalho
- 🏷️ **Citações e referências** automáticas

### 📤 **Exportação e Compartilhamento**
- 📄 **Export para PDF** com formatação preservada
- 📝 **Export para Word** (.docx)
- 📋 **Export para LaTeX**
- ☁️ **Sincronização na nuvem**

### 👥 **Colaboração**
- 🔐 **Autenticação segura** com OAuth2
- 👥 **Compartilhamento de documentos**
- 📝 **Comentários e sugestões**
- 📊 **Controle de versões**

## 🛠️ **Tecnologias Utilizadas**

### **Frontend**
- ⚛️ **React 18** - Interface de usuário
- 🎨 **TypeScript** - Tipagem estática
- 💨 **Tailwind CSS** - Estilização
- 🏗️ **Vite** - Build tool moderna
- 📝 **Monaco Editor** - Editor de código/texto
- 🎭 **Framer Motion** - Animações

### **Backend**
- 🟢 **Node.js** - Runtime JavaScript
- 🚀 **Express.js** - Framework web
- 🐘 **PostgreSQL** - Banco de dados
- 🔴 **Redis** - Cache e sessões
- 🔐 **JWT** - Autenticação
- 📄 **Puppeteer** - Geração de PDFs

### **DevOps**
- 🐳 **Docker** - Containerização
- 🔧 **Docker Compose** - Orquestração
- 🌐 **Nginx** - Reverse proxy
- ☁️ **Pronto para cloud** - AWS, DigitalOcean, Railway

## 📋 **Pré-requisitos**

- **Node.js** 18+ 
- **Docker** e **Docker Compose**
- **Git**

## 🚀 **Instalação e Execução**

### **1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/profai-tcc-editor.git
cd profai-tcc-editor
```

### **2. Instalação com Docker (Recomendado)**
```bash
# Inicie todos os serviços
docker-compose up -d

# Acesse a aplicação
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Banco: localhost:5432
```

### **3. Instalação Manual**
```bash
# Instale dependências do frontend
npm install

# Instale dependências do backend
cd backend
npm install
cd ..

# Configure variáveis de ambiente
cp env.example .env

# Inicie PostgreSQL e Redis localmente
# Configure as variáveis no .env

# Execute o backend
cd backend
npm run dev

# Execute o frontend (em outro terminal)
npm run dev
```

## 🔧 **Configuração**

### **Variáveis de Ambiente**
Copie o arquivo `env.example` para `.env` e configure:

```env
# Banco de dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=profai_tcc
DB_USER=postgres
DB_PASSWORD=sua_senha

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=sua_chave_secreta_super_forte

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

## 📚 **Documentação**

- 📖 **[Casos de Uso](CASOS_DE_USO_DETALHADOS.md)** - Funcionalidades detalhadas
- 🏗️ **[Arquitetura](DIAGRAMAS_ARQUITETURA.md)** - Estrutura do sistema
- 🎨 **[Diagramas UML](DIAGRAMAS_UML_VISUAL.md)** - Modelagem visual
- 🚀 **[Deploy](DEPLOY_GUIDE.md)** - Guia de hospedagem
- 📊 **[Draw.io](COMO_VISUALIZAR_DIAGRAMAS.md)** - Como visualizar diagramas

## 🧪 **Testes**

```bash
# Testes do frontend
npm test

# Testes com interface
npm run test:ui

# Testes do backend
cd backend
npm test

# Testes com coverage
npm run test:coverage
```

## 📦 **Build para Produção**

```bash
# Build do frontend
npm run build

# Build com Docker
docker build -t profai-app .

# Deploy com Docker Compose
docker-compose -f docker-compose.yml up -d
```

## 🚀 **Deploy**

O projeto está pronto para deploy em:

- 🌊 **DigitalOcean App Platform**
- 🚂 **Railway**
- 🎨 **Render**
- ☁️ **AWS ECS**
- 🔷 **Google Cloud Run**

Consulte o **[Guia de Deploy](DEPLOY_GUIDE.md)** para instruções específicas.

## 🤝 **Contribuição**

1. 🍴 **Fork** o projeto
2. 🌿 **Crie uma branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. 💾 **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. 📤 **Push** para a branch (`git push origin feature/AmazingFeature`)
5. 🔄 **Abra um Pull Request**

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 **Autor**

**Seu Nome**
- 🌐 Website: [seu-website.com](https://seu-website.com)
- 📧 Email: seu.email@exemplo.com
- 💼 LinkedIn: [seu-linkedin](https://linkedin.com/in/seu-linkedin)
- 🐱 GitHub: [@seu-usuario](https://github.com/seu-usuario)

## 🙏 **Agradecimentos**

- Orientador(a): **Nome do Orientador**
- Universidade: **Nome da Universidade**
- Curso: **Nome do Curso**

---

⭐ **Se este projeto te ajudou, deixe uma estrela!**