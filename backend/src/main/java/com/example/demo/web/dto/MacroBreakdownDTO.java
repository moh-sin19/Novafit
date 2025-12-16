package com.example.demo.web.dto;

public class MacroBreakdownDTO {
    private Double carbsPercentage;
    private Double proteinPercentage;
    private Double fatPercentage;
    private Double totalCarbs;
    private Double totalProtein;
    private Double totalFat;
    
    public MacroBreakdownDTO() {}
    
    public MacroBreakdownDTO(Double carbsPercentage, Double proteinPercentage, Double fatPercentage,
                             Double totalCarbs, Double totalProtein, Double totalFat) {
        this.carbsPercentage = carbsPercentage;
        this.proteinPercentage = proteinPercentage;
        this.fatPercentage = fatPercentage;
        this.totalCarbs = totalCarbs;
        this.totalProtein = totalProtein;
        this.totalFat = totalFat;
    }
    
    // Getters and setters
    public Double getCarbsPercentage() { return carbsPercentage; }
    public void setCarbsPercentage(Double carbsPercentage) { this.carbsPercentage = carbsPercentage; }
    public Double getProteinPercentage() { return proteinPercentage; }
    public void setProteinPercentage(Double proteinPercentage) { this.proteinPercentage = proteinPercentage; }
    public Double getFatPercentage() { return fatPercentage; }
    public void setFatPercentage(Double fatPercentage) { this.fatPercentage = fatPercentage; }
    public Double getTotalCarbs() { return totalCarbs; }
    public void setTotalCarbs(Double totalCarbs) { this.totalCarbs = totalCarbs; }
    public Double getTotalProtein() { return totalProtein; }
    public void setTotalProtein(Double totalProtein) { this.totalProtein = totalProtein; }
    public Double getTotalFat() { return totalFat; }
    public void setTotalFat(Double totalFat) { this.totalFat = totalFat; }
}
