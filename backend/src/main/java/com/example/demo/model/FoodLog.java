package com.example.demo.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import com.example.demo.util.LocalDateAttributeConverter;
import com.example.demo.util.InstantUtcStringConverter;

@Entity
@Table(
    name = "food_log",
    indexes = @Index(name = "idx_foodlog_user_date", columnList = "user_id, log_date")
)
public class FoodLog {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer logId;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "food_id", nullable = false)
  private FoodItem food;

  // Link to specific serving (optional for local/custom foods)
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "serving_id")
  private FoodServing serving;

  // Cached label for serving type
  @Column(name = "serving_type")
  private String servingType;

  @Convert(converter = LocalDateAttributeConverter.class)
  @Column(name = "log_date", columnDefinition = "TEXT", nullable = false)
  private LocalDate logDate;

  @Enumerated(EnumType.STRING) private MealType mealType;

  @Column(nullable = false) private Double servingQty;

  @Column(nullable = false) private Double kcalSnapshot;
  @Column(name = "protein_g_snapshot", nullable = false) private Double proteinGSnapshot;
  @Column(name = "carbs_g_snapshot", nullable = false) private Double carbsGSnapshot;
  @Column(name = "fat_g_snapshot", nullable = false) private Double fatGSnapshot;

  private String note;

  @Convert(converter = InstantUtcStringConverter.class)
  @Column(nullable = false, columnDefinition = "TEXT")
  private Instant createdAt = Instant.now();

  @Convert(converter = InstantUtcStringConverter.class)
  @Column(nullable = false, columnDefinition = "TEXT")
  private Instant updatedAt = Instant.now();

  @PrePersist
  void onCreate() { this.createdAt = Instant.now(); this.updatedAt = this.createdAt; }

  @PreUpdate
  void onUpdate() { this.updatedAt = Instant.now(); }
  
  public FoodLog() {}

  // --- Getters and setters ---
  public Integer getLogId() { return logId; }
  public void setLogId(Integer logId) { this.logId = logId; }

  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }

  public FoodItem getFood() { return food; }
  public void setFood(FoodItem food) { this.food = food; }

  public FoodServing getServing() { return serving; }
  public void setServing(FoodServing serving) { this.serving = serving; }

  public String getServingType() { return servingType; }
  public void setServingType(String servingType) { this.servingType = servingType; }

  public LocalDate getLogDate() { return logDate; }
  public void setLogDate(LocalDate logDate) { this.logDate = logDate; }

  public MealType getMealType() { return mealType; }
  public void setMealType(MealType mealType) { this.mealType = mealType; }

  public Double getServingQty() { return servingQty; }
  public void setServingQty(Double servingQty) { this.servingQty = servingQty; }

  public Double getKcalSnapshot() { return kcalSnapshot; }
  public void setKcalSnapshot(Double kcalSnapshot) { this.kcalSnapshot = kcalSnapshot; }

  public Double getProteinGSnapshot() { return proteinGSnapshot; }
  public void setProteinGSnapshot(Double proteinGSnapshot) { this.proteinGSnapshot = proteinGSnapshot; }

  public Double getCarbsGSnapshot() { return carbsGSnapshot; }
  public void setCarbsGSnapshot(Double carbsGSnapshot) { this.carbsGSnapshot = carbsGSnapshot; }

  public Double getFatGSnapshot() { return fatGSnapshot; }
  public void setFatGSnapshot(Double fatGSnapshot) { this.fatGSnapshot = fatGSnapshot; }

  public String getNote() { return note; }
  public void setNote(String note) { this.note = note; }

  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

  public Instant getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
