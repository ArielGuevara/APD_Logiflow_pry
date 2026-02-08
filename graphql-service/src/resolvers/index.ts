import { pedidoQueries, pedidoFieldResolvers } from './queries/pedido.queries';
import { usuarioQueries } from './queries/usuario.queries';
import { fleetQueries, repartidorFieldResolvers } from './queries/fleet.queries';
import { facturaQueries, facturaFieldResolvers } from './queries/factura.queries';
import { dashboardQueries } from './queries/dashboard.queries';

/**
 * Combina todos los resolvers
 */
export const resolvers = {
    Query: {
        ...pedidoQueries,
        ...usuarioQueries,
        ...fleetQueries,
        ...facturaQueries,
        ...dashboardQueries,

        // Placeholders para otras queries
        zona: () => null,
        zonas: () => []
    },

    Pedido: pedidoFieldResolvers,
    Repartidor: repartidorFieldResolvers,
    Factura: facturaFieldResolvers,

    Mutation: {
        _empty: () => 'Mutations should use REST endpoints for traceability'
    }
};
