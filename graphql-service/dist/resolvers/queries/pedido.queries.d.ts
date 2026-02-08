import { GraphQLContext } from '../../utils/context';
import { Pedido, PedidoFiltro } from '../../entities';
export declare const pedidoQueries: {
    /**
     * Obtener un pedido por ID
     */
    pedido: (_: any, { id }: {
        id: string;
    }) => Promise<Pedido | null>;
    /**
     * Obtener pedidos con filtros
     */
    pedidos: (_: any, { filtro }: {
        filtro?: PedidoFiltro;
    }) => Promise<Pedido[]>;
    /**
     * Obtener pedidos de un cliente
     */
    pedidosPorCliente: (_: any, { clienteId }: {
        clienteId: string;
    }) => Promise<Pedido[]>;
    /**
     * Obtener pedidos de un repartidor
     */
    pedidosPorRepartidor: (_: any, { repartidorId }: {
        repartidorId: string;
    }) => Promise<Pedido[]>;
};
export declare const pedidoFieldResolvers: {
    /**
     * Resolver para el campo 'cliente' del Pedido
     */
    cliente: (pedido: Pedido, _: any, { loaders }: GraphQLContext) => Promise<import("../../entities").Usuario | null>;
    /**
     * Resolver para el campo 'repartidor' del Pedido
     */
    repartidor: (pedido: Pedido, _: any, { loaders }: GraphQLContext) => Promise<import("../../entities").Usuario | null>;
    /**
     * Resolver para el campo 'factura' del Pedido
     */
    factura: (pedido: Pedido, _: any, { loaders }: GraphQLContext) => Promise<import("../../entities").Factura | null>;
    /**
     * Calcula tiempo transcurrido en minutos
     */
    tiempoTranscurrido: (pedido: Pedido) => number | null;
    /**
     * Calcula retraso en minutos
     */
    retrasoMin: (pedido: Pedido) => number | null;
};
//# sourceMappingURL=pedido.queries.d.ts.map