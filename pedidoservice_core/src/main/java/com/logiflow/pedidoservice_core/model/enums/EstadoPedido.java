package com.logiflow.pedidoservice_core.model.enums;

public enum EstadoPedido {
    RECIBIDO,     // Estado inicial
    EN_RUTA,      // Asignado y en camino
    ENTREGADO,    // Finalizado con éxito
    CANCELADO     // Cancelación lógica
}
