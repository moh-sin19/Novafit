package com.example.demo.web.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import com.example.demo.model.ExerciseType;

public class CreateRoutineExerciseRequest {
    @NotNull private Integer exerciseId;
    @NotNull private ExerciseType type;
    @Min(1) private Integer sortOrder = 1;
    private String notes;
    @NotEmpty private List<CreateRoutineSetRequest> sets;

    public Integer getExerciseId() { return exerciseId; }
    public void setExerciseId(Integer exerciseId) { this.exerciseId = exerciseId; }
    public ExerciseType getType() { return type; }
    public void setType(ExerciseType type) { this.type = type; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public List<CreateRoutineSetRequest> getSets() { return sets; }
    public void setSets(List<CreateRoutineSetRequest> sets) { this.sets = sets; }
}