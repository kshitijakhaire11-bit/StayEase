import React, { useState, useMemo } from 'react';
import { Hotel, Screen, TransitionDirection } from '../types';
import { HOTELS_DATA, POPULAR_CITIES } from '../data/hotels';

interface SearchResultsScreenProps {
  onNavigate: (screen: Screen, transition?: TransitionDirection) => void;
  onSelectHotel: (hotel: Hotel) => void;
  destination: string;
  setDestination: (dest: string) => void;
}

export const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({
  onNavigate,
  onSelectHotel,
  destination,
  setDestination,
}) => {
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState(destination);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Extract clean city name for headers and displays
  const currentCity = useMemo(() => {
    if (!destination || destination.trim() === '') return 'India';
    if (destination.includes(',')) {
      return destination.split(',')[0].trim();
    }
    return destination.trim();
  }, [destination]);

  // Keep local search input synced if destination changes from outside
  React.useEffect(() => {
    setSearchInput(destination);
  }, [destination]);

  // Handle price range filter toggles
  const togglePriceRange = (range: string) => {
    setCurrentPage(1);
    if (selectedPriceRanges.includes(range)) {
      setSelectedPriceRanges(selectedPriceRanges.filter((r) => r !== range));
    } else {
      setSelectedPriceRanges([...selectedPriceRanges, range]);
    }
  };

  // Handle amenity filter toggles
  const toggleAmenity = (amenity: string) => {
    setCurrentPage(1);
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // Filter hotels dynamically based on destination, stars, price, and amenities
  const filteredHotels = useMemo(() => {
    return HOTELS_DATA.filter((hotel) => {
      // 1. Destination Filter (Case-insensitive matching)
      if (destination && destination.trim() !== '') {
        const q = destination.trim().toLowerCase();
        
        // Clean query terms (e.g. "mumbai, india" -> "mumbai")
        const cityTerm = q.includes(',') ? q.split(',')[0].trim() : q;
        
        const cityMatch = 
          hotel.city.toLowerCase() === cityTerm ||
          hotel.city.toLowerCase().includes(cityTerm) ||
          cityTerm.includes(hotel.city.toLowerCase());
        
        const locationMatch = hotel.location.toLowerCase().includes(cityTerm);
        const stateMatch = hotel.state.toLowerCase().includes(cityTerm);
        const nameMatch = hotel.name.toLowerCase().includes(cityTerm);

        if (!cityMatch && !locationMatch && !stateMatch && !nameMatch) {
          return false;
        }
      }

      // 2. Star Rating Filter
      if (selectedStar !== null && hotel.rating < selectedStar) {
        return false;
      }

      // 3. Price Range Filter
      if (selectedPriceRanges.length > 0) {
        const matchesPrice = selectedPriceRanges.some((range) => {
          if (range === '₹0 - ₹8,000') return hotel.pricePerNight <= 8000;
          if (range === '₹8,000 - ₹15,000') return hotel.pricePerNight > 8000 && hotel.pricePerNight <= 15000;
          if (range === '₹15,000+') return hotel.pricePerNight > 15000;
          return true;
        });
        if (!matchesPrice) return false;
      }

      // 4. Amenities Filter
      if (selectedAmenities.length > 0) {
        const matchesAmenities = selectedAmenities.every((amenity) => {
          if (amenity === 'Breakfast Included') {
            return hotel.amenities.some((a) => a.toLowerCase().includes('breakfast'));
          }
          return hotel.amenities.some((a) => a.toLowerCase().includes(amenity.toLowerCase()));
        });
        if (!matchesAmenities) return false;
      }

      return true;
    });
  }, [destination, selectedStar, selectedPriceRanges, selectedAmenities]);

  // Paginated list
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage) || 1;
  const paginatedHotels = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredHotels.slice(start, start + itemsPerPage);
  }, [filteredHotels, currentPage]);

  const handleViewDetails = (hotel: Hotel) => {
    onSelectHotel(hotel);
    onNavigate('hotel_details', 'push');
  };

  const handleCitySelect = (city: string) => {
    if (city === 'all') {
      setDestination('');
      setSearchInput('');
    } else {
      setDestination(`${city}, India`);
      setSearchInput(`${city}, India`);
    }
    setCurrentPage(1);
  };

  const handleApplySearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setDestination(searchInput);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedStar(null);
    setSelectedPriceRanges([]);
    setSelectedAmenities([]);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#0a0a0a] text-white">
      {/* Search Summary & City Switcher Bar */}
      <div className="bg-[#141414] border-b border-[#262626] sticky top-[64px] z-40 shadow-md">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input Bar */}
            <form onSubmit={handleApplySearch} className="flex items-center gap-3 flex-grow max-w-[700px]">
              <div className="flex-1 flex items-center gap-2.5 bg-[#1c1c1c] px-3.5 py-2 rounded-lg border border-[#262626] focus-within:border-[#c5a059] transition-colors">
                <span className="material-symbols-outlined text-[#c5a059] text-[20px]">location_on</span>
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] text-[#8e8e93] uppercase tracking-wider font-semibold">
                    Destination City
                  </span>
                  <input
                    id="search-destination-input"
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search Mumbai, Jaipur, Goa, Kerala, Udaipur..."
                    className="bg-transparent border-none p-0 text-[14px] font-semibold text-white focus:outline-hidden focus:ring-0 placeholder-[#555555] w-full"
                  />
                </div>
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('');
                      setDestination('');
                    }}
                    className="text-[#8e8e93] hover:text-white text-[16px] cursor-pointer"
                    title="Clear destination"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </div>

              <div className="hidden sm:flex items-center gap-2 bg-[#1c1c1c] px-3.5 py-2 rounded-lg border border-[#262626]">
                <span className="material-symbols-outlined text-[#c5a059] text-[18px]">calendar_month</span>
                <span className="text-[13px] text-white font-medium whitespace-nowrap">Oct 15 - 20</span>
              </div>

              <button
                type="submit"
                className="bg-[#c5a059] hover:bg-[#dfba73] text-black px-4 py-2.5 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
              >
                <span className="material-symbols-outlined text-[17px]">search</span>
                <span>Search</span>
              </button>
            </form>

            <button
              type="button"
              onClick={() => onNavigate('home', 'push_back')}
              className="hidden lg:flex items-center gap-1.5 text-[13px] text-[#8e8e93] hover:text-[#c5a059] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to Home</span>
            </button>
          </div>

          {/* Quick Destination Pill Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar mt-1 border-t border-[#222222]/80">
            <span className="text-[11px] text-[#8e8e93] uppercase tracking-wider font-semibold whitespace-nowrap mr-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#c5a059]">filter_alt</span>
              Filter City:
            </span>
            
            <button
              type="button"
              onClick={() => handleCitySelect('all')}
              className={`px-3 py-1 rounded-full text-[12px] font-medium tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                !destination || destination.trim() === ''
                  ? 'bg-[#c5a059] text-black font-semibold shadow-xs'
                  : 'bg-[#1c1c1c] text-[#a3a3a3] hover:text-white hover:bg-[#262626] border border-[#262626]'
              }`}
            >
              All Properties ({HOTELS_DATA.length})
            </button>

            {POPULAR_CITIES.map((city) => {
              const isActive = destination.toLowerCase().includes(city.toLowerCase());
              const count = HOTELS_DATA.filter((h) => h.city.toLowerCase() === city.toLowerCase()).length;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleCitySelect(city)}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium tracking-wide transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#c5a059] text-black font-semibold shadow-sm'
                      : 'bg-[#1c1c1c] text-[#a3a3a3] hover:text-white hover:bg-[#262626] border border-[#262626]'
                  }`}
                >
                  <span>{city}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/20 text-black font-bold' : 'bg-[#262626] text-[#8e8e93]'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <main className="flex-grow max-w-[1280px] w-full mx-auto px-4 md:px-10 py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden md:block md:col-span-3 space-y-6">
          <div className="bg-[#141414] rounded-xl border border-[#262626] p-6 shadow-md">
            <div className="flex items-center justify-between border-b border-[#262626] pb-4 mb-6">
              <h3 className="font-playfair text-[20px] font-bold text-white">
                Filters
              </h3>
              {(selectedStar !== null || selectedPriceRanges.length > 0 || selectedAmenities.length > 0) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] font-sans font-semibold text-[#c5a059] hover:text-[#dfba73] uppercase tracking-wider cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Selected Destination Summary */}
            <div className="mb-6 bg-[#1a1a1a] p-3.5 rounded-lg border border-[#262626]">
              <span className="text-[10px] text-[#8e8e93] uppercase tracking-wider font-semibold block mb-1">
                Active Location
              </span>
              <div className="flex items-center justify-between text-[#c5a059] font-semibold text-[14px]">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  {currentCity === 'India' ? 'Pan-India Portfolio' : currentCity}
                </span>
                {destination && (
                  <button
                    type="button"
                    onClick={() => handleCitySelect('all')}
                    className="text-[11px] text-[#8e8e93] hover:text-white cursor-pointer underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <h4 className="text-[13px] font-bold text-[#c5a059] uppercase tracking-wider mb-4">
                Price Range (Per Night)
              </h4>
              <div className="space-y-3">
                {['₹0 - ₹8,000', '₹8,000 - ₹15,000', '₹15,000+'].map((range) => (
                  <label key={range} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedPriceRanges.includes(range)}
                      onChange={() => togglePriceRange(range)}
                      className="h-4 w-4 rounded bg-[#1c1c1c] border-[#333333] text-[#c5a059] focus:ring-[#c5a059] accent-[#c5a059]"
                    />
                    <span className="text-[14px] text-[#a3a3a3] group-hover:text-white transition-colors">
                      {range}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Star Rating */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-[13px] font-bold text-[#c5a059] uppercase tracking-wider">
                  Minimum Rating
                </h4>
                {selectedStar !== null && (
                  <button
                    type="button"
                    onClick={() => setSelectedStar(null)}
                    className="text-[11px] text-[#8e8e93] hover:text-white"
                  >
                    Any
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {[4.0, 4.5, 4.8].map((star) => {
                  const isSelected = selectedStar === star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSelectedStar(isSelected ? null : star)}
                      className={`px-3 py-1.5 rounded-lg border text-[13px] flex items-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#c5a059] text-black font-semibold border-[#c5a059] shadow-sm'
                          : 'border-[#262626] bg-[#1c1c1c] text-[#a3a3a3] hover:border-[#c5a059] hover:text-white'
                      }`}
                    >
                      {star}+
                      <span className={`material-symbols-outlined filled text-[14px] ${isSelected ? 'text-black' : 'text-[#c5a059]'}`}>
                        star
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-2">
              <h4 className="text-[13px] font-bold text-[#c5a059] uppercase tracking-wider mb-4">
                Amenities
              </h4>
              <div className="space-y-3">
                {[
                  { name: 'Free Wi-Fi', icon: 'wifi' },
                  { name: 'Pool', icon: 'pool' },
                  { name: 'Breakfast Included', icon: 'restaurant' },
                  { name: 'Spa', icon: 'spa' },
                  { name: 'Parking', icon: 'local_parking' },
                ].map((item) => (
                  <label key={item.name} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(item.name)}
                      onChange={() => toggleAmenity(item.name)}
                      className="h-4 w-4 rounded bg-[#1c1c1c] border-[#333333] text-[#c5a059] focus:ring-[#c5a059] accent-[#c5a059]"
                    />
                    <span className="text-[14px] text-[#a3a3a3] group-hover:text-white transition-colors flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#c5a059]">{item.icon}</span>
                      {item.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Property List Column */}
        <div className="col-span-1 md:col-span-9 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
            <div>
              <h2 className="font-playfair text-[24px] font-bold text-white tracking-wide">
                {filteredHotels.length} {filteredHotels.length === 1 ? 'Luxury Property' : 'Luxury Properties'}{' '}
                {currentCity !== 'India' ? `found in ${currentCity}` : 'across India'}
              </h2>
              <p className="text-[13px] text-[#8e8e93]">
                Handpicked 5-star estates and heritage palaces
              </p>
            </div>

            <div className="text-[13px] text-[#8e8e93] flex items-center gap-1.5 self-start sm:self-auto">
              <span>Sorted by:</span>
              <span className="text-[#c5a059] font-medium bg-[#141414] px-2.5 py-1 rounded border border-[#262626]">
                Curated Excellence
              </span>
            </div>
          </div>

          {/* Dynamic Hotel Cards List */}
          {paginatedHotels.length > 0 ? (
            paginatedHotels.map((hotel) => (
              <article
                key={hotel.id}
                className="bg-[#141414] rounded-xl border border-[#262626] hover:border-[#c5a059]/40 overflow-hidden flex flex-col md:flex-row shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                {/* Image Section */}
                <div className="md:w-1/3 relative h-60 md:h-auto min-h-[220px]">
                  <div
                    className="bg-cover bg-center w-full h-full"
                    style={{ backgroundImage: `url('${hotel.image}')` }}
                  />
                  {hotel.isVerified && (
                    <div className="absolute top-4 left-4 bg-[#0a0a0a]/90 backdrop-blur-xs text-[#c5a059] border border-[#c5a059]/30 px-2.5 py-1 rounded-md flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase shadow-md">
                      <span className="material-symbols-outlined text-[14px] text-[#c5a059]">verified</span>
                      StayEase Signature
                    </div>
                  )}
                  {hotel.isHighDemand && (
                    <div className="absolute top-4 right-4 bg-[#2b1616] text-[#ff8080] border border-[#ff8080]/30 px-2.5 py-1 rounded-md flex items-center gap-1 text-[11px] shadow-md font-semibold uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                      High Demand
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#141414] to-transparent" />
                </div>

                {/* Details Section */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-playfair text-[20px] md:text-[23px] font-bold text-white leading-tight mb-1">
                          {hotel.name}
                        </h3>
                        <p className="text-[14px] text-[#8e8e93] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-[#c5a059]">
                            location_on
                          </span>
                          {hotel.location}
                        </p>
                      </div>
                      <div className="bg-[#1c1c1c] border border-[#c5a059]/40 text-white px-2.5 py-1 rounded-lg flex flex-col items-center min-w-[52px]">
                        <span className="text-[16px] font-bold text-[#c5a059]">
                          {hotel.rating}
                        </span>
                        <span className="text-[10px] text-[#8e8e93] uppercase tracking-wider">
                          {hotel.ratingLabel}
                        </span>
                      </div>
                    </div>

                    <p className="text-[13px] text-[#a3a3a3] line-clamp-2 mt-2 leading-relaxed">
                      {hotel.description}
                    </p>

                    {/* Amenities Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {hotel.amenities.slice(0, 4).map((amenity) => (
                        <span
                          key={amenity}
                          className="bg-[#1c1c1c] text-[#8e8e93] px-2.5 py-1 rounded-md text-[12px] flex items-center gap-1 border border-[#262626]"
                        >
                          <span className="material-symbols-outlined text-[14px] text-[#c5a059]">
                            {amenity.toLowerCase().includes('wifi')
                              ? 'wifi'
                              : amenity.toLowerCase().includes('pool')
                              ? 'pool'
                              : amenity.toLowerCase().includes('spa')
                              ? 'spa'
                              : amenity.toLowerCase().includes('parking')
                              ? 'local_parking'
                              : 'restaurant'}
                          </span>
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="mt-6 flex flex-col sm:flex-row justify-between items-end border-t border-[#262626] pt-4">
                    <div className="w-full sm:w-auto mb-4 sm:mb-0">
                      <p className="text-[12px] text-[#8e8e93]">
                        {hotel.nights} nights • {hotel.guests}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="font-playfair text-[26px] font-bold text-white">
                          ₹{hotel.totalPrice.toLocaleString('en-IN')}
                        </p>
                        <span className="text-[12px] text-[#8e8e93]">
                          (₹{hotel.pricePerNight.toLocaleString('en-IN')}/night)
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8e8e93]">
                        + ₹{hotel.taxesAndFees.toLocaleString('en-IN')} luxury taxes
                      </p>
                    </div>

                    <button
                      id={`view-details-${hotel.id}`}
                      onClick={() => handleViewDetails(hotel)}
                      className="w-full sm:w-auto bg-[#c5a059] text-black font-semibold text-[14px] uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-[#dfba73] transition-colors shadow-md active:scale-95 cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            /* Empty State */
            <div className="bg-[#141414] rounded-xl border border-[#262626] p-10 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#1c1c1c] border border-[#333333] flex items-center justify-center mx-auto text-[#c5a059]">
                <span className="material-symbols-outlined text-[32px]">travel_explore</span>
              </div>
              <div>
                <h3 className="font-playfair text-[22px] font-bold text-white">
                  No properties found matching your selection
                </h3>
                <p className="text-[14px] text-[#8e8e93] mt-1 max-w-[480px] mx-auto">
                  We could not find any luxury estates in "{destination || searchInput}" with the current filters.
                </p>
              </div>

              {/* Quick Destination Switch Buttons */}
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleCitySelect('Mumbai')}
                  className="bg-[#1c1c1c] hover:bg-[#262626] text-[#c5a059] border border-[#c5a059]/40 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer"
                >
                  Show Mumbai Hotels (5)
                </button>
                <button
                  type="button"
                  onClick={() => handleCitySelect('Jaipur')}
                  className="bg-[#1c1c1c] hover:bg-[#262626] text-[#c5a059] border border-[#c5a059]/40 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer"
                >
                  Show Jaipur Hotels (5)
                </button>
                <button
                  type="button"
                  onClick={() => handleCitySelect('all')}
                  className="bg-[#c5a059] hover:bg-[#dfba73] text-black px-4 py-2 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  View All Properties
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 pt-8 border-t border-[#262626]">
              <button
                type="button"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-lg border border-[#262626] bg-[#141414] flex items-center justify-center text-[#8e8e93] hover:text-white hover:border-[#c5a059] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg text-[14px] flex items-center justify-center font-bold transition-all cursor-pointer ${
                    currentPage === page
                      ? 'bg-[#c5a059] text-black shadow-md'
                      : 'border border-[#262626] bg-[#141414] text-[#8e8e93] hover:text-white hover:border-[#c5a059]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-lg border border-[#262626] bg-[#141414] flex items-center justify-center text-[#8e8e93] hover:text-white hover:border-[#c5a059] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
