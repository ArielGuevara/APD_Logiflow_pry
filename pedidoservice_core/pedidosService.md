# Documentación del Servicio de Pedidos - LogiFlow

## Información General del Proyecto

**Nombre:** pedidoservice_core  
**Versión:** 0.0.1-SNAPSHOT  
**Framework:** Spring Boot 4.0.0  
**Java:** 21  
**Base de Datos:** PostgreSQL  
**Puerto:** 8080

### Propósito
Microservicio encargado de la gestión de pedidos de entrega en el sistema LogiFlow. Maneja la creación, consulta, listado y cancelación de pedidos de transporte con diferentes tipos de vehículos.

---

## Arquitectura del Proyecto

El proyecto sigue una arquitectura de capas estándar de Spring Boot:

```
src/main/java/com/logiflow/pedidoservice_core/
├── config/              # Configuración de seguridad y beans
├── controller/          # Controladores REST (capa de presentación)
├── dto/                 # Objetos de transferencia de datos
│   ├── mapper/          # Conversión entre entidades y DTOs
│   ├── request/         # DTOs de entrada
│   └── response/        # DTOs de salida
├── exception/           # Manejo de excepciones globales
├── model/               # Entidades JPA (capa de dominio)
│   └── enums/           # Enumeraciones
├── repository/          # Repositorios JPA (capa de datos)
├── service/             # Lógica de negocio
│   └── impl/            # Implementaciones de servicios
└── utils/               # Utilidades generales
```

### Stack Tecnológico
- **Spring Boot Starter Data JPA** - Persistencia de datos
- **Spring Boot Starter Security** - Seguridad (configurada para permitir todas las peticiones)
- **Spring Boot Starter Validation** - Validación de datos
- **Spring Boot Starter Web MVC** - API REST
- **PostgreSQL Driver** - Base de datos
- **Lombok** - Reducción de código boilerplate
- **Hibernate UUID Generator** - Generación de identificadores únicos

---

## API REST - Endpoints del Controlador

**Base Path:** `/api/v1/pedidos`

### 1. Crear Pedido

**Endpoint:** `POST /api/v1/pedidos`  
**Descripción:** Crea un nuevo pedido de entrega en el sistema.

#### Headers Requeridos:
```
X-User-Id: UUID del usuario que crea el pedido
Content-Type: application/json
```

#### Request Body (JSON):
```json
{
  "direccionRecogida": "string (obligatorio)",
  "direccionEntrega": "string (obligatorio)",
  "tipoVehiculo": "MOTO | LIVIANO | CAMION (obligatorio)",
  "latitud": "number (opcional)",
  "longitud": "number (opcional)",
  "descripcionProducto": "string (obligatorio)",
  "pesoKg": "number (obligatorio, > 0)",
  "dimensiones": "string (opcional)",
  "valorDeclarado": "BigDecimal (opcional, > 0)",
  "esFragil": "boolean"
}
```

#### Validaciones del Request:
- `direccionRecogida`: No puede estar en blanco
- `direccionEntrega`: No puede estar en blanco
- `tipoVehiculo`: No puede ser nulo, debe ser uno de los valores del enum
- `descripcionProducto`: No puede estar en blanco
- `pesoKg`: No puede ser nulo y debe ser mayor a 0
- `valorDeclarado`: Si se proporciona, debe ser positivo
- `esFragil`: Booleano (por defecto false)

#### Response:
**Status:** `201 CREATED`

```json
{
  "id": "UUID",
  "clienteId": "UUID",
  "repartidorId": "UUID (puede ser null)",
  "direccionRecogida": "string",
  "direccionEntrega": "string",
  "tipoVehiculo": "MOTO | LIVIANO | CAMION",
  "estado": "RECIBIDO | EN_RUTA | ENTREGADO | CANCELADO",
  "costoEstimado": "BigDecimal (puede ser null)",
  "descripcionProducto": "string",
  "pesoKg": "number",
  "esFragil": "boolean",
  "fechaCreacion": "ISO 8601 DateTime",
  "fechaActualizacion": "ISO 8601 DateTime"
}
```

---

### 2. Obtener Pedido por ID

**Endpoint:** `GET /api/v1/pedidos/{id}`  
**Descripción:** Recupera un pedido específico por su identificador único.

#### Path Parameters:
- `id`: UUID del pedido

#### Response:
**Status:** `200 OK`

```json
{
  "id": "UUID",
  "clienteId": "UUID",
  "repartidorId": "UUID (puede ser null)",
  "direccionRecogida": "string",
  "direccionEntrega": "string",
  "tipoVehiculo": "MOTO | LIVIANO | CAMION",
  "estado": "RECIBIDO | EN_RUTA | ENTREGADO | CANCELADO",
  "costoEstimado": "BigDecimal",
  "descripcionProducto": "string",
  "pesoKg": "number",
  "esFragil": "boolean",
  "fechaCreacion": "ISO 8601 DateTime",
  "fechaActualizacion": "ISO 8601 DateTime"
}
```

**Excepciones:**
- `404 NOT FOUND`: Si el pedido no existe o no está activo

---

### 3. Listar Mis Pedidos

**Endpoint:** `GET /api/v1/pedidos/mis-pedidos`  
**Descripción:** Obtiene todos los pedidos realizados por el usuario autenticado.

#### Headers Requeridos:
```
X-User-Id: UUID del usuario
```

#### Response:
**Status:** `200 OK`

```json
[
  {
    "id": "UUID",
    "clienteId": "UUID",
    "repartidorId": "UUID",
    "direccionRecogida": "string",
    "direccionEntrega": "string",
    "tipoVehiculo": "MOTO | LIVIANO | CAMION",
    "estado": "RECIBIDO | EN_RUTA | ENTREGADO | CANCELADO",
    "costoEstimado": "BigDecimal",
    "descripcionProducto": "string",
    "pesoKg": "number",
    "esFragil": "boolean",
    "fechaCreacion": "ISO 8601 DateTime",
    "fechaActualizacion": "ISO 8601 DateTime"
  }
]
```

**Nota:** Devuelve un array vacío si el usuario no tiene pedidos.

---

### 4. Listar Pedidos por Estado

**Endpoint:** `GET /api/v1/pedidos?estado={estado}`  
**Descripción:** Filtra y obtiene todos los pedidos con un estado específico.

#### Query Parameters:
- `estado`: RECIBIDO | EN_RUTA | ENTREGADO | CANCELADO (obligatorio)

#### Response:
**Status:** `200 OK`

```json
[
  {
    "id": "UUID",
    "clienteId": "UUID",
    "repartidorId": "UUID",
    "direccionRecogida": "string",
    "direccionEntrega": "string",
    "tipoVehiculo": "MOTO | LIVIANO | CAMION",
    "estado": "RECIBIDO | EN_RUTA | ENTREGADO | CANCELADO",
    "costoEstimado": "BigDecimal",
    "descripcionProducto": "string",
    "pesoKg": "number",
    "esFragil": "boolean",
    "fechaCreacion": "ISO 8601 DateTime",
    "fechaActualizacion": "ISO 8601 DateTime"
  }
]
```

---

### 5. Cancelar Pedido

**Endpoint:** `DELETE /api/v1/pedidos/{id}`  
**Descripción:** Cancela un pedido existente (cancelación lógica, no elimina el registro).

#### Path Parameters:
- `id`: UUID del pedido a cancelar

#### Headers Requeridos:
```
X-User-Id: UUID del usuario que solicita la cancelación
```

#### Response:
**Status:** `204 NO CONTENT`

**Nota:** No devuelve contenido en el body. La cancelación es lógica, marcando el estado como `CANCELADO` y `activo = false`.

**Excepciones:**
- `404 NOT FOUND`: Si el pedido no existe
- `403 FORBIDDEN`: Si el usuario no es el propietario del pedido (según lógica de negocio)

---

## Modelos de Datos

### Entidad Principal: Pedido

**Tabla:** `pedidos`

```java
{
  "id": "UUID (PK, auto-generado)",
  "clienteId": "UUID (obligatorio)",
  "repartidorId": "UUID (nullable)",
  "direccionRecogida": "String (obligatorio)",
  "direccionEntrega": "String (obligatorio)",
  "latitud": "Double (opcional)",
  "longitud": "Double (opcional)",
  "detalleProducto": "DetalleProducto (embedded)",
  "tipoVehiculo": "TipoVehiculo enum (obligatorio)",
  "estado": "EstadoPedido enum (obligatorio, default: RECIBIDO)",
  "costoEstimado": "BigDecimal (opcional)",
  "activo": "boolean (default: true)",
  "fechaCreacion": "LocalDateTime (auto-generado)",
  "fechaActualizacion": "LocalDateTime (auto-actualizado)"
}
```

#### Ciclo de Vida:
- `@PrePersist`: Establece fechas de creación/actualización y estado inicial (RECIBIDO)
- `@PreUpdate`: Actualiza la fecha de modificación automáticamente

---

### Objeto Embebido: DetalleProducto

**Tipo:** `@Embeddable` (integrado en la tabla pedidos)

```java
{
  "descripcion": "String",
  "pesoKg": "Double",
  "dimensiones": "String",
  "valorDeclarado": "BigDecimal",
  "esFragil": "boolean"
}
```

---

## Enumeraciones

### EstadoPedido
Define los estados posibles de un pedido en el flujo de entrega:

```java
enum EstadoPedido {
  RECIBIDO,    // Estado inicial al crear el pedido
  EN_RUTA,     // Pedido asignado a repartidor y en tránsito
  ENTREGADO,   // Pedido entregado exitosamente
  CANCELADO    // Pedido cancelado por el cliente
}
```

### TipoVehiculo
Define los tipos de vehículos disponibles para entregas:

```java
enum TipoVehiculo {
  MOTO,        // Entregas urbanas rápidas
  LIVIANO,     // Entregas intermunicipales
  CAMION       // Entregas de carga pesada
}
```

---

## DTOs (Data Transfer Objects)

### PedidoRequestDto
**Uso:** Entrada de datos para crear un pedido

**Validaciones:**
- Bean Validation con anotaciones Jakarta
- Todos los campos obligatorios se validan automáticamente
- El controller usa `@Valid` para activar validaciones

**Estructura:**
```java
{
  "direccionRecogida": "@NotBlank",
  "direccionEntrega": "@NotBlank",
  "tipoVehiculo": "@NotNull",
  "latitud": "Double (optional)",
  "longitud": "Double (optional)",
  "descripcionProducto": "@NotBlank",
  "pesoKg": "@NotNull @Positive",
  "dimensiones": "String (optional)",
  "valorDeclarado": "@Positive (si se proporciona)",
  "esFragil": "boolean"
}
```

### PedidoResponseDto
**Uso:** Salida de datos en las respuestas de la API

**Patrón:** Builder de Lombok para construcción fluida

**Estructura:**
```java
{
  "id": "UUID",
  "clienteId": "UUID",
  "repartidorId": "UUID",
  "direccionRecogida": "String",
  "direccionEntrega": "String",
  "tipoVehiculo": "TipoVehiculo",
  "estado": "EstadoPedido",
  "costoEstimado": "BigDecimal",
  "descripcionProducto": "String",
  "pesoKg": "Double",
  "esFragil": "boolean",
  "fechaCreacion": "LocalDateTime",
  "fechaActualizacion": "LocalDateTime"
}
```

---

## Capa de Servicio

### PedidoService (Interface)

Define el contrato de las operaciones de negocio:

```java
interface PedidoService {
  PedidoResponseDto crearPedido(PedidoRequestDto request, UUID clienteId);
  PedidoResponseDto obtenerPorId(UUID id);
  List<PedidoResponseDto> listarPorCliente(UUID clienteId);
  List<PedidoResponseDto> listarPorEstado(EstadoPedido estado);
  void cancelarPedido(UUID id, UUID clienteId);
}
```

### Lógica de Negocio
- **Creación:** Mapea el DTO a entidad, asigna el clienteId del header, establece estado inicial
- **Obtención:** Busca por ID y lanza excepción si no existe o está inactivo
- **Listado por Cliente:** Filtra pedidos activos del usuario específico
- **Listado por Estado:** Filtra todos los pedidos activos con un estado dado
- **Cancelación:** Verifica propiedad del pedido, cambia estado a CANCELADO y marca activo=false

---

## Manejo de Excepciones

### GlobalExceptionHandler
Intercepta y maneja excepciones a nivel global para respuestas consistentes.

### ResourceNotFoundException
Excepción personalizada para recursos no encontrados (pedidos inexistentes).

**Response típico:**
```json
{
  "timestamp": "ISO 8601 DateTime",
  "status": 404,
  "error": "Not Found",
  "message": "Pedido no encontrado con ID: {id}",
  "path": "/api/v1/pedidos/{id}"
}
```

---

## Configuración de Base de Datos

**PostgreSQL Configuration (application.yaml):**

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/logiflow_pedidos
    username: postgres
    password: admin123
  jpa:
    hibernate:
      ddl-auto: update  # Auto-crea/actualiza el esquema
    show-sql: true      # Muestra queries SQL en logs
```

**Base de Datos:** logiflow_pedidos  
**Estrategia:** Hibernate actualiza el esquema automáticamente

---

## Seguridad

### SecurityConfig
- **Configuración actual:** Permite todas las peticiones (`.permitAll()`)
- **Autenticación:** Se espera que un API Gateway maneje la autenticación JWT
- **Header de Usuario:** El Gateway inyecta `X-User-Id` con el ID del usuario autenticado
- **Sin filtros de seguridad internos** (delegados al Gateway)

---

## Flujo de Datos Típico

### 1. Creación de Pedido
```
Cliente (via Gateway) 
  → POST /api/v1/pedidos + Header X-User-Id
  → PedidoController.crearPedido()
  → Validación de DTOs (@Valid)
  → PedidoService.crearPedido()
  → PedidoMapper (DTO → Entity)
  → PedidoRepository.save()
  → PostgreSQL (tabla pedidos)
  → PedidoMapper (Entity → ResponseDTO)
  → Response 201 CREATED con PedidoResponseDto
```

### 2. Consulta de Pedidos
```
Cliente (via Gateway)
  → GET /api/v1/pedidos/mis-pedidos + Header X-User-Id
  → PedidoController.listarMisPedidos()
  → PedidoService.listarPorCliente(userId)
  → PedidoRepository.findByClienteIdAndActivoTrue(userId)
  → PostgreSQL Query
  → Stream/List de Entidades
  → Mapping a ResponseDTOs
  → Response 200 OK con List<PedidoResponseDto>
```

### 3. Cancelación
```
Cliente (via Gateway)
  → DELETE /api/v1/pedidos/{id} + Header X-User-Id
  → PedidoController.cancelarPedido()
  → PedidoService.cancelarPedido(id, userId)
  → Verificación de propiedad (clienteId == userId)
  → Actualización: estado = CANCELADO, activo = false
  → PedidoRepository.save()
  → Response 204 NO CONTENT
```

---

## Integraciones Previstas

El servicio está preparado para integraciones con:

1. **API Gateway**: Maneja autenticación JWT y enruta peticiones
2. **BillingService**: Calculará costos estimados de envío
3. **FleetService**: Asignará repartidores según tipo de vehículo
4. **NotificationService**: Enviará notificaciones de cambio de estado

**Header clave:** `X-User-Id` (propagado desde el Gateway tras validar JWT)

---

## Notas Importantes para IA

### Patrones de Diseño
- **Repository Pattern**: Separación de lógica de acceso a datos
- **DTO Pattern**: Separación entre capa de presentación y dominio
- **Service Layer**: Encapsulación de lógica de negocio
- **Builder Pattern**: Construcción de objetos complejos (Lombok @Builder)

### Convenciones
- UUIDs para identificadores (gen_random_uuid() en PostgreSQL)
- LocalDateTime para timestamps (zona horaria del servidor)
- Enums en String para legibilidad en BD
- Cancelación lógica (flag `activo`)
- Validaciones declarativas (Jakarta Bean Validation)

### Casos de Uso Principales
1. Un cliente crea un pedido especificando origen, destino y detalles del producto
2. El sistema asigna ID único, establece estado inicial (RECIBIDO) y calcula costo
3. Los clientes consultan sus propios pedidos
4. Administradores/servicios externos filtran por estado
5. El cliente puede cancelar pedidos antes de entrega

### Limitaciones Actuales
- No hay autenticación interna (depende del Gateway)
- No hay cálculo real de costos (campo preparado para integración)
- No hay asignación automática de repartidores
- No hay validación de cobertura geográfica (campos lat/lon presentes pero no usados)

---

## Ejemplos de Peticiones

### Crear Pedido - Moto
```bash
curl -X POST http://localhost:8080/api/v1/pedidos \
  -H "X-User-Id: 123e4567-e89b-12d3-a456-426614174000" \
  -H "Content-Type: application/json" \
  -d '{
    "direccionRecogida": "Av. Principal 123, Quito",
    "direccionEntrega": "Calle Secundaria 456, Quito",
    "tipoVehiculo": "MOTO",
    "descripcionProducto": "Documentos importantes",
    "pesoKg": 0.5,
    "esFragil": false
  }'
```

### Obtener Mis Pedidos
```bash
curl -X GET http://localhost:8080/api/v1/pedidos/mis-pedidos \
  -H "X-User-Id: 123e4567-e89b-12d3-a456-426614174000"
```

### Listar por Estado
```bash
curl -X GET "http://localhost:8080/api/v1/pedidos?estado=EN_RUTA"
```

### Cancelar Pedido
```bash
curl -X DELETE http://localhost:8080/api/v1/pedidos/987fbc97-4bed-5078-9f07-9141ba07c9f3 \
  -H "X-User-Id: 123e4567-e89b-12d3-a456-426614174000"
```

---

## Conclusión

Este microservicio es el núcleo del sistema de gestión de pedidos de LogiFlow. Proporciona una API REST completa para:
- Crear pedidos con validaciones robustas
- Consultar pedidos por ID, cliente o estado
- Cancelar pedidos de forma segura

La arquitectura está diseñada para ser escalable y fácilmente integrable con otros microservicios del ecosistema LogiFlow.
