package com.example.demo.repository;

import com.example.demo.model.WorkoutSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Integer> {
    List<WorkoutSession> findByUserUserIdOrderByDateDesc(Integer userId);
    List<WorkoutSession> findByUserUserIdAndDateBetweenOrderByDateDesc(Integer userId, LocalDate from, LocalDate to);
//    List<WorkoutSession> findByUserUserIdAndDateBetweenOrderByDateDesc(Integer userId, String from, String to);
}
