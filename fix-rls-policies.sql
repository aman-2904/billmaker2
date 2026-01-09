-- ============================================
-- SUPABASE RLS POLICY FIX
-- Run this script in Supabase SQL Editor to fix
-- "Failed to load companies" error
-- ============================================

-- Step 1: Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policies (if any)
DROP POLICY IF EXISTS "Allow anonymous access to companies" ON companies;
DROP POLICY IF EXISTS "Allow anonymous access to quotations" ON quotations;
DROP POLICY IF EXISTS "Allow read companies" ON companies;
DROP POLICY IF EXISTS "Allow insert companies" ON companies;
DROP POLICY IF EXISTS "Allow update companies" ON companies;
DROP POLICY IF EXISTS "Allow delete companies" ON companies;
DROP POLICY IF EXISTS "Allow read quotations" ON quotations;
DROP POLICY IF EXISTS "Allow insert quotations" ON quotations;
DROP POLICY IF EXISTS "Allow update quotations" ON quotations;
DROP POLICY IF EXISTS "Allow delete quotations" ON quotations;

-- Step 3: Create new policies for companies table
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

-- Step 4: Create new policies for quotations table
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
-- VERIFICATION QUERIES
-- ============================================

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('companies', 'quotations');

-- Check RLS policies (should show 8 policies total)
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies 
WHERE tablename IN ('companies', 'quotations')
ORDER BY tablename, policyname;

-- Count companies (can be 0, that's okay)
SELECT COUNT(*) as company_count FROM companies;

-- ============================================
-- OPTIONAL: Insert test company
-- ============================================

-- Uncomment to insert a test company:
/*
INSERT INTO companies (company_name, address, phone, gst_number, email, tagline)
VALUES (
  'Test Company Ltd',
  '123 Test Street, Test City, TS - 123456',
  '+91 9876543210',
  '07BBLPM8057J1Z3',
  'test@company.com',
  'Your Trusted Business Partner'
);
*/

-- ============================================
-- SUCCESS!
-- ============================================
-- If all queries run successfully, your RLS policies are now fixed.
-- Refresh your React app and companies should load correctly!
