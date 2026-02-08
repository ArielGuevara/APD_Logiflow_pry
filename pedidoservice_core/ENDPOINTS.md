# Pedido Service - Endpoints Documentation

**Base Path:** `/api/v1/pedidos`  
**Puerto:** 8080  
**Total de Endpoints:** 5

---

## 📋 Índice

- [Gestión de Pedidos](#gestión-de-pedidos)
- [Enumeraciones](#enumeraciones)
- [Notas Importantes](#notas-importantes)

---

## 📦 Gestión de Pedidos

### 1. POST `/api/v1/pedidos`
Crea un nuevo pedido.

**Recibe:**
- **Headers:**
  - `X-User-Id: <UUID>` (inyectado por el Gateway, identifica al cliente)
- **Body:**
```json
{
  "direccionRecogida": "string (requerido)",
  "direccionEntrega": "string (requerido)",
  "tipoVehiculo": "MOTO|CARRO|CAMION (requerido)",
  "latitud": "number (opcional)",
  "longitud": "number (opcional)",
  "descripcionProducto": "string (requerido)",
  "pesoKg": "number (requerido, positivo)",
  "dimensiones": "string (opcional)",
  "valorDeclarado": "number (opcional, positivo)",
  "esFragil": "boolean (default: false)"
}
```

**Entrega:**
```json
{
  "id": "uuid",
  "clienteId": "uuid",
  "repartidorId": "uuid (puede ser null si aún no está asignado)",
  "direccionRecogida": "string",
  "direccionEntrega": "string",
  "tipoVehiculo": "MOTO|CARRO|CAMION",
  "estado": "PENDIENTE|EN_PROGRESO|ENTREGADO|CANCELADO",
  "costoEstimado": "number (decimal)",
  "descripcionProducto": "string",
  "pesoKg": "number",
  "esFragil": "boolean",
  "fechaCreacion": "datetime",
  "fechaActualizacion": "datetime"
}
```

**Códigos de Respuesta:**
- `201 Created`: Pedido creado exitosamente
- `400 Bad Request`: Datos inválidos

**Validaciones:**
- `direccionRecogida`: No puede estar en blanco
- `direccionEntrega`: No puede estar en blanco
- `tipoVehiculo`: Debe ser uno de los valores del enum
- `descripcionProducto`: No puede estar en blanco
- `pesoKg`: Debe ser mayor a 0 (validación `@Positive`)
- `valorDeclarado`: Si se proporciona, debe ser positivo

---

### 2. GET `/api/v1/pedidos/{id}`
Obtiene un pedido por su ID.

**Recibe:**
- **Path Parameter:** `id` (UUID del pedido)

**Entrega:**
```json
{
  "id": "uuid",
  "clienteId": "uuid",
  "repartidorId": "uuid",
  "direccionRecogida": "string",
  "direccionEntrega": "string",
  "tipoVehiculo": "MOTO|CARRO|CAMION",
  "estado": "PENDIENTE|EN_PROGRESO|ENTREGADO|CANCELADO",
  "costoEstimado": "number",
  "descripcionProducto": "string",
  "pesoKg": "number",
  "esFragil": "boolean",
  "fechaCreacion": "datetime",
  "fechaActualizacion": "datetime"
}
```

**Códigos de Respuesta:**
- `200 OK`: Pedido encontrado
- `404 Not Found`: Pedido no encontrado

---

### 3. GET `/api/v1/pedidos/mis-pedidos`
Lista todos los pedidos del cliente autenticado.

**Recibe:**
- **Headers:** `X-User-Id: <UUID>` (inyectado por el Gateway)

**Entrega:**
```json
[
  {
    "id": "uuid",
    "clienteId": "uuid",
    "repartidorId": "uuid",
    "direccionRecogida": "string",
    "direccionEntrega": "string",
    "tipoVehiculo": "MOTO|CARRO|CAMION",
    "estado": "PENDIENTE|EN_PROGRESO|ENTREGADO|CANCELADO",
    "costoEstimado": "number",
    "descripcionProducto": "string",
    "pesoKg": "number",
    "esFragil": "boolean",
    "fechaCreacion": "datetime",
    "fechaActualizacion": "datetime"
  }
]
```

**Códigos de Respuesta:**
- `200 OK`: Lista obtenida exitosamente

---

### 4. GET `/api/v1/pedidos`
Lista pedidos filtrados por estado.

**Recibe:**
- **Query Parameter:** `estado` (PENDIENTE|EN_PROGRESO|ENTREGADO|CANCELADO)

**Ejemplo de petición:**
```
GET /api/v1/pedidos?estado=PENDIENTE
```

**Entrega:**
```json
[
  {
    "id": "uuid",
    "clienteId": "uuid",
    "repartidorId": "uuid",
    "direccionRecogida": "string",
    "direccionEntrega": "string",
    "tipoVehiculo": "MOTO|CARRO|CAMION",
    "estado": "PENDIENTE",
    "costoEstimado": "number",
    "descripcionProducto": "string",
    "pesoKg": "number",
    "esFragil": "boolean",
    "fechaCreacion": "datetime",
    "fechaActualizacion": "datetime"
  }
]
```

**Códigos de Respuesta:**
- `200 OK`: Lista obtenida exitosamente

---

### 5. DELETE `/api/v1/pedidos/{id}`
Cancela un pedido.

**Recibe:**
- **Path Parameter:** `id` (UUID del pedido)
- **Headers:** `X-User-Id: <UUID>` (inyectado por el Gateway)

**Entrega:**
- Sin contenido (204 No Content)

**Códigos de Respuesta:**
- `204 No Content`: Pedido cancelado exitosamente
- `404 Not Found`: Pedido no encontrado
- `403 Forbidden`: Sin permisos para cancelar este pedido (no es el dueño)

**Nota:** Este endpoint verifica que el usuario autenticado sea el dueño del pedido antes de cancelarlo.

---

## 🔑 Enumeraciones

### EstadoPedido
- `PENDIENTE` - Pedido creado, esperando asignación
- `EN_PROGRESO` - Pedido asignado y en proceso de entrega
- `ENTREGADO` - Pedido entregado exitosamente
- `CANCELADO` - Pedido cancelado

### TipoVehiculo
- `MOTO` - Para entregas pequeñas y ágiles
- `CARRO` - Para entregas medianas
- `CAMION` - Para entregas grandes o pesadas

---

## 📝 Notas Importantes

### Header X-User-Id
Este servicio no maneja directamente JWT tokens. En su lugar, el **Kong Gateway** extrae el `userId` del token JWT y lo inyecta como header `X-User-Id` en cada petición.

**Flujo de autenticación:**
1. Cliente envía petición al Gateway con `Authorization: Bearer <token>`
2. Gateway valida el token
3. Gateway extrae el `userId` del token
4. Gateway reenvía la petición al servicio con header `X-User-Id: <uuid>`
5. El servicio usa este header para identificar al usuario

### Estructuras de Datos

**PedidoRequestDto** (entrada):
- Contiene datos del pedido y del producto anidados
- Validaciones con anotaciones Jakarta Validation

**PedidoResponseDto** (salida):
- Incluye todos los campos del pedido
- Incluye IDs de cliente y repartidor
- Incluye costo estimado calculado
- Incluye timestamps de creación y actualización

### Cálculo de Costo
El campo `costoEstimado` es calculado por el servicio basándose en:
- Tipo de vehículo requerido
- Peso del producto
- Distancia (si se proporcionan coordenadas)

---

## 💡 Casos de Uso

### 1. Cliente crea un pedido
```json
POST /api/v1/pedidos
Headers: X-User-Id: 123e4567-e89b-12d3-a456-426614174000

{
  "direccionRecogida": "Av. República 123, Quito",
  "direccionEntrega": "Av. 6 de Diciembre 456, Quito",
  "tipoVehiculo": "MOTO",
  "latitud": -0.1807,
  "longitud": -78.4678,
  "descripcionProducto": "Documentos importantes",
  "pesoKg": 0.5,
  "dimensiones": "30x20x5 cm",
  "valorDeclarado": 100.00,
  "esFragil": false
}
```

### 2. Cliente consulta sus pedidos
```
GET /api/v1/pedidos/mis-pedidos
Headers: X-User-Id: 123e4567-e89b-12d3-a456-426614174000
```

### 3. Administrador consulta pedidos pendientes
```
GET /api/v1/pedidos?estado=PENDIENTE
```

### 4. Cliente cancela su pedido
```
DELETE /api/v1/pedidos/987fcdeb-51a2-43f1-b456-426614174000
Headers: X-User-Id: 123e4567-e89b-12d3-a456-426614174000
```

---

## 🔗 Integración con otros servicios

Este servicio se integra con:
- **Auth Service**: Para validación de usuarios (vía Gateway)
- **Fleet Service**: Para asignación de repartidores y vehículos
- **Billing Service**: Para generación de facturas una vez entregado el pedido
