package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.model.UserProfile;
import com.example.demo.service.UserService;
import com.example.demo.web.dto.*;
import jakarta.validation.Valid;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService users;

    public UserController(UserService users) {
        this.users = users;
    }

    // Register a new user
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterUserRequest req) {
        User u = users.register(req);
        UserProfile p = u.getProfile();
        return ResponseEntity.status(HttpStatus.CREATED).body(UserResponse.from(u, p));
    }

    // Get user + profile (until JWT is added, pass userId in path)
    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {
        User u = users.getCurrentUserOrThrow();
        return ResponseEntity.ok(UserResponse.from(u, u.getProfile()));
    }

    // Update base user (email, username)
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateUser(@Valid @RequestBody UpdateUserRequest req) {
        User u = users.getCurrentUserOrThrow();
        u = users.updateUser(u.getUserId(), req);
        return ResponseEntity.ok(UserResponse.from(u, u.getProfile()));
    }

    // Upsert/update profile
    @PutMapping("/me/profile")
    public ResponseEntity<UserResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest req) {
        User u = users.getCurrentUserOrThrow();
        UserProfile p = users.updateProfile(u.getUserId(), req);
        return ResponseEntity.ok(UserResponse.from(u, p));
    }
    
    // Change password (user must be logged in)
    @PutMapping("/me/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        User currentUser = users.getCurrentUserOrThrow();
        users.changePassword(currentUser.getUserId(), request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    // Delete account
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteAccount() {
        User u = users.getCurrentUserOrThrow();
        users.deleteAccount(u.getUserId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(users.login(req));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // With stateless JWT, logout = frontend deletes token
        // (optionally, implement token blacklist on backend)
        return ResponseEntity.noContent().build();
    }
}
