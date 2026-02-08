# LogiFlow GraphQL Service - Documentación de Endpoints

Este documento describe todos los queries y tipos disponibles en el servicio GraphQL de LogiFlow.

## 🌐 Endpoint

**URL**: `http://localhost:8085/graphql`

## 📘 Queries Disponibles

### Pedidos

#### `pedido(id: ID!): Pedido`
Obtener un pedido específico por ID.

**Example**:
```graphql
query {
  pedido(id: "123e4567-e89b-12d3-a456-426614174000") {
    id
    estado
    descripcionProducto
    costoEstimado
    cliente {
      nombre
      email
    }
  }
}
```

#### `pedidos(filtro: PedidoFiltro): [Pedido!]!`
Obtener lista de pedidos con filtros opcionales.

**Example**:
```graphql
query {
  pedidos(filtro: { 
    estado: PENDIENTE
    tipoVehiculo: MOTO
  }) {
    id
    estado
    direccionEntrega
    costoEstimado
  }
}
```

#### `pedidosPorCliente(clienteId: ID!): [Pedido!]!`
Obtener todos los pedidos de un cliente específico.

#### `pedidosPorRepartidor(repartidorId: ID!): [Pedido!]!`
Obtener todos los pedidos de un repartidor específico.

---

### Usuarios

#### `usuario(id: ID!): Usuario`
Obtener un usuario específico.

**Example**:
```graphql
query {
  usuario(id: "user-123") {
    id
    nombre
    apellido
    email
    rol {
      name
    }
    status
  }
}
```

#### `usuarios(rol: RoleName, zoneId: ID, status: UserStatus): [Usuario!]!`
Obtener usuarios con filtros opcionales.

**Example**:
```graphql
query {
  usuarios(rol: REPARTIDOR, status: ACTIVE) {
    id
    nombreCompleto
    telefono
    fleetType
  }
}
```

#### `repartidoresDisponibles(zonaId: ID!, fleetType: FleetType!): [Usuario!]!`
Obtener repartidores disponibles para una zona y tipo de flota.

---

### Flota

#### `vehiculo(id: ID, placa: String): Vehiculo`
Obtener un vehículo por ID o placa.

**Example**:
```graphql
query {
  vehiculo(placa: "ABC-1234") {
    id
    marca
    modelo
    tipoVehiculo
    estado
  }
}
```

#### `vehiculos(estado: EstadoVehiculo, tipoVehiculo: TipoVehiculo): [Vehiculo!]!`
Obtener lista de vehículos con filtros.

#### `repartidores(filtro: RepartidorFiltro): [Repartidor!]!`
Obtener lista de repartidores con filtros.

**Example**:
```graphql
query {
  repartidores(filtro: { estado: DISPONIBLE }) {
    id
    nombre
    apellido
    licencia
    vehiculo {
      placa
      marca
    }
    pedidosCompletados
  }
}
```

#### `flotaActiva(zonaId: ID): FlotaResumen!`
Obtener resumen estadístico de la flota activa.

**Example**:
```graphql
query {
  flotaActiva {
    total
    disponibles
    enRuta
    mantenimiento
    porTipo {
      tipo
      cantidad
      disponibles
    }
  }
}
```

---

### Facturas

#### `factura(id: ID!): Factura`
Obtener una factura específica.

#### `facturas(clienteId: ID, estado: EstadoFactura): [Factura!]!`
Obtener lista de facturas con filtros.

**Example**:
```graphql
query {
  facturas(estado: EMITIDA) {
    id
    total
    fechaEmision
    cliente {
      nombreCompleto
    }
    pedido {
      descripcionProducto
    }
  }
}
```

---

### Dashboard y KPIs

#### `kpiDiario(filtro: KPIFiltro!): KPIDiario!`
Obtener KPIs del día.

**Example**:
```graphql
query {
  kpiDiario(filtro: { fecha: "2026-02-07" }) {
    totalPedidos
    pedidosEntregados
    pedidosCancelados
    tasaExito
    costoPromedio
    ingresoTotal
  }
}
```

#### `estadisticasPedidos(filtro: PedidoFiltro): EstadisticasPedidos!`
Obtener estadísticas agregadas de pedidos.

**Example**:
```graphql
query {
  estadisticasPedidos {
    totalPedidos
    porEstado {
      estado
      cantidad
      porcentaje
    }
    porTipoVehiculo {
      tipo
      cantidad
    }
    porZona {
      zonaId
      zonaNombre
      cantidad
    }
  }
}
```

#### `desempenoRepartidores(zonaId: ID, fechaDesde: String, fechaHasta: String): [RepartidorDesempeno!]!`
Obtener métricas de desempeño de repartidores.

**Example**:
```graphql
query {
  desempenoRepartidores {
    repartidor {
      nombreCompleto
    }
    pedidosCompletados
    pedidosCancelados
    tasaExito
    tiempoPromedioEntrega
  }
}
```

---

## 🔥 Query Ejemplo Completo (Dashboard Supervisor)

```graphql
query DashboardSupervisor {
  # Pedidos pendientes
  pedidos(filtro: { estado: PENDIENTE }) {
    id
    direccionRecogida
    direccionEntrega
    cliente {
      nombre
      telefono
    }
    repartidor {
      nombre
    }
    tiempoTranscurrido
    retrasoMin
  }
  
  # Resumen de flota
  flotaActiva {
    total
    disponibles
    enRuta
    porTipo {
      tipo
      cantidad
      disponibles
    }
  }
  
  # KPIs del día
  kpiDiario(filtro: { fecha: "2026-02-07" }) {
    totalPedidos
    pedidosEntregados
    tasaExito
    costoPromedio
  }
  
  # Desempeño de repartidores
  desempenoRepartidores {
    repartidor {
      nombreCompleto
    }
    pedidosCompletados
    tasaExito
  }
}
```

---

## 📊 Tipos de Datos Principales

### Pedido
```graphql
type Pedido {
  id: ID!
  clienteId: ID!
  cliente: Usuario                # Campo resuelto con DataLoader
  repartidorId: ID
  repartidor: Usuario             # Campo resuelto con DataLoader
  direccionRecogida: String!
  direccionEntrega: String!
  tipoVehiculo: TipoVehiculo!
  estado: EstadoPedido!
  costoEstimado: Float!
  descripcionProducto: String!
  pesoKg: Float!
  esFragil: Boolean!
  fechaCreacion: String!
  fechaActualizacion: String!
  tiempoTranscurrido: Int         # Calculado dinámicamente
  retrasoMin: Int                 # Calculado dinámicamente
  factura: Factura                # Campo resuelto con DataLoader
}
```

###Usuario
```graphql
type Usuario {
  id: ID!
  email: String!
  nombre: String!
  apellido: String!
  nombreCompleto: String!
  telefono: String
  direccion: String
  rol: Rol!
  status: UserStatus!
  fleetType: FleetType
  zoneId: String
  lastLogin: String
  createdAt: String!
  updatedAt: String!
}
```

### Enums

```graphql
enum EstadoPedido {
  PENDIENTE
  EN_PROGRESO
  ENTREGADO
  CANCELADO
}

enum TipoVehiculo {
  MOTO
  LIVIANO
  CAMION
}

enum RoleName {
  CLIENTE
  REPARTIDOR
  SUPERVISOR
  GERENTE
  ADMIN
}
```

---

## 🚀 Características Avanzadas

### DataLoaders
El servicio implementa DataLoaders para evitar el problema N+1:
- `usuarioLoader`: Batch loading de usuarios
- `vehiculoLoader`: Batch loading de vehículos
- `facturaLoader`: Batch loading de facturas

### Campos Calculados
Algunos campos son calculados dinámicamente:
- `Pedido.tiempoTranscurrido`: Minutos desde creación
- `Pedido.retrasoMin`: Retraso respecto al tiempo esperado
- `Repartidor.pedidosActivos`: Pedidos en curso
- `Repartidor.pedidosCompletados`: Total de pedidos entregados

### Filtros
Todos los queries de lista soportan filtros mediante input types:
- `PedidoFiltro`: estado, tipoVehiculo, clienteId, repartidorId, fechas
- `RepartidorFiltro`: zonaId, estado, fleetType, disponible
- `KPIFiltro`: fecha, fechaDesde, fechaHasta, zonaId

---

## 📝 Notas

- ⚠️ **Mutaciones**: Las operaciones de escritura deben usar los endpoints REST para mantener trazabilidad
- 🔒 **Autenticación**: Actualmente no validada en GraphQL (manejada por Kong Gateway)
- 📊 **Performance**: Los DataLoaders agrupan consultas para optimizar el rendimiento
