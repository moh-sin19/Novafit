package com.example.demo.web.dto;

public class ServingDTO {
    public Integer servingId;
    public String  label;       // serving_description
    public Double  units;       // often 1.0
    public Double  metricQty;   // e.g., 138.0
    public String  metricUnit;  // "g", "ml"
    public Double  kcal;        // per serving
    public Double  proteinG;    // per serving
    public Double  carbsG;      // per serving
    public Double  fatG;        // per serving
}
