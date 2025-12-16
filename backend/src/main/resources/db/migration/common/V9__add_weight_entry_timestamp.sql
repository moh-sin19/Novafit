-- Add timestamp column to track time of day for weight entries
ALTER TABLE weight_entry ADD COLUMN recorded_at TEXT;

-- Set default timestamp for existing entries (midnight)
UPDATE weight_entry SET recorded_at = date_recorded || 'T00:00:00' WHERE recorded_at IS NULL;

-- Remove the unique constraint since we now allow multiple entries per day
DROP INDEX IF EXISTS idx_weight_user_date_unique;

-- Create new index that includes timestamp
CREATE INDEX IF NOT EXISTS idx_weight_user_datetime ON weight_entry(user_id, date_recorded, recorded_at DESC);
 