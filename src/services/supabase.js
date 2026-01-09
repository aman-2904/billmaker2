import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oqhgwbezsijvuhegjiqm.supabase.co';

// TODO: Replace with your actual Supabase anon key
// This is the public anonymous key - safe to use in frontend
// Get it from: Supabase Dashboard → Settings → API → anon public key
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xaGd3YmV6c2lqdnVoZWdqaXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4ODE1OTcsImV4cCI6MjA4MzQ1NzU5N30.4EeEQupZugFoXlqgXqJ1wd3Tc9Ye0kBJ8OyY-rO_HhU';

// Validate configuration
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Supabase configuration missing!');
    console.error('URL:', SUPABASE_URL);
    console.error('Key:', SUPABASE_ANON_KEY ? 'Present' : 'Missing');
}

console.log('🔧 Initializing Supabase client...');
console.log('📍 URL:', SUPABASE_URL);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test connection function
export async function testConnection() {
    try {
        console.log('🔄 Testing Supabase connection...');
        const { data, error } = await supabase.from('companies').select('count');

        if (error) {
            console.error('❌ Supabase connection test failed:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            throw error;
        }

        console.log('✅ Supabase connection successful');
        return true;
    } catch (error) {
        console.error('❌ Supabase connection failed:', error);
        return false;
    }
}

// Auto-test connection on load (only in development)
if (import.meta.env.DEV) {
    testConnection();
}
