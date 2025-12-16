package com.example.demo.web.dto;

import com.example.demo.model.GoalType;
import com.example.demo.model.GoalFrequency;
import com.example.demo.model.GoalStatus;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class UpdateGoalRequest {
    // All fields optional for partial updates
    private GoalType type;

    private GoalFrequency frequency;

    @Positive(message = "Target value must be positive")
    private Double targetValue;

    private LocalDate startDate;

    @Future(message = "End date must be in the future")
    private LocalDate endDate;

    private GoalStatus status;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;

    // Constructors
    public UpdateGoalRequest() {}

    public UpdateGoalRequest(GoalType type, GoalFrequency frequency, Double targetValue, 
                           LocalDate startDate, LocalDate endDate, GoalStatus status, 
                           String description, String notes) {
        this.type = type;
        this.frequency = frequency;
        this.targetValue = targetValue;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
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

    public GoalStatus getStatus() { return status; }
    public void setStatus(GoalStatus status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}

