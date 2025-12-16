package com.example.demo.web.dto;

import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class UpdateProfileRequest {
    @Size(max = 50) private String firstName;
    @Size(max = 50) private String lastName;
    private LocalDate dateOfBirth;
    private String sex;                // or enum
    private Double heightCm;
    private Double weightKg;
    private String activityLevel;      // 'sedentary','light','moderate','high','athlete'
    private String timezone;           // e.g. "Europe/London"
    private String unitWeight;         // 'kg'|'lb'
    private String unitEnergy;         // 'kcal'|'kJ'
    private String locale;

    // getters/setters
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getSex() { return sex; }
    public void setSex(String sex) { this.sex = sex; }
    public Double getHeightCm() { return heightCm; }
    public void setHeightCm(Double heightCm) { this.heightCm = heightCm; }
    public Double getWeightKg() { return weightKg; }
    public void setWeightKg(Double weightKg) { this.weightKg = weightKg; }
    public String getActivityLevel() { return activityLevel; }
    public void setActivityLevel(String activityLevel) { this.activityLevel = activityLevel; }
    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }
    public String getUnitWeight() { return unitWeight; }
    public void setUnitWeight(String unitWeight) { this.unitWeight = unitWeight; }
    public String getUnitEnergy() { return unitEnergy; }
    public void setUnitEnergy(String unitEnergy) { this.unitEnergy = unitEnergy; }
    public String getLocale() { return locale; }
    public void setLocale(String locale) { this.locale = locale; }
}
