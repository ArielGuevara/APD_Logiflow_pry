# Documentación del Servicio de Notificaciones

## 🏗️ Arquitectura del Proyecto

Este es un microservicio de notificaciones construido con **NestJS** que forma parte del sistema **Parkin**. Su propósito principal es **recibir eventos de otros microservicios a través de RabbitMQ**, almacenarlos en una base de datos PostgreSQL y exponerlos mediante una API REST.

### Tecnologías Principales
- **Framework**: NestJS (Node.js)
- **Base de datos**: PostgreSQL
- **Message Broker**: RabbitMQ
- **ORM**: TypeORM
- **Validación**: class-validator
- **Documentación API**: Swagger

---

## 📁 Estructura del Proyecto

```
src/
├── app.module.ts                    # Módulo principal - Configura TypeORM, ConfigModule
├── main.ts                          # Punto de entrada - Configura CORS, validación, Swagger
├── notifications/                   # Módulo de notificaciones
│   ├── notifications.controller.ts  # Controlador REST
│   ├── notifications.service.ts     # Lógica de negocio
│   ├── notifications.module.ts      # Módulo que exporta el servicio
│   ├── dto/
│   │   ├── create-notification.dto.ts      # DTO para crear notificaciones
│   │   ├── update-notification.dto.ts      # DTO para actualizar (no usado actualmente)
│   │   └── notification-response.dto.ts    # DTO de respuesta
│   └── entities/
│       └── notification.entity.ts          # Entidad de base de datos
└── rabbitmq/                        # Módulo de integración con RabbitMQ
    ├── rabbitmq.service.ts          # Servicio que consume mensajes
    ├── rabbitmq.module.ts           # Módulo de RabbitMQ
    └── interfaces/
        └── notification-event.interface.ts  # Interfaz de eventos
```

---

## 🔄 Flujo de Datos

### 1. Recepción de Eventos (RabbitMQ → Base de Datos)

```
[Microservicio Externo] 
    ↓ (publica mensaje)
[RabbitMQ Exchange: notifications.exchange]
    ↓ (routing key: notification.routingkey)
[RabbitMQ Queue: notifications.queue]
    ↓ (consume)
[RabbitMQService.consumeMessages()]
    ↓ (procesa y mapea)
[NotificationsService.create()]
    ↓ (guarda)
[PostgreSQL: tabla notification]
```

**Detalles del flujo:**
1. Un microservicio externo publica un evento en el exchange `notifications.exchange`
2. El mensaje se enruta a la cola `notifications.queue` usando la routing key `notification.routingkey`
3. `RabbitMQService` consume el mensaje automáticamente al iniciar la aplicación
4. El mensaje se parsea a un `NotificationEvent` y se mapea a `CreateNotificationDto`
5. Se guarda en la base de datos usando TypeORM
6. El mensaje se confirma (ACK) si todo fue exitoso, o se rechaza (NACK) si hubo error

### 2. Consulta de Notificaciones (API REST → Base de Datos)

```
[Cliente HTTP/Frontend] 
    ↓ (GET /notifications)
[NotificationsController.findAll()]
    ↓
[NotificationsService.findAll()]
    ↓ (consulta)
[PostgreSQL: tabla notification]
    ↓ (retorna)
[Array de Notification entities]
```

---

## 🌐 API REST - Endpoints

### Base URL
```
http://localhost:3001
```

### Documentación Swagger
```
http://localhost:3001/api-docs
```

### Endpoints Disponibles

#### 1. **GET /notifications**
Obtiene todas las notificaciones almacenadas, ordenadas por fecha de creación descendente (más recientes primero).

**Request:**
```http
GET /notifications HTTP/1.1
Host: localhost:3001
```

**Response:** `200 OK`
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "eventId": "987e6543-e21b-45d6-b789-123456789abc",
    "message": "Usuario creado exitosamente",
    "action": "CREATE",
    "microservice": "users-service",
    "entityId": "456e7890-a12b-34c5-d678-901234567def",
    "entityType": "User",
    "eventTimestamp": "2026-02-07T10:30:00.000Z",
    "createdAt": "2026-02-07T10:30:05.123Z",
    "read": false,
    "processed": false,
    "severity": "INFO",
    "data": {
      "username": "john_doe",
      "email": "john@example.com"
    },
    "ip": "192.168.1.100",
    "hostname": "app-server-01"
  }
]
```

**Campos del Response:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único de la notificación (generado por la BD) |
| `eventId` | UUID | Identificador del evento original desde el microservicio emisor |
| `message` | string | Mensaje descriptivo del evento |
| `action` | string | Tipo de acción: `CREATE`, `UPDATE`, o `DELETE` |
| `microservice` | string | Nombre del microservicio que originó el evento |
| `entityId` | UUID | ID de la entidad afectada en el microservicio origen |
| `entityType` | string | Tipo de entidad (ej: User, Parking, Reservation) |
| `eventTimestamp` | ISO 8601 | Fecha/hora en que ocurrió el evento original |
| `createdAt` | ISO 8601 | Fecha/hora en que se registró la notificación |
| `read` | boolean | Indica si la notificación fue leída (default: false) |
| `processed` | boolean | Indica si la notificación fue procesada (default: false) |
| `severity` | string | Nivel de severidad: `INFO`, `WARNING`, o `ERROR` |
| `data` | object | Datos adicionales en formato JSON (opcional) |
| `ip` | string | Dirección IP del origen (opcional) |
| `hostname` | string | Hostname del servidor origen (opcional) |

**Casos de uso:**
- Mostrar historial de eventos en un dashboard administrativo
- Auditoría de acciones realizadas en el sistema
- Debugging y rastreo de operaciones entre microservicios

---

## 📦 Modelos de Datos

### Entity: `Notification`

**Tabla de base de datos:** `notification`

```typescript
{
  id: string;                    // UUID generado automáticamente (PRIMARY KEY)
  eventId: string;               // UUID del evento original (INDEXED)
  message: string;               // Mensaje descriptivo
  action: string;                // CREATE | UPDATE | DELETE (max 20 chars)
  microservice: string;          // Nombre del microservicio origen
  entityId: string;              // UUID de la entidad (INDEXED)
  entityType: string;            // Tipo de entidad
  eventTimestamp: Date;          // Timestamp del evento original
  createdAt: Date;               // Fecha de creación (auto-generada)
  read: boolean;                 // Marcador de lectura (default: false)
  processed: boolean;            // Marcador de procesamiento (default: false)
  data: Record<string, any>;     // JSON adicional (JSONB en PostgreSQL)
  severity: string;              // INFO | WARNING | ERROR (default: INFO)
  ip: string | null;             // IP del origen (nullable)
  hostname: string | null;       // Hostname del origen (nullable)
}
```

**Índices:**
- Primary Key: `id`
- Index en: `eventId`
- Index en: `entityId`

### DTO: `CreateNotificationDto`

Este DTO define la estructura que se espera al crear una notificación (usado internamente por RabbitMQ):

```typescript
{
  eventId: string;              // UUID - Requerido
  message: string;              // Requerido
  action: string;               // 'CREATE' | 'UPDATE' | 'DELETE' - Requerido
  microservice: string;         // Requerido
  entityId: string;             // UUID - Requerido
  entityType: string;           // Requerido
  eventTimestamp: Date;         // ISO 8601 string - Requerido
  data?: Record<string, any>;   // Opcional - Objeto JSON
  severity?: string;            // 'INFO' | 'WARNING' | 'ERROR' - Opcional (default: INFO)
  ip?: string;                  // Opcional
  hostname?: string;            // Opcional
}
```

**Validaciones aplicadas:**
- `eventId`: Debe ser UUID válido
- `entityId`: Debe ser UUID válido
- `action`: Solo acepta 'CREATE', 'UPDATE', o 'DELETE'
- `severity`: Solo acepta 'INFO', 'WARNING', o 'ERROR'
- `eventTimestamp`: Debe ser una fecha ISO válida

### Interface: `NotificationEvent`

Estructura de los eventos que llegan desde RabbitMQ:

```typescript
{
  id: string;                   // UUID del evento
  microservice: string;         // Nombre del microservicio emisor
  action: string;               // CREATE | UPDATE | DELETE
  entityId: string;             // UUID de la entidad
  entityType: string;           // Tipo de entidad
  message: string;              // Mensaje descriptivo
  timestamp: string;            // ISO 8601 string
  data?: Record<string, any>;   // Datos adicionales opcionales
  severity: string;             // INFO | WARNING | ERROR
}
```

---

## ⚙️ Configuración

### Variables de Entorno (.env)

```env
# RabbitMQ
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=admin123

# Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=admin123
DB_NAME=db_notifications

# Servidor
SERVER_PORT=3001
```

### CORS

El servicio está configurado para aceptar peticiones desde:
- `http://localhost:3000`
- `http://localhost:8080`
- `http://localhost:8081`

Métodos permitidos: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`

### Validación Global

- **whitelist**: Elimina propiedades que no están en el DTO
- **transform**: Transforma payloads en instancias tipadas
- **forbidNonWhitelisted**: Lanza error si hay propiedades no permitidas

---

## 🔌 Integración con RabbitMQ

### Configuración del Exchange y Queue

- **Exchange**: `notifications.exchange` (tipo: `topic`, durable)
- **Queue**: `notifications.queue` (durable)
- **Routing Key**: `notification.routingkey`
- **Binding**: Queue vinculada al exchange con la routing key

### Ciclo de Vida del Servicio

1. **onModuleInit**: Al iniciar la aplicación
   - Se conecta a RabbitMQ
   - Configura exchange, queue y binding
   - Inicia el consumo de mensajes

2. **onModuleDestroy**: Al cerrar la aplicación
   - Cierra el canal de RabbitMQ
   - Cierra la conexión

### Manejo de Errores

- **Error al procesar mensaje**: Se registra en logs y se envía NACK (no se reencola)
- **Error de conexión**: Se lanza excepción y se registra en logs
- **Timestamp inválido**: Se usa la fecha actual como fallback

### Logging

El servicio usa el Logger de NestJS con los siguientes niveles:
- `log`: Operaciones exitosas (ej: mensaje procesado)
- `debug`: Información detallada para debugging (ej: DTO completo)
- `warn`: Advertencias (ej: timestamp inválido)
- `error`: Errores críticos con stack traces

---

## 🔐 Consideraciones de Seguridad y Buenas Prácticas

### Actualmente Implementado
✅ Validación de DTOs con class-validator  
✅ CORS configurado  
✅ Variables de entorno para configuración sensible  
✅ Logging estructurado  
✅ Manejo de errores con try-catch  

### Recomendaciones para Producción
⚠️ **synchronize: true** en TypeORM debe ser **false** en producción  
⚠️ Implementar autenticación/autorización (JWT, API Keys)  
⚠️ Agregar rate limiting  
⚠️ Implementar paginación en el endpoint `GET /notifications`  
⚠️ Agregar filtros por fecha, microservicio, severity  
⚠️ Implementar soft deletes o archivado de notificaciones antiguas  
⚠️ Añadir health checks (`/health`)  

---

## 🎯 Casos de Uso del Sistema

### 1. Auditoría de Acciones
Un administrador puede consultar todas las notificaciones para ver qué acciones se han realizado en el sistema, quién las hizo y cuándo.

### 2. Debugging de Microservicios
Cuando hay un problema en el sistema distribuido, se pueden revisar las notificaciones para rastrear el flujo de eventos entre microservicios.

### 3. Notificaciones en Tiempo Real (futuro)
El sistema está preparado para extenderse con WebSockets o Server-Sent Events para notificar a los usuarios en tiempo real.

### 4. Reportería y Analytics
Los datos de notificaciones pueden ser usados para generar reportes de actividad del sistema.

---

## 🧩 Dependencias entre Módulos

```
AppModule
├── ConfigModule (global)
├── TypeOrmModule (conexión a PostgreSQL)
├── NotificationsModule
│   ├── NotificationsController (expone API REST)
│   └── NotificationsService (lógica de negocio + repositorio)
└── RabbitMQModule
    └── RabbitMQService (consume mensajes y usa NotificationsService)
```

### Inyección de Dependencias
- `RabbitMQService` importa `NotificationsModule` para usar `NotificationsService`
- `NotificationsService` recibe el repositorio de `Notification` vía `@InjectRepository`
- `ConfigService` está disponible globalmente para acceder a variables de entorno

---

## 📊 Ejemplo de Flujo Completo

### Escenario: Usuario crea una reserva de parqueadero

1. **Microservicio de Reservas** crea una nueva reserva en su BD
2. **Microservicio de Reservas** publica un evento a RabbitMQ:
   ```json
   {
     "id": "event-123",
     "microservice": "reservations-service",
     "action": "CREATE",
     "entityType": "Reservation",
     "entityId": "reservation-456",
     "message": "Nueva reserva creada para el usuario john_doe",
     "timestamp": "2026-02-07T10:30:00Z",
     "severity": "INFO",
     "data": {
       "userId": "user-789",
       "parkingId": "parking-101",
       "startTime": "2026-02-07T12:00:00Z"
     }
   }
   ```

3. **Servicio de Notificaciones (RabbitMQService)** consume el mensaje
4. Se mapea a `CreateNotificationDto` y se valida
5. **NotificationsService** guarda la notificación en PostgreSQL
6. Administrador consulta **GET /notifications** y ve el evento registrado

---

## 🔍 Información Técnica Adicional

### Puerto del Servidor
- **Desarrollo**: `3001` (configurado en .env)
- **Producción**: Variable de entorno `PORT` o default `3001`

### Orden de Resultados
Las notificaciones se devuelven ordenadas por `createdAt DESC` (más recientes primero).

### Formato de Fechas
Todas las fechas se manejan en formato ISO 8601 (ej: `2026-02-07T10:30:00.000Z`).

### Logs de Base de Datos
TypeORM tiene `logging: true`, lo que significa que todas las queries SQL se imprimen en consola (útil para desarrollo, desactivar en producción).

---

## 🚀 Endpoints para Implementar en el Futuro

Actualmente solo existe `GET /notifications`, pero el sistema está preparado para:

- **GET /notifications/:id** - Obtener una notificación específica
- **PATCH /notifications/:id/read** - Marcar como leída
- **PATCH /notifications/:id/process** - Marcar como procesada
- **GET /notifications/unread** - Obtener solo no leídas
- **DELETE /notifications/:id** - Eliminar notificación

---

## 📝 Notas Importantes para una IA

1. **No hay endpoint POST**: Las notificaciones se crean SOLO vía RabbitMQ, no hay endpoint REST para crearlas manualmente.

2. **El servicio es pasivo**: Es un consumer de eventos, no un publisher. Solo escucha y guarda.

3. **Validación estricta**: Todos los DTOs tienen validaciones con decoradores de `class-validator`, que se aplican globalmente gracias al `ValidationPipe`.

4. **Base de datos sincronizada automáticamente**: `synchronize: true` crea/actualiza las tablas automáticamente basándose en las entidades (solo para desarrollo).

5. **Transacciones no explícitas**: Se usa TypeORM Repository sin transacciones explícitas. Para operaciones complejas, considerar usar `QueryRunner` con transacciones.

6. **Campo `processed`**: Está en la BD pero no se usa actualmente. Probablemente para futuras implementaciones donde un worker procese las notificaciones.

7. **RabbitMQ con acknowledgments**: Los mensajes se confirman (`ack`) solo si se guardan exitosamente. Si falla, se rechaza (`nack`) sin reencolar.

---

## 🎓 Conceptos Clave para Comprender la Aplicación

### Event-Driven Architecture
Este servicio implementa el patrón de arquitectura orientada a eventos, donde los microservicios se comunican de forma asíncrona mediante mensajes.

### CQRS (parcial)
Hay separación entre comandos (crear notificaciones vía RabbitMQ) y queries (consultar vía REST API).

### Microservicios
Este es un microservicio independiente que puede escalar horizontalmente. Gestiona su propia base de datos y no tiene dependencias directas con otros servicios (solo comunicación asíncrona).

### Durabilidad
Tanto el exchange como la queue en RabbitMQ son durables, lo que significa que sobreviven a reinicios del broker.

---

**Fecha de documentación**: 7 de febrero de 2026  
**Versión del servicio**: 1.0  
**Framework**: NestJS  
**Propósito**: Microservicio de notificaciones para el sistema Parkin
