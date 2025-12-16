package com.example.demo.controller;

import com.example.demo.model.MealType;
import com.example.demo.service.NutritionService;
import com.example.demo.web.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/nutrition")
public class NutritionController {

    private final NutritionService service;

    public NutritionController(NutritionService s){ this.service = s; }

    // ------------------------------
    // Reference data
    // ------------------------------
    @GetMapping("/meal-types")
    public MealType[] mealTypes() {
        return MealType.values();
    }

    // ------------------------------
    // Search (local + API)
    // ------------------------------
    @GetMapping("/search")
    public ResponseEntity<FoodSearchResponse> search(
            @RequestParam String q,
            @RequestParam(required=false) Integer page,
            @RequestParam(required=false, name="page_size") Integer pageSize) {
        FoodSearchRequest req = new FoodSearchRequest();
        req.query = q; req.page = page; req.pageSize = pageSize;
        return ResponseEntity.ok(service.search(req));
    }

    // ------------------------------
    // Food detail (DB item, with servings)
    // ------------------------------
    @GetMapping("/foods/{foodId}")
    public ResponseEntity<FoodDetailResponse> getFoodDetail(@PathVariable int foodId) {
        FoodDetailResponse dto = service.getFoodDetailById(foodId);
        return dto == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(dto);
    }

    // ------------------------------
    // Full, un-mapped FatSecret payload by externalId
    // ------------------------------
    @GetMapping("/foods/external/{externalId}/raw")
    public ResponseEntity<Map<String, Object>> getFatSecretRaw(@PathVariable String externalId) {
        Map<String, Object> raw = service.fatsecretRawByExternalId(externalId);
        if (raw == null || raw.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(raw);
    }

    // ------------------------------
    // Find food if local. Create if external
    // ------------------------------

    @PostMapping("/foods/find-or-create")
    public ResponseEntity<FoodDetailResponse> findOrCreate(@RequestBody FindOrCreateRequest req) {
        try {
            FoodDetailResponse dto = service.findOrCreate(req.id, req.externalId);
            return ResponseEntity.ok(dto); // keep it simple: always 200
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }


    // ------------------------------
    // Create food log (serving-centric)
    // ------------------------------
    @PostMapping("/food-logs")
    public ResponseEntity<Map<String, Object>> addFood(
            @RequestHeader("X-User-Id") long userId, @RequestBody AddFoodLogRequest req) {

        var result = service.addFoodLog(userId, req);
        return ResponseEntity.ok(Map.of(
                "logId", result.logId,
                "foodId", result.foodId,
                "status", "created"
        ));
    }

    // ------------------------------
    // Update food log (change serving or qty -> snapshots recomputed)
    // ------------------------------
    @PatchMapping("/food-logs/{id}")
    public ResponseEntity<Void> updateLog(
            @RequestHeader("X-User-Id") int userId,
            @PathVariable int id,
            @RequestBody UpdateFoodLogRequest req) {
        service.updateFoodLog(userId, id, req);
        return ResponseEntity.noContent().build();
    }

    // ------------------------------
    // List logs for a date (simple, serving-aware payload)
    // NOTE: Kept here to avoid service method churn; feel free to move into service later.
    // ------------------------------
    @GetMapping("/food-logs")
    @Transactional(readOnly = true)
    public List<FoodLogResponse> listLogs(
            @RequestHeader("X-User-Id") int userId,
            @RequestParam String date) {

        var logs = service.getLogRepo().findByUserUserIdAndLogDate(userId, LocalDate.parse(date));

        return logs.stream().map(l -> {
            FoodLogResponse r = new FoodLogResponse();
            r.logId = l.getLogId();
            r.mealType = l.getMealType() != null ? l.getMealType().name() : null;
            r.servingQty = l.getServingQty();
            r.servingType = l.getServingType();
            r.kcalSnapshot = l.getKcalSnapshot();
            r.proteinGSnapshot = l.getProteinGSnapshot();
            r.carbsGSnapshot = l.getCarbsGSnapshot();
            r.fatGSnapshot = l.getFatGSnapshot();
            r.foodId = l.getFood().getFoodId();
            r.name = l.getFood().getName();
            r.brand = l.getFood().getBrand();
            r.logDate = l.getLogDate();
            return r;
        }).toList();
    }

    // ------------------------------
    // Summaries
    // ------------------------------
    @GetMapping("/summary/day")
    public Map<String,Object> day(
            @RequestHeader("X-User-Id") int userId,
            @RequestParam String date) {
        return service.daySummary(userId, date);
    }

    @GetMapping("/summary/range")
    public List<RangeSummaryResponse> range(
            @RequestHeader("X-User-Id") int userId,
            @RequestParam String start,
            @RequestParam String end) {
        return service.rangeSummary(userId, start, end);
    }

    // ------------------------------
    // Favourites
    // ------------------------------
    @PostMapping("/favourites/{foodId}")
    public ResponseEntity<Void> addFavourite(
            @RequestHeader("X-User-Id") int userId, @PathVariable int foodId){
        service.addFavourite(userId, foodId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/favourites/{foodId}")
    public ResponseEntity<Void> removeFavourite(
            @RequestHeader("X-User-Id") int userId, @PathVariable int foodId){
        service.removeFavourite(userId, foodId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/favourites")
    public List<FavouriteFoodResponse> listFavourites(
            @RequestHeader("X-User-Id") int userId){
        return service.listFavourites(userId);
    }
}