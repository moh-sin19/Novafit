-- Remove duplicate entries, keeping only the most recent one per user per day
DELETE FROM weight_entry 
WHERE id NOT IN (
    SELECT MAX(id) 
    FROM weight_entry 
    GROUP BY user_id, date_recorded
);

-- Create unique index to prevent future duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_weight_user_date_unique 
ON weight_entry(user_id, date_recorded);
