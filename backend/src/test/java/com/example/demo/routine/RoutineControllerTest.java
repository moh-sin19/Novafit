package com.example.demo.routine;

import com.example.demo.controller.RoutineController;
import com.example.demo.service.RoutineService;
import com.example.demo.web.dto.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.example.demo.security.JwtAuthFilter;
import com.example.demo.security.JwtUtils;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = RoutineController.class)
@AutoConfigureMockMvc(addFilters = false)
class RoutineControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RoutineService routineService;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @MockBean
    private JwtUtils jwtUtils;

    @Autowired
    private ObjectMapper objectMapper;

    private RoutineResponse mockRoutineResponse;

    @BeforeEach
    void setUp() {
        mockRoutineResponse = new RoutineResponse();
        mockRoutineResponse.setRoutineId(1);
        mockRoutineResponse.setName("Test Routine");
        mockRoutineResponse.setCreatedByUserId(1);
    }

    @Test
    void createRoutine_ShouldReturnCreatedRoutine() throws Exception {
        // Given
        CreateRoutineRequest request = new CreateRoutineRequest();
        request.setName("Push Day");
        request.setNotes("Upper body workout");
        request.setUserId(1);
        request.setExercises(List.of(new CreateRoutineExerciseRequest()));

        when(routineService.createRoutine(any(CreateRoutineRequest.class)))
                .thenReturn(mockRoutineResponse);

        // When & Then
        mockMvc.perform(post("/api/routines")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.routineId").value(1))
                .andExpect(jsonPath("$.name").value("Test Routine"));

        verify(routineService, times(1)).createRoutine(any(CreateRoutineRequest.class));
    }

    @Test
    void getRoutine_ShouldReturnRoutine() throws Exception {
        // Given
        when(routineService.getRoutine(1)).thenReturn(mockRoutineResponse);

        // When & Then
        mockMvc.perform(get("/api/routines/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.routineId").value(1))
                .andExpect(jsonPath("$.name").value("Test Routine"));

        verify(routineService, times(1)).getRoutine(1);
    }

    @Test
    void getUserRoutines_ShouldReturnListOfRoutines() throws Exception {
        // Given
        RoutineResponse routine2 = new RoutineResponse();
        routine2.setRoutineId(2);
        routine2.setName("Pull Day");
        routine2.setCreatedByUserId(1);

        List<RoutineResponse> routines = Arrays.asList(mockRoutineResponse, routine2);
        when(routineService.getUserRoutines(1)).thenReturn(routines);

        // When & Then
        mockMvc.perform(get("/api/routines/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].routineId").value(1))
                .andExpect(jsonPath("$[1].routineId").value(2));

        verify(routineService, times(1)).getUserRoutines(1);
    }

    @Test
    void updateRoutine_ShouldReturnUpdatedRoutine() throws Exception {
        // Given
        UpdateRoutineRequest request = new UpdateRoutineRequest();
        request.setName("Updated Routine");
        request.setNotes("Updated notes");
        request.setExercises(List.of(new CreateRoutineExerciseRequest()));

        when(routineService.updateRoutine(eq(1), any(UpdateRoutineRequest.class)))
                .thenReturn(mockRoutineResponse);

        // When & Then
        mockMvc.perform(put("/api/routines/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.routineId").value(1));

        verify(routineService, times(1)).updateRoutine(eq(1), any(UpdateRoutineRequest.class));
    }

    @Test
    void deleteRoutine_ShouldReturnNoContent() throws Exception {
        // Given
        doNothing().when(routineService).deleteRoutine(1);

        // When & Then
        mockMvc.perform(delete("/api/routines/1"))
                .andExpect(status().isNoContent());

        verify(routineService, times(1)).deleteRoutine(1);
    }
}

