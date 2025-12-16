package com.example.demo.web.dto;

import com.example.demo.model.SessionSet;

public class SessionSetResponse {
    private Integer sessionSetId;
    private Integer setOrder;
    private Integer reps;
    private Double weight;
    private Double rpe;
    private Double durationMin;
    private Double distanceM;
    private Double caloriesBurned;

    public static SessionSetResponse from(SessionSet sessionSet){
        SessionSetResponse response = new SessionSetResponse();
        response.setSessionSetId(sessionSet.getSessionSetId());
        response.setSetOrder(sessionSet.getSetOrder());
        response.setReps(sessionSet.getReps());
        response.setWeight(sessionSet.getWeight());
        response.setRpe(sessionSet.getRpe());
        response.setDurationMin(sessionSet.getDurationMin());
        response.setDistanceM(sessionSet.getDistanceM());
        response.setCaloriesBurned(sessionSet.getCaloriesBurned());
        return response;
    }
    
    // Getters and setters
    public Integer getSessionSetId() { return sessionSetId; }
    public void setSessionSetId(Integer sessionSetId) { this.sessionSetId = sessionSetId; }
    
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