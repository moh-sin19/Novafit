package com.example.demo.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.Convert;
import com.example.demo.util.InstantUtcStringConverter;

@Entity
@Table(name = "recipe",
  uniqueConstraints = @UniqueConstraint(columnNames = {"user_id","name"})
)
public class Recipe {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer recipeId;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(nullable = false) private String name;
  private String notes;

  @Convert(converter = InstantUtcStringConverter.class)
  @Column(nullable = false, columnDefinition = "TEXT")
  private Instant lastUpdated = Instant.now();

  @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<RecipeItem> items = new ArrayList<>();

  public Recipe() {}

  public Integer getRecipeId() { return recipeId; }
  public void setRecipeId(Integer recipeId) { this.recipeId = recipeId; }
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getNotes() { return notes; }
  public void setNotes(String notes) { this.notes = notes; }
  public Instant getLastUpdated() { return lastUpdated; }
  public void setLastUpdated(Instant lastUpdated) { this.lastUpdated = lastUpdated; }
  public List<RecipeItem> getItems() { return items; }
  public void setItems(List<RecipeItem> items) { this.items = items; }
}
