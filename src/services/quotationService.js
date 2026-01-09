import { supabase } from './supabase';

/**
 * Get all quotations with company details
 * @returns {Promise<Array>} Array of quotation objects
 */
export async function getQuotations() {
    try {
        const { data, error } = await supabase
            .from('quotations')
            .select(`
        *,
        companies (
          company_name
        )
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching quotations:', error);
        throw error;
    }
}

/**
 * Get a single quotation by ID
 * @param {string} id - Quotation UUID
 * @returns {Promise<Object>} Quotation object
 */
export async function getQuotation(id) {
    try {
        const { data, error } = await supabase
            .from('quotations')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching quotation:', error);
        throw error;
    }
}

/**
 * Save a new quotation
 * @param {Object} quotationData - Quotation data
 * @returns {Promise<Object>} Created quotation object
 */
export async function saveQuotation(quotationData) {
    try {
        const { data, error } = await supabase
            .from('quotations')
            .insert([{
                quotation_no: quotationData.invoiceNumber,
                company_id: quotationData.companyId || null,
                buyer_name: quotationData.buyerName,
                buyer_address: quotationData.buyerAddress,
                buyer_gst: quotationData.buyerGST || null,
                invoice_details: quotationData.invoiceDetails,
                items: quotationData.items,
                gst_rate: quotationData.gstRate,
                total_before_tax: quotationData.totals.totalBeforeTax,
                total_gst: quotationData.totals.totalGST,
                total_after_tax: quotationData.totals.totalAfterTax,
                status: quotationData.status || 'quotation'
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error saving quotation:', error);
        throw error;
    }
}

/**
 * Update an existing quotation
 * @param {string} id - Quotation UUID
 * @param {Object} quotationData - Updated quotation data
 * @returns {Promise<Object>} Updated quotation object
 */
export async function updateQuotation(id, quotationData) {
    try {
        const { data, error } = await supabase
            .from('quotations')
            .update({
                buyer_name: quotationData.buyerName,
                buyer_address: quotationData.buyerAddress,
                buyer_gst: quotationData.buyerGST || null,
                invoice_details: quotationData.invoiceDetails,
                items: quotationData.items,
                gst_rate: quotationData.gstRate,
                total_before_tax: quotationData.totals.totalBeforeTax,
                total_gst: quotationData.totals.totalGST,
                total_after_tax: quotationData.totals.totalAfterTax,
                status: quotationData.status
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating quotation:', error);
        throw error;
    }
}

/**
 * Delete a quotation
 * @param {string} id - Quotation UUID
 * @returns {Promise<void>}
 */
export async function deleteQuotation(id) {
    try {
        const { error } = await supabase
            .from('quotations')
            .delete()
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting quotation:', error);
        throw error;
    }
}

/**
 * Duplicate a quotation with a new quotation number
 * @param {string} id - Original quotation UUID
 * @param {string} newQuotationNo - New quotation number
 * @returns {Promise<Object>} New quotation object
 */
export async function duplicateQuotation(id, newQuotationNo) {
    try {
        // Fetch original quotation
        const { data: original, error: fetchError } = await supabase
            .from('quotations')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        // Create duplicate with new quotation number
        const { data, error } = await supabase
            .from('quotations')
            .insert([{
                quotation_no: newQuotationNo,
                company_id: original.company_id,
                buyer_name: original.buyer_name,
                buyer_address: original.buyer_address,
                buyer_gst: original.buyer_gst,
                invoice_details: original.invoice_details,
                items: original.items,
                gst_rate: original.gst_rate,
                total_before_tax: original.total_before_tax,
                total_gst: original.total_gst,
                total_after_tax: original.total_after_tax,
                status: 'quotation' // Always create as quotation
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error duplicating quotation:', error);
        throw error;
    }
}

/**
 * Convert quotation to invoice
 * @param {string} id - Quotation UUID
 * @returns {Promise<Object>} Updated quotation object
 */
export async function convertToInvoice(id) {
    try {
        const { data, error } = await supabase
            .from('quotations')
            .update({ status: 'invoice' })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error converting to invoice:', error);
        throw error;
    }
}

/**
 * Generate a unique quotation number
 * @returns {Promise<string>} Unique quotation number
 */
export async function generateQuotationNumber() {
    try {
        // Get the latest quotation number
        const { data, error } = await supabase
            .from('quotations')
            .select('quotation_no')
            .order('created_at', { ascending: false })
            .limit(1);

        if (error) throw error;

        // Generate new number
        const today = new Date();
        const year = today.getFullYear().toString().slice(-2);
        const month = String(today.getMonth() + 1).padStart(2, '0');

        if (data && data.length > 0) {
            // Extract number from last quotation
            const lastNo = data[0].quotation_no;
            const match = lastNo.match(/(\d+)$/);
            if (match) {
                const nextNum = parseInt(match[1]) + 1;
                return `QT-${year}${month}-${String(nextNum).padStart(3, '0')}`;
            }
        }

        // First quotation
        return `QT-${year}${month}-001`;
    } catch (error) {
        console.error('Error generating quotation number:', error);
        // Fallback to timestamp-based number
        return `QT-${Date.now()}`;
    }
}
