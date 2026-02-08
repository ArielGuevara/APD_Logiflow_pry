"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repartidorFieldResolvers = exports.fleetQueries = void 0;
const fleet_service_1 = require("../../services/fleet.service");
const pedido_service_1 = require("../../services/pedido.service");
const entities_1 = require("../../entities");
const fleetService = new fleet_service_1.FleetService();
const pedidoService = new pedido_service_1.PedidoService();
exports.fleetQueries = {
    /**
     * Obtener un vehículo por ID o placa
     */
    vehiculo: async (_, { id, placa }) => {
        if (placa) {
            return fleetService.getVehiculoPorPlaca(placa);
        }
        if (id) {
            const vehiculos = await fleetService.getVehiculos();
            return vehiculos.find(v => v.id === id) || null;
        }
        return null;
    },
    /**
     * Obtener vehículos con filtros
     */
    vehiculos: async (_, { estado, tipoVehiculo }) => {
        return fleetService.getVehiculos({ estado, tipoVehiculo });
    },
    /**
     * Obtener un repartidor por ID
     */
    repartidor: async (_, { id }) => {
        return fleetService.getRepartidor(id);
    },
    /**
     * Obtener repartidores con filtros
     */
    repartidores: async (_, { filtro }) => {
        return fleetService.getRepartidores(filtro);
    },
    /**
     * Obtener resumen de flota activa
     */
    flotaActiva: async (_, { zonaId: _zonaId }) => {
        const vehiculos = await fleetService.getVehiculos();
        const total = vehiculos.length;
        const disponibles = vehiculos.filter(v => v.estado === 'DISPONIBLE').length;
        const enRuta = vehiculos.filter(v => v.estado === 'EN_USO').length;
        const mantenimiento = vehiculos.filter(v => v.estado === 'MANTENIMIENTO').length;
        const inactivos = vehiculos.filter(v => v.estado === 'INACTIVO').length;
        // Agrupar por tipo - using enum values properly
        const tiposVehiculo = [entities_1.TipoVehiculo.MOTO, entities_1.TipoVehiculo.LIVIANO, entities_1.TipoVehiculo.CAMION];
        const porTipo = tiposVehiculo.map(tipo => {
            const vehiculosTipo = vehiculos.filter(v => v.tipoVehiculo === tipo);
            return {
                tipo,
                cantidad: vehiculosTipo.length,
                disponibles: vehiculosTipo.filter(v => v.estado === 'DISPONIBLE').length
            };
        }).filter(item => item.cantidad > 0);
        return {
            total,
            disponibles,
            enRuta,
            mantenimiento,
            inactivos,
            porTipo
        };
    }
};
exports.repartidorFieldResolvers = {
    /**
     * Resolver para el campo 'vehiculo' del Repartidor
     */
    vehiculo: async (repartidor, _, { loaders }) => {
        if (!repartidor.vehiculo)
            return null;
        // Si ya tenemos el objeto completo
        if (typeof repartidor.vehiculo === 'object' && 'id' in repartidor.vehiculo) {
            return repartidor.vehiculo;
        }
        // Si tenemos solo el ID, usar DataLoader
        if (typeof repartidor.vehiculo === 'string') {
            return loaders.vehiculoLoader.load(repartidor.vehiculo);
        }
        return null;
    },
    /**
     * Obtener pedidos activos del repartidor
     */
    pedidosActivos: async (repartidor) => {
        try {
            const pedidos = await pedidoService.getPedidosPorRepartidor(repartidor.id);
            return pedidos.filter(p => p.estado === 'PENDIENTE' || p.estado === 'EN_PROGRESO');
        }
        catch (error) {
            return [];
        }
    },
    /**
     * Contar pedidos completados
     */
    pedidosCompletados: async (repartidor) => {
        try {
            const pedidos = await pedidoService.getPedidosPorRepartidor(repartidor.id);
            return pedidos.filter(p => p.estado === 'ENTREGADO').length;
        }
        catch (error) {
            return 0;
        }
    }
};
//# sourceMappingURL=fleet.queries.js.map