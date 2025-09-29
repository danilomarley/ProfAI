# 🚀 Guia de Deploy - ProfAi TCC Editor

## Opções de Hospedagem Recomendadas

### 1. 🌊 **DigitalOcean App Platform** (Recomendado)

#### Passo a passo:
1. **Preparação:**
   ```bash
   # 1. Faça push do código para GitHub
   git add .
   git commit -m "Preparação para deploy"
   git push origin main
   ```

2. **No DigitalOcean:**
   - Acesse [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Clique em "Create App"
   - Conecte seu repositório GitHub
   - Selecione o branch `main`

3. **Configuração da App:**
   - **Source Directory:** `/` (raiz)
   - **Build Command:** `docker build -t profai-app .`
   - **Run Command:** `docker run -p 5000:5000 profai-app`
   - **Port:** `5000`

4. **Banco de Dados:**
   - Adicione PostgreSQL Dev Database ($12/mês)
   - Adicione Redis Dev Database ($15/mês)

5. **Variáveis de Ambiente:**
   ```
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=${APP_URL}
   DB_HOST=${db.HOSTNAME}
   DB_PORT=${db.PORT}
   DB_NAME=${db.DATABASE}
   DB_USER=${db.USERNAME}
   DB_PASSWORD=${db.PASSWORD}
   REDIS_URL=${redis.DATABASE_URL}
   JWT_SECRET=sua-chave-jwt-super-secreta
   ```

6. **Deploy:**
   - Clique em "Create Resources"
   - Aguarde o build (5-10 minutos)

**Custo estimado:** $35-50/mês

---

### 2. 🚂 **Railway** (Mais Simples)

#### Passo a passo:
1. **Acesse [Railway](https://railway.app)**
2. **Login com GitHub**
3. **New Project → Deploy from GitHub repo**
4. **Selecione seu repositório**

5. **Configuração automática:**
   - Railway detecta o Dockerfile automaticamente
   - Adiciona PostgreSQL e Redis com 1 clique

6. **Variáveis de Ambiente:**
   ```
   NODE_ENV=production
   PORT=$PORT
   FRONTEND_URL=$RAILWAY_STATIC_URL
   DB_HOST=$PGHOST
   DB_PORT=$PGPORT
   DB_NAME=$PGDATABASE
   DB_USER=$PGUSER
   DB_PASSWORD=$PGPASSWORD
   REDIS_URL=$REDIS_URL
   JWT_SECRET=sua-chave-jwt-super-secreta
   ```

**Custo estimado:** $10-25/mês

---

### 3. 🎨 **Render**

#### Passo a passo:
1. **Acesse [Render](https://render.com)**
2. **New → Web Service**
3. **Connect GitHub repository**

4. **Configuração:**
   - **Environment:** Docker
   - **Dockerfile Path:** `./Dockerfile`
   - **Port:** `5000`

5. **Adicionar PostgreSQL:**
   - New → PostgreSQL
   - Conecte ao Web Service

6. **Adicionar Redis:**
   - New → Redis
   - Conecte ao Web Service

**Custo estimado:** $15-30/mês

---

### 4. ☁️ **AWS (Produção Avançada)**

#### Arquitetura:
- **ECS Fargate** (containers)
- **RDS PostgreSQL** (banco)
- **ElastiCache Redis** (cache)
- **ALB** (load balancer)
- **CloudFront** (CDN)

#### Deploy via AWS CLI:
```bash
# 1. Build e push da imagem
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
docker build -t profai-app .
docker tag profai-app:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/profai-app:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/profai-app:latest

# 2. Deploy via ECS
aws ecs update-service --cluster profai-cluster --service profai-service --force-new-deployment
```

**Custo estimado:** $50-150/mês

---

## 🔧 Preparação do Projeto

### 1. Otimizações necessárias:

```bash
# 1. Instalar dependências de produção
npm ci --only=production

# 2. Build do frontend
npm run build

# 3. Testar Docker localmente
docker build -t profai-test .
docker run -p 5000:5000 profai-test
```

### 2. Variáveis de ambiente obrigatórias:
- `NODE_ENV=production`
- `PORT=5000`
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `REDIS_URL`
- `JWT_SECRET`
- `FRONTEND_URL`

### 3. Checklist pré-deploy:
- [ ] Código no GitHub
- [ ] Dockerfile funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Build do frontend funcionando
- [ ] Testes passando
- [ ] SSL configurado (produção)

---

## 🎯 Recomendação Final

**Para começar rapidamente:** Use **Railway** ou **Render**
**Para produção séria:** Use **DigitalOcean** ou **AWS**
**Para orçamento limitado:** Comece com **Railway** (plano gratuito)

### Próximos passos:
1. Escolha uma plataforma
2. Configure as variáveis de ambiente
3. Faça o primeiro deploy
4. Configure domínio personalizado
5. Configure SSL/HTTPS
6. Configure monitoramento

---

## 📞 Suporte

Se precisar de ajuda com alguma plataforma específica, me avise qual escolheu e posso dar instruções mais detalhadas!
