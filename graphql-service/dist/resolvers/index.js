"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const pedido_queries_1 = require("./queries/pedido.queries");
const usuario_queries_1 = require("./queries/usuario.queries");
const fleet_queries_1 = require("./queries/fleet.queries");
const factura_queries_1 = require("./queries/factura.queries");
const dashboard_queries_1 = require("./queries/dashboard.queries");
/**
 * Combina todos los resolvers
 */
exports.resolvers = {
    Query: {
        ...pedido_queries_1.pedidoQueries,
        ...usuario_queries_1.usuarioQueries,
        ...fleet_queries_1.fleetQueries,
        ...factura_queries_1.facturaQueries,
        ...dashboard_queries_1.dashboardQueries,
        // Placeholders para otras queries
        zona: () => null,
        zonas: () => []
    },
    Pedido: pedido_queries_1.pedidoFieldResolvers,
    Repartidor: fleet_queries_1.repartidorFieldResolvers,
    Factura: factura_queries_1.facturaFieldResolvers,
    Mutation: {
        _empty: () => 'Mutations should use REST endpoints for traceability'
    }
};
//# sourceMappingURL=index.js.map