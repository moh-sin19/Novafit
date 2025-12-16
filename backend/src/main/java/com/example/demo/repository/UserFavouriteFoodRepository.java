package com.example.demo.repository;
import com.example.demo.model.UserFavouriteFood;
import com.example.demo.model.UserFavouriteFood.Key;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserFavouriteFoodRepository extends JpaRepository<UserFavouriteFood, Key> {
  List<UserFavouriteFood> findByUserIdOrderByCreatedAtDesc(Integer userId);
}
