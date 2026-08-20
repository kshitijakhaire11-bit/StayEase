import React, { useState } from 'react';
import { AdminTab, AdminRole } from '../../types/admin';

interface AdminHeaderProps {
  selectedHotelId: string;
  setSelectedHotelId: (id: string) => void;
  hotelsList: Array<{ id: string; name: string; city: string }>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenNewBookingModal: () => void;
  onSwitchToGuestPortal: () => void;
  onLogout?: () => void;
  activeTab: AdminTab;
  currentRole: AdminRole;
  pendingRefundsCount: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  selectedHotelId,
  setSelectedHotelId,
  hotelsList,
  searchQuery,
  setSearchQuery,
  onOpenNewBookingModal,
  onSwitchToGuestPortal,
  onLogout,
  activeTab,
  currentRole,
  pendingRefundsCount,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);

  const handleExport = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3000);
  };

  const getTabTitle = (tab: AdminTab) => {
    switch (tab) {
      case 'overview': return { title: 'Executive Overview', desc: 'Real-time performance, revenue velocity & occupancy analytics across India' };
      case 'bookings': return { title: 'Bookings & Folios', desc: 'Manage reservations, guest check-ins, tax invoices & folios' };
      case 'inventory': return { title: 'Room Inventory & Tape Chart', desc: 'Live room matrix, housekeeping states & rate plan modifiers' };
      case 'customers': return { title: 'Guests & VIP CRM', desc: 'High-net-worth guest directory, Aadhaar KYC verification & stay history' };
      case 'payments': return { title: 'Payments & Settlements', desc: 'Unified payment gateway transactions, GST 18% ledger & hotel payouts' };
      case 'refunds': return { title: 'Instant Refund Engine', desc: 'Automated SLA dispute resolution & instant UPI/Bank reversal dispatch' };
      case 'reviews': return { title: 'Reviews & Reputation', desc: 'Verified guest ratings, cleanliness scores & GM response publisher' };
      case 'offers': return { title: 'Offers & Campaigns', desc: 'Dynamic coupon codes, corporate discounts & seasonal promotional surge' };
      case 'system': return { title: 'System Health & Audit Logs', desc: 'API latency gauges, PMS bridge status & security audit trail' };
      default: return { title: 'Administration Dashboard', desc: 'Hospitality Control Console' };
    }
  };

  const headerMeta = getTabTitle(activeTab);

  return (
    <header className="bg-[#0f0f0f] border-b border-[#262626] sticky top-0 z-30 px-4 md:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left: Tab Title & Property Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-playfair text-[20px] md:text-[22px] font-bold text-white tracking-tight">
              {headerMeta.title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE IST
            </span>
          </div>
          <p className="text-[12px] text-[#8e8e93] hidden md:block">
            {headerMeta.desc}
          </p>
        </div>

        {/* Property Selector Dropdown */}
        <div className="flex items-center gap-2 bg-[#141414] border border-[#262626] rounded-lg px-2.5 py-1.5">
          <span className="material-symbols-outlined text-[16px] text-[#c5a059]">domain</span>
          <select
            value={selectedHotelId}
            onChange={(e) => setSelectedHotelId(e.target.value)}
            className="bg-transparent text-white text-[12px] font-medium outline-hidden cursor-pointer"
          >
            {hotelsList.map((hotel) => (
              <option key={hotel.id} value={hotel.id} className="bg-[#141414] text-white">
                {hotel.name} {hotel.city !== 'All' ? `(${hotel.city})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Search, Global Actions, Notifications & Guest Portal Switch */}
      <div className="flex items-center gap-2.5 flex-wrap md:flex-nowrap justify-end">
        {/* Global Search */}
        <div className="relative w-full sm:w-60 md:w-64">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-[#8e8e93]">
            search
          </span>
          <input
            type="text"
            placeholder="Search ID, guest, PNR..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] border border-[#262626] focus:border-[#c5a059] rounded-lg pl-8 pr-3 py-1.5 text-[12px] text-white placeholder-[#8e8e93] outline-hidden transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8e8e93] hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Export Night Audit Button */}
        <button
          onClick={handleExport}
          className="hidden lg:flex items-center gap-1.5 bg-[#141414] hover:bg-[#1f1f1f] text-[#c5a059] border border-[#333] px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer"
          title="Export CSV Night Audit Report"
        >
          <span className="material-symbols-outlined text-[16px]">file_download</span>
          <span>Night Audit</span>
        </button>

        {/* Quick New Booking / Walk-in Button */}
        <button
          onClick={onOpenNewBookingModal}
          className="flex items-center gap-1.5 bg-[#c5a059] hover:bg-[#dfba73] text-black px-3.5 py-1.5 rounded-lg text-[12px] font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>New Reservation</span>
        </button>

        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-lg bg-[#141414] border border-[#262626] hover:border-[#c5a059]/50 flex items-center justify-center text-[#8e8e93] hover:text-white transition-colors cursor-pointer relative"
          >
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            {pendingRefundsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                {pendingRefundsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#141414] border border-[#262626] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#262626] mb-2">
                <span className="text-[12px] font-bold text-white">Operations Alerts</span>
                <span className="text-[10px] text-[#c5a059] cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-2 text-[12px]">
                <div className="p-2 rounded bg-[#1c1c1c] border-l-2 border-rose-500">
                  <div className="font-semibold text-white flex justify-between">
                    <span>Refund SLA Alert</span>
                    <span className="text-[10px] text-[#8e8e93]">3m ago</span>
                  </div>
                  <p className="text-[11px] text-[#a3a3a3] mt-0.5">Sanjay Deshmukh requested refund of ₹14,800. SLA expires in 3.5 hrs.</p>
                </div>
                <div className="p-2 rounded bg-[#1c1c1c] border-l-2 border-[#c5a059]">
                  <div className="font-semibold text-white flex justify-between">
                    <span>VIP Arrival</span>
                    <span className="text-[10px] text-[#8e8e93]">15m ago</span>
                  </div>
                  <p className="text-[11px] text-[#a3a3a3] mt-0.5">Alexander Wright (Elite Black) checked into Suite 408 at Taj Lands End.</p>
                </div>
                <div className="p-2 rounded bg-[#1c1c1c] border-l-2 border-emerald-500">
                  <div className="font-semibold text-white flex justify-between">
                    <span>GST Settlement Batch</span>
                    <span className="text-[10px] text-[#8e8e93]">1h ago</span>
                  </div>
                  <p className="text-[11px] text-[#a3a3a3] mt-0.5">₹42.8L payout batch processed via Razorpay Route to Taj HDFC account.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Switch to Guest Portal Button */}
        <button
          onClick={onSwitchToGuestPortal}
          className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#262626] text-white border border-[#333] px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer shrink-0"
          title="Open consumer hotel booking view"
        >
          <span className="material-symbols-outlined text-[16px] text-[#c5a059]">open_in_new</span>
          <span className="hidden sm:inline">Guest Portal</span>
        </button>

        {/* Lock Terminal / Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-800/80 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer shrink-0"
            title="Lock terminal & end administrator session"
          >
            <span className="material-symbols-outlined text-[16px]">lock_clock</span>
            <span className="hidden sm:inline">Lock Terminal</span>
          </button>
        )}
      </div>

      {/* Export Toast Notification */}
      {showExportToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1c1c] border border-[#c5a059] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-200">
          <span className="material-symbols-outlined text-emerald-400">check_circle</span>
          <div>
            <div className="text-[13px] font-bold">Night Audit Report Generated</div>
            <div className="text-[11px] text-[#8e8e93]">Exported 1,420 bookings & GST ledger to stayease_audit_2026-08-20.csv</div>
          </div>
        </div>
      )}
    </header>
  );
};
