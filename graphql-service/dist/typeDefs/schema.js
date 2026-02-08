"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql
  # ==================== TYPES ====================

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

  type Rol {
    id: ID!
    name: RoleName!
    description: String
  }

  type Pedido {
    id: ID!
    clienteId: ID!
    cliente: Usuario
    repartidorId: ID
    repartidor: Usuario
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
    tiempoTranscurrido: Int
    retrasoMin: Int
    factura: Factura
  }

  type Vehiculo {
    id: ID!
    tipoVehiculo: TipoVehiculo!
    cilindraje: Int!
    placa: String!
    marca: String!
    color: String!
    modelo: String!
    anioFabricacion: String!
    activo: Boolean!
    fechaCreacion: String!
    estado: EstadoVehiculo!
  }

  type Repartidor {
    id: ID!
    identificacion: String!
    nombre: String!
    apellido: String!
    telefono: String!
    licencia: String!
    vehiculo: Vehiculo
    estado: TipoEstado!
    pedidosActivos: [Pedido!]
    pedidosCompletados: Int
  }

  type Factura {
    id: ID!
    pedidoId: ID!
    pedido: Pedido
    clienteId: ID!
    cliente: Usuario
    subtotal: Float!
    impuestos: Float
    total: Float!
    fechaEmision: String!
    estado: EstadoFactura!
  }

  type Zona {
    id: ID!
    nombre: String!
    codigo: String!
    ciudad: String!
    provincia: String!
    activa: Boolean!
    repartidoresDisponibles: Int
    pedidosPendientes: Int
  }

  # ==================== AGGREGATION & KPI TYPES ====================

  type FlotaResumen {
    total: Int!
    disponibles: Int!
    enRuta: Int!
    mantenimiento: Int!
    inactivos: Int!
    porTipo: [FlotaPorTipo!]!
  }

  type FlotaPorTipo {
    tipo: TipoVehiculo!
    cantidad: Int!
    disponibles: Int!
  }

  type KPIDiario {
    fecha: String!
    zonaId: ID
    totalPedidos: Int!
    pedidosEntregados: Int!
    pedidosCancelados: Int!
    pedidosPendientes: Int!
    tasaExito: Float!
    tiempoPromedioEntrega: Float!
    costoPromedio: Float!
    ingresoTotal: Float!
  }

  type EstadisticasPedidos {
    totalPedidos: Int!
    porEstado: [PedidoPorEstado!]!
    porTipoVehiculo: [PedidoPorTipoVehiculo!]!
    porZona: [PedidoPorZona!]!
  }

  type PedidoPorEstado {
    estado: EstadoPedido!
    cantidad: Int!
    porcentaje: Float!
  }

  type PedidoPorTipoVehiculo {
    tipo: TipoVehiculo!
    cantidad: Int!
  }

  type PedidoPorZona {
    zonaId: String!
    zonaNombre: String
    cantidad: Int!
  }

  type RepartidorDesempeno {
    repartidor: Usuario!
    pedidosCompletados: Int!
    pedidosCancelados: Int!
    tasaExito: Float!
    tiempoPromedioEntrega: Float!
    calificacionPromedio: Float
  }

  # ==================== ENUMS ====================

  enum RoleName {
    CLIENTE
    REPARTIDOR
    SUPERVISOR
    GERENTE
    ADMIN
  }

  enum UserStatus {
    ACTIVE
    INACTIVE
    SUSPENDED
  }

  enum FleetType {
    MOTO
    CARRO
    CAMION
  }

  enum TipoVehiculo {
    MOTO
    LIVIANO
    CAMION
  }

  enum EstadoPedido {
    PENDIENTE
    EN_PROGRESO
    ENTREGADO
    CANCELADO
  }

  enum EstadoVehiculo {
    DISPONIBLE
    EN_USO
    MANTENIMIENTO
    INACTIVO
  }

  enum TipoEstado {
    DISPONIBLE
    OCUPADO
    INACTIVO
  }

  enum EstadoFactura {
    BORRADOR
    EMITIDA
    PAGADA
    ANULADA
  }

  # ==================== INPUT TYPES ====================

  input PedidoFiltro {
    zonaId: ID
    estado: EstadoPedido
    tipoVehiculo: TipoVehiculo
    clienteId: ID
    repartidorId: ID
    fechaDesde: String
    fechaHasta: String
  }

  input RepartidorFiltro {
    zonaId: ID
    estado: TipoEstado
    fleetType: FleetType
    disponible: Boolean
  }

  input KPIFiltro {
    fecha: String
    fechaDesde: String
    fechaHasta: String
    zonaId: ID
  }

  # ==================== QUERIES ====================

  type Query {
    # Pedidos
    pedido(id: ID!): Pedido
    pedidos(filtro: PedidoFiltro): [Pedido!]!
    pedidosPorCliente(clienteId: ID!): [Pedido!]!
    pedidosPorRepartidor(repartidorId: ID!): [Pedido!]!
    
    # Usuarios
    usuario(id: ID!): Usuario
    usuarios(rol: RoleName, zoneId: ID, status: UserStatus): [Usuario!]!
    
    # Repartidores
    repartidor(id: ID!): Repartidor
    repartidores(filtro: RepartidorFiltro): [Repartidor!]!
    repartidoresDisponibles(zonaId: ID!, fleetType: FleetType!): [Usuario!]!
    
    # Flota
    vehiculo(id: ID, placa: String): Vehiculo
    vehiculos(estado: EstadoVehiculo, tipoVehiculo: TipoVehiculo): [Vehiculo!]!
    flotaActiva(zonaId: ID): FlotaResumen!
    
    # Facturas
    factura(id: ID!): Factura
    facturas(clienteId: ID, estado: EstadoFactura): [Factura!]!
    
    # Dashboard & KPIs
    kpiDiario(filtro: KPIFiltro!): KPIDiario!
    estadisticasPedidos(filtro: PedidoFiltro): EstadisticasPedidos!
    desempenoRepartidores(zonaId: ID, fechaDesde: String, fechaHasta: String): [RepartidorDesempeno!]!
    
    # Zonas
    zona(id: ID!): Zona
    zonas(activa: Boolean): [Zona!]!
  }

  # ==================== MUTATIONS ====================

  type Mutation {
    _empty: String
  }
`;
//# sourceMappingURL=schema.js.map