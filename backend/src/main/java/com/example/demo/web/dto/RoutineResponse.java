package com.example.demo.web.dto;

import com.example.demo.model.Routine;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

public class RoutineResponse {
    private Integer routineId;
    private Integer createdByUserId;   
    private String createdByUsername;  
    private String name;
    private String notes;
    private Instant lastUpdated;
    private List<RoutineExerciseResponse> exercises;

    public static RoutineResponse from(Routine routine) {
        RoutineResponse response = new RoutineResponse();
        response.setRoutineId(routine.getRoutineId());
        response.setCreatedByUserId(routine.getCreatedBy().getUserId());
        response.setCreatedByUsername(routine.getCreatedBy().getUsername());
        response.setName(routine.getName());
        response.setNotes(routine.getNotes());
        response.setLastUpdated(routine.getLastUpdated());
        response.setExercises(routine.getExercises().stream()
            .map(RoutineExerciseResponse::from)
            .collect(Collectors.toList()));
        return response;
    }
    
    // Getters and setters...
    public Integer getRoutineId() { return routineId; }
    public void setRoutineId(Integer routineId) { this.routineId = routineId; }
    public Integer getCreatedByUserId() { return createdByUserId; }
    public void setCreatedByUserId(Integer createdByUserId) { this.createdByUserId = createdByUserId; }
    public String getCreatedByUsername() { return createdByUsername; }
    public void setCreatedByUsername(String createdByUsername) { this.createdByUsername = createdByUsername; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Instant getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(Instant lastUpdated) { this.lastUpdated = lastUpdated; }
    public List<RoutineExerciseResponse> getExercises() { return exercises; }
    public void setExercises(List<RoutineExerciseResponse> exercises) { this.exercises = exercises; }
}
