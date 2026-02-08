import { Usuario, RoleName, UserStatus } from '../entities';
/**
 * Servicio para interactuar con el Auth Service
 */
export declare class UsuarioService {
    private client;
    constructor();
    /**
     * Obtener un usuario por ID
     */
    getUsuario(id: string): Promise<Usuario | null>;
    /**
     * Obtener múltiples usuarios
     */
    getUsuarios(params?: {
        rol?: RoleName;
        zoneId?: string;
        status?: UserStatus;
    }): Promise<Usuario[]>;
    /**
     * Obtener usuarios por rol
     */
    getUsuariosByRol(roleName: RoleName): Promise<Usuario[]>;
    /**
     * Obtener repartidores disponibles
     */
    getRepartidoresDisponibles(zoneId: string, fleetType: string): Promise<Usuario[]>;
    /**
     * Batch load múltiples usuarios por IDs
     */
    batchLoadUsuarios(ids: readonly string[]): Promise<(Usuario | null)[]>;
}
//# sourceMappingURL=usuario.service.d.ts.map