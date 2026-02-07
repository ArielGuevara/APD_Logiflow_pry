package com.logiflow.pedidoservice_core.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetalleProducto {

    private String descripcion;

    private Double pesoKg;

    private String dimensiones;

    private BigDecimal valorDeclarado;

    private boolean esFragil;
}