package com.example.demo.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;
import jakarta.persistence.Convert;
import com.example.demo.util.LocalDateAttributeConverter;

@Entity
@Table(name = "daily_totals")
@IdClass(DailyTotals.Key.class)
public class DailyTotals {

    @Id
    @Column(nullable = false) private Integer userId;

    @Id
    @Convert(converter = LocalDateAttributeConverter.class)
    @Column(nullable = false, columnDefinition = "TEXT")
    private LocalDate date;

    @Column()
    private Double kcalTotal;

    @Column(name = "protein_g_total")
    private Double proteinGTotal;

    @Column(name = "carbs_g_total")
    private Double carbsGTotal;

    @Column(name = "fat_g_total")
    private Double fatGTotal;

    @Column()
    private Double workoutMinutes;

    @Column()
    private Double workoutVolume;

    // ----- composite key type for @IdClass -----
    public static class Key implements Serializable {
        private Integer userId;
        private LocalDate date;

        public Key() {}
        public Key(Integer userId, LocalDate date) {
            this.userId = userId;
            this.date = date;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Key k)) return false;
            return Objects.equals(userId, k.userId) &&
                   Objects.equals(date, k.date);
        }

        @Override
        public int hashCode() {
            return Objects.hash(userId, date);
        }
    }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Double getKcalTotal() { return kcalTotal; }
    public void setKcalTotal(Double kcalTotal) { this.kcalTotal = kcalTotal; }

    public Double getProteinGTotal() { return proteinGTotal; }
    public void setProteinGTotal(Double proteinGTotal) { this.proteinGTotal = proteinGTotal; }

    public Double getCarbsGTotal() { return carbsGTotal; }
    public void setCarbsGTotal(Double carbsGTotal) { this.carbsGTotal = carbsGTotal; }

    public Double getFatGTotal() { return fatGTotal; }
    public void setFatGTotal(Double fatGTotal) { this.fatGTotal = fatGTotal; }

    public Double getWorkoutMinutes() { return workoutMinutes; }
    public void setWorkoutMinutes(Double workoutMinutes) { this.workoutMinutes = workoutMinutes; }

    public Double getWorkoutVolume() { return workoutVolume; }
    public void setWorkoutVolume(Double workoutVolume) { this.workoutVolume = workoutVolume; }
}
