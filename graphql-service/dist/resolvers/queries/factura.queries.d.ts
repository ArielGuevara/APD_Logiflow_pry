import { GraphQLContext } from '../../utils/context';
import { Factura, EstadoFactura, Pedido } from '../../entities';
export declare const facturaQueries: {
    /**
     * Obtener una factura por ID
     */
    factura: (_: any, { id }: {
        id: string;
    }) => Promise<Factura | null>;
    /**
     * Obtener facturas con filtros
     */
    facturas: (_: any, { clienteId, estado }: {
        clienteId?: string;
        estado?: EstadoFactura;
    }) => Promise<Factura[]>;
};
export declare const facturaFieldResolvers: {
    /**
     * Resolver para el campo 'pedido' de la Factura
     */
    pedido: (factura: Factura) => Promise<Pedido | null>;
    /**
     * Resolver para el campo 'cliente' de la Factura
     */
    cliente: (factura: Factura, _: any, { loaders }: GraphQLContext) => Promise<import("../../entities").Usuario | null>;
};
//# sourceMappingURL=factura.queries.d.ts.map