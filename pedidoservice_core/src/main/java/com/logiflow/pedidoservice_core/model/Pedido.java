package com.logiflow.pedidoservice_core.model;

import com.logiflow.pedidoservice_core.model.enums.EstadoPedido;
import com.logiflow.pedidoservice_core.model.enums.TipoVehiculo;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "pedidos")
@Data // Lombok para getters, setters, toString, etc.
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pedido {

    @Id
    @UuidGenerator
    @Column(name = "id", columnDefinition = "uuid DEFAULT gen_random_uuid()")
    private UUID id;

    // ID del usuario/cliente que hace el pedido (viene del token JWT)
    @Column(nullable = false)
    private UUID clienteId;

    // ID del repartidor asignado (puede ser nulo al inicio)
    private UUID repartidorId;

    @Column(nullable = false)
    private String direccionRecogida;

    @Column(nullable = false)
    private String direccionEntrega;

    // Coordenadas (cobertura geográfica)
    private Double latitud;
    private Double longitud;

    @Embedded
    private DetalleProducto detalleProducto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoVehiculo tipoVehiculo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPedido estado;

    // Costo calculado (se integrará con BillingService después)
    private BigDecimal costoEstimado;

    // Para cancelación lógica
    @Builder.Default
    private boolean activo = true;

    @Column(updatable = false)
    private LocalDateTime fechaCreacion;

    private LocalDateTime fechaActualizacion;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = EstadoPedido.RECIBIDO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }
}
