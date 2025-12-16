//Part of the code in this file was written with AI. Model used: Claude Sonnet 4.5
package com.example.demo.repository;

import com.example.demo.model.WeightEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface WeightEntryRepository extends JpaRepository<WeightEntry, Long> {
    List<WeightEntry> findByUserIdOrderByRecordedAtDesc(Integer userId);
    List<WeightEntry> findByUserIdAndDateRecordedBetweenOrderByRecordedAtAsc(Integer userId, LocalDate startDate, LocalDate endDate);
}

