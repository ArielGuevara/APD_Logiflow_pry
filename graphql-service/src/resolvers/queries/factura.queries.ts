import { GraphQLContext } from '../../utils/context';
import { FacturaService } from '../../services/factura.service';
import { PedidoService } from '../../services/pedido.service';
import { Factura, EstadoFactura, Pedido } from '../../entities';

const facturaService = new FacturaService();
const pedidoService = new PedidoService();

export const facturaQueries = {
    /**
     * Obtener una factura por ID
     */
    factura: async (_: any, { id }: { id: string }): Promise<Factura | null> => {
        return facturaService.getFactura(id);
    },

    /**
     * Obtener facturas con filtros
     */
    facturas: async (
        _: any,
        { clienteId, estado }: { clienteId?: string; estado?: EstadoFactura }
    ): Promise<Factura[]> => {
        return facturaService.getFacturas({ clienteId, estado });
    }
};

export const facturaFieldResolvers = {
    /**
     * Resolver para el campo 'pedido' de la Factura
     */
    pedido: async (factura: Factura): Promise<Pedido | null> => {
        if (!factura.pedidoId) return null;
        try {
            return await pedidoService.getPedido(factura.pedidoId);
        } catch (error) {
            return null;
        }
    },

    /**
     * Resolver para el campo 'cliente' de la Factura
     */
    cliente: async (factura: Factura, _: any, { loaders }: GraphQLContext) => {
        if (!factura.clienteId) return null;
        return loaders.usuarioLoader.load(factura.clienteId);
    }
};
