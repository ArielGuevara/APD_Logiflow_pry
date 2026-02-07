package com.logiflow.pedidoservice_core.controller;

import com.logiflow.pedidoservice_core.dto.request.PedidoRequestDto;
import com.logiflow.pedidoservice_core.dto.response.PedidoResponseDto;
import com.logiflow.pedidoservice_core.model.enums.EstadoPedido;
import com.logiflow.pedidoservice_core.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<PedidoResponseDto> crearPedido(
            @RequestHeader("X-User-Id") UUID userId, // El Gateway nos enviará esto
            @Valid @RequestBody PedidoRequestDto request) { // @Valid activa las validaciones del DTO

        PedidoResponseDto nuevoPedido = pedidoService.crearPedido(request, userId);
        return new ResponseEntity<>(nuevoPedido, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponseDto> obtenerPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(pedidoService.obtenerPorId(id));
    }

    @GetMapping("/mis-pedidos")
    public ResponseEntity<List<PedidoResponseDto>> listarMisPedidos(
            @RequestHeader("X-User-Id") UUID userId) {
        return ResponseEntity.ok(pedidoService.listarPorCliente(userId));
    }


    @GetMapping
    public ResponseEntity<List<PedidoResponseDto>> listarPorEstado(
            @RequestParam EstadoPedido estado) {
        return ResponseEntity.ok(pedidoService.listarPorEstado(estado));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelarPedido(
            @RequestHeader("X-User-Id") UUID userId,
            @PathVariable UUID id) {

        pedidoService.cancelarPedido(id, userId);
        return ResponseEntity.noContent().build(); // Retorna 204 No Content
    }
}
