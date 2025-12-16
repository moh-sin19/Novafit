-- ============================================================
-- V4__food_serving_refactor.sql
-- Refactor food tables to support multiple servings per item
-- (SQLite-safe, rebuilds dependent tables' FKs)
-- ============================================================

-- ------------------------------------------------------------
-- 1) Rename the old food_item so we can copy from it
-- ------------------------------------------------------------
ALTER TABLE food_item RENAME TO food_item_old;

-- ------------------------------------------------------------
-- 2) Create NEW food_item (no macro columns)
-- ------------------------------------------------------------
CREATE TABLE food_item (
  food_id        INTEGER PRIMARY KEY AUTOINCREMENT,
  source         TEXT    NOT NULL CHECK (source IN ('API','CUSTOM')),
  external_ref   TEXT,
  created_by     INTEGER,
  name           TEXT    NOT NULL,
  brand          TEXT,
  details_url    TEXT,
  created_at     TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  UNIQUE (source, external_ref),
  FOREIGN KEY (created_by) REFERENCES user(user_id) ON DELETE SET NULL
);

INSERT INTO food_item (food_id, source, external_ref, created_by, name, brand, details_url, created_at)
SELECT food_id, source, external_ref, created_by, name, brand, NULL, created_at
FROM food_item_old;

CREATE INDEX IF NOT EXISTS idx_food_name ON food_item(name);

-- ------------------------------------------------------------
-- 3) Create food_serving (per-item servings with macros)
-- ------------------------------------------------------------
CREATE TABLE food_serving (
  serving_id          INTEGER PRIMARY KEY AUTOINCREMENT,
  food_id             INTEGER NOT NULL,
  external_serving_id TEXT,
  label               TEXT NOT NULL,
  units               REAL,
  metric_qty          REAL,
  metric_unit         TEXT,
  kcal                REAL,
  protein_g           REAL,
  carbs_g             REAL,
  fat_g               REAL,
  created_at          TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  UNIQUE (food_id, label),
  UNIQUE (food_id, external_serving_id),
  FOREIGN KEY (food_id) REFERENCES food_item(food_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_serving_food ON food_serving(food_id);

-- ------------------------------------------------------------
-- 4) OPTIONAL migration: seed a default serving from legacy macros
--     (works only if legacy columns existed in food_item_old)
-- ------------------------------------------------------------
INSERT INTO food_serving (food_id, label, units, metric_qty, metric_unit, kcal, protein_g, carbs_g, fat_g)
SELECT food_id, 'Default (100 g)', 1.0, 100.0, 'g',
       kcal, protein_g, carbs_g, fat_g
FROM food_item_old
WHERE source = 'CUSTOM'
  AND EXISTS(SELECT 1)              -- keep SQLite parser happy
  AND (kcal IS NOT NULL OR protein_g IS NOT NULL OR carbs_g IS NOT NULL OR fat_g IS NOT NULL);

-- ------------------------------------------------------------
-- 5) Rebuild tables that reference food_item so their FKs point
--    to the NEW food_item (not food_item_old after rename)
-- ------------------------------------------------------------

-- 5a) food_log  (also add serving_id / serving_type)
ALTER TABLE food_log RENAME TO food_log__bak_v4;

CREATE TABLE food_log (
  log_id              INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id             INTEGER NOT NULL,
  food_id             INTEGER NOT NULL,
  log_date            TEXT    NOT NULL,  -- 'YYYY-MM-DD'
  meal_type           TEXT    CHECK (meal_type IN ('BREAKFAST','LUNCH','DINNER','SNACK')),
  serving_qty         REAL    NOT NULL CHECK (serving_qty > 0),
  -- snapshots
  kcal_snapshot       REAL    NOT NULL CHECK (kcal_snapshot >= 0),
  protein_g_snapshot  REAL    NOT NULL CHECK (protein_g_snapshot >= 0),
  carbs_g_snapshot    REAL    NOT NULL CHECK (carbs_g_snapshot >= 0),
  fat_g_snapshot      REAL    NOT NULL CHECK (fat_g_snapshot >= 0),
  note                TEXT,
  created_at          TEXT    NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at          TEXT    NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  -- new in V4
  serving_id          INTEGER,
  serving_type        TEXT,
  FOREIGN KEY (user_id)    REFERENCES user(user_id)         ON DELETE CASCADE,
  FOREIGN KEY (food_id)    REFERENCES food_item(food_id)    ON DELETE RESTRICT,
  FOREIGN KEY (serving_id) REFERENCES food_serving(serving_id)
);

INSERT INTO food_log (
  log_id,user_id,food_id,log_date,meal_type,serving_qty,
  kcal_snapshot,protein_g_snapshot,carbs_g_snapshot,fat_g_snapshot,
  note,created_at,updated_at,serving_id,serving_type
)
SELECT
  log_id,user_id,food_id,log_date,meal_type,serving_qty,
  kcal_snapshot,protein_g_snapshot,carbs_g_snapshot,fat_g_snapshot,
  note,created_at,updated_at,
  NULL,       -- serving_id didn't exist before
  NULL        -- serving_type didn't exist before
FROM food_log__bak_v4;

DROP TABLE food_log__bak_v4;

CREATE INDEX IF NOT EXISTS idx_foodlog_user_date ON food_log(user_id, log_date);


-- 5b) user_favourite_food
ALTER TABLE user_favourite_food RENAME TO user_favourite_food__bak_v4;

CREATE TABLE user_favourite_food (
  user_id    INTEGER NOT NULL,
  food_id    INTEGER NOT NULL,
  created_at TEXT    NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  PRIMARY KEY (user_id, food_id),
  FOREIGN KEY (user_id) REFERENCES user(user_id)      ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES food_item(food_id) ON DELETE CASCADE
);

INSERT INTO user_favourite_food (user_id, food_id, created_at)
SELECT user_id, food_id, created_at
FROM user_favourite_food__bak_v4;

DROP TABLE user_favourite_food__bak_v4;

CREATE INDEX IF NOT EXISTS idx_user_favourite_user ON user_favourite_food(user_id);


-- 5c) recipe_item
ALTER TABLE recipe_item RENAME TO recipe_item__bak_v4;

CREATE TABLE recipe_item (
  recipe_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id      INTEGER NOT NULL,
  food_id        INTEGER NOT NULL,
  quantity       REAL    NOT NULL CHECK (quantity > 0),
  sort_order     INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id)  ON DELETE CASCADE,
  FOREIGN KEY (food_id)   REFERENCES food_item(food_id) ON DELETE RESTRICT
);

INSERT INTO recipe_item (recipe_item_id, recipe_id, food_id, quantity, sort_order)
SELECT recipe_item_id, recipe_id, food_id, quantity, sort_order
FROM recipe_item__bak_v4;

DROP TABLE recipe_item__bak_v4;

CREATE INDEX IF NOT EXISTS idx_recipeitem_recipe ON recipe_item(recipe_id, sort_order);

-- ------------------------------------------------------------
-- 6) Drop the legacy food_item_old now that everything points
--    to the new food_item
-- ------------------------------------------------------------
DROP TABLE food_item_old;
