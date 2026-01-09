-- ============================================
-- BUYERS TABLE - SUPABASE SCHEMA
-- ============================================
-- 
-- This table stores buyer/customer profiles for reuse across invoices
-- Mirrors the companies table structure
-- ============================================

-- Create buyers table
CREATE TABLE IF NOT EXISTS buyers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Required fields
  buyer_name TEXT NOT NULL,
  address TEXT NOT NULL,
  
  -- Optional fields
  gst_number TEXT,
  phone TEXT,
  email TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_buyers_buyer_name ON buyers(buyer_name);
CREATE INDEX IF NOT EXISTS idx_buyers_created_at ON buyers(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow read buyers" ON buyers 
FOR SELECT 
USING (true);

-- Allow anonymous insert
CREATE POLICY "Allow insert buyers" ON buyers 
FOR INSERT 
WITH CHECK (true);

-- Allow anonymous update
CREATE POLICY "Allow update buyers" ON buyers 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- Allow anonymous delete
CREATE POLICY "Allow delete buyers" ON buyers 
FOR DELETE 
USING (true);

-- ============================================
-- AUTO-UPDATE TIMESTAMP TRIGGER
-- ============================================

-- Create trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to buyers table
CREATE TRIGGER update_buyers_updated_at 
BEFORE UPDATE ON buyers
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- UPDATE QUOTATIONS TABLE
-- ============================================

-- Add buyer_id foreign key to quotations table
ALTER TABLE quotations 
ADD COLUMN IF NOT EXISTS buyer_id UUID REFERENCES buyers(id) ON DELETE SET NULL;

-- Create index for buyer_id lookups
CREATE INDEX IF NOT EXISTS idx_quotations_buyer_id ON quotations(buyer_id);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'buyers'
ORDER BY ordinal_position;

-- Test insert
-- INSERT INTO buyers (buyer_name, address, gst_number, phone, email)
-- VALUES ('Test Buyer', '123 Test St', '29ABCDE1234F1Z5', '+91 9876543210', 'test@buyer.com');

-- View all buyers
-- SELECT * FROM buyers ORDER BY created_at DESC;
