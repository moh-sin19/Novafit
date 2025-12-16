CREATE TABLE user_favourite_food (
  user_id INTEGER NOT NULL,
  food_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, food_id),
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES food_item(food_id) ON DELETE CASCADE
);

CREATE INDEX idx_user_favourite_user ON user_favourite_food(user_id);