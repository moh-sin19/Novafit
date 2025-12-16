package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import com.example.demo.web.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoutineService {
    @Autowired
    private UserService userService;
    @Autowired
    private ExerciseRepository exerciseRepository;
    @Autowired
    private RoutineRepository routineRepository;


    public RoutineService(
        UserService userService,
        ExerciseRepository exerciseRepository,
        RoutineRepository routineRepository
    ) {
        this.userService = userService;
        this.exerciseRepository = exerciseRepository;
        this.routineRepository = routineRepository;
    }

    public RoutineResponse createRoutine(CreateRoutineRequest request) {
    
        User user = userService.getUserOrThrow(request.getUserId());
        
        //Create routine
        Routine routine = new Routine();
        routine.setName(request.getName());
        routine.setNotes(request.getNotes());
        routine.setCreatedBy(user);
        routine.setLastUpdated(Instant.now());
        
        //Create exercises and sets
        for (CreateRoutineExerciseRequest exerciseReq : request.getExercises()) {
            RoutineExercise routineExercise = new RoutineExercise();
            routineExercise.setRoutine(routine);
            routineExercise.setExercise(exerciseRepository.findById(exerciseReq.getExerciseId()).orElse(null));        routineExercise.setType(exerciseReq.getType());
            routineExercise.setSortOrder(exerciseReq.getSortOrder());
            routineExercise.setNotes(exerciseReq.getNotes());
            
            // Create sets for this exercise
            for (CreateRoutineSetRequest setReq : exerciseReq.getSets()) {
                RoutineSet routineSet = new RoutineSet();
                routineSet.setRoutineExercise(routineExercise);
                routineSet.setSetOrder(setReq.getSetOrder());
                routineSet.setTargetReps(setReq.getTargetReps());
                routineSet.setTargetWeight(setReq.getTargetWeight());
                routineSet.setTargetDurationMin(setReq.getTargetDurationMin());
                routineSet.setTargetDistanceM(setReq.getTargetDistanceM());
                routineExercise.getSets().add(routineSet);
            }
            
            routine.getExercises().add(routineExercise);
    }
    
    // Save everything (cascade handles exercises and sets)
    Routine savedRoutine = routineRepository.save(routine);
    return RoutineResponse.from(savedRoutine);
    }

    public List<RoutineResponse> getUserRoutines(Integer userId) {
    List<Routine> routines = routineRepository.findByCreatedByUserIdOrderByNameAsc(userId);
    return routines.stream()
        .map(RoutineResponse::from)
        .collect(Collectors.toList());
}
    public RoutineResponse getRoutine(Integer routineId) {
    Routine routine = routineRepository.findById(routineId).orElse(null);
    return routine != null ? RoutineResponse.from(routine) : null;
}
    public RoutineResponse updateRoutine(Integer routineId, UpdateRoutineRequest request) {
    // Get existing routine
    Routine routine = routineRepository.findById(routineId)
        .orElseThrow(() -> new RuntimeException("Routine not found with ID: " + routineId));
    
    // Update routine basic info
    routine.setName(request.getName());
    routine.setNotes(request.getNotes());
    routine.setLastUpdated(Instant.now());
    
    // Clear existing exercises (cascade will handle sets)
    routine.getExercises().clear();
    
    // Add new exercises and sets
    for (CreateRoutineExerciseRequest exerciseReq : request.getExercises()) {
        RoutineExercise routineExercise = new RoutineExercise();
        routineExercise.setRoutine(routine);
        routineExercise.setExercise(exerciseRepository.findById(exerciseReq.getExerciseId()).orElse(null));
        routineExercise.setType(exerciseReq.getType());
        routineExercise.setSortOrder(exerciseReq.getSortOrder());
        routineExercise.setNotes(exerciseReq.getNotes());
        
        // Create sets for this exercise
        for (CreateRoutineSetRequest setReq : exerciseReq.getSets()) {
            RoutineSet routineSet = new RoutineSet();
            routineSet.setRoutineExercise(routineExercise);
            routineSet.setSetOrder(setReq.getSetOrder());
            routineSet.setTargetReps(setReq.getTargetReps());
            routineSet.setTargetWeight(setReq.getTargetWeight());
            routineSet.setTargetDurationMin(setReq.getTargetDurationMin());
            routineSet.setTargetDistanceM(setReq.getTargetDistanceM());
            routineExercise.getSets().add(routineSet);
        }
        
        routine.getExercises().add(routineExercise);
    }
    
    // Save the updated routine
    Routine savedRoutine = routineRepository.save(routine);
    return RoutineResponse.from(savedRoutine);
}

    public void deleteRoutine(Integer routineId) {
        routineRepository.deleteById(routineId);
    }
    
}