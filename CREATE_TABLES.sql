-- ============================================
-- STEP 1: CREATE SUPABASE TABLES
-- Copy and paste this ENTIRE script into Supabase SQL Editor
-- Then click RUN to create all tables and policies
-- ============================================

-- ============================================
-- CREATE COMPANIES TABLE
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

-- ============================================
-- CREATE QUOTATIONS TABLE
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

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE RLS POLICIES FOR COMPANIES
-- (Allow anonymous access for development)
-- ============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow read companies" ON companies;
DROP POLICY IF EXISTS "Allow insert companies" ON companies;
DROP POLICY IF EXISTS "Allow update companies" ON companies;
DROP POLICY IF EXISTS "Allow delete companies" ON companies;

-- Create new policies
CREATE POLICY "Allow read companies"
ON companies
FOR SELECT
USING (true);

CREATE POLICY "Allow insert companies"
ON companies
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow update companies"
ON companies
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow delete companies"
ON companies
FOR DELETE
USING (true);

-- ============================================
-- CREATE RLS POLICIES FOR QUOTATIONS
-- ============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow read quotations" ON quotations;
DROP POLICY IF EXISTS "Allow insert quotations" ON quotations;
DROP POLICY IF EXISTS "Allow update quotations" ON quotations;
DROP POLICY IF EXISTS "Allow delete quotations" ON quotations;

-- Create new policies
CREATE POLICY "Allow read quotations"
ON quotations
FOR SELECT
USING (true);

CREATE POLICY "Allow insert quotations"
ON quotations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow update quotations"
ON quotations
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow delete quotations"
ON quotations
FOR DELETE
USING (true);

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_companies_company_name ON companies(company_name);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotations_company_id ON quotations(company_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON quotations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotations_quotation_no ON quotations(quotation_no);

-- ============================================
-- CREATE AUTO-UPDATE TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if any
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
DROP TRIGGER IF EXISTS update_quotations_updated_at ON quotations;

-- Create triggers
CREATE TRIGGER update_companies_updated_at 
BEFORE UPDATE ON companies
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotations_updated_at 
BEFORE UPDATE ON quotations
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if tables were created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('companies', 'quotations');

-- Check RLS policies (should show 8 policies)
SELECT 
  tablename,
  policyname,
  cmd as operation
FROM pg_policies 
WHERE tablename IN ('companies', 'quotations')
ORDER BY tablename, policyname;

-- Check indexes
SELECT 
  tablename,
  indexname
FROM pg_indexes
WHERE tablename IN ('companies', 'quotations')
ORDER BY tablename, indexname;

-- ============================================
-- OPTIONAL: INSERT TEST DATA
-- ============================================

-- Uncomment to insert a test company:
/*
INSERT INTO companies (company_name, address, phone, gst_number, email, tagline)
VALUES (
  'My Test Company',
  '123 Business Street, City, State - 123456',
  '+91 9876543210',
  '07BBLPM8057J1Z3',
  'contact@testcompany.com',
  'Your Trusted Business Partner'
);
*/

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ SUCCESS! All tables and policies created successfully!';
  RAISE NOTICE '📊 Tables: companies, quotations';
  RAISE NOTICE '🔐 RLS Policies: 8 policies created';
  RAISE NOTICE '⚡ Indexes: 6 indexes created';
  RAISE NOTICE '🔄 Triggers: 2 auto-update triggers created';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Next Steps:';
  RAISE NOTICE '1. Check the verification queries above';
  RAISE NOTICE '2. Refresh your React app';
  RAISE NOTICE '3. Test adding a company';
END $$;
