# Kong API Gateway - LogiFlow

API Gateway centralizado para los microservicios de LogiFlow usando Kong.

## 📋 Arquitectura

```
Cliente → Kong Gateway (8000) → Microservicios
                ↓
        Kong Admin (8001)
        Konga UI (1337)
```

## 🚀 Servicios Configurados

| Servicio | Puerto Interno | Ruta en Kong |
|----------|---------------|--------------|
| Auth Service | 8081 | /api/auth/** |
| Pedido Service | 8080 | /api/pedidos/** |
| Fleet Service | 8083 | /api/fleet/** |
| Billing Service | 8084 | /api/billing/** |

## 📦 Componentes

### 1. Kong Gateway
- **Puerto Proxy**: 8000 (HTTP) / 8443 (HTTPS)
- **Puerto Admin**: 8001
- **Kong Manager**: 8002

### 2. PostgreSQL
- **Puerto**: 5433 (mapeado desde 5432)
- **Base de datos**: kong
- **Usuario**: kong

### 3. Konga (UI)
- **Puerto**: 1337
- **Dashboard visual** para administrar Kong

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Docker Desktop instalado
- Docker Compose instalado
- Puertos disponibles: 8000, 8001, 8002, 1337, 5433

### Paso 1: Estructura de Archivos

```
logiflow-gateway/
├── docker-compose.yml
├── kong.yml
├── .env
└── README.md
```

### Paso 2: Iniciar Kong

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f kong

# Verificar estado
docker-compose ps
```

### Paso 3: Verificar Kong

```bash
# Verificar que Kong está corriendo
curl http://localhost:8001/status

# Listar servicios configurados
curl http://localhost:8001/services

# Listar rutas configuradas
curl http://localhost:8001/routes
```

## 🔧 Configuración de kong.yml

El archivo `kong.yml` es la configuración declarativa de Kong. Define:

### Servicios
Cada microservicio se define como un servicio en Kong:

```yaml
services:
  - name: auth-service
    url: http://host.docker.internal:8081
    routes:
      - name: auth-routes
        paths:
          - /api/auth
```

### Rutas
Las rutas definen cómo acceder a cada servicio:
- **paths**: Prefijos de URL que coinciden con el servicio
- **strip_path**: false (mantiene el path original)
- **methods**: Métodos HTTP permitidos

### Plugins Globales
- **rate-limiting**: 100 req/min por cliente
- **cors**: Configurado para localhost:3000 y localhost:4200
- **request-transformer**: Agrega headers personalizados
- **file-log**: Logging a stdout

## 📝 Uso del API Gateway

### Ejemplo: Login

**Sin Kong** (directo al microservicio):
```bash
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Con Kong** (a través del gateway):
```bash
curl -X POST http://localhost:8000/api/auth/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Ejemplo: Crear Pedido (con JWT)

```bash
curl -X POST http://localhost:8000/api/pedidos/api/v1/pedidos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"clienteId":"...","destino":"..."}'
```

## 🎨 Konga Dashboard

1. Accede a http://localhost:1337
2. Crea una cuenta de administrador
3. Conecta a Kong Admin: http://kong:8001
4. Administra servicios, rutas, plugins visualmente

## 🔒 Seguridad

### Plugins de Autenticación (Opcional)

Para agregar validación JWT en Kong:

```yaml
plugins:
  - name: jwt
    service: pedido-service
    config:
      uri_param_names:
        - jwt
```

### Rate Limiting por Servicio

```yaml
plugins:
  - name: rate-limiting
    service: auth-service
    config:
      minute: 50
      hour: 500
```

## 📊 Monitoreo

### Ver logs en tiempo real
```bash
docker-compose logs -f kong
```

### Verificar salud de Kong
```bash
curl http://localhost:8001/status
```

### Métricas
```bash
curl http://localhost:8001/metrics
```

## 🛑 Comandos Útiles

```bash
# Detener Kong
docker-compose down

# Reiniciar Kong
docker-compose restart kong

# Ver logs de un servicio específico
docker-compose logs -f kong-database

# Limpiar todo (cuidado: elimina datos)
docker-compose down -v

# Recargar configuración sin reiniciar
docker exec kong-gateway kong reload

# Validar configuración
docker exec kong-gateway kong check
```

## 🔄 Actualizar Configuración

1. Edita `kong.yml`
2. Reinicia Kong:
```bash
docker-compose restart kong
```

O recarga la configuración:
```bash
docker exec kong-gateway kong reload
```

## 🐛 Troubleshooting

### Kong no inicia
- Verifica que PostgreSQL esté saludable
- Revisa logs: `docker-compose logs kong`
- Verifica puertos disponibles

### Servicios no responden
- Verifica que tus microservicios estén corriendo
- Usa `host.docker.internal` en lugar de `localhost` dentro de Docker
- Verifica firewall

### Error 404
- Verifica que la ruta en `kong.yml` coincida con tu endpoint
- Verifica el `strip_path` setting

## 📚 Referencias

- [Kong Documentation](https://docs.konghq.com/)
- [Kong Docker](https://hub.docker.com/_/kong)
- [Konga GitHub](https://github.com/pantsel/konga)