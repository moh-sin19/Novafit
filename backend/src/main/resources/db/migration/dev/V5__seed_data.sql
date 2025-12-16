-- ============================================================
-- Fitness & Nutrition Planner — Seed Data (Refactored Schema)
-- Flyway V5
-- ============================================================

-- 1) Users
INSERT INTO user (email, username, password_hash)
VALUES
  ('demo@example.com', 'demo', '$2a$10$PoLS5QBfbcEBi/5bn0JvQO2RX53SUj7NcZ2BmpAB4huvl7dgsdj4e'); -- pwd: demo123

-- 2) User Profiles
INSERT INTO user_profile (user_id, first_name, last_name, sex, height_cm, weight_kg, activity_level, locale)
VALUES
  (1, 'Demo', 'User', 'other', 170, 70, 'moderate', 'en_AU');

-- 3) Exercises
INSERT INTO exercise (name, description)
VALUES
  ('Push-up', 'Bodyweight chest and triceps exercise'),
  ('Squat', 'Lower-body strength exercise targeting legs and glutes'),
  ('Running', 'Cardio exercise performed outdoors or on treadmill');

-- 4) Food Items
INSERT INTO food_item (source, name, brand)
VALUES
  ('CUSTOM', 'Banana', 'Generic'),
  ('CUSTOM', 'Chicken Breast', 'Generic'),
  ('CUSTOM', 'Rice (Cooked)', 'Generic');

-- 5) Food Servings (refactored macros per 100g)
INSERT INTO food_serving (food_id, label, units, metric_qty, metric_unit,
                          kcal, protein_g, carbs_g, fat_g)
VALUES
  (1, 'Default (100 g)', 1.0, 100.0, 'g', 89, 1.1, 23, 0.3),
  (2, 'Default (100 g)', 1.0, 100.0, 'g', 165, 31, 0, 3.6),
  (3, 'Default (100 g)', 1.0, 100.0, 'g', 130, 2.7, 28, 0.3);

-- 6) Workout Session
INSERT INTO workout_session (user_id, date, start_time, end_time, notes)
VALUES
  (1, DATE('now', '-1 day'), '18:00:00', '19:00:00', 'Demo workout session');

-- Link exercises to session
INSERT INTO session_exercise (session_id, exercise_id, type, sort_order, notes)
VALUES
  (1, 1, 'WEIGHT', 1, 'Push-ups for warm-up'),
  (1, 2, 'WEIGHT', 2, 'Legs focus'),
  (1, 3, 'CARDIO', 3, 'Short run');

-- Add sets for push-ups
INSERT INTO session_set (session_exercise_id, set_order, reps, rpe)
VALUES
  (1, 1, 12, 7),
  (1, 2, 10, 8);

-- Add sets for squats
INSERT INTO session_set (session_exercise_id, set_order, reps, weight, rpe)
VALUES
  (2, 1, 8, 40, 7),
  (2, 2, 6, 50, 8);

-- Add cardio record
INSERT INTO session_set (session_exercise_id, set_order, duration_min, distance_m, calories_burned)
VALUES
  (3, 1, 15, 3000, 200);

-- 7) Food Log (Demo meal for today)
INSERT INTO food_log (user_id, food_id, serving_id, log_date, meal_type, serving_qty,
                      kcal_snapshot, protein_g_snapshot, carbs_g_snapshot, fat_g_snapshot, note)
VALUES
  (1, 1, 1, DATE('now'), 'BREAKFAST', 1.2, 107, 1.3, 28, 0.4, 'Morning banana');

-- 8) Daily Totals (auto-calculated seed)
INSERT INTO daily_totals (user_id, date, kcal_total, protein_g_total, carbs_g_total, fat_g_total)
VALUES
  (1, DATE('now'), 107, 1.3, 28, 0.4);

-- 9) Goals
INSERT INTO goal (user_id, type, frequency, target_value, start_date)
VALUES
  (1, 'WEIGHT_KG', 'daily', 65.0, DATE('now'));
