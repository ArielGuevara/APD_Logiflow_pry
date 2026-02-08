package espe.edu.ec.fleet_service.service;


import espe.edu.ec.fleet_service.dto.NotificationEventDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationProducer {

    private final RabbitTemplate rabbitTemplate;

    private static final String ACTION_CREATE="CREATE";
    private static final String ACTION_DELETE="DELETE";
    private static final String ENTITY_VEHICULO = "ENTIDAD VEHICULO";
    private static final String ENTITY_PERSONA = "ENTIDAD PERSONA";
    private static final String SEVERITY_INFO = "INFO";
    private  static final String SEVERITY_WARN = "WARN";
    private  static final String SEVERITY_ERROR = "ERROR";

    public void sendNotification(String severity,
                                 String action,
                                 String entityType,
                                 UUID entityId,
                                 String message,
                                 Map<String,Object> data){
        String severityType;

        switch (severity){
            case "severity_info":
                severityType = SEVERITY_INFO;
                break;
            case "severity_warn":
                severityType = SEVERITY_WARN;
                break;
            case "severity_error":
                severityType = SEVERITY_ERROR;
                break;
            default:
                log.error("Error, notificacion NO enviada, tipo de severidad no reconocido: {}", severity);
                return;
        }

        NotificationEventDto event = NotificationEventDto.builder()
                .eventId(UUID.randomUUID())
                .microservice("microservice - fleet")
                .action(action)
                .entityType(entityType)
                .entityId(entityId.toString())
                .message(message)
                .ip("UNKNOWN")
                .hostName("UNKNOWN")
                .timestamp(LocalDateTime.now())
                .data(data != null ? data : new HashMap<>())
                .severity(severityType)
                .build();
        try{
            log.debug("Sending notification event: {}", event);
            rabbitTemplate.convertAndSend(
                    "notifications-logiflow.exchange",
                    "notification-logiflow.routingkey",
                    event);
            log.info("Notificacion enviada {} - {}",action, event);
        }catch(Exception e){
            log.error("Error al enviar notificacion {} - {} ", action, event, e);
        }
    }

    public void sendVehiculoCreate(UUID idVehiculo, String placa, String color, String anio, String tipo, String marca) {
        Map<String,Object> data = new HashMap<>();
        data.put("idAutoVehiculo", idVehiculo.toString());
        data.put("autoPlaca", placa);
        data.put("color", color);
        data.put("anio", anio);
        data.put("type", tipo);
        data.put("marca", marca);
        String message = String.format("Se ha creado el vehiculo, placa: %s de tipo %s, de la marca: %s", placa, tipo, marca);
        sendNotification("severity_info",ACTION_CREATE, ENTITY_VEHICULO, idVehiculo, message, data);
        log.info("Notificacion enviada para la creacion del vehiculo, placa: {} de tipo {}", placa, tipo);
    }

    public void sendPersonaCreate(UUID idPersona, String identificacion, String nombre, String apellido, String telefono, String licencia) {
        Map<String,Object> data = new HashMap<>();
        data.put("idPersona", idPersona.toString());
        data.put("personaIdentificacion", identificacion);
        data.put("nombre:", nombre);
        data.put("apellido", apellido);
        data.put("telefono", telefono);
        data.put("licencia", licencia);
        String message = String.format("Se ha creado una persona, identificacion: %s nombre %s, apellido: %s", identificacion, nombre, apellido);
        sendNotification("severity_info",ACTION_CREATE, ENTITY_PERSONA, idPersona, message, data);
        log.info("Notificacion enviada para la creacion del persona, identificacion: {} de nombre {}", identificacion, (nombre + ' ' +  apellido));
    }
}
