package com.example.demo.web.dto;

import java.util.List;

public class WeeklyMonthlyCaloriesDTO {
    private List<DataPoint> data;
    
    public static class DataPoint {
        private String period; // "Week 1", "Week 2" or "Jan", "Feb"
        private Double caloriesBurned;
        private Double caloriesConsumed;
        
        public DataPoint() {}
        
        public DataPoint(String period, Double caloriesBurned, Double caloriesConsumed) {
            this.period = period;
            this.caloriesBurned = caloriesBurned;
            this.caloriesConsumed = caloriesConsumed;
        }
        
        // Getters and setters
        public String getPeriod() { return period; }
        public void setPeriod(String period) { this.period = period; }
        public Double getCaloriesBurned() { return caloriesBurned; }
        public void setCaloriesBurned(Double caloriesBurned) { this.caloriesBurned = caloriesBurned; }
        public Double getCaloriesConsumed() { return caloriesConsumed; }
        public void setCaloriesConsumed(Double caloriesConsumed) { this.caloriesConsumed = caloriesConsumed; }
    }
    
    public WeeklyMonthlyCaloriesDTO() {}
    
    public WeeklyMonthlyCaloriesDTO(List<DataPoint> data) {
        this.data = data;
    }
    
    public List<DataPoint> getData() { return data; }
    public void setData(List<DataPoint> data) { this.data = data; }
}
