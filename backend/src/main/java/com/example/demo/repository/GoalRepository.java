package com.example.demo.repository;

import com.example.demo.model.Goal;
import com.example.demo.model.GoalStatus;
import com.example.demo.model.GoalType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface GoalRepository extends JpaRepository<Goal, Integer> {
    List<Goal> findByUserUserIdAndStatus(Integer userId, GoalStatus status);
    List<Goal> findByUserUserIdAndType(Integer userId, GoalType type);
    List<Goal> findByUserUserId(Integer userId);
    List<Goal> findByUserUserIdAndStartDateBetween(Integer userId, LocalDate startDate, LocalDate endDate);
    
    // Find an active goal of a specific type for a user
    Optional<Goal> findByUserUserIdAndTypeAndStatus(Integer userId, GoalType type, GoalStatus status);
}
