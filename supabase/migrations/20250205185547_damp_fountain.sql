/*
  # Create messages table for chat history

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `content` (text)
      - `type` (text) - either 'user' or 'assistant'
      - `created_at` (timestamp)
      - `tokens_used` (integer) - only for assistant messages

  2. Security
    - Enable RLS on messages table
    - Add policies for users to:
      - Read their own messages
      - Create new messages
*/

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  content text NOT NULL,
  type text NOT NULL CHECK (type IN ('user', 'assistant')),
  created_at timestamptz DEFAULT now(),
  tokens_used integer
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX messages_user_id_created_at_idx ON messages(user_id, created_at);