package com.example.demo.web.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class GoalProgressRequest {
    @NotNull(message = "Goal ID is required")
    private Integer goalId;

    @NotNull(message = "Current value is required")
    @PositiveOrZero(message = "Current value must be zero or positive")
    private Double currentValue;

    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    private String notes;

    private LocalDate progressDate; // Defaults to today if not provided

    // Constructors
    public GoalProgressRequest() {}

    public GoalProgressRequest(Integer goalId, Double currentValue, String notes, LocalDate progressDate) {
        this.goalId = goalId;
        this.currentValue = currentValue;
        this.notes = notes;
        this.progressDate = progressDate;
    }

    // Getters and setters
    public Integer getGoalId() { return goalId; }
    public void setGoalId(Integer goalId) { this.goalId = goalId; }

    public Double getCurrentValue() { return currentValue; }
    public void setCurrentValue(Double currentValue) { this.currentValue = currentValue; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDate getProgressDate() { return progressDate; }
    public void setProgressDate(LocalDate progressDate) { this.progressDate = progressDate; }
}
