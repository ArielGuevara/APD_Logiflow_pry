# Billing Service Docker

Microservicio de facturación dockerizado. **No incluye base de datos PostgreSQL** - debe configurarse externamente.

## 🚀 Inicio Rápido

### 1. Construir la imagen:
```bash
docker build -t billing-service:latest .
```

### 2. Ejecutar:
```bash
docker run -d \
  --name billing-service \
  -p 8084:8084 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/logiflow_billing \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=tu_password \
  billing-service:latest
```

### 3. Verificar:
```bash
curl http://localhost:8084/swagger-ui.html
```

## 📖 Documentación Completa

Consulta [DOCKER.md](DOCKER.md) para:
- Diferentes formas de conexión a PostgreSQL
- Variables de entorno disponibles
- Troubleshooting
- Ejemplos de uso con Docker Compose

## 🔗 Conexión a Base de Datos

Debes tener PostgreSQL ejecutándose. Configura `SPRING_DATASOURCE_URL`:
- **Host**: `jdbc:postgresql://host.docker.internal:5432/logiflow_billing`
- **Contenedor**: `jdbc:postgresql://postgres-container:5432/logiflow_billing`
- **IP remota**: `jdbc:postgresql://192.168.1.100:5432/logiflow_billing`

## 📊 Endpoints

- API: http://localhost:8084
- Swagger: http://localhost:8084/swagger-ui.html
- API Docs: http://localhost:8084/v3/api-docs
