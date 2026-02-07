package espe.edu.ec.fleet_service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import espe.edu.ec.fleet_service.controller.FleetController;
import espe.edu.ec.fleet_service.model.*;
import espe.edu.ec.fleet_service.service.FleetService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FleetController.class)
public class FleetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private FleetService fleetService;

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    private UUID id_test = new UUID(0, 0);
    @Test
    public void testListarRepartidores() throws Exception {
        when(fleetService.listarRepartidores()).thenReturn(Arrays.asList(new Repartidor(), new Repartidor()));

        mockMvc.perform(get("/fleet/repartidores"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    public void testAsignarVehiculo() throws Exception {
        Repartidor rep = new Repartidor();
        rep.setId(id_test);
        Moto moto = new Moto();
        moto.setPlaca("ABC");
        rep.setVehiculo(moto);

        when(fleetService.asignarVehiculo(id_test, "ABC")).thenReturn(rep);

        mockMvc.perform(put("/fleet/repartidores/1/asignar-vehiculo")
                        .param("placa", "ABC"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.vehiculo.placa").value("ABC"));
    }
}