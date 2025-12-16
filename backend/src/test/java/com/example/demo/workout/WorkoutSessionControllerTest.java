package com.example.demo.workout;

import com.example.demo.controller.WorkoutSessionController;
import com.example.demo.model.ExerciseType;
import com.example.demo.service.WorkoutService;
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

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = WorkoutSessionController.class)
@AutoConfigureMockMvc(addFilters = false)
class WorkoutSessionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private WorkoutService workoutService;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @MockBean
    private JwtUtils jwtUtils;

    @Autowired
    private ObjectMapper objectMapper;

    private WorkoutResponse mockWorkoutResponse;
    private SessionExerciseResponse mockExerciseResponse;
    private SessionSetResponse mockSetResponse;

    @BeforeEach
    void setUp() {
        mockWorkoutResponse = new WorkoutResponse();
        mockWorkoutResponse.setWorkoutId(1);
        mockWorkoutResponse.setUserId(1);
        mockWorkoutResponse.setDate(LocalDate.now());

        mockExerciseResponse = new SessionExerciseResponse();
        mockExerciseResponse.setSessionExerciseId(1);
        mockExerciseResponse.setExerciseId(1);

        mockSetResponse = new SessionSetResponse();
        mockSetResponse.setSessionSetId(1);
        mockSetResponse.setSetOrder(1);
    }

    @Test
    void createWorkout_ShouldReturnCreatedWorkout() throws Exception {
        // Given
        CreateWorkoutRequest request = new CreateWorkoutRequest();
        request.setUserId(1);
        request.setDate(LocalDate.now());
        request.setNotes("Test workout");

        when(workoutService.createWorkout(any(CreateWorkoutRequest.class)))
                .thenReturn(mockWorkoutResponse);

        // When & Then
        mockMvc.perform(post("/api/workouts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.workoutId").value(1))
                .andExpect(jsonPath("$.userId").value(1));

        verify(workoutService, times(1)).createWorkout(any(CreateWorkoutRequest.class));
    }

    @Test
    void getWorkout_ShouldReturnWorkout() throws Exception {
        // Given
        when(workoutService.getWorkout(1)).thenReturn(mockWorkoutResponse);

        // When & Then
        mockMvc.perform(get("/api/workouts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.workoutId").value(1));

        verify(workoutService, times(1)).getWorkout(1);
    }

    @Test
    void getUserWorkouts_ShouldReturnListOfWorkouts() throws Exception {
        // Given
        WorkoutResponse workout2 = new WorkoutResponse();
        workout2.setWorkoutId(2);
        workout2.setUserId(1);

        List<WorkoutResponse> workouts = Arrays.asList(mockWorkoutResponse, workout2);
        when(workoutService.getUserWorkouts(1)).thenReturn(workouts);

        // When & Then
        mockMvc.perform(get("/api/workouts/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].workoutId").value(1))
                .andExpect(jsonPath("$[1].workoutId").value(2));

        verify(workoutService, times(1)).getUserWorkouts(1);
    }

    @Test
    void getWorkoutExercises_ShouldReturnListOfExercises() throws Exception {
        // Given
        SessionExerciseResponse exercise2 = new SessionExerciseResponse();
        exercise2.setSessionExerciseId(2);
        List<SessionExerciseResponse> exercises = Arrays.asList(mockExerciseResponse, exercise2);

        when(workoutService.getWorkoutExercises(1)).thenReturn(exercises);

        // When & Then
        mockMvc.perform(get("/api/workouts/1/exercises"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2));

        verify(workoutService, times(1)).getWorkoutExercises(1);
    }

    @Test
    void addExerciseToWorkout_ShouldReturnExercise() throws Exception {
        // Given
        AddExerciseToWorkoutRequest request = new AddExerciseToWorkoutRequest();
        request.setExerciseId(1);
        request.setType(ExerciseType.WEIGHT);
        request.setSortOrder(1);

        when(workoutService.addExerciseToWorkout(eq(1), any(AddExerciseToWorkoutRequest.class)))
                .thenReturn(mockExerciseResponse);

        // When & Then
        mockMvc.perform(post("/api/workouts/1/exercises")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sessionExerciseId").value(1));

        verify(workoutService, times(1)).addExerciseToWorkout(eq(1), any(AddExerciseToWorkoutRequest.class));
    }

    @Test
    void logSet_ShouldReturnSet() throws Exception {
        // Given
        LogSetRequest request = new LogSetRequest();
        request.setSetOrder(1);
        request.setReps(10);
        request.setWeight(100.0);

        when(workoutService.logSet(eq(1), any(LogSetRequest.class)))
                .thenReturn(mockSetResponse);

        // When & Then
        mockMvc.perform(post("/api/workouts/1/exercises/1/sets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sessionSetId").value(1));

        verify(workoutService, times(1)).logSet(eq(1), any(LogSetRequest.class));
    }

    @Test
    void getWorkoutExerciseSets_ShouldReturnListOfSets() throws Exception {
        // Given
        SessionSetResponse set2 = new SessionSetResponse();
        set2.setSessionSetId(2);
        List<SessionSetResponse> sets = Arrays.asList(mockSetResponse, set2);

        when(workoutService.getWorkoutExerciseSets(1)).thenReturn(sets);

        // When & Then
        mockMvc.perform(get("/api/workouts/1/exercises/1/sets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2));

        verify(workoutService, times(1)).getWorkoutExerciseSets(1);
    }

    @Test
    void updateWorkout_ShouldReturnUpdatedWorkout() throws Exception {
        // Given
        UpdateWorkoutRequest request = new UpdateWorkoutRequest();
        // Note: setDate expects String, but Jackson will serialize getDate() which returns LocalDate
        // Just set notes to avoid serialization issues
        request.setNotes("Updated notes");

        when(workoutService.updateWorkout(eq(1), any(UpdateWorkoutRequest.class)))
                .thenReturn(mockWorkoutResponse);

        // When & Then - use a simple JSON string instead of objectMapper to avoid serialization issues
        mockMvc.perform(put("/api/workouts/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"notes\":\"Updated notes\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.workoutId").exists());

        verify(workoutService, times(1)).updateWorkout(eq(1), any(UpdateWorkoutRequest.class));
    }

    @Test
    void deleteWorkout_ShouldReturnNoContent() throws Exception {
        // Given
        doNothing().when(workoutService).deleteWorkout(1);

        // When & Then
        mockMvc.perform(delete("/api/workouts/1"))
                .andExpect(status().isNoContent());

        verify(workoutService, times(1)).deleteWorkout(1);
    }
}

