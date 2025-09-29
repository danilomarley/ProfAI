@echo off
REM ProfAi TCC Editor - Setup Script for Windows

echo 🎓 Configurando ProfAi TCC Editor...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker não está instalado. Por favor, instale o Docker primeiro.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro.
    pause
    exit /b 1
)

REM Create necessary directories
echo 📁 Criando diretórios necessários...
if not exist uploads mkdir uploads
if not exist exports mkdir exports
if not exist logs mkdir logs

REM Copy environment file
if not exist .env (
    echo 📝 Copiando arquivo de configuração...
    copy env.example .env
    echo ⚠️  Configure as variáveis de ambiente no arquivo .env
)

REM Build and start containers
echo 🐳 Construindo e iniciando containers...
docker-compose build
docker-compose up -d

REM Wait for database to be ready
echo ⏳ Aguardando banco de dados...
timeout /t 10 /nobreak >nul

REM Run database migrations
echo 🗄️  Executando migrações do banco de dados...
docker-compose exec -T app npm run migrate

REM Check if everything is running
echo 🔍 Verificando status dos serviços...
docker-compose ps

echo.
echo ✅ Setup concluído!
echo.
echo 🌐 Aplicação disponível em:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo    Database: localhost:5432
echo.
echo 📚 Para ver os logs:
echo    docker-compose logs -f app
echo.
echo 🛑 Para parar a aplicação:
echo    docker-compose down
echo.
echo 🎉 ProfAi está pronto para uso!
pause

