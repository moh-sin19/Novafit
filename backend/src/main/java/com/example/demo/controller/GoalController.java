//AI ACKNOWLEDGMENT: AI WAS USED TO HELP DEVELOP AND IMPLEMENT GOAL LOGIC
//controller for goals
package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.service.GoalService;
import com.example.demo.web.dto.*;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import java.util.List;
import com.example.demo.model.GoalType;

@RestController
@RequestMapping("/api/goals")
public class GoalController {
    @Autowired
    private GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(@Valid @RequestBody CreateGoalRequest request) {
        GoalResponse response = goalService.createGoal(request);
        return ResponseEntity.ok(response);
    }
    @GetMapping
    public ResponseEntity<List<GoalResponse>> getUserGoals(@RequestParam Integer userId) {
        List<GoalResponse> response = goalService.getUserGoals(userId);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/active")
    public ResponseEntity<List<GoalResponse>> getActiveUserGoals(@RequestParam Integer userId) {
        List<GoalResponse> response = goalService.getActiveUserGoals(userId);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/type")
    public ResponseEntity<List<GoalResponse>> getUserGoalsByType(@RequestParam Integer userId, @RequestParam GoalType type) {
        List<GoalResponse> response = goalService.getUserGoalsByType(userId, type);
        return ResponseEntity.ok(response);
    }
    @PutMapping("/{goalId}")
    public ResponseEntity<GoalResponse> updateGoal(@PathVariable Integer goalId, @Valid @RequestBody UpdateGoalRequest request) {
        GoalResponse response = goalService.updateGoal(goalId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{goalId}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Integer goalId) {
        goalService.deleteGoal(goalId);
        return ResponseEntity.noContent().build();
    }

    //get progress for a specific goal
    @GetMapping("/{goalId}/progress")
    public ResponseEntity<GoalProgressResponse> getGoalProgress(@PathVariable Integer goalId) {
        GoalProgressResponse response = goalService.getGoalProgress(goalId);
        return ResponseEntity.ok(response);
    }

    //get progress for all goals for a user
    @GetMapping("/user/{userId}/progress")
    public ResponseEntity<List<GoalProgressResponse>> getUserGoalProgress(@PathVariable Integer userId) {
        List<GoalProgressResponse> response = goalService.getUserGoalProgress(userId);
        return ResponseEntity.ok(response);
    }

    //complete a goal
    @PostMapping("/{goalId}/complete")
    public ResponseEntity<Void> completeGoal(@PathVariable Integer goalId) {
        goalService.completeGoal(goalId);
        return ResponseEntity.noContent().build();
    }

    
}