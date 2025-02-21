/*
  # Add Status and Category to Projects Table

  1. Changes
    - Add status field with check constraint for 'all', 'active', 'archived'
    - Add category field with check constraint for project types
    - Add default values for both fields
*/

-- Add status field with check constraint
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'status'
  ) THEN
    ALTER TABLE projects ADD COLUMN status text NOT NULL DEFAULT 'active' 
    CHECK (status IN ('active', 'archived'));
  END IF;
END $$;

-- Add category field with check constraint
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'category'
  ) THEN
    ALTER TABLE projects ADD COLUMN category text NOT NULL DEFAULT 'Category Analysis'
    CHECK (category IN ('Category Analysis', 'Innovation', 'Trends', 'Consumer Profile', 'Competitive Landscape', 'Product Concept'));
  END IF;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS projects_status_category_idx ON projects(status, category);