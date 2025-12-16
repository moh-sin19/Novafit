-- ============================================================
-- Fitness & Nutrition Planner — SQLite Schema (Flyway V1)
-- ============================================================


-- =========================
-- 1) Accounts & Profiles
-- =========================

CREATE TABLE user (
  user_id        INTEGER PRIMARY KEY AUTOINCREMENT,
  email          TEXT    NOT NULL UNIQUE,
  username       TEXT    NOT NULL UNIQUE,
  password_hash  TEXT    NOT NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profile (
  user_id        INTEGER PRIMARY KEY,             -- 1:1 with user
  first_name     TEXT,
  last_name      TEXT,
  date_of_birth  DATE,                            -- ISO date
  sex            TEXT CHECK (sex IN ('male','female','other','prefer_not_to_say')),
  height_cm      REAL CHECK (height_cm >= 0),
  weight_kg      REAL CHECK (weight_kg >= 0),
  activity_level TEXT CHECK (activity_level IN ('sedentary','light','moderate','high','athlete')),
  tz             TEXT NOT NULL DEFAULT 'UTC',     -- e.g., 'Europe/London'
  unit_weight    TEXT NOT NULL DEFAULT 'kg'  CHECK (unit_weight IN ('kg','lb')),
  unit_energy    TEXT NOT NULL DEFAULT 'kcal' CHECK (unit_energy IN ('kcal','kJ')),
  locale         TEXT,
  updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- Optional cached aggregates to speed up dashboards
CREATE TABLE daily_totals (
  user_id          INTEGER NOT NULL,
  date             DATE    NOT NULL,     -- ISO date
  kcal_total       REAL    DEFAULT 0,
  protein_g_total  REAL    DEFAULT 0,
  carbs_g_total    REAL    DEFAULT 0,
  fat_g_total      REAL    DEFAULT 0,
  workout_minutes  REAL    DEFAULT 0,
  workout_volume   REAL    DEFAULT 0,    -- e.g., sum(sets*reps*weight)
  PRIMARY KEY (user_id, date),
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- =========================
-- 2) Exercise Catalogue
-- =========================

CREATE TABLE exercise (
  exercise_id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name           TEXT    NOT NULL,
  description    TEXT,
  created_by     INTEGER,                                    -- null = global/shared
  last_updated   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (created_by, name),
  FOREIGN KEY (created_by) REFERENCES user(user_id) ON DELETE SET NULL
);

CREATE INDEX idx_exercise_name ON exercise(name);

-- ==========================================
-- 3) Workouts (Session → Exercise → Set)
-- ==========================================

CREATE TABLE workout_session (
  session_id     INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER NOT NULL,
  date           DATE    NOT NULL,           -- ISO date (YYYY-MM-DD)
  start_time     TIME,                        -- 'HH:mm:ss'
  end_time       TIME,
  notes          TEXT,
  last_updated   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_session_user_date ON workout_session(user_id, date DESC);

CREATE TABLE session_exercise (
  session_exercise_id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id     INTEGER NOT NULL,
  exercise_id    INTEGER NOT NULL,
  type           TEXT    NOT NULL CHECK (type IN ('WEIGHT','CARDIO')),
  sort_order     INTEGER NOT NULL DEFAULT 1,
  notes          TEXT,
  FOREIGN KEY (session_id)  REFERENCES workout_session(session_id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercise(exercise_id)     ON DELETE RESTRICT
);

CREATE INDEX idx_sx_session_order ON session_exercise(session_id, sort_order);

-- One performed set = one row (scoped to this session/exercise)
CREATE TABLE session_set (
  session_set_id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_exercise_id INTEGER NOT NULL,
  set_order      INTEGER NOT NULL DEFAULT 1,
  reps           INTEGER,                    -- for WEIGHT
  weight         REAL,                       -- kg/lb according to user_profile
  rpe            REAL,                       -- 6.0–10.0 typical
  duration_min   REAL,                       -- for CARDIO
  distance_m    REAL,
  calories_burned REAL,
  FOREIGN KEY (session_exercise_id) REFERENCES session_exercise(session_exercise_id) ON DELETE CASCADE,
  CHECK (reps IS NULL OR reps >= 0),
  CHECK (weight IS NULL OR weight >= 0),
  CHECK (duration_min IS NULL OR duration_min >= 0),
  CHECK (distance_m IS NULL OR distance_m >= 0),
  CHECK (calories_burned IS NULL OR calories_burned >= 0)
);

CREATE INDEX idx_ss_exercise_order ON session_set(session_exercise_id, set_order);

-- =================================
-- 4) Routines (templates to reuse)
-- =================================

CREATE TABLE routine (
  routine_id     INTEGER PRIMARY KEY AUTOINCREMENT,
  created_by     INTEGER NOT NULL,
  name           TEXT    NOT NULL,
  notes          TEXT,
  last_updated   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES user(user_id) ON DELETE CASCADE
);

CREATE TABLE routine_exercise (
  routine_exercise_id INTEGER PRIMARY KEY AUTOINCREMENT,
  routine_id     INTEGER NOT NULL,
  exercise_id    INTEGER NOT NULL,
  type           TEXT    NOT NULL CHECK (type IN ('WEIGHT','CARDIO')),
  sort_order     INTEGER NOT NULL DEFAULT 1,
  notes          TEXT,
  FOREIGN KEY (routine_id)  REFERENCES routine(routine_id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercise(exercise_id) ON DELETE RESTRICT
);

CREATE INDEX idx_rx_routine_order ON routine_exercise(routine_id, sort_order);

CREATE TABLE routine_set (
  routine_set_id INTEGER PRIMARY KEY AUTOINCREMENT,
  routine_exercise_id INTEGER NOT NULL,
  set_order      INTEGER NOT NULL DEFAULT 1,
  target_reps    INTEGER,
  target_weight  REAL,
  target_duration_min REAL,
  target_distance_m  REAL,
  FOREIGN KEY (routine_exercise_id) REFERENCES routine_exercise(routine_exercise_id) ON DELETE CASCADE
);

CREATE INDEX idx_rs_exercise_order ON routine_set(routine_exercise_id, set_order);

-- ======================================
-- 5) Food Catalogue (cache) + Food Logs
-- ======================================

CREATE TABLE food_item (
  food_id        INTEGER PRIMARY KEY AUTOINCREMENT,
  source         TEXT    NOT NULL CHECK (source IN ('API','CUSTOM')),
  external_ref   TEXT,                    -- API id if source='API'
  created_by     INTEGER,                 -- null unless CUSTOM
  name           TEXT    NOT NULL,
  brand          TEXT,
  serving_unit   TEXT    NOT NULL,        -- 'g','ml','cup', etc.
  kcal           REAL    CHECK (kcal >= 0),
  protein_g      REAL    CHECK (protein_g >= 0),
  carbs_g        REAL    CHECK (carbs_g >= 0),
  fat_g          REAL    CHECK (fat_g >= 0),
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (source, external_ref),
  FOREIGN KEY (created_by) REFERENCES user(user_id) ON DELETE SET NULL
);

CREATE INDEX idx_food_name ON food_item(name);

CREATE TABLE food_log (
  log_id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER NOT NULL,
  food_id        INTEGER NOT NULL,
  log_date       DATE    NOT NULL,                  -- ISO date
  meal_type      TEXT    CHECK (meal_type IN ('BREAKFAST','LUNCH','DINNER','SNACK')),
  serving_qty    REAL    NOT NULL CHECK (serving_qty > 0),   -- factor against food base
  -- nutrient snapshots (do not recompute later)
  kcal_snapshot      REAL NOT NULL CHECK (kcal_snapshot >= 0),
  protein_g_snapshot REAL NOT NULL CHECK (protein_g_snapshot >= 0),
  carbs_g_snapshot   REAL NOT NULL CHECK (carbs_g_snapshot >= 0),
  fat_g_snapshot     REAL NOT NULL CHECK (fat_g_snapshot >= 0),
  note           TEXT,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(user_id)   ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES food_item(food_id) ON DELETE RESTRICT
);

CREATE INDEX idx_foodlog_user_date ON food_log(user_id, log_date);

-- =====================
-- 6) Recipes
-- =====================

CREATE TABLE recipe (
  recipe_id      INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER NOT NULL,
  name           TEXT    NOT NULL,
  notes          TEXT,
  last_updated   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  UNIQUE (user_id, name)
);

CREATE TABLE recipe_item (
  recipe_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id      INTEGER NOT NULL,
  food_id        INTEGER NOT NULL,
  quantity       REAL    NOT NULL CHECK (quantity > 0),  -- in food_item.serving_unit
  sort_order     INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id) ON DELETE CASCADE,
  FOREIGN KEY (food_id)   REFERENCES food_item(food_id) ON DELETE RESTRICT
);

CREATE INDEX idx_recipeitem_recipe ON recipe_item(recipe_id, sort_order);

-- ==========================
-- 7) Goals (per user)
-- ==========================

CREATE TABLE goal (
  goal_id        INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER NOT NULL,
  type           TEXT    NOT NULL CHECK (type IN ('WEIGHT_KG','BMI','WORKOUTS_PER_WEEK','CALORIES_KCAL')),
  frequency      TEXT    NOT NULL CHECK (frequency IN ('daily','weekly','custom_range')),
  target_value   REAL    NOT NULL,
  start_date     DATE    NOT NULL,
  end_date       DATE,
  status         TEXT    NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','done')),
  achieved       BOOLEAN NOT NULL DEFAULT FALSE,
  last_updated   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_goal_user ON goal(user_id, status);
