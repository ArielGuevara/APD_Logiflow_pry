package com.logiflow.pedidoservice_core.dto.request;

import com.logiflow.pedidoservice_core.model.enums.TipoVehiculo;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class PedidoRequestDto {

    @NotBlank(message = "La dirección de recogida es obligatoria")
    private String direccionRecogida;

    @NotBlank(message = "La dirección de entrega es obligatoria")
    private String direccionEntrega;

    @NotNull(message = "El tipo de vehículo es obligatorio")
    private TipoVehiculo tipoVehiculo;

    // Campos para validación geográfica (opcionales al inicio, pero recomendados)
    private Double latitud;
    private Double longitud;

    // --- Detalles del Producto anidados ---

    @NotBlank(message = "La descripción del producto es obligatoria")
    private String descripcionProducto;

    @NotNull(message = "El peso es obligatorio para calcular la flota")
    @Positive(message = "El peso debe ser mayor a 0")
    private Double pesoKg;

    private String dimensiones;

    @Positive(message = "El valor declarado debe ser positivo")
    private BigDecimal valorDeclarado;

    private boolean esFragil;
}
