package com.example.demo.web.dto;

import com.example.demo.model.Goal;
import com.example.demo.model.GoalStatus;
import com.example.demo.model.GoalType;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class GoalListResponse {
    private List<GoalProgressResponse> goals;
    private Integer totalCount;
    private Integer activeCount;
    private Integer completedCount;
    private Integer overdueCount;
    private LocalDate generatedAt;

    // Optional filtering metadata
    private GoalStatus filterStatus;
    private GoalType filterType;
    private LocalDate dateRangeStart;
    private LocalDate dateRangeEnd;

    // Constructors
    public GoalListResponse() {}

    public GoalListResponse(List<GoalProgressResponse> goals, Integer totalCount, Integer activeCount, 
                          Integer completedCount, Integer overdueCount, LocalDate generatedAt,
                          GoalStatus filterStatus, GoalType filterType, LocalDate dateRangeStart, 
                          LocalDate dateRangeEnd) {
        this.goals = goals;
        this.totalCount = totalCount;
        this.activeCount = activeCount;
        this.completedCount = completedCount;
        this.overdueCount = overdueCount;
        this.generatedAt = generatedAt;
        this.filterStatus = filterStatus;
        this.filterType = filterType;
        this.dateRangeStart = dateRangeStart;
        this.dateRangeEnd = dateRangeEnd;
    }

    // Static factory method
    public static GoalListResponse from(List<Goal> goals, List<GoalProgressResponse> progressResponses) {
        GoalListResponse response = new GoalListResponse();
        
        response.goals = progressResponses;
        response.totalCount = goals.size();
        response.activeCount = (int) goals.stream().filter(g -> g.getStatus() == GoalStatus.active).count();
        response.completedCount = (int) goals.stream().filter(g -> g.isAchieved() || g.getStatus() == GoalStatus.done).count();
        response.overdueCount = calculateOverdueCount(goals);
        response.generatedAt = LocalDate.now();
        
        // Set default filter values (no filtering applied)
        response.filterStatus = null;
        response.filterType = null;
        response.dateRangeStart = null;
        response.dateRangeEnd = null;
        
        return response;
    }

    // Static factory method with filtering
    public static GoalListResponse from(List<Goal> goals, List<GoalProgressResponse> progressResponses,
                                      GoalStatus filterStatus, GoalType filterType, 
                                      LocalDate dateRangeStart, LocalDate dateRangeEnd) {
        GoalListResponse response = from(goals, progressResponses);
        response.filterStatus = filterStatus;
        response.filterType = filterType;
        response.dateRangeStart = dateRangeStart;
        response.dateRangeEnd = dateRangeEnd;
        return response;
    }

    // Helper method to calculate overdue goals
    private static int calculateOverdueCount(List<Goal> goals) {
        LocalDate today = LocalDate.now();
        return (int) goals.stream()
            .filter(g -> g.getEndDate() != null && g.getEndDate().isBefore(today))
            .filter(g -> !g.isAchieved() && g.getStatus() == GoalStatus.active)
            .count();
    }

    // Getters and setters
    public List<GoalProgressResponse> getGoals() { return goals; }
    public void setGoals(List<GoalProgressResponse> goals) { this.goals = goals; }

    public Integer getTotalCount() { return totalCount; }
    public void setTotalCount(Integer totalCount) { this.totalCount = totalCount; }

    public Integer getActiveCount() { return activeCount; }
    public void setActiveCount(Integer activeCount) { this.activeCount = activeCount; }

    public Integer getCompletedCount() { return completedCount; }
    public void setCompletedCount(Integer completedCount) { this.completedCount = completedCount; }

    public Integer getOverdueCount() { return overdueCount; }
    public void setOverdueCount(Integer overdueCount) { this.overdueCount = overdueCount; }

    public LocalDate getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDate generatedAt) { this.generatedAt = generatedAt; }

    public GoalStatus getFilterStatus() { return filterStatus; }
    public void setFilterStatus(GoalStatus filterStatus) { this.filterStatus = filterStatus; }

    public GoalType getFilterType() { return filterType; }
    public void setFilterType(GoalType filterType) { this.filterType = filterType; }

    public LocalDate getDateRangeStart() { return dateRangeStart; }
    public void setDateRangeStart(LocalDate dateRangeStart) { this.dateRangeStart = dateRangeStart; }

    public LocalDate getDateRangeEnd() { return dateRangeEnd; }
    public void setDateRangeEnd(LocalDate dateRangeEnd) { this.dateRangeEnd = dateRangeEnd; }
}
