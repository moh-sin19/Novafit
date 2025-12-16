package com.example.demo.web.dto;

import jakarta.validation.constraints.Min;

public class CreateRoutineSetRequest {
    @Min(1) private Integer setOrder = 1;
    private Integer targetReps;
    private Double targetWeight;
    private Double targetDurationMin;
    private Double targetDistanceM;

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