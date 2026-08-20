import React, { useState } from 'react';
import { Hotel, Screen, TransitionDirection } from '../types';

interface CheckoutScreenProps {
  hotel: Hotel;
  onNavigate: (screen: Screen, transition?: TransitionDirection) => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  hotel,
  onNavigate,
}) => {
  const [firstName, setFirstName] = useState('Alexander');
  const [lastName, setLastName] = useState('Wright');
  const [email, setEmail] = useState('alexander.wright@luxuryestates.com');
  const [phone, setPhone] = useState('98765 43210');
  const [isForOther, setIsForOther] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const totalAmount = 51100;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccessModal(true);
    }, 800);
  };

  const handleFinishBooking = () => {
    setShowSuccessModal(false);
    onNavigate('home', 'push');
  };

  return (
    <div className="flex flex-col min-h-full bg-[#0a0a0a] text-white">
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-8 md:py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-playfair text-[28px] md:text-[36px] font-bold text-white mb-2 tracking-tight">
            Complete Your Reservation
          </h1>
          <p className="text-[15px] text-[#8e8e93]">
            Review your guest details and secure your reservation with encrypted luxury checkout.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Forms & Payment */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Guest Details Section */}
            <section className="bg-[#141414] rounded-xl border border-[#262626] p-6 md:p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#262626]">
                <div className="w-10 h-10 rounded-full bg-[#1c1c1c] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059]">
                  <span className="material-symbols-outlined text-[22px]">person</span>
                </div>
                <h2 className="font-playfair text-[22px] font-bold text-white">
                  Primary Guest Details
                </h2>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[12px] font-medium text-[#c5a059] uppercase tracking-wider mb-1.5" htmlFor="firstName">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      className="w-full bg-[#1c1c1c] rounded-lg border border-[#262626] focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] px-4 py-3 text-[15px] text-white placeholder-[#8e8e93] transition-colors outline-hidden"
                      type="text"
                      placeholder="Alexander"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#c5a059] uppercase tracking-wider mb-1.5" htmlFor="lastName">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      className="w-full bg-[#1c1c1c] rounded-lg border border-[#262626] focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] px-4 py-3 text-[15px] text-white placeholder-[#8e8e93] transition-colors outline-hidden"
                      type="text"
                      placeholder="Wright"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#c5a059] uppercase tracking-wider mb-1.5" htmlFor="email">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    className="w-full bg-[#1c1c1c] rounded-lg border border-[#262626] focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] px-4 py-3 text-[15px] text-white placeholder-[#8e8e93] transition-colors outline-hidden"
                    type="email"
                    placeholder="alexander.wright@luxuryestates.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-[12px] text-[#8e8e93] mt-1.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-[#c5a059]">info</span>
                    VIP confirmation voucher will be sent to this email.
                  </p>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#c5a059] uppercase tracking-wider mb-1.5" htmlFor="phone">
                    Phone Number *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-[#262626] bg-[#1c1c1c] text-[#c5a059] font-medium text-[14px]">
                      +91
                    </span>
                    <input
                      id="phone"
                      className="flex-1 min-w-0 block w-full px-4 py-3 rounded-r-lg bg-[#1c1c1c] border border-[#262626] focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] text-[15px] text-white placeholder-[#8e8e93] transition-colors outline-hidden"
                      type="tel"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isForOther}
                      onChange={(e) => setIsForOther(e.target.checked)}
                      className="w-5 h-5 rounded border-[#262626] bg-[#1c1c1c] text-[#c5a059] focus:ring-[#c5a059] accent-[#c5a059]"
                    />
                    <span className="text-[14px] text-[#a3a3a3] group-hover:text-white transition-colors">
                      I am making this luxury reservation on behalf of another guest
                    </span>
                  </label>
                </div>
              </div>
            </section>

            {/* Payment Method Section */}
            <section className="bg-[#141414] rounded-xl border border-[#262626] p-6 md:p-8 shadow-lg relative overflow-hidden">
              {/* Top gold brand line accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-[#c5a059]" />

              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#262626]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1c1c1c] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059]">
                    <span className="material-symbols-outlined text-[22px]">credit_card</span>
                  </div>
                  <h2 className="font-playfair text-[22px] font-bold text-white">
                    Payment Method
                  </h2>
                </div>
                <div className="flex gap-2">
                  <div className="w-10 h-6 bg-[#1c1c1c] rounded border border-[#262626] flex items-center justify-center text-[10px] font-bold text-[#c5a059]">
                    VISA
                  </div>
                  <div className="w-10 h-6 bg-[#1c1c1c] rounded border border-[#262626] flex items-center justify-center text-[10px] font-bold text-[#c5a059]">
                    MC
                  </div>
                  <div className="w-10 h-6 bg-[#1c1c1c] rounded border border-[#262626] flex items-center justify-center text-[10px] font-bold text-[#c5a059]">
                    AMEX
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Credit / Debit Card Option (Selected) */}
                <div
                  className={`border rounded-xl p-4 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#c5a059] bg-[#c5a059]/10 shadow-sm'
                      : 'border-[#262626] bg-[#1c1c1c] hover:border-[#c5a059]/50'
                  }`}
                >
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className="flex items-center gap-3 cursor-pointer w-full"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="w-5 h-5 text-[#c5a059] border-[#333333] accent-[#c5a059] focus:ring-[#c5a059]"
                    />
                    <span className="text-[15px] font-semibold text-white">
                      Credit / Debit Card (Global & Domestic)
                    </span>
                  </label>

                  {paymentMethod === 'card' && (
                    <div className="mt-4 space-y-4 pl-8">
                      <div>
                        <input
                          className="w-full bg-[#141414] rounded-lg border border-[#262626] focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] px-4 py-3 text-[14px] text-white placeholder-[#8e8e93] transition-colors outline-hidden"
                          placeholder="Card Number (4000 1234 5678 9010)"
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          className="w-full bg-[#141414] rounded-lg border border-[#262626] focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] px-4 py-3 text-[14px] text-white placeholder-[#8e8e93] transition-colors outline-hidden"
                          placeholder="MM/YY"
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                        />
                        <input
                          className="w-full bg-[#141414] rounded-lg border border-[#262626] focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] px-4 py-3 text-[14px] text-white placeholder-[#8e8e93] transition-colors outline-hidden"
                          placeholder="CVV"
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                        />
                      </div>
                      <div>
                        <input
                          className="w-full bg-[#141414] rounded-lg border border-[#262626] focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] px-4 py-3 text-[14px] text-white placeholder-[#8e8e93] transition-colors outline-hidden"
                          placeholder="Cardholder Full Name"
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* UPI Option */}
                <div
                  className={`border rounded-xl p-4 transition-colors ${
                    paymentMethod === 'upi'
                      ? 'border-[#c5a059] bg-[#c5a059]/10'
                      : 'border-[#262626] bg-[#1c1c1c] hover:border-[#c5a059]/50'
                  }`}
                >
                  <label
                    onClick={() => setPaymentMethod('upi')}
                    className="flex items-center gap-3 cursor-pointer w-full"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="w-5 h-5 text-[#c5a059] border-[#333333] accent-[#c5a059] focus:ring-[#c5a059]"
                    />
                    <span className="text-[15px] text-[#a3a3a3]">
                      UPI Instant (GPay, PhonePe, Paytm, BHIM)
                    </span>
                  </label>
                  {paymentMethod === 'upi' && (
                    <div className="mt-3 pl-8">
                      <input
                        className="w-full bg-[#141414] rounded-lg border border-[#262626] px-4 py-2.5 text-[14px] text-white placeholder-[#8e8e93] outline-hidden"
                        placeholder="yourname@okhdfcbank"
                      />
                    </div>
                  )}
                </div>

                {/* Net Banking Option */}
                <div
                  className={`border rounded-xl p-4 transition-colors ${
                    paymentMethod === 'netbanking'
                      ? 'border-[#c5a059] bg-[#c5a059]/10'
                      : 'border-[#262626] bg-[#1c1c1c] hover:border-[#c5a059]/50'
                  }`}
                >
                  <label
                    onClick={() => setPaymentMethod('netbanking')}
                    className="flex items-center gap-3 cursor-pointer w-full"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'netbanking'}
                      onChange={() => setPaymentMethod('netbanking')}
                      className="w-5 h-5 text-[#c5a059] border-[#333333] accent-[#c5a059] focus:ring-[#c5a059]"
                    />
                    <span className="text-[15px] text-[#a3a3a3]">Direct Net Banking (All Premier Banks)</span>
                  </label>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Booking Summary & CTA */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              {/* Booking Summary Card */}
              <div className="bg-[#141414] rounded-xl border border-[#262626] shadow-xl overflow-hidden">
                {/* Hotel Image Header */}
                <div className="relative h-48 w-full bg-[#1c1c1c]">
                  <img
                    className="w-full h-full object-cover"
                    src={hotel.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"}
                    alt={hotel.name || 'The Taj Mahal Palace'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-playfair text-[20px] font-bold text-white mb-1">
                        {hotel.name || 'The Taj Mahal Palace'}
                      </h3>
                      <p className="text-[14px] text-[#8e8e93] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-[#c5a059]">
                          location_on
                        </span>
                        {hotel.location || 'Mumbai, Maharashtra'}
                      </p>
                    </div>
                    <div className="bg-[#1c1c1c] text-[#c5a059] border border-[#c5a059]/40 px-2.5 py-1 rounded-md flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider">
                      <span className="material-symbols-outlined filled text-[13px]">verified</span>
                      Verified
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#262626] mb-4 bg-[#1c1c1c] rounded-lg px-3.5">
                    <div>
                      <p className="text-[11px] text-[#8e8e93] uppercase tracking-wider mb-1">
                        Check-in
                      </p>
                      <p className="text-[14px] font-semibold text-white">
                        24 Oct, 2024
                      </p>
                      <p className="text-[12px] text-[#8e8e93]">14:00 PM</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#8e8e93] uppercase tracking-wider mb-1">
                        Check-out
                      </p>
                      <p className="text-[14px] font-semibold text-white">
                        27 Oct, 2024
                      </p>
                      <p className="text-[12px] text-[#8e8e93]">11:00 AM</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-[15px] text-white font-semibold mb-0.5">
                      1x Deluxe Ocean View Suite
                    </p>
                    <p className="text-[13px] text-[#8e8e93]">
                      2 Adults, 1 Child • 3 Nights
                    </p>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6 text-[14px]">
                    <div className="flex justify-between text-[#8e8e93]">
                      <span>Estate Rate (3 nights)</span>
                      <span className="font-medium text-white">₹45,000</span>
                    </div>
                    <div className="flex justify-between text-[#8e8e93]">
                      <span>Luxury Taxes & Fees (18% GST)</span>
                      <span className="font-medium text-white">₹8,100</span>
                    </div>
                    <div className="flex justify-between text-[#c5a059] font-semibold">
                      <span>StayEase Privilege Courtesy</span>
                      <span>-₹2,000</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end pt-4 border-t border-[#262626]">
                    <div>
                      <p className="text-[12px] text-[#8e8e93] mb-0.5">Total Amount</p>
                      <p className="text-[13px] text-[#8e8e93]">Including all luxury taxes</p>
                    </div>
                    <div className="text-right">
                      <p className="font-playfair text-[28px] font-bold text-white">
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust & Cancellation Policy */}
              <div className="bg-[#141414] rounded-xl p-5 border border-[#262626] space-y-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#c5a059] mt-0.5">shield</span>
                  <div>
                    <h4 className="text-[14px] font-bold text-white">
                      Encrypted Luxury Processing
                    </h4>
                    <p className="text-[13px] text-[#8e8e93] mt-0.5">
                      Your payment information is secured with bank-grade 256-bit SSL encryption.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#8e8e93] mt-0.5">event_busy</span>
                  <div>
                    <h4 className="text-[14px] font-bold text-white">
                      Flexible Cancellation
                    </h4>
                    <p className="text-[13px] text-[#8e8e93] mt-0.5">
                      Cancel before 22 Oct, 2024 for a complete, immediate refund.
                    </p>
                  </div>
                </div>
              </div>

              {/* Final CTA Button: Pay ₹51,100 Now (matches xpath //button[contains(., 'Pay')]) */}
              <button
                id="pay-now-button"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full bg-[#c5a059] hover:bg-[#dfba73] text-black font-semibold text-[16px] uppercase tracking-wider py-4 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden group hover:shadow-xl hover:-translate-y-0.5 cursor-pointer disabled:opacity-75"
              >
                <span className="material-symbols-outlined text-[20px]">lock</span>
                {isProcessing ? 'Processing Payment...' : `Pay ₹${totalAmount.toLocaleString('en-IN')} Now`}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-[#262626] animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-[#1c1c1c] border border-[#c5a059]/40 text-[#c5a059] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>
            <h3 className="font-playfair text-[26px] font-bold text-white mb-2">
              Reservation Confirmed
            </h3>
            <p className="text-[#8e8e93] text-[14px] mb-6 leading-relaxed">
              Your reservation at <span className="font-semibold text-white">{hotel.name || 'The Taj Mahal Palace'}</span> is secured. Confirmation details and itinerary have been dispatched to <span className="font-semibold text-white">{email}</span>.
            </p>
            <div className="bg-[#1c1c1c] p-4 rounded-xl border border-[#262626] mb-6 text-left text-[13px] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#8e8e93]">Reservation Reference:</span>
                <span className="font-mono font-bold text-[#c5a059]">STE-849204</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e8e93]">Amount Paid:</span>
                <span className="font-bold text-white">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <button
              id="return-home-btn"
              onClick={handleFinishBooking}
              className="w-full bg-[#c5a059] hover:bg-[#dfba73] text-black font-semibold uppercase tracking-wider py-3.5 rounded-lg transition-colors cursor-pointer"
            >
              Return to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
