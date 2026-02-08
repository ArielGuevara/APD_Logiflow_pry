import { FetchClient } from '../utils/fetchClient';
import { Vehiculo, Repartidor, EstadoVehiculo, TipoVehiculo, RepartidorFiltro } from '../entities';

/**
 * Servicio para interactuar con el Fleet Service
 */
export class FleetService {
    private client: FetchClient;

    constructor() {
        const baseURL = process.env.FLEET_SERVICE_URL || 'http://localhost:8083/api/v1';
        this.client = new FetchClient(baseURL);
    }

    // ==================== VEHÍCULOS ====================

    /**
     * Obtener vehículo por placa
     */
    async getVehiculoPorPlaca(placa: string): Promise<Vehiculo | null> {
        try {
            return await this.client.get<Vehiculo>(`/fleet/vehiculos/${placa}`);
        } catch (error) {
            console.error(`Error fetching vehiculo ${placa}:`, error);
            return null;
        }
    }

    /**
     * Obtener todos los vehículos
     */
    async getVehiculos(params?: { estado?: EstadoVehiculo; tipoVehiculo?: TipoVehiculo }): Promise<Vehiculo[]> {
        try {
            const response = await this.client.get<any>('/fleet/vehiculos', params);
            return Array.isArray(response) ? response : (response.data || response || []);
        } catch (error) {
            console.error('Error fetching vehiculos:', error);
            return [];
        }
    }

    /**
     * Batch load vehículos por IDs
     */
    async batchLoadVehiculos(ids: readonly string[]): Promise<(Vehiculo | null)[]> {
        try {
            const vehiculos = await this.getVehiculos();
            const vehiculoMap = new Map<string, Vehiculo>();

            vehiculos.forEach(vehiculo => {
                vehiculoMap.set(vehiculo.id, vehiculo);
            });

            return ids.map(id => vehiculoMap.get(id) || null);
        } catch (error) {
            console.error('Error batch loading vehiculos:', error);
            return ids.map(() => null);
        }
    }

    // ==================== REPARTIDORES ====================

    /**
     * Obtener todos los repartidores
     */
    async getRepartidores(filtro?: RepartidorFiltro): Promise<Repartidor[]> {
        try {
            const response = await this.client.get<any>('/fleet/repartidores');
            let repartidores: Repartidor[] = Array.isArray(response) ? response : (response.data || response || []);

            // Aplicar filtros localmente
            if (filtro) {
                if (filtro.estado) {
                    repartidores = repartidores.filter(r => r.estado === filtro.estado);
                }
                if (filtro.disponible !== undefined) {
                    repartidores = repartidores.filter(r =>
                        filtro.disponible ? r.estado === 'DISPONIBLE' : r.estado !== 'DISPONIBLE'
                    );
                }
            }

            return repartidores;
        } catch (error) {
            console.error('Error fetching repartidores:', error);
            return [];
        }
    }

    /**
     * Obtener repartidor por ID
     */
    async getRepartidor(id: string): Promise<Repartidor | null> {
        try {
            const repartidores = await this.getRepartidores();
            return repartidores.find(r => r.id === id) || null;
        } catch (error) {
            console.error(`Error fetching repartidor ${id}:`, error);
            return null;
        }
    }
}
