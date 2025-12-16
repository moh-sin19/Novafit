package com.example.demo.web.dto;

public class FoodSearchRequest {
    public String  query;
    public Integer page;      // 0-based
    public Integer pageSize;  // default 20
}
