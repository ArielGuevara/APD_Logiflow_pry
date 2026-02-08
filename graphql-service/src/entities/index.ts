/**
 * Entidad Pedido
 */
export interface Pedido {
    id: string;
    clienteId: string;
    repartidorId?: string;
    direccionRecogida: string;
    direccionEntrega: string;
    tipoVehiculo: TipoVehiculo;
    estado: EstadoPedido;
    costoEstimado: number;
    descripcionProducto: string;
    pesoKg: number;
    esFragil: boolean;
    fechaCreacion: string;
    fechaActualizacion: string;
}

/**
 * Entidad Usuario
 */
export interface Usuario {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    nombreCompleto: string;
    telefono?: string;
    direccion?: string;
    rol: Rol;
    status: UserStatus;
    fleetType?: FleetType;
    zoneId?: string;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Entidad Rol
 */
export interface Rol {
    id: string;
    name: RoleName;
    description?: string;
}

/**
 * Entidad Vehículo
 */
export interface Vehiculo {
    id: string;
    tipoVehiculo: TipoVehiculo;
    cilindraje: number;
    placa: string;
    marca: string;
    color: string;
    modelo: string;
    anioFabricacion: string;
    activo: boolean;
    fechaCreacion: string;
    estado: EstadoVehiculo;
}

/**
 * Entidad Repartidor
 */
export interface Repartidor {
    id: string;
    identificacion: string;
    nombre: string;
    apellido: string;
    telefono: string;
    licencia: string;
    vehiculo?: Vehiculo;
    estado: TipoEstado;
}

/**
 * Entidad Factura
 */
export interface Factura {
    id: string;
    pedidoId: string;
    clienteId: string;
    subtotal: number;
    impuestos?: number;
    total: number;
    fechaEmision: string;
    estado: EstadoFactura;
}

// ==================== ENUMS ====================

export enum RoleName {
    CLIENTE = 'CLIENTE',
    REPARTIDOR = 'REPARTIDOR',
    SUPERVISOR = 'SUPERVISOR',
    GERENTE = 'GERENTE',
    ADMIN = 'ADMIN'
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED'
}

export enum FleetType {
    MOTO = 'MOTO',
    CARRO = 'CARRO',
    CAMION = 'CAMION'
}

export enum TipoVehiculo {
    MOTO = 'MOTO',
    LIVIANO = 'LIVIANO',
    CAMION = 'CAMION'
}

export enum EstadoPedido {
    PENDIENTE = 'PENDIENTE',
    EN_PROGRESO = 'EN_PROGRESO',
    ENTREGADO = 'ENTREGADO',
    CANCELADO = 'CANCELADO'
}

export enum EstadoVehiculo {
    DISPONIBLE = 'DISPONIBLE',
    EN_USO = 'EN_USO',
    MANTENIMIENTO = 'MANTENIMIENTO',
    INACTIVO = 'INACTIVO'
}

export enum TipoEstado {
    DISPONIBLE = 'DISPONIBLE',
    OCUPADO = 'OCUPADO',
    INACTIVO = 'INACTIVO'
}

export enum EstadoFactura {
    BORRADOR = 'BORRADOR',
    EMITIDA = 'EMITIDA',
    PAGADA = 'PAGADA',
    ANULADA = 'ANULADA'
}

// ==================== INPUT TYPES ====================

export interface PedidoFiltro {
    zonaId?: string;
    estado?: EstadoPedido;
    tipoVehiculo?: TipoVehiculo;
    clienteId?: string;
    repartidorId?: string;
    fechaDesde?: string;
    fechaHasta?: string;
}

export interface RepartidorFiltro {
    zonaId?: string;
    estado?: TipoEstado;
    fleetType?: FleetType;
    disponible?: boolean;
}

export interface KPIFiltro {
    fecha?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    zonaId?: string;
}

// ==================== AGGREGATION TYPES ====================

export interface FlotaResumen {
    total: number;
    disponibles: number;
    enRuta: number;
    mantenimiento: number;
    inactivos: number;
    porTipo: FlotaPorTipo[];
}

export interface FlotaPorTipo {
    tipo: TipoVehiculo;
    cantidad: number;
    disponibles: number;
}

export interface KPIDiario {
    fecha: string;
    zonaId?: string;
    totalPedidos: number;
    pedidosEntregados: number;
    pedidosCancelados: number;
    pedidosPendientes: number;
    tasaExito: number;
    tiempoPromedioEntrega: number;
    costoPromedio: number;
    ingresoTotal: number;
}

export interface EstadisticasPedidos {
    totalPedidos: number;
    porEstado: PedidoPorEstado[];
    porTipoVehiculo: PedidoPorTipoVehiculo[];
    porZona: PedidoPorZona[];
}

export interface PedidoPorEstado {
    estado: EstadoPedido;
    cantidad: number;
    porcentaje: number;
}

export interface PedidoPorTipoVehiculo {
    tipo: TipoVehiculo;
    cantidad: number;
}

export interface PedidoPorZona {
    zonaId: string;
    zonaNombre?: string;
    cantidad: number;
}

export interface RepartidorDesempeno {
    repartidor: Usuario;
    pedidosCompletados: number;
    pedidosCancelados: number;
    tasaExito: number;
    tiempoPromedioEntrega: number;
    calificacionPromedio?: number;
}
