package com.example.demo.web.dto;

import com.example.demo.model.Goal;
import com.example.demo.model.GoalType;
import com.example.demo.model.GoalFrequency;
import com.example.demo.model.GoalStatus;
import java.time.Instant;
import java.time.LocalDate;

public class GoalResponse {
    private Integer goalId;
    private Integer userId;
    private GoalType type;
    private GoalFrequency frequency;
    private Double targetValue;
    private LocalDate startDate;
    private LocalDate endDate;
    private GoalStatus status;
    private boolean achieved;
    private Instant lastUpdated;
    private String description;
    private String notes;

    // Constructors
    public GoalResponse() {}

    public GoalResponse(Integer goalId, Integer userId, GoalType type, GoalFrequency frequency, 
                      Double targetValue, LocalDate startDate, LocalDate endDate, GoalStatus status, 
                      boolean achieved, Instant lastUpdated, String description, String notes) {
        this.goalId = goalId;
        this.userId = userId;
        this.type = type;
        this.frequency = frequency;
        this.targetValue = targetValue;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.achieved = achieved;
        this.lastUpdated = lastUpdated;
        this.description = description;
        this.notes = notes;
    }

    // Static factory method
    public static GoalResponse from(Goal goal) {
        GoalResponse response = new GoalResponse();
        response.goalId = goal.getGoalId();
        response.userId = goal.getUser().getUserId();
        response.type = goal.getType();
        response.frequency = goal.getFrequency();
        response.targetValue = goal.getTargetValue();
        response.startDate = goal.getStartDate();
        response.endDate = goal.getEndDate();
        response.status = goal.getStatus();
        response.achieved = goal.isAchieved();
        response.lastUpdated = goal.getLastUpdated();
        response.description = null; // Will be added to Goal model later
        response.notes = null; // Will be added to Goal model later
        return response;
    }

    // Getters and setters
    public Integer getGoalId() { return goalId; }
    public void setGoalId(Integer goalId) { this.goalId = goalId; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

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

    public boolean isAchieved() { return achieved; }
    public void setAchieved(boolean achieved) { this.achieved = achieved; }

    public Instant getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(Instant lastUpdated) { this.lastUpdated = lastUpdated; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
