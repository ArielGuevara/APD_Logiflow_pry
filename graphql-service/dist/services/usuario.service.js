"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioService = void 0;
const fetchClient_1 = require("../utils/fetchClient");
/**
 * Servicio para interactuar con el Auth Service
 */
class UsuarioService {
    constructor() {
        const baseURL = process.env.AUTH_SERVICE_URL || 'http://localhost:8081/api/v1';
        this.client = new fetchClient_1.FetchClient(baseURL);
    }
    /**
     * Obtener un usuario por ID
     */
    async getUsuario(id) {
        try {
            const response = await this.client.get(`/usuarios/${id}`);
            return response.data || response;
        }
        catch (error) {
            console.error(`Error fetching usuario ${id}:`, error);
            return null;
        }
    }
    /**
     * Obtener múltiples usuarios
     */
    async getUsuarios(params) {
        try {
            const response = await this.client.get('/usuarios', params);
            return Array.isArray(response) ? response : (response.data || response || []);
        }
        catch (error) {
            console.error('Error fetching usuarios:', error);
            return [];
        }
    }
    /**
     * Obtener usuarios por rol
     */
    async getUsuariosByRol(roleName) {
        try {
            const response = await this.client.get(`/usuarios/rol/${roleName}`);
            return Array.isArray(response) ? response : (response.data || response || []);
        }
        catch (error) {
            console.error(`Error fetching usuarios by rol ${roleName}:`, error);
            return [];
        }
    }
    /**
     * Obtener repartidores disponibles
     */
    async getRepartidoresDisponibles(zoneId, fleetType) {
        try {
            const response = await this.client.get('/usuarios/repartidores/disponibles', {
                zoneId,
                fleetType
            });
            return Array.isArray(response) ? response : (response.data || response || []);
        }
        catch (error) {
            console.error('Error fetching repartidores disponibles:', error);
            return [];
        }
    }
    /**
     * Batch load múltiples usuarios por IDs
     */
    async batchLoadUsuarios(ids) {
        try {
            const usuarios = await this.getUsuarios();
            const usuarioMap = new Map();
            usuarios.forEach(usuario => {
                usuarioMap.set(usuario.id, usuario);
            });
            return ids.map(id => usuarioMap.get(id) || null);
        }
        catch (error) {
            console.error('Error batch loading usuarios:', error);
            return ids.map(() => null);
        }
    }
}
exports.UsuarioService = UsuarioService;
//# sourceMappingURL=usuario.service.js.map