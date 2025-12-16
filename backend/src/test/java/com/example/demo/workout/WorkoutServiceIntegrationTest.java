package com.example.demo.workout;

import com.example.demo.model.Exercise;
import com.example.demo.model.ExerciseType;
import com.example.demo.model.User;
import com.example.demo.service.WorkoutService;
import com.example.demo.web.dto.AddExerciseToWorkoutRequest;
import com.example.demo.web.dto.CreateWorkoutRequest;
import com.example.demo.web.dto.LogSetRequest;
import com.example.demo.web.dto.SessionExerciseResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class WorkoutServiceIntegrationTest {

    @Autowired
    private WorkoutService workoutService;

    @Autowired
    private com.example.demo.repository.UserRepository userRepository;

    @Autowired
    private com.example.demo.repository.ExerciseRepository exerciseRepository;

    // @Test
    // void getWorkoutExercises_returnsExercisesWithSets() {
    //     // Arrange: create user and exercise
    //     User user = userRepository.save(new User("integration@example.com", "integration-user", "secret"));

    //     Exercise exercise = new Exercise();
    //     exercise.setName("Bench Press");
    //     exercise = exerciseRepository.save(exercise);

    //     CreateWorkoutRequest createWorkoutRequest = new CreateWorkoutRequest();
    //     createWorkoutRequest.setUserId(user.getUserId());
    //     createWorkoutRequest.setDate(LocalDate.now());
    //     createWorkoutRequest.setNotes("integration workout");

    //     var workoutResponse = workoutService.createWorkout(createWorkoutRequest);

    //     AddExerciseToWorkoutRequest addExerciseRequest = new AddExerciseToWorkoutRequest();
    //     addExerciseRequest.setExerciseId(exercise.getExerciseId());
    //     addExerciseRequest.setType(ExerciseType.WEIGHT);
    //     addExerciseRequest.setSortOrder(1);

    //     var sessionExercise = workoutService.addExerciseToWorkout(workoutResponse.getWorkoutId(), addExerciseRequest);

    //     LogSetRequest logSetRequest = new LogSetRequest();
    //     logSetRequest.setSetOrder(1);
    //     logSetRequest.setReps(8);
    //     logSetRequest.setWeight(50.0);

    //     workoutService.logSet(sessionExercise.getSessionExerciseId(), logSetRequest);

    //     // Act
    //     List<SessionExerciseResponse> exercises =
    //         workoutService.getWorkoutExercises(workoutResponse.getWorkoutId());

    //     // Assert
    //     assertThat(exercises).hasSize(1);
    //     var sessionExerciseResponse = exercises.get(0);
    //     assertThat(sessionExerciseResponse.getExerciseName()).isEqualTo("Bench Press");
    //     assertThat(sessionExerciseResponse.getSets()).hasSize(1);
    //     assertThat(sessionExerciseResponse.getSets().get(0).getReps()).isEqualTo(8);
    // }
}
