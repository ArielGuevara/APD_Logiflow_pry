# Fleet Service - Documentación para IA

## 1. Descripción General del Proyecto

**Fleet Service** es un microservicio REST API desarrollado con Spring Boot para la gestión de flotas de vehículos y repartidores en un sistema de logística (LogiFlow). El servicio permite registrar vehículos de diferentes tipos (motos, vehículos livianos y camiones), gestionar su estado, y asignarlos a repartidores.

### Información Técnica
- **Framework**: Spring Boot 4.0.0
- **Java Version**: 21
- **Puerto**: 8083
- **Base de datos**: PostgreSQL
- **Base Path**: `/api/v1/fleet`

---

## 2. Arquitectura del Proyecto

### 2.1 Estructura de Paquetes

```
espe.edu.ec.fleet_service/
├── controller/          # Controladores REST
│   └── FleetController.java
├── service/             # Lógica de negocio
│   └── FleetService.java
├── repository/          # Acceso a datos (JPA)
│   ├── VehiculoRepository.java
│   └── RepartidorRepository.java
├── model/               # Entidades y modelos de dominio
│   ├── Vehiculo.java (clase abstracta)
│   ├── Moto.java
│   ├── Liviano.java
│   ├── Camion.java
│   ├── Repartidor.java
│   ├── EstadoVehiculo.java (enum)
│   ├── TipoEstado.java (enum)
│   ├── MotoType.java (enum)
│   ├── AutoType.java (enum)
│   ├── TipoLicencia.java (enum)
│   ├── TipoVehiculo.java (enum)
│   └── validator/
│       ├── CedulaEcuador.java
│       └── CedulaEcuadorValidator.java
└── FleetServiceApplication.java
```

### 2.2 Patrón Arquitectónico

**Arquitectura en Capas:**
- **Controller Layer**: Maneja las peticiones HTTP y respuestas
- **Service Layer**: Contiene la lógica de negocio y validaciones
- **Repository Layer**: Interactúa con la base de datos usando Spring Data JPA
- **Model Layer**: Define las entidades de dominio

---

## 3. Modelos de Datos

### 3.1 Jerarquía de Vehículos

El sistema utiliza **herencia de tabla única con discriminador** (JOINED) para los vehículos:

#### Vehiculo (Clase Abstracta Base)
**Tabla**: `vehiculo`

| Campo | Tipo | Validaciones | Descripción |
|-------|------|--------------|-------------|
| `id` | UUID | Auto-generado | Identificador único |
| `cilindraje` | Integer | @NotNull, @Max(10000) | Cilindraje del motor |
| `placa` | String | @NotBlank, @Pattern(AAA-123 o AAA-1234), unique | Placa única del vehículo |
| `marca` | String | @NotBlank, @Size(2-50) | Marca del vehículo |
| `color` | String | @NotBlank | Color del vehículo |
| `modelo` | String | @NotBlank, @Size(2-50) | Modelo del vehículo |
| `anioFabricacion` | String | @NotBlank, @Pattern(año válido) | Año de fabricación (1900-2099) |
| `activo` | boolean | @NotNull | Estado de actividad (default: false) |
| `fechaCreacion` | LocalDateTime | Auto-generado | Fecha de creación del registro |
| `estado` | EstadoVehiculo | Enum | Estado operativo del vehículo |
| `tipoVehiculo` | String | Auto-calculado | Discriminador de tipo |

**Estados del Vehículo (EstadoVehiculo enum)**:
- `DISPONIBLE`: El vehículo está disponible para ser asignado
- `EN_RUTA`: El vehículo está actualmente en una ruta de entrega
- `MANTENIMIENTO`: El vehículo está en mantenimiento

#### Moto (extends Vehiculo)
**Tabla**: `moto`

| Campo | Tipo | Validaciones | Descripción |
|-------|------|--------------|-------------|
| `tipo` | MotoType | Enum | Tipo de motocicleta |
| `tieneCasco` | Boolean | @NotNull | Indica si incluye casco |

**Tipos de Moto (MotoType enum)**:
- `NAKED`, `DEPORTIVA`, `ENDURO`, `CHOPPER`, `TOURING`, `CROSS`, `CAFE_RACER`

#### Liviano (extends Vehiculo)
**Tabla**: `auto`

| Campo | Tipo | Validaciones | Descripción |
|-------|------|--------------|-------------|
| `tipoAuto` | AutoType | Enum | Tipo de automóvil |
| `tipoCombustible` | String | @NotBlank | Tipo de combustible |
| `numeroPuertas` | Integer | @NotNull, @Min(2), @Max(5) | Número de puertas |
| `capacidadMaleteroLitros` | Double | @NotNull, @Positive | Capacidad del maletero en litros |
| `capacidadOcupantes` | Integer | @NotNull, @Min(1), @Max(10) | Capacidad de pasajeros |
| `transmision` | String | @NotBlank | Tipo de transmisión |

**Tipos de Auto (AutoType enum)**:
- `SEDAN`, `SUV`, `HATCHBACK`, `CAMIONETA`, `COUPE`, `MINIVAN`, `CONVERTIBLE`

#### Camion (extends Vehiculo)
**Tabla**: `camion`

| Campo | Tipo | Validaciones | Descripción |
|-------|------|--------------|-------------|
| `capacidadToneladas` | Double | @Min(1), @Max(20) | Capacidad de carga en toneladas |

### 3.2 Repartidor
**Tabla**: `repartidor`

| Campo | Tipo | Validaciones | Descripción |
|-------|------|--------------|-------------|
| `id` | UUID | Auto-generado | Identificador único |
| `identificacion` | String | @CedulaEcuador, unique | Cédula ecuatoriana válida |
| `nombre` | String | @NotBlank | Nombre del repartidor |
| `apellido` | String | @NotBlank | Apellido del repartidor |
| `telefono` | String | @NotBlank | Teléfono de contacto |
| `licencia` | String | @NotBlank | Número de licencia |
| `vehiculo` | Vehiculo | OneToOne | Vehículo asignado (puede ser null) |
| `estado` | TipoEstado | Enum | Estado del repartidor |

**Estados del Repartidor (TipoEstado enum)**:
- `ACTIVO`: Repartidor activo en el sistema
- `INACTIVO`: Repartidor inactivo

### 3.3 Validación Personalizada

**@CedulaEcuador**: Anotación personalizada que valida que la cédula de identidad ecuatoriana sea válida según el algoritmo de verificación del dígito verificador.

---

## 4. API REST - Endpoints Detallados

### 4.1 Endpoints de Vehículos

#### POST `/api/v1/fleet/vehiculos`
**Descripción**: Crea un nuevo vehículo en el sistema.

**Request Body**: JSON con el objeto vehículo (polimórfico)

**Ejemplo para Moto**:
```json
{
  "tipoVehiculo": "MOTO",
  "cilindraje": 250,
  "placa": "ABC-1234",
  "marca": "Yamaha",
  "color": "Rojo",
  "modelo": "MT-03",
  "anioFabricacion": "2023",
  "activo": true,
  "tipo": "DEPORTIVA",
  "tieneCasco": true
}
```

**Ejemplo para Liviano**:
```json
{
  "tipoVehiculo": "LIVIANO",
  "cilindraje": 1600,
  "placa": "XYZ-5678",
  "marca": "Toyota",
  "color": "Blanco",
  "modelo": "Corolla",
  "anioFabricacion": "2022",
  "activo": true,
  "tipoAuto": "SEDAN",
  "tipoCombustible": "Gasolina",
  "numeroPuertas": 4,
  "capacidadMaleteroLitros": 470.0,
  "capacidadOcupantes": 5,
  "transmision": "Automatica"
}
```

**Ejemplo para Camión**:
```json
{
  "tipoVehiculo": "CAMION",
  "cilindraje": 5000,
  "placa": "DEF-901",
  "marca": "Chevrolet",
  "color": "Azul",
  "modelo": "NPR",
  "anioFabricacion": "2021",
  "activo": true,
  "capacidadToneladas": 5.0
}
```

**Response**: 200 OK
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "tipoVehiculo": "MOTO",
  "cilindraje": 250,
  "placa": "ABC-1234",
  "marca": "Yamaha",
  "color": "Rojo",
  "modelo": "MT-03",
  "anioFabricacion": "2023",
  "activo": true,
  "fechaCreacion": "2026-02-07T10:30:00",
  "estado": "DISPONIBLE",
  "tipo": "DEPORTIVA",
  "tieneCasco": true
}
```

**Lógica de Negocio**:
- Valida que no exista un vehículo con la misma placa
- Si no se especifica estado, se asigna `DISPONIBLE` por defecto
- El campo `activo` se inicializa en `false` automáticamente en @PrePersist
- La `fechaCreacion` se asigna automáticamente

**Errores**:
- `RuntimeException`: "Ya existe un vehículo con la placa: [placa]"
- Validación de campos según anotaciones

---

#### GET `/api/v1/fleet/vehiculos`
**Descripción**: Lista todos los vehículos registrados en el sistema.

**Request**: No requiere parámetros

**Response**: 200 OK
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "tipoVehiculo": "MOTO",
    "cilindraje": 250,
    "placa": "ABC-1234",
    "marca": "Yamaha",
    "color": "Rojo",
    "modelo": "MT-03",
    "anioFabricacion": "2023",
    "activo": true,
    "fechaCreacion": "2026-02-07T10:30:00",
    "estado": "EN_RUTA",
    "tipo": "DEPORTIVA",
    "tieneCasco": true
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "tipoVehiculo": "LIVIANO",
    "cilindraje": 1600,
    "placa": "XYZ-5678",
    "marca": "Toyota",
    "color": "Blanco",
    "modelo": "Corolla",
    "anioFabricacion": "2022",
    "activo": true,
    "fechaCreacion": "2026-02-06T15:20:00",
    "estado": "DISPONIBLE",
    "tipoAuto": "SEDAN",
    "tipoCombustible": "Gasolina",
    "numeroPuertas": 4,
    "capacidadMaleteroLitros": 470.0,
    "capacidadOcupantes": 5,
    "transmision": "Automatica"
  }
]
```

**Lógica de Negocio**:
- Retorna todos los vehículos sin filtros
- Los objetos se deserializan polimórficamente según su tipo

---

#### GET `/api/v1/fleet/vehiculos/{placa}`
**Descripción**: Busca un vehículo específico por su placa.

**Path Parameter**:
- `placa` (String): Placa del vehículo (ej: "ABC-1234")

**Request**: No requiere body

**Response**: 200 OK
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "tipoVehiculo": "MOTO",
  "cilindraje": 250,
  "placa": "ABC-1234",
  "marca": "Yamaha",
  "color": "Rojo",
  "modelo": "MT-03",
  "anioFabricacion": "2023",
  "activo": true,
  "fechaCreacion": "2026-02-07T10:30:00",
  "estado": "DISPONIBLE",
  "tipo": "DEPORTIVA",
  "tieneCasco": true
}
```

**Lógica de Negocio**:
- Busca el vehículo en la base de datos por placa
- Retorna el vehículo con todos sus datos específicos según su tipo

**Errores**:
- `RuntimeException`: "Vehículo no encontrado" (si no existe)

---

#### PATCH `/api/v1/fleet/vehiculos/{placa}/estado`
**Descripción**: Actualiza el estado operativo de un vehículo.

**Path Parameter**:
- `placa` (String): Placa del vehículo

**Query Parameter**:
- `estado` (EstadoVehiculo): Nuevo estado del vehículo
  - Valores posibles: `DISPONIBLE`, `EN_RUTA`, `MANTENIMIENTO`

**Request**: 
```
PATCH /api/v1/fleet/vehiculos/ABC-1234/estado?estado=EN_RUTA
```

**Response**: 200 OK
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "tipoVehiculo": "MOTO",
  "cilindraje": 250,
  "placa": "ABC-1234",
  "marca": "Yamaha",
  "color": "Rojo",
  "modelo": "MT-03",
  "anioFabricacion": "2023",
  "activo": true,
  "fechaCreacion": "2026-02-07T10:30:00",
  "estado": "EN_RUTA",
  "tipo": "DEPORTIVA",
  "tieneCasco": true
}
```

**Lógica de Negocio**:
- Busca el vehículo por placa
- Actualiza únicamente el campo `estado`
- Persiste el cambio en la base de datos

**Errores**:
- `RuntimeException`: "Vehículo no encontrado" (si la placa no existe)

---

### 4.2 Endpoints de Repartidores

#### POST `/api/v1/fleet/repartidores`
**Descripción**: Registra un nuevo repartidor en el sistema.

**Request Body**:
```json
{
  "identificacion": "1234567890",
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "0987654321",
  "licencia": "LIC-123456",
  "estado": "ACTIVO"
}
```

**Response**: 200 OK
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "identificacion": "1234567890",
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "0987654321",
  "licencia": "LIC-123456",
  "vehiculo": null,
  "estado": "ACTIVO"
}
```

**Lógica de Negocio**:
- Valida que la cédula ecuatoriana sea válida (validador personalizado)
- Verifica que no exista otro repartidor con la misma identificación
- Inicialmente el repartidor no tiene vehículo asignado (null)

**Errores**:
- `RuntimeException`: "El repartidor con esa cedula si existe"
- Validación de cédula ecuatoriana inválida

---

#### GET `/api/v1/fleet/repartidores`
**Descripción**: Lista todos los repartidores registrados.

**Request**: No requiere parámetros

**Response**: 200 OK
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "identificacion": "1234567890",
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "0987654321",
    "licencia": "LIC-123456",
    "vehiculo": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "tipoVehiculo": "MOTO",
      "placa": "ABC-1234",
      "marca": "Yamaha",
      "estado": "EN_RUTA"
    },
    "estado": "ACTIVO"
  },
  {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "identificacion": "0987654321",
    "nombre": "María",
    "apellido": "González",
    "telefono": "0991234567",
    "licencia": "LIC-789012",
    "vehiculo": null,
    "estado": "ACTIVO"
  }
]
```

**Lógica de Negocio**:
- Retorna todos los repartidores con sus vehículos asignados (si tienen)
- La relación OneToOne con Vehiculo se serializa completa

---

#### PUT `/api/v1/fleet/repartidores/{id}/asignar-vehiculo`
**Descripción**: Asigna un vehículo a un repartidor específico.

**Path Parameter**:
- `id` (UUID): ID del repartidor

**Query Parameter**:
- `placa` (String): Placa del vehículo a asignar

**Request**: 
```
PUT /api/v1/fleet/repartidores/770e8400-e29b-41d4-a716-446655440002/asignar-vehiculo?placa=ABC-1234
```

**Response**: 200 OK
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "identificacion": "1234567890",
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "0987654321",
  "licencia": "LIC-123456",
  "vehiculo": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "tipoVehiculo": "MOTO",
    "cilindraje": 250,
    "placa": "ABC-1234",
    "marca": "Yamaha",
    "color": "Rojo",
    "modelo": "MT-03",
    "anioFabricacion": "2023",
    "activo": true,
    "fechaCreacion": "2026-02-07T10:30:00",
    "estado": "DISPONIBLE",
    "tipo": "DEPORTIVA",
    "tieneCasco": true
  },
  "estado": "ACTIVO"
}
```

**Lógica de Negocio**:
- Busca el repartidor por ID
- Busca el vehículo por placa
- Asigna el vehículo al repartidor (relación OneToOne)
- Persiste la asignación
- **NO valida** si el vehículo ya está asignado a otro repartidor (permite múltiples asignaciones)

**Errores**:
- `RuntimeException`: "Repartidor no encontrado" (si el ID no existe)
- `RuntimeException`: "Vehículo no encontrado" (si la placa no existe)

---

## 5. Configuración de Base de Datos

### 5.1 Conexión PostgreSQL
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/logiflow_fleet
    username: postgres
    password: admin123
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

### 5.2 Esquema de Base de Datos

**Tablas Generadas**:
1. `vehiculo` - Tabla principal con campos comunes
2. `moto` - Join table con campos específicos de moto
3. `auto` - Join table con campos específicos de auto liviano
4. `camion` - Join table con campos específicos de camión
5. `repartidor` - Tabla de repartidores

**Relaciones**:
- `repartidor.vehiculo_id` → `vehiculo.id` (OneToOne, CascadeType.ALL)

---

## 6. Dependencias Principales

```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webmvc</artifactId>
    </dependency>
    
    <!-- Database -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
    
    <!-- Utilities -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>
    
    <!-- Documentation -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.8.14</version>
    </dependency>
</dependencies>
```

---

## 7. Características Técnicas Importantes

### 7.1 Polimorfismo con Jackson
El sistema utiliza `@JsonTypeInfo` y `@JsonSubTypes` para serialización/deserialización polimórfica:

```java
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "tipoVehiculo", visible = true)
@JsonSubTypes({
    @JsonSubTypes.Type(value = Moto.class, name = "MOTO"),
    @JsonSubTypes.Type(value = Liviano.class, name = "LIVIANO"),
    @JsonSubTypes.Type(value = Camion.class, name = "CAMION")
})
```

Esto permite que el JSON determine automáticamente qué subclase instanciar basándose en el campo `tipoVehiculo`.

### 7.2 Herencia JPA
- **Estrategia**: `InheritanceType.JOINED`
- **Discriminador**: `tipo_vehiculo` (columna string)
- Cada subclase tiene su propia tabla con una FK a la tabla padre

### 7.3 Validaciones
- **Bean Validation**: Uso extensivo de anotaciones JSR-303/380
- **Validador Personalizado**: `@CedulaEcuador` para validar cédulas ecuatorianas
- **Validaciones de Negocio**: En el service layer (placas duplicadas, identificaciones duplicadas)

### 7.4 Transacciones
Los métodos de escritura del service están anotados con `@Transactional`:
- `crearVehiculo()`
- `actualizarEstadoVehiculo()`
- `registrarRepartidor()`
- `asignarVehiculo()`

### 7.5 Generación de IDs
Se usa `@UuidGenerator` de Hibernate para generar UUIDs automáticamente, con fallback a función de PostgreSQL:
```java
@UuidGenerator
@Column(columnDefinition = "uuid DEFAULT gen_random_uuid()")
```

---

## 8. Flujos de Negocio Principales

### 8.1 Flujo de Creación de Vehículo
1. Cliente envía POST con JSON del vehículo (especificando tipoVehiculo)
2. Jackson deserializa al tipo correcto (Moto/Liviano/Camion)
3. Validaciones de Bean Validation se ejecutan
4. Service valida placa única
5. Si no hay estado, asigna DISPONIBLE
6. @PrePersist establece fechaCreacion y activo=false
7. Se persiste en BD (tabla vehiculo + tabla específica)
8. Se retorna el objeto completo con ID generado

### 8.2 Flujo de Asignación de Vehículo a Repartidor
1. Cliente envía PUT con ID del repartidor y placa del vehículo
2. Service busca repartidor por ID
3. Service busca vehículo por placa
4. Se establece la relación OneToOne
5. Se persiste el repartidor con la referencia
6. Se retorna el repartidor con el vehículo completo embebido

### 8.3 Flujo de Cambio de Estado de Vehículo
1. Cliente envía PATCH con nueva estado
2. Service busca el vehículo por placa
3. Actualiza solo el campo estado
4. Persiste el cambio
5. Retorna el vehículo actualizado

---

## 9. Consideraciones para Integración (IA)

### 9.1 Formato de Fechas
- **LocalDateTime** se serializa en ISO-8601: `"2026-02-07T10:30:00"`

### 9.2 Manejo de Errores
- El servicio lanza `RuntimeException` con mensajes descriptivos
- Los errores de validación retornan automáticamente respuestas 400 con detalles

### 9.3 Tipos Permitidos
Al crear vehículos, el campo `tipoVehiculo` DEBE ser uno de:
- `"MOTO"` (requiere: tipo, tieneCasco)
- `"LIVIANO"` (requiere: tipoAuto, tipoCombustible, numeroPuertas, capacidadMaleteroLitros, capacidadOcupantes, transmision)
- `"CAMION"` (requiere: capacidadToneladas)

### 9.4 Estados y Enumeraciones
**EstadoVehiculo**: `DISPONIBLE`, `EN_RUTA`, `MANTENIMIENTO`
**TipoEstado**: `ACTIVO`, `INACTIVO`
**MotoType**: `NAKED`, `DEPORTIVA`, `ENDURO`, `CHOPPER`, `TOURING`, `CROSS`, `CAFE_RACER`
**AutoType**: `SEDAN`, `SUV`, `HATCHBACK`, `CAMIONETA`, `COUPE`, `MINIVAN`, `CONVERTIBLE`

### 9.5 Formato de Placa
Pattern regex: `^[A-Z]{3}-\\d{3,4}$`
Ejemplos válidos: `ABC-123`, `XYZ-1234`

### 9.6 Validación de Cédula Ecuatoriana
La cédula debe ser válida según el algoritmo de módulo 10 ecuatoriano. Debe tener 10 dígitos.

---

## 10. Documentación OpenAPI

El servicio incluye **SpringDoc OpenAPI 3** que genera documentación automática:
- **Swagger UI**: `http://localhost:8083/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8083/v3/api-docs`

---

## 11. Testing

El proyecto incluye tests en:
- `CedulaValidatorTest.java` - Tests de validación de cédulas
- `FleetControllerTest.java` - Tests de endpoints
- `FleetEnumsTest.java` - Tests de enumeraciones
- `FleetServiceTest.java` - Tests de lógica de negocio
- `VehiculoTest.java` - Tests de modelos de vehículos

---

## Resumen para IA

Este microservicio gestiona una **flota de vehículos polimórficos** (Motos, Autos Livianos, Camiones) y **repartidores**, con las siguientes capacidades:

✅ **CRUD de Vehículos**: Crear, listar, buscar por placa, actualizar estado  
✅ **CRUD de Repartidores**: Crear, listar  
✅ **Asignación**: Asignar vehículos a repartidores  
✅ **Polimorfismo**: Manejo automático de subtipos de vehículos via JSON  
✅ **Validaciones**: Cédulas ecuatorianas, placas únicas, formatos específicos  
✅ **Persistencia**: PostgreSQL con JPA e herencia JOINED  
✅ **Documentación**: OpenAPI/Swagger automático  

**Tecnologías clave**: Spring Boot 4, Java 21, PostgreSQL, Bean Validation, Lombok, JPA

**Puerto**: 8083  
**Base Path**: `/api/v1/fleet`
