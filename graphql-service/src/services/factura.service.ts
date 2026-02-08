import { FetchClient } from '../utils/fetchClient';
import { Factura, EstadoFactura } from '../entities';

/**
 * Servicio para interactuar con el Billing Service
 */
export class FacturaService {
    private client: FetchClient;

    constructor() {
        const baseURL = process.env.BILLING_SERVICE_URL || 'http://localhost:8084/api/v1';
        this.client = new FetchClient(baseURL);
    }

    /**
     * Obtener factura por ID
     */
    async getFactura(id: string): Promise<Factura | null> {
        try {
            const response = await this.client.get<any>(`/billing/facturas/${id}`);
            return response.data || response;
        } catch (error) {
            console.error(`Error fetching factura ${id}:`, error);
            return null;
        }
    }

    /**
     * Obtener todas las facturas
     */
    async getFacturas(params?: { clienteId?: string; estado?: EstadoFactura }): Promise<Factura[]> {
        try {
            const response = await this.client.get<any>('/billing/facturas', params);
            let facturas: Factura[] = Array.isArray(response) ? response : (response.data || response || []);

            // Aplicar filtros localmente si es necesario
            if (params?.clienteId) {
                facturas = facturas.filter(f => f.clienteId === params.clienteId);
            }
            if (params?.estado) {
                facturas = facturas.filter(f => f.estado === params.estado);
            }

            return facturas;
        } catch (error) {
            console.error('Error fetching facturas:', error);
            return [];
        }
    }

    /**
     * Batch load facturas por pedidoIds
     */
    async batchLoadFacturas(pedidoIds: readonly string[]): Promise<(Factura | null)[]> {
        try {
            const facturas = await this.getFacturas();
            const facturaMap = new Map<string, Factura>();

            facturas.forEach(factura => {
                facturaMap.set(factura.pedidoId, factura);
            });

            return pedidoIds.map(pedidoId => facturaMap.get(pedidoId) || null);
        } catch (error) {
            console.error('Error batch loading facturas:', error);
            return pedidoIds.map(() => null);
        }
    }
}
