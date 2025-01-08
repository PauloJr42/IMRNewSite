/*
  # Add INSERT policy for users table

  1. Changes
    - Add INSERT policy to allow authenticated users to insert their own data
*/

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (id::text = auth.uid()::text);