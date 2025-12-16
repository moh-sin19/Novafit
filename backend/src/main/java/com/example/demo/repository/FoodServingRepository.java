package com.example.demo.repository;

import com.example.demo.model.FoodServing;
import com.example.demo.model.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FoodServingRepository extends JpaRepository<FoodServing, Integer> {
    List<FoodServing> findByFood(FoodItem food);
    Optional<FoodServing> findByFoodAndExternalServingId(FoodItem food, String externalServingId);
    Optional<FoodServing> findByFoodAndLabel(FoodItem food, String label);
}
