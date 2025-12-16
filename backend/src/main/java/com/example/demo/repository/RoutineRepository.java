package com.example.demo.repository;

import com.example.demo.model.Routine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoutineRepository extends JpaRepository<Routine, Integer> {
    List<Routine> findByCreatedByUserIdOrderByNameAsc(Integer userId);
    boolean existsByCreatedByUserIdAndName(Integer userId, String name);
    List<Routine> findByCreatedByUserIdOrderByRoutineIdDesc(Integer userId);
    Routine findByCreatedByUserIdAndRoutineId(Integer userId, Integer routineId);
    boolean existsByCreatedByUserIdAndRoutineId(Integer userId, Integer routineId); 
}
