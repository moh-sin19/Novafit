package com.example.demo.model;

import jakarta.persistence.*;
import java.time.Instant;
import jakarta.persistence.Convert;
import com.example.demo.util.InstantUtcStringConverter;

@Entity
@Table(name = "user",
  uniqueConstraints = {
    @UniqueConstraint(columnNames = "email"),
    @UniqueConstraint(columnNames = "username")
  }
)
public class User {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer userId;

  @Column(nullable = false, unique = true) private String email;
  @Column(nullable = false, unique = true) private String username;
  @Column(nullable = false) private String passwordHash;
  
  @Convert(converter = InstantUtcStringConverter.class)
  @Column(nullable = false, columnDefinition = "TEXT")
  private Instant createdAt = Instant.now();

  @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private UserProfile profile;

  public User() {}
  public User(String email, String username, String passwordHash) {
    this.email = email; this.username = username; this.passwordHash = passwordHash;
  }

  public Integer getUserId() { return userId; }
  public void setUserId(Integer userId) { this.userId = userId; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }
  public String getPasswordHash() { return passwordHash; }
  public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
  public UserProfile getProfile() { return profile; }
  public void setProfile(UserProfile profile) { this.profile = profile; }
}
