import { useState, useEffect } from 'react';
import { getBuyers, saveBuyer, updateBuyer, deleteBuyer } from '../services/buyerService';
import Icons, { ICON_SIZES } from './icons';

function BuyerManager({ isOpen, onClose, onBuyerSaved }) {
    const [buyers, setBuyers] = useState([]);
    const [editingBuyer, setEditingBuyer] = useState(null);
    const [showNewBuyerForm, setShowNewBuyerForm] = useState(false);

    // Quick add form state - all fields
    const [newBuyerData, setNewBuyerData] = useState({
        buyerName: '',
        buyerAddress: '',
        buyerGST: '',
        buyerPhone: '',
        buyerEmail: ''
    });

    const [formData, setFormData] = useState({
        buyerName: '',
        buyerAddress: '',
        buyerGST: '',
        buyerPhone: '',
        buyerEmail: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            loadBuyers();
        }
    }, [isOpen]);

    async function loadBuyers() {
        try {
            console.log('🔄 Loading buyers in manager...');
            setLoading(true);
            setError(null);
            const data = await getBuyers();
            console.log('✅ Loaded buyers:', data.length);
            setBuyers(data);
        } catch (err) {
            setError('Failed to load buyers');
            console.error('❌ Error in BuyerManager:', err);
        } finally {
            setLoading(false);
        }
    }

    function handleEdit(buyer) {
        setEditingBuyer(buyer);
        setFormData({
            buyerName: buyer.buyer_name,
            buyerAddress: buyer.address,
            buyerGST: buyer.gst_number || '',
            buyerPhone: buyer.phone || '',
            buyerEmail: buyer.email || ''
        });
        setShowNewBuyerForm(false);
    }

    function handleNewBuyer() {
        setShowNewBuyerForm(true);
        setNewBuyerData({
            buyerName: '',
            buyerAddress: '',
            buyerGST: '',
            buyerPhone: '',
            buyerEmail: ''
        });
        setError(null);
    }

    async function saveNewBuyer() {
        // Validate required fields
        if (!newBuyerData.buyerName.trim()) {
            setError('Buyer name is required');
            return;
        }

        if (!newBuyerData.buyerAddress.trim()) {
            setError('Address is required');
            return;
        }

        // Email validation (if provided)
        if (newBuyerData.buyerEmail.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newBuyerData.buyerEmail.trim())) {
                setError('Please enter a valid email address');
                return;
            }
        }

        try {
            setLoading(true);
            setError(null);

            // Create complete buyer data
            const buyerData = {
                buyerName: newBuyerData.buyerName.trim(),
                buyerAddress: newBuyerData.buyerAddress.trim(),
                buyerGST: newBuyerData.buyerGST.trim() || '',
                buyerPhone: newBuyerData.buyerPhone.trim() || '',
                buyerEmail: newBuyerData.buyerEmail.trim().toLowerCase() || ''
            };

            const savedBuyer = await saveBuyer(buyerData);
            console.log('✅ New buyer saved:', savedBuyer);

            // Refresh the buyers list
            await loadBuyers();

            // Close the form and reset
            setShowNewBuyerForm(false);
            setNewBuyerData({
                buyerName: '',
                buyerAddress: '',
                buyerGST: '',
                buyerPhone: '',
                buyerEmail: ''
            });

            // Auto-select the newly created buyer
            if (onBuyerSaved) {
                onBuyerSaved(savedBuyer);
            }

            alert('✅ Buyer saved successfully!');
        } catch (err) {
            const errorMessage = err.message || 'Failed to save buyer';
            setError(`Failed to save buyer: ${errorMessage}`);
            console.error('❌ Save error:', err);
        } finally {
            setLoading(false);
        }
    }

    function cancelNewBuyer() {
        setShowNewBuyerForm(false);
        setNewBuyerData({
            buyerName: '',
            buyerAddress: '',
            buyerGST: '',
            buyerPhone: '',
            buyerEmail: ''
        });
        setError(null);
    }

    async function handleSave() {
        if (!formData.buyerName.trim()) {
            setError('Buyer name is required');
            return;
        }

        if (!formData.buyerAddress.trim()) {
            setError('Address is required');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const buyerData = {
                buyerName: formData.buyerName,
                buyerAddress: formData.buyerAddress,
                buyerGST: formData.buyerGST || '',
                buyerPhone: formData.buyerPhone || '',
                buyerEmail: formData.buyerEmail || ''
            };

            if (editingBuyer) {
                await updateBuyer(editingBuyer.id, buyerData);
                alert('Buyer updated successfully!');
            }

            await loadBuyers();
            setEditingBuyer(null);
            setFormData({
                buyerName: '',
                buyerAddress: '',
                buyerGST: '',
                buyerPhone: '',
                buyerEmail: ''
            });
        } catch (err) {
            setError('Failed to save buyer');
            console.error('❌ Save error:', err);
        } finally {
            setLoading(false);
        }
    }

    function handleCancel() {
        setEditingBuyer(null);
        setFormData({
            buyerName: '',
            buyerAddress: '',
            buyerGST: '',
            buyerPhone: '',
            buyerEmail: ''
        });
        setError(null);
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this buyer?')) {
            return;
        }

        try {
            setLoading(true);
            await deleteBuyer(id);
            await loadBuyers();
            alert('Buyer deleted successfully!');
        } catch (err) {
            setError('Failed to delete buyer');
            console.error('❌ Delete error:', err);
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Manage Buyers</h2>
                    <button className="btn-close" onClick={onClose}><Icons.X size={ICON_SIZES.lg} /></button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="modal-body">
                    {/* Buyer List */}
                    <div className="company-list">
                        <div className="list-header">
                            <h3>Saved Buyers</h3>
                            <button
                                type="button"
                                className="btn-add"
                                onClick={handleNewBuyer}
                            >
                                + New Buyer
                            </button>
                        </div>

                        {buyers.length === 0 ? (
                            <p className="empty-state">No buyers saved yet.</p>
                        ) : (
                            <div className="companies-grid">
                                {buyers.map(buyer => (
                                    <div key={buyer.id} className="company-card">
                                        <h4>{buyer.buyer_name}</h4>
                                        <p>{buyer.address}</p>
                                        {buyer.gst_number && <p className="gst-number">{buyer.gst_number}</p>}
                                        <div className="card-actions">
                                            <button
                                                className="btn-edit"
                                                onClick={() => handleEdit(buyer)}
                                            >
                                                <Icons.Pencil size={ICON_SIZES.sm} /> Edit
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(buyer.id)}
                                            >
                                                <Icons.Trash2 size={ICON_SIZES.sm} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Add Buyer Form */}
                    {showNewBuyerForm && (
                        <div className="quick-add-form">
                            <div className="quick-add-header">
                                <h3><Icons.Sparkles size={ICON_SIZES.md} /> Add New Buyer</h3>
                                <button
                                    type="button"
                                    className="btn-close-small"
                                    onClick={cancelNewBuyer}
                                    disabled={loading}
                                >
                                    <Icons.X size={ICON_SIZES.md} />
                                </button>
                            </div>

                            <div className="quick-add-fields">
                                <div className="form-group full-width">
                                    <label>Buyer Name *</label>
                                    <input
                                        type="text"
                                        value={newBuyerData.buyerName}
                                        onChange={(e) => setNewBuyerData({ ...newBuyerData, buyerName: e.target.value })}
                                        placeholder="Enter buyer/customer name"
                                        disabled={loading}
                                        autoFocus
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Address *</label>
                                    <textarea
                                        rows="3"
                                        value={newBuyerData.buyerAddress}
                                        onChange={(e) => setNewBuyerData({ ...newBuyerData, buyerAddress: e.target.value })}
                                        placeholder="Enter complete address"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>GST Number</label>
                                    <input
                                        type="text"
                                        value={newBuyerData.buyerGST}
                                        onChange={(e) => setNewBuyerData({ ...newBuyerData, buyerGST: e.target.value.toUpperCase() })}
                                        placeholder="29ABCDE1234F1Z5"
                                        maxLength="15"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        value={newBuyerData.buyerPhone}
                                        onChange={(e) => setNewBuyerData({ ...newBuyerData, buyerPhone: e.target.value })}
                                        placeholder="+91 1234567890"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={newBuyerData.buyerEmail}
                                        onChange={(e) => setNewBuyerData({ ...newBuyerData, buyerEmail: e.target.value })}
                                        placeholder="buyer@example.com"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="quick-add-actions">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={cancelNewBuyer}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={saveNewBuyer}
                                    disabled={loading}
                                >
                                    {loading ? <><Icons.Loader2 size={ICON_SIZES.md} className="spinning" /> Saving...</> : <><Icons.Save size={ICON_SIZES.md} /> Save Buyer</>}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Edit Buyer Form */}
                    {(editingBuyer || formData.buyerName) && !showNewBuyerForm && (
                        <div className="company-form">
                            <h3>{editingBuyer ? 'Edit Buyer' : 'New Buyer'}</h3>

                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Buyer Name *</label>
                                    <input
                                        type="text"
                                        value={formData.buyerName}
                                        onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                                        placeholder="Enter buyer name"
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Address *</label>
                                    <textarea
                                        rows="3"
                                        value={formData.buyerAddress}
                                        onChange={(e) => setFormData({ ...formData, buyerAddress: e.target.value })}
                                        placeholder="Enter address"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>GST Number</label>
                                    <input
                                        type="text"
                                        value={formData.buyerGST}
                                        onChange={(e) => setFormData({ ...formData, buyerGST: e.target.value.toUpperCase() })}
                                        placeholder="29ABCDE1234F1Z5"
                                        maxLength="15"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.buyerPhone}
                                        onChange={(e) => setFormData({ ...formData, buyerPhone: e.target.value })}
                                        placeholder="+91 1234567890"
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={formData.buyerEmail}
                                        onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                                        placeholder="buyer@example.com"
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Buyer'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BuyerManager;
