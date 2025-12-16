//AI ACKNOWLEDGMENT: AI WAS USED TO HELP DEVELOP AND IMPLEMENT ROUTINE LOGIC

package com.example.demo.controller;

import com.example.demo.service.RoutineService;
import com.example.demo.web.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/routines")
public class RoutineController {
    private final RoutineService routineService;

    public RoutineController(RoutineService routineService) {
        this.routineService = routineService;
    }

    @PostMapping
    public ResponseEntity<RoutineResponse> createRoutine(@Valid @RequestBody CreateRoutineRequest request) {
        RoutineResponse response = routineService.createRoutine(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RoutineResponse>> getUserRoutines(@PathVariable Integer userId) {
        List<RoutineResponse> routines = routineService.getUserRoutines(userId);
        return ResponseEntity.ok(routines);
    }

    @GetMapping("/{routineId}")
    public ResponseEntity<RoutineResponse> getRoutine(@PathVariable Integer routineId) {
        RoutineResponse response = routineService.getRoutine(routineId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{routineId}")
    public ResponseEntity<RoutineResponse> updateRoutine(@PathVariable Integer routineId, @Valid @RequestBody UpdateRoutineRequest request) {
        RoutineResponse response = routineService.updateRoutine(routineId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{routineId}")
    public ResponseEntity<Void> deleteRoutine(@PathVariable Integer routineId) {
        routineService.deleteRoutine(routineId);
        return ResponseEntity.noContent().build();
    }

}