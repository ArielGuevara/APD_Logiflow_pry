/**
 * Combina todos los resolvers
 */
export declare const resolvers: {
    Query: {
        zona: () => null;
        zonas: () => never[];
        kpiDiario: (_: any, { filtro }: {
            filtro: import("../entities").KPIFiltro;
        }) => Promise<import("../entities").KPIDiario>;
        estadisticasPedidos: (_: any, { filtro }: {
            filtro?: import("../entities").PedidoFiltro;
        }) => Promise<import("../entities").EstadisticasPedidos>;
        desempenoRepartidores: (_: any, { zonaId: _zonaId, fechaDesde: _fechaDesde, fechaHasta: _fechaHasta }: {
            zonaId?: string;
            fechaDesde?: string;
            fechaHasta?: string;
        }) => Promise<import("../entities").RepartidorDesempeno[]>;
        factura: (_: any, { id }: {
            id: string;
        }) => Promise<import("../entities").Factura | null>;
        facturas: (_: any, { clienteId, estado }: {
            clienteId?: string;
            estado?: import("../entities").EstadoFactura;
        }) => Promise<import("../entities").Factura[]>;
        vehiculo: (_: any, { id, placa }: {
            id?: string;
            placa?: string;
        }) => Promise<import("../entities").Vehiculo | null>;
        vehiculos: (_: any, { estado, tipoVehiculo }: {
            estado?: import("../entities").EstadoVehiculo;
            tipoVehiculo?: import("../entities").TipoVehiculo;
        }) => Promise<import("../entities").Vehiculo[]>;
        repartidor: (_: any, { id }: {
            id: string;
        }) => Promise<import("../entities").Repartidor | null>;
        repartidores: (_: any, { filtro }: {
            filtro?: import("../entities").RepartidorFiltro;
        }) => Promise<import("../entities").Repartidor[]>;
        flotaActiva: (_: any, { zonaId: _zonaId }: {
            zonaId?: string;
        }) => Promise<import("../entities").FlotaResumen>;
        usuario: (_: any, { id }: {
            id: string;
        }) => Promise<import("../entities").Usuario | null>;
        usuarios: (_: any, { rol, zoneId, status }: {
            rol?: import("../entities").RoleName;
            zoneId?: string;
            status?: import("../entities").UserStatus;
        }) => Promise<import("../entities").Usuario[]>;
        repartidoresDisponibles: (_: any, { zonaId, fleetType }: {
            zonaId: string;
            fleetType: import("../entities").FleetType;
        }) => Promise<import("../entities").Usuario[]>;
        pedido: (_: any, { id }: {
            id: string;
        }) => Promise<import("../entities").Pedido | null>;
        pedidos: (_: any, { filtro }: {
            filtro?: import("../entities").PedidoFiltro;
        }) => Promise<import("../entities").Pedido[]>;
        pedidosPorCliente: (_: any, { clienteId }: {
            clienteId: string;
        }) => Promise<import("../entities").Pedido[]>;
        pedidosPorRepartidor: (_: any, { repartidorId }: {
            repartidorId: string;
        }) => Promise<import("../entities").Pedido[]>;
    };
    Pedido: {
        cliente: (pedido: import("../entities").Pedido, _: any, { loaders }: import("../utils/context").GraphQLContext) => Promise<import("../entities").Usuario | null>;
        repartidor: (pedido: import("../entities").Pedido, _: any, { loaders }: import("../utils/context").GraphQLContext) => Promise<import("../entities").Usuario | null>;
        factura: (pedido: import("../entities").Pedido, _: any, { loaders }: import("../utils/context").GraphQLContext) => Promise<import("../entities").Factura | null>;
        tiempoTranscurrido: (pedido: import("../entities").Pedido) => number | null;
        retrasoMin: (pedido: import("../entities").Pedido) => number | null;
    };
    Repartidor: {
        vehiculo: (repartidor: import("../entities").Repartidor, _: any, { loaders }: import("../utils/context").GraphQLContext) => Promise<import("../entities").Vehiculo | null>;
        pedidosActivos: (repartidor: import("../entities").Repartidor) => Promise<any[]>;
        pedidosCompletados: (repartidor: import("../entities").Repartidor) => Promise<number>;
    };
    Factura: {
        pedido: (factura: import("../entities").Factura) => Promise<import("../entities").Pedido | null>;
        cliente: (factura: import("../entities").Factura, _: any, { loaders }: import("../utils/context").GraphQLContext) => Promise<import("../entities").Usuario | null>;
    };
    Mutation: {
        _empty: () => string;
    };
};
//# sourceMappingURL=index.d.ts.map