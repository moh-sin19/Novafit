-- V2: Normalize all DATE/TIMESTAMP columns to TEXT and convert any millis

-- Helper: converts integer millis -> 'YYYY-MM-DD'
--         leaves text as-is
-- (we inline strftime(...) per-table instead of using a function.)

--------------- user ---------------
ALTER TABLE user RENAME TO user_old;
CREATE TABLE user (
  user_id        INTEGER PRIMARY KEY AUTOINCREMENT,
  email          TEXT    NOT NULL UNIQUE,
  username       TEXT    NOT NULL UNIQUE,
  password_hash  TEXT    NOT NULL,
  created_at     TEXT    NOT NULL DEFAULT (CURRENT_TIMESTAMP)  -- TEXT
);
INSERT INTO user (user_id,email,username,password_hash,created_at)
SELECT user_id,email,username,password_hash,
       CASE WHEN typeof(created_at)='integer'
            THEN strftime('%Y-%m-%d %H:%M:%S', created_at/1000, 'unixepoch')
            ELSE created_at END
FROM user_old;
DROP TABLE user_old;

--------------- user_profile ---------------
ALTER TABLE user_profile RENAME TO user_profile_old;
CREATE TABLE user_profile (
  user_id        INTEGER PRIMARY KEY,
  first_name     TEXT,
  last_name      TEXT,
  date_of_birth  TEXT,  -- DATE as TEXT 'YYYY-MM-DD'
  sex            TEXT CHECK (sex IN ('male','female','other','prefer_not_to_say')),
  height_cm      REAL CHECK (height_cm >= 0),
  weight_kg      REAL CHECK (weight_kg >= 0),
  activity_level TEXT CHECK (activity_level IN ('sedentary','light','moderate','high','athlete')),
  tz             TEXT NOT NULL DEFAULT 'UTC',
  unit_weight    TEXT NOT NULL DEFAULT 'kg'  CHECK (unit_weight IN ('kg','lb')),
  unit_energy    TEXT NOT NULL DEFAULT 'kcal' CHECK (unit_energy IN ('kcal','kJ')),
  locale         TEXT,
  updated_at     TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);
INSERT INTO user_profile (user_id,first_name,last_name,date_of_birth,sex,height_cm,weight_kg,
                          activity_level,tz,unit_weight,unit_energy,locale,updated_at)
SELECT user_id,first_name,last_name,
       CASE WHEN typeof(date_of_birth)='integer'
            THEN strftime('%Y-%m-%d', date_of_birth/1000, 'unixepoch')
            ELSE date_of_birth END,
       sex,height_cm,weight_kg,activity_level,tz,unit_weight,unit_energy,locale,
       CASE WHEN typeof(updated_at)='integer'
            THEN strftime('%Y-%m-%d %H:%M:%S', updated_at/1000, 'unixepoch')
            ELSE updated_at END
FROM user_profile_old;
DROP TABLE user_profile_old;

--------------- daily_totals ---------------
ALTER TABLE daily_totals RENAME TO daily_totals_old;
CREATE TABLE daily_totals (
  user_id          INTEGER NOT NULL,
  date             TEXT    NOT NULL,  -- 'YYYY-MM-DD'
  kcal_total       REAL    DEFAULT 0,
  protein_g_total  REAL    DEFAULT 0,
  carbs_g_total    REAL    DEFAULT 0,
  fat_g_total      REAL    DEFAULT 0,
  workout_minutes  REAL    DEFAULT 0,
  workout_volume   REAL    DEFAULT 0,
  PRIMARY KEY (user_id, date),
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);
INSERT INTO daily_totals (user_id,date,kcal_total,protein_g_total,carbs_g_total,fat_g_total,workout_minutes,workout_volume)
SELECT user_id,
       CASE WHEN typeof(date)='integer'
            THEN strftime('%Y-%m-%d', date/1000, 'unixepoch')
            ELSE date END,
       kcal_total,protein_g_total,carbs_g_total,fat_g_total,workout_minutes,workout_volume
FROM daily_totals_old;
DROP TABLE daily_totals_old;

--------------- exercise ---------------
ALTER TABLE exercise RENAME TO exercise_old;
CREATE TABLE exercise (
  exercise_id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name           TEXT NOT NULL,
  description    TEXT,
  created_by     INTEGER,
  last_updated   TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  UNIQUE (created_by, name),
  FOREIGN KEY (created_by) REFERENCES user(user_id) ON DELETE SET NULL
);
INSERT INTO exercise (exercise_id,name,description,created_by,last_updated)
SELECT exercise_id,name,description,created_by,
       CASE WHEN typeof(last_updated)='integer'
            THEN strftime('%Y-%m-%d %H:%M:%S', last_updated/1000, 'unixepoch')
            ELSE last_updated END
FROM exercise_old;
DROP TABLE exercise_old;

--------------- workout_session ---------------
ALTER TABLE workout_session RENAME TO workout_session_old;
CREATE TABLE workout_session (
  session_id     INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER NOT NULL,
  date           TEXT    NOT NULL,  -- 'YYYY-MM-DD'
  start_time     TEXT,              -- 'HH:MM:SS'
  end_time       TEXT,
  notes          TEXT,
  last_updated   TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);
INSERT INTO workout_session (session_id,user_id,date,start_time,end_time,notes,last_updated)
SELECT session_id,user_id,
       CASE WHEN typeof(date)='integer'
            THEN strftime('%Y-%m-%d', date/1000, 'unixepoch')
            ELSE date END,
       start_time,end_time,notes,
       CASE WHEN typeof(last_updated)='integer'
            THEN strftime('%Y-%m-%d %H:%M:%S', last_updated/1000, 'unixepoch')
            ELSE last_updated END
FROM workout_session_old;
DROP TABLE workout_session_old;

--------------- routine ---------------
ALTER TABLE routine RENAME TO routine_old;
CREATE TABLE routine (
  routine_id     INTEGER PRIMARY KEY AUTOINCREMENT,
  created_by     INTEGER NOT NULL,
  name           TEXT NOT NULL,
  notes          TEXT,
  last_updated   TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (created_by) REFERENCES user(user_id) ON DELETE CASCADE
);
INSERT INTO routine (routine_id,created_by,name,notes,last_updated)
SELECT routine_id,created_by,name,notes,
       CASE WHEN typeof(last_updated)='integer'
            THEN strftime('%Y-%m-%d %H:%M:%S', last_updated/1000, 'unixepoch')
            ELSE last_updated END
FROM routine_old;
DROP TABLE routine_old;

--------------- food_item ---------------
ALTER TABLE food_item RENAME TO food_item_old;
CREATE TABLE food_item (
  food_id        INTEGER PRIMARY KEY AUTOINCREMENT,
  source         TEXT    NOT NULL CHECK (source IN ('API','CUSTOM')),
  external_ref   TEXT,
  created_by     INTEGER,
  name           TEXT    NOT NULL,
  brand          TEXT,
  serving_unit   TEXT    NOT NULL,
  kcal           REAL    CHECK (kcal >= 0),
  protein_g      REAL    CHECK (protein_g >= 0),
  carbs_g        REAL    CHECK (carbs_g >= 0),
  fat_g          REAL    CHECK (fat_g >= 0),
  created_at     TEXT    NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  UNIQUE (source, external_ref),
  FOREIGN KEY (created_by) REFERENCES user(user_id) ON DELETE SET NULL
);
INSERT INTO food_item (food_id,source,external_ref,created_by,name,brand,serving_unit,
                       kcal,protein_g,carbs_g,fat_g,created_at)
SELECT food_id,source,external_ref,created_by,name,brand,serving_unit,
       kcal,protein_g,carbs_g,fat_g,
       CASE WHEN typeof(created_at)='integer'
            THEN strftime('%Y-%m-%d %H:%M:%S', created_at/1000, 'unixepoch')
            ELSE created_at END
FROM food_item_old;
DROP TABLE food_item_old;

--------------- food_log ---------------
ALTER TABLE food_log RENAME TO food_log_old;
CREATE TABLE food_log (
  log_id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER NOT NULL,
  food_id        INTEGER NOT NULL,
  log_date       TEXT    NOT NULL,  -- 'YYYY-MM-DD'
  meal_type      TEXT    CHECK (meal_type IN ('BREAKFAST','LUNCH','DINNER','SNACK')),
  serving_qty    REAL    NOT NULL CHECK (serving_qty > 0),
  kcal_snapshot      REAL NOT NULL CHECK (kcal_snapshot >= 0),
  protein_g_snapshot REAL NOT NULL CHECK (protein_g_snapshot >= 0),
  carbs_g_snapshot   REAL NOT NULL CHECK (carbs_g_snapshot >= 0),
  fat_g_snapshot     REAL NOT NULL CHECK (fat_g_snapshot >= 0),
  note           TEXT,
  created_at     TEXT    NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at     TEXT    NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (user_id) REFERENCES user(user_id)   ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES food_item(food_id) ON DELETE RESTRICT
);
INSERT INTO food_log (log_id,user_id,food_id,log_date,meal_type,serving_qty,
                      kcal_snapshot,protein_g_snapshot,carbs_g_snapshot,fat_g_snapshot,
                      note,created_at,updated_at)
SELECT log_id,user_id,food_id,
       CASE WHEN typeof(log_date)='integer'
            THEN strftime('%Y-%m-%d', log_date/1000, 'unixepoch')
            ELSE log_date END,
       meal_type,serving_qty,kcal_snapshot,protein_g_snapshot,carbs_g_snapshot,fat_g_snapshot,
       note,
       CASE WHEN typeof(created_at)='integer'
            THEN strftime('%Y-%m-%d %H:%M:%S', created_at/1000, 'unixepoch')
            ELSE created_at END,
       CASE WHEN typeof(updated_at)='integer'
            THEN strftime('%Y-%m-%d %H:%M:%S', updated_at/1000, 'unixepoch')
            ELSE updated_at END
FROM food_log_old;
DROP TABLE food_log_old;

--------------- recipe ---------------
ALTER TABLE recipe RENAME TO recipe_old;
CREATE TABLE recipe (
  recipe_id      INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER NOT NULL,
  name           TEXT NOT NULL,
  notes          TEXT,
  last_updated   TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  UNIQUE (user_id, name)
);
INSERT INTO recipe (recipe_id,user_id,name,notes,last_updated)
SELECT recipe_id,user_id,name,notes,
       CASE WHEN typeof(last_updated)='integer'
            THEN strftime('%Y-%m-%d %H:%M:%S', last_updated/1000, 'unixepoch')
            ELSE last_updated END
FROM recipe_old;
DROP TABLE recipe_old;

--------------- goal ---------------
ALTER TABLE goal RENAME TO goal_old;
CREATE TABLE goal (
  goal_id        INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER NOT NULL,
  type           TEXT NOT NULL CHECK (type IN ('WEIGHT_KG','BMI','WORKOUTS_PER_WEEK','CALORIES_KCAL')),
  frequency      TEXT NOT NULL CHECK (frequency IN ('daily','weekly','custom_range')),
  target_value   REAL NOT NULL,
  start_date     TEXT NOT NULL,  -- 'YYYY-MM-DD'
  end_date       TEXT,
  status         TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','done')),
  achieved       BOOLEAN NOT NULL DEFAULT FALSE,
  last_updated   TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);
INSERT INTO goal (goal_id,user_id,type,frequency,target_value,start_date,end_date,status,achieved,last_updated)
SELECT goal_id,user_id,type,frequency,target_value,
       CASE WHEN typeof(start_date)='integer'
            THEN strftime('%Y-%m-%d', start_date/1000, 'unixepoch')
            ELSE start_date END,
       CASE WHEN typeof(end_date)='integer'
            THEN strftime('%Y-%m-%d', end_date/1000, 'unixepoch')
            ELSE end_date END,
       status,achieved,
       CASE WHEN typeof(last_updated)='integer'
            THEN strftime('%Y-%m-%d %H:%M:%S', last_updated/1000, 'unixepoch')
            ELSE last_updated END
FROM goal_old;
DROP TABLE goal_old;

-- Indexes that mentioned DATE/TIMESTAMP columns remain valid
CREATE INDEX IF NOT EXISTS idx_session_user_date ON workout_session(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_foodlog_user_date ON food_log(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_exercise_name ON exercise(name);
CREATE INDEX IF NOT EXISTS idx_sx_session_order ON session_exercise(session_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_ss_exercise_order ON session_set(session_exercise_id, set_order);
CREATE INDEX IF NOT EXISTS idx_rx_routine_order ON routine_exercise(routine_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_recipeitem_recipe ON recipe_item(recipe_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_goal_user ON goal(user_id, status);
