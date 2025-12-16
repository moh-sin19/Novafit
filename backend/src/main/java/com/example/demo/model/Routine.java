package com.example.demo.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.Convert;
import com.example.demo.util.InstantUtcStringConverter;

@Entity
@Table(name = "routine")
public class Routine {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer routineId;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "created_by", nullable = false)
  private User createdBy;

  @Column(nullable = false) private String name;
  private String notes;
  
  @Convert(converter = InstantUtcStringConverter.class)
  @Column(nullable = false, columnDefinition = "TEXT")
  private Instant lastUpdated = Instant.now();

  @OneToMany(mappedBy = "routine", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<RoutineExercise> exercises = new ArrayList<>();

  public Routine() {}

  public Integer getRoutineId() { return routineId; }
  public void setRoutineId(Integer routineId) { this.routineId = routineId; }
  public User getCreatedBy() { return createdBy; }
  public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getNotes() { return notes; }
  public void setNotes(String notes) { this.notes = notes; }
  public Instant getLastUpdated() { return lastUpdated; }
  public void setLastUpdated(Instant lastUpdated) { this.lastUpdated = lastUpdated; }
  public List<RoutineExercise> getExercises() { return exercises; }
  public void setExercises(List<RoutineExercise> exercises) { this.exercises = exercises; }
}
