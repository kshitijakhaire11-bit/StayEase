import React, { useState } from 'react';
import { AdminRefund } from '../../../types/admin';

interface RefundsTabProps {
  refunds: AdminRefund[];
  onApproveRefund: (refundId: string) => void;
  onRejectRefund: (refundId: string) => void;
}

export const RefundsTab: React.FC<RefundsTabProps> = ({
  refunds,
  onApproveRefund,
  onRejectRefund,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeRefundProcessing, setActiveRefundProcessing] = useState<string | null>(null);
  const [refundToast, setRefundToast] = useState<string | null>(null);

  const filteredRefunds = refunds.filter((r) => {
    if (selectedStatus === 'All') return true;
    return r.status === selectedStatus;
  });

  const handleApprove = (refund: AdminRefund) => {
    setActiveRefundProcessing(refund.refundId);
    setTimeout(() => {
      onApproveRefund(refund.refundId);
      setActiveRefundProcessing(null);
      setRefundToast(`Instant Refund of ₹${refund.refundAmount.toLocaleString('en-IN')} dispatched via ${refund.refundMethod} to ${refund.guestName} (RRN: rfnd_${Math.random().toString(36).substring(2, 10)})`);
      setTimeout(() => setRefundToast(null), 4000);
    }, 1000);
  };

  const handleReject = (refund: AdminRefund) => {
    onRejectRefund(refund.refundId);
    setRefundToast(`Refund ${refund.refundId} rejected as per property non-refundable policy.`);
    setTimeout(() => setRefundToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* SLA & Fast Resolution Header */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-playfair text-[20px] font-bold text-white">
              Instant Refund & Cancellation Dispute Desk
            </h2>
            <span className="bg-rose-950 text-rose-400 text-[10px] font-mono px-2 py-0.5 rounded border border-rose-800">
              SLA TARGET: &lt; 2 HOURS
            </span>
          </div>
          <p className="text-[12px] text-[#8e8e93] mt-1">
            Automated IMPS & UPI reversal gateway router. Ensures 100% compliance with consumer protection & hotel cancellation policies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#1c1c1c] px-3.5 py-2 rounded-lg border border-[#333] text-right">
            <span className="text-[10px] text-[#8e8e93] uppercase font-bold">Pending Approval Queue</span>
            <div className="font-playfair text-[18px] font-bold text-rose-400 font-mono">
              {refunds.filter(r => r.status === 'Pending Approval').length} Requests (₹{refunds.filter(r => r.status === 'Pending Approval').reduce((a, b) => a + b.refundAmount, 0).toLocaleString('en-IN')})
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['All', 'Pending Approval', 'Completed', 'Rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
              selectedStatus === st
                ? 'bg-[#c5a059] text-black font-semibold'
                : 'bg-[#141414] text-[#a3a3a3] hover:text-white border border-[#262626]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Refunds Queue Cards / Table */}
      <div className="space-y-4">
        {filteredRefunds.map((refund) => (
          <div
            key={refund.refundId}
            className="bg-[#141414] border border-[#262626] hover:border-[#c5a059]/40 rounded-xl p-5 shadow-lg transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Details */}
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono font-bold text-white text-[15px]">{refund.refundId}</span>
                  <span className="text-[#8e8e93] text-[12px]">linked to <span className="font-mono text-[#c5a059] font-bold">{refund.bookingId}</span></span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    refund.status === 'Pending Approval' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    refund.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {refund.status}
                  </span>
                  {refund.status === 'Pending Approval' && (
                    <span className="text-[11px] text-rose-400 font-mono flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">timer</span>
                      SLA: {refund.slaHoursLeft}h left
                    </span>
                  )}
                </div>

                <div className="text-[13px] text-white font-medium">
                  Guest: <span className="font-bold">{refund.guestName}</span> ({refund.guestEmail}) • <span className="text-[#c5a059]">{refund.hotelName}</span>
                </div>

                <div className="bg-[#1c1c1c] p-2.5 rounded-lg border border-[#262626] text-[12px] text-[#a3a3a3]">
                  <span className="text-[#8e8e93] font-semibold">Cancellation Reason: </span>
                  "{refund.reason}"
                </div>

                <div className="text-[11px] text-[#8e8e93] flex items-center gap-4">
                  <span>Requested: {refund.requestedAt}</span>
                  <span>Refund Method: {refund.refundMethod}</span>
                  {refund.processedBy && <span>Approved by: {refund.processedBy}</span>}
                </div>
              </div>

              {/* Right: Amounts & Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-[#262626]">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] uppercase font-bold text-[#8e8e93]">Refund Amount</span>
                  <div className="font-playfair text-[22px] font-bold text-white font-mono">
                    ₹{refund.refundAmount.toLocaleString('en-IN')}
                  </div>
                  {refund.cancellationPenalty > 0 && (
                    <div className="text-[11px] text-rose-400 font-mono">
                      (₹{refund.cancellationPenalty.toLocaleString('en-IN')} Cancellation Penalty Deducted)
                    </div>
                  )}
                </div>

                {refund.status === 'Pending Approval' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReject(refund)}
                      className="bg-[#1c1c1c] hover:bg-rose-950/60 text-rose-400 border border-rose-900/60 px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(refund)}
                      disabled={activeRefundProcessing === refund.refundId}
                      className="bg-emerald-600 hover:bg-emerald-500 text-black px-4 py-1.5 rounded-lg text-[12px] font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {activeRefundProcessing === refund.refundId ? 'Triggering...' : 'Approve & Instant Reversal'}
                    </button>
                  </div>
                ) : refund.status === 'Completed' ? (
                  <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span>Reversed to Source (Ref: {refund.gatewayRefundRef})</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-rose-400">
                    Dispute Closed / Penalty Enforced
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Refund Toast */}
      {refundToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1c1c] border border-[#c5a059] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom">
          <span className="material-symbols-outlined text-emerald-400">currency_exchange</span>
          <span className="text-[13px]">{refundToast}</span>
        </div>
      )}
    </div>
  );
};
