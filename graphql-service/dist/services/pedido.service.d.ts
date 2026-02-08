import { Pedido, PedidoFiltro } from '../entities';
/**
 * Servicio para interactuar con el Pedido Service
 */
export declare class PedidoService {
    private client;
    constructor();
    /**
     * Obtener un pedido por ID
     */
    getPedido(id: string): Promise<Pedido>;
    /**
     * Obtener todos los pedidos
     */
    getPedidos(filtro?: PedidoFiltro): Promise<Pedido[]>;
    /**
     * Obtener pedidos de un cliente
     */
    getPedidosPorCliente(clienteId: string): Promise<Pedido[]>;
    /**
     * Obtener pedidos de un repartidor
     */
    getPedidosPorRepartidor(repartidorId: string): Promise<Pedido[]>;
}
//# sourceMappingURL=pedido.service.d.ts.map