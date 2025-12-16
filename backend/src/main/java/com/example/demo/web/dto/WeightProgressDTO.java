//Part of the code in this file was written with AI. Model used: Claude Sonnet 4.5
package com.example.demo.web.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class WeightProgressDTO {
    private List<DataPoint> data;
    private Double targetWeight;
    private LocalDate goalStartDate;
    
    public static class DataPoint {
        private LocalDate date;
        private LocalDateTime recordedAt;
        private Double actualWeight;
        private Double targetWeight;
        
        public DataPoint() {}
        
        public DataPoint(LocalDate date, LocalDateTime recordedAt, Double actualWeight, Double targetWeight) {
            this.date = date;
            this.recordedAt = recordedAt;
            this.actualWeight = actualWeight;
            this.targetWeight = targetWeight;
        }
        
        // Getters and setters
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        public LocalDateTime getRecordedAt() { return recordedAt; }
        public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
        public Double getActualWeight() { return actualWeight; }
        public void setActualWeight(Double actualWeight) { this.actualWeight = actualWeight; }
        public Double getTargetWeight() { return targetWeight; }
        public void setTargetWeight(Double targetWeight) { this.targetWeight = targetWeight; }
    }
    
    public WeightProgressDTO() {}
    
    public WeightProgressDTO(List<DataPoint> data, Double targetWeight) {
        this.data = data;
        this.targetWeight = targetWeight;
    }
    
    public WeightProgressDTO(List<DataPoint> data, Double targetWeight, LocalDate goalStartDate) {
        this.data = data;
        this.targetWeight = targetWeight;
        this.goalStartDate = goalStartDate;
    }
    
    public List<DataPoint> getData() { return data; }
    public void setData(List<DataPoint> data) { this.data = data; }
    public Double getTargetWeight() { return targetWeight; }
    public void setTargetWeight(Double targetWeight) { this.targetWeight = targetWeight; }
    public LocalDate getGoalStartDate() { return goalStartDate; }
    public void setGoalStartDate(LocalDate goalStartDate) { this.goalStartDate = goalStartDate; }
}
