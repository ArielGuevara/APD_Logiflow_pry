import { GraphQLContext } from '../../utils/context';
import { PedidoService } from '../../services/pedido.service';
import { Pedido, PedidoFiltro } from '../../entities';

const pedidoService = new PedidoService();

export const pedidoQueries = {
    /**
     * Obtener un pedido por ID
     */
    pedido: async (_: any, { id }: { id: string }): Promise<Pedido | null> => {
        return pedidoService.getPedido(id);
    },

    /**
     * Obtener pedidos con filtros
     */
    pedidos: async (_: any, { filtro }: { filtro?: PedidoFiltro }): Promise<Pedido[]> => {
        const pedidos = await pedidoService.getPedidos(filtro);

        // Aplicar filtros adicionales que no maneja el servicio
        if (!filtro) return pedidos;

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
    pedidosPorCliente: async (_: any, { clienteId }: { clienteId: string }): Promise<Pedido[]> => {
        return pedidoService.getPedidosPorCliente(clienteId);
    },

    /**
     * Obtener pedidos de un repartidor
     */
    pedidosPorRepartidor: async (_: any, { repartidorId }: { repartidorId: string }): Promise<Pedido[]> => {
        return pedidoService.getPedidosPorRepartidor(repartidorId);
    }
};

export const pedidoFieldResolvers = {
    /**
     * Resolver para el campo 'cliente' del Pedido
     */
    cliente: async (pedido: Pedido, _: any, { loaders }: GraphQLContext) => {
        if (!pedido.clienteId) return null;
        return loaders.usuarioLoader.load(pedido.clienteId);
    },

    /**
     * Resolver para el campo 'repartidor' del Pedido
     */
    repartidor: async (pedido: Pedido, _: any, { loaders }: GraphQLContext) => {
        if (!pedido.repartidorId) return null;
        return loaders.usuarioLoader.load(pedido.repartidorId);
    },

    /**
     * Resolver para el campo 'factura' del Pedido
     */
    factura: async (pedido: Pedido, _: any, { loaders }: GraphQLContext) => {
        return loaders.facturaLoader.load(pedido.id);
    },

    /**
     * Calcula tiempo transcurrido en minutos
     */
    tiempoTranscurrido: (pedido: Pedido): number | null => {
        if (!pedido.fechaCreacion) return null;
        const creacion = new Date(pedido.fechaCreacion);
        const ahora = new Date();
        const diffMs = ahora.getTime() - creacion.getTime();
        return Math.floor(diffMs / (1000 * 60));
    },

    /**
     * Calcula retraso en minutos
     */
    retrasoMin: (pedido: Pedido): number | null => {
        if (pedido.estado === 'ENTREGADO' || pedido.estado === 'CANCELADO') {
            return null;
        }
        if (!pedido.fechaCreacion) return null;

        const creacion = new Date(pedido.fechaCreacion);
        const ahora = new Date();
        const diffMs = ahora.getTime() - creacion.getTime();
        const minutos = Math.floor(diffMs / (1000 * 60));
        const tiempoEsperado = 30;

        return minutos > tiempoEsperado ? minutos - tiempoEsperado : 0;
    }
};
