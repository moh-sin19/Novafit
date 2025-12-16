package com.example.demo.web.dto;

/**
 * Edit an existing food log.
 * You may change servingId or servingType and/or servingQty.
 * Snapshots will be recomputed from the serving * qty.
 */
public class UpdateFoodLogRequest {
    public Integer servingId;     // preferred
    public String  servingType;   // fallback label
    public Double  servingQty;    // new qty

    public String  mealType;      // enum name ("BREAKFAST", etc.)
    public String  note;
}
