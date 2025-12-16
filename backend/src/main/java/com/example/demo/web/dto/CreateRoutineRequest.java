package com.example.demo.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class CreateRoutineRequest {
    @NotBlank private String name;
    private String notes;
    @NotNull private Integer userId;
    @NotEmpty private List<CreateRoutineExerciseRequest> exercises;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public List<CreateRoutineExerciseRequest> getExercises() { return exercises; }
    public void setExercises(List<CreateRoutineExerciseRequest> exercises) { this.exercises = exercises; }
}