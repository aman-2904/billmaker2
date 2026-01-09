# Supabase Integration - Setup Guide

## 🚀 Quick Start

Your React Invoice Maker now has full Supabase integration for company profiles and quotation management!

## 📋 Setup Steps

### 1. Run SQL Scripts in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `oqhgwbezsijvuhegjiqm`
3. Navigate to **SQL Editor** (left sidebar)
4. Open the file: `supabase-setup.sql` (in project root)
5. Copy and paste the entire SQL script
6. Click **Run** to create the tables

**What this creates:**
- `companies` table (stores company profiles)
- `quotations` table (stores invoices/quotations)
- Row Level Security policies (allows anonymous access)
- Indexes for performance
- Auto-update triggers

### 2. Verify Tables Created

Run this query in SQL Editor:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('companies', 'quotations');
```

You should see both tables listed.

### 3. Start the Application

```bash
cd "d:/INVOICE MAKER/react-invoice-maker"
npm run dev
```

The app will open at: `http://localhost:5173`

## ✨ New Features

### 1. Company Profile Management

**Save Company Once, Reuse Forever:**
- Click "Manage Companies" to add your company profile
- Fill in: Company Name, Address, Phone, GST, PAN, Email, Tagline
- Save the company
- Next time, just select from dropdown - all fields auto-fill!

**CRUD Operations:**
- ✅ Create new company
- ✅ Edit existing company
- ✅ Delete company
- ✅ Select company to auto-fill form

### 2. Quotation Management

**Save & Edit Quotations:**
- Fill out an invoice/quotation
- Click "💾 Save Quotation" to save to database
- Click "📋 View Saved Quotations" to see all saved quotations

**Quotation Actions:**
- ✏️ **Edit**: Load quotation back into form for editing
- 📋 **Duplicate**: Create a copy with new quotation number
- ✓ **Convert to Invoice**: Change status from quotation to invoice
- 🗑️ **Delete**: Remove quotation from database

### 3. Auto-Generated Quotation Numbers

Format: `QT-YYMM-###`
- Example: `QT-2601-001` (January 2026, quotation #1)
- Automatically increments
- Unique constraint prevents duplicates

## 🎨 UI Features

### Company Selector
- Appears at top of form
- Dropdown to select saved companies
- "Manage Companies" button opens modal
- Auto-fills all seller fields on selection

### Company Manager Modal
- Grid view of all saved companies
- Click "Edit" to modify company details
- Click "Delete" to remove (with confirmation)
- "+ New Company" button to add more

### Quotation List Modal
- Table view of all quotations
- Columns: Quotation No, Company, Customer, Date, Amount, Status
- Color-coded status badges (Quotation/Invoice)
- Action buttons for each quotation

## 🔧 Configuration

### Supabase Connection

The Supabase client is already configured in `src/services/supabase.js`:

```javascript
const SUPABASE_URL = 'https://oqhgwbezsijvuhegjiqm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGci...'; // Already set
```

**The anon key is already included** - no changes needed!

### Test Connection

Open browser console and run:

```javascript
import { testConnection } from './services/supabase';
await testConnection();
```

Should log: `✅ Supabase connection successful`

## 📁 File Structure

```
src/
├── components/
│   ├── CompanySelector.jsx       [NEW] - Company dropdown
│   ├── CompanyManager.jsx         [NEW] - Company CRUD modal
│   ├── QuotationList.jsx          [NEW] - Quotations table
│   ├── InvoiceForm.jsx            [UPDATED] - Added quotation buttons
│   ├── ItemRow.jsx
│   └── InvoicePreview.jsx
├── services/
│   ├── supabase.js                [NEW] - Supabase client
│   ├── companyService.js          [NEW] - Company operations
│   └── quotationService.js        [NEW] - Quotation operations
├── utils/
│   ├── gstCalculation.js
│   └── numberToWords.js
├── styles/
│   ├── form.css                   [UPDATED] - Added modal styles
│   └── invoice.css
├── App.jsx                        [UPDATED] - Integrated Supabase
└── main.jsx
```

## 🧪 Testing Workflow

### Test 1: Company Management

1. Open app at `http://localhost:5173`
2. Click "Manage Companies"
3. Click "+ New Company"
4. Fill in company details:
   - Company Name: "Test Company Ltd"
   - Address: "123 Test Street"
   - Phone: "+91 9876543210"
   - GST: "07BBLPM8057J1Z3"
   - Email: "test@company.com"
5. Click "Save Company"
6. Close modal
7. Select company from dropdown
8. ✅ Verify all seller fields auto-filled

### Test 2: Save Quotation

1. Fill in buyer details
2. Add invoice items
3. Enter invoice number: "TEST-001"
4. Click "💾 Save Quotation"
5. ✅ Should see success message
6. Click "📋 View Saved Quotations"
7. ✅ Verify quotation appears in table

### Test 3: Edit Quotation

1. Click "📋 View Saved Quotations"
2. Click ✏️ (Edit) on a quotation
3. ✅ Form should load with quotation data
4. Make changes
5. Click "💾 Update Quotation"
6. ✅ Changes should be saved

### Test 4: PDF Generation

1. Fill out complete invoice
2. Click "Generate Invoice PDF"
3. ✅ PDF should download with correct filename
4. ✅ PDF should match original layout

## 🔐 Security Notes

**Current Setup (Development):**
- Using anonymous access with RLS policies
- Anyone can read/write to tables
- **Perfect for testing and demos**

**For Production:**
You should:
1. Enable Supabase Authentication
2. Update RLS policies to check `auth.uid()`
3. Add user_id column to tables
4. Filter queries by authenticated user

Example production policy:
```sql
CREATE POLICY "Users can only see their own companies" ON companies
  FOR SELECT USING (auth.uid() = user_id);
```

## 🎯 Key Benefits

✅ **Save Time**: Company details entered once, reused forever
✅ **Data Persistence**: All quotations saved to cloud database
✅ **Easy Editing**: Load and modify saved quotations
✅ **Professional**: Feels like a real SaaS product
✅ **No Backend**: Everything runs in browser with Supabase
✅ **Apple-Style UI**: Beautiful, modern design maintained

## 🐛 Troubleshooting

### Issue: "Failed to load companies"

**Solution:**
1. Check Supabase dashboard is accessible
2. Verify tables exist (run verification query)
3. Check browser console for errors
4. Ensure RLS policies are enabled

### Issue: "Failed to save quotation"

**Solution:**
1. Verify all required fields are filled
2. Check quotation number is unique
3. Open browser console for detailed error
4. Verify Supabase connection

### Issue: Modal not opening

**Solution:**
1. Check browser console for errors
2. Verify CSS is loaded (check Network tab)
3. Try hard refresh (Ctrl+Shift+R)

## 📚 API Reference

### Company Service

```javascript
import { getCompanies, saveCompany, updateCompany, deleteCompany } from './services/companyService';

// Get all companies
const companies = await getCompanies();

// Save new company
const company = await saveCompany(formData);

// Update company
const updated = await updateCompany(id, formData);

// Delete company
await deleteCompany(id);
```

### Quotation Service

```javascript
import { 
  getQuotations, 
  saveQuotation, 
  updateQuotation, 
  deleteQuotation,
  duplicateQuotation,
  convertToInvoice,
  generateQuotationNumber
} from './services/quotationService';

// Get all quotations
const quotations = await getQuotations();

// Save quotation
const saved = await saveQuotation(quotationData);

// Update quotation
const updated = await updateQuotation(id, quotationData);

// Duplicate quotation
const newNo = await generateQuotationNumber();
const duplicate = await duplicateQuotation(id, newNo);

// Convert to invoice
const invoice = await convertToInvoice(id);
```

## 🎉 You're All Set!

Your React Invoice Maker is now a full-featured SaaS application with:
- ✅ Company profile management
- ✅ Quotation save/edit/duplicate
- ✅ Cloud data persistence
- ✅ Professional UI/UX
- ✅ PDF generation (unchanged)

**Start creating invoices with superpowers!** 🚀
