import React, { useState } from 'react';
import { AdminCustomer, GuestTier } from '../../../types/admin';

interface CustomersTabProps {
  customers: AdminCustomer[];
  searchQuery: string;
}

export const CustomersTab: React.FC<CustomersTabProps> = ({
  customers,
  searchQuery,
}) => {
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('All');
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const [bonusPointsAwarded, setBonusPointsAwarded] = useState<string | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const matchesTier = selectedTierFilter === 'All' || c.tier === selectedTierFilter;
    const matchesSearch = 
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const handleAwardBonusPoints = (customer: AdminCustomer) => {
    customer.loyaltyPoints += 2500;
    setBonusPointsAwarded(`Awarded +2,500 StayEase Privilege Points to ${customer.name}`);
    setTimeout(() => setBonusPointsAwarded(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4">
          <span className="text-[11px] text-[#8e8e93] uppercase font-bold">Total HNW Guests</span>
          <div className="font-playfair text-[24px] font-bold text-white mt-1">18,420</div>
          <span className="text-[11px] text-emerald-400 font-medium">+240 this month</span>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4">
          <span className="text-[11px] text-[#8e8e93] uppercase font-bold">Elite Black Members</span>
          <div className="font-playfair text-[24px] font-bold text-[#c5a059] mt-1">1,420</div>
          <span className="text-[11px] text-[#8e8e93]">₹8.4L Average Annual LTV</span>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4">
          <span className="text-[11px] text-[#8e8e93] uppercase font-bold">KYC Aadhaar / Passport Verified</span>
          <div className="font-playfair text-[24px] font-bold text-emerald-400 mt-1">98.4%</div>
          <span className="text-[11px] text-[#8e8e93]">Instant Digital Check-in</span>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4">
          <span className="text-[11px] text-[#8e8e93] uppercase font-bold">Total Loyalty Points Active</span>
          <div className="font-playfair text-[24px] font-bold text-white mt-1">4.2M Pts</div>
          <span className="text-[11px] text-[#c5a059]">Redeemable across India</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto">
          {['All', 'StayEase Elite Black', 'Gold', 'Silver'].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTierFilter(tier)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
                selectedTierFilter === tier
                  ? 'bg-[#c5a059] text-black font-semibold'
                  : 'bg-[#1c1c1c] text-[#a3a3a3] hover:text-white border border-[#262626]'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="bg-[#101010] border-b border-[#262626] text-[#8e8e93] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Guest Name & Tier</th>
                <th className="py-3 px-4">Contact & Location</th>
                <th className="py-3 px-4">KYC Status</th>
                <th className="py-3 px-4">Stays & LTV Spend</th>
                <th className="py-3 px-4">Loyalty Balance</th>
                <th className="py-3 px-4">Preferences & Tags</th>
                <th className="py-3 px-4 text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-[#1a1a1a]/60 transition-colors">
                  {/* Name & Tier */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white text-[14px]">{cust.name}</div>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-1 ${
                      cust.tier === 'StayEase Elite Black' 
                        ? 'bg-black text-[#c5a059] border border-[#c5a059]' 
                        : cust.tier === 'Gold'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-gray-800 text-gray-300 border border-gray-700'
                    }`}>
                      {cust.tier}
                    </span>
                  </td>

                  {/* Contact */}
                  <td className="py-3.5 px-4">
                    <div className="text-white">{cust.phone}</div>
                    <div className="text-[11px] text-[#8e8e93]">{cust.email}</div>
                    <div className="text-[11px] text-[#a3a3a3]">{cust.city}</div>
                  </td>

                  {/* KYC */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      <span className="material-symbols-outlined filled text-[14px]">verified</span>
                      {cust.kycStatus}
                    </span>
                  </td>

                  {/* Stays & LTV */}
                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-white text-[14px]">₹{cust.totalSpend.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-[#8e8e93]">{cust.totalBookings} Total Reservations</div>
                  </td>

                  {/* Loyalty Points */}
                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-[#c5a059]">{cust.loyaltyPoints.toLocaleString('en-IN')} Pts</div>
                    <div className="text-[10px] text-[#8e8e93]">Tier Level 3</div>
                  </td>

                  {/* Tags */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {cust.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-[#1c1c1c] text-[#a3a3a3] px-1.5 py-0.5 rounded border border-[#262626]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="bg-[#1c1c1c] hover:bg-[#262626] text-[#c5a059] border border-[#333] px-3 py-1 rounded text-[11px] font-semibold cursor-pointer"
                    >
                      View CRM Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-[#262626] pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-black border border-[#c5a059] flex items-center justify-center font-bold text-[#c5a059] text-[18px]">
                  {selectedCustomer.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-playfair text-[22px] font-bold text-white">{selectedCustomer.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-bold text-[#c5a059] bg-[#c5a059]/10 px-2 py-0.5 rounded border border-[#c5a059]/40">
                      {selectedCustomer.tier}
                    </span>
                    <span className="text-[11px] text-[#8e8e93]">Member since {selectedCustomer.joinedDate}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-[#8e8e93] hover:text-white p-1">✕</button>
            </div>

            <div className="space-y-4 text-[13px]">
              <div className="grid grid-cols-3 gap-3 bg-[#1c1c1c] p-3.5 rounded-xl border border-[#262626] text-center font-mono">
                <div>
                  <span className="text-[10px] text-[#8e8e93] uppercase font-sans">Lifetime Value</span>
                  <div className="font-bold text-white text-[15px] mt-0.5">₹{selectedCustomer.totalSpend.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#8e8e93] uppercase font-sans">Reservations</span>
                  <div className="font-bold text-white text-[15px] mt-0.5">{selectedCustomer.totalBookings} Stays</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#8e8e93] uppercase font-sans">Reward Points</span>
                  <div className="font-bold text-[#c5a059] text-[15px] mt-0.5">{selectedCustomer.loyaltyPoints.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div className="bg-[#1c1c1c] p-3 rounded-lg border border-[#262626]">
                <span className="text-[10px] uppercase font-bold text-[#8e8e93]">Special Dietary & Suite Preferences</span>
                <p className="text-white mt-1">🍽️ {selectedCustomer.dietaryPreference}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedCustomer.specialPreferences.map((pref) => (
                    <span key={pref} className="text-[11px] bg-black text-[#c5a059] px-2 py-0.5 rounded border border-[#c5a059]/30">
                      ✓ {pref}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#1c1c1c] p-3 rounded-lg border border-[#262626]">
                <span className="text-[10px] uppercase font-bold text-[#8e8e93]">Preferred Indian Hotel Property</span>
                <p className="text-white font-medium mt-0.5">🏨 {selectedCustomer.favoriteHotel}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center pt-4 border-t border-[#262626]">
              <button
                onClick={() => handleAwardBonusPoints(selectedCustomer)}
                className="bg-[#1c1c1c] hover:bg-[#262626] text-[#c5a059] border border-[#c5a059]/50 px-3.5 py-2 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer"
              >
                + Issue 2,500 Courtesy Points
              </button>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="bg-[#c5a059] text-black px-4 py-2 rounded-lg text-[12px] font-semibold cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bonus Toast */}
      {bonusPointsAwarded && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1c1c] border border-[#c5a059] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom">
          <span className="material-symbols-outlined text-[#c5a059]">card_giftcard</span>
          <span className="text-[13px]">{bonusPointsAwarded}</span>
        </div>
      )}
    </div>
  );
};
