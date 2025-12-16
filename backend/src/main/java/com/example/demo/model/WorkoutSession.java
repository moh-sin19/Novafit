package com.example.demo.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.Convert;
import com.example.demo.util.LocalDateAttributeConverter;
import com.example.demo.util.LocalTimeAttributeConverter;
import com.example.demo.util.InstantUtcStringConverter;

@Entity
@Table(name = "workout_session",
  indexes = @Index(name = "idx_session_user_date", columnList = "user_id, date DESC")
)
public class WorkoutSession {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer sessionId;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Convert(converter = LocalDateAttributeConverter.class)
  @Column(nullable = false, columnDefinition = "TEXT")
  private LocalDate date;

  @Convert(converter = LocalTimeAttributeConverter.class)
  @Column(columnDefinition = "TEXT")
  private LocalTime startTime;

  @Convert(converter = LocalTimeAttributeConverter.class)
  @Column(columnDefinition = "TEXT")
  private LocalTime endTime;

//  @Column(nullable = false) private String date;
//  private String startTime;
//  private String endTime;
//  private LocalDate date; LocalDate not defined in SQLite
//  private LocalTime startTime;
//  private LocalTime endTime;
  private String notes;

  @Column(nullable = false) private Instant lastUpdated = Instant.now();

  @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<SessionExercise> exercises = new ArrayList<>();

  public WorkoutSession() {}

  public Integer getSessionId() { return sessionId; }
  public void setSessionId(Integer sessionId) { this.sessionId = sessionId; }
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
//  public String getDate() { return date; }
//  public void setDate(String date) { this.date = date; }
//  public String getStartTime() { return startTime; }
//  public void setStartTime(String startTime) { this.startTime = startTime; }
//  public String getEndTime() { return endTime; }
//  public void setEndTime(String endTime) { this.endTime = endTime; }
  public LocalDate getDate() { return date; }
  public void setDate(LocalDate date) { this.date = date; }
  public LocalTime getStartTime() { return startTime; }
  public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
  public LocalTime getEndTime() { return endTime; }
  public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
  public String getNotes() { return notes; }
  public void setNotes(String notes) { this.notes = notes; }
  public Instant getLastUpdated() { return lastUpdated; }
  public void setLastUpdated(Instant lastUpdated) { this.lastUpdated = lastUpdated; }
  public List<SessionExercise> getExercises() { return exercises; }
  public void setExercises(List<SessionExercise> exercises) { this.exercises = exercises; }
}
