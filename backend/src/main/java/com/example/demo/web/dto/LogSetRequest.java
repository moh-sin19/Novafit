package com.example.demo.web.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class LogSetRequest {
    @NotNull
    @Min(1)
    private Integer setOrder;

    // weight related fields
    private Integer reps;
    private Double weight;
    private Double rpe;

    // Cardio related fields
    private Double durationMin;
    private Double distanceM;
    private Double caloriesBurned;

    //constructors, setter and getters
    public LogSetRequest(){}

    public Integer getSetOrder() { return setOrder; }
    public void setSetOrder(Integer setOrder) { this.setOrder = setOrder; }
    
    public Integer getReps() { return reps; }
    public void setReps(Integer reps) { this.reps = reps; }
    
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    
    public Double getRpe() { return rpe; }
    public void setRpe(Double rpe) { this.rpe = rpe; }
    
    public Double getDurationMin() { return durationMin; }
    public void setDurationMin(Double durationMin) { this.durationMin = durationMin; }
    
    public Double getDistanceM() { return distanceM; }
    public void setDistanceM(Double distanceM) { this.distanceM = distanceM; }
    
    public Double getCaloriesBurned() { return caloriesBurned; }
    public void setCaloriesBurned(Double caloriesBurned) { this.caloriesBurned = caloriesBurned; }
}