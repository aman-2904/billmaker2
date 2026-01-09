import { supabase } from './supabase';

/**
 * Get all companies from database
 * @returns {Promise<Array>} Array of company objects
 */
export async function getCompanies() {
    try {
        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .order('company_name');

        if (error) {
            console.error('❌ Supabase Error - Get Companies:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            throw error;
        }

        console.log('✅ Successfully loaded companies:', data?.length || 0);
        return data || [];
    } catch (error) {
        console.error('❌ Error fetching companies:', error);
        throw error;
    }
}

/**
 * Get a single company by ID
 * @param {string} id - Company UUID
 * @returns {Promise<Object>} Company object
 */
export async function getCompany(id) {
    try {
        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching company:', error);
        throw error;
    }
}

/**
 * Upload logo to Supabase Storage
 * @param {File} file - The file object to upload
 * @returns {Promise<string>} Public URL of the uploaded file
 */
export async function uploadLogo(file) {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
            .from('company-logos')
            .upload(filePath, file);

        if (error) {
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('company-logos')
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading logo:', error);
        throw error;
    }
}

/**
 * Upload signature to Supabase Storage
 * @param {File} file - The file object to upload
 * @returns {Promise<string>} Public URL of the uploaded file
 */
export async function uploadSignature(file) {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `sig_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
            .from('company-logos')
            .upload(filePath, file);

        if (error) {
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('company-logos')
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading signature:', error);
        throw error;
    }
}


/**
 * Save a new company to database
 * @param {Object} companyData - Company form data
 * @returns {Promise<Object>} Created company object
 */
export async function saveCompany(companyData) {
    try {
        const { data, error } = await supabase
            .from('companies')
            .insert([{
                company_name: companyData.sellerName,
                address: companyData.sellerAddress,
                phone: companyData.sellerPhone,
                gst_number: companyData.sellerGST,
                pan_number: companyData.sellerPAN || null,
                email: companyData.sellerEmail,
                tagline: companyData.sellerTagline || null,
                tagline: companyData.sellerTagline || null,
                logo_url: companyData.logoUrl || null,
                signature_url: companyData.signatureUrl || null
            }])
            .select()
            .single();

        if (error) {
            console.error('❌ Supabase Error - Save Company:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            throw error;
        }

        console.log('✅ Company saved successfully:', data);
        return data;
    } catch (error) {
        console.error('❌ Error saving company:', error);
        throw error;
    }
}

/**
 * Update an existing company
 * @param {string} id - Company UUID
 * @param {Object} companyData - Updated company data
 * @returns {Promise<Object>} Updated company object
 */
export async function updateCompany(id, companyData) {
    try {
        const { data, error } = await supabase
            .from('companies')
            .update({
                company_name: companyData.sellerName,
                address: companyData.sellerAddress,
                phone: companyData.sellerPhone,
                gst_number: companyData.sellerGST,
                pan_number: companyData.sellerPAN || null,
                email: companyData.sellerEmail,
                tagline: companyData.sellerTagline || null,
                tagline: companyData.sellerTagline || null,
                logo_url: companyData.logoUrl || null,
                signature_url: companyData.signatureUrl || null
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating company:', error);
        throw error;
    }
}

/**
 * Delete a company
 * @param {string} id - Company UUID
 * @returns {Promise<void>}
 */
export async function deleteCompany(id) {
    try {
        const { error } = await supabase
            .from('companies')
            .delete()
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting company:', error);
        throw error;
    }
}
