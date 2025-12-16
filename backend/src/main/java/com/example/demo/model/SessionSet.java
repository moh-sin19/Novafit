package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "session_set",
  indexes = @Index(name = "idx_ss_exercise_order", columnList = "session_exercise_id, set_order")
)
public class SessionSet {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer sessionSetId;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "session_exercise_id", nullable = false)
  private SessionExercise sessionExercise;

  @Column(name = "set_order", nullable = false) private Integer setOrder = 1;

  // Weight training fields
  private Integer reps;
  private Double weight;
  private Double rpe;

  // Cardio fields
  @Column(name = "duration_min") private Double durationMin;
  @Column(name = "distance_m") private Double distanceM;
  @Column(name = "calories_burned") private Double caloriesBurned;

  public SessionSet() {}

  public Integer getSessionSetId() { return sessionSetId; }
  public void setSessionSetId(Integer sessionSetId) { this.sessionSetId = sessionSetId; }
  public SessionExercise getSessionExercise() { return sessionExercise; }
  public void setSessionExercise(SessionExercise sessionExercise) { this.sessionExercise = sessionExercise; }
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
