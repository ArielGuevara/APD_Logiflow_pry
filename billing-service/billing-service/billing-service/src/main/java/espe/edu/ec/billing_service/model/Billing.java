package espe.edu.ec.billing_service.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "facturas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Billing {

    @Id
    @UuidGenerator
    @Column(name = "id", columnDefinition = "uuid DEFAULT gen_random_uuid()")
    private UUID id;

    @NotNull
    @Column(nullable = false)
    //@NotBlank(message = "El pedido es obligatorio")
    private UUID pedidoId;

    @NotNull
    @Column(nullable = false)
    //@NotBlank(message = "El cliente es obligatorio")
    private UUID clienteId;

    @NotNull
    @Column(nullable = false)
    //@NotBlank(message = "El subtotal es obligatorio")
    private BigDecimal subtotal;


    //@NotBlank(message = "Los impuestos son obligatorios")
    private BigDecimal impuestos;


    //@NotBlank(message = "El total es obligatorio")
    private BigDecimal total;


    @Column(nullable = false)
    //@NotBlank(message = "La fecha es emisión")
    private LocalDateTime fechaEmision;

    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
    private EstadoType estado;

    @PrePersist
    public void prePersist() {
        this.fechaEmision = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = EstadoType.BORRADOR;
        }
    }
}
