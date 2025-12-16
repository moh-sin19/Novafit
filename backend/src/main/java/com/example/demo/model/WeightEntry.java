//Part of the code in this file was written with AI. Model used: Claude Sonnet 4.5
package com.example.demo.model;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.example.demo.util.LocalDateAttributeConverter;
import com.example.demo.util.LocalDateTimeAttributeConverter;

@Entity
@Table(name = "weight_entry",
  indexes = @Index(name = "idx_weight_user_datetime", columnList = "user_id, date_recorded, recorded_at DESC")
)
public class WeightEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;
    
    @Column(nullable = false)
    private Double weight;
    
    @Convert(converter = LocalDateAttributeConverter.class)
    @Column(name = "date_recorded", nullable = false, columnDefinition = "TEXT")
    private LocalDate dateRecorded;

    @Convert(converter = LocalDateTimeAttributeConverter.class)
    @Column(name = "recorded_at", columnDefinition = "TEXT")
    private LocalDateTime recordedAt;

    public WeightEntry() {}
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    public LocalDate getDateRecorded() { return dateRecorded; }
    public void setDateRecorded(LocalDate dateRecorded) { this.dateRecorded = dateRecorded; }
    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
