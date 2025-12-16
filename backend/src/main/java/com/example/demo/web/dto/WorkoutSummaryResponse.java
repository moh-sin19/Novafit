package com.example.demo.web.dto;

import com.example.demo.model.Goal;
import com.example.demo.model.GoalFrequency;
import com.example.demo.model.GoalStatus;
import com.example.demo.model.GoalType;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public class WorkoutSummaryResponse {
    private Integer userId;
    private LocalDate dateOfInterest;
    private Double currentValue;

    // Constructors
    public WorkoutSummaryResponse(Integer userId, LocalDate localDate, Double dailyCalories) {
        this.userId = userId;
        this.dateOfInterest = localDate;
        this.currentValue = dailyCalories;
    }

    // Getters and setters
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public LocalDate getDateOfInterest() { return dateOfInterest; }
    public void setDateOfInterest(LocalDate dateOfInterest) { this.dateOfInterest = dateOfInterest; }

    public Double getCurrentValue() { return currentValue; }
    public void setCurrentValue(Double currentValue) { this.currentValue = currentValue; }

}
