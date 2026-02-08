"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetService = void 0;
const fetchClient_1 = require("../utils/fetchClient");
/**
 * Servicio para interactuar con el Fleet Service
 */
class FleetService {
    constructor() {
        const baseURL = process.env.FLEET_SERVICE_URL || 'http://localhost:8083/api/v1';
        this.client = new fetchClient_1.FetchClient(baseURL);
    }
    // ==================== VEHÍCULOS ====================
    /**
     * Obtener vehículo por placa
     */
    async getVehiculoPorPlaca(placa) {
        try {
            return await this.client.get(`/fleet/vehiculos/${placa}`);
        }
        catch (error) {
            console.error(`Error fetching vehiculo ${placa}:`, error);
            return null;
        }
    }
    /**
     * Obtener todos los vehículos
     */
    async getVehiculos(params) {
        try {
            const response = await this.client.get('/fleet/vehiculos', params);
            return Array.isArray(response) ? response : (response.data || response || []);
        }
        catch (error) {
            console.error('Error fetching vehiculos:', error);
            return [];
        }
    }
    /**
     * Batch load vehículos por IDs
     */
    async batchLoadVehiculos(ids) {
        try {
            const vehiculos = await this.getVehiculos();
            const vehiculoMap = new Map();
            vehiculos.forEach(vehiculo => {
                vehiculoMap.set(vehiculo.id, vehiculo);
            });
            return ids.map(id => vehiculoMap.get(id) || null);
        }
        catch (error) {
            console.error('Error batch loading vehiculos:', error);
            return ids.map(() => null);
        }
    }
    // ==================== REPARTIDORES ====================
    /**
     * Obtener todos los repartidores
     */
    async getRepartidores(filtro) {
        try {
            const response = await this.client.get('/fleet/repartidores');
            let repartidores = Array.isArray(response) ? response : (response.data || response || []);
            // Aplicar filtros localmente
            if (filtro) {
                if (filtro.estado) {
                    repartidores = repartidores.filter(r => r.estado === filtro.estado);
                }
                if (filtro.disponible !== undefined) {
                    repartidores = repartidores.filter(r => filtro.disponible ? r.estado === 'DISPONIBLE' : r.estado !== 'DISPONIBLE');
                }
            }
            return repartidores;
        }
        catch (error) {
            console.error('Error fetching repartidores:', error);
            return [];
        }
    }
    /**
     * Obtener repartidor por ID
     */
    async getRepartidor(id) {
        try {
            const repartidores = await this.getRepartidores();
            return repartidores.find(r => r.id === id) || null;
        }
        catch (error) {
            console.error(`Error fetching repartidor ${id}:`, error);
            return null;
        }
    }
}
exports.FleetService = FleetService;
//# sourceMappingURL=fleet.service.js.map