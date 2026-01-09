import { useState, useEffect } from 'react';
import { getCompanies, saveCompany, updateCompany, deleteCompany } from '../services/companyService';
import Icons, { ICON_SIZES } from './icons';

function CompanyManager({ isOpen, onClose, onCompanySaved, currentFormData }) {
    const [companies, setCompanies] = useState([]);
    const [editingCompany, setEditingCompany] = useState(null);
    const [showNewCompanyForm, setShowNewCompanyForm] = useState(false);

    // Quick add form state - all fields
    const [newCompanyData, setNewCompanyData] = useState({
        companyName: '',
        gstNumber: '',
        phone: '',
        email: '',
        panNumber: '',
        address: '',
        tagline: ''
    });

    const [formData, setFormData] = useState({
        sellerName: '',
        sellerAddress: '',
        sellerPhone: '',
        sellerGST: '',
        sellerPAN: '',
        sellerEmail: '',
        sellerTagline: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            loadCompanies();
        }
    }, [isOpen]);

    async function loadCompanies() {
        try {
            setLoading(true);
            console.log('🔄 Loading companies in manager...');
            const data = await getCompanies();
            setCompanies(data);
            console.log('✅ Loaded companies:', data.length);
        } catch (err) {
            const errorMessage = err.message || 'Failed to load companies';
            setError(`Failed to load companies: ${errorMessage}`);
            console.error('❌ Error in CompanyManager:', err);
        } finally {
            setLoading(false);
        }
    }

    function handleEdit(company) {
        setEditingCompany(company);
        setFormData({
            sellerName: company.company_name,
            sellerAddress: company.address,
            sellerPhone: company.phone,
            sellerGST: company.gst_number,
            sellerPAN: company.pan_number || '',
            sellerEmail: company.email,
            sellerTagline: company.tagline || ''
        });
    }

    function handleNewCompany() {
        setShowNewCompanyForm(true);
        setNewCompanyData({
            companyName: '',
            gstNumber: '',
            phone: '',
            email: '',
            panNumber: '',
            address: '',
            tagline: ''
        });
        setError(null);
    }

    async function saveNewCompany() {
        // Validate required fields
        if (!newCompanyData.companyName.trim()) {
            setError('Company name is required');
            return;
        }

        if (!newCompanyData.gstNumber.trim()) {
            setError('GST number is required');
            return;
        }

        if (!newCompanyData.phone.trim()) {
            setError('Phone number is required');
            return;
        }

        if (!newCompanyData.email.trim()) {
            setError('Email is required');
            return;
        }

        // Format validations
        // GST validation (15 characters)
        if (newCompanyData.gstNumber.trim().length !== 15) {
            setError('GST number must be 15 characters long');
            return;
        }

        // Email validation (basic format check)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newCompanyData.email.trim())) {
            setError('Please enter a valid email address');
            return;
        }

        // Phone validation (basic check - at least 10 digits)
        const phoneDigits = newCompanyData.phone.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
            setError('Phone number must contain at least 10 digits');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Create complete company data
            const companyData = {
                sellerName: newCompanyData.companyName.trim(),
                sellerGST: newCompanyData.gstNumber.trim().toUpperCase(),
                sellerPhone: newCompanyData.phone.trim(),
                sellerEmail: newCompanyData.email.trim().toLowerCase(),
                sellerPAN: newCompanyData.panNumber.trim() || '',
                sellerAddress: newCompanyData.address.trim() || '',
                sellerTagline: newCompanyData.tagline.trim() || ''
            };

            const savedCompany = await saveCompany(companyData);
            console.log('✅ New company saved:', savedCompany);

            // Refresh the companies list
            await loadCompanies();

            // Close the form and reset
            setShowNewCompanyForm(false);
            setNewCompanyData({
                companyName: '',
                gstNumber: '',
                phone: '',
                email: '',
                panNumber: '',
                address: '',
                tagline: ''
            });

            // Auto-select the newly created company
            if (onCompanySaved) {
                onCompanySaved(savedCompany);
            }

            alert('✅ Company saved successfully!');
        } catch (err) {
            const errorMessage = err.message || 'Failed to save company';
            setError(`Failed to save company: ${errorMessage}`);
            console.error('❌ Save error:', err);
        } finally {
            setLoading(false);
        }
    }

    function cancelNewCompany() {
        setShowNewCompanyForm(false);
        setNewCompanyData({
            companyName: '',
            gstNumber: '',
            phone: '',
            email: '',
            panNumber: '',
            address: '',
            tagline: ''
        });
        setError(null);
    }

    async function handleSave() {
        try {
            setLoading(true);
            setError(null);

            if (editingCompany) {
                await updateCompany(editingCompany.id, formData);
                alert('Company updated successfully!');
            } else {
                await saveCompany(formData);
                alert('Company saved successfully!');
            }

            await loadCompanies();
            setEditingCompany(null);
            setFormData({
                sellerName: '',
                sellerAddress: '',
                sellerPhone: '',
                sellerGST: '',
                sellerPAN: '',
                sellerEmail: '',
                sellerTagline: ''
            });
            onCompanySaved();
        } catch (err) {
            const errorMessage = err.message || 'Failed to save company';
            setError(`Failed to save company: ${errorMessage}`);
            console.error('❌ Save error:', err);
            alert(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this company?')) {
            return;
        }

        try {
            setLoading(true);
            await deleteCompany(id);
            await loadCompanies();
            alert('Company deleted successfully!');
        } catch (err) {
            const errorMessage = err.message || 'Failed to delete company';
            setError(`Failed to delete company: ${errorMessage}`);
            console.error('❌ Delete error:', err);
            alert(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Manage Companies</h2>
                    <button className="btn-close" onClick={onClose}><Icons.X size={ICON_SIZES.lg} /></button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="modal-body">
                    {/* Company List */}
                    <div className="company-list">
                        <div className="list-header">
                            <h3>Saved Companies</h3>
                            <button
                                type="button"
                                className="btn-add"
                                onClick={handleNewCompany}
                            >
                                + New Company
                            </button>
                        </div>

                        {companies.length === 0 ? (
                            <p className="empty-state">No companies saved yet.</p>
                        ) : (
                            <div className="companies-grid">
                                {companies.map(company => (
                                    <div key={company.id} className="company-card">
                                        <h4>{company.company_name}</h4>
                                        <p>{company.gst_number}</p>
                                        <div className="card-actions">
                                            <button
                                                className="btn-edit"
                                                onClick={() => handleEdit(company)}
                                            >
                                                <Icons.Pencil size={ICON_SIZES.sm} /> Edit
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(company.id)}
                                            >
                                                <Icons.Trash2 size={ICON_SIZES.sm} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Add Company Form */}
                    {showNewCompanyForm && (
                        <div className="quick-add-form">
                            <div className="quick-add-header">
                                <h3><Icons.Sparkles size={ICON_SIZES.md} /> Add New Company</h3>
                                <button
                                    type="button"
                                    className="btn-close-small"
                                    onClick={cancelNewCompany}
                                    disabled={loading}
                                >
                                    <Icons.X size={ICON_SIZES.md} />
                                </button>
                            </div>


                            <div className="quick-add-fields">
                                <div className="form-group full-width">
                                    <label>Company Name *</label>
                                    <input
                                        type="text"
                                        value={newCompanyData.companyName}
                                        onChange={(e) => setNewCompanyData({ ...newCompanyData, companyName: e.target.value })}
                                        placeholder="Enter company name"
                                        disabled={loading}
                                        autoFocus
                                    />
                                </div>

                                <div className="form-group">
                                    <label>GST Number *</label>
                                    <input
                                        type="text"
                                        value={newCompanyData.gstNumber}
                                        onChange={(e) => setNewCompanyData({ ...newCompanyData, gstNumber: e.target.value.toUpperCase() })}
                                        placeholder="07BBLPM8057J1Z3"
                                        maxLength="15"
                                        disabled={loading}
                                    />
                                    <small className="field-hint">15 characters required</small>
                                </div>

                                <div className="form-group">
                                    <label>Phone Number *</label>
                                    <input
                                        type="tel"
                                        value={newCompanyData.phone}
                                        onChange={(e) => setNewCompanyData({ ...newCompanyData, phone: e.target.value })}
                                        placeholder="+91 1234567890"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        value={newCompanyData.email}
                                        onChange={(e) => setNewCompanyData({ ...newCompanyData, email: e.target.value })}
                                        placeholder="contact@company.com"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>PAN Number</label>
                                    <input
                                        type="text"
                                        value={newCompanyData.panNumber}
                                        onChange={(e) => setNewCompanyData({ ...newCompanyData, panNumber: e.target.value.toUpperCase() })}
                                        placeholder="BBLPM8057J"
                                        maxLength="10"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Address</label>
                                    <textarea
                                        rows="3"
                                        value={newCompanyData.address}
                                        onChange={(e) => setNewCompanyData({ ...newCompanyData, address: e.target.value })}
                                        placeholder="Enter complete address"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Company Tagline</label>
                                    <input
                                        type="text"
                                        value={newCompanyData.tagline}
                                        onChange={(e) => setNewCompanyData({ ...newCompanyData, tagline: e.target.value })}
                                        placeholder="AN EVENT MANAGEMENT COMPANY"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="quick-add-actions">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={cancelNewCompany}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={saveNewCompany}
                                    disabled={loading}
                                >
                                    {loading ? <><Icons.Loader2 size={ICON_SIZES.md} className="spinning" /> Saving...</> : <><Icons.Save size={ICON_SIZES.md} /> Save Company</>}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Company Form */}
                    {(editingCompany || formData.sellerName) && (
                        <div className="company-form">
                            <h3>{editingCompany ? 'Edit Company' : 'New Company'}</h3>

                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Company Name *</label>
                                    <input
                                        type="text"
                                        value={formData.sellerName}
                                        onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Address *</label>
                                    <textarea
                                        rows="3"
                                        value={formData.sellerAddress}
                                        onChange={(e) => setFormData({ ...formData, sellerAddress: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Phone *</label>
                                    <input
                                        type="tel"
                                        value={formData.sellerPhone}
                                        onChange={(e) => setFormData({ ...formData, sellerPhone: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>GST Number *</label>
                                    <input
                                        type="text"
                                        value={formData.sellerGST}
                                        onChange={(e) => setFormData({ ...formData, sellerGST: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>PAN Number</label>
                                    <input
                                        type="text"
                                        value={formData.sellerPAN}
                                        onChange={(e) => setFormData({ ...formData, sellerPAN: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        value={formData.sellerEmail}
                                        onChange={(e) => setFormData({ ...formData, sellerEmail: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Company Tagline</label>
                                    <input
                                        type="text"
                                        value={formData.sellerTagline}
                                        onChange={(e) => setFormData({ ...formData, sellerTagline: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => {
                                        setEditingCompany(null);
                                        setFormData({
                                            sellerName: '',
                                            sellerAddress: '',
                                            sellerPhone: '',
                                            sellerGST: '',
                                            sellerPAN: '',
                                            sellerEmail: '',
                                            sellerTagline: ''
                                        });
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : editingCompany ? 'Update Company' : 'Save Company'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CompanyManager;
