package com.example.demo.controller;

import com.example.demo.service.WorkoutSummaryService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.web.dto.*;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import java.util.List;

import java.util.List;

@RestController
@RequestMapping("/api/summary")
public class WorkoutSummaryController {
    @Autowired
    private WorkoutSummaryService workoutSummaryService;

    public WorkoutSummaryController(WorkoutSummaryService workoutSummaryService) {
        this.workoutSummaryService = workoutSummaryService;
    }

    @GetMapping("/calories/{date}")
    public ResponseEntity<WorkoutSummaryResponse> getCaloriesDate(@PathVariable String date, @RequestParam Integer userId) {
        WorkoutSummaryResponse response = workoutSummaryService.getCaloriesDate(userId, date);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/duration/{date}")
    public ResponseEntity<WorkoutSummaryResponse> getDurationDate(@PathVariable String date, @RequestParam Integer userId) {
        WorkoutSummaryResponse response = workoutSummaryService.getDurationDate(userId, date);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sets/{date}")
    public ResponseEntity<WorkoutSummaryResponse> getSetsDate(@PathVariable String date, @RequestParam Integer userId) {
        WorkoutSummaryResponse response = workoutSummaryService.getSetsDate(userId, date);
        return ResponseEntity.ok(response);
    }

}
