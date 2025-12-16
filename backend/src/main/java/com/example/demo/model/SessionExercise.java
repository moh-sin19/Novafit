package com.example.demo.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "session_exercise",
  indexes = @Index(name = "idx_sx_session_order", columnList = "session_id, sort_order")
)
public class SessionExercise {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer sessionExerciseId;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "session_id", nullable = false)
  private WorkoutSession session;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "exercise_id", nullable = false)
  private Exercise exercise;

  @Enumerated(EnumType.STRING) @Column(nullable = false)
  private ExerciseType type;

  @Column(nullable = false) private Integer sortOrder = 1;
  private String notes;

  @OneToMany(mappedBy = "sessionExercise", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<SessionSet> sets = new ArrayList<>();

  public SessionExercise() {}

  public Integer getSessionExerciseId() { return sessionExerciseId; }
  public void setSessionExerciseId(Integer sessionExerciseId) { this.sessionExerciseId = sessionExerciseId; }
  public WorkoutSession getSession() { return session; }
  public void setSession(WorkoutSession session) { this.session = session; }
  public Exercise getExercise() { return exercise; }
  public void setExercise(Exercise exercise) { this.exercise = exercise; }
  public ExerciseType getType() { return type; }
  public void setType(ExerciseType type) { this.type = type; }
  public Integer getSortOrder() { return sortOrder; }
  public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
  public String getNotes() { return notes; }
  public void setNotes(String notes) { this.notes = notes; }
  public List<SessionSet> getSets() { return sets; }
  public void setSets(List<SessionSet> sets) { this.sets = sets; }
}
