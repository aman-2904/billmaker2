import { calculateGST } from '../utils/gstCalculation';

function ItemRow({ item, index, gstRate, onChange, onRemove }) {
    const { gstAmount, totalAmount } = calculateGST(parseFloat(item.amount) || 0, gstRate);

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
                    <label>Amount *</label>
                    <input
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={item.amount}
                        onChange={(e) => onChange(item.id, 'amount', e.target.value)}
                        required
                    />
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
