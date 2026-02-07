package com.logiflow.pedidoservice_core.dto.mapper;

import com.logiflow.pedidoservice_core.dto.request.PedidoRequestDto;
import com.logiflow.pedidoservice_core.dto.response.PedidoResponseDto;
import com.logiflow.pedidoservice_core.model.DetalleProducto;
import com.logiflow.pedidoservice_core.model.Pedido;
import com.logiflow.pedidoservice_core.model.enums.EstadoPedido;
import org.springframework.stereotype.Component;

@Component
public class PedidoMapper {


    public Pedido toEntity(PedidoRequestDto request) {

        DetalleProducto detalle = DetalleProducto.builder()
                .descripcion(request.getDescripcionProducto())
                .pesoKg(request.getPesoKg())
                .dimensiones(request.getDimensiones())
                .valorDeclarado(request.getValorDeclarado())
                .esFragil(request.isEsFragil())
                .build();

        return Pedido.builder()
                .direccionRecogida(request.getDireccionRecogida())
                .direccionEntrega(request.getDireccionEntrega())
                .latitud(request.getLatitud())
                .longitud(request.getLongitud())
                .tipoVehiculo(request.getTipoVehiculo())
                .detalleProducto(detalle)
                .estado(EstadoPedido.RECIBIDO) // Estado inicial por defecto
                .activo(true)
                .build();
    }


    public PedidoResponseDto toResponse(Pedido entity) {
        return PedidoResponseDto.builder()
                .id(entity.getId())
                .clienteId(entity.getClienteId())
                .repartidorId(entity.getRepartidorId())
                .direccionRecogida(entity.getDireccionRecogida())
                .direccionEntrega(entity.getDireccionEntrega())
                .tipoVehiculo(entity.getTipoVehiculo())
                .estado(entity.getEstado())
                .costoEstimado(entity.getCostoEstimado())
                // Mapeo manual de campos anidados para facilitar lectura en JSON
                .descripcionProducto(entity.getDetalleProducto().getDescripcion())
                .pesoKg(entity.getDetalleProducto().getPesoKg())
                .esFragil(entity.getDetalleProducto().isEsFragil())
                .fechaCreacion(entity.getFechaCreacion())
                .fechaActualizacion(entity.getFechaActualizacion())
                .build();
    }
}
