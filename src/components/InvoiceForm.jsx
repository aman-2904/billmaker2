import ItemRow from './ItemRow';
import Icons, { ICON_SIZES } from './icons';

function InvoiceForm({
    formData,
    items,
    gstRate,
    totals,
    amountInWords,
    onFormChange,
    onItemChange,
    onAddItem,
    onRemoveItem,
    onGstRateChange,
    gstType,
    onGstTypeChange,
    onGeneratePDF,
    onReset,
    onSaveQuotation,
    onViewQuotations,
    currentQuotationId
}) {
    return (
        <form className="invoice-form" onSubmit={(e) => e.preventDefault()}>
            {/* Seller Details Section */}
            <section className="form-section">
                <h2>Seller Details</h2>
                <div className="form-grid">
                    <div className="form-group full-width">
                        <label htmlFor="sellerName">Company Name *</label>
                        <input
                            type="text"
                            id="sellerName"
                            value={formData.sellerName}
                            onChange={(e) => onFormChange('sellerName', e.target.value)}
                            placeholder="Enter company name"
                            required
                        />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="sellerAddress">Address *</label>
                        <textarea
                            id="sellerAddress"
                            rows="3"
                            value={formData.sellerAddress}
                            onChange={(e) => onFormChange('sellerAddress', e.target.value)}
                            placeholder="Enter complete address"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sellerPhone">Phone Number *</label>
                        <input
                            type="tel"
                            id="sellerPhone"
                            value={formData.sellerPhone}
                            onChange={(e) => onFormChange('sellerPhone', e.target.value)}
                            placeholder="+91 1234567890"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sellerGST">GST Number *</label>
                        <input
                            type="text"
                            id="sellerGST"
                            value={formData.sellerGST}
                            onChange={(e) => onFormChange('sellerGST', e.target.value)}
                            placeholder="07BBLPM8057J1Z3"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sellerPAN">PAN Number</label>
                        <input
                            type="text"
                            id="sellerPAN"
                            value={formData.sellerPAN}
                            onChange={(e) => onFormChange('sellerPAN', e.target.value)}
                            placeholder="BBLPM8057J"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sellerEmail">Email *</label>
                        <input
                            type="email"
                            id="sellerEmail"
                            value={formData.sellerEmail}
                            onChange={(e) => onFormChange('sellerEmail', e.target.value)}
                            placeholder="email@company.com"
                            required
                        />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="sellerTagline">Company Tagline</label>
                        <input
                            type="text"
                            id="sellerTagline"
                            value={formData.sellerTagline}
                            onChange={(e) => onFormChange('sellerTagline', e.target.value)}
                            placeholder="AN EVENT MANAGEMENT COMPANY"
                        />
                    </div>
                </div>
            </section>

            {/* Buyer Details Section */}
            <section className="form-section">
                <h2>Buyer Details</h2>
                <div className="form-grid">
                    <div className="form-group full-width">
                        <label htmlFor="buyerName">Customer Name *</label>
                        <input
                            type="text"
                            id="buyerName"
                            value={formData.buyerName}
                            onChange={(e) => onFormChange('buyerName', e.target.value)}
                            placeholder="Enter customer name"
                            required
                        />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="buyerAddress">Address *</label>
                        <textarea
                            id="buyerAddress"
                            rows="3"
                            value={formData.buyerAddress}
                            onChange={(e) => onFormChange('buyerAddress', e.target.value)}
                            placeholder="Enter customer address"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="buyerGST">GST Number</label>
                        <input
                            type="text"
                            id="buyerGST"
                            value={formData.buyerGST}
                            onChange={(e) => onFormChange('buyerGST', e.target.value)}
                            placeholder="06GXDPS7837P1ZJ"
                        />
                    </div>
                </div>
            </section>

            {/* Invoice Metadata Section */}
            <section className="form-section">
                <h2>Invoice Details</h2>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="invoiceNumber">Invoice Number *</label>
                        <input
                            type="text"
                            id="invoiceNumber"
                            value={formData.invoiceNumber}
                            onChange={(e) => onFormChange('invoiceNumber', e.target.value)}
                            placeholder="Enter your invoice number"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="invoiceDate">Invoice Date *</label>
                        <input
                            type="date"
                            id="invoiceDate"
                            value={formData.invoiceDate}
                            onChange={(e) => onFormChange('invoiceDate', e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="deliveryNote">Delivery Note</label>
                        <input
                            type="text"
                            id="deliveryNote"
                            value={formData.deliveryNote}
                            onChange={(e) => onFormChange('deliveryNote', e.target.value)}
                            placeholder="write the note"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="paymentMode">Mode/Term of Payment</label>
                        <input
                            type="text"
                            id="paymentMode"
                            value={formData.paymentMode}
                            onChange={(e) => onFormChange('paymentMode', e.target.value)}
                            placeholder="UPI/Cash/Online"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="supplierRef">Supplier Reference</label>
                        <input
                            type="text"
                            id="supplierRef"
                            value={formData.supplierRef}
                            onChange={(e) => onFormChange('supplierRef', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="otherRef">Other Reference</label>
                        <input
                            type="text"
                            id="otherRef"
                            value={formData.otherRef}
                            onChange={(e) => onFormChange('otherRef', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="buyerPO">Buyer's PO No</label>
                        <input
                            type="text"
                            id="buyerPO"
                            value={formData.buyerPO}
                            onChange={(e) => onFormChange('buyerPO', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="poDate">PO Date</label>
                        <input
                            type="date"
                            id="poDate"
                            value={formData.poDate}
                            onChange={(e) => onFormChange('poDate', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dispatchThrough">Dispatched Through</label>
                        <input
                            type="text"
                            id="dispatchThrough"
                            value={formData.dispatchThrough}
                            onChange={(e) => onFormChange('dispatchThrough', e.target.value)}
                            placeholder="Self Pickup"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="destination">Destination</label>
                        <input
                            type="text"
                            id="destination"
                            value={formData.destination}
                            onChange={(e) => onFormChange('destination', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="termsOfDelivery">Terms of Delivery</label>
                        <input
                            type="text"
                            id="termsOfDelivery"
                            value={formData.termsOfDelivery}
                            onChange={(e) => onFormChange('termsOfDelivery', e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Items Section */}
            <section className="form-section">
                <div className="section-header">
                    <h2>Invoice Items</h2>
                    <button type="button" className="btn-add" onClick={onAddItem}>
                        <Icons.Plus size={ICON_SIZES.md} /> Add Item
                    </button>
                </div>

                <div className="items-container">
                    {items.map((item, index) => (
                        <ItemRow
                            key={item.id}
                            item={item}
                            index={index}
                            gstRate={gstRate}
                            onChange={onItemChange}
                            onRemove={onRemoveItem}
                        />
                    ))}
                </div>

                <div className="form-group" style={{ maxWidth: '200px', marginTop: '20px' }}>
                    <label htmlFor="gstRate">GST Rate (%)</label>
                    <input
                        type="number"
                        id="gstRate"
                        value={gstRate}
                        onChange={(e) => onGstRateChange(parseFloat(e.target.value) || 0)}
                        min="0"
                        max="100"
                        step="0.01"
                    />
                </div>

                <div className="form-group" style={{ marginTop: '20px' }}>
                    <label>GST Type</label>
                    <div className="gst-type-options">
                        <label className="gst-option">
                            <input
                                type="radio"
                                name="gstType"
                                value="CGST_SGST"
                                checked={gstType === 'CGST_SGST'}
                                onChange={(e) => onGstTypeChange(e.target.value)}
                            />
                            Intra-State (CGST + SGST)
                        </label>
                        <label className="gst-option">
                            <input
                                type="radio"
                                name="gstType"
                                value="IGST"
                                checked={gstType === 'IGST'}
                                onChange={(e) => onGstTypeChange(e.target.value)}
                            />
                            Inter-State (IGST)
                        </label>
                        <label className="gst-option">
                            <input
                                type="radio"
                                name="gstType"
                                value=""
                                checked={gstType === ''}
                                onChange={() => onGstTypeChange('')}
                            />
                            None
                        </label>
                    </div>
                </div>
            </section>

            {/* Totals Display */}
            <section className="form-section totals-section">
                <h2>Invoice Summary</h2>
                <div className="totals-grid">
                    <div className="total-row">
                        <span>Total Amount (Before Tax):</span>
                        <span className="total-value">₹{totals.totalBeforeTax.toFixed(2)}</span>
                    </div>
                    <div className="total-row">
                        <span>GST Amount:</span>
                        <span className="total-value">₹{totals.totalGST.toFixed(2)}</span>
                    </div>
                    <div className="total-row total-final">
                        <span>Total Amount (After Tax):</span>
                        <span className="total-value">₹{totals.totalAfterTax.toFixed(2)}</span>
                    </div>
                    <div className="total-row">
                        <span>Amount in Words:</span>
                        <span className="total-value">{amountInWords}</span>
                    </div>
                </div>
            </section>

            {/* Action Buttons */}
            <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onReset}>
                    <Icons.RotateCcw size={ICON_SIZES.md} /> Reset Form
                </button>
                <button type="button" className="btn-secondary" onClick={onViewQuotations}>
                    <Icons.FileText size={ICON_SIZES.md} /> View Saved Quotations
                </button>
                <button type="button" className="btn-success" onClick={onSaveQuotation}>
                    <Icons.Save size={ICON_SIZES.md} /> {currentQuotationId ? 'Update Quotation' : 'Save Quotation'}
                </button>
                <button type="button" className="btn-primary" onClick={onGeneratePDF}>
                    <Icons.FileDown size={ICON_SIZES.md} /> Save & Generate PDF
                </button>
            </div>
        </form >
    );
}

export default InvoiceForm;
