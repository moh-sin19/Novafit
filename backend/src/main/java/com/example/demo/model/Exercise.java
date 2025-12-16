package com.example.demo.model;

import jakarta.persistence.*;
import java.time.Instant;
import jakarta.persistence.Convert;
import com.example.demo.util.InstantUtcStringConverter;

@Entity
@Table(name = "exercise",
  uniqueConstraints = @UniqueConstraint(columnNames = {"created_by","name"}),
  indexes = @Index(name = "idx_exercise_name", columnList = "name")
)
public class Exercise {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer exerciseId;

  @Column(nullable = false) private String name;
  private String description;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "created_by")
  private User createdBy;              // null = global/shared

  @Convert(converter = InstantUtcStringConverter.class)
  @Column(nullable = false, columnDefinition = "TEXT")
  private Instant lastUpdated = Instant.now();

  public Exercise() {}

  public Integer getExerciseId() { return exerciseId; }
  public void setExerciseId(Integer exerciseId) { this.exerciseId = exerciseId; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
  public User getCreatedBy() { return createdBy; }
  public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
  public Instant getLastUpdated() { return lastUpdated; }
  public void setLastUpdated(Instant lastUpdated) { this.lastUpdated = lastUpdated; }
}
