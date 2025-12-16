// package com.example.demo;
// import com.example.demo.repository.UserRepository;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.test.context.ActiveProfiles;

// import static org.assertj.core.api.Assertions.assertThat;

// @SpringBootTest
// @ActiveProfiles("dev")   // so it loads novafit-dev.db with seeds
// public class SeedDataSmokeTest {
//     @Autowired
//     private UserRepository userRepo;

//     @Test
//     void demoUserIsSeeded() {
//         var demo = userRepo.findByUsername("demo").orElseThrow();
//         assertThat(demo.getEmail()).isEqualTo("demo@example.com");
//     }
// }
