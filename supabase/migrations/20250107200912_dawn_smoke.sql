/*
  # Create users table for storing additional user data

  1. New Tables
    - `users`
      - `id` (uuid, primary key, matches auth.users.id)
      - `email` (text, unique)
      - `phone` (text)
      - `first_name` (text)
      - `last_name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on users table
    - Add policies for authenticated users to read/update their own data
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  phone text,
  first_name text,
  last_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (id::text = auth.uid()::text);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (id::text = auth.uid()::text);