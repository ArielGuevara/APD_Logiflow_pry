import { KPIFiltro, KPIDiario, EstadisticasPedidos, PedidoFiltro, RepartidorDesempeno } from '../../entities';
export declare const dashboardQueries: {
    /**
     * Obtener KPI diario
     */
    kpiDiario: (_: any, { filtro }: {
        filtro: KPIFiltro;
    }) => Promise<KPIDiario>;
    /**
     * Obtener estadísticas de pedidos
     */
    estadisticasPedidos: (_: any, { filtro }: {
        filtro?: PedidoFiltro;
    }) => Promise<EstadisticasPedidos>;
    /**
     * Obtener desempeño de repartidores
     */
    desempenoRepartidores: (_: any, { zonaId: _zonaId, fechaDesde: _fechaDesde, fechaHasta: _fechaHasta }: {
        zonaId?: string;
        fechaDesde?: string;
        fechaHasta?: string;
    }) => Promise<RepartidorDesempeno[]>;
};
//# sourceMappingURL=dashboard.queries.d.ts.map