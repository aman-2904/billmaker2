export function calculateGST(amount, gstRate) {
    const gstAmount = (amount * gstRate) / 100;
    const totalAmount = amount + gstAmount;
    return {
        gstAmount: parseFloat(gstAmount.toFixed(2)),
        totalAmount: parseFloat(totalAmount.toFixed(2))
    };
}

export function calculateInvoiceTotals(items, gstRate) {
    let totalBeforeTax = 0;
    let totalGST = 0;

    items.forEach(item => {
        const amount = parseFloat(item.amount) || 0;

        // Skip GST calculation if excludeGST is true
        let gstAmount = 0;
        if (!item.excludeGST) {
            const result = calculateGST(amount, gstRate);
            gstAmount = result.gstAmount;
        }

        totalBeforeTax += amount;
        totalGST += gstAmount;
    });

    const totalAfterTax = totalBeforeTax + totalGST;

    return {
        totalBeforeTax: parseFloat(totalBeforeTax.toFixed(2)),
        totalGST: parseFloat(totalGST.toFixed(2)),
        totalAfterTax: parseFloat(totalAfterTax.toFixed(2))
    };
}
