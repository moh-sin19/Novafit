package com.example.demo.workout;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import com.example.demo.service.WorkoutService;
import com.example.demo.web.dto.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityNotFoundException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WorkoutServiceTest {

    @Mock
    private WorkoutSessionRepository workoutSessionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SessionExerciseRepository sessionExerciseRepository;

    @Mock
    private SessionSetRepository sessionSetRepository;

    @Mock
    private ExerciseRepository exerciseRepository;

    @InjectMocks
    private WorkoutService workoutService;

    private User testUser;
    private Exercise testExercise;
    private WorkoutSession testWorkout;

    @BeforeEach
    void setUp() {
        testUser = new User("test@example.com", "testuser", "password");
        testUser.setUserId(1);

        testExercise = new Exercise();
        testExercise.setExerciseId(1);
        testExercise.setName("Bench Press");

        testWorkout = new WorkoutSession();
        testWorkout.setSessionId(1);
        testWorkout.setUser(testUser);
        testWorkout.setDate(LocalDate.now());
        testWorkout.setExercises(new ArrayList<>());
    }

    @Test
    void createWorkout_ShouldCreateAndReturnWorkout() {
        // Given
        CreateWorkoutRequest request = new CreateWorkoutRequest();
        request.setUserId(1);
        request.setDate(LocalDate.now());
        request.setNotes("Test workout");

        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(workoutSessionRepository.save(any(WorkoutSession.class))).thenReturn(testWorkout);

        // When
        WorkoutResponse response = workoutService.createWorkout(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getWorkoutId()).isEqualTo(1);
        verify(userRepository, times(1)).findById(1);
        verify(workoutSessionRepository, times(1)).save(any(WorkoutSession.class));
    }

    @Test
    void createWorkout_ShouldThrowExceptionWhenUserNotFound() {
        // Given
        CreateWorkoutRequest request = new CreateWorkoutRequest();
        request.setUserId(999);
        request.setDate(LocalDate.now());

        when(userRepository.findById(999)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> workoutService.createWorkout(request))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("User not found");

        verify(workoutSessionRepository, never()).save(any());
    }

    @Test
    void getWorkout_ShouldReturnWorkout() {
        // Given
        when(workoutSessionRepository.findById(1)).thenReturn(Optional.of(testWorkout));

        // When
        WorkoutResponse response = workoutService.getWorkout(1);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getWorkoutId()).isEqualTo(1);
        verify(workoutSessionRepository, times(1)).findById(1);
    }

    @Test
    void getWorkout_ShouldThrowExceptionWhenNotFound() {
        // Given
        when(workoutSessionRepository.findById(999)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> workoutService.getWorkout(999))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Workout not found");
    }

    @Test
    void getUserWorkouts_ShouldReturnListOfWorkouts() {
        // Given
        WorkoutSession workout2 = new WorkoutSession();
        workout2.setSessionId(2);
        workout2.setUser(testUser);

        List<WorkoutSession> workouts = List.of(testWorkout, workout2);
        when(workoutSessionRepository.findByUserUserIdOrderByDateDesc(1)).thenReturn(workouts);

        // When
        List<WorkoutResponse> response = workoutService.getUserWorkouts(1);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.size()).isEqualTo(2);
        verify(workoutSessionRepository, times(1)).findByUserUserIdOrderByDateDesc(1);
    }

    @Test
    void addExerciseToWorkout_ShouldCreateAndReturnExercise() {
        // Given
        AddExerciseToWorkoutRequest request = new AddExerciseToWorkoutRequest();
        request.setExerciseId(1);
        request.setType(ExerciseType.WEIGHT);
        request.setSortOrder(1);

        SessionExercise sessionExercise = new SessionExercise();
        sessionExercise.setSessionExerciseId(1);
        sessionExercise.setSession(testWorkout);
        sessionExercise.setExercise(testExercise);

        when(workoutSessionRepository.findById(1)).thenReturn(Optional.of(testWorkout));
        when(exerciseRepository.findById(1)).thenReturn(Optional.of(testExercise));
        when(sessionExerciseRepository.save(any(SessionExercise.class))).thenReturn(sessionExercise);

        // When
        SessionExerciseResponse response = workoutService.addExerciseToWorkout(1, request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getSessionExerciseId()).isEqualTo(1);
        verify(workoutSessionRepository, times(1)).findById(1);
        verify(exerciseRepository, times(1)).findById(1);
        verify(sessionExerciseRepository, times(1)).save(any(SessionExercise.class));
    }

    @Test
    void addExerciseToWorkout_ShouldThrowExceptionWhenWorkoutNotFound() {
        // Given
        AddExerciseToWorkoutRequest request = new AddExerciseToWorkoutRequest();
        request.setExerciseId(1);

        when(workoutSessionRepository.findById(999)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> workoutService.addExerciseToWorkout(999, request))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Workout not found");
    }

    @Test
    void logSet_ShouldCreateAndReturnSet() {
        // Given
        LogSetRequest request = new LogSetRequest();
        request.setSetOrder(1);
        request.setReps(10);
        request.setWeight(100.0);

        SessionExercise sessionExercise = new SessionExercise();
        sessionExercise.setSessionExerciseId(1);
        sessionExercise.setSession(testWorkout);

        SessionSet sessionSet = new SessionSet();
        sessionSet.setSessionSetId(1);
        sessionSet.setSessionExercise(sessionExercise);

        when(sessionExerciseRepository.findById(1)).thenReturn(Optional.of(sessionExercise));
        when(sessionSetRepository.save(any(SessionSet.class))).thenReturn(sessionSet);

        // When
        SessionSetResponse response = workoutService.logSet(1, request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getSessionSetId()).isEqualTo(1);
        verify(sessionExerciseRepository, times(1)).findById(1);
        verify(sessionSetRepository, times(1)).save(any(SessionSet.class));
    }

    @Test
    void logSet_ShouldThrowExceptionWhenSessionExerciseNotFound() {
        // Given
        LogSetRequest request = new LogSetRequest();
        when(sessionExerciseRepository.findById(999)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> workoutService.logSet(999, request))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Session exercise not found");
    }

    @Test
    void getWorkoutExercises_ShouldReturnListOfExercises() {
        // Given
        SessionExercise exercise1 = new SessionExercise();
        exercise1.setSessionExerciseId(1);
        exercise1.setSession(testWorkout);
        exercise1.setExercise(testExercise);
        exercise1.setType(ExerciseType.WEIGHT);

        SessionExercise exercise2 = new SessionExercise();
        exercise2.setSessionExerciseId(2);
        exercise2.setSession(testWorkout);
        exercise2.setExercise(testExercise);
        exercise2.setType(ExerciseType.WEIGHT);

        List<SessionExercise> exercises = List.of(exercise1, exercise2);
        when(sessionExerciseRepository.findBySessionSessionIdOrderBySortOrder(1)).thenReturn(exercises);

        // When
        List<SessionExerciseResponse> response = workoutService.getWorkoutExercises(1);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.size()).isEqualTo(2);
        verify(sessionExerciseRepository, times(1)).findBySessionSessionIdOrderBySortOrder(1);
    }

    @Test
    void getWorkoutExerciseSets_ShouldReturnListOfSets() {
        // Given
        SessionSet set1 = new SessionSet();
        set1.setSessionSetId(1);
        SessionSet set2 = new SessionSet();
        set2.setSessionSetId(2);

        List<SessionSet> sets = List.of(set1, set2);
        when(sessionSetRepository.findBySessionExerciseSessionExerciseIdOrderBySetOrder(1)).thenReturn(sets);

        // When
        List<SessionSetResponse> response = workoutService.getWorkoutExerciseSets(1);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.size()).isEqualTo(2);
        verify(sessionSetRepository, times(1)).findBySessionExerciseSessionExerciseIdOrderBySetOrder(1);
    }

    @Test
    void updateWorkout_ShouldUpdateAndReturnWorkout() {
        // Given
        UpdateWorkoutRequest request = new UpdateWorkoutRequest();
        request.setDate(LocalDate.now().plusDays(1).toString());
        request.setNotes("Updated notes");

        when(workoutSessionRepository.findById(1)).thenReturn(Optional.of(testWorkout));
        when(workoutSessionRepository.save(any(WorkoutSession.class))).thenReturn(testWorkout);

        // When
        WorkoutResponse response = workoutService.updateWorkout(1, request);

        // Then
        assertThat(response).isNotNull();
        verify(workoutSessionRepository, times(1)).findById(1);
        verify(workoutSessionRepository, times(1)).save(any(WorkoutSession.class));
    }

    @Test
    void updateWorkout_ShouldThrowExceptionWhenNotFound() {
        // Given
        UpdateWorkoutRequest request = new UpdateWorkoutRequest();
        when(workoutSessionRepository.findById(999)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> workoutService.updateWorkout(999, request))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Workout not found");
    }

    @Test
    void updateWorkout_ShouldUpdateStartTimeAndEndTime() {
        // Given
        UpdateWorkoutRequest request = new UpdateWorkoutRequest();
        request.setStartTime("08:00:00");
        request.setEndTime("09:30:00");
        request.setNotes("Morning workout");

        when(workoutSessionRepository.findById(1)).thenReturn(Optional.of(testWorkout));
        when(workoutSessionRepository.save(any(WorkoutSession.class))).thenReturn(testWorkout);

        // When
        WorkoutResponse response = workoutService.updateWorkout(1, request);

        // Then
        assertThat(response).isNotNull();
        verify(workoutSessionRepository, times(1)).findById(1);
        verify(workoutSessionRepository, times(1)).save(any(WorkoutSession.class));
    }

    @Test
    void updateWorkout_ShouldUpdateWithExercisesButNoSets() {
        // Given
        UpdateWorkoutRequest request = new UpdateWorkoutRequest();
        request.setNotes("Updated workout with exercises");
        
        UpdateSessionExerciseRequest exerciseRequest = new UpdateSessionExerciseRequest();
        exerciseRequest.setExerciseId(1);
        exerciseRequest.setType(ExerciseType.WEIGHT);
        exerciseRequest.setSortOrder(1);
        exerciseRequest.setNotes("Bench press");
        exerciseRequest.setSets(null); // No sets
        
        request.setExercises(List.of(exerciseRequest));

        when(workoutSessionRepository.findById(1)).thenReturn(Optional.of(testWorkout));
        when(exerciseRepository.findById(1)).thenReturn(Optional.of(testExercise));
        when(workoutSessionRepository.save(any(WorkoutSession.class))).thenAnswer(invocation -> {
            WorkoutSession saved = invocation.getArgument(0);
            assertThat(saved.getExercises()).hasSize(1);
            assertThat(saved.getExercises().get(0).getSets()).isEmpty();
            return testWorkout;
        });

        // When
        WorkoutResponse response = workoutService.updateWorkout(1, request);

        // Then
        assertThat(response).isNotNull();
        verify(workoutSessionRepository, times(1)).findById(1);
        verify(exerciseRepository, times(1)).findById(1);
        verify(workoutSessionRepository, times(1)).save(any(WorkoutSession.class));
    }

    @Test
    void updateWorkout_ShouldUpdateWithExercisesAndSets() {
        // Given
        UpdateWorkoutRequest request = new UpdateWorkoutRequest();
        request.setNotes("Workout with sets");
        
        UpdateSessionExerciseRequest exerciseRequest = new UpdateSessionExerciseRequest();
        exerciseRequest.setExerciseId(1);
        exerciseRequest.setType(ExerciseType.WEIGHT);
        exerciseRequest.setSortOrder(1);
        
        UpdateSessionSetRequest setRequest1 = new UpdateSessionSetRequest();
        setRequest1.setSetOrder(1);
        setRequest1.setReps(10);
        setRequest1.setWeight(100.0);
        setRequest1.setRpe(8.0);
        
        UpdateSessionSetRequest setRequest2 = new UpdateSessionSetRequest();
        setRequest2.setSetOrder(2);
        setRequest2.setReps(8);
        setRequest2.setWeight(120.0);
        setRequest2.setRpe(9.0);
        
        exerciseRequest.setSets(List.of(setRequest1, setRequest2));
        request.setExercises(List.of(exerciseRequest));

        when(workoutSessionRepository.findById(1)).thenReturn(Optional.of(testWorkout));
        when(exerciseRepository.findById(1)).thenReturn(Optional.of(testExercise));
        when(workoutSessionRepository.save(any(WorkoutSession.class))).thenAnswer(invocation -> {
            WorkoutSession saved = invocation.getArgument(0);
            assertThat(saved.getExercises()).hasSize(1);
            assertThat(saved.getExercises().get(0).getSets()).hasSize(2);
            return testWorkout;
        });

        // When
        WorkoutResponse response = workoutService.updateWorkout(1, request);

        // Then
        assertThat(response).isNotNull();
        verify(workoutSessionRepository, times(1)).findById(1);
        verify(exerciseRepository, times(1)).findById(1);
        verify(workoutSessionRepository, times(1)).save(any(WorkoutSession.class));
    }

    @Test
    void updateWorkout_ShouldUpdateWithMultipleExercisesAndMultipleSets() {
        // Given
        UpdateWorkoutRequest request = new UpdateWorkoutRequest();
        
        Exercise exercise2 = new Exercise();
        exercise2.setExerciseId(2);
        exercise2.setName("Squat");
        
        UpdateSessionExerciseRequest exerciseRequest1 = new UpdateSessionExerciseRequest();
        exerciseRequest1.setExerciseId(1);
        exerciseRequest1.setType(ExerciseType.WEIGHT);
        exerciseRequest1.setSortOrder(1);
        
        UpdateSessionSetRequest set1 = new UpdateSessionSetRequest();
        set1.setSetOrder(1);
        set1.setReps(5);
        set1.setWeight(135.0);
        exerciseRequest1.setSets(List.of(set1));
        
        UpdateSessionExerciseRequest exerciseRequest2 = new UpdateSessionExerciseRequest();
        exerciseRequest2.setExerciseId(2);
        exerciseRequest2.setType(ExerciseType.WEIGHT);
        exerciseRequest2.setSortOrder(2);
        
        UpdateSessionSetRequest set2 = new UpdateSessionSetRequest();
        set2.setSetOrder(1);
        set2.setReps(8);
        set2.setWeight(80.0);
        
        UpdateSessionSetRequest set3 = new UpdateSessionSetRequest();
        set3.setSetOrder(2);
        set3.setReps(8);
        set3.setWeight(80.0);
        
        exerciseRequest2.setSets(List.of(set2, set3));
        
        request.setExercises(List.of(exerciseRequest1, exerciseRequest2));

        when(workoutSessionRepository.findById(1)).thenReturn(Optional.of(testWorkout));
        when(exerciseRepository.findById(1)).thenReturn(Optional.of(testExercise));
        when(exerciseRepository.findById(2)).thenReturn(Optional.of(exercise2));
        when(workoutSessionRepository.save(any(WorkoutSession.class))).thenAnswer(invocation -> {
            WorkoutSession saved = invocation.getArgument(0);
            assertThat(saved.getExercises()).hasSize(2);
            assertThat(saved.getExercises().get(0).getSets()).hasSize(1);
            assertThat(saved.getExercises().get(1).getSets()).hasSize(2);
            return testWorkout;
        });

        // When
        WorkoutResponse response = workoutService.updateWorkout(1, request);

        // Then
        assertThat(response).isNotNull();
        verify(workoutSessionRepository, times(1)).findById(1);
        verify(exerciseRepository, times(1)).findById(1);
        verify(exerciseRepository, times(1)).findById(2);
        verify(workoutSessionRepository, times(1)).save(any(WorkoutSession.class));
    }

    @Test
    void updateWorkout_ShouldThrowExceptionWhenExerciseNotFound() {
        // Given
        UpdateWorkoutRequest request = new UpdateWorkoutRequest();
        
        UpdateSessionExerciseRequest exerciseRequest = new UpdateSessionExerciseRequest();
        exerciseRequest.setExerciseId(999); // Non-existent exercise
        exerciseRequest.setType(ExerciseType.WEIGHT);
        
        request.setExercises(List.of(exerciseRequest));

        when(workoutSessionRepository.findById(1)).thenReturn(Optional.of(testWorkout));
        when(exerciseRepository.findById(999)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> workoutService.updateWorkout(1, request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Exercise not found");
        
        verify(exerciseRepository, times(1)).findById(999);
        verify(workoutSessionRepository, never()).save(any());
    }

    @Test
    void updateWorkout_ShouldNotClearExercisesWhenExercisesIsNull() {
        // Given - workout already has exercises
        SessionExercise existingExercise = new SessionExercise();
        existingExercise.setSessionExerciseId(1);
        existingExercise.setSession(testWorkout);
        existingExercise.setExercise(testExercise);
        testWorkout.getExercises().add(existingExercise);
        
        UpdateWorkoutRequest request = new UpdateWorkoutRequest();
        request.setNotes("Updated notes only");
        request.setExercises(null); // Null exercises should not clear

        when(workoutSessionRepository.findById(1)).thenReturn(Optional.of(testWorkout));
        when(workoutSessionRepository.save(any(WorkoutSession.class))).thenAnswer(invocation -> {
            WorkoutSession saved = invocation.getArgument(0);
            assertThat(saved.getExercises()).hasSize(1); // Should still have existing exercise
            return testWorkout;
        });

        // When
        WorkoutResponse response = workoutService.updateWorkout(1, request);

        // Then
        assertThat(response).isNotNull();
        verify(workoutSessionRepository, times(1)).save(any(WorkoutSession.class));
        verify(exerciseRepository, never()).findById(any());
    }

    @Test
    void updateWorkout_ShouldClearExercisesWhenExercisesIsEmptyList() {
        // Given - workout already has exercises
        SessionExercise existingExercise = new SessionExercise();
        existingExercise.setSessionExerciseId(1);
        existingExercise.setSession(testWorkout);
        existingExercise.setExercise(testExercise);
        testWorkout.getExercises().add(existingExercise);
        
        UpdateWorkoutRequest request = new UpdateWorkoutRequest();
        request.setNotes("Clearing exercises");
        request.setExercises(List.of()); // Empty list should clear

        when(workoutSessionRepository.findById(1)).thenReturn(Optional.of(testWorkout));
        when(workoutSessionRepository.save(any(WorkoutSession.class))).thenAnswer(invocation -> {
            WorkoutSession saved = invocation.getArgument(0);
            assertThat(saved.getExercises()).isEmpty(); // Should be cleared
            return testWorkout;
        });

        // When
        WorkoutResponse response = workoutService.updateWorkout(1, request);

        // Then
        assertThat(response).isNotNull();
        verify(workoutSessionRepository, times(1)).save(any(WorkoutSession.class));
    }

    @Test
    void updateWorkout_ShouldNotAddSetsWhenSetsIsNull() {
        // Given
        UpdateWorkoutRequest request = new UpdateWorkoutRequest();
        
        UpdateSessionExerciseRequest exerciseRequest = new UpdateSessionExerciseRequest();
        exerciseRequest.setExerciseId(1);
        exerciseRequest.setType(ExerciseType.WEIGHT);
        exerciseRequest.setSortOrder(1);
        exerciseRequest.setSets(null); // Null sets
        
        request.setExercises(List.of(exerciseRequest));

        when(workoutSessionRepository.findById(1)).thenReturn(Optional.of(testWorkout));
        when(exerciseRepository.findById(1)).thenReturn(Optional.of(testExercise));
        when(workoutSessionRepository.save(any(WorkoutSession.class))).thenAnswer(invocation -> {
            WorkoutSession saved = invocation.getArgument(0);
            assertThat(saved.getExercises()).hasSize(1);
            assertThat(saved.getExercises().get(0).getSets()).isEmpty();
            return testWorkout;
        });

        // When
        WorkoutResponse response = workoutService.updateWorkout(1, request);

        // Then
        assertThat(response).isNotNull();
        verify(workoutSessionRepository, times(1)).save(any(WorkoutSession.class));
    }

    @Test
    void updateWorkout_ShouldNotAddSetsWhenSetsIsEmptyList() {
        // Given
        UpdateWorkoutRequest request = new UpdateWorkoutRequest();
        
        UpdateSessionExerciseRequest exerciseRequest = new UpdateSessionExerciseRequest();
        exerciseRequest.setExerciseId(1);
        exerciseRequest.setType(ExerciseType.WEIGHT);
        exerciseRequest.setSortOrder(1);
        exerciseRequest.setSets(List.of()); // Empty sets list
        
        request.setExercises(List.of(exerciseRequest));

        when(workoutSessionRepository.findById(1)).thenReturn(Optional.of(testWorkout));
        when(exerciseRepository.findById(1)).thenReturn(Optional.of(testExercise));
        when(workoutSessionRepository.save(any(WorkoutSession.class))).thenAnswer(invocation -> {
            WorkoutSession saved = invocation.getArgument(0);
            assertThat(saved.getExercises()).hasSize(1);
            assertThat(saved.getExercises().get(0).getSets()).isEmpty();
            return testWorkout;
        });

        // When
        WorkoutResponse response = workoutService.updateWorkout(1, request);

        // Then
        assertThat(response).isNotNull();
        verify(workoutSessionRepository, times(1)).save(any(WorkoutSession.class));
    }

    @Test
    void updateWorkout_ShouldUpdateAllSetFields() {
        // Given - Test all set fields: reps, weight, rpe, durationMin, distanceM, caloriesBurned
        UpdateWorkoutRequest request = new UpdateWorkoutRequest();
        
        UpdateSessionExerciseRequest exerciseRequest = new UpdateSessionExerciseRequest();
        exerciseRequest.setExerciseId(1);
        exerciseRequest.setType(ExerciseType.CARDIO);
        exerciseRequest.setSortOrder(1);
        
        UpdateSessionSetRequest setRequest = new UpdateSessionSetRequest();
        setRequest.setSetOrder(1);
        setRequest.setReps(20);
        setRequest.setWeight(null); // Cardio might not have weight
        setRequest.setRpe(7.0);
        setRequest.setDurationMin(30.0);
        setRequest.setDistanceM(5000.0);
        setRequest.setCaloriesBurned(300.0);
        
        exerciseRequest.setSets(List.of(setRequest));
        request.setExercises(List.of(exerciseRequest));

        when(workoutSessionRepository.findById(1)).thenReturn(Optional.of(testWorkout));
        when(exerciseRepository.findById(1)).thenReturn(Optional.of(testExercise));
        when(workoutSessionRepository.save(any(WorkoutSession.class))).thenAnswer(invocation -> {
            WorkoutSession saved = invocation.getArgument(0);
            assertThat(saved.getExercises()).hasSize(1);
            SessionSet savedSet = saved.getExercises().get(0).getSets().get(0);
            assertThat(savedSet.getReps()).isEqualTo(20);
            assertThat(savedSet.getRpe()).isEqualTo(7.0);
            assertThat(savedSet.getDurationMin()).isEqualTo(30.0);
            assertThat(savedSet.getDistanceM()).isEqualTo(5000.0);
            assertThat(savedSet.getCaloriesBurned()).isEqualTo(300.0);
            return testWorkout;
        });

        // When
        WorkoutResponse response = workoutService.updateWorkout(1, request);

        // Then
        assertThat(response).isNotNull();
        verify(workoutSessionRepository, times(1)).save(any(WorkoutSession.class));
    }

    @Test
    void deleteWorkout_ShouldDeleteWorkout() {
        // Given
        doNothing().when(workoutSessionRepository).deleteById(1);

        // When
        workoutService.deleteWorkout(1);

        // Then
        verify(workoutSessionRepository, times(1)).deleteById(1);
    }
}
