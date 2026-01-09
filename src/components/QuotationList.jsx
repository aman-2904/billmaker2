import { useState, useEffect } from 'react';
import { getQuotations, deleteQuotation, duplicateQuotation, convertToInvoice, generateQuotationNumber } from '../services/quotationService';
import Icons, { ICON_SIZES } from './icons';

function QuotationList({ isOpen, onClose, onLoadQuotation }) {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            loadQuotations();
        }
    }, [isOpen]);

    async function loadQuotations() {
        try {
            setLoading(true);
            setError(null);
            const data = await getQuotations();
            setQuotations(data);
        } catch (err) {
            setError('Failed to load quotations');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this quotation?')) {
            return;
        }

        try {
            await deleteQuotation(id);
            await loadQuotations();
            alert('Quotation deleted successfully!');
        } catch (err) {
            alert('Failed to delete quotation');
            console.error(err);
        }
    }

    async function handleDuplicate(id) {
        try {
            const newQuotationNo = await generateQuotationNumber();
            await duplicateQuotation(id, newQuotationNo);
            await loadQuotations();
            alert(`Quotation duplicated as ${newQuotationNo}!`);
        } catch (err) {
            alert('Failed to duplicate quotation');
            console.error(err);
        }
    }

    async function handleConvertToInvoice(id) {
        if (!confirm('Convert this quotation to an invoice?')) {
            return;
        }

        try {
            await convertToInvoice(id);
            await loadQuotations();
            alert('Converted to invoice successfully!');
        } catch (err) {
            alert('Failed to convert to invoice');
            console.error(err);
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    }

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Saved Quotations & Invoices</h2>
                    <button className="btn-close" onClick={onClose}><Icons.X size={ICON_SIZES.lg} /></button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="modal-body">
                    {loading ? (
                        <div className="loading-state">Loading quotations...</div>
                    ) : quotations.length === 0 ? (
                        <div className="empty-state">
                            <p>No quotations saved yet.</p>
                            <p>Create and save your first quotation to see it here.</p>
                        </div>
                    ) : (
                        <div className="quotations-table-container">
                            <table className="quotations-table">
                                <thead>
                                    <tr>
                                        <th>Quotation No</th>
                                        <th>Company</th>
                                        <th>Customer</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quotations.map(quotation => (
                                        <tr key={quotation.id}>
                                            <td className="quotation-no">{quotation.quotation_no}</td>
                                            <td>{quotation.companies?.company_name || 'N/A'}</td>
                                            <td>{quotation.buyer_name}</td>
                                            <td>{formatDate(quotation.created_at)}</td>
                                            <td className="amount">{formatCurrency(quotation.total_after_tax)}</td>
                                            <td>
                                                <span className={`status-badge status-${quotation.status}`}>
                                                    {quotation.status}
                                                </span>
                                            </td>
                                            <td className="actions-cell">
                                                <button
                                                    className="btn-action btn-edit"
                                                    onClick={() => {
                                                        onLoadQuotation(quotation);
                                                        onClose();
                                                    }}
                                                    title="Edit"
                                                >
                                                    <Icons.Pencil size={ICON_SIZES.lg} />
                                                </button>
                                                <button
                                                    className="btn-action btn-duplicate"
                                                    onClick={() => handleDuplicate(quotation.id)}
                                                    title="Duplicate"
                                                >
                                                    <Icons.FileText size={ICON_SIZES.lg} />
                                                </button>
                                                {quotation.status === 'quotation' && (
                                                    <button
                                                        className="btn-action btn-convert"
                                                        onClick={() => handleConvertToInvoice(quotation.id)}
                                                        title="Convert to Invoice"
                                                    >
                                                        <Icons.CheckCircle2 size={ICON_SIZES.lg} />
                                                    </button>
                                                )}
                                                <button
                                                    className="btn-action btn-delete"
                                                    onClick={() => handleDelete(quotation.id)}
                                                    title="Delete"
                                                >
                                                    <Icons.Trash2 size={ICON_SIZES.lg} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default QuotationList;
