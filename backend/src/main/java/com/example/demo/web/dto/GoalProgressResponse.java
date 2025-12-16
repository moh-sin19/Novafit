package com.example.demo.web.dto;

import com.example.demo.model.Goal;
import com.example.demo.model.GoalType;
import com.example.demo.model.GoalFrequency;
import com.example.demo.model.GoalStatus;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public class GoalProgressResponse {
    // Basic goal information (extends GoalResponse)
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

    // Progress calculations
    private Double currentValue;
    private Double progressPercentage;
    private Long daysRemaining;
    private Long daysElapsed;
    private Double averageDailyProgress;
    private Double requiredDailyProgress;
    private boolean onTrack;
    private String progressStatus; // "on_track", "behind", "ahead", "completed"

    // Progress history (optional)
    private List<ProgressEntry> recentProgress;

    // Constructors
    public GoalProgressResponse() {}

    public GoalProgressResponse(Integer goalId, Integer userId, GoalType type, GoalFrequency frequency, 
                              Double targetValue, LocalDate startDate, LocalDate endDate, GoalStatus status, 
                              boolean achieved, Instant lastUpdated, String description, String notes,
                              Double currentValue, Double progressPercentage, Long daysRemaining, 
                              Long daysElapsed, Double averageDailyProgress, Double requiredDailyProgress,
                              boolean onTrack, String progressStatus, List<ProgressEntry> recentProgress) {
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
        this.currentValue = currentValue;
        this.progressPercentage = progressPercentage;
        this.daysRemaining = daysRemaining;
        this.daysElapsed = daysElapsed;
        this.averageDailyProgress = averageDailyProgress;
        this.requiredDailyProgress = requiredDailyProgress;
        this.onTrack = onTrack;
        this.progressStatus = progressStatus;
        this.recentProgress = recentProgress;
    }

    // Static factory method
    public static GoalProgressResponse from(Goal goal, Double currentValue) {
        GoalProgressResponse response = new GoalProgressResponse();
        
        // Basic goal information
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
        
        // Progress calculations
        response.currentValue = currentValue;
        response.progressPercentage = calculateProgressPercentage(
            currentValue, 
            goal.getTargetValue(), 
            goal.getStartValue(), 
            goal.getType()
        );
        response.daysRemaining = calculateDaysRemaining(goal.getEndDate());
        response.daysElapsed = calculateDaysElapsed(goal.getStartDate());
        response.averageDailyProgress = calculateAverageDailyProgress(currentValue, response.daysElapsed);
        response.requiredDailyProgress = calculateRequiredDailyProgress(goal.getTargetValue(), currentValue, response.daysRemaining);
        response.onTrack = calculateOnTrack(response.averageDailyProgress, response.requiredDailyProgress);
        response.progressStatus = determineProgressStatus(response.progressPercentage, response.onTrack, goal.isAchieved());

        // Special rule for calorie intake goals: going over target is considered "behind".
        if (goal.getType() == GoalType.CALORIES_KCAL && response.currentValue != null && response.targetValue != null) {
            if (response.currentValue > response.targetValue) {
                response.onTrack = false;
                response.progressStatus = "behind";
            } else {
                // At or below target is acceptable → treat as on track (do not force completed here)
                if (!"completed".equals(response.progressStatus)) {
                    response.progressStatus = "on_track";
                }
            }
        }

        // Special rule for workouts-per-week: only completed AFTER end date if avg >= target.
        if (goal.getType() == GoalType.WORKOUTS_PER_WEEK && response.currentValue != null && response.targetValue != null) {
            boolean meetsTarget = response.currentValue >= response.targetValue;
            LocalDate end = goal.getEndDate();
            if (end != null && LocalDate.now().isAfter(end) && meetsTarget) {
                response.progressStatus = "completed";
            } else if (meetsTarget) {
                response.progressStatus = "on_track";
            } else {
                response.progressStatus = "behind";
            }
        }
        
        return response;
    }

    // Helper methods for calculations
    private static Double calculateProgressPercentage(Double currentValue, Double targetValue, Double startValue, GoalType type) {
        if (targetValue == null || targetValue == 0) return 0.0;
        
        // For WEIGHT_KG and BMI goals, calculate directional progress
        if (type == GoalType.WEIGHT_KG || type == GoalType.BMI) {
            if (startValue == null) {
                // Fallback to old calculation if startValue not set (for existing goals)
                return Math.min(100.0, (currentValue / targetValue) * 100.0);
            }
            
            // Determine if goal is to gain or lose
            if (targetValue > startValue) {
                // Gaining weight/BMI: progress from start to target
                if (currentValue <= startValue) return 0.0;
                if (currentValue >= targetValue) return 100.0;
                return ((currentValue - startValue) / (targetValue - startValue)) * 100.0;
            } else {
                // Losing weight/BMI: progress from start to target
                if (currentValue >= startValue) return 0.0;
                if (currentValue <= targetValue) return 100.0;
                return ((startValue - currentValue) / (startValue - targetValue)) * 100.0;
            }
        }
        
        // For other goal types, use the standard calculation
        return Math.min(100.0, (currentValue / targetValue) * 100.0);
    }

    private static Long calculateDaysRemaining(LocalDate endDate) {
        if (endDate == null) return null;
        return java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), endDate);
    }

    private static Long calculateDaysElapsed(LocalDate startDate) {
        if (startDate == null) return 0L;
        return java.time.temporal.ChronoUnit.DAYS.between(startDate, LocalDate.now());
    }

    private static Double calculateAverageDailyProgress(Double currentValue, Long daysElapsed) {
        if (daysElapsed == null || daysElapsed == 0) return 0.0;
        return currentValue / daysElapsed;
    }

    private static Double calculateRequiredDailyProgress(Double targetValue, Double currentValue, Long daysRemaining) {
        if (daysRemaining == null || daysRemaining <= 0) return 0.0;
        return (targetValue - currentValue) / daysRemaining;
    }

    private static boolean calculateOnTrack(Double averageDailyProgress, Double requiredDailyProgress) {
        if (averageDailyProgress == null || requiredDailyProgress == null) return false;
        return averageDailyProgress >= requiredDailyProgress;
    }

    private static String determineProgressStatus(Double progressPercentage, boolean onTrack, boolean achieved) {
        if (achieved) return "completed";
        if (progressPercentage >= 100.0) return "completed";
        if (onTrack) return "on_track";
        return "behind";
    }

    // Inner class for progress history
    public static class ProgressEntry {
        private LocalDate date;
        private Double value;
        private Double dailyProgress;

        public ProgressEntry() {}

        public ProgressEntry(LocalDate date, Double value, Double dailyProgress) {
            this.date = date;
            this.value = value;
            this.dailyProgress = dailyProgress;
        }

        // Getters and setters
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }

        public Double getValue() { return value; }
        public void setValue(Double value) { this.value = value; }

        public Double getDailyProgress() { return dailyProgress; }
        public void setDailyProgress(Double dailyProgress) { this.dailyProgress = dailyProgress; }
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

    public Double getCurrentValue() { return currentValue; }
    public void setCurrentValue(Double currentValue) { this.currentValue = currentValue; }

    public Double getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Double progressPercentage) { this.progressPercentage = progressPercentage; }

    public Long getDaysRemaining() { return daysRemaining; }
    public void setDaysRemaining(Long daysRemaining) { this.daysRemaining = daysRemaining; }

    public Long getDaysElapsed() { return daysElapsed; }
    public void setDaysElapsed(Long daysElapsed) { this.daysElapsed = daysElapsed; }

    public Double getAverageDailyProgress() { return averageDailyProgress; }
    public void setAverageDailyProgress(Double averageDailyProgress) { this.averageDailyProgress = averageDailyProgress; }

    public Double getRequiredDailyProgress() { return requiredDailyProgress; }
    public void setRequiredDailyProgress(Double requiredDailyProgress) { this.requiredDailyProgress = requiredDailyProgress; }

    public boolean isOnTrack() { return onTrack; }
    public void setOnTrack(boolean onTrack) { this.onTrack = onTrack; }

    public String getProgressStatus() { return progressStatus; }
    public void setProgressStatus(String progressStatus) { this.progressStatus = progressStatus; }

    public List<ProgressEntry> getRecentProgress() { return recentProgress; }
    public void setRecentProgress(List<ProgressEntry> recentProgress) { this.recentProgress = recentProgress; }
}
