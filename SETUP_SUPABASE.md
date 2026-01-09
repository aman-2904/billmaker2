# Supabase Setup - CRITICAL FIRST STEP

## ⚠️ IMPORTANT: Tables Must Be Created First

The "Failed to load companies" error appears because **the database tables don't exist yet**.

## 🔧 Quick Fix (5 minutes)

### Step 1: Go to Supabase Dashboard

1. Open: https://supabase.com/dashboard
2. Sign in to your account
3. Select project: `oqhgwbezsijvuhegjiqm`

### Step 2: Open SQL Editor

1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**

### Step 3: Run This SQL Script

Copy and paste the ENTIRE script below, then click **"Run"**:

```sql
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
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE RLS POLICIES (ALLOW ALL FOR TESTING)
-- ============================================

-- Companies: Allow all operations
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
USING (true);

CREATE POLICY "Allow delete companies"
ON companies
FOR DELETE
USING (true);

-- Quotations: Allow all operations
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
USING (true);

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

CREATE TRIGGER update_companies_updated_at 
BEFORE UPDATE ON companies
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotations_updated_at 
BEFORE UPDATE ON quotations
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();
```

### Step 4: Verify Tables Created

Run this verification query:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('companies', 'quotations');
```

**Expected Result:** You should see both `companies` and `quotations` listed.

### Step 5: Test the Application

1. Go back to your React app: `http://localhost:5175`
2. Refresh the page (F5)
3. The error should be gone!
4. Click "Manage Companies" → "+ New Company"
5. Add a test company
6. It should now appear in the dropdown!

## ✅ What This Script Does

1. **Creates `companies` table** - Stores company profiles
2. **Creates `quotations` table** - Stores invoices/quotations
3. **Enables RLS** - Row Level Security for data protection
4. **Creates policies** - Allows read/write access (for testing)
5. **Creates indexes** - Optimizes query performance
6. **Creates triggers** - Auto-updates `updated_at` timestamps

## 🔐 Security Note

**Current Setup (Development/Testing):**
- RLS policies allow **anyone** to read/write
- Perfect for testing and demos
- **NOT recommended for production**

**For Production:**
You should:
1. Enable Supabase Authentication
2. Update policies to check `auth.uid()`
3. Add `user_id` column to tables
4. Filter by authenticated user

Example production policy:
```sql
CREATE POLICY "Users see own companies" ON companies
  FOR SELECT USING (auth.uid() = user_id);
```

## 🐛 Troubleshooting

### Error: "relation 'companies' already exists"
**Solution:** Tables already created! Skip to Step 4.

### Error: "permission denied"
**Solution:** Check you're logged into the correct Supabase project.

### Error: "Failed to load companies" persists
**Solution:**
1. Check browser console (F12) for detailed error
2. Verify tables exist (run verification query)
3. Check RLS policies are created
4. Hard refresh browser (Ctrl+Shift+R)

### Companies still not loading
**Solution:**
1. Open browser console (F12)
2. Look for Supabase error messages
3. Check the error details
4. Ensure anon key is correct in `src/services/supabase.js`

## 📝 Anon Key Configuration

The anon key is already configured in `src/services/supabase.js`:

```javascript
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xaGd3YmV6c2lqdnVoZWdqaXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4ODE1OTcsImV4cCI6MjA4MzQ1NzU5N30.4EeEQupZugFoXlqgXqJ1wd3Tc9Ye0kBJ8OyY-rO_HhU';
```

✅ **No changes needed** - this is already correct!

## 🎯 After Setup

Once tables are created, you can:

1. **Save Company Profiles**
   - Click "Manage Companies"
   - Add company details
   - Save and reuse across invoices

2. **Save Quotations**
   - Fill out invoice
   - Click "💾 Save Quotation"
   - View/edit later

3. **Auto-Fill Forms**
   - Select company from dropdown
   - All seller fields populate automatically

## 🚀 Ready to Go!

After running the SQL script, your Invoice Maker will have:
- ✅ Cloud data persistence
- ✅ Company profile management
- ✅ Quotation save/edit features
- ✅ Professional SaaS experience

**Total setup time: ~5 minutes** 🎉
