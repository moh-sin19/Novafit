package com.example.demo.web.dto;

public class AddFoodLogResponse {
    public Integer logId;
    public Integer foodId;

    public AddFoodLogResponse() {}
    public AddFoodLogResponse(Integer logId, Integer foodId) {
        this.logId = logId;
        this.foodId = foodId;
    }
}
