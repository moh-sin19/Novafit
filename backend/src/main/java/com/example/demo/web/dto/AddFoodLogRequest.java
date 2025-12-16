package com.example.demo.web.dto;

import com.example.demo.model.MealType;

/**
 * Create a food log.
 * Path options:
 *  - API item: provide externalId + servingId (or servingType) + servingQty
 *  - Existing DB item: provide foodId + servingId (or servingType) + servingQty
 *  - Custom item: provide name, brand, servingType, per-serving macros, servingQty
 *
 * All dates are ISO (YYYY-MM-DD).
 */
public class AddFoodLogRequest {
    // Identify the food
    public Integer foodId;        // existing local/custom item
    public String  externalId;    // FatSecret food_id (API)

    // Serving selection
    public Integer servingId;     // preferred
    public String  servingType;   // fallback label match if servingId not sent
    public Double  servingQty;    // multiplier of the selected serving (e.g., 2 x "1 cup")

    // Log info
    public String   logDate;      // ISO date
    public MealType mealType;
    public String   note;

    // For CUSTOM creation (ignored otherwise) — per *serving* values
    public String name;
    public String brand;
    public Double kcalPerServing;
    public Double proteinPerServing;
    public Double carbsPerServing;
    public Double fatPerServing;
}
