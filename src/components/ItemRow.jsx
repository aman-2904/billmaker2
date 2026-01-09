import { calculateGST } from '../utils/gstCalculation';

function ItemRow({ item, index, gstRate, onChange, onRemove }) {
    const effectiveRate = item.excludeGST ? 0 : gstRate;
    const { gstAmount, totalAmount } = calculateGST(parseFloat(item.amount) || 0, effectiveRate);

    return (
        <div className="item-row">
            <div className="item-row-header">
                <span className="item-row-title">Item {index + 1}</span>
                <button type="button" className="btn-remove" onClick={() => onRemove(item.id)}>
                    Remove
                </button>
            </div>
            <div className="item-fields">
                <div className="form-group">
                    <label>Description *</label>
                    <textarea
                        rows="2"
                        placeholder="Enter item description"
                        value={item.description}
                        onChange={(e) => onChange(item.id, 'description', e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>HSN Code</label>
                    <input
                        type="text"
                        placeholder="85171300"
                        value={item.hsn}
                        onChange={(e) => onChange(item.id, 'hsn', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Unit</label>
                    <input
                        type="number"
                        min="1"
                        step="1"
                        value={item.unit}
                        onChange={(e) => onChange(item.id, 'unit', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Price/Rate *</label>
                    <input
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => onChange(item.id, 'rate', e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Amount (Taxable)</label>
                    <input
                        type="number"
                        placeholder="0.00"
                        value={item.amount}
                        readOnly
                        className="readonly-input"
                    />
                </div>
                <div className="form-group checkbox-group" style={{ display: 'flex', alignItems: 'center', marginTop: '25px' }}>
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input
                            type="checkbox"
                            checked={item.excludeGST || false}
                            onChange={(e) => onChange(item.id, 'excludeGST', e.target.checked)}
                            style={{ width: 'auto', margin: 0 }}
                        />
                        <span style={{ fontSize: '0.9em' }}>Exclude GST</span>
                    </label>
                </div>
            </div>
            <div className="item-totals">
                <div className="form-group">
                    <label>GST Amount</label>
                    <input type="text" readOnly value={gstAmount.toFixed(2)} />
                </div>
                <div className="form-group">
                    <label>Total Amount</label>
                    <input type="text" readOnly value={totalAmount.toFixed(2)} />
                </div>
            </div>
        </div>
    );
}

export default ItemRow;
