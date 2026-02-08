"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacturaService = void 0;
const fetchClient_1 = require("../utils/fetchClient");
/**
 * Servicio para interactuar con el Billing Service
 */
class FacturaService {
    constructor() {
        const baseURL = process.env.BILLING_SERVICE_URL || 'http://localhost:8084/api/v1';
        this.client = new fetchClient_1.FetchClient(baseURL);
    }
    /**
     * Obtener factura por ID
     */
    async getFactura(id) {
        try {
            const response = await this.client.get(`/billing/facturas/${id}`);
            return response.data || response;
        }
        catch (error) {
            console.error(`Error fetching factura ${id}:`, error);
            return null;
        }
    }
    /**
     * Obtener todas las facturas
     */
    async getFacturas(params) {
        try {
            const response = await this.client.get('/billing/facturas', params);
            let facturas = Array.isArray(response) ? response : (response.data || response || []);
            // Aplicar filtros localmente si es necesario
            if (params?.clienteId) {
                facturas = facturas.filter(f => f.clienteId === params.clienteId);
            }
            if (params?.estado) {
                facturas = facturas.filter(f => f.estado === params.estado);
            }
            return facturas;
        }
        catch (error) {
            console.error('Error fetching facturas:', error);
            return [];
        }
    }
    /**
     * Batch load facturas por pedidoIds
     */
    async batchLoadFacturas(pedidoIds) {
        try {
            const facturas = await this.getFacturas();
            const facturaMap = new Map();
            facturas.forEach(factura => {
                facturaMap.set(factura.pedidoId, factura);
            });
            return pedidoIds.map(pedidoId => facturaMap.get(pedidoId) || null);
        }
        catch (error) {
            console.error('Error batch loading facturas:', error);
            return pedidoIds.map(() => null);
        }
    }
}
exports.FacturaService = FacturaService;
//# sourceMappingURL=factura.service.js.map