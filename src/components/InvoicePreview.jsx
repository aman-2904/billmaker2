import { forwardRef, useState, useEffect } from 'react';

const InvoicePreview = forwardRef(({ formData, items, gstRate, gstType, totals, amountInWords }, ref) => {
    const [logoBase64, setLogoBase64] = useState('');
    const [signatureBase64, setSignatureBase64] = useState('');

    useEffect(() => {
        const convertLogoToBase64 = async () => {
            if (formData.logoUrl) {
                try {
                    const response = await fetch(formData.logoUrl, { mode: 'cors' });
                    const blob = await response.blob();
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setLogoBase64(reader.result);
                    };
                    reader.readAsDataURL(blob);
                } catch (error) {
                    console.error('Error converting logo to base64:', error);
                    setLogoBase64(formData.logoUrl); // Fallback
                }
            } else {
                setLogoBase64('');
            }
        };

        convertLogoToBase64();
    }, [formData.logoUrl]);

    useEffect(() => {
        const convertSignatureToBase64 = async () => {
            if (formData.sellerSignature) {
                try {
                    const response = await fetch(formData.sellerSignature, { mode: 'cors' });
                    const blob = await response.blob();
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setSignatureBase64(reader.result);
                    };
                    reader.readAsDataURL(blob);
                } catch (error) {
                    console.error('Error converting signature to base64:', error);
                    setSignatureBase64(formData.sellerSignature); // Fallback
                }
            } else {
                setSignatureBase64('');
            }
        };

        convertSignatureToBase64();
    }, [formData.sellerSignature]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}.${month}.${year}`;
    };

    const sellerPAN = formData.sellerPAN || (formData.sellerGST ? formData.sellerGST.substring(2, 12) : '');

    return (
        <div ref={ref} className="invoice-template" style={{ display: 'none' }}>
            <div className="invoice-page">
                {/* Header with Logo and Company Name */}
                <div className="invoice-header">
                    <div className="company-logo-section">
                        <div className="company-logo">
                            {logoBase64 || formData.logoUrl ? (
                                <img
                                    src={logoBase64 || formData.logoUrl}
                                    alt="Company Logo"
                                    className="company-logo-img"
                                    style={{ maxHeight: '80px', maxWidth: '150px', objectFit: 'contain' }}
                                />
                            ) : (
                                <div className="logo-circle">
                                    <span className="logo-text">{formData.sellerName.substring(0, 3).toUpperCase()}</span>
                                </div>
                            )}
                            {!formData.logoUrl && <div className="company-name-logo">{formData.sellerName.toUpperCase()}</div>}
                        </div>
                        <div className="company-tagline">
                            {(formData.sellerTagline || 'AN EVENT MANAGEMENT COMPANY').toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Tax Invoice Title */}
                <div className="invoice-title-bar">
                    <h1 className="invoice-title">TAX INVOICE</h1>
                </div>

                {/* Main Invoice Content */}
                <div className="invoice-content">
                    <table className="invoice-main-table">
                        <tbody>
                            <tr>
                                {/* Left Column: Seller Details */}
                                <td className="seller-column">
                                    <div className="seller-info">
                                        <div className="seller-name">{formData.sellerName}</div>
                                        <div className="seller-address" dangerouslySetInnerHTML={{ __html: formData.sellerAddress.replace(/\n/g, '<br>') }} />
                                        <div className="seller-contact">Tel - {formData.sellerPhone}</div>
                                        <div className="seller-gst">GST No - {formData.sellerGST} PAN NO - {sellerPAN}</div>
                                        <div className="seller-email">E-mail - {formData.sellerEmail}</div>
                                        <div className="bill-to-label">Bill To : -</div>
                                        <div className="buyer-name">{formData.buyerName}</div>
                                        <div className="buyer-address" dangerouslySetInnerHTML={{ __html: formData.buyerAddress.replace(/\n/g, '<br>') }} />
                                        <div className="buyer-gst">GST No – {formData.buyerGST || ''}</div>
                                    </div>
                                </td>

                                {/* Right Column: Invoice Metadata */}
                                <td className="metadata-column">
                                    <table className="metadata-table">
                                        <tbody>
                                            <tr>
                                                <td className="meta-label">Invoice No: -</td>
                                                <td className="meta-value">{formData.invoiceNumber}</td>
                                                <td className="meta-label">Dated: -</td>
                                                <td className="meta-value">{formatDate(formData.invoiceDate)}</td>
                                            </tr>
                                            <tr>
                                                <td className="meta-label">Delivery Note: -</td>
                                                <td className="meta-value">{formData.deliveryNote}</td>
                                                <td className="meta-label" colSpan="2">
                                                    Mode/Term of Payment:-<br />
                                                    {formData.paymentMode || 'UPI'}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="meta-label">Supplier Ref.:</td>
                                                <td className="meta-value">{formData.supplierRef}</td>
                                                <td className="meta-label">Other Reference</td>
                                                <td className="meta-value">{formData.otherRef}</td>
                                            </tr>
                                            <tr>
                                                <td className="meta-label">Buyer's PO No:</td>
                                                <td className="meta-value">{formData.buyerPO}</td>
                                                <td className="meta-label">Dated: -</td>
                                                <td className="meta-value">{formatDate(formData.poDate)}</td>
                                            </tr>
                                            <tr>
                                                <td className="meta-label">Site:</td>
                                                <td className="meta-value"></td>
                                                <td className="meta-label">Dated: -</td>
                                                <td className="meta-value"></td>
                                            </tr>
                                            <tr>
                                                <td className="meta-label">Dispatched Through: -</td>
                                                <td className="meta-value">{formData.dispatchThrough || 'Self Pickup'}</td>
                                                <td className="meta-label">Destination: -</td>
                                                <td className="meta-value">{formData.destination}</td>
                                            </tr>
                                            <tr>
                                                <td className="meta-label" colSpan="4">
                                                    Terms of Delivery: -<br />
                                                    {formData.termsOfDelivery}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Items Table */}
                    <table className="items-table">
                        <thead>
                            <tr>
                                <th className="col-srno">Sr No</th>
                                <th className="col-description">Description</th>
                                <th className="col-hsn">HSN<br />Code</th>
                                <th className="col-unit">Unit</th>
                                <th className="col-rate">Rate</th>
                                <th className="col-amount">Amount</th>
                                <th className="col-gst-percent">GST %</th>
                                <th className="col-gst-amt">GST<br />Amt</th>
                                <th className="col-total">Total<br />Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => {
                                const amount = parseFloat(item.amount) || 0;
                                let gstAmount = 0;
                                let effectiveGstRate = 0;

                                if (!item.excludeGST) {
                                    gstAmount = (amount * gstRate) / 100;
                                    effectiveGstRate = gstRate;
                                }

                                const total = amount + gstAmount;

                                return (
                                    <tr key={item.id}>
                                        <td className="col-srno">{index + 1}</td>
                                        <td className="col-description" dangerouslySetInnerHTML={{ __html: item.description.replace(/\n/g, '<br>') }} />
                                        <td className="col-hsn">{item.hsn}</td>
                                        <td className="col-unit">{item.unit}</td>
                                        <td className="col-rate">{item.rate ? parseFloat(item.rate).toFixed(2) : '0.00'}</td>
                                        <td className="col-amount">{amount.toFixed(2)}</td>
                                        <td className="col-gst-percent">{item.excludeGST ? 'Exempt' : effectiveGstRate}</td>
                                        <td className="col-gst-amt">{gstAmount.toFixed(2)}</td>
                                        <td className="col-total">{total.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="subtotal-row">
                                <td colSpan="6"></td>
                                <td></td> {/* GST % column - Blank */}
                                <td className="subtotal-value">{totals.totalGST.toFixed(2)}</td>
                                <td className="subtotal-value">{totals.totalAfterTax.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* Amount in Words and Totals */}
                    <table className="summary-table">
                        <tbody>
                            <tr>
                                <td className="words-section" rowSpan="5">
                                    <div className="words-label">Total Invoice Amount in Words:</div>
                                    <div className="words-value">{amountInWords}</div>
                                    <div className="reverse-charge">Under Reverse Charges: - NO</div>
                                </td>
                                <td className="summary-label">Total Amount<br />Before Tax:</td>
                                <td className="summary-value">{totals.totalBeforeTax.toFixed(2)}</td>
                            </tr>
                            {gstType === 'CGST_SGST' ? (
                                <>
                                    <tr>
                                        <td className="summary-label">Add: CGST {gstRate / 2}%</td>
                                        <td className="summary-value">{totals.totalCGST ? totals.totalCGST.toFixed(2) : '0.00'}</td>
                                    </tr>
                                    <tr>
                                        <td className="summary-label">Add: SGST {gstRate / 2}%</td>
                                        <td className="summary-value">{totals.totalSGST ? totals.totalSGST.toFixed(2) : '0.00'}</td>
                                    </tr>
                                </>
                            ) : gstType === 'IGST' ? (
                                <>
                                    <tr>
                                        <td className="summary-label">Add: IGST {gstRate}%</td>
                                        <td className="summary-value">{totals.totalIGST ? totals.totalIGST.toFixed(2) : '0.00'}</td>
                                    </tr>
                                    <tr>
                                        <td className="summary-label"></td>
                                        <td className="summary-value"></td>
                                    </tr>
                                </>
                            ) : (
                                <>
                                    <tr>
                                        <td className="summary-label">GST 0%</td>
                                        <td className="summary-value">0.00</td>
                                    </tr>
                                    <tr>
                                        <td className="summary-label"></td>
                                        <td className="summary-value"></td>
                                    </tr>
                                </>
                            )}
                            <tr>
                                <td className="summary-label">Tax Amount:</td>
                                <td className="summary-value">{totals.totalGST.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="summary-label summary-final">Total amount after tax</td>
                                <td className="summary-value summary-final">{totals.totalAfterTax.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Footer Section */}
                    <div className="invoice-footer">
                        <div className="footer-left">
                            <div className="declaration-text">
                                We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
                            </div>
                        </div>
                        <div className="footer-right">
                            <div className="stamp-area">
                                <div className="stamp-placeholder">For {formData.sellerName.toUpperCase()}</div>
                                {signatureBase64 || formData.sellerSignature ? (
                                    <div className="signature-container" style={{ marginTop: '10px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img
                                            src={signatureBase64 || formData.sellerSignature}
                                            alt="Authorized Signature"
                                            style={{ maxHeight: '60px', maxWidth: '100%', objectFit: 'contain' }}
                                        />
                                    </div>
                                ) : (
                                    <div style={{ height: '60px' }}></div>
                                )}
                                <div className="auth-signatory">Authorized Signatory</div>
                            </div>
                        </div>
                    </div>

                    {/* Registered Office */}
                    <div className="registered-office">
                        Regd. Office - {formData.sellerAddress.replace(/\n/g, ', ')}
                    </div>
                </div>
            </div>
        </div>
    );
});

InvoicePreview.displayName = 'InvoicePreview';

export default InvoicePreview;
