"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardQueries = void 0;
const pedido_service_1 = require("../../services/pedido.service");
const fleet_service_1 = require("../../services/fleet.service");
const usuario_service_1 = require("../../services/usuario.service");
const factura_service_1 = require("../../services/factura.service");
const entities_1 = require("../../entities");
const pedidoService = new pedido_service_1.PedidoService();
const fleetService = new fleet_service_1.FleetService();
const usuarioService = new usuario_service_1.UsuarioService();
const facturaService = new factura_service_1.FacturaService();
exports.dashboardQueries = {
    /**
     * Obtener KPI diario
     */
    kpiDiario: async (_, { filtro }) => {
        const allPedidos = await pedidoService.getPedidos();
        // Filtrar por fecha si se proporciona
        let pedidosFiltrados = allPedidos;
        if (filtro.fecha) {
            const fecha = new Date(filtro.fecha);
            pedidosFiltrados = allPedidos.filter(p => {
                const fechaCreacion = new Date(p.fechaCreacion);
                return fechaCreacion.toDateString() === fecha.toDateString();
            });
        }
        // Calcular métricas
        const totalPedidos = pedidosFiltrados.length;
        const pedidosEntregados = pedidosFiltrados.filter(p => p.estado === 'ENTREGADO').length;
        const pedidosCancelados = pedidosFiltrados.filter(p => p.estado === 'CANCELADO').length;
        const pedidosPendientes = pedidosFiltrados.filter(p => p.estado === 'PENDIENTE').length;
        const tasaExito = totalPedidos > 0 ? (pedidosEntregados / totalPedidos) * 100 : 0;
        // Costo promedio
        const costoTotal = pedidosFiltrados.reduce((sum, p) => sum + (p.costoEstimado || 0), 0);
        const costoPromedio = totalPedidos > 0 ? costoTotal / totalPedidos : 0;
        // Ingresos
        const facturas = await facturaService.getFacturas();
        const facturasFiltradas = filtro.fecha
            ? facturas.filter(f => {
                const fechaEmision = new Date(f.fechaEmision);
                const fecha = new Date(filtro.fecha);
                return fechaEmision.toDateString() === fecha.toDateString();
            })
            : facturas;
        const ingresoTotal = facturasFiltradas.reduce((sum, f) => sum + (f.total || 0), 0);
        return {
            fecha: filtro.fecha || new Date().toISOString().split('T')[0],
            zonaId: filtro.zonaId,
            totalPedidos,
            pedidosEntregados,
            pedidosCancelados,
            pedidosPendientes,
            tasaExito,
            tiempoPromedioEntrega: 25.5,
            costoPromedio,
            ingresoTotal
        };
    },
    /**
     * Obtener estadísticas de pedidos
     */
    estadisticasPedidos: async (_, { filtro }) => {
        let pedidos = await pedidoService.getPedidos(filtro);
        const totalPedidos = pedidos.length;
        // Por estado - using enum values
        const estados = [entities_1.EstadoPedido.PENDIENTE, entities_1.EstadoPedido.EN_PROGRESO, entities_1.EstadoPedido.ENTREGADO, entities_1.EstadoPedido.CANCELADO];
        const porEstado = estados.map(estado => {
            const cantidad = pedidos.filter(p => p.estado === estado).length;
            return {
                estado,
                cantidad,
                porcentaje: totalPedidos > 0 ? (cantidad / totalPedidos) * 100 : 0
            };
        });
        // Por tipo de vehículo - using enum values
        const tipos = [entities_1.TipoVehiculo.MOTO, entities_1.TipoVehiculo.LIVIANO, entities_1.TipoVehiculo.CAMION];
        const porTipoVehiculo = tipos.map(tipo => ({
            tipo,
            cantidad: pedidos.filter(p => p.tipoVehiculo === tipo).length
        })).filter(item => item.cantidad > 0);
        // Por zona
        const porZona = [
            { zonaId: 'ZONA_NORTE', zonaNombre: 'Zona Norte', cantidad: Math.floor(totalPedidos * 0.4) },
            { zonaId: 'ZONA_SUR', zonaNombre: 'Zona Sur', cantidad: Math.floor(totalPedidos * 0.35) },
            { zonaId: 'ZONA_CENTRO', zonaNombre: 'Centro', cantidad: Math.floor(totalPedidos * 0.25) }
        ];
        return {
            totalPedidos,
            porEstado,
            porTipoVehiculo,
            porZona
        };
    },
    /**
     * Obtener desempeño de repartidores
     */
    desempenoRepartidores: async (_, { zonaId: _zonaId, fechaDesde: _fechaDesde, fechaHasta: _fechaHasta }) => {
        const repartidores = await fleetService.getRepartidores();
        const usuarios = await usuarioService.getUsuarios();
        const pedidos = await pedidoService.getPedidos();
        const desempenos = [];
        for (const repartidorFleet of repartidores) {
            // Buscar usuario correspondiente
            const usuario = usuarios.find(u => u.nombre === repartidorFleet.nombre && u.apellido === repartidorFleet.apellido);
            if (!usuario)
                continue;
            // Filtrar pedidos del repartidor
            const pedidosRepartidor = pedidos.filter(p => p.repartidorId === usuario.id);
            const pedidosCompletados = pedidosRepartidor.filter(p => p.estado === 'ENTREGADO').length;
            const pedidosCancelados = pedidosRepartidor.filter(p => p.estado === 'CANCELADO').length;
            const total = pedidosCompletados + pedidosCancelados;
            const tasaExito = total > 0 ? (pedidosCompletados / total) * 100 : 0;
            desempenos.push({
                repartidor: usuario,
                pedidosCompletados,
                pedidosCancelados,
                tasaExito,
                tiempoPromedioEntrega: 28.0,
                calificacionPromedio: 4.5
            });
        }
        return desempenos.sort((a, b) => b.pedidosCompletados - a.pedidosCompletados);
    }
};
//# sourceMappingURL=dashboard.queries.js.map