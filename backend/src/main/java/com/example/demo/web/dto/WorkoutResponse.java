package com.example.demo.web.dto;

import com.example.demo.model.WorkoutSession;
import com.example.demo.web.dto.SessionExerciseResponse;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;


public class WorkoutResponse {
    private Integer workoutId;
    private Integer userId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String notes;
    private List<SessionExerciseResponse> exercises;

    // Static factory method
    public static WorkoutResponse from(WorkoutSession session) {
        WorkoutResponse response = new WorkoutResponse();
        response.setWorkoutId(session.getSessionId());
        response.setUserId(session.getUser().getUserId());
        response.setDate(session.getDate());
        response.setStartTime(session.getStartTime());
        response.setEndTime(session.getEndTime());
        response.setNotes(session.getNotes());
        response.setExercises(session.getExercises().stream()
                .map(SessionExerciseResponse::from)
                .collect(Collectors.toList()));
        return response;
    }

    //Getters and setters
    public Integer getWorkoutId() { return workoutId; }
    public void setWorkoutId(Integer workoutId) { this.workoutId = workoutId; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<SessionExerciseResponse> getExercises() { return exercises; }
    public void setExercises(List<SessionExerciseResponse> exercises) { this.exercises = exercises; }
}