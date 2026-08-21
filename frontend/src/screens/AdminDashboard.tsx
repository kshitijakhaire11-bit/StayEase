import React, { useState } from 'react';
import { 
  AdminTab, 
  AdminRole, 
  AdminBooking, 
  AdminRoom, 
  AdminCustomer, 
  AdminTransaction, 
  AdminRefund, 
  AdminReview, 
  AdminOffer, 
  AdminSystemStatus, 
  AdminAuditLog,
  BookingStatus,
  RoomStatus 
} from '../types/admin';
import { 
  HOTELS_ADMIN_LIST, 
  INITIAL_ADMIN_BOOKINGS, 
  INITIAL_ADMIN_ROOMS, 
  INITIAL_ADMIN_CUSTOMERS, 
  INITIAL_ADMIN_TRANSACTIONS, 
  INITIAL_ADMIN_REFUNDS, 
  INITIAL_ADMIN_REVIEWS, 
  INITIAL_ADMIN_OFFERS, 
  INITIAL_ADMIN_SYSTEM_STATUS, 
  INITIAL_ADMIN_AUDIT_LOGS 
} from '../data/adminMockData';

import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { OverviewTab } from '../components/admin/tabs/OverviewTab';
import { BookingsTab } from '../components/admin/tabs/BookingsTab';
import { InventoryTab } from '../components/admin/tabs/InventoryTab';
import { CustomersTab } from '../components/admin/tabs/CustomersTab';
import { PaymentsTab } from '../components/admin/tabs/PaymentsTab';
import { RefundsTab } from '../components/admin/tabs/RefundsTab';
import { ReviewsTab } from '../components/admin/tabs/ReviewsTab';
import { OffersTab } from '../components/admin/tabs/OffersTab';
import { SystemTab } from '../components/admin/tabs/SystemTab';
import { AdminAuthSession } from './AdminLoginScreen';

interface AdminDashboardProps {
  onSwitchToGuestPortal: () => void;
  onLogout?: () => void;
  adminSession?: AdminAuthSession | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSwitchToGuestPortal,
  onLogout,
  adminSession,
}) => {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [currentRole, setCurrentRole] = useState<AdminRole>(adminSession?.role || 'super_admin');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState<string>(adminSession?.hotelAccess || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  // Primary Data Collections
  const [bookings, setBookings] = useState<AdminBooking[]>(INITIAL_ADMIN_BOOKINGS);
  const [rooms, setRooms] = useState<AdminRoom[]>(INITIAL_ADMIN_ROOMS);
  const [customers, setCustomers] = useState<AdminCustomer[]>(INITIAL_ADMIN_CUSTOMERS);
  const [transactions, setTransactions] = useState<AdminTransaction[]>(INITIAL_ADMIN_TRANSACTIONS);
  const [refunds, setRefunds] = useState<AdminRefund[]>(INITIAL_ADMIN_REFUNDS);
  const [reviews, setReviews] = useState<AdminReview[]>(INITIAL_ADMIN_REVIEWS);
  const [offers, setOffers] = useState<AdminOffer[]>(INITIAL_ADMIN_OFFERS);
  const [systemStatus] = useState<AdminSystemStatus>(INITIAL_ADMIN_SYSTEM_STATUS);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(INITIAL_ADMIN_AUDIT_LOGS);

  // New Reservation Modal State
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newHotelId, setNewHotelId] = useState('taj-lands-end');
  const [newRoomNumber, setNewRoomNumber] = useState('204');
  const [newRoomType, setNewRoomType] = useState('Deluxe Sea View');
  const [newCheckIn, setNewCheckIn] = useState('2026-08-22');
  const [newCheckOut, setNewCheckOut] = useState('2026-08-25');
  const [newAmount, setNewAmount] = useState('42000');
  const [newPaymentMethod, setNewPaymentMethod] = useState<'UPI' | 'Credit Card' | 'NetBanking' | 'Direct PMS BillDesk'>('UPI');

  // Selected Hotel Display Name
  const selectedHotel = HOTELS_ADMIN_LIST.find(h => h.id === selectedHotelId);
  const selectedHotelName = selectedHotel ? selectedHotel.name : 'Pan-India Portfolio';

  // Booking Status Handler
  const handleUpdateBookingStatus = (id: string, newStatus: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, bookingStatus: newStatus } : b));
    
    // Log audit
    const newLog: AdminAuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      user: 'Siddharth Tagore',
      role: currentRole,
      action: `BOOKING_STATUS_CHANGE_${newStatus.toUpperCase().replace(/\s+/g, '_')}`,
      entity: 'Booking',
      entityId: id,
      ipAddress: '103.21.144.92 (Mumbai, IN)',
      severity: 'info',
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Room Status Handler
  const handleUpdateRoomStatus = (roomId: string, newStatus: RoomStatus) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: newStatus } : r));
    
    const newLog: AdminAuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      user: 'Siddharth Tagore',
      role: currentRole,
      action: `ROOM_STATUS_UPDATED_${newStatus.toUpperCase().replace(/\s+/g, '_')}`,
      entity: 'Room Unit',
      entityId: roomId,
      ipAddress: '103.21.144.92 (Mumbai, IN)',
      severity: 'info',
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleAddRoom = (newRoom: AdminRoom) => {
    setRooms(prev => [newRoom, ...prev]);
  };

  // Refund Handlers
  const handleApproveRefund = (refundId: string) => {
    const refund = refunds.find(r => r.refundId === refundId);
    if (!refund) return;

    const refNo = `rfnd_${Math.random().toString(36).substring(2, 10)}`;
    setRefunds(prev => prev.map(r => r.refundId === refundId ? { 
      ...r, 
      status: 'Completed', 
      processedBy: 'Siddharth Tagore',
      gatewayRefundRef: refNo
    } : r));

    // Update associated booking
    setBookings(prev => prev.map(b => b.id === refund.bookingId ? {
      ...b,
      bookingStatus: 'Cancelled',
      paymentStatus: 'Refunded'
    } : b));

    // Log audit
    const newLog: AdminAuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      user: 'Siddharth Tagore',
      role: currentRole,
      action: 'INSTANT_REFUND_APPROVED_DISPATCHED',
      entity: 'Refund Reversal',
      entityId: refundId,
      ipAddress: '103.21.144.92 (Mumbai, IN)',
      severity: 'warning',
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleRejectRefund = (refundId: string) => {
    setRefunds(prev => prev.map(r => r.refundId === refundId ? { ...r, status: 'Rejected' } : r));
  };

  // Review Reply Handler
  const handleReplyReview = (reviewId: string, replyMessage: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? {
      ...r,
      response: {
        respondedAt: new Date().toISOString().slice(0, 10),
        responderName: 'Siddharth Tagore',
        message: replyMessage
      }
    } : r));
  };

  // Offer Handlers
  const handleAddOffer = (newOffer: AdminOffer) => {
    setOffers(prev => [newOffer, ...prev]);
  };

  const handleToggleOffer = (offerId: string) => {
    setOffers(prev => prev.map(o => o.id === offerId ? { ...o, isActive: !o.isActive } : o));
  };

  // New Reservation Submission Handler
  const handleCreateNewBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName || !newGuestPhone) return;

    const parsedAmount = parseFloat(newAmount) || 28000;
    const taxes = Math.round(parsedAmount * 0.18);
    const netPayable = parsedAmount + taxes;
    const bookingId = `SE-BKG-${Math.floor(100000 + Math.random() * 900000)}`;
    const pnr = `SE${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const hotelObj = HOTELS_ADMIN_LIST.find(h => h.id === newHotelId);

    const newBooking: AdminBooking = {
      id: bookingId,
      pnr,
      hotelId: newHotelId,
      hotelName: hotelObj ? hotelObj.name : 'Taj Lands End, Mumbai',
      city: hotelObj ? hotelObj.city : 'Mumbai',
      guestName: newGuestName,
      guestEmail: newGuestEmail || 'guest@stayease.in',
      guestPhone: newGuestPhone,
      guestTier: 'Gold',
      idVerified: true,
      idProofType: 'Aadhaar Card',
      idProofNumberMasked: 'XXXX-XXXX-9842',
      roomNumber: newRoomNumber,
      roomType: newRoomType,
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      nights: 3,
      adults: 2,
      children: 0,
      amount: parsedAmount,
      taxes,
      discount: 0,
      netPayable,
      paymentStatus: 'Paid',
      paymentMethod: newPaymentMethod,
      paymentGateway: 'Razorpay Route',
      bookingStatus: 'Confirmed',
      bookedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      specialRequests: 'High floor room, quiet view, digital key card pre-provisioned.',
      notes: 'Direct Front Desk / Walk-in reservation.'
    };

    setBookings(prev => [newBooking, ...prev]);
    setShowNewBookingModal(false);

    // Reset fields
    setNewGuestName('');
    setNewGuestPhone('');
    setNewGuestEmail('');

    // Switch to bookings tab to see the fresh entry
    setActiveTab('bookings');
  };

  const pendingRefundsCount = refunds.filter(r => r.status === 'Pending Approval').length;
  const activeBookingsCount = bookings.filter(b => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked In').length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-row overflow-x-hidden font-sans selection:bg-[#c5a059]/30 selection:text-[#c5a059]">
      {/* Persistent Admin Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        pendingRefundsCount={pendingRefundsCount}
        activeBookingsCount={activeBookingsCount}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        adminSession={adminSession}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Sticky Header */}
        <AdminHeader
          selectedHotelId={selectedHotelId}
          setSelectedHotelId={setSelectedHotelId}
          hotelsList={HOTELS_ADMIN_LIST}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenNewBookingModal={() => setShowNewBookingModal(true)}
          onSwitchToGuestPortal={onSwitchToGuestPortal}
          onLogout={onLogout}
          activeTab={activeTab}
          currentRole={currentRole}
          pendingRefundsCount={pendingRefundsCount}
        />

        {/* Tab View Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'overview' && (
            <OverviewTab
              bookings={bookings}
              rooms={rooms}
              refunds={refunds}
              currentRole={currentRole}
              selectedHotelName={selectedHotelName}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingsTab
              bookings={bookings}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onOpenNewBookingModal={() => setShowNewBookingModal(true)}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryTab
              rooms={rooms}
              onUpdateRoomStatus={handleUpdateRoomStatus}
              onAddRoom={handleAddRoom}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersTab
              customers={customers}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentsTab
              transactions={transactions}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'refunds' && (
            <RefundsTab
              refunds={refunds}
              onApproveRefund={handleApproveRefund}
              onRejectRefund={handleRejectRefund}
            />
          )}

          {activeTab === 'reviews' && (
            <ReviewsTab
              reviews={reviews}
              onReplyReview={handleReplyReview}
            />
          )}

          {activeTab === 'offers' && (
            <OffersTab
              offers={offers}
              onAddOffer={handleAddOffer}
              onToggleOffer={handleToggleOffer}
            />
          )}

          {activeTab === 'system' && (
            <SystemTab
              systemStatus={systemStatus}
              auditLogs={auditLogs}
            />
          )}
        </main>
      </div>

      {/* New Reservation / Walk-in Modal */}
      {showNewBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#262626] pb-4 mb-4">
              <div>
                <span className="text-[11px] text-[#c5a059] uppercase font-bold tracking-wider">Front Desk Console</span>
                <h3 className="font-playfair text-[22px] font-bold text-white">Create New Reservation</h3>
              </div>
              <button onClick={() => setShowNewBookingModal(false)} className="text-[#8e8e93] hover:text-white p-1">✕</button>
            </div>

            <form onSubmit={handleCreateNewBooking} className="space-y-4 text-[13px]">
              <div>
                <label className="block text-[#8e8e93] mb-1">Primary Guest Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rohini Nambiar"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  required
                  className="w-full bg-[#1c1c1c] border border-[#333] text-white p-2.5 rounded-lg outline-hidden focus:border-[#c5a059]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8e8e93] mb-1">Phone (with +91) *</label>
                  <input
                    type="tel"
                    placeholder="+91 98200 12345"
                    value={newGuestPhone}
                    onChange={(e) => setNewGuestPhone(e.target.value)}
                    required
                    className="w-full bg-[#1c1c1c] border border-[#333] text-white p-2.5 rounded-lg outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#8e8e93] mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="guest@example.com"
                    value={newGuestEmail}
                    onChange={(e) => setNewGuestEmail(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-[#333] text-white p-2.5 rounded-lg outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8e8e93] mb-1">Property Destination</label>
                <select
                  value={newHotelId}
                  onChange={(e) => setNewHotelId(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-[#333] text-white p-2.5 rounded-lg outline-hidden cursor-pointer"
                >
                  {HOTELS_ADMIN_LIST.filter(h => h.id !== 'all').map(h => (
                    <option key={h.id} value={h.id}>{h.name} ({h.city})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8e8e93] mb-1">Room Assignment</label>
                  <input
                    type="text"
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    placeholder="e.g. 204 or 305"
                    className="w-full bg-[#1c1c1c] border border-[#333] text-white p-2.5 rounded-lg outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#8e8e93] mb-1">Room Category</label>
                  <input
                    type="text"
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-[#333] text-white p-2.5 rounded-lg outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8e8e93] mb-1">Check-in Date</label>
                  <input
                    type="date"
                    value={newCheckIn}
                    onChange={(e) => setNewCheckIn(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-[#333] text-white p-2.5 rounded-lg outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#8e8e93] mb-1">Check-out Date</label>
                  <input
                    type="date"
                    value={newCheckOut}
                    onChange={(e) => setNewCheckOut(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-[#333] text-white p-2.5 rounded-lg outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8e8e93] mb-1">Tariff (Excl. 18% GST)</label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-[#333] text-white p-2.5 rounded-lg outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#8e8e93] mb-1">Payment Method</label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value as any)}
                    className="w-full bg-[#1c1c1c] border border-[#333] text-white p-2.5 rounded-lg outline-hidden"
                  >
                    <option value="UPI">Instant UPI (GPay / PhonePe)</option>
                    <option value="Credit Card">Credit Card (Visa / Amex / RuPay)</option>
                    <option value="NetBanking">HDFC / ICICI Corporate NetBanking</option>
                    <option value="Direct PMS BillDesk">Direct PMS BillDesk POS</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setShowNewBookingModal(false)}
                  className="bg-[#1c1c1c] text-[#a3a3a3] hover:text-white px-4 py-2 rounded-lg text-[12px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#c5a059] hover:bg-[#dfba73] text-black px-4 py-2 rounded-lg text-[12px] font-semibold uppercase tracking-wider shadow-md"
                >
                  Confirm & Issue Folio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
