//AI ACKNOWLEDGMENT: AI WAS USED TO HELP DEVELOP AND IMPLEMENT WORKOUT SESSION LOGIC

package com.example.demo.controller;

import com.example.demo.service.WorkoutService;
import com.example.demo.web.dto.CreateWorkoutRequest;
import com.example.demo.web.dto.WorkoutResponse;
import com.example.demo.web.dto.AddExerciseToWorkoutRequest;
import com.example.demo.web.dto.SessionExerciseResponse;
import com.example.demo.web.dto.LogSetRequest;
import com.example.demo.web.dto.SessionSetResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.web.dto.UpdateWorkoutRequest;
import com.example.demo.web.dto.UpdateSessionExerciseRequest;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutSessionController {
    
    private final WorkoutService workoutService;
    
    public WorkoutSessionController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }
    
    @PostMapping
    public ResponseEntity<WorkoutResponse> createWorkout(@Valid @RequestBody CreateWorkoutRequest request) {
        WorkoutResponse response = workoutService.createWorkout(request);
        System.out.println("Workout created: " + response);
        return ResponseEntity.ok(response);
    }
    

    //gets the information for a specific workout (different exercises)
    @GetMapping("/{workoutId}")
    public ResponseEntity<WorkoutResponse> getWorkout(@PathVariable Integer workoutId) {
        //Get the workout data (highlevel)
        WorkoutResponse response = workoutService.getWorkout(workoutId);

        return ResponseEntity.ok(response);
    }

    //gets the for a specific session Exercise (specified from the endpoint above)
    @GetMapping("/{workoutId}/exercises/{sessionExerciseId}/sets")
    public ResponseEntity<List<SessionSetResponse>> getWorkoutExerciseSets(@PathVariable Integer workoutId, @PathVariable Integer sessionExerciseId) {
        List<SessionSetResponse> sets = workoutService.getWorkoutExerciseSets(sessionExerciseId);
        return ResponseEntity.ok(sets);
    }
    
    //gets the information for all workouts for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WorkoutResponse>> getUserWorkouts(@PathVariable Integer userId) {
        List<WorkoutResponse> workouts = workoutService.getUserWorkouts(userId);
        return ResponseEntity.ok(workouts);
    }

    //gets the information for all exercises for a specific workout (probably not needed as we get this from the workout endpoint)
    @GetMapping("/{workoutId}/exercises")
    public ResponseEntity<List<SessionExerciseResponse>> getWorkoutExercises(@PathVariable Integer workoutId) {
        List<SessionExerciseResponse> exercises = workoutService.getWorkoutExercises(workoutId);
        return ResponseEntity.ok(exercises);
    }
    
    @PostMapping("/{workoutId}/exercises")
    public ResponseEntity<SessionExerciseResponse> addExerciseToWorkout(@PathVariable Integer workoutId, @Valid @RequestBody AddExerciseToWorkoutRequest request) {
        SessionExerciseResponse response = workoutService.addExerciseToWorkout(workoutId, request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping ("/{workoutId}/exercises/{sessionExerciseId}/sets")
    public ResponseEntity<SessionSetResponse> logSet(@PathVariable Integer workoutId, @PathVariable Integer sessionExerciseId, @Valid @RequestBody LogSetRequest request) {
        SessionSetResponse response = workoutService.logSet(sessionExerciseId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{workoutId}")
    public ResponseEntity<WorkoutResponse> updateWorkout(@PathVariable Integer workoutId, @Valid @RequestBody UpdateWorkoutRequest request) {
        WorkoutResponse response = workoutService.updateWorkout(workoutId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{workoutId}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Integer workoutId) {
        workoutService.deleteWorkout(workoutId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/exercises/{sessionExerciseId}")
    public ResponseEntity<SessionExerciseResponse> getSessionExercise(@PathVariable Integer sessionExerciseId) {
        SessionExerciseResponse response = workoutService.getSessionExercise(sessionExerciseId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/exercises/{sessionExerciseId}")
    public ResponseEntity<SessionExerciseResponse> updateSessionExercise(
            @PathVariable Integer sessionExerciseId,
            @Valid @RequestBody UpdateSessionExerciseRequest request) {
        SessionExerciseResponse response = workoutService.updateSessionExercise(sessionExerciseId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/exercises/{sessionExerciseId}")
    public ResponseEntity<Void> deleteSessionExercise(@PathVariable Integer sessionExerciseId) {
        workoutService.deleteSessionExercise(sessionExerciseId);
        return ResponseEntity.noContent().build();
    }
}