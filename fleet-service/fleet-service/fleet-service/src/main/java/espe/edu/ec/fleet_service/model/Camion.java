package espe.edu.ec.fleet_service.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.aspectj.bridge.IMessage;

@Entity
@Data
@Table(name = "camion")
@EqualsAndHashCode(callSuper = false)
@DiscriminatorValue("CAMION")
@PrimaryKeyJoinColumn(name = "vehiculo_id")
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Camion extends Vehiculo {
    @Column(nullable = false)
    @Min(value = 1, message = "Minimo es 1 tonelada")
    @Max(value = 20, message = "El máximo es 20 toneladas")
    private Double capacidadToneladas;
}
