// src/main/java/com/example/demo/config/DbInit.java
package com.example.demo.config;

import jakarta.annotation.PostConstruct;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DbInit {
  private final JdbcTemplate jdbc;
  public DbInit(JdbcTemplate jdbc) { this.jdbc = jdbc; }

  @PostConstruct
  public void enableForeignKeys() {
    jdbc.execute("PRAGMA foreign_keys = ON");
  }
}
