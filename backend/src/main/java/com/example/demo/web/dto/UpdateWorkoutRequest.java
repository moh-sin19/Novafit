package com.example.demo.web.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


public class UpdateWorkoutRequest {
//    private LocalDate date;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String notes;
    private List<UpdateSessionExerciseRequest> exercises;

    public UpdateWorkoutRequest() {}

    //getters and setters
//    public LocalDate getDate() { return date; }
    public LocalDate getDate() { return date; }
    public void setDate(String date) { this.date = LocalDate.parse(date); }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = LocalTime.parse(startTime); }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = LocalTime.parse(endTime); }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public List<UpdateSessionExerciseRequest> getExercises() { return exercises; }
    public void setExercises(List<UpdateSessionExerciseRequest> exercises) { this.exercises = exercises; }

}