package com.example.demo.routine;

import com.example.demo.model.*;
import com.example.demo.repository.ExerciseRepository;
import com.example.demo.repository.RoutineRepository;
import com.example.demo.service.RoutineService;
import com.example.demo.service.UserService;
import com.example.demo.web.dto.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoutineServiceTest {

    @Mock
    private UserService userService;

    @Mock
    private ExerciseRepository exerciseRepository;

    @Mock
    private RoutineRepository routineRepository;

    @InjectMocks
    private RoutineService routineService;

    private User testUser;
    private Exercise testExercise;
    private Routine testRoutine;

    @BeforeEach
    void setUp() {
        testUser = new User("test@example.com", "testuser", "password");
        testUser.setUserId(1);

        testExercise = new Exercise();
        testExercise.setExerciseId(1);
        testExercise.setName("Bench Press");

        testRoutine = new Routine();
        testRoutine.setRoutineId(1);
        testRoutine.setName("Test Routine");
        testRoutine.setCreatedBy(testUser);
        testRoutine.setExercises(new ArrayList<>());
    }

    @Test
    void createRoutine_ShouldCreateAndReturnRoutine() {
        // Given
        CreateRoutineRequest request = new CreateRoutineRequest();
        request.setName("Push Day");
        request.setNotes("Upper body workout");
        request.setUserId(1);

        CreateRoutineExerciseRequest exerciseReq = new CreateRoutineExerciseRequest();
        exerciseReq.setExerciseId(1);
        exerciseReq.setType(ExerciseType.WEIGHT);
        exerciseReq.setSortOrder(1);

        CreateRoutineSetRequest setReq = new CreateRoutineSetRequest();
        setReq.setSetOrder(1);
        setReq.setTargetReps(10);
        setReq.setTargetWeight(100.0);
        exerciseReq.setSets(List.of(setReq));

        request.setExercises(List.of(exerciseReq));

        when(userService.getUserOrThrow(1)).thenReturn(testUser);
        when(exerciseRepository.findById(1)).thenReturn(Optional.of(testExercise));
        when(routineRepository.save(any(Routine.class))).thenReturn(testRoutine);

        // When
        RoutineResponse response = routineService.createRoutine(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getRoutineId()).isEqualTo(1);
        verify(userService, times(1)).getUserOrThrow(1);
        verify(exerciseRepository, times(1)).findById(1);
        verify(routineRepository, times(1)).save(any(Routine.class));
    }

    @Test
    void getUserRoutines_ShouldReturnListOfRoutines() {
        // Given
        Routine routine2 = new Routine();
        routine2.setRoutineId(2);
        routine2.setName("Pull Day");
        routine2.setCreatedBy(testUser);

        List<Routine> routines = List.of(testRoutine, routine2);
        when(routineRepository.findByCreatedByUserIdOrderByNameAsc(1)).thenReturn(routines);

        // When
        List<RoutineResponse> response = routineService.getUserRoutines(1);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.size()).isEqualTo(2);
        verify(routineRepository, times(1)).findByCreatedByUserIdOrderByNameAsc(1);
    }

    @Test
    void getRoutine_ShouldReturnRoutine() {
        // Given
        when(routineRepository.findById(1)).thenReturn(Optional.of(testRoutine));

        // When
        RoutineResponse response = routineService.getRoutine(1);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getRoutineId()).isEqualTo(1);
        verify(routineRepository, times(1)).findById(1);
    }

    @Test
    void getRoutine_ShouldReturnNullWhenNotFound() {
        // Given
        when(routineRepository.findById(999)).thenReturn(Optional.empty());

        // When
        RoutineResponse response = routineService.getRoutine(999);

        // Then
        assertThat(response).isNull();
        verify(routineRepository, times(1)).findById(999);
    }

    @Test
    void updateRoutine_ShouldUpdateAndReturnRoutine() {
        // Given
        UpdateRoutineRequest request = new UpdateRoutineRequest();
        request.setName("Updated Routine");
        request.setNotes("Updated notes");

        CreateRoutineExerciseRequest exerciseReq = new CreateRoutineExerciseRequest();
        exerciseReq.setExerciseId(1);
        exerciseReq.setType(ExerciseType.WEIGHT);
        exerciseReq.setSortOrder(1);
        exerciseReq.setSets(List.of(new CreateRoutineSetRequest()));
        request.setExercises(List.of(exerciseReq));

        when(routineRepository.findById(1)).thenReturn(Optional.of(testRoutine));
        when(exerciseRepository.findById(1)).thenReturn(Optional.of(testExercise));
        when(routineRepository.save(any(Routine.class))).thenReturn(testRoutine);

        // When
        RoutineResponse response = routineService.updateRoutine(1, request);

        // Then
        assertThat(response).isNotNull();
        verify(routineRepository, times(1)).findById(1);
        verify(routineRepository, times(1)).save(any(Routine.class));
    }

    @Test
    void updateRoutine_ShouldThrowExceptionWhenNotFound() {
        // Given
        UpdateRoutineRequest request = new UpdateRoutineRequest();
        request.setName("Updated Routine");
        request.setExercises(new ArrayList<>());

        when(routineRepository.findById(999)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> routineService.updateRoutine(999, request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Routine not found");
    }

    @Test
    void deleteRoutine_ShouldDeleteRoutine() {
        // Given
        doNothing().when(routineRepository).deleteById(1);

        // When
        routineService.deleteRoutine(1);

        // Then
        verify(routineRepository, times(1)).deleteById(1);
    }

    @Test
    void createRoutine_ShouldHandleMultipleExercisesAndSets() {
        // Given
        CreateRoutineRequest request = new CreateRoutineRequest();
        request.setName("Full Body");
        request.setUserId(1);

        CreateRoutineExerciseRequest exercise1 = new CreateRoutineExerciseRequest();
        exercise1.setExerciseId(1);
        exercise1.setType(ExerciseType.WEIGHT);
        exercise1.setSortOrder(1);
        exercise1.setSets(List.of(
                createSetRequest(1, 10, 100.0),
                createSetRequest(2, 8, 120.0)
        ));

        CreateRoutineExerciseRequest exercise2 = new CreateRoutineExerciseRequest();
        exercise2.setExerciseId(2);
        exercise2.setType(ExerciseType.CARDIO);
        exercise2.setSortOrder(2);
        exercise2.setSets(List.of(
                createSetRequest(1, null, null)
        ));

        request.setExercises(List.of(exercise1, exercise2));

        Exercise exercise2Entity = new Exercise();
        exercise2Entity.setExerciseId(2);
        exercise2Entity.setName("Running");

        when(userService.getUserOrThrow(1)).thenReturn(testUser);
        when(exerciseRepository.findById(1)).thenReturn(Optional.of(testExercise));
        when(exerciseRepository.findById(2)).thenReturn(Optional.of(exercise2Entity));
        when(routineRepository.save(any(Routine.class))).thenReturn(testRoutine);

        // When
        RoutineResponse response = routineService.createRoutine(request);

        // Then
        assertThat(response).isNotNull();
        verify(exerciseRepository, times(2)).findById(anyInt());
        verify(routineRepository, times(1)).save(any(Routine.class));
    }

    private CreateRoutineSetRequest createSetRequest(Integer setOrder, Integer reps, Double weight) {
        CreateRoutineSetRequest setReq = new CreateRoutineSetRequest();
        setReq.setSetOrder(setOrder);
        setReq.setTargetReps(reps);
        setReq.setTargetWeight(weight);
        return setReq;
    }
}

