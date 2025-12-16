package com.example.demo.web.dto;

import com.example.demo.model.GoalType;
import com.example.demo.model.GoalFrequency;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;


public class CreateGoalRequest {
    @NotNull(message = "Goal type is required")
    private GoalType type;

    @NotNull(message = "Goal frequency is required")
    private GoalFrequency frequency;

    @NotNull(message = "Target value is required")
    @Positive(message = "Target value must be positive")
    private Double targetValue;

    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date must be today or in the future")
    private LocalDate startDate;

    @Future(message = "End date must be in the future")
    private LocalDate endDate;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;

    // Constructors
    public CreateGoalRequest() {}

    public CreateGoalRequest(GoalType type, GoalFrequency frequency, Double targetValue, 
                           LocalDate startDate, LocalDate endDate, String description, String notes) {
        this.type = type;
        this.frequency = frequency;
        this.targetValue = targetValue;
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
        this.notes = notes;
    }

    // Getters and setters
    public GoalType getType() { return type; }
    public void setType(GoalType type) { this.type = type; }

    public GoalFrequency getFrequency() { return frequency; }
    public void setFrequency(GoalFrequency frequency) { this.frequency = frequency; }

    public Double getTargetValue() { return targetValue; }
    public void setTargetValue(Double targetValue) { this.targetValue = targetValue; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
