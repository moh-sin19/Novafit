package com.example.demo.web.dto;

import com.example.demo.model.RoutineExercise;
import com.example.demo.model.ExerciseType;
import java.util.List;
import java.util.stream.Collectors;

public class RoutineExerciseResponse {
    private Integer routineExerciseId;
    private Integer exerciseId;
    private String exerciseName;      // ← From Exercise entity
    private ExerciseType type;
    private Integer sortOrder;
    private String notes;
    private List<RoutineSetResponse> sets;

    public static RoutineExerciseResponse from(RoutineExercise routineExercise) {
        RoutineExerciseResponse response = new RoutineExerciseResponse();
        response.setRoutineExerciseId(routineExercise.getRoutineExerciseId());
        response.setExerciseId(routineExercise.getExercise().getExerciseId());
        response.setExerciseName(routineExercise.getExercise().getName());
        response.setType(routineExercise.getType());
        response.setSortOrder(routineExercise.getSortOrder());
        response.setNotes(routineExercise.getNotes());
        response.setSets(routineExercise.getSets().stream()
            .map(RoutineSetResponse::from)
            .collect(Collectors.toList()));
        return response;
    }
    
    // Getters and setters...
    public Integer getRoutineExerciseId() { return routineExerciseId; }
    public void setRoutineExerciseId(Integer routineExerciseId) { this.routineExerciseId = routineExerciseId; }
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
    public List<RoutineSetResponse> getSets() { return sets; }
    public void setSets(List<RoutineSetResponse> sets) { this.sets = sets; }
}
