# LogiFlow Auth Service - Documentación Técnica

## 📋 Información General

**Nombre del Proyecto:** LogiFlow Auth Service  
**Versión:** 1.0.0  
**Framework:** Spring Boot 4.0.0  
**Java Version:** 21  
**Puerto:** 8081  
**Base de Datos:** PostgreSQL  
**Descripción:** Microservicio de autenticación y autorización para el sistema LogiFlow, una plataforma de gestión logística y entregas.

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Capas

El proyecto sigue una arquitectura limpia en capas:

```
authservice_core/
│
├── controller/          # Capa de presentación (API REST)
│   ├── AuthController.java
│   └── UsuarioController.java
│
├── service/            # Capa de lógica de negocio
│   ├── AuthService.java
│   ├── JwtService.java
│   ├── RefreshTokenService.java
│   ├── UsuarioService.java
│   └── impl/           # Implementaciones de servicios
│
├── repository/         # Capa de acceso a datos
│   ├── UsuarioRepository.java
│   ├── RolRepository.java
│   └── RefreshTokenRepository.java
│
├── model/             # Modelos de dominio
│   ├── entity/        # Entidades JPA
│   │   ├── Usuario.java
│   │   ├── Rol.java
│   │   ├── RefreshToken.java
│   │   └── BaseEntity.java
│   └── enums/         # Enumeraciones
│       ├── RoleName.java
│       ├── UserStatus.java
│       └── FleetType.java
│
├── dto/               # Data Transfer Objects
│   ├── request/       # DTOs de entrada
│   │   ├── LoginRequestDto.java
│   │   ├── RegisterRequestDto.java
│   │   ├── RefreshTokenRequestDto.java
│   │   └── UpdateUserRequestDto.java
│   ├── response/      # DTOs de salida
│   │   ├── ApiResponseDto.java
│   │   ├── AuthResponseDto.java
│   │   ├── UserResponseDto.java
│   │   ├── RolResponseDto.java
│   │   └── ErrorResponseDto.java
│   └── mapper/        # Mappers MapStruct
│       ├── UsuarioMapper.java
│       └── RolMapper.java
│
├── security/          # Configuración de seguridad
│   ├── JwtAuthenticationFilter.java
│   └── UserDetailsServiceImpl.java
│
├── config/            # Configuraciones
│   ├── SecurityConfig.java
│   ├── JwtConfig.java
│   ├── CorsConfig.java
│   ├── OpenApiConfig.java
│   ├── DataInitializer.java
│   └── TokenCleanupScheduler.java
│
├── exception/         # Manejo de excepciones
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   ├── UnauthorizedException.java
│   └── BadRequestException.java
│
└── utils/            # Utilidades
    └── Constants.java
```

### Tecnologías Principales

- **Spring Boot 4.0.0**: Framework principal
- **Spring Security**: Autenticación y autorización
- **Spring Data JPA**: Persistencia de datos
- **PostgreSQL**: Base de datos relacional
- **JWT (JJWT 0.12.5)**: Tokens de autenticación
- **MapStruct 1.5.5**: Mapeo de objetos
- **Lombok**: Reducción de código boilerplate
- **SpringDoc OpenAPI 2.7.0**: Documentación API (Swagger)
- **Validation API**: Validación de datos

---

## 🔐 Sistema de Autenticación

### Mecanismo de Seguridad

1. **Access Token (JWT)**: Token de corta duración (24 horas) para acceso a recursos
2. **Refresh Token**: Token de larga duración (7 días) para renovar access tokens
3. **Bearer Authentication**: Tokens enviados en header `Authorization: Bearer <token>`

### Configuración JWT

- **Secret Key**: Configurable mediante variable de entorno `JWT_SECRET`
- **Expiración Access Token**: 86400000 ms (24 horas)
- **Expiración Refresh Token**: 604800000 ms (7 días)
- **Issuer**: logiflow-auth-service

---

## 👥 Sistema de Roles y Permisos

### Roles del Sistema (RoleName)

| Rol | Nivel | Descripción |
|-----|-------|-------------|
| `CLIENTE` | 1 | Usuario que solicita entregas |
| `REPARTIDOR` | 2 | Conductor que realiza entregas |
| `SUPERVISOR` | 3 | Supervisa operaciones en una zona |
| `GERENTE` | 4 | Gestiona múltiples zonas |
| `ADMIN` | 5 | Control total del sistema |

### Estados de Usuario (UserStatus)

- `ACTIVE`: Usuario activo, puede usar el sistema
- `INACTIVE`: Usuario suspendido temporalmente
- `BLOCKED`: Usuario bloqueado, sin acceso
- `PENDING_VERIFICATION`: Pendiente de verificación

### Tipos de Flota (FleetType)

Aplica solo para repartidores:

- `MOTORIZADO`: Entregas urbanas rápidas (última milla)
- `VEHICULO_LIVIANO`: Entregas intermunicipales
- `CAMION`: Entregas nacionales
- `NONE`: No aplica (roles no operativos)

---

## 📡 API Endpoints

### Base URL: `/api/v1`
### Auth Base URL: `/api/v1/auth`

---

## 🔑 AuthController - Endpoints de Autenticación

### 1. Registrar Usuario

**Endpoint:** `POST /api/v1/auth/register`  
**Autenticación:** No requerida  
**Descripción:** Registra un nuevo usuario en el sistema y devuelve tokens de autenticación.

#### Request Body (RegisterRequestDto)

```json
{
  "email": "string",              // Requerido, formato email válido
  "password": "string",           // Requerido, mínimo 8 caracteres, máximo 100
  "nombre": "string",             // Requerido, máximo 100 caracteres
  "apellido": "string",           // Requerido, máximo 100 caracteres
  "telefono": "string",           // Opcional, debe cumplir patrón de teléfono
  "direccion": "string",          // Opcional, máximo 255 caracteres
  "roleName": "RoleName",         // Requerido: CLIENTE, REPARTIDOR, SUPERVISOR, GERENTE, ADMIN
  "fleetType": "FleetType",       // Opcional, requerido si roleName = REPARTIDOR
  "zoneId": "string"              // Opcional, zona asignada (para repartidores/supervisores)
}
```

#### Response (201 Created)

```json
{
  "success": true,
  "message": "string",
  "data": {
    "accessToken": "string",          // JWT para acceso a recursos
    "refreshToken": "string",         // Token para renovar access token
    "tokenType": "Bearer",
    "expiresAt": "2026-02-08T10:30:00",
    "user": {
      "id": "uuid",
      "email": "string",
      "nombre": "string",
      "apellido": "string",
      "nombreCompleto": "string",
      "telefono": "string",
      "direccion": "string",
      "rol": {
        "id": "uuid",
        "name": "RoleName",
        "description": "string",
        "active": true
      },
      "status": "ACTIVE",
      "fleetType": "FleetType",
      "zoneId": "string",
      "lastLogin": "2026-02-07T10:30:00",
      "createdAt": "2026-02-07T10:30:00",
      "updatedAt": "2026-02-07T10:30:00"
    },
    "message": "Usuario registrado exitosamente"
  },
  "timestamp": "2026-02-07T10:30:00"
}
```

#### Códigos de Respuesta

- `201 Created`: Usuario registrado exitosamente
- `400 Bad Request`: Datos inválidos o email ya registrado

#### Información Adicional

- **IP del Cliente**: Se captura automáticamente del request
- **User Agent**: Se almacena para auditoría
- **Inicialización de Datos**: Al registrarse se asigna el rol correspondiente

---

### 2. Iniciar Sesión

**Endpoint:** `POST /api/v1/auth/login`  
**Autenticación:** No requerida  
**Descripción:** Autentica un usuario con email y contraseña, devuelve tokens de acceso.

#### Request Body (LoginRequestDto)

```json
{
  "email": "string",        // Requerido, formato email válido
  "password": "string"      // Requerido, mínimo 8 caracteres
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "tokenType": "Bearer",
    "expiresAt": "2026-02-08T10:30:00",
    "user": {
      // ... mismo formato que registro
    },
    "message": "Inicio de sesión exitoso"
  },
  "timestamp": "2026-02-07T10:30:00"
}
```

#### Códigos de Respuesta

- `200 OK`: Autenticación exitosa
- `401 Unauthorized`: Credenciales inválidas o usuario inactivo

#### Validaciones

- El usuario debe tener estado `ACTIVE`
- Se actualiza la fecha de `lastLogin`
- Se registra IP y User Agent

---

### 3. Renovar Token

**Endpoint:** `POST /api/v1/auth/refresh`  
**Autenticación:** No requerida (usa refresh token)  
**Descripción:** Genera un nuevo access token usando un refresh token válido.

#### Request Body (RefreshTokenRequestDto)

```json
{
  "refreshToken": "string"    // Requerido, refresh token válido
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Token renovado exitosamente",
  "data": {
    "accessToken": "string",      // Nuevo access token
    "refreshToken": "string",     // Mismo refresh token o uno nuevo
    "tokenType": "Bearer",
    "expiresAt": "2026-02-08T10:30:00",
    "user": {
      // ... datos del usuario
    },
    "message": "Token renovado exitosamente"
  },
  "timestamp": "2026-02-07T10:30:00"
}
```

#### Códigos de Respuesta

- `200 OK`: Token renovado exitosamente
- `401 Unauthorized`: Refresh token inválido o expirado

#### Validaciones

- El refresh token debe existir en la base de datos
- No debe estar expirado
- El usuario asociado debe estar activo

---

### 4. Cerrar Sesión

**Endpoint:** `POST /api/v1/auth/logout`  
**Autenticación:** No requerida (usa refresh token)  
**Descripción:** Revoca el refresh token y cierra la sesión del usuario.

#### Request Body (RefreshTokenRequestDto)

```json
{
  "refreshToken": "string"    // Requerido
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente",
  "data": null,
  "timestamp": "2026-02-07T10:30:00"
}
```

#### Códigos de Respuesta

- `200 OK`: Sesión cerrada exitosamente
- `401 Unauthorized`: Token inválido

#### Comportamiento

- El refresh token se elimina de la base de datos
- El access token existente sigue siendo válido hasta su expiración (24h)
- Se recomienda que el cliente elimine los tokens del almacenamiento local

---

## 👤 UsuarioController - Endpoints de Gestión de Usuarios

**Base Path:** `/api/v1/usuarios`  
**Autenticación:** Requerida (Bearer Token)

---

### 1. Obtener Usuario por ID

**Endpoint:** `GET /api/v1/usuarios/{id}`  
**Permisos:** ADMIN, GERENTE, SUPERVISOR o propio usuario  
**Descripción:** Obtiene información completa de un usuario específico.

#### Path Parameters

- `id` (UUID): ID del usuario

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Usuario obtenido exitosamente",
  "data": {
    "id": "uuid",
    "email": "string",
    "nombre": "string",
    "apellido": "string",
    "nombreCompleto": "string",
    "telefono": "string",
    "direccion": "string",
    "rol": {
      "id": "uuid",
      "name": "RoleName",
      "description": "string",
      "active": true
    },
    "status": "ACTIVE",
    "fleetType": "FleetType",
    "zoneId": "string",
    "lastLogin": "2026-02-07T10:30:00",
    "createdAt": "2026-02-07T10:30:00",
    "updatedAt": "2026-02-07T10:30:00"
  },
  "timestamp": "2026-02-07T10:30:00"
}
```

#### Códigos de Respuesta

- `200 OK`: Usuario encontrado
- `404 Not Found`: Usuario no existe
- `403 Forbidden`: Sin permisos para acceder

---

### 2. Obtener Usuario por Email

**Endpoint:** `GET /api/v1/usuarios/email/{email}`  
**Permisos:** ADMIN, GERENTE, SUPERVISOR  
**Descripción:** Busca un usuario por su dirección de correo electrónico.

#### Path Parameters

- `email` (String): Email del usuario

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Usuario obtenido exitosamente",
  "data": {
    // ... mismo formato que obtener por ID
  },
  "timestamp": "2026-02-07T10:30:00"
}
```

#### Códigos de Respuesta

- `200 OK`: Usuario encontrado
- `404 Not Found`: Usuario no existe
- `403 Forbidden`: Sin permisos

---

### 3. Listar Todos los Usuarios Activos

**Endpoint:** `GET /api/v1/usuarios`  
**Permisos:** ADMIN, GERENTE, SUPERVISOR  
**Descripción:** Retorna lista completa de usuarios con estado ACTIVE.

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Se encontraron 25 usuarios activos",
  "data": [
    {
      // ... UserResponseDto
    }
  ],
  "timestamp": "2026-02-07T10:30:00"
}
```

#### Códigos de Respuesta

- `200 OK`: Lista obtenida exitosamente
- `403 Forbidden`: Sin permisos

---

### 4. Obtener Usuarios por Rol

**Endpoint:** `GET /api/v1/usuarios/rol/{roleName}`  
**Permisos:** ADMIN, GERENTE, SUPERVISOR  
**Descripción:** Filtra usuarios por un rol específico.

#### Path Parameters

- `roleName` (RoleName): CLIENTE, REPARTIDOR, SUPERVISOR, GERENTE, ADMIN

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Se encontraron 10 usuarios con rol REPARTIDOR",
  "data": [
    {
      // ... UserResponseDto
    }
  ],
  "timestamp": "2026-02-07T10:30:00"
}
```

#### Códigos de Respuesta

- `200 OK`: Lista obtenida exitosamente
- `403 Forbidden`: Sin permisos

---

### 5. Obtener Usuarios por Zona

**Endpoint:** `GET /api/v1/usuarios/zona/{zoneId}`  
**Permisos:** ADMIN, GERENTE, SUPERVISOR  
**Descripción:** Obtiene todos los usuarios asignados a una zona específica.

#### Path Parameters

- `zoneId` (String): Identificador de la zona

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Se encontraron 8 usuarios en la zona",
  "data": [
    {
      // ... UserResponseDto
    }
  ],
  "timestamp": "2026-02-07T10:30:00"
}
```

#### Códigos de Respuesta

- `200 OK`: Lista obtenida exitosamente
- `403 Forbidden`: Sin permisos

---

### 6. Obtener Repartidores Disponibles

**Endpoint:** `GET /api/v1/usuarios/repartidores/disponibles`  
**Permisos:** ADMIN, GERENTE, SUPERVISOR  
**Descripción:** Filtra repartidores disponibles por zona y tipo de flota.

#### Query Parameters

- `zoneId` (String): ID de la zona - Requerido
- `fleetType` (FleetType): MOTORIZADO, VEHICULO_LIVIANO, CAMION - Requerido

#### Ejemplo

```
GET /api/v1/usuarios/repartidores/disponibles?zoneId=ZONA-001&fleetType=MOTORIZADO
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Se encontraron 5 repartidores disponibles",
  "data": [
    {
      "id": "uuid",
      "email": "repartidor@mail.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "rol": {
        "name": "REPARTIDOR"
      },
      "status": "ACTIVE",
      "fleetType": "MOTORIZADO",
      "zoneId": "ZONA-001"
      // ... otros campos
    }
  ],
  "timestamp": "2026-02-07T10:30:00"
}
```

#### Códigos de Respuesta

- `200 OK`: Lista obtenida exitosamente
- `400 Bad Request`: Parámetros faltantes o inválidos
- `403 Forbidden`: Sin permisos

---

### 7. Buscar Usuarios

**Endpoint:** `GET /api/v1/usuarios/buscar`  
**Permisos:** ADMIN, GERENTE, SUPERVISOR  
**Descripción:** Busca usuarios por nombre o apellido.

#### Query Parameters

- `searchTerm` (String): Término de búsqueda - Requerido

#### Ejemplo

```
GET /api/v1/usuarios/buscar?searchTerm=juan
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Se encontraron 3 usuarios",
  "data": [
    {
      // ... UserResponseDto
    }
  ],
  "timestamp": "2026-02-07T10:30:00"
}
```

#### Códigos de Respuesta

- `200 OK`: Búsqueda completada
- `403 Forbidden`: Sin permisos

---

### 8. Actualizar Usuario

**Endpoint:** `PUT /api/v1/usuarios/{id}`  
**Permisos:** ADMIN, GERENTE o propio usuario  
**Descripción:** Actualiza información de un usuario existente.

#### Path Parameters

- `id` (UUID): ID del usuario

#### Request Body (UpdateUserRequestDto)

```json
{
  "nombre": "string",           // Opcional, máximo 100 caracteres
  "apellido": "string",         // Opcional, máximo 100 caracteres
  "telefono": "string",         // Opcional, debe cumplir patrón
  "direccion": "string",        // Opcional, máximo 255 caracteres
  "status": "UserStatus",       // Opcional: ACTIVE, INACTIVE, BLOCKED, PENDING_VERIFICATION
  "fleetType": "FleetType",     // Opcional (solo para repartidores)
  "zoneId": "string"            // Opcional
}
```

**Nota:** Todos los campos son opcionales, solo se actualizan los campos enviados.

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Usuario actualizado exitosamente",
  "data": {
    // ... UserResponseDto con datos actualizados
  },
  "timestamp": "2026-02-07T10:30:00"
}
```

#### Códigos de Respuesta

- `200 OK`: Usuario actualizado exitosamente
- `404 Not Found`: Usuario no existe
- `403 Forbidden`: Sin permisos para actualizar
- `400 Bad Request`: Datos inválidos

---

### 9. Actualizar Estado de Usuario

**Endpoint:** `PATCH /api/v1/usuarios/{id}/estado`  
**Permisos:** ADMIN, GERENTE, SUPERVISOR  
**Descripción:** Cambia el estado de un usuario.

#### Path Parameters

- `id` (UUID): ID del usuario

#### Query Parameters

- `status` (UserStatus): ACTIVE, INACTIVE, BLOCKED, PENDING_VERIFICATION - Requerido

#### Ejemplo

```
PATCH /api/v1/usuarios/123e4567-e89b-12d3-a456-426614174000/estado?status=INACTIVE
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Estado del usuario actualizado exitosamente",
  "data": {
    // ... UserResponseDto con estado actualizado
  },
  "timestamp": "2026-02-07T10:30:00"
}
```

#### Códigos de Respuesta

- `200 OK`: Estado actualizado exitosamente
- `404 Not Found`: Usuario no existe
- `403 Forbidden`: Sin permisos
- `400 Bad Request`: Estado inválido

---

### 10. Eliminar Usuario

**Endpoint:** `DELETE /api/v1/usuarios/{id}`  
**Permisos:** ADMIN, GERENTE  
**Descripción:** Realiza eliminación lógica del usuario (soft delete).

#### Path Parameters

- `id` (UUID): ID del usuario

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente",
  "data": null,
  "timestamp": "2026-02-07T10:30:00"
}
```

#### Códigos de Respuesta

- `200 OK`: Usuario eliminado exitosamente
- `404 Not Found`: Usuario no existe
- `403 Forbidden`: Sin permisos

#### Nota Importante

- **Soft Delete**: No se elimina físicamente de la base de datos
- Se marca el registro con una fecha de eliminación
- Los datos siguen disponibles para auditoría
- El usuario no podrá autenticarse

---

### 11. Estadísticas de Usuarios por Rol

**Endpoint:** `GET /api/v1/usuarios/estadisticas/por-rol`  
**Permisos:** ADMIN, GERENTE  
**Descripción:** Retorna conteo de usuarios para cada rol del sistema.

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "CLIENTE": 150,
    "REPARTIDOR": 45,
    "SUPERVISOR": 12,
    "GERENTE": 5,
    "ADMIN": 2
  },
  "timestamp": "2026-02-07T10:30:00"
}
```

#### Códigos de Respuesta

- `200 OK`: Estadísticas obtenidas
- `403 Forbidden`: Sin permisos

---

## 📦 Modelos de Datos (DTOs)

### ApiResponseDto<T> - Respuesta Genérica

Estructura estándar para todas las respuestas de la API:

```typescript
{
  success: boolean,          // true = éxito, false = error
  message: string,           // Mensaje descriptivo
  data: T,                   // Datos de respuesta (tipo genérico)
  timestamp: LocalDateTime   // Fecha/hora de la respuesta
}
```

### UserResponseDto - Datos de Usuario

```typescript
{
  id: UUID,
  email: string,
  nombre: string,
  apellido: string,
  nombreCompleto: string,     // Concatenación de nombre + apellido
  telefono: string | null,
  direccion: string | null,
  rol: RolResponseDto,
  status: UserStatus,
  fleetType: FleetType | null,  // Solo para repartidores
  zoneId: string | null,
  lastLogin: LocalDateTime | null,
  createdAt: LocalDateTime,
  updatedAt: LocalDateTime
}
```

### RolResponseDto - Información de Rol

```typescript
{
  id: UUID,
  name: RoleName,
  description: string,
  active: boolean
}
```

### AuthResponseDto - Respuesta de Autenticación

```typescript
{
  accessToken: string,        // JWT token
  refreshToken: string,       // Token para renovación
  tokenType: string,          // "Bearer"
  expiresAt: LocalDateTime,   // Fecha de expiración del access token
  user: UserResponseDto,
  message: string
}
```

---

## 🔒 Seguridad y Autenticación

### Flujo de Autenticación

1. **Registro/Login**: Usuario recibe access token + refresh token
2. **Acceso a Recursos**: Cliente envía access token en header:
   ```
   Authorization: Bearer <access_token>
   ```
3. **Token Expirado**: Cliente usa refresh token para obtener nuevo access token
4. **Logout**: Cliente envía refresh token para revocarlo

### Filter de Autenticación

`JwtAuthenticationFilter` intercepta todas las peticiones (excepto endpoints públicos):

- Extrae el token del header `Authorization`
- Valida el token JWT
- Carga los detalles del usuario
- Establece el contexto de seguridad

### Endpoints Públicos (Sin Autenticación)

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `/api-docs/**`
- `/swagger-ui/**`

### Control de Acceso por Rol

Se utiliza `@PreAuthorize` para verificar permisos:

#### Ejemplos de Restricciones

```java
// Solo administradores y gerentes
@PreAuthorize("hasAnyRole('ADMIN', 'GERENTE')")

// Administrador, gerente, supervisor o propio usuario
@PreAuthorize("hasAnyRole('ADMIN', 'GERENTE', 'SUPERVISOR') or #id == authentication.principal.id")

// Solo administradores
@PreAuthorize("hasRole('ADMIN')")
```

---

## ⚙️ Configuración del Sistema

### Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | (valor de desarrollo) |
| `SPRING_DATASOURCE_URL` | URL de conexión a PostgreSQL | jdbc:postgresql://localhost:5432/logiflow_auth |
| `SPRING_DATASOURCE_USERNAME` | Usuario de base de datos | postgres |
| `SPRING_DATASOURCE_PASSWORD` | Contraseña de base de datos | admin123 |

### application.yaml - Configuración Principal

```yaml
server:
  port: 8081

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/logiflow_auth
    username: postgres
    password: admin123
  
  jpa:
    hibernate:
      ddl-auto: update        # Actualiza esquema automáticamente
    show-sql: true

jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000        # 24 horas en milisegundos
  refresh-expiration: 604800000  # 7 días en milisegundos
  issuer: logiflow-auth-service

application:
  security:
    allowed-origins: http://localhost:3000,http://localhost:4200
```

---

## 🔄 Componentes Adicionales

### DataInitializer

- **Propósito**: Inicializa datos básicos del sistema al arrancar
- **Funcionalidad**:
  - Crea roles predefinidos si no existen
  - Puede crear usuario administrador inicial
  - Se ejecuta al inicio de la aplicación

### TokenCleanupScheduler

- **Propósito**: Limpieza automática de tokens expirados
- **Funcionalidad**:
  - Tarea programada que se ejecuta periódicamente
  - Elimina refresh tokens expirados de la base de datos
  - Optimiza el rendimiento y libera espacio

### GlobalExceptionHandler

Maneja excepciones de forma centralizada y devuelve respuestas consistentes:

#### Excepciones Manejadas

| Excepción | Código HTTP | Uso |
|-----------|-------------|-----|
| `ResourceNotFoundException` | 404 | Recurso no encontrado |
| `UnauthorizedException` | 401 | Error de autenticación |
| `BadRequestException` | 400 | Solicitud inválida |
| `MethodArgumentNotValidException` | 400 | Error de validación de datos |
| `AccessDeniedException` | 403 | Sin permisos suficientes |

---

## 📊 Base de Datos

### Esquema Principal

#### Tabla: usuario

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| email | VARCHAR(255) | Email único |
| password | VARCHAR(255) | Contraseña encriptada (BCrypt) |
| nombre | VARCHAR(100) | Nombre del usuario |
| apellido | VARCHAR(100) | Apellido del usuario |
| telefono | VARCHAR(20) | Teléfono |
| direccion | VARCHAR(255) | Dirección |
| rol_id | UUID | FK a tabla rol |
| status | VARCHAR(30) | Estado del usuario |
| fleet_type | VARCHAR(30) | Tipo de flota (repartidores) |
| zone_id | VARCHAR(50) | Zona asignada |
| last_login | TIMESTAMP | Último inicio de sesión |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |
| deleted | BOOLEAN | Soft delete |

#### Tabla: rol

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| name | VARCHAR(50) | Nombre del rol (ENUM) |
| description | VARCHAR(255) | Descripción |
| active | BOOLEAN | Estado del rol |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

#### Tabla: refresh_token

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| token | VARCHAR(500) | Refresh token |
| usuario_id | UUID | FK a usuario |
| expires_at | TIMESTAMP | Fecha de expiración |
| ip_address | VARCHAR(50) | IP del cliente |
| user_agent | VARCHAR(255) | Navegador/dispositivo |
| created_at | TIMESTAMP | Fecha de creación |

---

## 🧪 Validaciones de Datos

### RegisterRequestDto

- **email**: Requerido, formato email válido
- **password**: Requerido, 8-100 caracteres
- **nombre**: Requerido, máximo 100 caracteres
- **apellido**: Requerido, máximo 100 caracteres
- **telefono**: Opcional, debe cumplir patrón regex
- **direccion**: Opcional, máximo 255 caracteres
- **roleName**: Requerido, debe ser un valor de RoleName
- **fleetType**: Opcional, requerido si rol = REPARTIDOR
- **zoneId**: Opcional

### LoginRequestDto

- **email**: Requerido, formato email válido
- **password**: Requerido, mínimo 8 caracteres

### UpdateUserRequestDto

- Todos los campos opcionales
- **telefono**: Si se envía, debe cumplir patrón
- **nombre/apellido**: Máximo 100 caracteres
- **direccion**: Máximo 255 caracteres

---

## 🌐 CORS Configuration

### Orígenes Permitidos

Configurado en `CorsConfig.java`:

- http://localhost:3000 (React/Next.js)
- http://localhost:4200 (Angular)

### Métodos HTTP Permitidos

- GET
- POST
- PUT
- PATCH
- DELETE
- OPTIONS

### Headers Permitidos

- Authorization
- Content-Type
- X-Requested-With

---

## 📖 Documentación API (Swagger)

### Acceso a Swagger UI

```
http://localhost:8081/swagger-ui.html
```

### OpenAPI Docs (JSON)

```
http://localhost:8081/api-docs
```

### Características

- Documentación interactiva de todos los endpoints
- Prueba de peticiones directamente desde el navegador
- Esquemas de request/response
- Códigos de respuesta y descripciones

---

## 🚀 Flujos de Uso Comunes

### Flujo 1: Registro e Inicio de Sesión

```
1. Cliente → POST /api/v1/auth/register (datos de usuario)
2. Sistema → Valida datos, crea usuario, asigna rol
3. Sistema → Genera access_token + refresh_token
4. Sistema ← Devuelve tokens + información de usuario
5. Cliente → Guarda tokens en storage (localStorage/sessionStorage)
```

### Flujo 2: Acceso a Recursos Protegidos

```
1. Cliente → GET/POST/PUT/DELETE /api/v1/usuarios/* 
   Header: Authorization: Bearer <access_token>
2. Sistema → Valida token JWT
3. Sistema → Verifica permisos del rol
4. Sistema → Procesa petición
5. Sistema ← Devuelve respuesta
```

### Flujo 3: Renovación de Token

```
1. Sistema ← 401 Unauthorized (access_token expirado)
2. Cliente → POST /api/v1/auth/refresh
   Body: { refreshToken: "..." }
3. Sistema → Valida refresh_token
4. Sistema → Genera nuevo access_token
5. Sistema ← Devuelve nuevo access_token
6. Cliente → Actualiza token en storage
7. Cliente → Re-intenta petición original con nuevo token
```

### Flujo 4: Cierre de Sesión

```
1. Cliente → POST /api/v1/auth/logout
   Body: { refreshToken: "..." }
2. Sistema → Elimina refresh_token de BD
3. Sistema ← Confirma cierre de sesión
4. Cliente → Elimina tokens del storage
5. Cliente → Redirige a página de login
```

---

## 🔍 Casos de Uso por Rol

### ADMIN (Administrador)

- Acceso completo a todos los endpoints
- Gestión de usuarios de cualquier rol
- Cambiar estados de usuarios
- Ver estadísticas completas
- Eliminar usuarios

### GERENTE

- Gestión de usuarios (excepto ADMIN)
- Ver todos los usuarios activos
- Actualizar información de usuarios
- Ver estadísticas
- Buscar y filtrar usuarios por zona/rol

### SUPERVISOR

- Ver usuarios de su zona
- Obtener repartidores disponibles
- Búsqueda de usuarios
- Actualizar estados de usuarios
- No puede eliminar usuarios

### REPARTIDOR

- Ver su propia información
- Actualizar sus propios datos
- Acceso limitado a endpoints

### CLIENTE

- Ver su propia información
- Actualizar sus propios datos
- Sin acceso a gestión de otros usuarios

---

## 🛡️ Buenas Prácticas de Seguridad Implementadas

1. **Contraseñas**: 
   - Encriptadas con BCrypt
   - Mínimo 8 caracteres

2. **Tokens JWT**:
   - Firmados con clave secreta
   - Expiración corta (24h) para access token
   - Refresh token almacenado en BD (puede revocarse)

3. **CORS**:
   - Orígenes permitidos explícitamente definidos
   - No permite acceso desde cualquier origen

4. **Validación**:
   - Validación estricta de datos de entrada
   - Mensajes de error descriptivos sin exponer información sensible

5. **Auditoría**:
   - Registro de IP y User-Agent en autenticación
   - Timestamps de creación y actualización
   - Soft delete para mantener historial

6. **Rate Limiting** (Recomendado agregar):
   - Limitar intentos de login
   - Protección contra fuerza bruta

---

## 📝 Notas para Desarrollo

### Consideraciones Importantes

1. **Zona Horaria**: Configurada en America/Guayaquil
2. **Formato de Fechas**: ISO 8601 (yyyy-MM-dd'T'HH:mm:ss)
3. **Base de Datos**: Hibernate actualiza esquema automáticamente (ddl-auto: update)
4. **Pool de Conexiones**: HikariCP con máximo 10 conexiones

### Logging

- **Nivel Root**: INFO
- **Nivel AuthService**: DEBUG
- **SQL Queries**: Visible en logs (modo desarrollo)
- **Security**: DEBUG para troubleshooting

### Dependencias Principales

```xml
- Spring Boot 4.0.0
- Spring Security
- Spring Data JPA
- PostgreSQL Driver
- JJWT 0.12.5
- MapStruct 1.5.5
- Lombok
- SpringDoc OpenAPI 2.7.0
- Bean Validation
```

---

## 🎯 Endpoints Públicos vs Protegidos

### Públicos (No requieren autenticación)

- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- POST /api/v1/auth/logout
- /swagger-ui/**
- /api-docs/**

### Protegidos (Requieren Bearer Token)

- Todos los endpoints de /api/v1/usuarios/**
- Se verifica autenticación y permisos por rol

---

## 🔄 Mappers (MapStruct)

### UsuarioMapper

Convierte entre entidades y DTOs:

- `Usuario` ↔ `UserResponseDto`
- `RegisterRequestDto` → `Usuario`

### RolMapper

Convierte entre entidades y DTOs:

- `Rol` ↔ `RolResponseDto`

**Ventajas de MapStruct**:
- Generación de código en tiempo de compilación
- Alto rendimiento (sin reflection)
- Type-safe

---

## 📈 Mejoras Futuras Sugeridas

1. **Rate Limiting**: Implementar límites de peticiones por IP
2. **Email Verification**: Verificación de email en registro
3. **Password Recovery**: Endpoint para recuperación de contraseña
4. **Two-Factor Authentication**: Agregar 2FA opcional
5. **OAuth2/Social Login**: Login con Google, Facebook, etc.
6. **Audit Logging**: Registro detallado de todas las acciones
7. **Redis Cache**: Cache de usuarios y roles frecuentemente accedidos
8. **Metrics**: Prometheus/Micrometer para métricas de la aplicación
9. **Circuit Breaker**: Resilience4j para llamadas a servicios externos
10. **API Versioning**: Manejo de múltiples versiones de la API

---

## 🆘 Manejo de Errores

### Estructura de Respuesta de Error

```json
{
  "success": false,
  "message": "Descripción del error",
  "data": null,
  "timestamp": "2026-02-07T10:30:00"
}
```

### Errores Comunes

| Código | Mensaje | Causa |
|--------|---------|-------|
| 400 | Bad Request | Datos inválidos o incompletos |
| 401 | Unauthorized | Token inválido o expirado |
| 403 | Forbidden | Sin permisos suficientes |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Email ya registrado |
| 500 | Internal Server Error | Error inesperado del servidor |

---

## 🎓 Glosario

- **Access Token**: Token JWT de corta duración para acceder a recursos
- **Refresh Token**: Token de larga duración para renovar access tokens
- **Bearer Authentication**: Esquema de autenticación usando tokens
- **Soft Delete**: Eliminación lógica (marcar como eliminado sin borrar)
- **DTO**: Data Transfer Object - Objeto para transferir datos
- **JWT**: JSON Web Token - Estándar para tokens de autenticación
- **BCrypt**: Algoritmo de hash para contraseñas
- **CORS**: Cross-Origin Resource Sharing - Política de acceso entre dominios
- **MapStruct**: Framework para mapeo de objetos
- **UUID**: Universally Unique Identifier - Identificador único universal

---

## 📞 Información de Contacto del Proyecto

**Proyecto**: LogiFlow - Sistema de Gestión Logística  
**Módulo**: Auth Service - Servicio de Autenticación  
**Curso**: Aplicaciones Distribuidas  
**Institución**: ESPE  

---

**Última Actualización**: 2026-02-07  
**Versión del Documento**: 1.0.0
