package com.example.demo.repository;

import com.example.demo.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Integer> {
    List<Recipe> findByUserUserIdOrderByNameAsc(Integer userId);
    boolean existsByUserUserIdAndName(Integer userId, String name);
}
