package com.example.demo;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test") // schema-only, no seed data
class UserRepositoryTest {

    @Autowired
    private UserRepository repo;

    // @Test
    // void savesAndFindsUser() {
    //     // correct parameter order: email, username, passwordHash
    //     var user = new User("alice@example.com", "alice", "secret");

    //     var saved = repo.save(user);

    //     assertThat(saved.getUserId()).isNotNull();   // use getUserId()
    //     assertThat(repo.findAll()).hasSize(1);
    // }
}
