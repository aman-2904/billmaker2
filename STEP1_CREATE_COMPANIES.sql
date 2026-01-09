-- ============================================
-- STEP 1: CREATE COMPANIES TABLE ONLY
-- Run this first, then check if it works
-- ============================================

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

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Allow everyone to do everything (for testing)
CREATE POLICY "Allow all on companies"
ON companies
FOR ALL
USING (true)
WITH CHECK (true);

-- Verify it worked
SELECT 'Companies table created!' as status;
SELECT * FROM companies;
