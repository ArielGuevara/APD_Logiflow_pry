package espe.edu.ec.fleet_service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
public class NotificationEventDto {
    private UUID eventId;
    private String microservice;
    private String action;
    private String entityId;
    private String entityType;
    private String message;
    private String ip = null;
    private String hostName = null;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    private Map<String, Object> data;
    private String severity;

}