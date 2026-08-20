import React, { useState, useEffect } from 'react';
import { Screen, TransitionDirection, Hotel } from '../types';
import { HOTELS_DATA } from '../data/hotels';

export interface OfferItem {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: 'gold' | 'emerald' | 'amber' | 'blue' | 'purple' | 'rose';
  category: 'bank' | 'seasonal' | 'member' | 'villa' | 'longstay';
  discountDisplay: string;
  discountType: 'percentage' | 'flat' | 'perk';
  discountValue: number;
  minSpend: number;
  maxDiscount?: number;
  validUntil: string;
  daysRemaining: number;
  applicableHotels: string[];
  applicableCities: string[];
  bannerImage: string;
  highlights: string[];
  terms: string[];
  isFeatured?: boolean;
}

const OFFERS_DATA: OfferItem[] = [
  {
    id: 'off-1',
    code: 'MONSOON20',
    title: 'Monsoon Sanctuary Concession',
    subtitle: 'Rejuvenate amidst the rain-drenched Western Ghats & Coastal Retreats.',
    tag: 'Monsoon Special',
    tagColor: 'blue',
    category: 'seasonal',
    discountDisplay: '20% OFF',
    discountType: 'percentage',
    discountValue: 20,
    minSpend: 15000,
    maxDiscount: 6000,
    validUntil: '30 Sep 2026',
    daysRemaining: 18,
    applicableHotels: ['Taj Exotica Resort & Spa', 'The Leela Palace, Udaipur', 'Evolve Back, Kabini'],
    applicableCities: ['Goa', 'Udaipur', 'Kabini', 'Kerala'],
    bannerImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Complimentary monsoon high-tea experience daily',
      '20% off on Ayurvedic spa therapies',
      'Free date modification up to 48 hours before check-in',
    ],
    terms: [
      'Valid on minimum 2 consecutive nights stay.',
      'Applicable across participating luxury resorts in Goa, Kerala, and Rajasthan.',
      'Blackout dates may apply during long weekend festivals.',
    ],
    isFeatured: true,
  },
  {
    id: 'off-2',
    code: 'HDFCLUX15',
    title: 'HDFC Infinia & Diners Club Privilege',
    subtitle: 'Instant discount on premium suites when booked with eligible HDFC cards.',
    tag: 'Bank Exclusive',
    tagColor: 'gold',
    category: 'bank',
    discountDisplay: 'FLAT 15% OFF',
    discountType: 'percentage',
    discountValue: 15,
    minSpend: 20000,
    maxDiscount: 5000,
    validUntil: '31 Dec 2026',
    daysRemaining: 120,
    applicableHotels: ['All StayEase Properties across India'],
    applicableCities: ['Mumbai', 'Jaipur', 'Bengaluru', 'Goa', 'Delhi NCR'],
    bannerImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Instant ₹5,000 max rebate at checkout',
      '2X HDFC reward points on luxury travel portal',
      'Complimentary chef signature dessert platter',
    ],
    terms: [
      'Applicable only on HDFC Bank Infinia, Diners Club Black, and Regalia Gold cards.',
      'Minimum booking transaction of ₹20,000 required before taxes.',
      'Cannot be clubbed with corporate negotiated codes.',
    ],
    isFeatured: true,
  },
  {
    id: 'off-3',
    code: 'AMEXROYAL',
    title: 'American Express Platinum Curated Luxury',
    subtitle: 'Flat ₹4,000 rebate plus ₹2,500 complimentary estate dining credit.',
    tag: 'Amex Cardmembers',
    tagColor: 'purple',
    category: 'bank',
    discountDisplay: '₹4,000 + DINING',
    discountType: 'flat',
    discountValue: 4000,
    minSpend: 25000,
    validUntil: '15 Nov 2026',
    daysRemaining: 45,
    applicableHotels: ['The Oberoi Amarvilas', 'Taj Lands End, Mumbai', 'Umaid Bhawan Palace'],
    applicableCities: ['Agra', 'Mumbai', 'Jodhpur', 'Jaipur'],
    bannerImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      '₹2,500 estate dining credit per room per stay',
      'Guaranteed 2:00 PM late checkout courtesy',
      'Welcome bottle of sparkling wine on arrival',
    ],
    terms: [
      'Valid exclusively with American Express Platinum and Centurion cards.',
      'Requires booking directly on StayEase web terminal.',
    ],
  },
  {
    id: 'off-4',
    code: 'ELITEBLACK',
    title: 'StayEase Elite Black Member Tariff',
    subtitle: 'VIP member concession with complimentary luxury airport BMW chauffeur transfer.',
    tag: 'Member Exclusive',
    tagColor: 'gold',
    category: 'member',
    discountDisplay: '15% + TRANSFER',
    discountType: 'percentage',
    discountValue: 15,
    minSpend: 25000,
    validUntil: '31 Dec 2026',
    daysRemaining: 180,
    applicableHotels: ['All 5-Star & Heritage Palace Hotels'],
    applicableCities: ['Pan India'],
    bannerImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Complimentary airport pickup or drop in premium sedan/SUV',
      'Complimentary breakfast for 2 adults included throughout the stay',
      'Complimentary room upgrade subject to check-in availability',
    ],
    terms: [
      'Must be signed in to an active StayEase Elite Black loyalty account.',
      'Airport transfer requires minimum 24 hours advance flight itinerary notification.',
    ],
    isFeatured: true,
  },
  {
    id: 'off-5',
    code: 'LONGSTAY25',
    title: 'Serene Workation & Extended Stay',
    subtitle: 'Stay 5 nights or more and enjoy 25% concession with dedicated high-speed Wi-Fi 6 desk.',
    tag: 'Long Stay',
    tagColor: 'emerald',
    category: 'longstay',
    discountDisplay: '25% OFF (5N+)',
    discountType: 'percentage',
    discountValue: 25,
    minSpend: 40000,
    maxDiscount: 18000,
    validUntil: '30 Nov 2026',
    daysRemaining: 60,
    applicableHotels: ['Taj Exotica Resort & Spa', 'Wildflower Hall, Shimla', 'Heritage Villa, Goa'],
    applicableCities: ['Goa', 'Shimla', 'Ooty', 'Coorg', 'Udaipur'],
    bannerImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Complimentary daily laundry (4 garments per day)',
      '15% off all room service and specialty restaurant dining',
      'Dedicated concierge desk for local leisure excursions',
    ],
    terms: [
      'Minimum stay requirement of 5 consecutive nights.',
      'Full advance deposit required with flexible reschedule allowance.',
    ],
  },
  {
    id: 'off-6',
    code: 'VILLALUXE',
    title: 'Private Pool Villa & Estate Haven',
    subtitle: 'Save ₹6,000 on private pool residences with personal butler & barbecue dinner.',
    tag: 'Private Villa',
    tagColor: 'purple',
    category: 'villa',
    discountDisplay: 'FLAT ₹6,000 OFF',
    discountType: 'flat',
    discountValue: 6000,
    minSpend: 45000,
    validUntil: '15 Oct 2026',
    daysRemaining: 25,
    applicableHotels: ['Taj Exotica Beachfront Villa', 'Kumarakom Lake Resort Villa'],
    applicableCities: ['Goa', 'Kerala', 'Alibaug', 'Lonavala'],
    bannerImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Curated 4-course barbecue dinner by private estate chef',
      'Exclusive private plunge pool with floating sunset cocktails',
      'Dedicated 24-hour estate butler service',
    ],
    terms: [
      'Valid exclusively on Villa and Presidential categories.',
      'Advance reservation of minimum 3 days recommended for chef curation.',
    ],
  },
  {
    id: 'off-7',
    code: 'ICICISAPPHIRO',
    title: 'ICICI Bank Emeralde & Sapphiro Concession',
    subtitle: 'Flat 12% savings on luxury getaways plus complimentary spa session voucher.',
    tag: 'Bank Exclusive',
    tagColor: 'amber',
    category: 'bank',
    discountDisplay: '12% OFF + SPA',
    discountType: 'percentage',
    discountValue: 12,
    minSpend: 18000,
    maxDiscount: 4500,
    validUntil: '31 Dec 2026',
    daysRemaining: 130,
    applicableHotels: ['All Partner Palaces & Resorts'],
    applicableCities: ['Jaipur', 'Mumbai', 'Goa', 'Kerala', 'Kolkata'],
    bannerImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      '₹1,500 complimentary wellness spa voucher',
      '12% instant bill rebate on checkout',
      'Complimentary high-speed premium Wi-Fi',
    ],
    terms: [
      'Valid for ICICI Bank Emeralde, Sapphiro, and Rubyx credit cards.',
      'Discount applies to the room room rate before taxes.',
    ],
  },
  {
    id: 'off-8',
    code: 'FIRSTSTAY',
    title: 'Welcome to StayEase First Journey',
    subtitle: 'Flat ₹1,500 instant concession on your very first luxury reservation.',
    tag: 'New Guests',
    tagColor: 'emerald',
    category: 'member',
    discountDisplay: 'FLAT ₹1,500 OFF',
    discountType: 'flat',
    discountValue: 1500,
    minSpend: 8000,
    validUntil: '31 Dec 2026',
    daysRemaining: 150,
    applicableHotels: ['All Curated Hotels across India'],
    applicableCities: ['All Cities in India'],
    bannerImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Instant discount with no complex tier thresholds',
      'Complimentary welcome mocktail on check-in',
      'Automatic enrollment into StayEase Club rewards',
    ],
    terms: [
      'Valid for first-time booked mobile numbers or emails only.',
      'Minimum booking spend of ₹8,000.',
    ],
  },
];

interface OffersScreenProps {
  onNavigate: (screen: Screen, transition?: TransitionDirection) => void;
  onSelectHotel: (hotel: Hotel) => void;
  onOpenCustomerLogin?: () => void;
  customerUser?: { name: string; email: string; tier: string } | null;
}

export const OffersScreen: React.FC<OffersScreenProps> = ({
  onNavigate,
  onSelectHotel,
  onOpenCustomerLogin,
  customerUser,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedTermsId, setExpandedTermsId] = useState<string | null>(null);

  // Live Flash Deal Countdown
  const [countdown, setCountdown] = useState({ hours: 4, minutes: 38, seconds: 24 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const handleApplyOfferAndBook = (offer: OfferItem) => {
    // Select default Taj Exotica or best matching hotel
    const matchingHotel = HOTELS_DATA.find((h) => 
      offer.applicableHotels.some((ah) => ah.includes(h.name) || h.name.includes(ah))
    ) || HOTELS_DATA[3];

    onSelectHotel(matchingHotel);
    onNavigate('hotel_details', 'push');
  };

  // Filter offers
  const filteredOffers = OFFERS_DATA.filter((offer) => {
    const matchesCategory = selectedCategory === 'all' || offer.category === selectedCategory;
    const matchesQuery = 
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.applicableCities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] selection:bg-[#c5a059]/30 selection:text-white pb-20 font-sans">
      
      {/* Toast Notification */}
      {copiedCode && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161616] border border-[#c5a059] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="w-8 h-8 rounded-full bg-[#c5a059] text-black flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[18px]">check</span>
          </div>
          <div>
            <div className="text-[13px] font-bold text-white">Promo Code Copied!</div>
            <div className="text-[11px] text-[#c5a059] font-mono">Use <strong className="text-white">{copiedCode}</strong> during checkout</div>
          </div>
        </div>
      )}

      {/* 1. HERO HEADER SECTION */}
      <section className="relative overflow-hidden border-b border-[#262626] bg-gradient-to-b from-[#12100e] via-[#0e0e0e] to-[#0a0a0a] py-14 px-6 md:px-12">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#1c1a16] border border-[#c5a059]/40 px-3.5 py-1.5 rounded-full mb-3 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-ping" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059]">
                  Exclusive Tariffs & Privileges
                </span>
              </div>
              <h1 className="font-playfair text-[32px] sm:text-[42px] font-bold text-white leading-tight">
                Special Offers & Luxury Concessions
              </h1>
              <p className="text-[14px] sm:text-[16px] text-[#a3a3a3] mt-2 leading-relaxed">
                Handpicked promotions, premier bank partnerships, and seasonal privileges across India's finest palace sanctuaries and beach retreats.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-4 bg-[#141414] border border-[#2a2a2a] p-3 rounded-2xl shrink-0">
              <div className="text-center px-3 border-r border-[#262626]">
                <div className="font-playfair text-[20px] font-bold text-[#c5a059]">8+</div>
                <div className="text-[10px] uppercase tracking-wider text-[#8e8e93]">Active Deals</div>
              </div>
              <div className="text-center px-3 border-r border-[#262626]">
                <div className="font-playfair text-[20px] font-bold text-white">₹18K</div>
                <div className="text-[10px] uppercase tracking-wider text-[#8e8e93]">Max Savings</div>
              </div>
              <div className="text-center px-3">
                <div className="font-playfair text-[20px] font-bold text-emerald-400">100%</div>
                <div className="text-[10px] uppercase tracking-wider text-[#8e8e93]">Instant Rebate</div>
              </div>
            </div>
          </div>

          {/* Search & Category Filter Toolbar */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between pt-2">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-[#737373]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search offers by code, city, bank, or hotel..."
                className="w-full bg-[#161616] border border-[#2a2a2a] focus:border-[#c5a059] text-white pl-10 pr-4 py-2.5 rounded-xl text-[13px] outline-hidden transition-all placeholder-[#666]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-white"
                >
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {[
                { id: 'all', label: 'All Offers', icon: 'local_offer' },
                { id: 'bank', label: 'Bank & Cards', icon: 'credit_card' },
                { id: 'seasonal', label: 'Monsoon & Seasonal', icon: 'water_drop' },
                { id: 'member', label: 'Member Privileges', icon: 'stars' },
                { id: 'villa', label: 'Private Villas', icon: 'villa' },
                { id: 'longstay', label: 'Long Stay', icon: 'schedule' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-[12px] font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#c5a059] text-black shadow-md font-bold'
                      : 'bg-[#161616] text-[#a3a3a3] hover:text-white border border-[#262626] hover:border-[#3a3a3a]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLASH DEAL OF THE DAY BANNER */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 mt-8">
        <div className="relative rounded-2xl overflow-hidden border border-[#c5a059]/40 bg-gradient-to-r from-[#18140c] via-[#211b10] to-[#18140c] p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-[#0c0c0c]/80 border border-amber-500/40 px-3 py-1 rounded-full text-amber-300 text-[11px] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              Flash Deal of the Day
            </div>
            <h3 className="font-playfair text-[22px] sm:text-[26px] font-bold text-white">
              Taj Exotica Goa — Ocean Beachfront Villa Concession
            </h3>
            <p className="text-[13px] text-[#cfcfcf] max-w-xl">
              Enjoy <strong>20% instant rebate + complimentary Ayurvedic dinner</strong>. Limited presidential villas available on this promotional tariff.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            {/* Live Countdown Clock */}
            <div className="flex items-center gap-1.5 bg-[#0c0c0c] border border-[#333] px-3.5 py-2 rounded-xl text-center">
              <span className="material-symbols-outlined text-[18px] text-[#c5a059]">timer</span>
              <div className="font-mono text-[14px] font-bold text-white">
                {countdown.hours.toString().padStart(2, '0')}h : {countdown.minutes.toString().padStart(2, '0')}m : {countdown.seconds.toString().padStart(2, '0')}s
              </div>
              <span className="text-[10px] text-[#8e8e93] ml-1 uppercase">Remaining</span>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectHotel(HOTELS_DATA[3]);
                onNavigate('hotel_details', 'push');
              }}
              className="bg-[#c5a059] hover:bg-[#dfba73] text-black font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl text-[12px] transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>Claim Flash Deal</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. OFFERS GRID */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-playfair text-[24px] font-bold text-white">
              Available Promotional Tariffs
            </h2>
            <p className="text-[13px] text-[#8e8e93]">
              Showing {filteredOffers.length} available offer{filteredOffers.length === 1 ? '' : 's'} matching your preferences
            </p>
          </div>

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[12px] text-[#c5a059] hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
              Clear Search
            </button>
          )}
        </div>

        {filteredOffers.length === 0 ? (
          <div className="bg-[#121212] border border-[#262626] rounded-2xl p-12 text-center my-8">
            <div className="w-14 h-14 rounded-2xl bg-[#1c1c1c] border border-[#333] flex items-center justify-center text-[#737373] mx-auto mb-4">
              <span className="material-symbols-outlined text-[28px]">search_off</span>
            </div>
            <h3 className="font-playfair text-[20px] font-bold text-white">No Offers Found</h3>
            <p className="text-[13px] text-[#8e8e93] mt-1 max-w-md mx-auto">
              We couldn't find any active promotions matching "{searchQuery}". Try selecting another category or clear your search query.
            </p>
            <button
              type="button"
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-4 bg-[#1e1e1e] hover:bg-[#252525] text-white border border-[#333] px-4 py-2 rounded-xl text-[12px] font-semibold transition-colors"
            >
              View All Active Offers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => {
              const isExpanded = expandedTermsId === offer.id;

              return (
                <div
                  key={offer.id}
                  className="bg-[#121212] rounded-2xl border border-[#262626] hover:border-[#c5a059]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-lg hover:shadow-2xl"
                >
                  {/* Card Banner Image & Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-[#181818]">
                    <img
                      src={offer.bannerImage}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/40" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="bg-[#0c0c0c]/90 border border-[#c5a059]/50 text-[#c5a059] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                        {offer.tag}
                      </span>
                    </div>

                    {/* Discount Pill */}
                    <div className="absolute top-3 right-3 bg-[#c5a059] text-black px-3 py-1 rounded-xl text-[12px] font-extrabold uppercase tracking-wide shadow-lg">
                      {offer.discountDisplay}
                    </div>

                    {/* Validity Badge */}
                    <div className="absolute bottom-3 left-3 text-[11px] text-[#cfcfcf] flex items-center gap-1 bg-[#0c0c0c]/80 px-2 py-0.5 rounded backdrop-blur-xs">
                      <span className="material-symbols-outlined text-[13px] text-[#c5a059]">event</span>
                      <span>Valid till {offer.validUntil} ({offer.daysRemaining}d left)</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-playfair text-[18px] font-bold text-white group-hover:text-[#c5a059] transition-colors leading-snug">
                        {offer.title}
                      </h3>
                      <p className="text-[12px] text-[#8e8e93] mt-1.5 leading-relaxed line-clamp-2">
                        {offer.subtitle}
                      </p>

                      {/* Promo Code Box with 1-Click Copy */}
                      <div className="mt-4 p-3 bg-[#181818] border border-[#2a2a2a] rounded-xl flex items-center justify-between">
                        <div>
                          <div className="text-[9px] uppercase tracking-wider text-[#737373] font-mono">
                            Coupon Promo Code
                          </div>
                          <div className="font-mono text-[16px] font-bold text-[#c5a059] tracking-wider">
                            {offer.code}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyCode(offer.code)}
                          className="bg-[#222] hover:bg-[#2a2a2a] text-white border border-[#333] hover:border-[#c5a059] px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                          title="Copy promo code"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {copiedCode === offer.code ? 'check' : 'content_copy'}
                          </span>
                          <span>{copiedCode === offer.code ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      {/* Key Inclusions */}
                      <div className="mt-4 space-y-1.5">
                        {offer.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#aaa]">
                            <span className="material-symbols-outlined text-[14px] text-emerald-400 shrink-0 mt-0.5">
                              check_circle
                            </span>
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>

                      {/* Expandable Terms Drawer */}
                      {isExpanded && (
                        <div className="mt-4 p-3 bg-[#181818] rounded-xl border border-[#262626] text-[11px] text-[#8e8e93] space-y-1 animate-in fade-in duration-200">
                          <div className="font-bold text-white uppercase tracking-wider text-[10px] mb-1">
                            Terms & Conditions
                          </div>
                          {offer.terms.map((t, i) => (
                            <div key={i} className="flex items-start gap-1">
                              <span>•</span>
                              <span>{t}</span>
                            </div>
                          ))}
                          <div className="pt-1 text-[#737373]">
                            Min spend: ₹{offer.minSpend.toLocaleString('en-IN')}
                            {offer.maxDiscount && ` • Max cap: ₹${offer.maxDiscount.toLocaleString('en-IN')}`}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-5 pt-4 border-t border-[#222] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setExpandedTermsId(isExpanded ? null : offer.id)}
                        className="text-[11px] text-[#8e8e93] hover:text-white flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide Terms' : 'View T&Cs'}</span>
                        <span className="material-symbols-outlined text-[14px]">
                          {isExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplyOfferAndBook(offer)}
                        className="bg-[#c5a059] hover:bg-[#dfba73] text-black font-bold uppercase tracking-wider px-4 py-2 rounded-xl text-[11px] transition-all shadow-md active:scale-95 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Book with Offer</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. BANK PARTNERSHIP SECTION */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 mt-16">
        <div className="bg-[#121212] border border-[#262626] rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-2 bg-[#1c1a16] border border-[#c5a059]/40 px-3 py-1 rounded-full text-[#c5a059] text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[14px]">credit_card</span>
              Premier Banking Partnerships
            </div>
            <h2 className="font-playfair text-[24px] sm:text-[30px] font-bold text-white">
              Instant Card Savings on Luxury Bookings
            </h2>
            <p className="text-[13px] text-[#8e8e93] mt-1.5">
              StayEase is officially partnered with India's top financial institutions to provide automatic discounts at checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-[#181818] border border-[#2a2a2a] hover:border-[#c5a059]/40 p-5 rounded-2xl transition-all">
              <div className="text-[24px] mb-2">💳</div>
              <h4 className="font-bold text-white text-[15px]">HDFC Bank Infinia</h4>
              <div className="text-[#c5a059] font-mono text-[12px] font-bold mt-1">FLAT 15% OFF</div>
              <p className="text-[11px] text-[#8e8e93] mt-2">
                Up to ₹5,000 instant discount on Diners Club Black & Infinia Metal cards.
              </p>
              <div className="mt-3 pt-3 border-t border-[#262626] flex justify-between items-center text-[11px]">
                <span className="text-[#666]">Code:</span>
                <span className="font-mono font-bold text-white">HDFCLUX15</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#181818] border border-[#2a2a2a] hover:border-[#c5a059]/40 p-5 rounded-2xl transition-all">
              <div className="text-[24px] mb-2">💎</div>
              <h4 className="font-bold text-white text-[15px]">American Express</h4>
              <div className="text-[#c5a059] font-mono text-[12px] font-bold mt-1">₹4,000 + DINING</div>
              <p className="text-[11px] text-[#8e8e93] mt-2">
                Flat ₹4,000 savings plus ₹2,500 estate dining credit on Platinum cards.
              </p>
              <div className="mt-3 pt-3 border-t border-[#262626] flex justify-between items-center text-[11px]">
                <span className="text-[#666]">Code:</span>
                <span className="font-mono font-bold text-white">AMEXROYAL</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#181818] border border-[#2a2a2a] hover:border-[#c5a059]/40 p-5 rounded-2xl transition-all">
              <div className="text-[24px] mb-2">👑</div>
              <h4 className="font-bold text-white text-[15px]">ICICI Emeralde</h4>
              <div className="text-[#c5a059] font-mono text-[12px] font-bold mt-1">12% OFF + SPA</div>
              <p className="text-[11px] text-[#8e8e93] mt-2">
                12% bill reduction up to ₹4,500 with complimentary wellness spa voucher.
              </p>
              <div className="mt-3 pt-3 border-t border-[#262626] flex justify-between items-center text-[11px]">
                <span className="text-[#666]">Code:</span>
                <span className="font-mono font-bold text-white">ICICISAPPHIRO</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#181818] border border-[#2a2a2a] hover:border-[#c5a059]/40 p-5 rounded-2xl transition-all">
              <div className="text-[24px] mb-2">⚡</div>
              <h4 className="font-bold text-white text-[15px]">Axis Magnus & Reserve</h4>
              <div className="text-[#c5a059] font-mono text-[12px] font-bold mt-1">10% + AIRPORT</div>
              <p className="text-[11px] text-[#8e8e93] mt-2">
                Instant 10% rebate plus complimentary luxury chauffeur pickup service.
              </p>
              <div className="mt-3 pt-3 border-t border-[#262626] flex justify-between items-center text-[11px]">
                <span className="text-[#666]">Code:</span>
                <span className="font-mono font-bold text-white">AXISRESERVE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LOYALTY PRIVILEGE TIERS */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 mt-16">
        <div className="bg-gradient-to-r from-[#141414] via-[#1a1712] to-[#141414] border border-[#c5a059]/40 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-left">
            <div className="inline-flex items-center gap-2 bg-[#0c0c0c] border border-[#c5a059]/50 px-3 py-1 rounded-full text-[#c5a059] text-[11px] font-bold uppercase tracking-wider mb-3">
              <span className="material-symbols-outlined text-[14px]">stars</span>
              StayEase Club Privileges
            </div>
            <h2 className="font-playfair text-[26px] sm:text-[32px] font-bold text-white leading-tight">
              Unlock Permanent Member Rates Across India
            </h2>
            <p className="text-[14px] text-[#a3a3a3] mt-2 leading-relaxed">
              Create an account or sign in with your mobile number to automatically unlock member-only rates, complimentary room upgrades, and priority late check-outs.
            </p>
            
            {customerUser ? (
              <div className="mt-5 flex items-center gap-3 bg-[#181818] border border-[#c5a059]/40 p-3.5 rounded-xl max-w-sm">
                <span className="text-[22px]">👑</span>
                <div>
                  <div className="text-[13px] font-bold text-white">{customerUser.name}</div>
                  <div className="text-[11px] text-[#c5a059]">{customerUser.tier} Active</div>
                </div>
              </div>
            ) : (
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onOpenCustomerLogin}
                  className="bg-[#c5a059] hover:bg-[#dfba73] text-black font-bold uppercase tracking-wider px-6 py-3 rounded-xl text-[12px] transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">person</span>
                  <span>Join StayEase Club Free</span>
                </button>
              </div>
            )}
          </div>

          {/* Tier Table Summary */}
          <div className="w-full lg:w-auto grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-[#181818] p-4 rounded-xl border border-[#2a2a2a] text-left">
              <div className="text-[#c5a059] font-bold text-[13px]">Welcome Tier</div>
              <div className="text-white text-[16px] font-bold mt-1">5% OFF</div>
              <div className="text-[11px] text-[#8e8e93] mt-1">Instant on 1st booking</div>
            </div>
            <div className="bg-[#181818] p-4 rounded-xl border border-[#2a2a2a] text-left">
              <div className="text-amber-400 font-bold text-[13px]">Gold Privilege</div>
              <div className="text-white text-[16px] font-bold mt-1">10% OFF + Breakfast</div>
              <div className="text-[11px] text-[#8e8e93] mt-1">From 3rd stay</div>
            </div>
            <div className="bg-[#181818] p-4 rounded-xl border border-[#2a2a2a] text-left">
              <div className="text-[#e5e5e5] font-bold text-[13px]">Platinum Tier</div>
              <div className="text-white text-[16px] font-bold mt-1">12% OFF + Upgrade</div>
              <div className="text-[11px] text-[#8e8e93] mt-1">From 6th stay</div>
            </div>
            <div className="bg-[#181818] p-4 rounded-xl border border-[#c5a059] text-left shadow-lg">
              <div className="text-[#c5a059] font-bold text-[13px]">Elite Black</div>
              <div className="text-white text-[16px] font-bold mt-1">15% + BMW Transfer</div>
              <div className="text-[11px] text-[#c5a059] mt-1">VIP Invitation Only</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OFFERS FAQ ACCORDION */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 mt-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-playfair text-[26px] font-bold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-[13px] text-[#8e8e93] mt-1.5">
            Everything you need to know about applying coupons and bank concessions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto text-left">
          <div className="bg-[#121212] border border-[#262626] p-5 rounded-2xl">
            <h4 className="font-bold text-white text-[14px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c5a059] text-[18px]">help</span>
              How do I apply a promo code during checkout?
            </h4>
            <p className="text-[12px] text-[#8e8e93] mt-2 leading-relaxed">
              Simply copy the coupon code from this page or click "Book with Offer". The discount will automatically reflect on your booking price breakdown before final payment.
            </p>
          </div>

          <div className="bg-[#121212] border border-[#262626] p-5 rounded-2xl">
            <h4 className="font-bold text-white text-[14px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c5a059] text-[18px]">help</span>
              Can I club bank discounts with loyalty rates?
            </h4>
            <p className="text-[12px] text-[#8e8e93] mt-2 leading-relaxed">
              Yes, eligible StayEase Club member tier rates can be stacked with specific bank card cashback and UPI intent payment offers.
            </p>
          </div>

          <div className="bg-[#121212] border border-[#262626] p-5 rounded-2xl">
            <h4 className="font-bold text-white text-[14px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c5a059] text-[18px]">help</span>
              What happens if I cancel a booking with an offer?
            </h4>
            <p className="text-[12px] text-[#8e8e93] mt-2 leading-relaxed">
              If cancelled within the Free Cancellation Window, the net amount paid after discount is refunded immediately back to your original payment method.
            </p>
          </div>

          <div className="bg-[#121212] border border-[#262626] p-5 rounded-2xl">
            <h4 className="font-bold text-white text-[14px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c5a059] text-[18px]">help</span>
              Are GST luxury taxes included in discount calculations?
            </h4>
            <p className="text-[12px] text-[#8e8e93] mt-2 leading-relaxed">
              Discounts are applied directly to the base room rate, reducing the taxable base and lowering your final GST obligation as per Indian tax laws.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
