import DataLoader from 'dataloader';
import { DataLoaders } from '../utils/context';
import { UsuarioService } from '../services/usuario.service';
import { FleetService } from '../services/fleet.service';
import { FacturaService } from '../services/factura.service';

/**
 * Crea los DataLoaders para el contexto de GraphQL
 * Cada request tiene sus propios loaders para evitar problemas de state
 */
export function createDataLoaders(): DataLoaders {
    const usuarioService = new UsuarioService();
    const fleetService = new FleetService();
    const facturaService = new FacturaService();

    return {
        usuarioLoader: new DataLoader(async (ids) => {
            console.log(`[DataLoader] Batch loading ${ids.length} usuarios`);
            return usuarioService.batchLoadUsuarios(ids);
        }),

        vehiculoLoader: new DataLoader(async (ids) => {
            console.log(`[DataLoader] Batch loading ${ids.length} vehiculos`);
            return fleetService.batchLoadVehiculos(ids);
        }),

        facturaLoader: new DataLoader(async (pedidoIds) => {
            console.log(`[DataLoader] Batch loading facturas for ${pedidoIds.length} pedidos`);
            return facturaService.batchLoadFacturas(pedidoIds);
        })
    };
}
