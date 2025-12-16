package com.example.demo.controller;

import com.example.demo.service.ExerciseService;
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

import java.time.Instant;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = ExerciseController.class, excludeAutoConfiguration = org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class)
@AutoConfigureMockMvc(addFilters = false)
class ExerciseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ExerciseService exerciseService;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @MockBean
    private JwtUtils jwtUtils;

    @Autowired
    private ObjectMapper objectMapper;

    private ExerciseResponse mockExerciseResponse;

    @BeforeEach
    void setUp() {
        mockExerciseResponse = new ExerciseResponse();
        mockExerciseResponse.setExerciseId(1);
        mockExerciseResponse.setName("Bench Press");
        mockExerciseResponse.setDescription("Chest exercise");
        mockExerciseResponse.setCreatedByUserId(1);
        mockExerciseResponse.setLastUpdated(Instant.now());
    }

    @Test
    void createExercise_ShouldReturnCreatedExercise() throws Exception {
        // Given
        CreateExerciseRequest request = new CreateExerciseRequest();
        request.setName("Bench Press");
        request.setDescription("Chest exercise");
        request.setUserId(1);

        when(exerciseService.createExercise(any(CreateExerciseRequest.class)))
                .thenReturn(mockExerciseResponse);

        // When & Then
        mockMvc.perform(post("/api/exercises")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exerciseId").value(1))
                .andExpect(jsonPath("$.name").value("Bench Press"))
                .andExpect(jsonPath("$.description").value("Chest exercise"))
                .andExpect(jsonPath("$.createdByUserId").value(1));

        verify(exerciseService, times(1)).createExercise(any(CreateExerciseRequest.class));
    }

    @Test
    void createExercise_ShouldCallServiceWithAllFields() throws Exception {
        // Given - Test that all fields are passed correctly
        CreateExerciseRequest request = new CreateExerciseRequest();
        request.setName("Deadlift");
        request.setDescription("Back and leg exercise");
        request.setUserId(2);

        ExerciseResponse response = new ExerciseResponse();
        response.setExerciseId(3);
        response.setName("Deadlift");
        response.setDescription("Back and leg exercise");
        response.setCreatedByUserId(2);

        when(exerciseService.createExercise(any(CreateExerciseRequest.class)))
                .thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/exercises")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exerciseId").value(3))
                .andExpect(jsonPath("$.name").value("Deadlift"))
                .andExpect(jsonPath("$.description").value("Back and leg exercise"))
                .andExpect(jsonPath("$.createdByUserId").value(2));

        verify(exerciseService, times(1)).createExercise(any(CreateExerciseRequest.class));
    }

    @Test
    void createExercise_ShouldAcceptExerciseWithOnlyName() throws Exception {
        // Given - Description is optional
        CreateExerciseRequest request = new CreateExerciseRequest();
        request.setName("Squat");
        request.setUserId(1);
        // description is null/optional

        ExerciseResponse response = new ExerciseResponse();
        response.setExerciseId(2);
        response.setName("Squat");
        response.setDescription(null);
        response.setCreatedByUserId(1);

        when(exerciseService.createExercise(any(CreateExerciseRequest.class)))
                .thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/exercises")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exerciseId").value(2))
                .andExpect(jsonPath("$.name").value("Squat"));

        verify(exerciseService, times(1)).createExercise(any(CreateExerciseRequest.class));
    }

    @Test
    void getAllExercises_ShouldReturnListOfExercises() throws Exception {
        // Given
        ExerciseResponse exercise1 = new ExerciseResponse();
        exercise1.setExerciseId(1);
        exercise1.setName("Bench Press");
        exercise1.setDescription("Chest exercise");
        exercise1.setCreatedByUserId(1);

        ExerciseResponse exercise2 = new ExerciseResponse();
        exercise2.setExerciseId(2);
        exercise2.setName("Squat");
        exercise2.setDescription("Leg exercise");
        exercise2.setCreatedByUserId(1);

        List<ExerciseResponse> exercises = Arrays.asList(exercise1, exercise2);
        when(exerciseService.getAllExercises()).thenReturn(exercises);

        // When & Then
        mockMvc.perform(get("/api/exercises/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].exerciseId").value(1))
                .andExpect(jsonPath("$[0].name").value("Bench Press"))
                .andExpect(jsonPath("$[1].exerciseId").value(2))
                .andExpect(jsonPath("$[1].name").value("Squat"));

        verify(exerciseService, times(1)).getAllExercises();
    }

    @Test
    void getAllExercises_ShouldReturnEmptyListWhenNoExercises() throws Exception {
        // Given
        when(exerciseService.getAllExercises()).thenReturn(Arrays.asList());

        // When & Then
        mockMvc.perform(get("/api/exercises/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));

        verify(exerciseService, times(1)).getAllExercises();
    }

    @Test
    void createExercise_ShouldHandleLongNames() throws Exception {
        // Given
        CreateExerciseRequest request = new CreateExerciseRequest();
        request.setName("Very Long Exercise Name That Should Still Work Fine");
        request.setDescription("Description");
        request.setUserId(1);

        ExerciseResponse response = new ExerciseResponse();
        response.setExerciseId(1);
        response.setName("Very Long Exercise Name That Should Still Work Fine");
        response.setDescription("Description");
        response.setCreatedByUserId(1);

        when(exerciseService.createExercise(any(CreateExerciseRequest.class)))
                .thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/exercises")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Very Long Exercise Name That Should Still Work Fine"));

        verify(exerciseService, times(1)).createExercise(any(CreateExerciseRequest.class));
    }

    @Test
    void createExercise_ShouldHandleLongDescriptions() throws Exception {
        // Given
        CreateExerciseRequest request = new CreateExerciseRequest();
        request.setName("Exercise Name");
        request.setDescription("This is a very long description that contains multiple sentences. " +
                "It describes the exercise in detail. This should still work fine even with a long description.");
        request.setUserId(1);

        ExerciseResponse response = new ExerciseResponse();
        response.setExerciseId(1);
        response.setName("Exercise Name");
        response.setDescription("This is a very long description that contains multiple sentences. " +
                "It describes the exercise in detail. This should still work fine even with a long description.");
        response.setCreatedByUserId(1);

        when(exerciseService.createExercise(any(CreateExerciseRequest.class)))
                .thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/exercises")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").exists());

        verify(exerciseService, times(1)).createExercise(any(CreateExerciseRequest.class));
    }

    @Test
    void getAllExercises_ShouldReturnExercisesWithNullDescriptions() throws Exception {
        // Given
        ExerciseResponse exercise1 = new ExerciseResponse();
        exercise1.setExerciseId(1);
        exercise1.setName("Bench Press");
        exercise1.setDescription(null); // Null description
        exercise1.setCreatedByUserId(1);

        ExerciseResponse exercise2 = new ExerciseResponse();
        exercise2.setExerciseId(2);
        exercise2.setName("Squat");
        exercise2.setDescription("Leg exercise");
        exercise2.setCreatedByUserId(1);

        List<ExerciseResponse> exercises = Arrays.asList(exercise1, exercise2);
        when(exerciseService.getAllExercises()).thenReturn(exercises);

        // When & Then
        mockMvc.perform(get("/api/exercises/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].exerciseId").value(1))
                .andExpect(jsonPath("$[0].description").isEmpty())
                .andExpect(jsonPath("$[1].exerciseId").value(2))
                .andExpect(jsonPath("$[1].description").value("Leg exercise"));

        verify(exerciseService, times(1)).getAllExercises();
    }

    @Test
    void getAllExercises_ShouldHandleLargeListOfExercises() throws Exception {
        // Given - Create a list with many exercises
        List<ExerciseResponse> exercises = Arrays.asList(
                createMockExercise(1, "Exercise 1"),
                createMockExercise(2, "Exercise 2"),
                createMockExercise(3, "Exercise 3"),
                createMockExercise(4, "Exercise 4"),
                createMockExercise(5, "Exercise 5")
        );

        when(exerciseService.getAllExercises()).thenReturn(exercises);

        // When & Then
        mockMvc.perform(get("/api/exercises/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(5))
                .andExpect(jsonPath("$[0].exerciseId").value(1))
                .andExpect(jsonPath("$[4].exerciseId").value(5));

        verify(exerciseService, times(1)).getAllExercises();
    }

    @Test
    void createExercise_ShouldHandleDifferentExerciseTypes() throws Exception {
        // Given - Test with different exercise scenarios
        CreateExerciseRequest request = new CreateExerciseRequest();
        request.setName("Cardio Run");
        request.setDescription("Running exercise for cardio");
        request.setUserId(1);

        ExerciseResponse response = new ExerciseResponse();
        response.setExerciseId(4);
        response.setName("Cardio Run");
        response.setDescription("Running exercise for cardio");
        response.setCreatedByUserId(1);

        when(exerciseService.createExercise(any(CreateExerciseRequest.class)))
                .thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/exercises")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Cardio Run"));

        verify(exerciseService, times(1)).createExercise(any(CreateExerciseRequest.class));
    }

    @Test
    void getAllExercises_ShouldReturnExercisesWithLastUpdatedTimestamp() throws Exception {
        // Given
        Instant now = Instant.now();
        ExerciseResponse exercise = new ExerciseResponse();
        exercise.setExerciseId(1);
        exercise.setName("Bench Press");
        exercise.setDescription("Chest exercise");
        exercise.setCreatedByUserId(1);
        exercise.setLastUpdated(now);

        when(exerciseService.getAllExercises()).thenReturn(Arrays.asList(exercise));

        // When & Then
        mockMvc.perform(get("/api/exercises/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].exerciseId").value(1))
                .andExpect(jsonPath("$[0].lastUpdated").exists());

        verify(exerciseService, times(1)).getAllExercises();
    }

    // Helper method
    private ExerciseResponse createMockExercise(Integer id, String name) {
        ExerciseResponse exercise = new ExerciseResponse();
        exercise.setExerciseId(id);
        exercise.setName(name);
        exercise.setDescription("Description for " + name);
        exercise.setCreatedByUserId(1);
        exercise.setLastUpdated(Instant.now());
        return exercise;
    }
}
