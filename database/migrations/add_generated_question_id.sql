-- Migration: Add generated_question_id column to ideas table
-- Run this in your Supabase SQL Editor if the column doesn't exist

-- Check if column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'ideas' 
        AND column_name = 'generated_question_id'
    ) THEN
        ALTER TABLE ideas 
        ADD COLUMN generated_question_id uuid;
        
        -- Add comment for documentation
        COMMENT ON COLUMN ideas.generated_question_id IS 'Reference to the question ID that was generated from this idea';
    END IF;
END $$;

