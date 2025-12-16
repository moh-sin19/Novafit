package com.example.demo.web.dto;

/**
 * One row in search results (local DB items + API items).
 * For local/custom DB items, id is set.
 * For API items, externalId is set.
 */
public class FoodSearchItem {
    public Integer id;          // local DB pk (nullable for API-only results)
    public String  externalId;  // FatSecret food_id (nullable for local/custom)
    public String  name;
    public String  brand;       // "Generic" if food_type == "Generic", else brand_name
    public String  foodType;    // "API" | "CUSTOM" | fatsecret "Brand"/"Generic" for API results
    public String  foodUrl;     // details page (FatSecret)
    public String  description; // short text shown in search rows
}
