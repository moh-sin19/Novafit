package com.example.demo.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;
import com.example.demo.util.InstantUtcStringConverter;

@Entity
@Table(name = "food_item",
  uniqueConstraints = @UniqueConstraint(columnNames = {"source","external_ref"}),
  indexes = @Index(name = "idx_food_name", columnList = "name")
)
public class FoodItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "food_id")
    private Integer foodId;

    @Column(nullable = false)
    private String source; // 'API' | 'CUSTOM'

    @Column(name = "external_ref")
    private String externalRef; // FatSecret food_id for API items

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(nullable = false)
    private String name;

    // If food_type=="Brand" -> brand_name; else "Generic"
    private String brand;

    // New: link to FatSecret details page
    @Column(name = "details_url")
    private String detailsUrl;

    // One food -> many servings
    @OneToMany(mappedBy = "food", cascade = CascadeType.ALL)
    private List<FoodServing> servings;

    @Convert(converter = InstantUtcStringConverter.class)
    @Column(columnDefinition = "TEXT")
    private Instant createdAt = Instant.now();

    public FoodItem() {}

    // Getters / setters
    public Integer getFoodId() { return foodId; }
    public void setFoodId(Integer foodId) { this.foodId = foodId; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getExternalRef() { return externalRef; }
    public void setExternalRef(String externalRef) { this.externalRef = externalRef; }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getDetailsUrl() { return detailsUrl; }
    public void setDetailsUrl(String detailsUrl) { this.detailsUrl = detailsUrl; }

    public List<FoodServing> getServings() { return servings; }
    public void setServings(List<FoodServing> servings) { this.servings = servings; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
