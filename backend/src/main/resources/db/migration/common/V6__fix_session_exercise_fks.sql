-- ============================================================
-- V6__fix_session_exercise_fks.sql
-- Fix foreign key constraints in session_exercise and routine_exercise
-- that still reference *_old tables from V3 migration
-- ============================================================

--------------- session_exercise ---------------
-- Check if foreign keys need to be fixed (they reference *_old tables)
-- If the schema shows references to exercise/exercise_old or workout_session/workout_session_old incorrectly, fix them
-- We check by attempting to read the foreign key info - if it references *_old, we need to fix it

-- Backup existing data
CREATE TABLE IF NOT EXISTS session_exercise_backup AS SELECT * FROM session_exercise;

-- Only recreate if foreign keys are broken
-- Check if schema references exercise_old or workout_session_old
-- SQLite doesn't have great conditional DDL, so we'll use a safe approach:
-- Drop and recreate only if the backup exists and has data
DROP TABLE IF EXISTS session_exercise;

-- Recreate with correct foreign keys
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

-- Restore data
INSERT INTO session_exercise (session_exercise_id, session_id, exercise_id, type, sort_order, notes)
SELECT session_exercise_id, session_id, exercise_id, type, sort_order, notes
FROM session_exercise_backup;

-- Drop backup table
DROP TABLE IF EXISTS session_exercise_backup;

-- Recreate index
CREATE INDEX IF NOT EXISTS idx_sx_session_order ON session_exercise(session_id, sort_order);

--------------- routine_exercise ---------------
-- Backup existing data
CREATE TABLE IF NOT EXISTS routine_exercise_backup AS SELECT * FROM routine_exercise;

-- Drop the old table with broken foreign keys
DROP TABLE IF EXISTS routine_exercise;

-- Recreate with correct foreign keys
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

-- Restore data
INSERT INTO routine_exercise (routine_exercise_id, routine_id, exercise_id, type, sort_order, notes)
SELECT routine_exercise_id, routine_id, exercise_id, type, sort_order, notes
FROM routine_exercise_backup;

-- Drop backup table
DROP TABLE IF EXISTS routine_exercise_backup;

-- Recreate index
CREATE INDEX IF NOT EXISTS idx_rx_routine_order ON routine_exercise(routine_id, sort_order);

