package com.example.demo.repository;

import com.example.demo.model.FoodLog;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface FoodLogRepository extends JpaRepository<FoodLog, Integer> {

    // Eagerly fetch 'food' and 'serving' in one shot for the day view
    @EntityGraph(attributePaths = {"food", "serving"})
    List<FoodLog> findByUserUserIdAndLogDate(Integer userId, LocalDate date);

    List<FoodLog> findByUserUserIdAndLogDateBetweenOrderByLogDateDesc(Integer userId, LocalDate from, LocalDate to);

    void deleteByUserUserIdAndLogDate(Integer userId, LocalDate date);
}