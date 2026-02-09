# ==============================================================================
# Etapa 1: Build
# ==============================================================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de Maven para aprovechar el cache de dependencias
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Descargar dependencias (se cachea si el pom.xml no cambia)
RUN mvn dependency:go-offline -B

# Copiar el código fuente
COPY src ./src

# Compilar la aplicación (saltar tests para build más rápido)
RUN mvn clean package -DskipTests -B

# ==============================================================================
# Etapa 2: Runtime
# ==============================================================================
FROM eclipse-temurin:21-jre-alpine

# Metadata
LABEL maintainer="Guevara, Reyes, Pasquel"
LABEL description="LogiFlow Auth Service - Authentication and Authorization Microservice"
LABEL version="1.0.0"

# Variables de entorno por defecto
ENV SPRING_PROFILES_ACTIVE=prod \
    SERVER_PORT=8081 \
    JAVA_OPTS="-Xmx512m -Xms256m" \
    TZ=America/Guayaquil

# Instalar dependencias del sistema y configurar timezone
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    apk del tzdata

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Establecer directorio de trabajo
WORKDIR /app

# Copiar el JAR desde la etapa de build
COPY --from=build /app/target/*.jar app.jar

# Cambiar ownership de los archivos
RUN chown -R appuser:appgroup /app

# Cambiar a usuario no-root
USER appuser

# Exponer el puerto 8081
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8081/actuator/health || exit 1

# Comando de inicio
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
