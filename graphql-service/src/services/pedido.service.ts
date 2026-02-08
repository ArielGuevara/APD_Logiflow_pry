import { FetchClient } from '../utils/fetchClient';
import { Pedido, PedidoFiltro } from '../entities';

/**
 * Servicio para interactuar con el Pedido Service
 */
export class PedidoService {
    private client: FetchClient;

    constructor() {
        const baseURL = process.env.PEDIDO_SERVICE_URL || 'http://localhost:8080/api/v1';
        this.client = new FetchClient(baseURL);
    }

    /**
     * Obtener un pedido por ID
     */
    async getPedido(id: string): Promise<Pedido> {
        return this.client.get<Pedido>(`/pedidos/${id}`);
    }

    /**
     * Obtener todos los pedidos
     */
    async getPedidos(filtro?: PedidoFiltro): Promise<Pedido[]> {
        try {
            let path = '/pedidos';
            const params: Record<string, any> = {};

            if (filtro?.estado) {
                params.estado = filtro.estado;
            }

            const response = await this.client.get<any>(path, params);
            return Array.isArray(response) ? response : (response.data || response);
        } catch (error) {
            console.error('Error fetching pedidos:', error);
            return [];
        }
    }

    /**
     * Obtener pedidos de un cliente
     */
    async getPedidosPorCliente(clienteId: string): Promise<Pedido[]> {
        try {
            // El endpoint usa el header X-User-Id
            const pedidos = await this.getPedidos();
            return pedidos.filter(p => p.clienteId === clienteId);
        } catch (error) {
            console.error('Error fetching pedidos por cliente:', error);
            return [];
        }
    }

    /**
     * Obtener pedidos de un repartidor
     */
    async getPedidosPorRepartidor(repartidorId: string): Promise<Pedido[]> {
        try {
            const pedidos = await this.getPedidos();
            return pedidos.filter(p => p.repartidorId === repartidorId);
        } catch (error) {
            console.error('Error fetching pedidos por repartidor:', error);
            return [];
        }
    }
}
