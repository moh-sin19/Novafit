package com.example.demo.web.dto;

import java.util.List;
import com.example.demo.model.ExerciseType;

public class UpdateSessionExerciseRequest {
    private Integer sessionExerciseId;  // null for new exercises
    private Integer exerciseId;
    private ExerciseType type;
    private Integer sortOrder;
    private String notes;
    private List<UpdateSessionSetRequest> sets;

    public UpdateSessionExerciseRequest() {}

    //getters and setters
    public Integer getSessionExerciseId() { return sessionExerciseId; }
    public void setSessionExerciseId(Integer sessionExerciseId) { this.sessionExerciseId = sessionExerciseId; }
    public Integer getExerciseId() { return exerciseId; }
    public void setExerciseId(Integer exerciseId) { this.exerciseId = exerciseId; }
    public ExerciseType getType() { return type; }
    public void setType(ExerciseType type) { this.type = type; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public List<UpdateSessionSetRequest> getSets() { return sets; }
    public void setSets(List<UpdateSessionSetRequest> sets) { this.sets = sets; }
}