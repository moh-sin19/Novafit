package com.example.demo.goal;

import com.example.demo.controller.GoalController;
import com.example.demo.model.GoalType;
import com.example.demo.service.GoalService;
import com.example.demo.web.dto.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.example.demo.security.JwtAuthFilter;
import com.example.demo.security.JwtUtils;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = GoalController.class)
@AutoConfigureMockMvc(addFilters = false)
class GoalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GoalService goalService;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @MockBean
    private JwtUtils jwtUtils;

    @Autowired
    private ObjectMapper objectMapper;

    private GoalResponse mockGoalResponse;
    private GoalProgressResponse mockProgressResponse;

    @BeforeEach
    void setUp() {
        mockGoalResponse = new GoalResponse();
        mockGoalResponse.setGoalId(1);
        mockGoalResponse.setUserId(1);
        mockGoalResponse.setType(GoalType.WEIGHT_KG);
        mockGoalResponse.setTargetValue(75.0);
        mockGoalResponse.setStatus(com.example.demo.model.GoalStatus.active);

        mockProgressResponse = new GoalProgressResponse();
        mockProgressResponse.setGoalId(1);
        mockProgressResponse.setCurrentValue(70.0);
        mockProgressResponse.setTargetValue(75.0);
    }

    @Test
    void createGoal_ShouldReturnCreatedGoal() throws Exception {
        // Given
        CreateGoalRequest request = new CreateGoalRequest();
        request.setType(GoalType.WEIGHT_KG);
        request.setFrequency(com.example.demo.model.GoalFrequency.weekly);
        request.setTargetValue(75.0);
        request.setStartDate(LocalDate.now());
        request.setEndDate(LocalDate.now().plusMonths(3));

        when(goalService.createGoal(any(CreateGoalRequest.class)))
                .thenReturn(mockGoalResponse);

        // When & Then
        mockMvc.perform(post("/api/goals")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.goalId").value(1))
                .andExpect(jsonPath("$.type").value("WEIGHT_KG"));

        verify(goalService, times(1)).createGoal(any(CreateGoalRequest.class));
    }

    @Test
    void getUserGoals_ShouldReturnListOfGoals() throws Exception {
        // Given
        GoalResponse goal2 = new GoalResponse();
        goal2.setGoalId(2);
        goal2.setType(GoalType.BMI);

        List<GoalResponse> goals = Arrays.asList(mockGoalResponse, goal2);
        when(goalService.getUserGoals(1)).thenReturn(goals);

        // When & Then
        mockMvc.perform(get("/api/goals")
                        .param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2));

        verify(goalService, times(1)).getUserGoals(1);
    }

    @Test
    void getActiveUserGoals_ShouldReturnActiveGoals() throws Exception {
        // Given
        List<GoalResponse> activeGoals = List.of(mockGoalResponse);
        when(goalService.getActiveUserGoals(1)).thenReturn(activeGoals);

        // When & Then
        mockMvc.perform(get("/api/goals/active")
                        .param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1));

        verify(goalService, times(1)).getActiveUserGoals(1);
    }

    @Test
    void getUserGoalsByType_ShouldReturnFilteredGoals() throws Exception {
        // Given
        List<GoalResponse> weightGoals = List.of(mockGoalResponse);
        when(goalService.getUserGoalsByType(1, GoalType.WEIGHT_KG)).thenReturn(weightGoals);

        // When & Then
        mockMvc.perform(get("/api/goals/type")
                        .param("userId", "1")
                        .param("type", "WEIGHT_KG"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1));

        verify(goalService, times(1)).getUserGoalsByType(1, GoalType.WEIGHT_KG);
    }

    @Test
    void updateGoal_ShouldReturnUpdatedGoal() throws Exception {
        // Given
        UpdateGoalRequest request = new UpdateGoalRequest();
        request.setTargetValue(80.0);
        request.setStatus(com.example.demo.model.GoalStatus.active);

        when(goalService.updateGoal(eq(1), any(UpdateGoalRequest.class)))
                .thenReturn(mockGoalResponse);

        // When & Then
        mockMvc.perform(put("/api/goals/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.goalId").value(1));

        verify(goalService, times(1)).updateGoal(eq(1), any(UpdateGoalRequest.class));
    }

    @Test
    void deleteGoal_ShouldReturnNoContent() throws Exception {
        // Given
        doNothing().when(goalService).deleteGoal(1);

        // When & Then
        mockMvc.perform(delete("/api/goals/1"))
                .andExpect(status().isNoContent());

        verify(goalService, times(1)).deleteGoal(1);
    }

    @Test
    void getGoalProgress_ShouldReturnProgress() throws Exception {
        // Given
        when(goalService.getGoalProgress(1)).thenReturn(mockProgressResponse);

        // When & Then
        mockMvc.perform(get("/api/goals/1/progress"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.goalId").value(1))
                .andExpect(jsonPath("$.currentValue").value(70.0))
                .andExpect(jsonPath("$.targetValue").value(75.0));

        verify(goalService, times(1)).getGoalProgress(1);
    }

    @Test
    void getUserGoalProgress_ShouldReturnListOfProgress() throws Exception {
        // Given
        GoalProgressResponse progress2 = new GoalProgressResponse();
        progress2.setGoalId(2);
        progress2.setCurrentValue(20.0);
        progress2.setTargetValue(25.0);

        List<GoalProgressResponse> progressList = Arrays.asList(mockProgressResponse, progress2);
        when(goalService.getUserGoalProgress(1)).thenReturn(progressList);

        // When & Then
        mockMvc.perform(get("/api/goals/user/1/progress"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2));

        verify(goalService, times(1)).getUserGoalProgress(1);
    }

    @Test
    void completeGoal_ShouldReturnNoContent() throws Exception {
        // Given
        doNothing().when(goalService).completeGoal(1);

        // When & Then
        mockMvc.perform(post("/api/goals/1/complete"))
                .andExpect(status().isNoContent());

        verify(goalService, times(1)).completeGoal(1);
    }
}

