"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.facturaFieldResolvers = exports.facturaQueries = void 0;
const factura_service_1 = require("../../services/factura.service");
const pedido_service_1 = require("../../services/pedido.service");
const facturaService = new factura_service_1.FacturaService();
const pedidoService = new pedido_service_1.PedidoService();
exports.facturaQueries = {
    /**
     * Obtener una factura por ID
     */
    factura: async (_, { id }) => {
        return facturaService.getFactura(id);
    },
    /**
     * Obtener facturas con filtros
     */
    facturas: async (_, { clienteId, estado }) => {
        return facturaService.getFacturas({ clienteId, estado });
    }
};
exports.facturaFieldResolvers = {
    /**
     * Resolver para el campo 'pedido' de la Factura
     */
    pedido: async (factura) => {
        if (!factura.pedidoId)
            return null;
        try {
            return await pedidoService.getPedido(factura.pedidoId);
        }
        catch (error) {
            return null;
        }
    },
    /**
     * Resolver para el campo 'cliente' de la Factura
     */
    cliente: async (factura, _, { loaders }) => {
        if (!factura.clienteId)
            return null;
        return loaders.usuarioLoader.load(factura.clienteId);
    }
};
//# sourceMappingURL=factura.queries.js.map