package com.example.demo.web.dto;

import com.example.demo.model.User;
import com.example.demo.model.UserProfile;
import java.time.Instant;
import java.time.LocalDate;

public class UserResponse {
    public Integer userId;
    public String email;
    public String username;
    public Instant createdAt;

    // profile fields (may be null if not set)
    public String firstName;
    public String lastName;
    public LocalDate dateOfBirth;
    public String sex;
    public Double heightCm;
    public Double weightKg;
    public String activityLevel;
    public String timezone;
    public String unitWeight;
    public String unitEnergy;
    public String locale;

    // for login session
    public String token;
    public String tokenType;

    public static UserResponse from(User u, UserProfile p) {
        UserResponse r = new UserResponse();
        r.userId = u.getUserId();
        r.email = u.getEmail();
        r.username = u.getUsername();
        r.createdAt = u.getCreatedAt();
        if (p != null) {
            r.firstName = p.getFirstName();
            r.lastName = p.getLastName();
            r.dateOfBirth = p.getDateOfBirth();
            r.sex = p.getSex();
            r.heightCm = p.getHeightCm();
            r.weightKg = p.getWeightKg();
            r.activityLevel = p.getActivityLevel();
            r.timezone = p.getTimezone();
            r.unitWeight = p.getUnitWeight();
            r.unitEnergy = p.getUnitEnergy();
            r.locale = p.getLocale();
        }
        return r;
    }

    public static UserResponse fromWithToken(User u, UserProfile p, String token) {
        UserResponse r = from(u, p);
        r.token = token;
        r.tokenType = "Bearer";
        return r;
    }
}
