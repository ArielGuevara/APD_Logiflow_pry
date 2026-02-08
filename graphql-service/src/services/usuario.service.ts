import { FetchClient } from '../utils/fetchClient';
import { Usuario, RoleName, UserStatus } from '../entities';

/**
 * Servicio para interactuar con el Auth Service
 */
export class UsuarioService {
    private client: FetchClient;

    constructor() {
        const baseURL = process.env.AUTH_SERVICE_URL || 'http://localhost:8081/api/v1';
        this.client = new FetchClient(baseURL);
    }

    /**
     * Obtener un usuario por ID
     */
    async getUsuario(id: string): Promise<Usuario | null> {
        try {
            const response = await this.client.get<any>(`/usuarios/${id}`);
            return response.data || response;
        } catch (error) {
            console.error(`Error fetching usuario ${id}:`, error);
            return null;
        }
    }

    /**
     * Obtener múltiples usuarios
     */
    async getUsuarios(params?: { rol?: RoleName; zoneId?: string; status?: UserStatus }): Promise<Usuario[]> {
        try {
            const response = await this.client.get<any>('/usuarios', params);
            return Array.isArray(response) ? response : (response.data || response || []);
        } catch (error) {
            console.error('Error fetching usuarios:', error);
            return [];
        }
    }

    /**
     * Obtener usuarios por rol
     */
    async getUsuariosByRol(roleName: RoleName): Promise<Usuario[]> {
        try {
            const response = await this.client.get<any>(`/usuarios/rol/${roleName}`);
            return Array.isArray(response) ? response : (response.data || response || []);
        } catch (error) {
            console.error(`Error fetching usuarios by rol ${roleName}:`, error);
            return [];
        }
    }

    /**
     * Obtener repartidores disponibles
     */
    async getRepartidoresDisponibles(zoneId: string, fleetType: string): Promise<Usuario[]> {
        try {
            const response = await this.client.get<any>('/usuarios/repartidores/disponibles', {
                zoneId,
                fleetType
            });
            return Array.isArray(response) ? response : (response.data || response || []);
        } catch (error) {
            console.error('Error fetching repartidores disponibles:', error);
            return [];
        }
    }

    /**
     * Batch load múltiples usuarios por IDs
     */
    async batchLoadUsuarios(ids: readonly string[]): Promise<(Usuario | null)[]> {
        try {
            const usuarios = await this.getUsuarios();
            const usuarioMap = new Map<string, Usuario>();

            usuarios.forEach(usuario => {
                usuarioMap.set(usuario.id, usuario);
            });

            return ids.map(id => usuarioMap.get(id) || null);
        } catch (error) {
            console.error('Error batch loading usuarios:', error);
            return ids.map(() => null);
        }
    }
}
