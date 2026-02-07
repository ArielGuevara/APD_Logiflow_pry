package com.logiflow.pedidoservice_core.service.impl;

import com.logiflow.pedidoservice_core.dto.mapper.PedidoMapper;
import com.logiflow.pedidoservice_core.dto.request.PedidoRequestDto;
import com.logiflow.pedidoservice_core.dto.response.PedidoResponseDto;
import com.logiflow.pedidoservice_core.exception.ResourceNotFoundException;
import com.logiflow.pedidoservice_core.model.Pedido;
import com.logiflow.pedidoservice_core.model.enums.EstadoPedido;
import com.logiflow.pedidoservice_core.model.enums.TipoVehiculo;
import com.logiflow.pedidoservice_core.repository.PedidoRepository;
import com.logiflow.pedidoservice_core.service.PedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final PedidoMapper pedidoMapper;

    @Override
    @Transactional //  Garantiza ACID. Si falla algo, hace rollback.
    public PedidoResponseDto crearPedido(PedidoRequestDto request, UUID clienteId) {


        validarReglasDeNegocio(request);

        Pedido pedido = pedidoMapper.toEntity(request);
        pedido.setClienteId(clienteId);

        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        return pedidoMapper.toResponse(pedidoGuardado);
    }

    @Override
    @Transactional(readOnly = true) // Optimiza para solo lectura
    public PedidoResponseDto obtenerPorId(UUID id) {
        Pedido pedido = pedidoRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado o eliminado"));
        return pedidoMapper.toResponse(pedido);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoResponseDto> listarPorCliente(UUID clienteId) {
        return pedidoRepository.findByClienteIdAndActivoTrue(clienteId).stream()
                .map(pedidoMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoResponseDto> listarPorEstado(EstadoPedido estado) {
        return pedidoRepository.findByEstadoAndActivoTrue(estado).stream()
                .map(pedidoMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelarPedido(UUID id, UUID clienteId) {
        // 1. Buscar el pedido
        Pedido pedido = pedidoRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));

        // 2. Validar que el pedido pertenezca al cliente que quiere cancelar
        if (!pedido.getClienteId().equals(clienteId)) {
            throw new RuntimeException("No tiene permisos para cancelar este pedido");
        }

        // 3. Validar que el estado permita cancelación (solo si no ha sido enviado)
        if (pedido.getEstado() != EstadoPedido.RECIBIDO) {
            throw new RuntimeException("No se puede cancelar un pedido que ya está en proceso");
        }

        // 4. Cancelación Lógica
        pedido.setEstado(EstadoPedido.CANCELADO);
        pedido.setActivo(false);

        pedidoRepository.save(pedido);
    }

    // --- MÉTODOS PRIVADOS DE VALIDACIÓN ---

    private void validarReglasDeNegocio(PedidoRequestDto request) {
        if (request.getTipoVehiculo() == TipoVehiculo.MOTORIZADO && request.getPesoKg() > 20.0) {
            throw new IllegalArgumentException("El peso excede la capacidad para un Motorizado (Max 20kg)");
        }

        if (request.getTipoVehiculo() == TipoVehiculo.CAMION && request.getPesoKg() < 10.0) {
            throw new IllegalArgumentException("Paquetes pequeños deben usar Motorizado o Vehículo Liviano");
        }
    }
}