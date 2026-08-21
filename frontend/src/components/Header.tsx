import React from 'react';
import { Screen, TransitionDirection } from '../types';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen, transition?: TransitionDirection) => void;
  onOpenCustomerLogin?: () => void;
  customerUser?: { name: string; email: string; tier: string } | null;
  onCustomerLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onOpenCustomerLogin,
  customerUser,
  onCustomerLogout,
}) => {
  const isCheckout = currentScreen === 'checkout';

  if (isCheckout) {
    return (
      <header className="w-full bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#262626] py-4 px-6 md:px-10 flex justify-between items-center z-50 sticky top-0 shadow-lg">
        <div className="max-w-[1280px] mx-auto w-full flex justify-between items-center">
          <a
            href="#home"
            id="stayease-logo-checkout"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home', 'push_back');
            }}
            className="font-playfair text-[24px] font-bold text-white tracking-wide flex items-center gap-2.5 cursor-pointer hover:text-[#c5a059] transition-colors"
          >
            <span className="material-symbols-outlined filled text-[#c5a059] text-2xl">hotel</span>
            StayEase
          </a>
          <div className="flex items-center gap-2 text-[#c5a059] text-[13px] font-medium bg-[#141414] px-3.5 py-1.5 rounded-full border border-[#c5a059]/30 shadow-xs">
            <span className="material-symbols-outlined text-[16px] text-[#c5a059]">lock</span>
            <span className="tracking-wide">Secure Luxury Checkout</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#262626] sticky top-0 z-50 w-full text-white shadow-xl">
      <div className="flex justify-between items-center px-6 md:px-10 py-4 w-full max-w-[1280px] mx-auto">
        <div className="flex items-center gap-10">
          <a
            href="#home"
            id="stayease-logo-nav"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home', 'push_back');
            }}
            className="font-playfair text-[24px] font-bold text-white tracking-wider flex items-center gap-2 cursor-pointer hover:text-[#c5a059] transition-colors"
          >
            {currentScreen === 'hotel_details' ? (
              <span className="material-symbols-outlined filled text-[#c5a059]">travel_explore</span>
            ) : (
              <span className="material-symbols-outlined filled text-[#c5a059]">hotel</span>
            )}
            <span>StayEase</span>
          </a>
          <nav className="hidden md:flex gap-8 items-center text-[14px] tracking-wide">
            <a
              href="#hotels"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('search_results', 'push');
              }}
              className={`font-medium transition-colors ${
                currentScreen === 'search_results' || currentScreen === 'hotel_details'
                  ? 'text-[#c5a059] border-b border-[#c5a059] pb-0.5'
                  : 'text-[#a3a3a3] hover:text-[#c5a059]'
              }`}
            >
              Hotels & Resorts
            </a>
            <a
              href="#offers"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('offers', 'push');
              }}
              className={`font-medium transition-colors flex items-center gap-1.5 ${
                currentScreen === 'offers'
                  ? 'text-[#c5a059] border-b border-[#c5a059] pb-0.5'
                  : 'text-[#a3a3a3] hover:text-[#c5a059]'
              }`}
            >
              <span>Offers</span>
              <span className="bg-[#c5a059] text-black text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                New
              </span>
            </a>
            <a
              href="#stays"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home', 'push_back');
              }}
              className={`font-medium transition-colors ${
                currentScreen === 'home'
                  ? 'text-[#c5a059] border-b border-[#c5a059] pb-0.5'
                  : 'text-[#a3a3a3] hover:text-[#c5a059]'
              }`}
            >
              Exclusive Stays
            </a>
            <a
              href="#concierge"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('offers', 'push');
              }}
              className="text-[#a3a3a3] font-medium hover:text-[#c5a059] transition-colors"
            >
              Concierge
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden sm:flex items-center gap-1.5 text-[#a3a3a3] font-medium hover:text-[#c5a059] transition-colors text-[13px] tracking-wide px-2 py-1"
          >
            <span className="material-symbols-outlined text-[17px] text-[#c5a059]">currency_rupee</span>
            <span>INR (₹)</span>
          </button>
          
          {customerUser ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-[#141414] border border-[#c5a059]/40 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#c5a059]" />
                <span className="text-[12px] font-semibold text-white truncate max-w-[120px]">{customerUser.name}</span>
                <span className="text-[10px] text-[#c5a059] font-mono hidden sm:inline">({customerUser.tier.split(' ')[1] || 'Privilege'})</span>
              </div>
              <button
                type="button"
                onClick={onCustomerLogout}
                className="text-[11px] text-[#8e8e93] hover:text-rose-400 p-1 transition-colors"
                title="Sign out guest session"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenCustomerLogin}
              className="bg-[#c5a059] hover:bg-[#dfba73] text-[#0a0a0a] px-4 py-1.5 rounded font-semibold text-[12px] tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
