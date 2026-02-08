"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pedidoFieldResolvers = exports.pedidoQueries = void 0;
const pedido_service_1 = require("../../services/pedido.service");
const pedidoService = new pedido_service_1.PedidoService();
exports.pedidoQueries = {
    /**
     * Obtener un pedido por ID
     */
    pedido: async (_, { id }) => {
        return pedidoService.getPedido(id);
    },
    /**
     * Obtener pedidos con filtros
     */
    pedidos: async (_, { filtro }) => {
        const pedidos = await pedidoService.getPedidos(filtro);
        // Aplicar filtros adicionales que no maneja el servicio
        if (!filtro)
            return pedidos;
        let filtered = pedidos;
        if (filtro.tipoVehiculo) {
            filtered = filtered.filter(p => p.tipoVehiculo === filtro.tipoVehiculo);
        }
        if (filtro.clienteId) {
            filtered = filtered.filter(p => p.clienteId === filtro.clienteId);
        }
        if (filtro.repartidorId) {
            filtered = filtered.filter(p => p.repartidorId === filtro.repartidorId);
        }
        return filtered;
    },
    /**
     * Obtener pedidos de un cliente
     */
    pedidosPorCliente: async (_, { clienteId }) => {
        return pedidoService.getPedidosPorCliente(clienteId);
    },
    /**
     * Obtener pedidos de un repartidor
     */
    pedidosPorRepartidor: async (_, { repartidorId }) => {
        return pedidoService.getPedidosPorRepartidor(repartidorId);
    }
};
exports.pedidoFieldResolvers = {
    /**
     * Resolver para el campo 'cliente' del Pedido
     */
    cliente: async (pedido, _, { loaders }) => {
        if (!pedido.clienteId)
            return null;
        return loaders.usuarioLoader.load(pedido.clienteId);
    },
    /**
     * Resolver para el campo 'repartidor' del Pedido
     */
    repartidor: async (pedido, _, { loaders }) => {
        if (!pedido.repartidorId)
            return null;
        return loaders.usuarioLoader.load(pedido.repartidorId);
    },
    /**
     * Resolver para el campo 'factura' del Pedido
     */
    factura: async (pedido, _, { loaders }) => {
        return loaders.facturaLoader.load(pedido.id);
    },
    /**
     * Calcula tiempo transcurrido en minutos
     */
    tiempoTranscurrido: (pedido) => {
        if (!pedido.fechaCreacion)
            return null;
        const creacion = new Date(pedido.fechaCreacion);
        const ahora = new Date();
        const diffMs = ahora.getTime() - creacion.getTime();
        return Math.floor(diffMs / (1000 * 60));
    },
    /**
     * Calcula retraso en minutos
     */
    retrasoMin: (pedido) => {
        if (pedido.estado === 'ENTREGADO' || pedido.estado === 'CANCELADO') {
            return null;
        }
        if (!pedido.fechaCreacion)
            return null;
        const creacion = new Date(pedido.fechaCreacion);
        const ahora = new Date();
        const diffMs = ahora.getTime() - creacion.getTime();
        const minutos = Math.floor(diffMs / (1000 * 60));
        const tiempoEsperado = 30;
        return minutos > tiempoEsperado ? minutos - tiempoEsperado : 0;
    }
};
//# sourceMappingURL=pedido.queries.js.map