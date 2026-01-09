-- ============================================
-- SIMPLE SUPABASE SETUP - COPY AND RUN THIS
-- ============================================
-- Instructions:
-- 1. Go to https://supabase.com/dashboard
-- 2. Select project: oqhgwbezsijvuhegjiqm
-- 3. Click "SQL Editor" in left sidebar
-- 4. Copy this ENTIRE file
-- 5. Paste into SQL Editor
-- 6. Click RUN
-- ============================================

-- Create companies table
CREATE TABLE companies (
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

-- Create quotations table
CREATE TABLE quotations (
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
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read companies
CREATE POLICY "Allow read companies"
ON companies FOR SELECT
USING (true);

-- Allow everyone to insert companies
CREATE POLICY "Allow insert companies"
ON companies FOR INSERT
WITH CHECK (true);

-- Allow everyone to update companies
CREATE POLICY "Allow update companies"
ON companies FOR UPDATE
USING (true) WITH CHECK (true);

-- Allow everyone to delete companies
CREATE POLICY "Allow delete companies"
ON companies FOR DELETE
USING (true);

-- Allow everyone to read quotations
CREATE POLICY "Allow read quotations"
ON quotations FOR SELECT
USING (true);

-- Allow everyone to insert quotations
CREATE POLICY "Allow insert quotations"
ON quotations FOR INSERT
WITH CHECK (true);

-- Allow everyone to update quotations
CREATE POLICY "Allow update quotations"
ON quotations FOR UPDATE
USING (true) WITH CHECK (true);

-- Allow everyone to delete quotations
CREATE POLICY "Allow delete quotations"
ON quotations FOR DELETE
USING (true);

-- Create indexes
CREATE INDEX idx_companies_company_name ON companies(company_name);
CREATE INDEX idx_quotations_company_id ON quotations(company_id);

-- Verify tables created
SELECT 'SUCCESS! Tables created:' as message;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('companies', 'quotations');
