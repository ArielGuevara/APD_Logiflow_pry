import { GraphQLContext } from '../../utils/context';
import { Vehiculo, Repartidor, EstadoVehiculo, TipoVehiculo, RepartidorFiltro, FlotaResumen } from '../../entities';
export declare const fleetQueries: {
    /**
     * Obtener un vehículo por ID o placa
     */
    vehiculo: (_: any, { id, placa }: {
        id?: string;
        placa?: string;
    }) => Promise<Vehiculo | null>;
    /**
     * Obtener vehículos con filtros
     */
    vehiculos: (_: any, { estado, tipoVehiculo }: {
        estado?: EstadoVehiculo;
        tipoVehiculo?: TipoVehiculo;
    }) => Promise<Vehiculo[]>;
    /**
     * Obtener un repartidor por ID
     */
    repartidor: (_: any, { id }: {
        id: string;
    }) => Promise<Repartidor | null>;
    /**
     * Obtener repartidores con filtros
     */
    repartidores: (_: any, { filtro }: {
        filtro?: RepartidorFiltro;
    }) => Promise<Repartidor[]>;
    /**
     * Obtener resumen de flota activa
     */
    flotaActiva: (_: any, { zonaId: _zonaId }: {
        zonaId?: string;
    }) => Promise<FlotaResumen>;
};
export declare const repartidorFieldResolvers: {
    /**
     * Resolver para el campo 'vehiculo' del Repartidor
     */
    vehiculo: (repartidor: Repartidor, _: any, { loaders }: GraphQLContext) => Promise<Vehiculo | null>;
    /**
     * Obtener pedidos activos del repartidor
     */
    pedidosActivos: (repartidor: Repartidor) => Promise<any[]>;
    /**
     * Contar pedidos completados
     */
    pedidosCompletados: (repartidor: Repartidor) => Promise<number>;
};
//# sourceMappingURL=fleet.queries.d.ts.map