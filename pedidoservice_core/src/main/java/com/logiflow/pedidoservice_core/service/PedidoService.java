package com.logiflow.pedidoservice_core.service;

import com.logiflow.pedidoservice_core.dto.request.PedidoRequestDto;
import com.logiflow.pedidoservice_core.dto.response.PedidoResponseDto;
import com.logiflow.pedidoservice_core.model.enums.EstadoPedido;

import java.util.List;
import java.util.UUID;

public interface PedidoService {

    PedidoResponseDto crearPedido(PedidoRequestDto request, UUID clienteId);

    PedidoResponseDto obtenerPorId(UUID id);

    List<PedidoResponseDto> listarPorCliente(UUID clienteId);

    List<PedidoResponseDto> listarPorEstado(EstadoPedido estado);

    void cancelarPedido(UUID id, UUID clienteId);
}