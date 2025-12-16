//Part of the code in this file was written with AI. Model used: Claude Sonnet 4.5
package com.example.demo.controller;

import com.example.demo.service.InsightsService;
import com.example.demo.service.UserService;
import com.example.demo.web.dto.*;
import com.example.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/insights")
public class InsightsController {
    
    @Autowired
    private InsightsService insightsService;
    
    @Autowired
    private UserService userService;
    
    public InsightsController(InsightsService insightsService, UserService userService) {
        this.insightsService = insightsService;
        this.userService = userService;
    }
    
    @GetMapping("/calories-burned-vs-food")
    public ResponseEntity<WeeklyMonthlyCaloriesDTO> getCaloriesBurnedVsFood(
            @RequestParam(defaultValue = "weekly") String period) {
        User user = userService.getCurrentUserOrThrow();
        WeeklyMonthlyCaloriesDTO data = insightsService.getCaloriesBurnedVsFood(user.getUserId(), period);
        return ResponseEntity.ok(data);
    }
    
    @GetMapping("/macro-breakdown")
    public ResponseEntity<MacroBreakdownDTO> getMacroBreakdown() {
        User user = userService.getCurrentUserOrThrow();
        MacroBreakdownDTO data = insightsService.getMacroBreakdown(user.getUserId());
        return ResponseEntity.ok(data);
    }
    
    @GetMapping("/calories-vs-target")
    public ResponseEntity<CaloriesVsTargetDTO> getCaloriesVsTarget(
            @RequestParam(defaultValue = "weekly") String period) {
        User user = userService.getCurrentUserOrThrow();
        CaloriesVsTargetDTO data = insightsService.getCaloriesVsTarget(user.getUserId(), period);
        return ResponseEntity.ok(data);
    }
    
    @GetMapping("/weight-progress")
    public ResponseEntity<WeightProgressDTO> getWeightProgress(
            @RequestParam(defaultValue = "weekly") String period) {
        User user = userService.getCurrentUserOrThrow();
        WeightProgressDTO data = insightsService.getWeightProgress(user.getUserId(), period);
        return ResponseEntity.ok(data);
    }
} 
