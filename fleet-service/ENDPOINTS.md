# Fleet Service - Endpoints Documentation

**Base Path:** `/api/v1/fleet`  
**Puerto:** 8083  
**Total de Endpoints:** 7

---

## 📋 Índice

- [Gestión de Vehículos](#gestión-de-vehículos)
- [Gestión de Repartidores](#gestión-de-repartidores)
- [Enumeraciones](#enumeraciones)

---

## 🚗 Gestión de Vehículos

### 1. POST `/api/v1/fleet/vehiculos`
Crea un nuevo vehículo.

**Recibe:**
```json
{
  "tipoVehiculo": "MOTO|LIVIANO|CAMION (requerido, propiedad discriminadora)",
  "cilindraje": "number (requerido, máximo 10000)",
  "placa": "string (requerido, formato: AAA-123 o AAA-1234)",
  "marca": "string (requerido, 2-50 caracteres)",
  "color": "string (requerido)",
  "modelo": "string (requerido, 2-50 caracteres)",
  "anioFabricacion": "string (requerido, formato: 1999-2024)",
  "activo": "boolean (requerido)",
  "estado": "DISPONIBLE|EN_USO|MANTENIMIENTO|INACTIVO"
}
```

**Para Moto específicamente:**
```json
{
  "tipoVehiculo": "MOTO",
  "tipoMoto": "SCOOTER|DEPORTIVA|CLASICA",
  "cilindraje": 250,
  "placa": "ABC-1234",
  "marca": "Yamaha",
  "color": "Rojo",
  "modelo": "YZF-R3",
  "anioFabricacion": "2023",
  "activo": true,
  "estado": "DISPONIBLE"
}
```

**Entrega:**
```json
{
  "id": "uuid",
  "tipoVehiculo": "MOTO|LIVIANO|CAMION",
  "cilindraje": "number",
  "placa": "string",
  "marca": "string",
  "color": "string",
  "modelo": "string",
  "anioFabricacion": "string",
  "activo": "boolean",
  "fechaCreacion": "datetime",
  "estado": "DISPONIBLE|EN_USO|MANTENIMIENTO|INACTIVO"
}
```

**Códigos de Respuesta:**
- `200 OK`: Vehículo creado exitosamente
- `400 Bad Request`: Datos inválidos

**Validaciones:**
- `cilindraje`: Máximo 10000
- `placa`: Formato AAA-123 o AAA-1234 (pattern: `^[A-Z]{3}-\\d{3,4}$`)
- `marca`: Entre 2 y 50 caracteres
- `modelo`: Entre 2 y 50 caracteres
- `anioFabricacion`: Patrón `^(19|20)\\d{2}$` (años entre 1900-2099)
- `placa`: Debe ser única en el sistema

---

### 2. GET `/api/v1/fleet/vehiculos`
Lista todos los vehículos.

**Recibe:** Ningún parámetro

**Entrega:**
```json
[
  {
    "id": "uuid",
    "tipoVehiculo": "MOTO|LIVIANO|CAMION",
    "cilindraje": "number",
    "placa": "string",
    "marca": "string",
    "color": "string",
    "modelo": "string",
    "anioFabricacion": "string",
    "activo": "boolean",
    "fechaCreacion": "datetime",
    "estado": "DISPONIBLE|EN_USO|MANTENIMIENTO|INACTIVO"
  }
]
```

**Códigos de Respuesta:**
- `200 OK`: Lista obtenida exitosamente

---

### 3. GET `/api/v1/fleet/vehiculos/{placa}`
Busca un vehículo por placa.

**Recibe:**
- **Path Parameter:** `placa` (string, formato: AAA-123 o AAA-1234)

**Entrega:**
```json
{
  "id": "uuid",
  "tipoVehiculo": "MOTO|LIVIANO|CAMION",
  "cilindraje": "number",
  "placa": "string",
  "marca": "string",
  "color": "string",
  "modelo": "string",
  "anioFabricacion": "string",
  "activo": "boolean",
  "fechaCreacion": "datetime",
  "estado": "DISPONIBLE|EN_USO|MANTENIMIENTO|INACTIVO"
}
```

**Códigos de Respuesta:**
- `200 OK`: Vehículo encontrado
- `404 Not Found`: Vehículo no encontrado

---

### 4. PATCH `/api/v1/fleet/vehiculos/{placa}/estado`
Actualiza el estado de un vehículo.

**Recibe:**
- **Path Parameter:** `placa` (string)
- **Query Parameter:** `estado` (DISPONIBLE|EN_USO|MANTENIMIENTO|INACTIVO)

**Ejemplo de petición:**
```
PATCH /api/v1/fleet/vehiculos/ABC-1234/estado?estado=EN_USO
```

**Entrega:**
```json
{
  "id": "uuid",
  "tipoVehiculo": "MOTO|LIVIANO|CAMION",
  "placa": "string",
  "estado": "EN_USO",
  "marca": "string",
  "modelo": "string",
  /* ... resto de campos */
}
```

**Códigos de Respuesta:**
- `200 OK`: Estado actualizado
- `404 Not Found`: Vehículo no encontrado

---

## 👤 Gestión de Repartidores

### 5. POST `/api/v1/fleet/repartidores`
Registra un nuevo repartidor.

**Recibe:**
```json
{
  "identificacion": "string (requerido, cédula ecuatoriana válida)",
  "nombre": "string (requerido)",
  "apellido": "string (requerido)",
  "telefono": "string (requerido)",
  "licencia": "string (requerido)",
  "estado": "DISPONIBLE|OCUPADO|INACTIVO (opcional)"
}
```

**Entrega:**
```json
{
  "id": "uuid",
  "identificacion": "string",
  "nombre": "string",
  "apellido": "string",
  "telefono": "string",
  "licencia": "string",
  "vehiculo": null,
  "estado": "DISPONIBLE|OCUPADO|INACTIVO"
}
```

**Códigos de Respuesta:**
- `200 OK`: Repartidor registrado exitosamente
- `400 Bad Request`: Datos inválidos (ej: cédula inválida)

**Validaciones:**
- `identificacion`: Debe ser una cédula ecuatoriana válida (validador personalizado `@CedulaEcuador`)
- `identificacion`: Debe ser única en el sistema
- Todos los campos de texto son requeridos (`@NotBlank`)

---

### 6. GET `/api/v1/fleet/repartidores`
Lista todos los repartidores.

**Recibe:** Ningún parámetro

**Entrega:**
```json
[
  {
    "id": "uuid",
    "identificacion": "string",
    "nombre": "string",
    "apellido": "string",
    "telefono": "string",
    "licencia": "string",
    "vehiculo": {
      "id": "uuid",
      "placa": "string",
      "marca": "string",
      "modelo": "string",
      "tipoVehiculo": "MOTO|LIVIANO|CAMION",
      /* ... datos completos del vehículo */
    },
    "estado": "DISPONIBLE|OCUPADO|INACTIVO"
  }
]
```

**Códigos de Respuesta:**
- `200 OK`: Lista obtenida exitosamente

---

### 7. PUT `/api/v1/fleet/repartidores/{id}/asignar-vehiculo`
Asigna un vehículo a un repartidor.

**Recibe:**
- **Path Parameter:** `id` (UUID del repartidor)
- **Query Parameter:** `placa` (string, placa del vehículo)

**Ejemplo de petición:**
```
PUT /api/v1/fleet/repartidores/123e4567-e89b-12d3-a456-426614174000/asignar-vehiculo?placa=ABC-1234
```

**Entrega:**
```json
{
  "id": "uuid",
  "identificacion": "string",
  "nombre": "string",
  "apellido": "string",
  "telefono": "string",
  "licencia": "string",
  "vehiculo": {
    "id": "uuid",
    "placa": "ABC-1234",
    "marca": "Yamaha",
    "modelo": "YZF-R3",
    "tipoVehiculo": "MOTO",
    "estado": "DISPONIBLE",
    /* ... datos completos del vehículo asignado */
  },
  "estado": "DISPONIBLE|OCUPADO|INACTIVO"
}
```

**Códigos de Respuesta:**
- `200 OK`: Vehículo asignado exitosamente
- `404 Not Found`: Repartidor o vehículo no encontrado

---

## 🔑 Enumeraciones

### EstadoVehiculo
- `DISPONIBLE` - Vehículo disponible para asignación
- `EN_USO` - Vehículo actualmente en uso
- `MANTENIMIENTO` - Vehículo en mantenimiento
- `INACTIVO` - Vehículo inactivo

### TipoVehiculo
- `MOTO`
- `LIVIANO`
- `CAMION`

### MotoType (para vehículos tipo Moto)
- `SCOOTER`
- `DEPORTIVA`
- `CLASICA`

### TipoEstado (para Repartidores)
- `DISPONIBLE`
- `OCUPADO`
- `INACTIVO`

---

## 📝 Notas

### Herencia de Vehículos
El modelo `Vehiculo` es una clase abstracta con herencia:
- **Moto** - Incluye campo adicional `tipoMoto`
- **Liviano** - Para vehículos livianos
- **Camion** - Para camiones

Se utiliza `@JsonTypeInfo` con propiedad `tipoVehiculo` para discriminar el tipo.

### Relaciones
- **Repartidor ↔ Vehiculo**: Relación OneToOne con cascade ALL
- La asignación es bidireccional
- Un vehículo solo puede estar asignado a un repartidor

### Validaciones Personalizadas
- `@CedulaEcuador`: Validador personalizado para cédulas ecuatorianas en el modelo `Repartidor`

### Comportamiento PrePersist
- `fechaCreacion` se establece automáticamente al crear un vehículo
- `activo` se establece como `false` por defecto

---

## 💡 Casos de Uso

### 1. Registrar una moto
```json
POST /api/v1/fleet/vehiculos
{
  "tipoVehiculo": "MOTO",
  "tipoMoto": "DEPORTIVA",
  "cilindraje": 250,
  "placa": "ABC-1234",
  "marca": "Yamaha",
  "color": "Rojo",
  "modelo": "YZF-R3",
  "anioFabricacion": "2023",
  "activo": true,
  "estado": "DISPONIBLE"
}
```

### 2. Cambiar estado de vehículo a mantenimiento
```
PATCH /api/v1/fleet/vehiculos/ABC-1234/estado?estado=MANTENIMIENTO
```

### 3. Registrar repartidor y asignarle vehículo
```json
POST /api/v1/fleet/repartidores
{
  "identificacion": "1234567890",
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "0987654321",
  "licencia": "A1"
}
```

Luego:
```
PUT /api/v1/fleet/repartidores/{id}/asignar-vehiculo?placa=ABC-1234
```
