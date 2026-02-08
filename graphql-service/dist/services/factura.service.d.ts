import { Factura, EstadoFactura } from '../entities';
/**
 * Servicio para interactuar con el Billing Service
 */
export declare class FacturaService {
    private client;
    constructor();
    /**
     * Obtener factura por ID
     */
    getFactura(id: string): Promise<Factura | null>;
    /**
     * Obtener todas las facturas
     */
    getFacturas(params?: {
        clienteId?: string;
        estado?: EstadoFactura;
    }): Promise<Factura[]>;
    /**
     * Batch load facturas por pedidoIds
     */
    batchLoadFacturas(pedidoIds: readonly string[]): Promise<(Factura | null)[]>;
}
//# sourceMappingURL=factura.service.d.ts.map