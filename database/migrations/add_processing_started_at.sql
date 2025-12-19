-- Add processing_started_at column to ideas table
ALTER TABLE ideas
ADD COLUMN IF NOT EXISTS processing_started_at timestamptz;

-- Update status check constraint to include 'error' and 'duplicate' statuses
ALTER TABLE ideas
DROP CONSTRAINT IF EXISTS ideas_status_check;

ALTER TABLE ideas
ADD CONSTRAINT ideas_status_check 
CHECK (status IN ('pending','new','generated','processing','failed','draft_generated','approved','discarded','error','duplicate'));

