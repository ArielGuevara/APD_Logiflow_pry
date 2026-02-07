package espe.edu.ec.billing_service.repository;

import espe.edu.ec.billing_service.model.Billing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface BillingRepository extends JpaRepository<Billing,UUID > {
    Optional<Billing> findById(UUID id);
}
