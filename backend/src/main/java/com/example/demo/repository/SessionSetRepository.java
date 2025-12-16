package com.example.demo.repository;

import com.example.demo.model.SessionSet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SessionSetRepository extends JpaRepository<SessionSet, Integer> {
    List<SessionSet> findBySessionExerciseSessionExerciseIdOrderBySetOrder(Integer sessionExerciseId);
    List<SessionSet> findBySessionExerciseSessionSessionId(Integer sessionId);
    long countBySessionExerciseSessionExerciseId(Integer sessionExerciseId);
}