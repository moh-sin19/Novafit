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
import com.example.demo.web.dto.WorkoutSummaryResponse;
import com.example.demo.web.dto.GoalProgressResponse;
import com.example.demo.repository.WorkoutSessionRepository;
import com.example.demo.repository.FoodLogRepository;
import com.example.demo.model.WorkoutSession;
//import stuff for retreiving user persondata (weight, bmi, workouts per week, calories kcal)
import com.example.demo.model.UserProfile;
import com.example.demo.repository.UserProfileRepository;
import com.example.demo.repository.DailyTotalsRepository;
import com.example.demo.model.DailyTotals;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.time.Instant;

@Service
public class WorkoutSummaryService {
    @Autowired
    private DailyTotalsRepository dailyTotalsRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private FoodLogRepository foodLogRepository;

    public WorkoutSummaryResponse getCaloriesDate(Integer userId, String date) {
        LocalDate localDate = date != null ? LocalDate.parse(date) : LocalDate.now();
//        Integer userId = userService.getCurrentUserOrThrow().getUserId();

        Double dailyCalories = getDailyCaloriesKcal(userId, localDate);

        return new WorkoutSummaryResponse(userId, localDate, dailyCalories);
    }

    public WorkoutSummaryResponse getDurationDate(Integer userId, String date) {
        LocalDate localDate = date != null ? LocalDate.parse(date) : LocalDate.now();

        Double dailyCalories = getDailyCaloriesKcal(userId, localDate);

        return new WorkoutSummaryResponse(userId, localDate, dailyCalories);
    }

    public WorkoutSummaryResponse getSetsDate(Integer userId, String date) {
        LocalDate localDate = date != null ? LocalDate.parse(date) : LocalDate.now();
//        Integer userId = userService.getCurrentUserOrThrow().getUserId();

        Double dailyCalories = getDailyCaloriesKcal(userId, localDate);

        return new WorkoutSummaryResponse(userId, localDate, dailyCalories);
    }

    private Double getDailyCaloriesKcal(Integer userId, LocalDate date) {
        // Average daily calories since the goal started until today.
//        LocalDate end = LocalDate.now();
//        LocalDate startWindow = goal.getStartDate();
//        if (startWindow == null || startWindow.isAfter(end)) {
//            return 0.0;
//        }
        if (date == null) {
            date = LocalDate.now();
        }

        // Fetch cached daily_totals within the window
        List<DailyTotals> totals = dailyTotalsRepository
                .findByUserIdAndDateBetweenOrderByDateAsc(userId, date, date);

        // Build a lookup of date -> kcal from daily_totals
        java.util.Map<LocalDate, Double> totalsMap = new java.util.HashMap<>();
        for (DailyTotals t : totals) {
            totalsMap.put(t.getDate(), t.getKcalTotal() == null ? 0.0 : t.getKcalTotal());
        }

        // Fetch raw logs in the same window and aggregate per day for dates missing in totals
        var logs = foodLogRepository.findByUserUserIdAndLogDateBetweenOrderByLogDateDesc(userId, date, date);
        java.util.Map<LocalDate, Double> logAgg = new java.util.HashMap<>();
        logs.forEach(fl -> {
            LocalDate d = fl.getLogDate();
            double k = fl.getKcalSnapshot() == null ? 0.0 : fl.getKcalSnapshot();
            logAgg.merge(d, k, Double::sum);
        });

        // Walk each day in the window, summing kcal (0 if no entries), and count days uniformly
        double sum = 0.0;
        int days = 0;
        for (LocalDate d = date; !d.isAfter(date); d = d.plusDays(1)) {
            double kcal = totalsMap.getOrDefault(d, logAgg.getOrDefault(d, 0.0));
            sum += kcal;
            days += 1;
        }

        if (days <= 0) return 0.0;
        return sum / days;
    }
}
