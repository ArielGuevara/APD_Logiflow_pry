# Logiflow Gateway - Configuración Kong

**Tipo:** API Gateway  
**Tecnología:** Kong  
**Puerto:** 8000  
**Configuración:** `kong.yml`

---

## 📋 Índice

- [Descripción General](#descripción-general)
- [Servicios Configurados](#servicios-configurados)
- [Plugins Globales](#plugins-globales)
- [Configuración de Rutas](#configuración-de-rutas)

---

## 🌐 Descripción General

Logiflow Gateway es el punto de entrada único (API Gateway) para todos los microservicios del sistema. Utiliza **Kong Gateway** para:

- Enrutamiento de peticiones a los servicios backend
- Gestión de CORS
- Logging centralizado
- Balanceo de carga (futuro)
- Autenticación centralizada (futuro)

---

## 🔧 Servicios Configurados

### 1. Auth Service

**Nombre del servicio:** `auth-service`  
**URL Backend:** `http://host.docker.internal:8081`  
**Tags:** `[authentication]`

**Rutas:**
- `/api/v1/auth` - Endpoints de autenticación
- `/api/v1/usuarios` - Endpoints de gestión de usuarios

**Configuración:**
- `strip_path: false` - Mantiene la ruta completa al reenviar
- **Métodos permitidos:** GET, POST, PUT, PATCH, DELETE

**Endpoints expuestos:**
```
http://localhost:8000/api/v1/auth/*
http://localhost:8000/api/v1/usuarios/*
```

---

### 2. Pedido Service

**Nombre del servicio:** `pedido-service`  
**URL Backend:** `http://host.docker.internal:8080`  
**Tags:** `[pedidos]`

**Rutas:**
- `/api/v1/pedidos` - Endpoints de gestión de pedidos

**Configuración:**
- `strip_path: false`
- **Métodos permitidos:** GET, POST, PUT, PATCH, DELETE

**Endpoints expuestos:**
```
http://localhost:8000/api/v1/pedidos/*
```

---

### 3. Fleet Service

**Nombre del servicio:** `fleet-service`  
**URL Backend:** `http://host.docker.internal:8083`  
**Tags:** `[fleet]`

**Rutas:**
- `/api/v1/fleet` - Endpoints de gestión de flota

**Configuración:**
- `strip_path: false`
- **Métodos permitidos:** GET, POST, PUT, PATCH, DELETE

**Endpoints expuestos:**
```
http://localhost:8000/api/v1/fleet/*
```

---

### 4. Billing Service

**Nombre del servicio:** `billing-service`  
**URL Backend:** `http://host.docker.internal:8084`  
**Tags:** `[billing]`

**Rutas:**
- `/api/v1/billing` - Endpoints de facturación

**Configuración:**
- `strip_path: false`
- **Métodos permitidos:** GET, POST, PUT, PATCH, DELETE

**Endpoints expuestos:**
```
http://localhost:8000/api/v1/billing/*
```

---

## 🔌 Plugins Globales

### 1. CORS Plugin

Permite peticiones cross-origin desde aplicaciones frontend.

**Configuración:**
```yaml
- name: cors
  config:
    origins:
      - http://localhost:3000  # React/Next.js
      - http://localhost:4200  # Angular
    methods: 
      - GET
      - POST
      - PUT
      - PATCH
      - DELETE
      - OPTIONS
    headers: 
      - Accept
      - Authorization
      - Content-Type
      - X-Requested-With
      - X-User-Id
    exposed_headers:
      - Authorization
      - Content-Disposition
    credentials: true
    max_age: 3600
```

**Headers permitidos:**
- `Accept`
- `Authorization` - Para tokens JWT
- `Content-Type`
- `X-Requested-With`
- `X-User-Id` - Custom header para identificación de usuario

**Headers expuestos a clientes:**
- `Authorization`
- `Content-Disposition`

---

### 2. File Log Plugin

Registra todas las peticiones para auditoría y debugging.

**Configuración:**
```yaml
- name: file-log
  config:
    path: /dev/stdout
    reopen: true
```

**Funcionalidad:**
- Registra todas las peticiones en stdout
- Útil para debugging y monitoreo
- Se puede integrar con sistemas de logging centralizados

---

## 🗺️ Configuración de Rutas

### Mapeo Completo

| Ruta Externa | Servicio Backend | Puerto | strip_path |
|-------------|------------------|--------|------------|
| `/api/v1/auth` | auth-service | 8081 | false |
| `/api/v1/usuarios` | auth-service | 8081 | false |
| `/api/v1/pedidos` | pedido-service | 8080 | false |
| `/api/v1/fleet` | fleet-service | 8083 | false |
| `/api/v1/billing` | billing-service | 8084 | false |

### Comportamiento de strip_path: false

Con `strip_path: false`, Kong **mantiene la ruta completa** al reenviar la petición al servicio backend.

**Ejemplo:**
```
Cliente solicita:    http://localhost:8000/api/v1/auth/login
Kong reenvía a:      http://host.docker.internal:8081/api/v1/auth/login
Servicio recibe:     POST /api/v1/auth/login
```

Esto es importante porque los controladores Spring Boot esperan exactamente estas rutas:
- `@RequestMapping("/api/v1/auth")` en AuthController
- `@RequestMapping("/api/v1/usuarios")` en UsuarioController
- etc.

---

## 🚀 Uso del Gateway

### Desde Frontend (React/Angular)

```javascript
// Configurar base URL
const API_BASE_URL = 'http://localhost:8000';

// Llamada al servicio de autenticación
fetch(`${API_BASE_URL}/api/v1/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

// Llamada con autenticación
fetch(`${API_BASE_URL}/api/v1/usuarios`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Desde Postman

**Base URL:** `http://localhost:8000`

**Ejemplos:**
```
POST   http://localhost:8000/api/v1/auth/register
POST   http://localhost:8000/api/v1/auth/login
GET    http://localhost:8000/api/v1/usuarios
POST   http://localhost:8000/api/v1/pedidos
GET    http://localhost:8000/api/v1/fleet/vehiculos
POST   http://localhost:8000/api/v1/billing/facturas
```

---

## 📝 Notas de Configuración

### host.docker.internal

Se utiliza `host.docker.internal` para que Kong (corriendo en Docker) pueda acceder a servicios corriendo en el host local.

**Alternativas:**
- Si todos los servicios están en Docker: usar nombre del contenedor
- Si Kong está fuera de Docker: usar `localhost` o `127.0.0.1`

### Formato de Configuración

- **Versión:** `3.0`
- **Transform:** `true` - Permite transformaciones en la configuración
- **Formato:** YAML declarativo (DB-less mode)

---

## 🔐 Futuras Mejoras

### Autenticación JWT (Pendiente)

Se puede agregar el plugin `jwt` de Kong para validar tokens automáticamente:

```yaml
plugins:
  - name: jwt
    config:
      secret_is_base64: false
      key_claim_name: kid
```

### Rate Limiting (Pendiente)

Limitar peticiones por IP o por usuario:

```yaml
plugins:
  - name: rate-limiting
    config:
      minute: 100
      hour: 1000
```

### Request Transformer (Pendiente)

Para transformar headers o agregar el `X-User-Id`:

```yaml
plugins:
  - name: request-transformer
    config:
      add:
        headers:
          - X-User-Id: <extracted_from_jwt>
```

---

## 📚 Recursos

- **Archivo de configuración:** [kong.yml](file:///c:/Users/USER/Documents/ESPE/APD_Logiflow_pry/logiflow-gateway/kong.yml)
- **Scripts de inicio:**
  - Windows: `start-kong.bat`
  - Linux/Mac: `start-kong.sh`
- **Docker Compose:** `docker-compose.yml`
- **Variables de entorno:** `.env`

---

## 🎯 Comandos Útiles

### Iniciar Kong
```bash
# Windows
start-kong.bat

# Linux/Mac
./start-kong.sh
```

### Verificar configuración
```bash
curl http://localhost:8001/
```

### Ver servicios configurados
```bash
curl http://localhost:8001/services
```

### Ver rutas configuradas
```bash
curl http://localhost:8001/routes
```

### Ver plugins activos
```bash
curl http://localhost:8001/plugins
```
