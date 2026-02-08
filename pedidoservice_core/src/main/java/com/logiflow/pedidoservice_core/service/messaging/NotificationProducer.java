package com.logiflow.pedidoservice_core.service.messaging;

import com.logiflow.pedidoservice_core.dto.messaging.NotificationEventDto;
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
    private static final String ENTITY_PEDIDO = "ENTIDAD PEDIDO";
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
                .microservice("microservice - pedidos")
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

    public void sendCreate(UUID idPedido, String cliente, String dirRecogida, String dirEntrega) {

        Map<String,Object> data = new HashMap<>();
        data.put("idPedido", idPedido.toString());
        data.put("cliente", cliente);
        data.put("direccion recogida", dirRecogida);
        data.put("direccion entrega", dirEntrega);
        String message = String.format("Se ha creado el pedido, cliente: %s", cliente);
        sendNotification("severity_info",ACTION_CREATE, ENTITY_PEDIDO, idPedido, message, data);
        log.info("Notificacion enviada para la creacion de pedido, Recogida: {} de entrega {}", dirRecogida, dirEntrega);
    }

    public void sendDelete(UUID idPedido, String cliente, String dirRecogida, String dirEntrega) {

        Map<String,Object> data = new HashMap<>();
        data.put("idPedido", idPedido.toString());
        data.put("cliente", cliente);
        data.put("direccion recogida", dirRecogida);
        data.put("direccion entrega", dirEntrega);
        String message = String.format("Se ha eliminado el pedido, cliente: %s", cliente);
        sendNotification("severity_info",ACTION_DELETE, ENTITY_PEDIDO, idPedido, message, data);
        log.info("Notificacion enviada para la elminacion de pedido, Recogida: {} de entrega {}", dirRecogida, dirEntrega);
    }
}