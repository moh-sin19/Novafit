package com.example.demo.repository;

import com.example.demo.model.SessionExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SessionExerciseRepository extends JpaRepository<SessionExercise, Integer> {
    List<SessionExercise> findBySessionSessionIdOrderBySortOrder(Integer sessionId);
    List<SessionExercise> findBySessionSessionIdAndExerciseExerciseId(Integer sessionId, Integer exerciseId);
    long countBySessionSessionId(Integer sessionId);
}