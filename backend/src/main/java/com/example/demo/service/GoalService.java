package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.repository.GoalRepository;
import com.example.demo.model.Goal;
import com.example.demo.model.GoalStatus;
import com.example.demo.model.GoalType;
import com.example.demo.web.dto.CreateGoalRequest;
import com.example.demo.web.dto.GoalResponse;
import com.example.demo.model.User;
import com.example.demo.service.UserService;
import java.util.List;
import java.util.stream.Collectors;
import com.example.demo.web.dto.UpdateGoalRequest;
import com.example.demo.web.dto.GoalProgressResponse;
import com.example.demo.repository.WorkoutSessionRepository;
import com.example.demo.repository.FoodLogRepository;
import com.example.demo.model.WorkoutSession;

import com.example.demo.model.UserProfile;
import com.example.demo.repository.UserProfileRepository;
import com.example.demo.repository.DailyTotalsRepository;
import com.example.demo.model.DailyTotals;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.time.Instant;

@Service
public class GoalService {
    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private WorkoutSessionRepository workoutSessionRepository;

    @Autowired
    private DailyTotalsRepository dailyTotalsRepository;

    @Autowired
    private FoodLogRepository foodLogRepository;

    public GoalService(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    public GoalResponse createGoal(CreateGoalRequest request) {
        User user = userService.getCurrentUserOrThrow(); // Instead of request.getUserId()
        
        // Check if user already has an active goal of this type ==> Not allowed
        goalRepository.findByUserUserIdAndTypeAndStatus(user.getUserId(), request.getType(), GoalStatus.active)
            .ifPresent(existingGoal -> {
                throw new IllegalArgumentException(
                    "You already have an active " + request.getType() + " goal. " +
                    "Please complete, pause, or delete the existing goal before creating a new one."
                );
            });
        
        Goal goal = new Goal();
        goal.setUser(user);
        goal.setType(request.getType());
        goal.setFrequency(request.getFrequency());
        goal.setTargetValue(request.getTargetValue());
        goal.setStartDate(request.getStartDate());
        goal.setEndDate(request.getEndDate());
        goal.setStatus(GoalStatus.active);
        // Capture starting value for weight/BMI goals
        if (request.getType() == GoalType.WEIGHT_KG || request.getType() == GoalType.BMI) {
            Double currentValue = getCurrentValueForGoalType(user.getUserId(), request.getType());
            goal.setStartValue(currentValue);
        }
        return GoalResponse.from(goalRepository.save(goal));
    }

    public List<GoalResponse> getUserGoals(Integer userId) {
        List<Goal> goals = goalRepository.findByUserUserId(userId);

        return goals.stream()
            .map(GoalResponse::from)
            .collect(Collectors.toList());
    }

    public List<GoalResponse> getActiveUserGoals(Integer userId) {
        List<Goal> goals = goalRepository.findByUserUserIdAndStatus(userId, GoalStatus.active);
        return goals.stream()
            .map(GoalResponse::from)
            .collect(Collectors.toList());
    }
    public List<GoalResponse> getUserGoalsByType(Integer userId, GoalType type) {
        List<Goal> goals = goalRepository.findByUserUserIdAndType(userId, type);
        return goals.stream()
            .map(GoalResponse::from)
            .collect(Collectors.toList());
    }

    public GoalResponse updateGoal(Integer goalId, UpdateGoalRequest request) {
        Goal goal = goalRepository.findById(goalId).orElseThrow(() -> new RuntimeException("Goal not found"));
        
        // Validate that updating status to "active" does not create a duplicate active of that same type
        if (request.getStatus() == GoalStatus.active) {
            // Check if there's another active goal of the same type for this user
            GoalType checkType = request.getType() != null ? request.getType() : goal.getType();
            goalRepository.findByUserUserIdAndTypeAndStatus(goal.getUser().getUserId(), checkType, GoalStatus.active)
                .ifPresent(existingGoal -> {
                    // Allow if it's the same goal being updated
                    if (!existingGoal.getGoalId().equals(goalId)) {
                        throw new IllegalArgumentException(
                            "You already have an active " + checkType + " goal. " +
                            "Please complete or pause the existing goal before activating another one."
                        );
                    }
                });
        }
        
        // Update fields only if provided (partial update support)
        if (request.getType() != null) {
            goal.setType(request.getType());
        }
        if (request.getFrequency() != null) {
            goal.setFrequency(request.getFrequency());
        }
        if (request.getTargetValue() != null) {
            goal.setTargetValue(request.getTargetValue());
        }
        if (request.getStartDate() != null) {
            goal.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            goal.setEndDate(request.getEndDate());
        }
        if (request.getStatus() != null) {
            goal.setStatus(request.getStatus());
        }
        
        goal.setLastUpdated(Instant.now());
        return GoalResponse.from(goalRepository.save(goal));
    }

    public void deleteGoal(Integer goalId) {
        Goal goal = goalRepository.findById(goalId).orElseThrow(() -> new RuntimeException("Goal not found"));
        goalRepository.delete(goal);
    }

    public GoalProgressResponse getGoalProgress(Integer goalId) {
        Goal goal = goalRepository.findById(goalId).orElseThrow(() -> new RuntimeException("Goal not found"));
        Double currentValue = getCurrentValueForGoal(goal);
        
        if ((goal.getType() == GoalType.WEIGHT_KG || goal.getType() == GoalType.BMI) && goal.getStartValue() == null) {
            if (goal.getTargetValue() != null && currentValue != null) {
                goal.setStartValue(currentValue);
                goalRepository.save(goal);
            }
        }
        return GoalProgressResponse.from(goal, currentValue);
    }

    public List<GoalProgressResponse> getUserGoalProgress(Integer userId) {
        List<Goal> goals = goalRepository.findByUserUserId(userId);
        return goals.stream()
            .map(goal -> getGoalProgress(goal.getGoalId()))
            .collect(Collectors.toList());
    }

    private Double getCurrentValueForGoal(Goal goal) {
        switch (goal.getType()) {
            case WEIGHT_KG:
                return getCurrentWeight(goal.getUser().getUserId());
            case BMI:
                return getCurrentBMI(goal.getUser().getUserId());
            case WORKOUTS_PER_WEEK:
                return getCurrentWorkoutsPerWeek(goal.getUser().getUserId(), goal);
            case CALORIES_KCAL:
                return getCurrentCaloriesKcal(goal.getUser().getUserId(), goal);
            default:
                return 0.0;
        }
    }

        // Helper methods to get current values
    private Double getCurrentWeight(Integer userId) {
        UserProfile profile = userService.getUserOrThrow(userId).getProfile();
        return profile != null ? profile.getWeightKg() : 0.0;
    }

    private Double getCurrentBMI(Integer userId) {
        UserProfile profile = userService.getUserOrThrow(userId).getProfile();
        if (profile == null || profile.getWeightKg() == null || profile.getHeightCm() == null) {
            return 0.0;
        }
        // BMI = weight(kg) / height(m)^2
        double heightInMeters = profile.getHeightCm() / 100.0;
        return profile.getWeightKg() / (heightInMeters * heightInMeters);
    }

    private Double getCurrentWorkoutsPerWeek(Integer userId, Goal goal) {
        // average per day since start then convert to per week
        LocalDate today = LocalDate.now();
        LocalDate startDate = goal.getStartDate();
        LocalDate currentDate = LocalDate.now();
        long weeksBetween = ChronoUnit.WEEKS.between(startDate, currentDate);

        if (startDate == null || startDate.isAfter(today)) {
            return 0.0;
        }

        // Sessions in [startDate, today]
        List<WorkoutSession> workouts = workoutSessionRepository
                .findByUserUserIdAndDateBetweenOrderByDateDesc(userId, startDate, today);

        // Daily frequency --> average per day
        if (goal.getFrequency() != null && goal.getFrequency().name().equalsIgnoreCase("daily")) {
            long daysSinceStart = ChronoUnit.DAYS.between(startDate, today);
            if (daysSinceStart <= 0) daysSinceStart = 1;
            return workouts.isEmpty() ? 0.0 : (double) workouts.size() / (double) daysSinceStart;
        }

        // Weekly or other  -- > average per week
        long weeksSinceStart = ChronoUnit.WEEKS.between(startDate, today);
        if (weeksSinceStart <= 0) weeksSinceStart = 1;
        return workouts.isEmpty() ? 0.0 : (double) workouts.size() / (double) weeksSinceStart;
    }

    // Helper to get current value by goal type only
    private Double getCurrentValueForGoalType(Integer userId, GoalType type) {
        switch (type) {
            case WEIGHT_KG:
                return getCurrentWeight(userId);
            case BMI:
                return getCurrentBMI(userId);
            case WORKOUTS_PER_WEEK:
            case CALORIES_KCAL:
            default:
                return 0.0;
        }
    }

    private Double getCurrentCaloriesKcal(Integer userId, Goal goal) {
        // Average daily calories since the goal started until today.
        LocalDate end = LocalDate.now();
        LocalDate startWindow = goal.getStartDate();
        if (startWindow == null || startWindow.isAfter(end)) {
            return 0.0;
        }

        // Fetch cached daily_totals within the window
        List<DailyTotals> totals = dailyTotalsRepository
                .findByUserIdAndDateBetweenOrderByDateAsc(userId, startWindow, end);

        // Build a lookup of date -> kcal from daily_totals
        java.util.Map<LocalDate, Double> totalsMap = new java.util.HashMap<>();
        for (DailyTotals t : totals) {
            totalsMap.put(t.getDate(), t.getKcalTotal() == null ? 0.0 : t.getKcalTotal());
        }

        // Fetch raw logs in the same window and aggregate per day for dates missing in totals
        var logs = foodLogRepository.findByUserUserIdAndLogDateBetweenOrderByLogDateDesc(userId, startWindow, end);
        java.util.Map<LocalDate, Double> logAgg = new java.util.HashMap<>();
        logs.forEach(fl -> {
            LocalDate d = fl.getLogDate();
            double k = fl.getKcalSnapshot() == null ? 0.0 : fl.getKcalSnapshot();
            logAgg.merge(d, k, Double::sum);
        });

        // Walk each day in the window, summing kcal (0 if no entries), and count days uniformly
        double sum = 0.0;
        int days = 0;
        for (LocalDate d = startWindow; !d.isAfter(end); d = d.plusDays(1)) {
            double kcal = totalsMap.getOrDefault(d, logAgg.getOrDefault(d, 0.0));
            sum += kcal;
            days += 1;
        }

        if (days <= 0) return 0.0;
        return sum / days;
    }

    //complete a goal
    public void completeGoal(Integer goalId) {
        Goal goal = goalRepository.findById(goalId).orElseThrow(() -> new RuntimeException("Goal not found"));
        goal.setStatus(GoalStatus.done);
        goal.setAchieved(true);
        goal.setLastUpdated(Instant.now());
        goalRepository.save(goal);
    }


}