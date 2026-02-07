package espe.edu.ec.fleet_service.repository;

import espe.edu.ec.fleet_service.model.Vehiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VehiculoRepository extends JpaRepository<Vehiculo, UUID> {
    Optional<Vehiculo> findByPlaca(String placa);

    boolean existsByPlaca(String placa);
}
