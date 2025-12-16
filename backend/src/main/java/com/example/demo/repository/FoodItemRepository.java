package com.example.demo.repository;

import com.example.demo.model.FoodItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FoodItemRepository extends JpaRepository<FoodItem, Integer> {
    List<FoodItem> findByNameContainingIgnoreCase(String name);
    Optional<FoodItem> findBySourceAndExternalRef(String source, String externalRef);
    
    boolean existsBySourceAndExternalRef(String source, String externalRef);

    // Pageable version (choose page size & page at call site)
    Page<FoodItem> findByNameContainingIgnoreCaseOrderByNameAsc(String name, Pageable pageable);

    // Simple “top N” shortcut (no Pageable needed)
    List<FoodItem> findTop20ByNameContainingIgnoreCaseOrderByNameAsc(String name);
}
