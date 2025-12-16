package com.example.demo.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import jakarta.persistence.Convert;
import com.example.demo.util.InstantUtcStringConverter;


@Entity
@Table(name = "user_favourite_food")
@IdClass(UserFavouriteFood.Key.class)
public class UserFavouriteFood {

  @Id @Column(name="user_id")  private Integer userId;
  @Id @Column(name="food_id")  private Integer foodId;
  
  @Convert(converter = InstantUtcStringConverter.class)
  @Column(name = "created_at", nullable = false, columnDefinition = "TEXT")
  private Instant createdAt = Instant.now();

  public static class Key implements Serializable {
    public Integer userId; public Integer foodId;
    public Key() {}
    public Key(Integer u, Integer f){ this.userId=u; this.foodId=f; }
    @Override public boolean equals(Object o){ if(this==o) return true; if(!(o instanceof Key k)) return false; return Objects.equals(userId,k.userId)&&Objects.equals(foodId,k.foodId);}
    @Override public int hashCode(){ return Objects.hash(userId,foodId); }
  }

  public UserFavouriteFood() {}
  public UserFavouriteFood(Integer u, Integer f){ this.userId=u; this.foodId=f; }

  public Integer getUserId(){ return userId; }
  public Integer getFoodId(){ return foodId; }
  public Instant getCreatedAt(){ return createdAt; }
}