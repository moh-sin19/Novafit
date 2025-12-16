package com.example.demo.web.dto;

import com.example.demo.model.ExerciseType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

public class AddExerciseToWorkoutRequest {
    // @NotNull
    // private Integer sessionId;

    @NotNull
    private Integer exerciseId;
    // 
    @NotNull
    private ExerciseType type;

    @Min(1)
    private Integer sortOrder = 1;

    private String notes;

    public AddExerciseToWorkoutRequest() {}
    
    public Integer getExerciseId() { return exerciseId; }
    public void setExerciseId(Integer exerciseID){
        this.exerciseId = exerciseID;
    }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    // public Integer getSessionId() { return sessionId; }
    // public void setSessionId(Integer sessionId) { this.sessionId = sessionId; }

    public ExerciseType getType() { return type; }
    public void setType(ExerciseType type) { this.type = type; }
}