package com.example.demo.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "routine_exercise",
  indexes = @Index(name = "idx_rx_routine_order", columnList = "routine_id, sort_order")
)
public class RoutineExercise {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer routineExerciseId;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "routine_id", nullable = false)
  private Routine routine;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "exercise_id", nullable = false)
  private Exercise exercise;

  @Enumerated(EnumType.STRING) @Column(nullable = false)
  private ExerciseType type;

  @Column(nullable = false) private Integer sortOrder = 1;
  private String notes;

  @OneToMany(mappedBy = "routineExercise", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<RoutineSet> sets = new ArrayList<>();

  public RoutineExercise() {}

  public Integer getRoutineExerciseId() { return routineExerciseId; }
  public void setRoutineExerciseId(Integer routineExerciseId) { this.routineExerciseId = routineExerciseId; }
  public Routine getRoutine() { return routine; }
  public void setRoutine(Routine routine) { this.routine = routine; }
  public Exercise getExercise() { return exercise; }
  public void setExercise(Exercise exercise) { this.exercise = exercise; }
  public ExerciseType getType() { return type; }
  public void setType(ExerciseType type) { this.type = type; }
  public Integer getSortOrder() { return sortOrder; }
  public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
  public String getNotes() { return notes; }
  public void setNotes(String notes) { this.notes = notes; }
  public List<RoutineSet> getSets() { return sets; }
  public void setSets(List<RoutineSet> sets) { this.sets = sets; }
}
