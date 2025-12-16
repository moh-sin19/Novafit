package com.example.demo.repository;

import com.example.demo.model.DailyTotals;
import com.example.demo.model.DailyTotals.Key;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DailyTotalsRepository extends JpaRepository<DailyTotals, Key> {
    List<DailyTotals> findByUserIdAndDateBetweenOrderByDateAsc(Integer userId, LocalDate from, LocalDate to);
}
