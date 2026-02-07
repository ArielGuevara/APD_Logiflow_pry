package com.logiflow.pedidoservice_core.dto.response;

import com.logiflow.pedidoservice_core.model.enums.EstadoPedido;
import com.logiflow.pedidoservice_core.model.enums.TipoVehiculo;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class PedidoResponseDto {

    private UUID id;
    private UUID clienteId;
    private UUID repartidorId;

    private String direccionRecogida;
    private String direccionEntrega;

    private TipoVehiculo tipoVehiculo;
    private EstadoPedido estado;
    private BigDecimal costoEstimado;

    // Datos del producto (Simplificado para visualización)
    private String descripcionProducto;
    private Double pesoKg;
    private boolean esFragil;

    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}