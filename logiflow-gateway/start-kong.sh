#!/bin/bash

echo "🚀 Iniciando Kong API Gateway para LogiFlow..."
echo ""

# Verificar que Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo"
    echo "Por favor, inicia Docker Desktop y vuelve a intentar"
    exit 1
fi

# Verificar que docker-compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: docker-compose no está instalado"
    exit 1
fi

echo "✅ Docker está corriendo"
echo ""

# Detener servicios anteriores si existen
echo "🧹 Limpiando servicios anteriores..."
docker-compose down

echo ""
echo "📦 Iniciando servicios..."
echo ""

# Iniciar servicios
docker-compose up -d

echo ""
echo "⏳ Esperando a que Kong esté listo..."
echo ""

# Esperar a que Kong esté saludable
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s http://localhost:8001/status > /dev/null 2>&1; then
        echo "✅ Kong está listo!"
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "⏳ Intento $RETRY_COUNT/$MAX_RETRIES..."
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "❌ Error: Kong no respondió a tiempo"
    echo "Revisa los logs con: docker-compose logs kong"
    exit 1
fi

echo ""
echo "=========================================="
echo "✨ Kong API Gateway está corriendo!"
echo "=========================================="
echo ""
echo "🌐 URLs disponibles:"
echo "   - Gateway (Proxy):     http://localhost:8000"
echo "   - Kong Admin API:      http://localhost:8001"
echo "   - Kong Manager:        http://localhost:8002"
echo "   - Konga Dashboard:     http://localhost:1337"
echo ""
echo "📊 Verificar estado:"
echo "   curl http://localhost:8001/status"
echo ""
echo "📋 Ver servicios configurados:"
echo "   curl http://localhost:8001/services"
echo ""
echo "🔍 Ver rutas configuradas:"
echo "   curl http://localhost:8001/routes"
echo ""
echo "📝 Ver logs:"
echo "   docker-compose logs -f kong"
echo ""
echo "🛑 Detener Kong:"
echo "   docker-compose down"
echo ""
echo "=========================================="
echo ""

# Verificar servicios
echo "🔍 Verificando servicios configurados..."
echo ""

SERVICES=$(curl -s http://localhost:8001/services | jq -r '.data[].name' 2>/dev/null)

if [ -z "$SERVICES" ]; then
    echo "⚠️  No se pudieron listar los servicios (¿jq no instalado?)"
    echo "   Puedes verificar manualmente en: http://localhost:8001/services"
else
    echo "📦 Servicios activos:"
    echo "$SERVICES" | while read -r service; do
        echo "   ✓ $service"
    done
fi

echo ""
echo "✅ Kong API Gateway configurado correctamente"
echo ""