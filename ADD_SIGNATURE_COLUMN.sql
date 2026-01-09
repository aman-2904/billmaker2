-- Add signature_url column to companies table
ALTER TABLE companies
ADD COLUMN signature_url TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'companies';
