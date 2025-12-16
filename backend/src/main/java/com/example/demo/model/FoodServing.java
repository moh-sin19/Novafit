package com.example.demo.model;

import jakarta.persistence.*;
import java.time.Instant;
import com.example.demo.util.InstantUtcStringConverter;

@Entity
@Table(
    name = "food_serving",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"food_id", "label"}),
        @UniqueConstraint(columnNames = {"food_id", "external_serving_id"})
    },
    indexes = {
        @Index(name = "idx_serving_food", columnList = "food_id")
    }
)
public class FoodServing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "serving_id")
    private Integer servingId;

    // Reference to food_item
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_id", nullable = false)
    private FoodItem food;

    // For API-backed items
    @Column(name = "external_serving_id")
    private String externalServingId;

    // e.g. "1 medium (2-3/4\" dia) (approx 3 per lb)"
    @Column(nullable = false)
    private String label;

    // e.g. 1.0 for "1 medium", 100.0 for "100 g"
    private Double units;

    // e.g. 138.0
    @Column(name = "metric_qty")
    private Double metricQty;

    // e.g. "g" or "ml"
    @Column(name = "metric_unit")
    private String metricUnit;

    // Macros for this exact serving
    @Column(name = "kcal")
    private Double kcal;

    @Column(name = "protein_g")
    private Double proteinG;

    @Column(name = "carbs_g")
    private Double carbsG;

    @Column(name = "fat_g")
    private Double fatG;

    @Convert(converter = InstantUtcStringConverter.class)
    @Column(nullable = false, columnDefinition = "TEXT")
    private Instant createdAt = Instant.now();

    public FoodServing() {}

    // Getters / Setters
    public Integer getServingId() { return servingId; }
    public void setServingId(Integer servingId) { this.servingId = servingId; }

    public FoodItem getFood() { return food; }
    public void setFood(FoodItem food) { this.food = food; }

    public String getExternalServingId() { return externalServingId; }
    public void setExternalServingId(String externalServingId) { this.externalServingId = externalServingId; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public Double getUnits() { return units; }
    public void setUnits(Double units) { this.units = units; }

    public Double getMetricQty() { return metricQty; }
    public void setMetricQty(Double metricQty) { this.metricQty = metricQty; }

    public String getMetricUnit() { return metricUnit; }
    public void setMetricUnit(String metricUnit) { this.metricUnit = metricUnit; }

    public Double getKcal() { return kcal; }
    public void setKcal(Double kcal) { this.kcal = kcal; }

    public Double getProteinG() { return proteinG; }
    public void setProteinG(Double proteinG) { this.proteinG = proteinG; }

    public Double getCarbsG() { return carbsG; }
    public void setCarbsG(Double carbsG) { this.carbsG = carbsG; }

    public Double getFatG() { return fatG; }
    public void setFatG(Double fatG) { this.fatG = fatG; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
