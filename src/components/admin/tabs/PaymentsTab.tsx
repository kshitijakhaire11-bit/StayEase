import React, { useState } from 'react';
import { AdminTransaction } from '../../../types/admin';

interface PaymentsTabProps {
  transactions: AdminTransaction[];
  searchQuery: string;
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({
  transactions,
  searchQuery,
}) => {
  const [selectedGatewayFilter, setSelectedGatewayFilter] = useState<string>('All');
  const [selectedTxn, setSelectedTxn] = useState<AdminTransaction | null>(null);
  const [settlementTriggered, setSettlementTriggered] = useState<string | null>(null);

  const filteredTxns = transactions.filter((t) => {
    const matchesGateway = selectedGatewayFilter === 'All' || t.gateway === selectedGatewayFilter;
    const matchesSearch = 
      !searchQuery ||
      t.txnId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.utrOrRrn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGateway && matchesSearch;
  });

  const totalCaptured = transactions
    .filter(t => t.status === 'Captured & Settled')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalGST = transactions
    .filter(t => t.status === 'Captured & Settled')
    .reduce((acc, t) => acc + t.gstAmount, 0);

  const totalPlatformFees = transactions
    .filter(t => t.status === 'Captured & Settled')
    .reduce((acc, t) => acc + t.platformFee, 0);

  const totalHotelPayouts = transactions
    .filter(t => t.status === 'Captured & Settled')
    .reduce((acc, t) => acc + t.hotelPayout, 0);

  const handleTriggerSettlement = () => {
    setSettlementTriggered('Dispatched T+1 Settlement batch via Razorpay Route & Juspay to 14 Hotel Accounts (Total: ₹42.8 Lakhs)');
    setTimeout(() => setSettlementTriggered(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4.5">
          <span className="text-[11px] text-[#8e8e93] uppercase font-bold">Total Payment Volume Captured</span>
          <div className="font-playfair text-[24px] font-bold text-white mt-1">₹{totalCaptured.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-emerald-400 font-medium">100% Reconciled</span>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4.5">
          <span className="text-[11px] text-[#8e8e93] uppercase font-bold">GST 18% Output Ledger</span>
          <div className="font-playfair text-[24px] font-bold text-[#c5a059] mt-1">₹{totalGST.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-[#8e8e93]">CGST: 9% | SGST: 9% Split</span>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4.5">
          <span className="text-[11px] text-[#8e8e93] uppercase font-bold">Platform Net Commission (5%)</span>
          <div className="font-playfair text-[24px] font-bold text-emerald-400 mt-1">₹{totalPlatformFees.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-[#8e8e93]">Net of 1% TDS (Sec 194-O)</span>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4.5">
          <span className="text-[11px] text-[#8e8e93] uppercase font-bold">Hotel Partner Net Payout</span>
          <div className="font-playfair text-[24px] font-bold text-white mt-1">₹{totalHotelPayouts.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-[#8e8e93]">T+1 Bank Automated Dispatch</span>
        </div>
      </div>

      {/* Gateway Controls Bar */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] uppercase font-bold text-[#8e8e93] mr-1">Gateway:</span>
          {['All', 'Razorpay', 'Juspay', 'BillDesk', 'Stripe India'].map((gw) => (
            <button
              key={gw}
              onClick={() => setSelectedGatewayFilter(gw)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
                selectedGatewayFilter === gw
                  ? 'bg-[#c5a059] text-black font-semibold'
                  : 'bg-[#1c1c1c] text-[#a3a3a3] hover:text-white border border-[#262626]'
              }`}
            >
              {gw}
            </button>
          ))}
        </div>

        <button
          onClick={handleTriggerSettlement}
          className="flex items-center gap-1.5 bg-[#c5a059] hover:bg-[#dfba73] text-black px-4 py-2 rounded-lg text-[12px] font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">account_balance</span>
          <span>Execute Daily Payout Batch</span>
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="bg-[#101010] border-b border-[#262626] text-[#8e8e93] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Transaction ID & UTR</th>
                <th className="py-3 px-4">Linked Booking</th>
                <th className="py-3 px-4">Guest Name</th>
                <th className="py-3 px-4">Gateway & Payment Method</th>
                <th className="py-3 px-4">Gross (INR)</th>
                <th className="py-3 px-4">GST (18%)</th>
                <th className="py-3 px-4">Hotel Net Payout</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {filteredTxns.map((txn) => (
                <tr key={txn.txnId} className="hover:bg-[#1a1a1a]/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-white">{txn.txnId}</div>
                    <div className="text-[11px] text-[#8e8e93]">{txn.utrOrRrn}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <span className="text-[#c5a059] font-bold">{txn.bookingId}</span>
                    <div className="text-[10px] text-[#8e8e93]">{txn.timestamp}</div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-white">
                    {txn.guestName}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-white font-medium">{txn.gateway}</div>
                    <div className="text-[11px] text-[#8e8e93]">{txn.method}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    ₹{txn.amount.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[#8e8e93]">
                    ₹{txn.gstAmount.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                    ₹{txn.hotelPayout.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                      txn.status === 'Captured & Settled' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      txn.status === 'Refund Reversal' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                      'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {txn.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedTxn(txn)}
                      className="p-1.5 rounded bg-[#1c1c1c] hover:bg-[#262626] text-[#c5a059] border border-[#333] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">info</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-[#262626] pb-4 mb-4">
              <h3 className="font-playfair text-[20px] font-bold text-white">Payment Ledger Audit</h3>
              <button onClick={() => setSelectedTxn(null)} className="text-[#8e8e93] hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-[13px]">
              <div className="bg-[#1c1c1c] p-3 rounded-lg border border-[#262626] space-y-1.5 font-mono text-[12px]">
                <div className="flex justify-between text-[#8e8e93]">
                  <span>Gateway Ref / RRN:</span>
                  <span className="text-white">{selectedTxn.utrOrRrn}</span>
                </div>
                <div className="flex justify-between text-[#8e8e93]">
                  <span>Method:</span>
                  <span className="text-white">{selectedTxn.method}</span>
                </div>
                <div className="flex justify-between text-[#8e8e93]">
                  <span>Timestamp:</span>
                  <span className="text-white">{selectedTxn.timestamp}</span>
                </div>
              </div>

              <div className="bg-[#1c1c1c] p-3.5 rounded-lg border border-[#262626] space-y-2">
                <div className="flex justify-between text-white">
                  <span>Gross Captured Amount:</span>
                  <span className="font-bold font-mono">₹{selectedTxn.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#8e8e93]">
                  <span>GST (18% Slab):</span>
                  <span className="font-mono">₹{selectedTxn.gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#8e8e93]">
                  <span>Platform Gateway & Tech Fee (5%):</span>
                  <span className="font-mono">₹{selectedTxn.platformFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold pt-2 border-t border-[#262626] text-[14px]">
                  <span>Hotel Partner Direct Payout:</span>
                  <span className="font-mono">₹{selectedTxn.hotelPayout.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedTxn(null)}
                className="bg-[#c5a059] text-black px-4 py-2 rounded-lg text-[12px] font-semibold cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settlement Toast */}
      {settlementTriggered && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1c1c] border border-emerald-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom">
          <span className="material-symbols-outlined text-emerald-400">check_circle</span>
          <span className="text-[13px]">{settlementTriggered}</span>
        </div>
      )}
    </div>
  );
};
