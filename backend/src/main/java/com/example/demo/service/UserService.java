//Part of the code in this file was written with AI. Model used: Claude Sonnet 4.5
package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.model.UserProfile;
import com.example.demo.model.WeightEntry;
import com.example.demo.repository.UserProfileRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.WeightEntryRepository;
import com.example.demo.security.JwtUtils;
import com.example.demo.web.dto.ChangePasswordRequest;
import com.example.demo.web.dto.LoginRequest;
import com.example.demo.web.dto.RegisterUserRequest;
import com.example.demo.web.dto.UpdateProfileRequest;
import com.example.demo.web.dto.UpdateUserRequest;
import com.example.demo.web.dto.UserResponse;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final UserProfileRepository profileRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final WeightEntryRepository weightEntryRepository;

    public UserService(UserRepository userRepo,
                       UserProfileRepository profileRepo,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils,
                       WeightEntryRepository weightEntryRepository
                       ) {
        this.userRepo = userRepo;
        this.profileRepo = profileRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.weightEntryRepository = weightEntryRepository;
    }

    @Transactional
    public User register(RegisterUserRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        String username = req.getUsername() != null ? req.getUsername().trim() : null;

        if (username == null) {
            int at = email.indexOf('@');
            username = (at > 0) ? email.substring(0, at) : email;
        }

        if (userRepo.existsByEmail(email))
            throw new IllegalArgumentException("Email already in use");
        if (username != null && userRepo.existsByUsername(username))
            throw new IllegalArgumentException("Username already in use");
        if(req.getPassword() == null || req.getPassword().length() < 8){
            throw new IllegalArgumentException("Password must be at least 8 characters");
        }

        // Create base User
        User u = new User(
                email,
                username,
                passwordEncoder.encode(req.getPassword())
            );
        u.setCreatedAt(Instant.now());

        // Build profile with all supplied info
        UserProfile p = new UserProfile();
        p.setUser(u);
        p.setFirstName(req.getFirstName());
        p.setLastName(req.getLastName());
        p.setDateOfBirth(req.getDateOfBirth());
        p.setSex(req.getSex());
        p.setHeightCm(req.getHeightCm());
        p.setWeightKg(req.getWeightKg());
        p.setActivityLevel(req.getActivityLevel());
        p.setLocale(req.getLocale());
        p.setTimezone(req.getTimezone() != null ? req.getTimezone() : "UTC");
        p.setUnitWeight(req.getUnitWeight() != null ? req.getUnitWeight().toLowerCase() : "kg");
        p.setUnitEnergy(req.getUnitEnergy() != null ? req.getUnitEnergy().toLowerCase() : "kcal");
        p.setUpdatedAt(Instant.now());

        // Link both sides
        u.setProfile(p);

        return userRepo.save(u); // Cascade will save profile too
    }

    public User getUserOrThrow(Integer userId) {
        return userRepo.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));
    }

    public User getCurrentUserOrThrow() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof Integer userId) {
            return userRepo.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("Authenticated user not found"));
        }
        throw new EntityNotFoundException("Invalid authentication principal");
    }

    @Transactional
    public User updateUser(Integer userId, UpdateUserRequest req) {
        User u = getUserOrThrow(userId);
        if (req.getEmail() != null && !req.getEmail().equals(u.getEmail())) {
            if (userRepo.existsByEmail(req.getEmail())) throw new IllegalArgumentException("Email already in use");
            u.setEmail(req.getEmail());
        }
        if (req.getUsername() != null && !req.getUsername().equals(u.getUsername())) {
            if (userRepo.existsByUsername(req.getUsername())) throw new IllegalArgumentException("Username already in use");
            u.setUsername(req.getUsername());
        }
        return userRepo.save(u);
    }

    @Transactional
    public UserProfile updateProfile(Integer userId, UpdateProfileRequest req) {
        User u = getUserOrThrow(userId);
        UserProfile p = profileRepo.findById(userId).orElseGet(() -> {
            UserProfile np = new UserProfile();
            np.setUser(u);
            return np;
        });

        // Track if weight has changed
        boolean weightChanged = false;
        Double newWeight = null;
        
        if (req.getWeightKg() != null && !req.getWeightKg().equals(p.getWeightKg())) {
            weightChanged = true;
            newWeight = req.getWeightKg();
        }

        // update fields if provided
        if (req.getFirstName() != null) p.setFirstName(req.getFirstName());
        if (req.getLastName() != null) p.setLastName(req.getLastName());
        if (req.getDateOfBirth() != null) p.setDateOfBirth(req.getDateOfBirth());
        if (req.getSex() != null) p.setSex(req.getSex());
        if (req.getHeightCm() != null) p.setHeightCm(req.getHeightCm());
        if (req.getWeightKg() != null) p.setWeightKg(req.getWeightKg());
        if (req.getActivityLevel() != null) p.setActivityLevel(req.getActivityLevel());
        if (req.getTimezone() != null) p.setTimezone(req.getTimezone());
        if (req.getUnitWeight() != null) p.setUnitWeight(req.getUnitWeight());
        if (req.getUnitEnergy() != null) p.setUnitEnergy(req.getUnitEnergy());
        if (req.getLocale() != null) p.setLocale(req.getLocale());

        p.setUpdatedAt(Instant.now());
        UserProfile savedProfile = profileRepo.save(p);
        
        // Create or update weight entry if weight changed
        if (weightChanged && newWeight != null) {
            createOrUpdateWeightEntry(userId, newWeight, LocalDate.now());
        }
        
        return savedProfile;
    }

    /**
     * Creates or updates a weight entry for the given user and date.
     * Always creates a new entry to track multiple measurements per day.
     */
    private void createOrUpdateWeightEntry(Integer userId, Double weight, LocalDate date) {
        // Always create a new entry to track multiple measurements per day
        WeightEntry newEntry = new WeightEntry();
        newEntry.setUserId(userId);
        newEntry.setWeight(weight);
        newEntry.setDateRecorded(date);
        newEntry.setRecordedAt(LocalDateTime.now());
        weightEntryRepository.save(newEntry);
    }

    @Transactional
    public void changePassword(Integer userId, ChangePasswordRequest request) {
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));

        // check old password
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }

        // confirm new passwords match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("New passwords do not match");
        }

        // update password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepo.save(user);
    }

    @Transactional
    public void deleteAccount(Integer userId) {
        // Will cascade delete profile due to JPA mapping
        userRepo.deleteById(userId);
    }

    @Transactional
    public UserResponse login(LoginRequest req) {
        User u = userRepo.findByEmail(req.getUsernameOrEmail().toLowerCase())
                .or(() -> userRepo.findByUsername(req.getUsernameOrEmail().toLowerCase()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(req.getPassword(), u.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtUtils.generateToken(u.getUserId(), u.getUsername());
        return UserResponse.fromWithToken(u, u.getProfile(), token);
    }
}
