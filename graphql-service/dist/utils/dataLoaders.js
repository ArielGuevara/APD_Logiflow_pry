"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDataLoaders = createDataLoaders;
const dataloader_1 = __importDefault(require("dataloader"));
const usuario_service_1 = require("../services/usuario.service");
const fleet_service_1 = require("../services/fleet.service");
const factura_service_1 = require("../services/factura.service");
/**
 * Crea los DataLoaders para el contexto de GraphQL
 * Cada request tiene sus propios loaders para evitar problemas de state
 */
function createDataLoaders() {
    const usuarioService = new usuario_service_1.UsuarioService();
    const fleetService = new fleet_service_1.FleetService();
    const facturaService = new factura_service_1.FacturaService();
    return {
        usuarioLoader: new dataloader_1.default(async (ids) => {
            console.log(`[DataLoader] Batch loading ${ids.length} usuarios`);
            return usuarioService.batchLoadUsuarios(ids);
        }),
        vehiculoLoader: new dataloader_1.default(async (ids) => {
            console.log(`[DataLoader] Batch loading ${ids.length} vehiculos`);
            return fleetService.batchLoadVehiculos(ids);
        }),
        facturaLoader: new dataloader_1.default(async (pedidoIds) => {
            console.log(`[DataLoader] Batch loading facturas for ${pedidoIds.length} pedidos`);
            return facturaService.batchLoadFacturas(pedidoIds);
        })
    };
}
//# sourceMappingURL=dataLoaders.js.map