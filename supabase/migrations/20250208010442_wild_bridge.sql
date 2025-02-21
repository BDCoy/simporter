/*
  # Add Template Fields

  1. Changes
    - Add command field for storing template command (e.g. "/category")
    - Add color_theme field for UI theming
    - Add icon field for template icon
    - Add system_prompt field for AI instructions
    - Add response_template field for response formatting
*/

-- Add new fields to project_templates table
DO $$ BEGIN
  -- Add command field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'project_templates' AND column_name = 'command'
  ) THEN
    ALTER TABLE project_templates ADD COLUMN command text NOT NULL DEFAULT '/';
  END IF;

  -- Add color_theme field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'project_templates' AND column_name = 'color_theme'
  ) THEN
    ALTER TABLE project_templates ADD COLUMN color_theme text NOT NULL DEFAULT 'blue'
    CHECK (color_theme IN ('blue', 'emerald', 'purple', 'orange', 'red', 'indigo'));
  END IF;

  -- Add icon field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'project_templates' AND column_name = 'icon'
  ) THEN
    ALTER TABLE project_templates ADD COLUMN icon text NOT NULL DEFAULT 'MessageCircle';
  END IF;

  -- Add system_prompt field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'project_templates' AND column_name = 'system_prompt'
  ) THEN
    ALTER TABLE project_templates ADD COLUMN system_prompt text;
  END IF;

  -- Add response_template field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'project_templates' AND column_name = 'response_template'
  ) THEN
    ALTER TABLE project_templates ADD COLUMN response_template text;
  END IF;
END $$;

-- Create index for command lookup
CREATE INDEX IF NOT EXISTS project_templates_command_idx ON project_templates(command);

-- Add constraint for unique commands
ALTER TABLE project_templates ADD CONSTRAINT project_templates_command_unique UNIQUE (command);