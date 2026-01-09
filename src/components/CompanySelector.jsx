import { useState, useEffect } from 'react';
import { getCompanies } from '../services/companyService';

function CompanySelector({ onCompanySelect, onManageClick, selectedCompanyId }) {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCompanies();
    }, []);

    async function loadCompanies() {
        try {
            setLoading(true);
            setError(null);
            console.log('🔄 Loading companies from Supabase...');
            const data = await getCompanies();
            setCompanies(data);
            console.log('✅ Companies loaded successfully:', data.length);
        } catch (err) {
            console.error('❌ Failed to load companies:', err);
            const errorMessage = err.message || 'Failed to load companies. Please check your connection.';
            setError(`Failed to load companies: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    }

    function handleCompanyChange(e) {
        const companyId = e.target.value;
        if (companyId) {
            const company = companies.find(c => c.id === companyId);
            onCompanySelect(company);
        } else {
            onCompanySelect(null);
        }
    }

    return (
        <div className="company-selector">
            <div className="section-header">
                <h2>Company Profile</h2>
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={onManageClick}
                >
                    Manage Companies
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="form-group">
                <label htmlFor="companySelect">Select Company</label>
                <select
                    id="companySelect"
                    value={selectedCompanyId || ''}
                    onChange={handleCompanyChange}
                    disabled={loading}
                >
                    <option value="">-- Select a company --</option>
                    {companies.map(company => (
                        <option key={company.id} value={company.id}>
                            {company.company_name}
                        </option>
                    ))}
                </select>
                {loading && <span className="loading-text">Loading companies...</span>}
            </div>

            {companies.length === 0 && !loading && (
                <p className="info-text">
                    No companies saved yet. Click "Manage Companies" to add your first company profile.
                </p>
            )}
        </div>
    );
}

export default CompanySelector;
