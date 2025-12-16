package com.example.demo.web.dto;

import com.example.demo.model.RoutineSet;
import java.util.stream.Collectors;

public class RoutineSetResponse {
    private Integer routineSetId;
    private Integer setOrder;
    private Integer targetReps;        
    private Double targetWeight;       
    private Double targetDurationMin;  
    private Double targetDistanceM;   

    public static RoutineSetResponse from(RoutineSet routineSet) {
        RoutineSetResponse response = new RoutineSetResponse();
    response.setRoutineSetId(routineSet.getRoutineSetId());
    response.setSetOrder(routineSet.getSetOrder());
    response.setTargetReps(routineSet.getTargetReps());
    response.setTargetWeight(routineSet.getTargetWeight());
    response.setTargetDurationMin(routineSet.getTargetDurationMin());
    response.setTargetDistanceM(routineSet.getTargetDistanceM());
    return response;
    }
    
    // Getters and setters...
    public Integer getRoutineSetId() { return routineSetId; }
    public void setRoutineSetId(Integer routineSetId) { this.routineSetId = routineSetId; }
    public Integer getSetOrder() { return setOrder; }
    public void setSetOrder(Integer setOrder) { this.setOrder = setOrder; }
    public Integer getTargetReps() { return targetReps; }
    public void setTargetReps(Integer targetReps) { this.targetReps = targetReps; }
    public Double getTargetWeight() { return targetWeight; }
    public void setTargetWeight(Double targetWeight) { this.targetWeight = targetWeight; }
    public Double getTargetDurationMin() { return targetDurationMin; }
    public void setTargetDurationMin(Double targetDurationMin) { this.targetDurationMin = targetDurationMin; }
    public Double getTargetDistanceM() { return targetDistanceM; }
    public void setTargetDistanceM(Double targetDistanceM) { this.targetDistanceM = targetDistanceM; }
}
