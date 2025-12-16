// I acknowledge the use of Microsoft Copilot AI in this project.
// The following prompt was given:
// Hello, I'm getting a 500 Error on my Springboot application. Can you help me debug?
// This is the Response (the error could be coming from here). " public static ExerciseResponse
// from(Exercise exercise) { ExerciseResponse response = new ExerciseResponse();
// response.setExerciseId(exercise.getExerciseId()); response.setCreatedByUserId(exercise.getCreatedBy().getUserId());
// // response.setCreatedByUsername(exercise.getCreatedBy().getUsername()); response.setName(exercise.getName());
// response.setDescription(exercise.getDescription()); response.setLastUpdated(exercise.getLastUpdated());
// TEXT NOT NULL, description TEXT, created_by INTEGER, -- null = global/shared last_updated TIMESTAMP NOT NULL
// DEFAULT CURRENT_TIMESTAMP, UNIQUE (created_by, name), FOREIGN KEY (created_by) REFERENCES user(user_id) ON
// DELETE SET NULL );" Please keep your response short (preferably no more than a paragraph).
// The following response was given:
// The 500 error likely stems from `exercise.getCreatedBy().getUserId()` when `created_by` is
// `NULL` in the database. Since the foreign key allows nulls, `getCreatedBy()` may return `null`,
// causing a `NullPointerException`. Add a null check before accessing `getUserId()` or `getUsername`:
//
// ```java
// if (exercise.getCreatedBy() != null) {
//     response.setCreatedByUserId(exercise.getCreatedBy().getUserId());
// }
// ```
//
// This should prevent the crash.

package com.example.demo.web.dto;

import com.example.demo.model.Exercise;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

public class ExerciseResponse {
    private Integer exerciseId;
    private Integer createdByUserId;   
//    private String createdByUsername;
    private String name;
    private String description;
    private Instant lastUpdated;

    public static ExerciseResponse from(Exercise exercise) {
        ExerciseResponse response = new ExerciseResponse();
        response.setExerciseId(exercise.getExerciseId());
        if (exercise.getCreatedBy() != null) {
            response.setCreatedByUserId(exercise.getCreatedBy().getUserId());
        }
        else {
            response.setCreatedByUserId(null);
        }
//        response.setCreatedByUserId(exercise.getCreatedBy().getUserId());
//        response.setCreatedByUsername(exercise.getCreatedBy().getUsername());
        response.setName(exercise.getName());
        response.setDescription(exercise.getDescription());
        response.setLastUpdated(exercise.getLastUpdated());
        return response;
    }
    
    // Getters and setters...
    public Integer getExerciseId() { return exerciseId; }
    public void setExerciseId(Integer exerciseId) { this.exerciseId = exerciseId; }
    public Integer getCreatedByUserId() { return createdByUserId; }
    public void setCreatedByUserId(Integer createdByUserId) { this.createdByUserId = createdByUserId; }
//    public String getCreatedByUsername() { return createdByUsername; }
//    public void setCreatedByUsername(String createdByUsername) { this.createdByUsername = createdByUsername; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Instant getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(Instant lastUpdated) { this.lastUpdated = lastUpdated; }
}
