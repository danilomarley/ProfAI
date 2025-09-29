#!/bin/bash

# ProfAi TCC Editor - Setup Script
echo "🎓 Configurando ProfAi TCC Editor..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Create necessary directories
echo "📁 Criando diretórios necessários..."
mkdir -p uploads exports logs

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Copiando arquivo de configuração..."
    cp env.example .env
    echo "⚠️  Configure as variáveis de ambiente no arquivo .env"
fi

# Build and start containers
echo "🐳 Construindo e iniciando containers..."
docker-compose build
docker-compose up -d

# Wait for database to be ready
echo "⏳ Aguardando banco de dados..."
sleep 10

# Run database migrations
echo "🗄️  Executando migrações do banco de dados..."
docker-compose exec -T app npm run migrate

# Check if everything is running
echo "🔍 Verificando status dos serviços..."
docker-compose ps

echo ""
echo "✅ Setup concluído!"
echo ""
echo "🌐 Aplicação disponível em:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   Database: localhost:5432"
echo ""
echo "📚 Para ver os logs:"
echo "   docker-compose logs -f app"
echo ""
echo "🛑 Para parar a aplicação:"
echo "   docker-compose down"
echo ""
echo "🎉 ProfAi está pronto para uso!"

