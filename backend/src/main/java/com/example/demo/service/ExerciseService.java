package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import com.example.demo.web.dto.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class ExerciseService {
    @Autowired
    private UserService userService;
    @Autowired
    private ExerciseRepository exerciseRepository;

//    private final ExerciseRepository exerciseRepository;

    public ExerciseService(
        UserService userService,
        ExerciseRepository exerciseRepository
    ) {
        this.userService = userService;
        this.exerciseRepository = exerciseRepository;
    }
    
    public ExerciseResponse createExercise(CreateExerciseRequest request) {
        //Get user
        User user = userService.getUserOrThrow(request.getUserId());

        //Create new exercise
        Exercise exercise = new Exercise();
        exercise.setName(request.getName());
        exercise.setCreatedBy(user);
        exercise.setDescription(request.getDescription());
        exercise.setLastUpdated(Instant.now());
        
        //Save to database
        Exercise saved = exerciseRepository.save(exercise);
        
        //Convert to response and return
        return ExerciseResponse.from(saved);
    }

    @Transactional
    public List<ExerciseResponse> getAllExercises() {
        List<Exercise> exercises = exerciseRepository.findAll();
        return exercises.stream()
            .map(ExerciseResponse::from)
            .collect(Collectors.toList());
    }

//    public void deleteExercise(Integer exerciseId){
//        exerciseRepository.deleteById(exerciseId);
//    }
}