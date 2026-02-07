package espe.edu.ec.fleet_service.model;

import espe.edu.ec.fleet_service.model.validator.CedulaEcuador;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Data
@Table(name = "repartidor")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Repartidor {
    @Id
    @UuidGenerator
    @Column(name = "id", columnDefinition = "uuid DEFAULT gen_random_uuid()")
    private UUID id;

    @Column(unique = true, nullable = false)
    @CedulaEcuador
    private String identificacion;

    @NotBlank
    private String nombre;

    @NotBlank
    private String apellido;

    @NotBlank
    private String telefono;

    @NotBlank
    private String licencia;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "vehiculo_id")
    private Vehiculo vehiculo;

    private TipoEstado estado;
}
