# Stage 1: Build
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de Maven
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Descargar dependencias (esta capa se cachea si pom.xml no cambia)
RUN mvn dependency:go-offline -B

# Copiar código fuente
COPY src ./src

# Compilar la aplicación
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine

# Instalar dumb-init para manejo correcto de señales
RUN apk add --no-cache dumb-init

# Crear usuario no privilegiado
RUN addgroup -S spring && adduser -S spring -G spring

# Establecer directorio de trabajo
WORKDIR /app

# Copiar el JAR desde la etapa de build
COPY --from=build /app/target/*.jar app.jar

# Cambiar permisos
RUN chown -R spring:spring /app

# Cambiar a usuario no privilegiado
USER spring:spring

# Exponer puerto
EXPOSE 8084

# Variables de entorno con valores por defecto
# Configurar SPRING_DATASOURCE_URL al ejecutar el contenedor
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/logiflow_billing \
    SPRING_DATASOURCE_USERNAME=postgres \
    SPRING_DATASOURCE_PASSWORD=admin123 \
    JAVA_OPTS="-Xms256m -Xmx512m" \
    SERVER_PORT=8084

# Usar dumb-init para ejecutar la aplicación
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
