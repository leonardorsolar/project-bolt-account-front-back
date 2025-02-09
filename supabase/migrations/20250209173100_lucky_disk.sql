/*
  # Banking System Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - Links to auth.users
      - `name` (text) - User's full name
      - `account_number` (text) - Unique bank account number
      - `agency` (text) - Bank agency number
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `accounts`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References profiles.id
      - `balance` (decimal) - Current balance
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `transactions`
      - `id` (uuid, primary key)
      - `account_id` (uuid) - References accounts.id
      - `type` (text) - Transaction type (deposit, withdrawal, transfer)
      - `amount` (decimal) - Transaction amount
      - `description` (text) - Transaction description
      - `destination_account_id` (uuid, nullable) - For transfers
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure balance updates with functions
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  account_number text UNIQUE NOT NULL,
  agency text NOT NULL DEFAULT '0001',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create accounts table
CREATE TABLE accounts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  balance decimal(10,2) NOT NULL DEFAULT 100.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT positive_balance CHECK (balance >= 0)
);

-- Create transactions table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id uuid REFERENCES accounts(id) NOT NULL,
  type text NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'transfer')),
  amount decimal(10,2) NOT NULL CHECK (amount > 0),
  description text NOT NULL,
  destination_account_id uuid REFERENCES accounts(id),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_transfer CHECK (
    (type = 'transfer' AND destination_account_id IS NOT NULL) OR
    (type != 'transfer' AND destination_account_id IS NULL)
  )
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Accounts policies
CREATE POLICY "Users can view their own accounts"
  ON accounts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    account_id IN (
      SELECT id FROM accounts WHERE user_id = auth.uid()
    )
  );

-- Functions for secure transactions
CREATE OR REPLACE FUNCTION process_deposit(
  p_account_id uuid,
  p_amount decimal
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_transaction_id uuid;
BEGIN
  -- Update account balance
  UPDATE accounts 
  SET balance = balance + p_amount,
      updated_at = now()
  WHERE id = p_account_id;

  -- Create transaction record
  INSERT INTO transactions (account_id, type, amount, description)
  VALUES (p_account_id, 'deposit', p_amount, 'Depósito')
  RETURNING id INTO v_transaction_id;

  RETURN v_transaction_id;
END;
$$;

CREATE OR REPLACE FUNCTION process_withdrawal(
  p_account_id uuid,
  p_amount decimal
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_transaction_id uuid;
  v_current_balance decimal;
BEGIN
  -- Get current balance
  SELECT balance INTO v_current_balance
  FROM accounts
  WHERE id = p_account_id;

  -- Check if sufficient balance
  IF v_current_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient funds';
  END IF;

  -- Update account balance
  UPDATE accounts 
  SET balance = balance - p_amount,
      updated_at = now()
  WHERE id = p_account_id;

  -- Create transaction record
  INSERT INTO transactions (account_id, type, amount, description)
  VALUES (p_account_id, 'withdrawal', p_amount, 'Saque')
  RETURNING id INTO v_transaction_id;

  RETURN v_transaction_id;
END;
$$;

CREATE OR REPLACE FUNCTION process_transfer(
  p_from_account_id uuid,
  p_to_account_id uuid,
  p_amount decimal
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_transaction_id uuid;
  v_current_balance decimal;
BEGIN
  -- Get current balance
  SELECT balance INTO v_current_balance
  FROM accounts
  WHERE id = p_from_account_id;

  -- Check if sufficient balance
  IF v_current_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient funds';
  END IF;

  -- Update source account
  UPDATE accounts 
  SET balance = balance - p_amount,
      updated_at = now()
  WHERE id = p_from_account_id;

  -- Update destination account
  UPDATE accounts 
  SET balance = balance + p_amount,
      updated_at = now()
  WHERE id = p_to_account_id;

  -- Create transaction record
  INSERT INTO transactions (
    account_id, 
    type, 
    amount, 
    description, 
    destination_account_id
  )
  VALUES (
    p_from_account_id, 
    'transfer', 
    p_amount, 
    'Transferência', 
    p_to_account_id
  )
  RETURNING id INTO v_transaction_id;

  RETURN v_transaction_id;
END;
$$;