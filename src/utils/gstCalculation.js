export function calculateGST(amount, gstRate) {
    const gstAmount = (amount * gstRate) / 100;
    const totalAmount = amount + gstAmount;
    return {
        gstAmount: parseFloat(gstAmount.toFixed(2)),
        totalAmount: parseFloat(totalAmount.toFixed(2))
    };
}

export function calculateInvoiceTotals(items, gstRate, gstType) {
    let totalBeforeTax = 0;
    let totalGST = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;

    items.forEach(item => {
        const amount = parseFloat(item.amount) || 0;

        // Skip GST calculation if excludeGST is true or no gstType selected
        let gstAmount = 0;
        if (!item.excludeGST && gstType) {
            const result = calculateGST(amount, gstRate);
            gstAmount = result.gstAmount;

            if (gstType === 'CGST_SGST') {
                const halfTax = gstAmount / 2;
                totalCGST += halfTax;
                totalSGST += halfTax;
            } else if (gstType === 'IGST') {
                totalIGST += gstAmount;
            }
        }

        totalBeforeTax += amount;
        totalGST += gstAmount;
    });

    const totalAfterTax = totalBeforeTax + totalGST;

    return {
        totalBeforeTax: parseFloat(totalBeforeTax.toFixed(2)),
        totalGST: parseFloat(totalGST.toFixed(2)),
        totalCGST: parseFloat(totalCGST.toFixed(2)),
        totalSGST: parseFloat(totalSGST.toFixed(2)),
        totalIGST: parseFloat(totalIGST.toFixed(2)),
        totalAfterTax: parseFloat(totalAfterTax.toFixed(2))
    };
}
