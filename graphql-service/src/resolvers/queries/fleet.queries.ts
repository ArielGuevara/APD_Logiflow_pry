import { GraphQLContext } from '../../utils/context';
import { FleetService } from '../../services/fleet.service';
import { PedidoService } from '../../services/pedido.service';
import {
    Vehiculo,
    Repartidor,
    EstadoVehiculo,
    TipoVehiculo,
    RepartidorFiltro,
    FlotaResumen
} from '../../entities';

const fleetService = new FleetService();
const pedidoService = new PedidoService();

export const fleetQueries = {
    /**
     * Obtener un vehículo por ID o placa
     */
    vehiculo: async (
        _: any,
        { id, placa }: { id?: string; placa?: string }
    ): Promise<Vehiculo | null> => {
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
    vehiculos: async (
        _: any,
        { estado, tipoVehiculo }: { estado?: EstadoVehiculo; tipoVehiculo?: TipoVehiculo }
    ): Promise<Vehiculo[]> => {
        return fleetService.getVehiculos({ estado, tipoVehiculo });
    },

    /**
     * Obtener un repartidor por ID
     */
    repartidor: async (_: any, { id }: { id: string }): Promise<Repartidor | null> => {
        return fleetService.getRepartidor(id);
    },

    /**
     * Obtener repartidores con filtros
     */
    repartidores: async (_: any, { filtro }: { filtro?: RepartidorFiltro }): Promise<Repartidor[]> => {
        return fleetService.getRepartidores(filtro);
    },

    /**
     * Obtener resumen de flota activa
     */
    flotaActiva: async (_: any, { zonaId: _zonaId }: { zonaId?: string }): Promise<FlotaResumen> => {
        const vehiculos = await fleetService.getVehiculos();

        const total = vehiculos.length;
        const disponibles = vehiculos.filter(v => v.estado === 'DISPONIBLE').length;
        const enRuta = vehiculos.filter(v => v.estado === 'EN_USO').length;
        const mantenimiento = vehiculos.filter(v => v.estado === 'MANTENIMIENTO').length;
        const inactivos = vehiculos.filter(v => v.estado === 'INACTIVO').length;

        // Agrupar por tipo - using enum values properly
        const tiposVehiculo = [TipoVehiculo.MOTO, TipoVehiculo.LIVIANO, TipoVehiculo.CAMION];
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

export const repartidorFieldResolvers = {
    /**
     * Resolver para el campo 'vehiculo' del Repartidor
     */
    vehiculo: async (repartidor: Repartidor, _: any, { loaders }: GraphQLContext) => {
        if (!repartidor.vehiculo) return null;

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
    pedidosActivos: async (repartidor: Repartidor): Promise<any[]> => {
        try {
            const pedidos = await pedidoService.getPedidosPorRepartidor(repartidor.id);
            return pedidos.filter(p => p.estado === 'PENDIENTE' || p.estado === 'EN_PROGRESO');
        } catch (error) {
            return [];
        }
    },

    /**
     * Contar pedidos completados
     */
    pedidosCompletados: async (repartidor: Repartidor): Promise<number> => {
        try {
            const pedidos = await pedidoService.getPedidosPorRepartidor(repartidor.id);
            return pedidos.filter(p => p.estado === 'ENTREGADO').length;
        } catch (error) {
            return 0;
        }
    }
};
