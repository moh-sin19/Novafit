package com.example.demo.web.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class UpdateRoutineRequest {
    @NotBlank private String name;
    private String notes;
    private List<CreateRoutineExerciseRequest> exercises;
    
    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public List<CreateRoutineExerciseRequest> getExercises() {
        return exercises; }
    
    public void setExercises(List<CreateRoutineExerciseRequest> exercises) {
        this.exercises = exercises; }
}