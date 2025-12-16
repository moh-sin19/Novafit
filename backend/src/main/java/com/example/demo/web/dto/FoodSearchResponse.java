package com.example.demo.web.dto;

import java.util.List;

public class FoodSearchResponse {
    public int page;
    public int pageSize;
    public int total;
    public List<FoodSearchItem> items;
}
