package com.example.demo.repository;

import com.example.demo.model.Exercise;
import com.example.demo.model.ExerciseType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExerciseRepository extends JpaRepository<Exercise, Integer> {
    List<Exercise> findByNameContainingIgnoreCase(String name);
    List<Exercise> findByCreatedByUserIdOrCreatedByIsNullOrderByNameAsc(Integer userId);
    List<Exercise> findAll();
}
