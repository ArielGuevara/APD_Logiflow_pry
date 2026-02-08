package espe.edu.ec.fleet_service.service;

import espe.edu.ec.fleet_service.dto.NotificationEventDto;
import espe.edu.ec.fleet_service.model.EstadoVehiculo;
import espe.edu.ec.fleet_service.model.Repartidor;
import espe.edu.ec.fleet_service.model.Vehiculo;
import espe.edu.ec.fleet_service.repository.RepartidorRepository;
import espe.edu.ec.fleet_service.repository.VehiculoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class FleetService {

    private final VehiculoRepository vehiculoRepository;
    private final RepartidorRepository repartidorRepository;
    private final NotificationProducer notificationProducer;

    public FleetService(VehiculoRepository vehiculoRepository, RepartidorRepository repartidorRepository, NotificationProducer notificationProducer) {
        this.vehiculoRepository = vehiculoRepository;
        this.repartidorRepository = repartidorRepository;
        this.notificationProducer = notificationProducer;
    }

    //vehiculos
    @Transactional
    public Vehiculo crearVehiculo(Vehiculo vehiculo) {
        if (vehiculoRepository.existsByPlaca(vehiculo.getPlaca())) {
            throw new RuntimeException("Ya existe un vehículo con la placa: " + vehiculo.getPlaca());
        }
        if (vehiculo.getEstado() == null) {
            vehiculo.setEstado(EstadoVehiculo.DISPONIBLE);
        }

        Vehiculo actualizado = vehiculoRepository.save(vehiculo);

        try {
            notificationProducer.sendVehiculoCreate(actualizado.getId(),
                    actualizado.getPlaca(),
                    actualizado.getColor(),
                    actualizado.getAnioFabricacion(),
                    actualizado.getTipoVehiculo().toString(),
                    actualizado.getMarca());
        } catch (Exception e) {
            // Loguear el error pero no interrumpir la creación del pedido
            System.err.println("Error al enviar notificación: " + e.getMessage());
        }


        return actualizado;
    }

    public List<Vehiculo> listarVehiculos() {
        return vehiculoRepository.findAll();
    }

    public Vehiculo buscarVehiculoPorPlaca(String placa) {
        return vehiculoRepository.findByPlaca(placa)
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));
    }

    @Transactional
    public Vehiculo actualizarEstadoVehiculo(String placa, EstadoVehiculo nuevoEstado) {
        Vehiculo vehiculo = buscarVehiculoPorPlaca(placa);
        vehiculo.setEstado(nuevoEstado);

        Vehiculo actualizado = vehiculoRepository.save(vehiculo);

        String severidad = "INFO";
        if (nuevoEstado == EstadoVehiculo.MANTENIMIENTO) {
            severidad = "WARNING"; // Mantenimiento es una alerta
        }

        try {
            notificationProducer.sendVehiculoCreate(actualizado.getId(),
                    actualizado.getPlaca(),
                    actualizado.getColor(),
                    actualizado.getAnioFabricacion(),
                    actualizado.getTipoVehiculo().toString(),
                    actualizado.getMarca());
        } catch (Exception e) {
            // Loguear el error pero no interrumpir la creación del pedido
            System.err.println("Error al enviar notificación: " + e.getMessage());
        }

        return actualizado;
    }

    //repartidores
    @Transactional
    public Repartidor registrarRepartidor(Repartidor repartidor) {
        if (repartidorRepository.existsByIdentificacion(repartidor.getIdentificacion())) {
            throw new RuntimeException("El repartidor con esa cedula si existe");
        }

        Repartidor nuevoRepartidor = repartidorRepository.save(repartidor);

        try {
            notificationProducer.sendPersonaCreate(nuevoRepartidor.getId(),
                    nuevoRepartidor.getIdentificacion(),
                    nuevoRepartidor.getNombre(),
                    nuevoRepartidor.getApellido(),
                    nuevoRepartidor.getTelefono(),
                    nuevoRepartidor.getLicencia());
        } catch (Exception e) {
            // Loguear el error pero no interrumpir la creación del pedido
            System.err.println("Error al enviar notificación: " + e.getMessage());
        }

        return nuevoRepartidor;
    }

    public List<Repartidor> listarRepartidores() {
        return repartidorRepository.findAll();
    }

    @Transactional
    public Repartidor asignarVehiculo(UUID repartidorId, String placaVehiculo) {
        Repartidor repartidor = repartidorRepository.findById(repartidorId)
                .orElseThrow(() -> new RuntimeException("Repartidor no encontrado"));

        Vehiculo vehiculo = buscarVehiculoPorPlaca(placaVehiculo);

        repartidor.setVehiculo(vehiculo);
        return repartidorRepository.save(repartidor);
    }
}
