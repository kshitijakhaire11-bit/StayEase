import React, { useState } from 'react';
import { Hotel, Screen, TransitionDirection } from '../types';

interface HotelDetailsScreenProps {
  hotel: Hotel;
  onNavigate: (screen: Screen, transition?: TransitionDirection) => void;
}

export const HotelDetailsScreen: React.FC<HotelDetailsScreenProps> = ({
  hotel,
  onNavigate,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleReserve = () => {
    onNavigate('checkout', 'slide_up');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#0a0a0a] text-white">
      <main className="max-w-[1280px] w-full mx-auto px-4 md:px-10 py-8 md:py-12 flex flex-col gap-8 md:gap-10">
        {/* Header & Breadcrumbs */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#8e8e93] text-[13px] flex-wrap">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home', 'push_back');
              }}
              className="hover:text-[#c5a059] transition-colors"
            >
              Home
            </a>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <a
              href="#search"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('search_results', 'push_back');
              }}
              className="hover:text-[#c5a059] transition-colors"
            >
              India
            </a>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="hover:text-[#c5a059] transition-colors">{hotel.state || 'Goa'}</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-white font-semibold">{hotel.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mt-2">
            <div>
              <h1 className="font-playfair text-[28px] sm:text-[34px] md:text-[40px] font-bold text-white tracking-tight">
                {hotel.name}
              </h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <div className="flex items-center text-[#c5a059]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="material-symbols-outlined filled text-[20px]"
                    >
                      star
                    </span>
                  ))}
                </div>
                <span className="text-[12px] bg-[#141414] text-[#c5a059] border border-[#c5a059]/30 px-3 py-1 rounded-md flex items-center gap-1.5 font-medium uppercase tracking-wider">
                  <span className="material-symbols-outlined filled text-[14px] text-[#c5a059]">
                    verified
                  </span>
                  StayEase Signature Verified
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[#8e8e93] mt-2.5 text-[15px]">
                <span className="material-symbols-outlined text-[18px] text-[#c5a059]">location_on</span>
                <span>{hotel.address || hotel.location}</span>
                <a
                  className="text-[#c5a059] font-semibold text-[14px] underline ml-2 hover:text-[#dfba73]"
                  href="#map"
                  onClick={(e) => e.preventDefault()}
                >
                  Show on map
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsLiked(!isLiked)}
                className="p-2.5 rounded-lg border border-[#262626] bg-[#141414] hover:border-[#c5a059] transition-colors text-[#8e8e93] hover:text-white flex items-center justify-center cursor-pointer"
                title="Save to Wishlist"
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isLiked ? 'filled text-[#ff6b6b]' : ''
                  }`}
                >
                  favorite
                </span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-lg border border-[#262626] bg-[#141414] hover:border-[#c5a059] transition-colors text-[#8e8e93] hover:text-white flex items-center justify-center cursor-pointer relative"
                title="Share Hotel"
              >
                <span className="material-symbols-outlined text-[20px]">share</span>
                {copied && (
                  <span className="absolute -top-8 bg-[#c5a059] text-black font-semibold text-[11px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                    Link copied!
                  </span>
                )}
              </button>
              <button
                id="reserve-room-btn-header"
                type="button"
                onClick={handleReserve}
                className="bg-[#c5a059] text-black font-semibold text-[14px] uppercase tracking-wider px-6 py-2.5 rounded-lg hover:bg-[#dfba73] transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Reserve Room
              </button>
            </div>
          </div>
        </section>

        {/* Bento Image Gallery */}
        <section className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 h-[360px] sm:h-[420px] md:h-[500px] rounded-xl overflow-hidden relative group border border-[#262626]">
          {/* Main Large Image */}
          <div className="md:col-span-2 md:row-span-2 relative h-full overflow-hidden bg-[#141414]">
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
              src={hotel.gallery[0] || hotel.image}
              alt={hotel.name}
            />
          </div>

          {/* Top Middle Image */}
          <div className="hidden md:block relative h-full overflow-hidden bg-[#141414]">
            <img
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              src={hotel.gallery[1] || hotel.image}
              alt="Room interior"
            />
          </div>

          {/* Top Right Image */}
          <div className="hidden md:block relative h-full overflow-hidden bg-[#141414]">
            <img
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              src={hotel.gallery[2] || hotel.image}
              alt="Bathroom luxury"
            />
          </div>

          {/* Bottom Middle Image */}
          <div className="hidden md:block relative h-full overflow-hidden bg-[#141414]">
            <img
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              src={hotel.gallery[3] || hotel.image}
              alt="Dining experience"
            />
          </div>

          {/* Bottom Right Image with overlay */}
          <div className="hidden md:block relative h-full overflow-hidden bg-[#141414] group/more cursor-pointer">
            <img
              className="w-full h-full object-cover"
              src={hotel.gallery[4] || hotel.image}
              alt="Spa and wellness"
            />
            <div className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-2xs flex items-center justify-center group-hover/more:bg-[#0a0a0a]/75 transition-colors">
              <span className="text-[#c5a059] font-playfair text-[20px] font-bold tracking-wider">
                +24 Curated Photos
              </span>
            </div>
          </div>
        </section>

        {/* Details & Room Pricing Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Description, Amenities & Features */}
          <div className="lg:col-span-8 space-y-8">
            {/* About the Hotel */}
            <div className="bg-[#141414] rounded-xl border border-[#262626] p-6 md:p-8 shadow-lg">
              <h2 className="font-playfair text-[24px] font-bold text-white mb-3 tracking-wide">
                About this sanctuary
              </h2>
              <p className="text-[15px] text-[#a3a3a3] leading-relaxed">
                {hotel.description}
              </p>
              <div className="mt-6 pt-6 border-t border-[#262626] grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 text-white">
                  <span className="material-symbols-outlined text-[#c5a059] text-[22px]">verified_user</span>
                  <span className="font-medium text-[14px]">Private Butler Service</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="material-symbols-outlined text-[#c5a059] text-[22px]">nest_clock_farsight_analog</span>
                  <span className="font-medium text-[14px]">24/7 Concierge Desk</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="material-symbols-outlined text-[#c5a059] text-[22px]">room_service</span>
                  <span className="font-medium text-[14px]">Michelin Dining</span>
                </div>
              </div>
            </div>

            {/* Popular Amenities */}
            <div className="bg-[#141414] rounded-xl border border-[#262626] p-6 md:p-8 shadow-lg">
              <h2 className="font-playfair text-[24px] font-bold text-white mb-4 tracking-wide">
                Estate Amenities & Privileges
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {hotel.amenities.concat(['Air Conditioning', 'High-speed Wi-Fi', 'Private Pool', 'Valet Parking']).map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-[#a3a3a3]">
                    <span className="material-symbols-outlined text-[#c5a059] text-[20px]">
                      check_circle
                    </span>
                    <span className="font-medium text-[14px]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Room Card */}
            <div className="bg-[#141414] rounded-xl border border-[#262626] p-6 md:p-8 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 pb-4 border-b border-[#262626]">
                <div>
                  <span className="bg-[#1c1c1c] text-[#c5a059] border border-[#c5a059]/30 px-3 py-1 rounded text-[11px] font-bold uppercase tracking-widest">
                    Recommended Suite
                  </span>
                  <h3 className="font-playfair text-[22px] font-bold text-white mt-2">
                    {hotel.roomType}
                  </h3>
                  <p className="text-[14px] text-[#8e8e93] mt-0.5">
                    1 King Bed • 650 sq ft • Private Balcony & Sea View
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[12px] text-[#8e8e93] block">Price per night</span>
                  <span className="font-playfair text-[26px] font-bold text-white">
                    ₹{hotel.pricePerNight.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-[13px] text-[#a3a3a3] mb-6">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#c5a059]">check</span>
                  Complimentary luxury breakfast
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#c5a059]">check</span>
                  Flexible cancellation up to 48 hours
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#c5a059]">check</span>
                  High-speed fiber connectivity
                </span>
              </div>

              <button
                type="button"
                onClick={handleReserve}
                className="w-full bg-[#c5a059] text-black font-semibold text-[15px] uppercase tracking-wider py-3.5 rounded-lg hover:bg-[#dfba73] transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                Reserve Room
              </button>
            </div>
          </div>

          {/* Right Column: Sticky Summary & Trust Signals */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="bg-[#141414] rounded-xl border border-[#262626] p-6 shadow-xl">
              <div className="flex justify-between items-baseline mb-4 pb-4 border-b border-[#262626]">
                <div>
                  <span className="text-[12px] text-[#8e8e93] uppercase tracking-wider">Total Experience</span>
                  <p className="font-playfair text-[30px] font-bold text-white">
                    ₹{hotel.totalPrice.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[12px] text-[#8e8e93]">for {hotel.nights} nights (taxes included)</p>
                </div>
                <div className="bg-[#1c1c1c] border border-[#c5a059]/30 text-white px-3 py-1.5 rounded-lg text-center">
                  <span className="font-bold text-[17px] text-[#c5a059]">{hotel.rating}</span>
                  <span className="block text-[10px] text-[#8e8e93] uppercase tracking-wider">Rating</span>
                </div>
              </div>

              <div className="space-y-3 mb-6 bg-[#1c1c1c] p-4 rounded-lg border border-[#262626] text-[14px]">
                <div className="flex justify-between text-[#8e8e93]">
                  <span>Check-in:</span>
                  <span className="font-medium text-white">Oct 15, 2024 (2:00 PM)</span>
                </div>
                <div className="flex justify-between text-[#8e8e93]">
                  <span>Check-out:</span>
                  <span className="font-medium text-white">Oct 20, 2024 (11:00 AM)</span>
                </div>
                <div className="flex justify-between text-[#8e8e93]">
                  <span>Guests:</span>
                  <span className="font-medium text-white">{hotel.guests}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReserve}
                className="w-full bg-[#c5a059] text-black font-semibold text-[15px] uppercase tracking-wider py-4 rounded-lg hover:bg-[#dfba73] transition-all shadow-lg active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">lock</span>
                Reserve Room
              </button>

              <p className="text-center text-[12px] text-[#8e8e93] mt-3">
                Transparent luxury billing. Instant confirmation.
              </p>
            </div>

            {/* Trust Box */}
            <div className="bg-[#141414] rounded-xl p-5 border border-[#262626] space-y-3 text-[14px]">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#c5a059] mt-0.5 text-[22px]">verified</span>
                <div>
                  <h4 className="font-bold text-white">StayEase Distinction</h4>
                  <p className="text-[#8e8e93] text-[13px] mt-0.5">
                    100% verified estates with 24/7 dedicated personal concierge assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
