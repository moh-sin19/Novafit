CREATE TABLE IF NOT EXISTS weight_entry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    weight REAL NOT NULL,
    date_recorded TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_weight_user_date ON weight_entry(user_id, date_recorded DESC);