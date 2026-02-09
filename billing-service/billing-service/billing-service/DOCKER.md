# Billing Service - Docker Deployment

## 📋 Requisitos
- Docker 20.10+
- Docker Compose 2.0+ (opcional)
- PostgreSQL (base de datos externa funcionando)

## ⚠️ Importante
Este microservicio **NO incluye la base de datos**. Debes tener PostgreSQL ejecutándose antes de iniciar el servicio.

## 🏗️ Construcción de la Imagen

```bash
docker build -t billing-service:latest .
```

## 🚀 Despliegue

### Opción 1: Con Docker Compose
Edita el `docker-compose.yml` y configura `SPRING_DATASOURCE_URL` según tu BD externa, luego:

```bash
docker-compose up -d
```

### Opción 2: Docker Run

#### Conectar a PostgreSQL en el host:
```bash
docker run -d \
  --name billing-service \
  -p 8084:8084 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/logiflow_billing \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=admin123 \
  billing-service:latest
```

#### Conectar a otro contenedor PostgreSQL:
```bash
docker run -d \
  --name billing-service \
  -p 8084:8084 \
  --network mi-red-postgres \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres-container:5432/logiflow_billing \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=admin123 \
  billing-service:latest
```

#### Conectar a PostgreSQL por IP:
```bash
docker run -d \
  --name billing-service \
  -p 8084:8084 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://192.168.1.100:5432/logiflow_billing \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=admin123 \
  billing-service:latest
```

## 🔧 Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `SPRING_DATASOURCE_URL` | URL de conexión a PostgreSQL | `jdbc:postgresql://host.docker.internal:5432/logiflow_billing` |
| `SPRING_DATASOURCE_USERNAME` | Usuario de la base de datos | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Contraseña de la base de datos | `admin123` |
| `SERVER_PORT` | Puerto del servicio | `8084` |
| `JAVA_OPTS` | Opciones de JVM | `-Xms256m -Xmx512m` |

## 🌐 Formas de Conectar a PostgreSQL Externa

### 1. PostgreSQL en el host (Windows/Mac/Linux)
```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/logiflow_billing
```
`host.docker.internal` es un DNS especial que apunta al host desde el contenedor.

### 2. PostgreSQL en otro contenedor Docker
```bash
# Crear red compartida
docker network create app-network

# Ejecutar PostgreSQL (o conectarlo a la red)
docker run --name postgres --network app-network ...

# Ejecutar billing-service
docker run --name billing-service --network app-network \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/logiflow_billing ...
```

### 3. PostgreSQL remoto (IP o dominio)
```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://192.168.1.100:5432/logiflow_billing
# o
SPRING_DATASOURCE_URL=jdbc:postgresql://mi-servidor.com:5432/logiflow_billing
```

## 📊 Endpoints Disponibles

- **API Base**: http://localhost:8084
- **Swagger UI**: http://localhost:8084/swagger-ui.html
- **API Docs**: http://localhost:8084/v3/api-docs

## 🔍 Logs y Monitoreo

Ver logs en tiempo real:
```bash
# Con docker-compose
docker-compose logs -f billing-service

# Con docker
docker logs -f billing-service
```

Ver últimas 100 líneas:
```bash
docker logs --tail 100 billing-service
```

## 🧪 Pruebas

### Verificar que el servicio responde:
```bash
curl http://localhost:8084/api/billing
```

### Crear una factura de prueba:
```bash
curl -X POST http://localhost:8084/api/billing \
  -H "Content-Type: application/json" \
  -d '{
    "pedidoId": "123e4567-e89b-12d3-a456-426614174000",
    "clienteId": "123e4567-e89b-12d3-a456-426614174001",
    "subtotal": 100.00
  }'
```

## 🐛 Troubleshooting

### Error: "Connection refused" o no puede conectar a la BD

1. **Verifica que PostgreSQL está ejecutándose:**
   ```bash
   # Si está en el host
   psql -h localhost -p 5432 -U postgres -d logiflow_billing
   ```

2. **Verifica la URL de conexión**:
   - ✅ `host.docker.internal` (desde Docker al host)
   - ✅ Nombre del contenedor (si está en la misma red)
   - ✅ IP del servidor
   - ❌ `localhost` (no funciona dentro del contenedor)

3. **Verifica que PostgreSQL permite conexiones externas:**
   - Edita `postgresql.conf`: `listen_addresses = '*'`
   - Edita `pg_hba.conf`: añade regla para permitir conexiones desde Docker

4. **Verifica los logs del microservicio:**
   ```bash
   docker logs billing-service
   ```

### Error: "database logiflow_billing does not exist"

Crea la base de datos manualmente:
```bash
psql -h localhost -p 5432 -U postgres -c "CREATE DATABASE logiflow_billing;"
```

### El contenedor se reinicia constantemente

Verifica los logs para ver el error:
```bash
docker logs billing-service
```

Probablemente no puede conectar a la BD. Revisa la URL de conexión.

## 📦 Arquitectura del Dockerfile

### Multi-Stage Build:

**Stage 1 - Build:**
- Imagen: `maven:3.9.9-eclipse-temurin-21-alpine`
- Descarga dependencias Maven
- Compila la aplicación
- Genera el JAR ejecutable

**Stage 2 - Runtime:**
- Imagen: `eclipse-temurin:21-jre-alpine` (solo JRE, más liviana)
- Copia solo el JAR compilado
- Usuario no privilegiado `spring:spring`
- Ejecuta con `dumb-init` para manejo de señales

### Beneficios:
- ✅ Imagen final pequeña (~200 MB vs ~500 MB)
- ✅ Mayor seguridad (no ejecuta como root)
- ✅ Mejor cache de capas de Docker
- ✅ Separación entre build y runtime

## 🔒 Seguridad

- ✅ Ejecuta como usuario no privilegiado
- ✅ Usa imágenes oficiales de Eclipse Temurin
- ✅ Alpine Linux (imagen base minimalista)
- ✅ No incluye herramientas de desarrollo en runtime
- ⚠️ Cambiar las credenciales por defecto en producción

## 📝 Notas Adicionales

- La base de datos debe existir antes de iniciar el servicio
- `ddl-auto: update` creará las tablas automáticamente
- En producción, considera usar `ddl-auto: validate` o flyway/liquibase
- Para escalar horizontalmente, comparte la misma base de datos

## 🔄 Comandos Útiles

```bash
# Detener el contenedor
docker stop billing-service

# Iniciar el contenedor
docker start billing-service

# Reiniciar el contenedor
docker restart billing-service

# Eliminar el contenedor
docker rm -f billing-service

# Eliminar la imagen
docker rmi billing-service:latest

# Reconstruir sin cache
docker build --no-cache -t billing-service:latest .

# Ejecutar en modo interactivo (para debug)
docker run -it --rm billing-service:latest sh
```
