import { Usuario, RoleName, UserStatus, FleetType } from '../../entities';
export declare const usuarioQueries: {
    /**
     * Obtener un usuario por ID
     */
    usuario: (_: any, { id }: {
        id: string;
    }) => Promise<Usuario | null>;
    /**
     * Obtener usuarios con filtros
     */
    usuarios: (_: any, { rol, zoneId, status }: {
        rol?: RoleName;
        zoneId?: string;
        status?: UserStatus;
    }) => Promise<Usuario[]>;
    /**
     * Obtener repartidores disponibles
     */
    repartidoresDisponibles: (_: any, { zonaId, fleetType }: {
        zonaId: string;
        fleetType: FleetType;
    }) => Promise<Usuario[]>;
};
//# sourceMappingURL=usuario.queries.d.ts.map