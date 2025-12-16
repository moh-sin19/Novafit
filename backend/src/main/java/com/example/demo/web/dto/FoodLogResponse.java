package com.example.demo.web.dto;

import java.time.LocalDate;

public class FoodLogResponse {
    public int logId;
    public String mealType;
    public double servingQty;
    public String servingType;
    public double kcalSnapshot;
    public double proteinGSnapshot;
    public double carbsGSnapshot;
    public double fatGSnapshot;

    public int foodId;
    public String name;
    public String brand;
    public LocalDate logDate;
}
