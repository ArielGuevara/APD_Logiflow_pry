package espe.edu.ec.fleet_service.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Data
@Table(name = "auto")
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("LIVIANO")
@PrimaryKeyJoinColumn(name = "vehiculo_id")
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Liviano extends Vehiculo {
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AutoType tipoAuto;

    @Column(nullable = false)
    @NotBlank(message = "El tipo de combustible es obligatorio")
    private String tipoCombustible;

    @Column(nullable = false)
    @NotNull(message = "El número de puertas es obligatorio")
    @Min(value = 2, message = "Mínimo 2 puertas")
    @Max(value = 5, message = "Máximo 5 puertas")
    private Integer numeroPuertas;

    @Column(nullable = false)
    @NotNull(message = "La capacidad del maletero es obligatoria")
    @Positive(message = "La capacidad debe ser un número positivo")
    private Double capacidadMaleteroLitros;

    @Column(nullable = false)
    @NotNull(message = "La capacidad de ocupantes es obligatoria")
    @Min(value = 1, message = "Mínimo 1 ocupante")
    @Max(value = 10, message = "Máximo 10 ocupantes")
    private Integer capacidadOcupantes;

    @Column(nullable = false)
    @NotBlank(message="La transmisión es obligatoria")
    private String transmision;
}

