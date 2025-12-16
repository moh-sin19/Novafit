package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "recipe_item",
  indexes = @Index(name = "idx_recipeitem_recipe", columnList = "recipe_id, sort_order")
)
public class RecipeItem {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer recipeItemId;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "recipe_id", nullable = false)
  private Recipe recipe;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "food_id", nullable = false)
  private FoodItem food;

  @Column(nullable = false) private Double quantity;     // in food_item.serving_unit
  @Column(nullable = false) private Integer sortOrder = 1;

  public RecipeItem() {}

  public Integer getRecipeItemId() { return recipeItemId; }
  public void setRecipeItemId(Integer recipeItemId) { this.recipeItemId = recipeItemId; }
  public Recipe getRecipe() { return recipe; }
  public void setRecipe(Recipe recipe) { this.recipe = recipe; }
  public FoodItem getFood() { return food; }
  public void setFood(FoodItem food) { this.food = food; }
  public Double getQuantity() { return quantity; }
  public void setQuantity(Double quantity) { this.quantity = quantity; }
  public Integer getSortOrder() { return sortOrder; }
  public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
