package com.example.demo.web.dto;

import java.util.List;

/**
 * Unified detail view for frontend (for DB items).
 * For API items you also have a "raw" endpoint that returns the FatSecret payload.
 */
public class FoodDetailResponse {
    public Integer foodId;
    public String  source;       // "API" | "CUSTOM"
    public String  externalRef;  // FatSecret id if API
    public String  name;
    public String  brand;        // "Generic" or brand name
    public String  detailsUrl;   // FatSecret page (if API)
    public List<ServingDTO> servings;
}
