"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioQueries = void 0;
const usuario_service_1 = require("../../services/usuario.service");
const usuarioService = new usuario_service_1.UsuarioService();
exports.usuarioQueries = {
    /**
     * Obtener un usuario por ID
     */
    usuario: async (_, { id }) => {
        return usuarioService.getUsuario(id);
    },
    /**
     * Obtener usuarios con filtros
     */
    usuarios: async (_, { rol, zoneId, status }) => {
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
    repartidoresDisponibles: async (_, { zonaId, fleetType }) => {
        return usuarioService.getRepartidoresDisponibles(zonaId, fleetType);
    }
};
//# sourceMappingURL=usuario.queries.js.map