package com.example.demo.web.dto;

import java.util.List;

public class CaloriesVsTargetDTO {
    private List<DataPoint> data;
    private Double targetCalories; // daily target from user profile/goals
    
    public static class DataPoint {
        private String period; // "Week 1" or "Jan"
        private Double actualCalories;
        private Double targetCalories;
        
        public DataPoint() {}
        
        public DataPoint(String period, Double actualCalories, Double targetCalories) {
            this.period = period;
            this.actualCalories = actualCalories;
            this.targetCalories = targetCalories;
        }
        
        // Getters and setters
        public String getPeriod() { return period; }
        public void setPeriod(String period) { this.period = period; }
        public Double getActualCalories() { return actualCalories; }
        public void setActualCalories(Double actualCalories) { this.actualCalories = actualCalories; }
        public Double getTargetCalories() { return targetCalories; }
        public void setTargetCalories(Double targetCalories) { this.targetCalories = targetCalories; }
    }
    
    public CaloriesVsTargetDTO() {}
    
    public CaloriesVsTargetDTO(List<DataPoint> data, Double targetCalories) {
        this.data = data;
        this.targetCalories = targetCalories;
    }
    
    public List<DataPoint> getData() { return data; }
    public void setData(List<DataPoint> data) { this.data = data; }
    public Double getTargetCalories() { return targetCalories; }
    public void setTargetCalories(Double targetCalories) { this.targetCalories = targetCalories; }
}
