package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "routine_set",
  indexes = @Index(name = "idx_rs_exercise_order", columnList = "routine_exercise_id, set_order")
)
public class RoutineSet {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer routineSetId;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "routine_exercise_id", nullable = false)
  private RoutineExercise routineExercise;

  @Column(name = "set_order", nullable = false) private Integer setOrder = 1;

  private Integer targetReps;
  private Double targetWeight;

  @Column(name = "target_duration_min", nullable = false) private Double targetDurationMin;
  @Column(name = "target_distance_m", nullable = false) private Double targetDistanceM;
  

  public RoutineSet() {}

  public Integer getRoutineSetId() { return routineSetId; }
  public void setRoutineSetId(Integer routineSetId) { this.routineSetId = routineSetId; }
  public RoutineExercise getRoutineExercise() { return routineExercise; }
  public void setRoutineExercise(RoutineExercise routineExercise) { this.routineExercise = routineExercise; }
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
