package com.example.demo.web.dto;

import com.example.demo.model.SessionExercise;
import com.example.demo.model.ExerciseType;
import java.util.List;
import java.util.stream.Collectors;

public class SessionExerciseResponse {
    private Integer sessionExerciseId;
    private Integer exerciseId;
    private String exerciseName;
    private ExerciseType type;
    private Integer sortOrder;
    private String notes;
    private List<SessionSetResponse> sets;
    
    public static SessionExerciseResponse from(SessionExercise sessionExercise) {
        SessionExerciseResponse response = new SessionExerciseResponse();
        response.setSessionExerciseId(sessionExercise.getSessionExerciseId());
        response.setExerciseId(sessionExercise.getExercise().getExerciseId());
        response.setExerciseName(sessionExercise.getExercise().getName());
        response.setType(sessionExercise.getType());
        response.setSortOrder(sessionExercise.getSortOrder());
        response.setNotes(sessionExercise.getNotes());
        
        // Convert sets from SessionSet to SessionSetResponse
        response.setSets(sessionExercise.getSets().stream()
            .map(SessionSetResponse::from)
            .collect(Collectors.toList()));
        
        return response;
    }
    
    // Getters and setters
    public Integer getSessionExerciseId() { return sessionExerciseId; }
    public void setSessionExerciseId(Integer sessionExerciseId) { this.sessionExerciseId = sessionExerciseId; }
    
    public Integer getExerciseId() { return exerciseId; }
    public void setExerciseId(Integer exerciseId) { this.exerciseId = exerciseId; }
    
    public String getExerciseName() { return exerciseName; }
    public void setExerciseName(String exerciseName) { this.exerciseName = exerciseName; }
    
    public ExerciseType getType() { return type; }
    public void setType(ExerciseType type) { this.type = type; }
    
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public List<SessionSetResponse> getSets() { return sets; }
    public void setSets(List<SessionSetResponse> sets) { this.sets = sets; }
}