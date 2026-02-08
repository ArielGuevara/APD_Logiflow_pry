# Billing Service - Endpoints Documentation

**Base Path:** `/api/v1/billing`  
**Puerto:** 8084  
**Total de Endpoints:** 3

---

## 📋 Índice

- [Gestión de Facturas](#gestión-de-facturas)
- [Enumeraciones](#enumeraciones)

---

## 💰 Gestión de Facturas

### 1. POST `/api/v1/billing/facturas`
Crea una nueva factura.

**Recibe:**
```json
{
  "pedidoId": "uuid (requerido)",
  "clienteId": "uuid (requerido)",
  "subtotal": "number (requerido, decimal)",
  "impuestos": "number (decimal, opcional)",
  "total": "number (decimal, opcional)",
  "estado": "BORRADOR|EMITIDA|PAGADA|ANULADA (opcional)"
}
```

**Entrega:**
```json
{
  "id": "uuid",
  "pedidoId": "uuid",
  "clienteId": "uuid",
  "subtotal": "number",
  "impuestos": "number",
  "total": "number",
  "fechaEmision": "datetime (generado automáticamente)",
  "estado": "BORRADOR|EMITIDA|PAGADA|ANULADA"
}
```

**Códigos de Respuesta:**
- `200 OK`: Factura creada exitosamente
- `400 Bad Request`: Datos inválidos

**Validaciones:**
- `pedidoId`: UUID válido, no puede ser null
- `clienteId`: UUID válido, no puede ser null
- `subtotal`: Número decimal, no puede ser null
- `fechaEmision`: Se genera automáticamente al crear la factura
- `estado`: Por defecto se crea como `BORRADOR` si no se especifica

---

### 2. GET `/api/v1/billing/facturas`
Lista todas las facturas.

**Recibe:** Ningún parámetro

**Entrega:**
```json
[
  {
    "id": "uuid",
    "pedidoId": "uuid",
    "clienteId": "uuid",
    "subtotal": "number",
    "impuestos": "number",
    "total": "number",
    "fechaEmision": "datetime",
    "estado": "BORRADOR|EMITIDA|PAGADA|ANULADA"
  }
]
```

**Códigos de Respuesta:**
- `200 OK`: Lista obtenida exitosamente

---

### 3. GET `/api/v1/billing/facturas/{id}`
Busca una factura por ID.

**Recibe:**
- **Path Parameter:** `id` (UUID de la factura)

**Entrega:**
```json
{
  "id": "uuid",
  "pedidoId": "uuid",
  "clienteId": "uuid",
  "subtotal": "number",
  "impuestos": "number",
  "total": "number",
  "fechaEmision": "datetime",
  "estado": "BORRADOR|EMITIDA|PAGADA|ANULADA"
}
```

**Códigos de Respuesta:**
- `200 OK`: Factura encontrada
- `404 Not Found`: Factura no encontrada

---

## 🔑 Enumeraciones

### EstadoType
- `BORRADOR` - Factura creada pero no emitida
- `EMITIDA` - Factura emitida al cliente
- `PAGADA` - Factura pagada
- `ANULADA` - Factura anulada

---

## 📝 Notas

- **Formato de fecha:** `LocalDateTime` (se almacena automáticamente al crear la factura)
- **Modelo de datos:** Clase `Billing` en el paquete `espe.edu.ec.billing_service.model`
- **Tabla de BD:** `facturas`
- **Generación de IDs:** UUIDs generados automáticamente usando `@UuidGenerator`
- **Comportamiento PrePersist:**
  - `fechaEmision` se establece automáticamente al momento de crear el registro
  - `estado` se establece como `BORRADOR` por defecto si no se proporciona

---

## 💡 Casos de Uso

### Crear una factura para un pedido
```json
POST /api/v1/billing/facturas
{
  "pedidoId": "123e4567-e89b-12d3-a456-426614174000",
  "clienteId": "987fcdeb-51a2-43f1-b456-426614174000",
  "subtotal": 45.50,
  "impuestos": 5.46,
  "total": 50.96
}
```

### Consultar todas las facturas
```
GET /api/v1/billing/facturas
```

### Buscar una factura específica
```
GET /api/v1/billing/facturas/123e4567-e89b-12d3-a456-426614174000
```
