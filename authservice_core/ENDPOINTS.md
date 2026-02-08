# Auth Service - Endpoints Documentation

**Base Path:** `/api/v1/auth` y `/api/v1/usuarios`  
**Puerto:** 8081  
**Total de Endpoints:** 15

---

## 📋 Índice

- [Autenticación (AuthController)](#autenticación-authcontroller)
- [Gestión de Usuarios (UsuarioController)](#gestión-de-usuarios-usuariocontroller)

---

## 🔐 Autenticación (AuthController)

Base Path: `/api/v1/auth`

### 1. POST `/api/v1/auth/register`
Registra un nuevo usuario en el sistema.

**Recibe:**
```json
{
  "email": "string (requerido, formato email)",
  "password": "string (requerido, mínimo 8 caracteres)",
  "nombre": "string (requerido, máximo 100 caracteres)",
  "apellido": "string (requerido, máximo 100 caracteres)",
  "telefono": "string (opcional, patrón específico)",
  "direccion": "string (opcional, máximo 255 caracteres)",
  "roleName": "enum (requerido: CLIENTE, REPARTIDOR, SUPERVISOR, GERENTE, ADMIN)",
  "fleetType": "enum (opcional: MOTO, CARRO, CAMION)",
  "zoneId": "string (opcional)"
}
```

**Entrega:**
```json
{
  "success": true,
  "data": {
    "accessToken": "string (JWT token)",
    "refreshToken": "string (JWT refresh token)",
    "tokenType": "Bearer",
    "expiresAt": "2024-12-31T23:59:59",
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
        "name": "string",
        "description": "string"
      },
      "status": "ACTIVE|INACTIVE|SUSPENDED",
      "fleetType": "MOTO|CARRO|CAMION",
      "zoneId": "string",
      "lastLogin": "datetime",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    },
    "message": "string"
  },
  "message": "string"
}
```

**Códigos de Respuesta:**
- `201 Created`: Usuario registrado exitosamente
- `400 Bad Request`: Datos inválidos o email ya registrado

**Autenticación:** ❌ No requerida (endpoint público)

---

### 2. POST `/api/v1/auth/login`
Autentica a un usuario y devuelve tokens de acceso.

**Recibe:**
```json
{
  "email": "string (requerido, formato email)",
  "password": "string (requerido, mínimo 8 caracteres)"
}
```

**Entrega:**
```json
{
  "success": true,
  "data": {
    "accessToken": "string (JWT token)",
    "refreshToken": "string (JWT refresh token)",
    "tokenType": "Bearer",
    "expiresAt": "2024-12-31T23:59:59",
    "user": {
      "id": "uuid",
      "email": "string",
      "nombre": "string",
      "apellido": "string",
      "nombreCompleto": "string",
      "telefono": "string",
      "direccion": "string",
      "rol": { /* RolResponseDto */ },
      "status": "ACTIVE|INACTIVE|SUSPENDED",
      "fleetType": "MOTO|CARRO|CAMION",
      "zoneId": "string",
      "lastLogin": "datetime",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    },
    "message": "string"
  },
  "message": "string"
}
```

**Códigos de Respuesta:**
- `200 OK`: Login exitoso
- `401 Unauthorized`: Credenciales inválidas

**Autenticación:** ❌ No requerida (endpoint público)

---

### 3. POST `/api/v1/auth/refresh`
Genera un nuevo access token usando un refresh token válido.

**Recibe:**
```json
{
  "refreshToken": "string (requerido)"
}
```

**Entrega:**
```json
{
  "success": true,
  "data": {
    "accessToken": "string (nuevo JWT token)",
    "refreshToken": "string (nuevo refresh token)",
    "tokenType": "Bearer",
    "expiresAt": "datetime",
    "user": { /* UserResponseDto */ },
    "message": "string"
  },
  "message": "string"
}
```

**Códigos de Respuesta:**
- `200 OK`: Token renovado exitosamente
- `401 Unauthorized`: Refresh token inválido o expirado

**Autenticación:** ❌ No requerida directamente (usa refresh token)

---

### 4. POST `/api/v1/auth/logout`
Revoca el refresh token del usuario y cierra su sesión.

**Recibe:**
```json
{
  "refreshToken": "string (requerido)"
}
```

**Entrega:**
```json
{
  "success": true,
  "data": null,
  "message": "Sesión cerrada exitosamente"
}
```

**Códigos de Respuesta:**
- `200 OK`: Sesión cerrada exitosamente
- `401 Unauthorized`: Token inválido

**Autenticación:** ❌ No requerida directamente (usa refresh token)

---

## 👥 Gestión de Usuarios (UsuarioController)

Base Path: `/api/v1/usuarios`

**Autenticación requerida:** ✅ Bearer Token en header `Authorization: Bearer <token>`

---

### 5. GET `/api/v1/usuarios/{id}`
Obtiene un usuario por su ID.

**Recibe:**
- **Path Parameter:** `id` (UUID del usuario)
- **Headers:** `Authorization: Bearer <token>`

**Entrega:**
```json
{
  "success": true,
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
      "name": "CLIENTE|REPARTIDOR|SUPERVISOR|GERENTE|ADMIN",
      "description": "string"
    },
    "status": "ACTIVE|INACTIVE|SUSPENDED",
    "fleetType": "MOTO|CARRO|CAMION",
    "zoneId": "string",
    "lastLogin": "datetime",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  },
  "message": "Usuario obtenido exitosamente"
}
```

**Permisos:** ADMIN, GERENTE, SUPERVISOR o el mismo usuario  
**Códigos de Respuesta:**
- `200 OK`: Usuario encontrado
- `404 Not Found`: Usuario no encontrado
- `403 Forbidden`: Sin permisos

---

### 6. GET `/api/v1/usuarios/email/{email}`
Busca un usuario por su email.

**Recibe:**
- **Path Parameter:** `email` (string)
- **Headers:** `Authorization: Bearer <token>`

**Entrega:**
```json
{
  "success": true,
  "data": {
    /* UserResponseDto */
  },
  "message": "Usuario obtenido exitosamente"
}
```

**Permisos:** ADMIN, GERENTE, SUPERVISOR  
**Códigos de Respuesta:**
- `200 OK`: Usuario encontrado
- `404 Not Found`: Usuario no encontrado

---

### 7. GET `/api/v1/usuarios`
Lista todos los usuarios activos.

**Recibe:**
- **Headers:** `Authorization: Bearer <token>`

**Entrega:**
```json
{
  "success": true,
  "data": [
    { /* UserResponseDto */ },
    { /* UserResponseDto */ }
  ],
  "message": "Se encontraron X usuarios activos"
}
```

**Permisos:** ADMIN, GERENTE, SUPERVISOR  
**Códigos de Respuesta:**
- `200 OK`: Lista obtenida exitosamente

---

### 8. GET `/api/v1/usuarios/rol/{roleName}`
Obtiene usuarios por rol.

**Recibe:**
- **Path Parameter:** `roleName` (CLIENTE|REPARTIDOR|SUPERVISOR|GERENTE|ADMIN)
- **Headers:** `Authorization: Bearer <token>`

**Entrega:**
```json
{
  "success": true,
  "data": [
    { /* UserResponseDto */ }
  ],
  "message": "Se encontraron X usuarios con rol {roleName}"
}
```

**Permisos:** ADMIN, GERENTE, SUPERVISOR  
**Códigos de Respuesta:**
- `200 OK`: Lista obtenida exitosamente

---

### 9. GET `/api/v1/usuarios/zona/{zoneId}`
Obtiene usuarios por zona.

**Recibe:**
- **Path Parameter:** `zoneId` (string)
- **Headers:** `Authorization: Bearer <token>`

**Entrega:**
```json
{
  "success": true,
  "data": [
    { /* UserResponseDto */ }
  ],
  "message": "Se encontraron X usuarios en la zona"
}
```

**Permisos:** ADMIN, GERENTE, SUPERVISOR  
**Códigos de Respuesta:**
- `200 OK`: Lista obtenida exitosamente

---

### 10. GET `/api/v1/usuarios/repartidores/disponibles`
Obtiene repartidores disponibles por zona y tipo de flota.

**Recibe:**
- **Query Parameters:**
  - `zoneId` (string, requerido)
  - `fleetType` (MOTO|CARRO|CAMION, requerido)
- **Headers:** `Authorization: Bearer <token>`

**Entrega:**
```json
{
  "success": true,
  "data": [
    { /* UserResponseDto */ }
  ],
  "message": "Se encontraron X repartidores disponibles"
}
```

**Permisos:** ADMIN, GERENTE, SUPERVISOR  
**Códigos de Respuesta:**
- `200 OK`: Lista obtenida exitosamente

---

### 11. GET `/api/v1/usuarios/buscar`
Busca usuarios por nombre o apellido.

**Recibe:**
- **Query Parameter:** `searchTerm` (string)
- **Headers:** `Authorization: Bearer <token>`

**Entrega:**
```json
{
  "success": true,
  "data": [
    { /* UserResponseDto */ }
  ],
  "message": "Se encontraron X usuarios"
}
```

**Permisos:** ADMIN, GERENTE, SUPERVISOR  
**Códigos de Respuesta:**
- `200 OK`: Búsqueda completada

---

### 12. PUT `/api/v1/usuarios/{id}`
Actualiza la información de un usuario.

**Recibe:**
- **Path Parameter:** `id` (UUID del usuario)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "nombre": "string (opcional, máximo 100 caracteres)",
  "apellido": "string (opcional, máximo 100 caracteres)",
  "telefono": "string (opcional)",
  "direccion": "string (opcional, máximo 255 caracteres)",
  "status": "ACTIVE|INACTIVE|SUSPENDED (opcional)",
  "fleetType": "MOTO|CARRO|CAMION (opcional)",
  "zoneId": "string (opcional)"
}
```

**Entrega:**
```json
{
  "success": true,
  "data": {
    /* UserResponseDto actualizado */
  },
  "message": "Usuario actualizado exitosamente"
}
```

**Permisos:** ADMIN, GERENTE o el mismo usuario  
**Códigos de Respuesta:**
- `200 OK`: Usuario actualizado
- `404 Not Found`: Usuario no encontrado
- `403 Forbidden`: Sin permisos

---

### 13. PATCH `/api/v1/usuarios/{id}/estado`
Actualiza el estado de un usuario.

**Recibe:**
- **Path Parameter:** `id` (UUID del usuario)
- **Query Parameter:** `status` (ACTIVE|INACTIVE|SUSPENDED)
- **Headers:** `Authorization: Bearer <token>`

**Entrega:**
```json
{
  "success": true,
  "data": {
    /* UserResponseDto actualizado */
  },
  "message": "Estado del usuario actualizado exitosamente"
}
```

**Permisos:** ADMIN, GERENTE, SUPERVISOR  
**Códigos de Respuesta:**
- `200 OK`: Estado actualizado
- `404 Not Found`: Usuario no encontrado

---

### 14. DELETE `/api/v1/usuarios/{id}`
Elimina un usuario (soft delete).

**Recibe:**
- **Path Parameter:** `id` (UUID del usuario)
- **Headers:** `Authorization: Bearer <token>`

**Entrega:**
```json
{
  "success": true,
  "data": null,
  "message": "Usuario eliminado exitosamente"
}
```

**Permisos:** ADMIN, GERENTE  
**Códigos de Respuesta:**
- `200 OK`: Usuario eliminado
- `404 Not Found`: Usuario no encontrado

---

### 15. GET `/api/v1/usuarios/estadisticas/por-rol`
Obtiene estadísticas de usuarios por rol.

**Recibe:**
- **Headers:** `Authorization: Bearer <token>`

**Entrega:**
```json
{
  "success": true,
  "data": {
    "CLIENTE": 150,
    "REPARTIDOR": 45,
    "SUPERVISOR": 8,
    "GERENTE": 3,
    "ADMIN": 1
  },
  "message": "Estadísticas obtenidas exitosamente"
}
```

**Permisos:** ADMIN, GERENTE  
**Códigos de Respuesta:**
- `200 OK`: Estadísticas obtenidas

---

## 🔑 Enumeraciones

### RoleName
- `CLIENTE`
- `REPARTIDOR`
- `SUPERVISOR`
- `GERENTE`
- `ADMIN`

### UserStatus
- `ACTIVE`
- `INACTIVE`
- `SUSPENDED`

### FleetType
- `MOTO`
- `CARRO`
- `CAMION`

---

## 📝 Notas

- **Endpoints públicos:** `/register` y `/login`
- **Formato de fecha:** `yyyy-MM-dd'T'HH:mm:ss`
- **Validaciones:**
  - Email: formato válido
  - Password: mínimo 8 caracteres
  - Nombre/Apellido: máximo 100 caracteres
  - Dirección: máximo 255 caracteres
