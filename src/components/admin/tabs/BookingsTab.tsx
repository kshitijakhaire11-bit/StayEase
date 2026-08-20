import React, { useState } from 'react';
import { AdminBooking, BookingStatus } from '../../../types/admin';

interface BookingsTabProps {
  bookings: AdminBooking[];
  onUpdateBookingStatus: (id: string, newStatus: BookingStatus) => void;
  onOpenNewBookingModal: () => void;
  searchQuery: string;
}

export const BookingsTab: React.FC<BookingsTabProps> = ({
  bookings,
  onUpdateBookingStatus,
  onOpenNewBookingModal,
  searchQuery,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [selectedBookingForFolio, setSelectedBookingForFolio] = useState<AdminBooking | null>(null);
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<AdminBooking | null>(null);
  const [showStatusToast, setShowStatusToast] = useState<string | null>(null);

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = selectedStatusFilter === 'All' || b.bookingStatus === selectedStatusFilter;
    const matchesSearch = 
      !searchQuery ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guestPhone.includes(searchQuery) ||
      b.pnr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.hotelName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (booking: AdminBooking, newStatus: BookingStatus) => {
    onUpdateBookingStatus(booking.id, newStatus);
    setShowStatusToast(`Booking ${booking.id} updated to ${newStatus}`);
    setTimeout(() => setShowStatusToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Controls & Filter Bar */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {['All', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedStatusFilter === status
                  ? 'bg-[#c5a059] text-black font-semibold shadow-md'
                  : 'bg-[#1c1c1c] text-[#a3a3a3] hover:text-white border border-[#262626]'
              }`}
            >
              {status} {status === 'All' ? `(${bookings.length})` : `(${bookings.filter(b => b.bookingStatus === status).length})`}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," + 
                ["Booking ID,Guest Name,Hotel,Room,Check-In,Check-Out,Amount,Payment,Status"].concat(
                  filteredBookings.map(b => `${b.id},${b.guestName},"${b.hotelName}",${b.roomNumber},${b.checkIn},${b.checkOut},${b.netPayable},${b.paymentMethod},${b.bookingStatus}`)
                ).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `stayease_bookings_${new Date().toISOString().slice(0,10)}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center gap-1.5 bg-[#1c1c1c] hover:bg-[#262626] text-white border border-[#333] px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#c5a059]">download</span>
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenNewBookingModal}
            className="flex items-center gap-1.5 bg-[#c5a059] hover:bg-[#dfba73] text-black px-3.5 py-1.5 rounded-lg text-[12px] font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="bg-[#101010] border-b border-[#262626] text-[#8e8e93] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Booking ID / PNR</th>
                <th className="py-3 px-4">Primary Guest & Tier</th>
                <th className="py-3 px-4">Hotel Property & Room</th>
                <th className="py-3 px-4">Stay Dates</th>
                <th className="py-3 px-4">Amount & Taxes</th>
                <th className="py-3 px-4">Payment & Gateway</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#8e8e93]">
                    <span className="material-symbols-outlined text-[36px] text-[#444] mb-2">search_off</span>
                    <p>No bookings found matching your current filter criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[#1a1a1a]/60 transition-colors">
                    {/* Booking ID & PNR */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-white text-[13px] flex items-center gap-1.5">
                        <span>{booking.id}</span>
                        {booking.idVerified && (
                          <span className="material-symbols-outlined filled text-[#c5a059] text-[15px]" title="Aadhaar/ID Verified">
                            verified
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-[#8e8e93]">{booking.pnr}</div>
                    </td>

                    {/* Guest Name & Tier */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{booking.guestName}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30">
                          {booking.guestTier}
                        </span>
                        <span className="text-[11px] text-[#8e8e93]">{booking.guestPhone}</span>
                      </div>
                    </td>

                    {/* Hotel Property & Room */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white line-clamp-1">{booking.hotelName}</div>
                      <div className="text-[11px] text-[#c5a059] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">meeting_room</span>
                        <span>{booking.roomNumber} ({booking.roomType})</span>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4">
                      <div className="text-white font-medium">{booking.checkIn} to {booking.checkOut}</div>
                      <div className="text-[11px] text-[#8e8e93]">{booking.nights} Nights • {booking.adults} Adults</div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-white">₹{booking.netPayable.toLocaleString('en-IN')}</div>
                      <div className="text-[11px] text-[#8e8e93]">GST: ₹{booking.taxes.toLocaleString('en-IN')}</div>
                    </td>

                    {/* Payment */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          booking.paymentStatus === 'Paid' ? 'bg-emerald-400' :
                          booking.paymentStatus === 'Refunded' ? 'bg-rose-400' : 'bg-amber-400'
                        }`} />
                        <span className="text-white font-medium">{booking.paymentMethod}</span>
                      </div>
                      <div className="text-[11px] text-[#8e8e93] font-mono">{booking.paymentGateway}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        booking.bookingStatus === 'Confirmed' ? 'bg-blue-950/80 text-blue-400 border border-blue-800' :
                        booking.bookingStatus === 'Checked In' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' :
                        booking.bookingStatus === 'Checked Out' ? 'bg-gray-800 text-gray-300 border border-gray-700' :
                        'bg-rose-950/80 text-rose-400 border border-rose-800'
                      }`}>
                        {booking.bookingStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Check-in or Check-out Button */}
                        {booking.bookingStatus === 'Confirmed' && (
                          <button
                            onClick={() => handleStatusChange(booking, 'Checked In')}
                            className="bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-700 px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer"
                            title="Check In Guest & Issue Keycard"
                          >
                            Check In
                          </button>
                        )}
                        {booking.bookingStatus === 'Checked In' && (
                          <button
                            onClick={() => handleStatusChange(booking, 'Checked Out')}
                            className="bg-[#262626] hover:bg-[#333] text-white border border-[#444] px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer"
                            title="Check Out & Settle Folio"
                          >
                            Check Out
                          </button>
                        )}

                        {/* Folio / Invoice Button */}
                        <button
                          onClick={() => setSelectedBookingForFolio(booking)}
                          className="p-1.5 rounded bg-[#1c1c1c] hover:bg-[#262626] text-[#c5a059] border border-[#333] cursor-pointer"
                          title="Generate Tax Invoice & GST Folio"
                        >
                          <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                        </button>

                        {/* Details Modal Trigger */}
                        <button
                          onClick={() => setSelectedBookingForDetails(booking)}
                          className="p-1.5 rounded bg-[#1c1c1c] hover:bg-[#262626] text-white border border-[#333] cursor-pointer"
                          title="View Full Booking Dossier"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Invoice & GST Folio Modal */}
      {selectedBookingForFolio && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b border-[#262626] pb-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-playfair text-[22px] font-bold text-white">StayEase Hospitality Folio</span>
                  <span className="bg-emerald-950 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-800">
                    TAX INVOICE (GST)
                  </span>
                </div>
                <p className="text-[12px] text-[#8e8e93]">GSTIN: 27AABCS9912K1Z9 • SAC Code: 996311 (Accommodation)</p>
                <p className="text-[12px] text-[#8e8e93] mt-0.5">{selectedBookingForFolio.hotelName}, {selectedBookingForFolio.city}</p>
              </div>

              <button
                onClick={() => setSelectedBookingForFolio(null)}
                className="text-[#8e8e93] hover:text-white p-1 rounded"
              >
                ✕
              </button>
            </div>

            {/* Guest & Invoice Meta Grid */}
            <div className="grid grid-cols-2 gap-4 bg-[#1c1c1c] p-4 rounded-xl border border-[#262626] mb-6 text-[12px]">
              <div>
                <span className="text-[#8e8e93] uppercase text-[10px] tracking-wider">Billed To (Primary Guest)</span>
                <p className="font-bold text-white mt-0.5">{selectedBookingForFolio.guestName}</p>
                <p className="text-[#a3a3a3]">{selectedBookingForFolio.guestEmail}</p>
                <p className="text-[#a3a3a3]">{selectedBookingForFolio.idProofType}: {selectedBookingForFolio.idProofNumberMasked}</p>
              </div>
              <div className="text-right">
                <span className="text-[#8e8e93] uppercase text-[10px] tracking-wider">Folio / Reference</span>
                <p className="font-mono font-bold text-[#c5a059] mt-0.5">{selectedBookingForFolio.id}</p>
                <p className="text-[#a3a3a3]">PNR: {selectedBookingForFolio.pnr}</p>
                <p className="text-[#a3a3a3]">Room: {selectedBookingForFolio.roomNumber} ({selectedBookingForFolio.nights} Nights)</p>
              </div>
            </div>

            {/* Itemized Charge Breakdown */}
            <div className="space-y-2 mb-6 text-[13px]">
              <div className="flex justify-between py-2 border-b border-[#262626] text-[#8e8e93]">
                <span>Description</span>
                <span>Amount (INR)</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Room Tariff ({selectedBookingForFolio.roomType} x {selectedBookingForFolio.nights}N)</span>
                <span className="font-mono">₹{selectedBookingForFolio.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#8e8e93]">
                <span>Central GST (CGST 9%)</span>
                <span className="font-mono">₹{(selectedBookingForFolio.taxes / 2).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#8e8e93]">
                <span>State GST (SGST 9%)</span>
                <span className="font-mono">₹{(selectedBookingForFolio.taxes / 2).toLocaleString('en-IN')}</span>
              </div>
              {selectedBookingForFolio.discount > 0 && (
                <div className="flex justify-between text-[#c5a059]">
                  <span>StayEase Privilege Discount</span>
                  <span className="font-mono">-₹{selectedBookingForFolio.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-[#262626] font-bold text-white text-[16px]">
                <span>Total Settled & Captured</span>
                <span className="font-playfair text-[20px] text-[#c5a059]">₹{selectedBookingForFolio.netPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#262626]">
              <span className="text-[11px] text-[#8e8e93]">Paid via {selectedBookingForFolio.paymentMethod} ({selectedBookingForFolio.paymentGateway})</span>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    alert(`Folio ${selectedBookingForFolio.id} dispatched via WhatsApp & Email to ${selectedBookingForFolio.guestEmail}`);
                    setSelectedBookingForFolio(null);
                  }}
                  className="bg-[#1c1c1c] hover:bg-[#262626] text-white border border-[#333] px-4 py-2 rounded-lg text-[12px] font-medium transition-colors cursor-pointer"
                >
                  Send to Guest (WhatsApp / Email)
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-[#c5a059] hover:bg-[#dfba73] text-black px-4 py-2 rounded-lg text-[12px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Print Official Tax Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Full Dossier Detail Modal */}
      {selectedBookingForDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-[#262626] pb-4 mb-4">
              <div>
                <h3 className="font-playfair text-[20px] font-bold text-white">Booking Dossier • {selectedBookingForDetails.id}</h3>
                <span className="text-[11px] text-[#c5a059] font-mono">Booked on {selectedBookingForDetails.bookedAt}</span>
              </div>
              <button onClick={() => setSelectedBookingForDetails(null)} className="text-[#8e8e93] hover:text-white">✕</button>
            </div>

            <div className="space-y-4 text-[13px]">
              <div className="bg-[#1c1c1c] p-3 rounded-lg border border-[#262626]">
                <span className="text-[10px] uppercase font-bold text-[#8e8e93]">Special Guest Requests</span>
                <p className="text-white mt-1">"{selectedBookingForDetails.specialRequests}"</p>
              </div>

              <div className="bg-[#1c1c1c] p-3 rounded-lg border border-[#262626]">
                <span className="text-[10px] uppercase font-bold text-[#8e8e93]">Front Desk & Concierge Notes</span>
                <p className="text-white mt-1">{selectedBookingForDetails.notes || 'No internal notes registered.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <div className="bg-[#101010] p-3 rounded border border-[#222]">
                  <span className="text-[#8e8e93]">Check-in / Check-out</span>
                  <div className="font-bold text-white mt-0.5">{selectedBookingForDetails.checkIn} to {selectedBookingForDetails.checkOut}</div>
                </div>
                <div className="bg-[#101010] p-3 rounded border border-[#222]">
                  <span className="text-[#8e8e93]">Identity Proof</span>
                  <div className="font-bold text-emerald-400 mt-0.5">{selectedBookingForDetails.idProofType} ({selectedBookingForDetails.idProofNumberMasked})</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedBookingForDetails(null)}
                className="bg-[#c5a059] text-black px-4 py-2 rounded-lg text-[12px] font-semibold cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Toast */}
      {showStatusToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1c1c] border border-emerald-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom">
          <span className="material-symbols-outlined text-emerald-400">check_circle</span>
          <span className="text-[13px]">{showStatusToast}</span>
        </div>
      )}
    </div>
  );
};
