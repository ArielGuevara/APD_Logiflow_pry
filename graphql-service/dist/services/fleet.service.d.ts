import { Vehiculo, Repartidor, EstadoVehiculo, TipoVehiculo, RepartidorFiltro } from '../entities';
/**
 * Servicio para interactuar con el Fleet Service
 */
export declare class FleetService {
    private client;
    constructor();
    /**
     * Obtener vehículo por placa
     */
    getVehiculoPorPlaca(placa: string): Promise<Vehiculo | null>;
    /**
     * Obtener todos los vehículos
     */
    getVehiculos(params?: {
        estado?: EstadoVehiculo;
        tipoVehiculo?: TipoVehiculo;
    }): Promise<Vehiculo[]>;
    /**
     * Batch load vehículos por IDs
     */
    batchLoadVehiculos(ids: readonly string[]): Promise<(Vehiculo | null)[]>;
    /**
     * Obtener todos los repartidores
     */
    getRepartidores(filtro?: RepartidorFiltro): Promise<Repartidor[]>;
    /**
     * Obtener repartidor por ID
     */
    getRepartidor(id: string): Promise<Repartidor | null>;
}
//# sourceMappingURL=fleet.service.d.ts.map