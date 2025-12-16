package com.example.demo.web.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CreateWorkoutRequest {
    @NotNull
    private Integer userId;
    
    @NotNull
    private LocalDate date;
//    private String date;
    
    private String notes;
    
    
    public CreateWorkoutRequest() {}
    
    public CreateWorkoutRequest(Integer userId, String date, String notes) {
        this.userId = userId;
        this.date = LocalDate.parse(date);
        this.notes = notes;
    }
    
    // Getters and setters
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}