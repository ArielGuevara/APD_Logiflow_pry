import { UsuarioService } from '../../services/usuario.service';
import { Usuario, RoleName, UserStatus, FleetType } from '../../entities';

const usuarioService = new UsuarioService();

export const usuarioQueries = {
    /**
     * Obtener un usuario por ID
     */
    usuario: async (_: any, { id }: { id: string }): Promise<Usuario | null> => {
        return usuarioService.getUsuario(id);
    },

    /**
     * Obtener usuarios con filtros
     */
    usuarios: async (
        _: any,
        { rol, zoneId, status }: { rol?: RoleName; zoneId?: string; status?: UserStatus }
    ): Promise<Usuario[]> => {
        if (rol) {
            return usuarioService.getUsuariosByRol(rol);
        }

        let usuarios = await usuarioService.getUsuarios();

        if (zoneId) {
            usuarios = usuarios.filter(u => u.zoneId === zoneId);
        }
        if (status) {
            usuarios = usuarios.filter(u => u.status === status);
        }

        return usuarios;
    },

    /**
     * Obtener repartidores disponibles
     */
    repartidoresDisponibles: async (
        _: any,
        { zonaId, fleetType }: { zonaId: string; fleetType: FleetType }
    ): Promise<Usuario[]> => {
        return usuarioService.getRepartidoresDisponibles(zonaId, fleetType);
    }
};
