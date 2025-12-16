package com.example.demo.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import jakarta.persistence.Convert;
import com.example.demo.util.LocalDateAttributeConverter;
import com.example.demo.util.InstantUtcStringConverter;

@Entity
@Table(name = "user_profile")
public class UserProfile {
  @Id
  private Integer userId;                 // shares PK with User

  @MapsId
  @OneToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id")
  private User user;

  private String firstName;
  private String lastName;
  
  @Convert(converter = LocalDateAttributeConverter.class)
  @Column(columnDefinition = "TEXT")
  private LocalDate dateOfBirth;

  private String sex;   //('male','female','other','prefer_not_to_say')
  private Double heightCm;
  private Double weightKg;
  private String activityLevel;        // sedentary/light/moderate/high/athlete
  @Column(name="tz") private String timezone = "UTC";
  private String unitWeight = "kg";
  private String unitEnergy = "kcal";
  private String locale;
  
  @Convert(converter = InstantUtcStringConverter.class)
  @Column(nullable = false, columnDefinition = "TEXT")
  private Instant updatedAt = Instant.now();

  public UserProfile() {}

  public Integer getUserId() { return userId; }
  public void setUserId(Integer userId) { this.userId = userId; }
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
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
  public Instant getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
