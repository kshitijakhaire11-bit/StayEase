import React, { useState, useRef, useEffect } from 'react';
import { Screen, TransitionDirection } from '../types';
import { TRENDING_DESTINATIONS, POPULAR_CITIES } from '../data/hotels';

interface HomeScreenProps {
  onNavigate: (screen: Screen, transition?: TransitionDirection) => void;
  destination: string;
  setDestination: (dest: string) => void;
  onOpenCustomerLogin?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  destination,
  setDestination,
  onOpenCustomerLogin,
}) => {
  const [dates] = useState('Oct 15 - Oct 20');
  const [guests] = useState('2 Guests, 1 Suite');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    setIsDropdownOpen(false);
    onNavigate('search_results', 'push');
  };

  const handleSelectCity = (city: string) => {
    setDestination(`${city}, India`);
    setIsDropdownOpen(false);
    onNavigate('search_results', 'push');
  };

  return (
    <div className="flex flex-col min-h-full bg-[#0a0a0a]">
      {/* Hero Section with Search */}
      <section className="relative pt-[72px] pb-[136px] px-4 md:px-10 bg-[#0a0a0a] text-white flex flex-col items-center justify-center min-h-[520px]">
        {/* Background Image with Gradient */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="bg-cover bg-center w-full h-full opacity-30 transform scale-105 transition-transform duration-1000"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBe3kN3R4-3bd2NLOE3VPnpJHg2cjSohVeD0i8QYNy2w8uRK1t5F0r79ngPSnzSSznaanU92S_UuRczGXfGx8aJuHOWaaPw1UHOIi8BnWFkLDYoh86MLMCbvVbaAt2mK9rqiqdvcs_3vdHINtDHQ7vfp8KjW4hp4aDzDH04bmGFewKkeH9ulvDTBzGsfn9F7N0Tys6dlwIvBcVs0gQof5RxjAi_efgbMY8m9hqKi-CZB1UXXegA434')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/90 to-[#0a0a0a]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[1280px] mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#141414] border border-[#c5a059]/40 text-[#c5a059] text-[12px] font-medium tracking-widest uppercase mb-2 shadow-xs">
            <span className="material-symbols-outlined text-[15px] text-[#c5a059]">auto_awesome</span>
            Curated Luxury & Heritage Stays
          </div>
          <h1 className="font-playfair text-[36px] sm:text-[46px] md:text-[54px] max-w-[900px] mx-auto leading-[1.15] font-bold tracking-tight text-white">
            Find Your Sanctuary Across India
          </h1>
          <p className="text-[15px] sm:text-[17px] text-[#a3a3a3] max-w-[640px] mx-auto leading-relaxed">
            From regal palace suites in Jaipur to iconic sea-facing suites in Mumbai, experience uncompromising luxury.
          </p>

          {/* Search Component Box */}
          <div className="mt-10 bg-[#141414]/95 backdrop-blur-md rounded-xl p-2 md:p-3 max-w-[1020px] mx-auto flex flex-col md:flex-row gap-2 md:gap-3 text-white w-full relative z-20 border border-[#262626] shadow-2xl">
            {/* Destination */}
            <div 
              ref={dropdownRef}
              className="flex-1 relative flex items-center gap-3 p-3.5 hover:bg-[#1a1a1a] rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[#333333]"
            >
              <span className="material-symbols-outlined text-[#c5a059] text-[22px]">location_on</span>
              <div className="flex flex-col text-left w-full">
                <span className="text-[11px] text-[#8e8e93] uppercase tracking-wider font-semibold">
                  Destination (e.g. Mumbai, Jaipur)
                </span>
                <input
                  id="destination-input"
                  className="bg-transparent border-none p-0 focus:outline-hidden focus:ring-0 text-[15px] font-medium text-white placeholder-[#666666] w-full"
                  placeholder="Select or type Mumbai, Jaipur, Goa..."
                  type="text"
                  value={destination}
                  onFocus={() => setIsDropdownOpen(true)}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
              </div>

              {/* Destination Autocomplete / Quick Picker Dropdown */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-full sm:w-[320px] bg-[#141414] border border-[#333333] rounded-xl shadow-2xl p-2 z-50 text-left backdrop-blur-md">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-[#c5a059] uppercase tracking-wider border-b border-[#262626]">
                    Select Destination
                  </div>
                  <div className="py-1 space-y-1 max-h-[220px] overflow-y-auto">
                    {POPULAR_CITIES.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleSelectCity(city)}
                        className="w-full px-3 py-2 text-left rounded-lg text-[14px] text-white hover:bg-[#222222] hover:text-[#c5a059] flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-[#c5a059]">location_city</span>
                          <span className="font-medium">{city}</span>
                        </span>
                        <span className="text-[11px] text-[#8e8e93]">India</span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setDestination('');
                        setIsDropdownOpen(false);
                        onNavigate('search_results', 'push');
                      }}
                      className="w-full px-3 py-2 text-left rounded-lg text-[13px] text-[#a3a3a3] hover:bg-[#222222] hover:text-white flex items-center gap-2 transition-colors cursor-pointer border-t border-[#262626] mt-1 pt-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#8e8e93]">travel_explore</span>
                      <span>Show All Properties Across India</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:block w-[1px] bg-[#262626] my-2" />

            {/* Dates */}
            <div className="flex-1 flex items-center gap-3 p-3.5 hover:bg-[#1a1a1a] rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[#333333]">
              <span className="material-symbols-outlined text-[#c5a059] text-[22px]">calendar_month</span>
              <div className="flex flex-col text-left">
                <span className="text-[11px] text-[#8e8e93] uppercase tracking-wider font-semibold">
                  Check-in — Check-out
                </span>
                <div className="text-[15px] font-medium text-white mt-[2px]">
                  {dates}
                </div>
              </div>
            </div>

            <div className="hidden md:block w-[1px] bg-[#262626] my-2" />

            {/* Guests */}
            <div className="flex-1 flex items-center gap-3 p-3.5 hover:bg-[#1a1a1a] rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[#333333]">
              <span className="material-symbols-outlined text-[#c5a059] text-[22px]">person</span>
              <div className="flex flex-col text-left">
                <span className="text-[11px] text-[#8e8e93] uppercase tracking-wider font-semibold">
                  Guests & Rooms
                </span>
                <div className="text-[15px] font-medium text-white mt-[2px]">
                  {guests}
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button
              id="hero-search-button"
              onClick={handleSearch}
              className="bg-[#c5a059] text-[#0a0a0a] hover:bg-[#dfba73] transition-all px-8 py-4 rounded-lg font-bold text-[14px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg md:w-auto w-full cursor-pointer active:scale-98"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
              Search
            </button>
          </div>

          {/* Quick Destination Filter Pills */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
            <span className="text-[12px] text-[#8e8e93] font-medium uppercase tracking-wider mr-1">Popular Cities:</span>
            {POPULAR_CITIES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => handleSelectCity(city)}
                className="bg-[#141414] hover:bg-[#222222] border border-[#262626] hover:border-[#c5a059]/60 text-[#f5f5f5] hover:text-[#c5a059] px-3.5 py-1 rounded-full text-[12px] font-medium transition-all shadow-xs cursor-pointer"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Destinations in India */}
      <section className="py-16 px-4 md:px-10 max-w-[1280px] mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-playfair text-[28px] md:text-[34px] text-white font-bold tracking-wide">
              Trending Destinations in India
            </h2>
            <p className="text-[14px] text-[#8e8e93] mt-1">
              Select a destination to instantly view authentic luxury properties.
            </p>
          </div>
          <button
            onClick={() => {
              setDestination('');
              onNavigate('search_results', 'push');
            }}
            className="hidden md:flex items-center gap-2 text-[#c5a059] font-medium text-[14px] hover:text-[#dfba73] transition-colors cursor-pointer"
          >
            Explore All Properties
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Mumbai Card */}
          <a
            href="#mumbai"
            id="destination-card-mumbai"
            onClick={(e) => {
              e.preventDefault();
              setDestination('Mumbai, India');
              onNavigate('search_results', 'push');
            }}
            className="group relative rounded-xl overflow-hidden bg-[#141414] border border-[#262626] hover:border-[#c5a059]/50 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 block cursor-pointer"
          >
            <div className="aspect-4/5 w-full relative">
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('${TRENDING_DESTINATIONS[0].image}')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/95 via-[#0a0a0a]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="font-playfair text-[22px] font-bold text-white mb-1">Mumbai</h3>
                <p className="text-[13px] text-[#c5a059]">5 iconic sea-facing stays</p>
              </div>
            </div>
          </a>

          {/* Jaipur Card */}
          <a
            href="#jaipur"
            id="destination-card-jaipur"
            onClick={(e) => {
              e.preventDefault();
              setDestination('Jaipur, India');
              onNavigate('search_results', 'push');
            }}
            className="group relative rounded-xl overflow-hidden bg-[#141414] border border-[#262626] hover:border-[#c5a059]/50 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 block cursor-pointer"
          >
            <div className="aspect-4/5 w-full relative">
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('${TRENDING_DESTINATIONS[1].image}')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/95 via-[#0a0a0a]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="font-playfair text-[22px] font-bold text-white mb-1">Jaipur</h3>
                <p className="text-[13px] text-[#c5a059]">5 royal palace estates</p>
              </div>
            </div>
          </a>

          {/* Kerala Backwaters Card (span 2) */}
          <a
            href="#kerala"
            id="destination-card-kerala"
            onClick={(e) => {
              e.preventDefault();
              setDestination('Kerala, India');
              onNavigate('search_results', 'push');
            }}
            className="group relative rounded-xl overflow-hidden bg-[#141414] border border-[#262626] hover:border-[#c5a059]/50 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 md:col-span-2 block cursor-pointer"
          >
            <div className="aspect-4/5 md:aspect-2/1 w-full relative">
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('${TRENDING_DESTINATIONS[2].image}')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/95 via-[#0a0a0a]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="font-playfair text-[22px] font-bold text-white mb-1">
                  Kerala Backwaters
                </h3>
                <p className="text-[13px] text-[#c5a059]">Serene backwater pool villas</p>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* StayEase Privilege Member Section */}
      <section className="py-12 px-4 md:px-10 max-w-[1280px] mx-auto w-full mb-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#141414] via-[#1a1712] to-[#141414] border border-[#c5a059]/40 p-8 md:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 bg-[#0c0c0c] border border-[#c5a059]/50 px-3 py-1 rounded-full text-[#c5a059] text-[11px] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]">stars</span>
              StayEase Club Privileges
            </div>
            <h2 className="font-playfair text-[26px] md:text-[32px] font-bold text-white leading-tight">
              Unlock 5% Instant Savings & Complimentary Breakfast
            </h2>
            <p className="text-[14px] text-[#a3a3a3] leading-relaxed">
              Sign in with your Indian mobile number or email to access member-only tariffs, early check-in courtesies, and instant booking vouchers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 w-full lg:w-auto shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('offers', 'push')}
              className="bg-[#1f1d19] hover:bg-[#2a2720] text-white border border-[#c5a059]/60 font-bold uppercase tracking-wider px-5 py-3.5 rounded-xl text-[12px] transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#c5a059]">local_offer</span>
              <span>View Offers & Deals</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (onOpenCustomerLogin) {
                  onOpenCustomerLogin();
                } else {
                  onNavigate('login', 'push');
                }
              }}
              className="bg-[#c5a059] hover:bg-[#dfba73] text-black font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl text-[13px] transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">key</span>
              <span>Sign In / Register</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
