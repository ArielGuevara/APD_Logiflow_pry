# Billing Service - Documentación Técnica

## Información General del Proyecto

**Nombre:** billing-service  
**Puerto:** 8084  
**Base de Datos:** PostgreSQL (logiflow_billing)  
**Framework:** Spring Boot  
**Arquitectura:** REST API  

---

## Estructura del Proyecto

```
billing-service/
├── src/main/java/espe/edu/ec/billing_service/
│   ├── BillingServiceApplication.java       # Clase principal de Spring Boot
│   ├── controller/
│   │   └── BillingController.java           # Controlador REST con endpoints
│   ├── model/
│   │   ├── Billing.java                     # Entidad JPA de Factura
│   │   └── EstadoType.java                  # Enum de estados de factura
│   ├── repository/
│   │   └── BillingRepository.java           # Repositorio JPA para persistencia
│   └── service/
│       └── BillingService.java              # Lógica de negocio
├── src/main/resources/
│   └── application.yaml                     # Configuración de la aplicación
└── pom.xml                                  # Dependencias Maven
```

### Patrón de Arquitectura
El proyecto sigue una **arquitectura en capas** tradicional:
- **Controller Layer:** Maneja las peticiones HTTP
- **Service Layer:** Contiene la lógica de negocio
- **Repository Layer:** Gestiona la persistencia de datos
- **Model Layer:** Define las entidades del dominio

---

## Modelo de Datos

### Entidad: Billing (Factura)

**Tabla en BD:** `facturas`

| Campo | Tipo | Descripción | Validaciones |
|-------|------|-------------|--------------|
| `id` | UUID | Identificador único generado automáticamente | Primary Key, auto-generado |
| `pedidoId` | UUID | Identificador del pedido asociado | NOT NULL, requerido |
| `clienteId` | UUID | Identificador del cliente | NOT NULL, requerido |
| `subtotal` | BigDecimal | Subtotal antes de impuestos | NOT NULL, requerido |
| `impuestos` | BigDecimal | Monto de impuestos calculado (15%) | Calculado automáticamente |
| `total` | BigDecimal | Total de la factura (subtotal + impuestos) | Calculado automáticamente |
| `fechaEmision` | LocalDateTime | Fecha y hora de emisión | Auto-generada en creación |
| `estado` | EstadoType (ENUM) | Estado actual de la factura | Valores: BORRADOR, PAGADA, ANULADA |

**Comportamiento @PrePersist:**
- `fechaEmision` se establece automáticamente con la fecha/hora actual
- Si `estado` es null, se asigna `BORRADOR` por defecto

### Enum: EstadoType

Estados posibles de una factura:
- **BORRADOR:** Factura creada pero no confirmada
- **PAGADA:** Factura que ha sido pagada
- **ANULADA:** Factura cancelada/anulada

---

## Endpoints del API

**Base URL:** `/api/v1/billing`

### 1. Crear Factura

**Endpoint:** `POST /api/v1/billing/facturas`

**Descripción:** Crea una nueva factura calculando automáticamente impuestos y total.

**Request Body:**
```json
{
  "pedidoId": "uuid-del-pedido",
  "clienteId": "uuid-del-cliente",
  "subtotal": 100.00
}
```

**Campos Requeridos en Request:**
- `pedidoId` (UUID): ID del pedido relacionado
- `clienteId` (UUID): ID del cliente
- `subtotal` (BigDecimal): Monto antes de impuestos

**Response Body (200 OK):**
```json
{
  "id": "uuid-generado",
  "pedidoId": "uuid-del-pedido",
  "clienteId": "uuid-del-cliente",
  "subtotal": 100.00,
  "impuestos": 15.00,
  "total": 115.00,
  "fechaEmision": "2026-02-07T10:30:00",
  "estado": "BORRADOR"
}
```

**Lógica de Negocio:**
1. Recibe el subtotal del cliente
2. Calcula impuestos: `subtotal * 0.15` (15%)
3. Calcula total: `subtotal + impuestos`
4. Establece estado inicial: `BORRADOR`
5. Genera UUID automáticamente
6. Establece fecha de emisión actual
7. Persiste en base de datos
8. Retorna la factura completa

**Código HTTP:** 200 OK

---

### 2. Listar Todas las Facturas

**Endpoint:** `GET /api/v1/billing/facturas`

**Descripción:** Recupera todas las facturas almacenadas en el sistema.

**Request:** No requiere parámetros ni body

**Response Body (200 OK):**
```json
[
  {
    "id": "uuid-1",
    "pedidoId": "uuid-pedido-1",
    "clienteId": "uuid-cliente-1",
    "subtotal": 100.00,
    "impuestos": 15.00,
    "total": 115.00,
    "fechaEmision": "2026-02-07T10:30:00",
    "estado": "BORRADOR"
  },
  {
    "id": "uuid-2",
    "pedidoId": "uuid-pedido-2",
    "clienteId": "uuid-cliente-2",
    "subtotal": 200.00,
    "impuestos": 30.00,
    "total": 230.00,
    "fechaEmision": "2026-02-07T11:00:00",
    "estado": "PAGADA"
  }
]
```

**Lógica de Negocio:**
1. Consulta todas las facturas en la base de datos
2. Retorna la lista completa (puede estar vacía)

**Código HTTP:** 200 OK

---

### 3. Buscar Factura por ID

**Endpoint:** `GET /api/v1/billing/facturas/{id}`

**Descripción:** Busca y retorna una factura específica por su ID.

**Parámetros de Path:**
- `id` (UUID): Identificador único de la factura

**Ejemplo:** `GET /api/v1/billing/facturas/123e4567-e89b-12d3-a456-426614174000`

**Response Body (200 OK):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "pedidoId": "uuid-del-pedido",
  "clienteId": "uuid-del-cliente",
  "subtotal": 100.00,
  "impuestos": 15.00,
  "total": 115.00,
  "fechaEmision": "2026-02-07T10:30:00",
  "estado": "BORRADOR"
}
```

**Response en caso de error (404/500):**
```json
{
  "error": "Factura no encontrada"
}
```

**Lógica de Negocio:**
1. Busca la factura por UUID en la base de datos
2. Si existe, retorna la factura
3. Si no existe, lanza RuntimeException con mensaje "Factura no encontrada"

**Códigos HTTP:**
- 200 OK: Factura encontrada
- 500 Internal Server Error: Factura no encontrada (RuntimeException)

---

## Lógica de Negocio Detallada

### Cálculo de Impuestos

**Tasa de Impuesto:** 15% (0.15)

**Fórmula:**
```
impuestos = subtotal × 0.15 (redondeado a 2 decimales, HALF_UP)
total = subtotal + impuestos
```

**Ejemplo:**
- Subtotal: $100.00
- Impuestos: $100.00 × 0.15 = $15.00
- Total: $100.00 + $15.00 = $115.00

### Estados de Factura

El ciclo de vida de una factura sigue estos estados:

1. **BORRADOR:** Estado inicial al crear una factura
2. **PAGADA:** Cuando se confirma el pago (requiere actualización manual en el código actual)
3. **ANULADA:** Cuando se cancela la factura (requiere actualización manual en el código actual)

**Nota:** El API actual solo implementa la creación en estado BORRADOR. Los cambios de estado a PAGADA o ANULADA requerirían endpoints adicionales.

---

## Configuración de la Aplicación

### Base de Datos
- **Motor:** PostgreSQL
- **Host:** localhost:5432
- **Base de Datos:** logiflow_billing
- **Usuario:** postgres
- **Contraseña:** admin123

### Configuración JPA/Hibernate
- **DDL Auto:** update (actualiza esquema automáticamente)
- **Show SQL:** true (muestra consultas en consola)
- **Dialect:** PostgreSQL
- **Format SQL:** true (formatea SQL en logs)

### Servidor
- **Puerto:** 8084
- **Nombre del servicio:** billing-service

---

## Dependencias Principales

- **Spring Boot Web:** Para crear REST APIs
- **Spring Data JPA:** Para persistencia de datos
- **PostgreSQL Driver:** Conector de base de datos
- **Lombok:** Para reducir boilerplate code (@Data, @Builder, etc.)
- **Jakarta Validation:** Para validaciones (@NotNull, @NotBlank)
- **Hibernate UUID Generator:** Para generar UUIDs automáticamente

---

## Flujo de Datos

### Creación de Factura (POST /facturas)

```
Cliente → BillingController.crearFactura()
    ↓
BillingService.generarFactura()
    ↓ (Calcula impuestos y total)
    ↓ (Establece estado BORRADOR)
    ↓
BillingRepository.save()
    ↓
Base de Datos PostgreSQL (tabla facturas)
    ↓
Retorna Billing completo
    ↓
Response JSON al Cliente
```

### Consulta de Factura (GET /facturas/{id})

```
Cliente → BillingController.buscarFactura(UUID id)
    ↓
BillingService.buscarPorId(UUID id)
    ↓
BillingRepository.findById(id)
    ↓
Base de Datos PostgreSQL
    ↓
Optional<Billing> → orElseThrow si no existe
    ↓
Retorna Billing
    ↓
Response JSON al Cliente
```

---

## Características Técnicas

### Generación de IDs
- Utiliza `@UuidGenerator` de Hibernate
- Los UUIDs se generan automáticamente al insertar
- Formato: UUID v4 (ej: `123e4567-e89b-12d3-a456-426614174000`)

### Manejo de Decimales
- Tipo: `BigDecimal` para precisión financiera
- Redondeo: `RoundingMode.HALF_UP` (redondeo comercial)
- Escala: 2 decimales

### Validaciones
- `@NotNull` en campos obligatorios (pedidoId, clienteId, subtotal)
- Validaciones de JPA a nivel de columna (nullable = false)

### Timestamps
- `fechaEmision` se genera automáticamente con `LocalDateTime.now()`
- Formato ISO-8601 en JSON (ej: `2026-02-07T10:30:00`)

---

## Limitaciones y Consideraciones

1. **No hay endpoint para actualizar facturas:** Solo creación y consulta
2. **No hay cambio de estado:** Los estados PAGADA y ANULADA deben implementarse
3. **No hay validación de negocio:** No valida si pedidoId o clienteId existen
4. **No hay paginación:** El endpoint de listar retorna todas las facturas
5. **Manejo de errores básico:** Solo RuntimeException para factura no encontrada
6. **No hay autenticación:** Los endpoints son públicos
7. **No hay logs de auditoría:** No se registran cambios o accesos
8. **Puerto fijo:** El puerto 8084 está hardcodeado en la configuración

---

## Casos de Uso

### Caso 1: Generar factura para un pedido
```
POST /api/v1/billing/facturas
Body: { "pedidoId": "...", "clienteId": "...", "subtotal": 500.00 }
→ Sistema calcula impuestos (75.00) y total (575.00)
→ Crea factura en estado BORRADOR
→ Retorna factura completa con UUID generado
```

### Caso 2: Consultar todas las facturas
```
GET /api/v1/billing/facturas
→ Sistema recupera todas las facturas de la BD
→ Retorna array JSON con todas las facturas
```

### Caso 3: Buscar factura específica
```
GET /api/v1/billing/facturas/{id}
→ Sistema busca factura por UUID
→ Si existe: retorna factura
→ Si no existe: error "Factura no encontrada"
```

---

## Integración con Otros Servicios

Este servicio forma parte del sistema **LogiFlow** y se relaciona con:

- **Order Service:** Recibe `pedidoId` de órdenes/pedidos
- **Customer Service:** Recibe `clienteId` de clientes
- **Payment Service:** Podría actualizar estado a PAGADA (no implementado)

El servicio es **stateless** y se comunica mediante REST APIs.

---

## Comandos Útiles

### Ejecutar el servicio
```bash
mvn spring-boot:run
```

### Compilar
```bash
mvn clean install
```

### Crear tabla en PostgreSQL
```sql
CREATE DATABASE logiflow_billing;
```

### Verificar servicio
```bash
curl http://localhost:8084/api/v1/billing/facturas
```

---

## Resumen para IA

Este es un microservicio de facturación que:
- **Crea facturas** calculando automáticamente impuestos del 15%
- **Almacena facturas** en PostgreSQL con estados (BORRADOR/PAGADA/ANULADA)
- **Expone 3 endpoints REST:** crear, listar todas, buscar por ID
- **Utiliza Spring Boot** con JPA/Hibernate para persistencia
- **Genera UUIDs automáticos** para identificadores
- **Maneja precisión decimal** con BigDecimal para montos financieros
- **Corre en puerto 8084** como parte del ecosistema LogiFlow

**Entradas principales:** pedidoId, clienteId, subtotal  
**Salidas principales:** Factura completa con impuestos y total calculados  
**Regla de negocio clave:** Impuesto fijo del 15% sobre subtotal
