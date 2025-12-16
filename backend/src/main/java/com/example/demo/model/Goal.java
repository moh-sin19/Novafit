//Part of the code in this file was written with AI. Model used: Claude Sonnet 4.5
package com.example.demo.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import jakarta.persistence.Convert;
import com.example.demo.util.LocalDateAttributeConverter;
import com.example.demo.util.InstantUtcStringConverter;

@Entity
@Table(name = "goal",
  indexes = @Index(name = "idx_goal_user", columnList = "user_id, status")
)
public class Goal {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer goalId;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Enumerated(EnumType.STRING) @Column(nullable = false)
  private GoalType type;

  @Enumerated(EnumType.STRING) @Column(nullable = false)
  private GoalFrequency frequency;

  @Column(nullable = false) private Double targetValue;

  @Column private Double startValue;

  @Convert(converter = LocalDateAttributeConverter.class)
  @Column(nullable = false, columnDefinition = "TEXT")
  private LocalDate startDate;

  @Convert(converter = LocalDateAttributeConverter.class)
  @Column(columnDefinition = "TEXT")
  private LocalDate endDate;

  @Enumerated(EnumType.STRING) @Column(nullable = false)
  private GoalStatus status = GoalStatus.active;

  @Column(nullable = false) private boolean achieved = false;
  
  @Convert(converter = InstantUtcStringConverter.class)
  @Column(nullable = false, columnDefinition = "TEXT")
  private Instant lastUpdated = Instant.now();

  public Goal() {}

  public Integer getGoalId() { return goalId; }
  public void setGoalId(Integer goalId) { this.goalId = goalId; }
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
  public GoalType getType() { return type; }
  public void setType(GoalType type) { this.type = type; }
  public GoalFrequency getFrequency() { return frequency; }
  public void setFrequency(GoalFrequency frequency) { this.frequency = frequency; }
  public Double getTargetValue() { return targetValue; }
  public void setTargetValue(Double targetValue) { this.targetValue = targetValue; }
  public Double getStartValue() { return startValue; }
  public void setStartValue(Double startValue) { this.startValue = startValue; }
  public LocalDate getStartDate() { return startDate; }
  public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
  public LocalDate getEndDate() { return endDate; }
  public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
  public GoalStatus getStatus() { return status; }
  public void setStatus(GoalStatus status) { this.status = status; }
  public boolean isAchieved() { return achieved; }
  public void setAchieved(boolean achieved) { this.achieved = achieved; }
  public Instant getLastUpdated() { return lastUpdated; }
  public void setLastUpdated(Instant lastUpdated) { this.lastUpdated = lastUpdated; }
}
