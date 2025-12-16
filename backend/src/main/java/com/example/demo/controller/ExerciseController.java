package com.example.demo.controller;

import com.example.demo.model.ExerciseType;
import com.example.demo.service.ExerciseService;
import com.example.demo.web.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }
    
    @PostMapping
    public ResponseEntity<ExerciseResponse> createExercise(@Valid @RequestBody CreateExerciseRequest request) {
        ExerciseResponse response = exerciseService.createExercise(request);
        System.out.println("Exercise created: " + response);
        return ResponseEntity.ok(response);
    }
    
    //gets the information for all exercises for a specific type
    @GetMapping("/all")
    public ResponseEntity<List<ExerciseResponse>> getAllExercises() {
        List<ExerciseResponse> exercises = exerciseService.getAllExercises();

        System.out.println("exercises " + exercises);

        return ResponseEntity.ok(exercises);
    }


    

    


}