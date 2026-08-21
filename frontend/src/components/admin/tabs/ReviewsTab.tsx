import React, { useState } from 'react';
import { AdminReview } from '../../../types/admin';

interface ReviewsTabProps {
  reviews: AdminReview[];
  onReplyReview: (reviewId: string, replyText: string) => void;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({
  reviews,
  onReplyReview,
}) => {
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [reviewToast, setReviewToast] = useState<string | null>(null);

  const handlePublishReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    onReplyReview(reviewId, replyText);
    setActiveReplyId(null);
    setReplyText('');
    setReviewToast('Executive General Manager response published to guest review.');
    setTimeout(() => setReviewToast(null), 3000);
  };

  const handleQuickTemplate = (template: string) => {
    setReplyText(template);
  };

  return (
    <div className="space-y-6">
      {/* Reputation KPI Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4.5">
          <span className="text-[11px] text-[#8e8e93] uppercase font-bold">Overall Guest Rating</span>
          <div className="font-playfair text-[26px] font-bold text-[#c5a059] mt-1 flex items-center gap-1.5">
            <span>4.91</span>
            <span className="text-white text-[14px]">/ 5.0</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">Top 1% Luxury in India</span>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4.5">
          <span className="text-[11px] text-[#8e8e93] uppercase font-bold">Cleanliness & Sanitization</span>
          <div className="font-playfair text-[26px] font-bold text-white mt-1">4.96</div>
          <span className="text-[11px] text-[#8e8e93]">Taj PurePresence Standard</span>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4.5">
          <span className="text-[11px] text-[#8e8e93] uppercase font-bold">Staff & Concierge Warmth</span>
          <div className="font-playfair text-[26px] font-bold text-white mt-1">4.94</div>
          <span className="text-[11px] text-[#8e8e93]">100% Verified Guests</span>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4.5">
          <span className="text-[11px] text-[#8e8e93] uppercase font-bold">GM Response Rate</span>
          <div className="font-playfair text-[26px] font-bold text-emerald-400 mt-1">98.2%</div>
          <span className="text-[11px] text-[#8e8e93]">Avg response time: 2.1 hrs</span>
        </div>
      </div>

      {/* Reviews Stream */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-[#141414] border border-[#262626] rounded-xl p-5 md:p-6 shadow-lg space-y-4 hover:border-[#c5a059]/30 transition-all"
          >
            {/* Header: Guest Info & Rating */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262626] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-[15px]">{rev.guestName}</span>
                  <span className="text-[10px] font-bold text-[#c5a059] bg-[#c5a059]/10 px-1.5 py-0.2 rounded border border-[#c5a059]/30">
                    {rev.guestTier}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[13px]">verified</span> Verified Stay
                  </span>
                </div>
                <div className="text-[12px] text-[#8e8e93] mt-0.5">
                  {rev.hotelName} • Stayed in {rev.roomType} on {rev.stayDate}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-md border border-[#333]">
                  <span className="material-symbols-outlined filled text-[#c5a059] text-[16px]">star</span>
                  <span className="font-bold text-white text-[14px]">{rev.rating.toFixed(1)}</span>
                </div>
                <span className="text-[11px] text-[#8e8e93]">{rev.createdAt}</span>
              </div>
            </div>

            {/* Sub-Ratings Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#1c1c1c] p-2.5 rounded-lg border border-[#262626] text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#8e8e93]">Cleanliness</span>
                <span className="font-bold text-emerald-400">★ {rev.subRatings.cleanliness}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e8e93]">Staff & Service</span>
                <span className="font-bold text-emerald-400">★ {rev.subRatings.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e8e93]">Location</span>
                <span className="font-bold text-emerald-400">★ {rev.subRatings.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e8e93]">Value</span>
                <span className="font-bold text-emerald-400">★ {rev.subRatings.value}</span>
              </div>
            </div>

            {/* Comment */}
            <p className="text-[13px] text-[#e5e5e5] leading-relaxed">
              "{rev.comment}"
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {rev.tags.map((tag) => (
                <span key={tag} className="text-[10px] bg-[#1c1c1c] text-[#c5a059] px-2 py-0.5 rounded border border-[#c5a059]/20 font-medium">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Existing Response or Response Trigger */}
            {rev.response ? (
              <div className="bg-[#1a1813] border-l-2 border-[#c5a059] p-3.5 rounded-r-lg space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-[#c5a059] uppercase tracking-wider">{rev.response.responderName} (General Manager)</span>
                  <span className="text-[10px] text-[#8e8e93]">{rev.response.respondedAt}</span>
                </div>
                <p className="text-[12px] text-[#d4d4d4] italic">
                  "{rev.response.message}"
                </p>
              </div>
            ) : (
              <div>
                {activeReplyId === rev.id ? (
                  <div className="bg-[#1c1c1c] p-4 rounded-xl border border-[#262626] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] font-bold text-white">Draft General Manager Response</span>
                      <button onClick={() => setActiveReplyId(null)} className="text-[#8e8e93] hover:text-white text-xs">Cancel</button>
                    </div>

                    {/* Quick AI templates */}
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => handleQuickTemplate(`Dear ${rev.guestName}, thank you for your warm words. It was an honor hosting you at ${rev.hotelName}. We eagerly look forward to welcoming you back for another seamless StayEase luxury experience.`)}
                        className="text-[10px] bg-[#141414] hover:bg-[#222] text-[#c5a059] px-2 py-1 rounded border border-[#333] cursor-pointer"
                      >
                        ⚡ Template: Gracious Hospitality & Return
                      </button>
                      <button
                        onClick={() => handleQuickTemplate(`Dear ${rev.guestName}, we deeply appreciate your constructive feedback regarding our dining and services. We are upgrading our in-room amenities and look forward to demonstrating our renewed excellence on your next visit.`)}
                        className="text-[10px] bg-[#141414] hover:bg-[#222] text-[#a3a3a3] px-2 py-1 rounded border border-[#333] cursor-pointer"
                      >
                        ⚡ Template: Feedback Resolution
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type executive response to guest..."
                      className="w-full bg-[#141414] border border-[#333] text-white p-2.5 rounded-lg text-[12px] outline-hidden focus:border-[#c5a059]"
                    />

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handlePublishReply(rev.id)}
                        className="bg-[#c5a059] hover:bg-[#dfba73] text-black px-4 py-1.5 rounded-lg text-[12px] font-semibold uppercase tracking-wider cursor-pointer"
                      >
                        Publish Response
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setActiveReplyId(rev.id);
                      setReplyText(`Dear ${rev.guestName}, thank you so much for sharing your delightful review of ${rev.hotelName}. It was our absolute privilege to cater to you.`);
                    }}
                    className="bg-[#1c1c1c] hover:bg-[#262626] text-[#c5a059] border border-[#333] px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer"
                  >
                    Reply as General Manager
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Review Toast */}
      {reviewToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1c1c] border border-emerald-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom">
          <span className="material-symbols-outlined text-emerald-400">rate_review</span>
          <span className="text-[13px]">{reviewToast}</span>
        </div>
      )}
    </div>
  );
};
