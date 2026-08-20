import React, { useState } from 'react';
import { AdminOffer } from '../../../types/admin';

interface OffersTabProps {
  offers: AdminOffer[];
  onAddOffer: (offer: AdminOffer) => void;
  onToggleOffer: (offerId: string) => void;
}

export const OffersTab: React.FC<OffersTabProps> = ({
  offers,
  onAddOffer,
  onToggleOffer,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'Percentage' | 'Flat'>('Percentage');
  const [discountValue, setDiscountValue] = useState('20');
  const [minSpend, setMinSpend] = useState('10000');
  const [maxDiscount, setMaxDiscount] = useState('4000');
  const [validUntil, setValidUntil] = useState('2026-10-31');
  const [applicableTier, setApplicableTier] = useState('All');
  const [offerToast, setOfferToast] = useState<string | null>(null);

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !title) return;

    const newOffer: AdminOffer = {
      id: `off-${Date.now()}`,
      code: code.toUpperCase(),
      title,
      description,
      discountType,
      discountValue: parseFloat(discountValue) || 15,
      minSpend: parseFloat(minSpend) || 0,
      maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
      validFrom: new Date().toISOString().slice(0, 10),
      validUntil,
      usageCount: 0,
      usageLimit: 1000,
      isActive: true,
      applicableTier: applicableTier === 'All' ? undefined : (applicableTier as any),
    };

    onAddOffer(newOffer);
    setShowCreateModal(false);
    setCode('');
    setTitle('');
    setDescription('');
    setOfferToast(`Campaign promo code ${newOffer.code} is now live across StayEase!`);
    setTimeout(() => setOfferToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-playfair text-[20px] font-bold text-white">
              Promotional Campaigns & Coupon Codes
            </h2>
            <span className="bg-[#c5a059]/20 text-[#c5a059] text-[10px] font-mono px-2 py-0.5 rounded border border-[#c5a059]/40">
              DISCOUNT ENGINE
            </span>
          </div>
          <p className="text-[12px] text-[#8e8e93] mt-0.5">
            Configure dynamic coupon redemptions, corporate tariffs, and seasonal booking surges.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 bg-[#c5a059] hover:bg-[#dfba73] text-black px-4 py-2 rounded-lg text-[12px] font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Create Promo Code</span>
        </button>
      </div>

      {/* Offers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={`bg-[#141414] border rounded-xl p-5 shadow-lg transition-all flex flex-col justify-between ${
              offer.isActive ? 'border-[#262626] hover:border-[#c5a059]/40' : 'border-[#1f1f1f] opacity-60'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[16px] font-bold text-[#c5a059] bg-[#1c1c1c] px-2.5 py-1 rounded border border-[#c5a059]/40 tracking-wider">
                    {offer.code}
                  </span>
                  {offer.applicableTier && (
                    <span className="text-[10px] bg-black text-[#c5a059] px-2 py-0.5 rounded border border-[#c5a059]/40 font-semibold">
                      {offer.applicableTier} Exclusive
                    </span>
                  )}
                </div>

                {/* Active Switch Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#8e8e93]">{offer.isActive ? 'Active' : 'Paused'}</span>
                  <button
                    onClick={() => onToggleOffer(offer.id)}
                    className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                      offer.isActive ? 'bg-emerald-600' : 'bg-[#333]'
                    }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      offer.isActive ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              <h4 className="font-playfair text-[18px] font-bold text-white mt-2">{offer.title}</h4>
              <p className="text-[12px] text-[#a3a3a3] mt-1">{offer.description}</p>

              {/* Conditions Grid */}
              <div className="grid grid-cols-2 gap-2 bg-[#1c1c1c] p-3 rounded-lg border border-[#262626] my-3 text-[11px]">
                <div>
                  <span className="text-[#8e8e93]">Benefit:</span>
                  <div className="font-bold text-emerald-400 font-mono text-[13px]">
                    {offer.discountType === 'Percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} FLAT OFF`}
                  </div>
                </div>
                <div>
                  <span className="text-[#8e8e93]">Minimum Spend:</span>
                  <div className="font-bold text-white font-mono text-[13px]">
                    ₹{offer.minSpend.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#262626] flex items-center justify-between text-[11px] text-[#8e8e93]">
              <span>Valid till {offer.validUntil}</span>
              <span className="font-mono font-medium text-white">{offer.usageCount} / {offer.usageLimit} Redeemed</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Promo Code Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-[#262626] pb-4 mb-4">
              <h3 className="font-playfair text-[20px] font-bold text-white">Create New Promo Campaign</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#8e8e93] hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-4 text-[13px]">
              <div>
                <label className="block text-[#8e8e93] mb-1">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  placeholder="e.g. LUXURYFEST2026"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  className="w-full bg-[#1c1c1c] border border-[#333] text-white p-2.5 rounded-lg font-mono font-bold tracking-wider outline-hidden focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-[#8e8e93] mb-1">Campaign Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Luxury Staycation Special"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-[#1c1c1c] border border-[#333] text-white p-2.5 rounded-lg outline-hidden focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="block text-[#8e8e93] mb-1">Terms Description</label>
                <input
                  type="text"
                  placeholder="e.g. Valid on minimum 2-night bookings across Goa and Mumbai"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-[#333] text-white p-2.5 rounded-lg outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8e8e93] mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-[#1c1c1c] border border-[#333] text-white p-2.5 rounded-lg outline-hidden"
                  >
                    <option value="Percentage">Percentage (% off)</option>
                    <option value="Flat">Flat Amount (₹ off)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#8e8e93] mb-1">Value ({discountType === 'Percentage' ? '%' : '₹'})</label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    required
                    className="w-full bg-[#1c1c1c] border border-[#333] text-white p-2.5 rounded-lg outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8e8e93] mb-1">Min Spend (₹)</label>
                  <input
                    type="number"
                    value={minSpend}
                    onChange={(e) => setMinSpend(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-[#333] text-white p-2.5 rounded-lg outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#8e8e93] mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-[#333] text-white p-2.5 rounded-lg outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8e8e93] mb-1">Target Guest Tier</label>
                <select
                  value={applicableTier}
                  onChange={(e) => setApplicableTier(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-[#333] text-white p-2.5 rounded-lg outline-hidden"
                >
                  <option value="All">All Guests (Public Promo)</option>
                  <option value="StayEase Elite Black">StayEase Elite Black Exclusive</option>
                  <option value="Gold">Gold Members & Above</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-[#1c1c1c] text-[#a3a3a3] hover:text-white px-4 py-2 rounded-lg text-[12px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#c5a059] hover:bg-[#dfba73] text-black px-4 py-2 rounded-lg text-[12px] font-semibold uppercase tracking-wider"
                >
                  Launch Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offer Toast */}
      {offerToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1c1c] border border-[#c5a059] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom">
          <span className="material-symbols-outlined text-[#c5a059]">local_offer</span>
          <span className="text-[13px]">{offerToast}</span>
        </div>
      )}
    </div>
  );
};
