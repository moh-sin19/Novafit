//Part of the code in this file was written with AI. Model used: Claude Sonnet 4.5
package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import com.example.demo.web.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InsightsService {
    
    @Autowired
    private FoodLogRepository foodLogRepository;
    
    @Autowired
    private WorkoutSessionRepository workoutSessionRepository;
    
    @Autowired
    private SessionSetRepository sessionSetRepository;
    
    @Autowired
    private GoalRepository goalRepository;
    
    @Autowired
    private UserProfileRepository userProfileRepository;
    
    @Autowired
    private WeightEntryRepository weightEntryRepository;
    
    public InsightsService(
        FoodLogRepository foodLogRepository,
        WorkoutSessionRepository workoutSessionRepository,
        SessionSetRepository sessionSetRepository,
        GoalRepository goalRepository,
        UserProfileRepository userProfileRepository,
        WeightEntryRepository weightEntryRepository
    ) {
        this.foodLogRepository = foodLogRepository;
        this.workoutSessionRepository = workoutSessionRepository;
        this.sessionSetRepository = sessionSetRepository;
        this.goalRepository = goalRepository;
        this.userProfileRepository = userProfileRepository;
        this.weightEntryRepository = weightEntryRepository;
    }
    
    public WeeklyMonthlyCaloriesDTO getCaloriesBurnedVsFood(Integer userId, String period) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate;
        List<WeeklyMonthlyCaloriesDTO.DataPoint> dataPoints = new ArrayList<>();
        
        if ("weekly".equalsIgnoreCase(period)) {
            startDate = endDate.minusWeeks(4); //show last 4 weeks data if 'weekly' chosen
            dataPoints = getWeeklyCaloriesData(userId, startDate, endDate);
        } else {
            startDate = endDate.minusMonths(6); //show last 6 months data if 'monthly' chosen
            dataPoints = getMonthlyCaloriesData(userId, startDate, endDate);
        }
        
        return new WeeklyMonthlyCaloriesDTO(dataPoints);
    }
    
    private List<WeeklyMonthlyCaloriesDTO.DataPoint> getWeeklyCaloriesData(Integer userId, LocalDate startDate, LocalDate endDate) {
        List<WeeklyMonthlyCaloriesDTO.DataPoint> dataPoints = new ArrayList<>();
        List<FoodLog> foodLogs = foodLogRepository.findByUserUserIdAndLogDateBetweenOrderByLogDateDesc(userId, startDate, endDate);
        List<WorkoutSession> workouts = workoutSessionRepository.findByUserUserIdAndDateBetweenOrderByDateDesc(userId, startDate, endDate);
        
        // Group by week (7-day periods from startDate)
        Map<Integer, Double> weeklyFoodCalories = new HashMap<>();
        Map<Integer, Double> weeklyBurnedCalories = new HashMap<>();
        
        for (FoodLog log : foodLogs) {
            // Calculate which week this log belongs to (0-based)
            long daysSinceStart = ChronoUnit.DAYS.between(startDate, log.getLogDate());
            int weekNumber = (int) (daysSinceStart / 7);
            weeklyFoodCalories.merge(weekNumber, log.getKcalSnapshot(), Double::sum);
        }
        
        for (WorkoutSession workout : workouts) {
            long daysSinceStart = ChronoUnit.DAYS.between(startDate, workout.getDate());
            int weekNumber = (int) (daysSinceStart / 7);
            
            List<SessionSet> sets = sessionSetRepository.findBySessionExerciseSessionSessionId(workout.getSessionId());
            double caloriesBurned = sets.stream()
                .filter(s -> s.getCaloriesBurned() != null)
                .mapToDouble(SessionSet::getCaloriesBurned)
                .sum();
            weeklyBurnedCalories.merge(weekNumber, caloriesBurned, Double::sum);
        }
        
        // Calculate total number of weeks in the range
        long totalDays = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        int totalWeeks = (int) Math.ceil(totalDays / 7.0);
        
        // Create data points for all weeks
        for (int week = 0; week < totalWeeks; week++) {
            // Calculate the actual date range for this week
            LocalDate weekStart = startDate.plusDays(week * 7L);
            LocalDate weekEnd = weekStart.plusDays(6);
            if (weekEnd.isAfter(endDate)) {
                weekEnd = endDate;
            }
            
            // Calculate number of days in this week
            int daysInWeek = (int) ChronoUnit.DAYS.between(weekStart, weekEnd) + 1;
            
            // Get totals for this week
            double totalBurned = weeklyBurnedCalories.getOrDefault(week, 0.0);
            double totalConsumed = weeklyFoodCalories.getOrDefault(week, 0.0);
            
            // Calculate daily average for this week
            double avgBurned = totalBurned / daysInWeek;
            double avgConsumed = totalConsumed / daysInWeek;
            
            // Simple week label: "Week 1", "Week 2", etc.
            String weekLabel = "Week " + (week + 1);
            
            dataPoints.add(new WeeklyMonthlyCaloriesDTO.DataPoint(
                weekLabel,
                avgBurned,
                avgConsumed
            ));
        }
        
        return dataPoints;
    }
    
    private List<WeeklyMonthlyCaloriesDTO.DataPoint> getMonthlyCaloriesData(Integer userId, LocalDate startDate, LocalDate endDate) {
        List<WeeklyMonthlyCaloriesDTO.DataPoint> dataPoints = new ArrayList<>();
        List<FoodLog> foodLogs = foodLogRepository.findByUserUserIdAndLogDateBetweenOrderByLogDateDesc(userId, startDate, endDate);
        List<WorkoutSession> workouts = workoutSessionRepository.findByUserUserIdAndDateBetweenOrderByDateDesc(userId, startDate, endDate);
        
        Map<String, Double> monthlyFoodCalories = new HashMap<>();
        Map<String, Double> monthlyBurnedCalories = new HashMap<>();
        Map<String, Set<LocalDate>> monthlyFoodDays = new HashMap<>();
        Map<String, Set<LocalDate>> monthlyWorkoutDays = new HashMap<>();
        Map<String, Integer> monthDaysCount = new HashMap<>();
        
        for (FoodLog log : foodLogs) {
            String monthKey = log.getLogDate().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            monthlyFoodCalories.merge(monthKey, log.getKcalSnapshot(), Double::sum);
            monthlyFoodDays.computeIfAbsent(monthKey, k -> new HashSet<>()).add(log.getLogDate());
        }
        
        for (WorkoutSession workout : workouts) {
            String monthKey = workout.getDate().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            List<SessionSet> sets = sessionSetRepository.findBySessionExerciseSessionSessionId(workout.getSessionId());
            double caloriesBurned = sets.stream()
                .filter(s -> s.getCaloriesBurned() != null)
                .mapToDouble(SessionSet::getCaloriesBurned)
                .sum();
            monthlyBurnedCalories.merge(monthKey, caloriesBurned, Double::sum);
            monthlyWorkoutDays.computeIfAbsent(monthKey, k -> new HashSet<>()).add(workout.getDate());
        }
        
        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            String monthKey = current.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            
            // Calculate actual number of days in this month within our range
            LocalDate monthStart = current.withDayOfMonth(1);
            LocalDate monthEnd = current.withDayOfMonth(current.lengthOfMonth());
            
            // Clamp to our query range
            if (monthStart.isBefore(startDate)) monthStart = startDate;
            if (monthEnd.isAfter(endDate)) monthEnd = endDate;
            
            int daysInMonth = (int) ChronoUnit.DAYS.between(monthStart, monthEnd) + 1;
            monthDaysCount.put(monthKey, daysInMonth);
            
            current = current.plusMonths(1);
        }
        
        current = startDate;
        while (!current.isAfter(endDate)) {
            String monthKey = current.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            int daysInMonth = monthDaysCount.getOrDefault(monthKey, 30);
            
            // Daily average = total for the month divided by number of days in that month
            double totalBurned = monthlyBurnedCalories.getOrDefault(monthKey, 0.0);
            double totalConsumed = monthlyFoodCalories.getOrDefault(monthKey, 0.0);
            
            double avgBurned = totalBurned / daysInMonth;
            double avgConsumed = totalConsumed / daysInMonth;
            
            dataPoints.add(new WeeklyMonthlyCaloriesDTO.DataPoint(
                monthKey,
                avgBurned,
                avgConsumed
            ));
            current = current.plusMonths(1);
        }
        
        return dataPoints;
    }
    
    public MacroBreakdownDTO getMacroBreakdown(Integer userId) {
        LocalDate startDate = LocalDate.now().withDayOfMonth(1);
        LocalDate endDate = LocalDate.now();
        
        List<FoodLog> foodLogs = foodLogRepository.findByUserUserIdAndLogDateBetweenOrderByLogDateDesc(userId, startDate, endDate);
        
        double totalCarbs = foodLogs.stream().mapToDouble(FoodLog::getCarbsGSnapshot).sum();
        double totalProtein = foodLogs.stream().mapToDouble(FoodLog::getProteinGSnapshot).sum();
        double totalFat = foodLogs.stream().mapToDouble(FoodLog::getFatGSnapshot).sum();
        
        double totalGrams = totalCarbs + totalProtein + totalFat;
        
        if (totalGrams == 0) {
            return new MacroBreakdownDTO(0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
        }
        
        return new MacroBreakdownDTO(
            (totalCarbs / totalGrams) * 100,
            (totalProtein / totalGrams) * 100,
            (totalFat / totalGrams) * 100,
            totalCarbs,
            totalProtein,
            totalFat
        );
    }
    
    public CaloriesVsTargetDTO getCaloriesVsTarget(Integer userId, String period) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate;
        
        // Get target calories from goals
        List<Goal> calorieGoals = goalRepository.findByUserUserIdAndStatus(userId, GoalStatus.active)
            .stream()
            .filter(g -> g.getType() == GoalType.CALORIES_KCAL)
            .collect(Collectors.toList());
        
        Double targetCalories = calorieGoals.isEmpty() ? 2000.0 : calorieGoals.get(0).getTargetValue();
        
        List<CaloriesVsTargetDTO.DataPoint> dataPoints;
        
        if ("weekly".equalsIgnoreCase(period)) {
            startDate = endDate.minusWeeks(4);
            dataPoints = getWeeklyCaloriesVsTarget(userId, startDate, endDate, targetCalories);
        } else {
            startDate = endDate.minusMonths(6);
            dataPoints = getMonthlyCaloriesVsTarget(userId, startDate, endDate, targetCalories);
        }
        
        return new CaloriesVsTargetDTO(dataPoints, targetCalories);
    }
    
    private List<CaloriesVsTargetDTO.DataPoint> getWeeklyCaloriesVsTarget(Integer userId, LocalDate startDate, LocalDate endDate, Double targetCalories) {
        List<CaloriesVsTargetDTO.DataPoint> dataPoints = new ArrayList<>();
        List<FoodLog> foodLogs = foodLogRepository.findByUserUserIdAndLogDateBetweenOrderByLogDateDesc(userId, startDate, endDate);
        
        // Group by week (7-day periods from startDate)
        Map<Integer, Double> weeklyCalories = new HashMap<>();
        
        for (FoodLog log : foodLogs) {
            // Calculate which week this log belongs to (0-based)
            long daysSinceStart = ChronoUnit.DAYS.between(startDate, log.getLogDate());
            int weekNumber = (int) (daysSinceStart / 7);
            weeklyCalories.merge(weekNumber, log.getKcalSnapshot(), Double::sum);
        }
        
        // Calculate total number of weeks in the range
        long totalDays = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        int totalWeeks = (int) Math.ceil(totalDays / 7.0);
        
        // Create data points for all weeks
        for (int week = 0; week < totalWeeks; week++) {
            // Calculate the actual date range for this week
            LocalDate weekStart = startDate.plusDays(week * 7L);
            LocalDate weekEnd = weekStart.plusDays(6);
            if (weekEnd.isAfter(endDate)) {
                weekEnd = endDate;
            }
            
            // Calculate number of days in this week
            int daysInWeek = (int) ChronoUnit.DAYS.between(weekStart, weekEnd) + 1;
            
            // Get total for this week
            double totalConsumed = weeklyCalories.getOrDefault(week, 0.0);
            
            // Calculate daily average for this week
            double avgCalories = totalConsumed / daysInWeek;
            
            // Simple week label: "Week 1", "Week 2", etc.
            String weekLabel = "Week " + (week + 1);
            
            dataPoints.add(new CaloriesVsTargetDTO.DataPoint(
                weekLabel,
                avgCalories,
                targetCalories
            ));
        }
        
        return dataPoints;
    }
    
    private List<CaloriesVsTargetDTO.DataPoint> getMonthlyCaloriesVsTarget(Integer userId, LocalDate startDate, LocalDate endDate, Double targetCalories) {
        List<CaloriesVsTargetDTO.DataPoint> dataPoints = new ArrayList<>();
        List<FoodLog> foodLogs = foodLogRepository.findByUserUserIdAndLogDateBetweenOrderByLogDateDesc(userId, startDate, endDate);
        
        Map<String, Double> monthlyCalories = new HashMap<>();
        Map<String, Integer> monthDaysCount = new HashMap<>();
        
        for (FoodLog log : foodLogs) {
            String monthKey = log.getLogDate().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            monthlyCalories.merge(monthKey, log.getKcalSnapshot(), Double::sum);
        }
        
        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            String monthKey = current.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            
            // Calculate actual number of days in this month within our range
            LocalDate monthStart = current.withDayOfMonth(1);
            LocalDate monthEnd = current.withDayOfMonth(current.lengthOfMonth());
            
            // Clamp to our query range
            if (monthStart.isBefore(startDate)) monthStart = startDate;
            if (monthEnd.isAfter(endDate)) monthEnd = endDate;
            
            int daysInMonth = (int) ChronoUnit.DAYS.between(monthStart, monthEnd) + 1;
            monthDaysCount.put(monthKey, daysInMonth);
            
            current = current.plusMonths(1);
        }
        
        current = startDate;
        while (!current.isAfter(endDate)) {
            String monthKey = current.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            int daysInMonth = monthDaysCount.getOrDefault(monthKey, 30);
            
            // Daily average = total for the month divided by number of days in that month
            double totalConsumed = monthlyCalories.getOrDefault(monthKey, 0.0);
            double avgCalories = totalConsumed / daysInMonth;
            
            dataPoints.add(new CaloriesVsTargetDTO.DataPoint(
                monthKey,
                avgCalories,
                targetCalories
            ));
            current = current.plusMonths(1);
        }
        
        return dataPoints;
    }
    
    public WeightProgressDTO getWeightProgress(Integer userId, String period) {
        // Don't filter by date - get ALL weight entries for this user
        // The frontend can handle filtering/zooming if needed
        
        // Get target weight from goals
        List<Goal> weightGoals = goalRepository.findByUserUserIdAndStatus(userId, GoalStatus.active)
            .stream()
            .filter(g -> g.getType() == GoalType.WEIGHT_KG)
            .collect(Collectors.toList());
        
        Double targetWeight = weightGoals.isEmpty() ? null : weightGoals.get(0).getTargetValue();
        
        // Get ALL weight entries from weight_entry table (no date filtering)
        List<WeightEntry> weightEntries = weightEntryRepository
            .findByUserIdOrderByRecordedAtDesc(userId);
        
        List<WeightProgressDTO.DataPoint> dataPoints = new ArrayList<>();
        
        // Convert weight entries to data points with timestamps (reverse order for ascending)
        for (int i = weightEntries.size() - 1; i >= 0; i--) {
            WeightEntry entry = weightEntries.get(i);
            dataPoints.add(new WeightProgressDTO.DataPoint(
                entry.getDateRecorded(),
                entry.getRecordedAt(),
                entry.getWeight(),
                targetWeight
            ));
        }
        
        // If no entries exist, fall back to current weight from profile
        if (dataPoints.isEmpty()) {
            UserProfile profile = userProfileRepository.findById(userId).orElse(null);
            if (profile != null && profile.getWeightKg() != null) {
                dataPoints.add(new WeightProgressDTO.DataPoint(
                    LocalDate.now(),
                    java.time.LocalDateTime.now(),
                    profile.getWeightKg(),
                    targetWeight
                ));
            }
        }
        
        return new WeightProgressDTO(dataPoints, targetWeight);
    }
}

