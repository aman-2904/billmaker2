import { useState, useEffect } from 'react';
import { getBuyers } from '../services/buyerService';

function BuyerSelector({ onBuyerSelect, onManageClick, selectedBuyerId }) {
    const [buyers, setBuyers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadBuyers();
    }, []);

    async function loadBuyers() {
        try {
            console.log('🔄 Loading buyers from Supabase...');
            setLoading(true);
            const data = await getBuyers();
            console.log('✅ Buyers loaded successfully:', data.length);
            setBuyers(data);
        } catch (err) {
            console.error('❌ Failed to load buyers:', err);
        } finally {
            setLoading(false);
        }
    }

    function handleBuyerChange(e) {
        const buyerId = e.target.value;
        if (buyerId) {
            const buyer = buyers.find(b => b.id === buyerId);
            onBuyerSelect(buyer);
        } else {
            onBuyerSelect(null);
        }
    }

    // Expose refresh function to parent
    useEffect(() => {
        // Store refresh function in window for parent access
        window.refreshBuyers = loadBuyers;
        return () => {
            delete window.refreshBuyers;
        };
    }, []);

    return (
        <div className="company-selector">
            <div className="section-header">
                <h2>Select Buyer</h2>
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={onManageClick}
                >
                    Manage Buyers
                </button>
            </div>

            <div className="form-group">
                <select
                    value={selectedBuyerId || ''}
                    onChange={handleBuyerChange}
                    disabled={loading}
                >
                    <option value="">-- Select a buyer or enter manually --</option>
                    {buyers.map(buyer => (
                        <option key={buyer.id} value={buyer.id}>
                            {buyer.buyer_name}
                        </option>
                    ))}
                </select>
                {loading && <small className="loading-text">Loading buyers...</small>}
            </div>
        </div>
    );
}

export default BuyerSelector;
