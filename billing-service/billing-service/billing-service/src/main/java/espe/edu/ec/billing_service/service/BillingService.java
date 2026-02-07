package espe.edu.ec.billing_service.service;

import espe.edu.ec.billing_service.model.Billing;
import espe.edu.ec.billing_service.model.EstadoType;
import espe.edu.ec.billing_service.repository.BillingRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
public class BillingService {

    private final BillingRepository billingRepository;
    private static final BigDecimal TASA_IMPUESTO = new BigDecimal("0.15");

    public BillingService(BillingRepository billingRepository) {
        this.billingRepository = billingRepository;
    }

    public Billing generarFactura(Billing billing) {
        BigDecimal subtotal = billing.getSubtotal();
        BigDecimal impuestos = subtotal.multiply(TASA_IMPUESTO).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(impuestos);

        billing.setImpuestos(impuestos);
        billing.setTotal(total);
        billing.setEstado(EstadoType.BORRADOR);

        return billingRepository.save(billing);
    }

    public List<Billing> listarFacturas() {
        return billingRepository.findAll();
    }

    public Billing buscarPorId(UUID id) {
        return billingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Factura no encontrada"));
    }
}