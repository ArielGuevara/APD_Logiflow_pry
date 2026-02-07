package com.logiflow.pedidoservice_core.repository;

import com.logiflow.pedidoservice_core.model.Pedido;
import com.logiflow.pedidoservice_core.model.enums.EstadoPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // --- MÉTODOS PARA SOPORTAR CANCELACIÓN LÓGICA ---

    // Buscar todos los pedidos que NO han sido eliminados lógicamente
    List<Pedido> findByActivoTrue();

    // Buscar un pedido por ID solo si está activo
    Optional<Pedido> findByIdAndActivoTrue(UUID id);

    // --- MÉTODOS DE FILTRADO PARA NEGOCIO ---

    // Para que el Cliente vea su historial (solo activos)
    List<Pedido> findByClienteIdAndActivoTrue(UUID clienteId);

    // Para que el Supervisor filtre por estado (ej. RECIBIDO, EN_RUTA)
    // El documento menciona que el supervisor debe "consultar y ver su estado"
    List<Pedido> findByEstadoAndActivoTrue(EstadoPedido estado);

    // Para ver los pedidos asignados a un repartidor específico
    List<Pedido> findByRepartidorIdAndActivoTrue(UUID repartidorId);
}