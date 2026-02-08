"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoService = void 0;
const fetchClient_1 = require("../utils/fetchClient");
/**
 * Servicio para interactuar con el Pedido Service
 */
class PedidoService {
    constructor() {
        const baseURL = process.env.PEDIDO_SERVICE_URL || 'http://localhost:8080/api/v1';
        this.client = new fetchClient_1.FetchClient(baseURL);
    }
    /**
     * Obtener un pedido por ID
     */
    async getPedido(id) {
        return this.client.get(`/pedidos/${id}`);
    }
    /**
     * Obtener todos los pedidos
     */
    async getPedidos(filtro) {
        try {
            let path = '/pedidos';
            const params = {};
            if (filtro?.estado) {
                params.estado = filtro.estado;
            }
            const response = await this.client.get(path, params);
            return Array.isArray(response) ? response : (response.data || response);
        }
        catch (error) {
            console.error('Error fetching pedidos:', error);
            return [];
        }
    }
    /**
     * Obtener pedidos de un cliente
     */
    async getPedidosPorCliente(clienteId) {
        try {
            // El endpoint usa el header X-User-Id
            const pedidos = await this.getPedidos();
            return pedidos.filter(p => p.clienteId === clienteId);
        }
        catch (error) {
            console.error('Error fetching pedidos por cliente:', error);
            return [];
        }
    }
    /**
     * Obtener pedidos de un repartidor
     */
    async getPedidosPorRepartidor(repartidorId) {
        try {
            const pedidos = await this.getPedidos();
            return pedidos.filter(p => p.repartidorId === repartidorId);
        }
        catch (error) {
            console.error('Error fetching pedidos por repartidor:', error);
            return [];
        }
    }
}
exports.PedidoService = PedidoService;
//# sourceMappingURL=pedido.service.js.map