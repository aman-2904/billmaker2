-- ============================================
-- SUPABASE DATABASE SETUP
-- GST Invoice Maker - Company & Quotation Management
-- ============================================

-- ============================================
-- TABLE 1: companies
-- Stores company profile information
-- ============================================

CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  gst_number TEXT NOT NULL,
  pan_number TEXT,
  email TEXT NOT NULL,
  tagline TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access (for demo/testing purposes)
-- In production, replace with proper authentication policies
CREATE POLICY "Allow anonymous access to companies" ON companies
  FOR ALL USING (true);

-- Create index for faster company name searches
CREATE INDEX IF NOT EXISTS idx_companies_company_name ON companies(company_name);

-- Create index for faster queries by creation date
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at DESC);

-- ============================================
-- TABLE 2: quotations
-- Stores invoice/quotation data
-- ============================================

CREATE TABLE IF NOT EXISTS quotations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_no TEXT NOT NULL UNIQUE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  buyer_name TEXT NOT NULL,
  buyer_address TEXT NOT NULL,
  buyer_gst TEXT,
  invoice_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  gst_rate NUMERIC DEFAULT 18,
  total_before_tax NUMERIC NOT NULL DEFAULT 0,
  total_gst NUMERIC NOT NULL DEFAULT 0,
  total_after_tax NUMERIC NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'quotation' CHECK (status IN ('quotation', 'invoice')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access
CREATE POLICY "Allow anonymous access to quotations" ON quotations
  FOR ALL USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_quotations_company_id ON quotations(company_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON quotations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotations_quotation_no ON quotations(quotation_no);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to auto-update updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON quotations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('companies', 'quotations');

-- Check RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('companies', 'quotations');

-- ============================================
-- SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================

-- Insert sample company
-- INSERT INTO companies (company_name, address, phone, gst_number, email, tagline)
-- VALUES (
--   'Sample Company Ltd',
--   '123 Business Street, City, State - 123456',
--   '+91 9876543210',
--   '07BBLPM8057J1Z3',
--   'contact@samplecompany.com',
--   'Your Trusted Business Partner'
-- );

-- ============================================
-- CLEANUP (USE WITH CAUTION)
-- ============================================

-- To drop tables (WARNING: This will delete all data)
-- DROP TABLE IF EXISTS quotations CASCADE;
-- DROP TABLE IF EXISTS companies CASCADE;
-- DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
