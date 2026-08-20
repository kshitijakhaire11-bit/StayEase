import React from 'react';
import { Screen, TransitionDirection } from '../types';

interface FooterProps {
  onOpenStaffPortal?: () => void;
  onNavigate?: (screen: Screen, transition?: TransitionDirection) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenStaffPortal, onNavigate }) => {
  return (
    <footer className="bg-[#0e0e0e] border-t border-[#262626] w-full mt-auto text-[#a3a3a3]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 md:px-10 py-14 max-w-[1280px] mx-auto">
        <div className="flex flex-col gap-4 md:col-span-1">
          <span className="font-playfair text-[26px] font-bold text-white tracking-wider">
            StayEase <span className="text-[#c5a059]">.</span>
          </span>
          <p className="text-[#8e8e93] text-[14px] leading-relaxed">
            Curating India's finest sanctuaries, heritage estates, and luxury retreats with bespoke hospitality.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-[12px] font-semibold text-[#c5a059] uppercase tracking-widest">
            Collection
          </h4>
          <a
            className="text-[#8e8e93] hover:text-[#c5a059] transition-colors text-[14px] cursor-pointer"
            href="#hotels"
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.('search_results', 'push');
            }}
          >
            Heritage Havelis & Palaces
          </a>
          <a
            className="text-[#8e8e93] hover:text-[#c5a059] transition-colors text-[14px] cursor-pointer"
            href="#offers"
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.('offers', 'push');
            }}
          >
            Special Offers & Tariffs <span className="text-[10px] bg-[#c5a059]/20 text-[#c5a059] px-1.5 py-0.5 rounded font-mono ml-1">New</span>
          </a>
          <a
            className="text-[#8e8e93] hover:text-[#c5a059] transition-colors text-[14px] cursor-pointer"
            href="#villas"
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.('search_results', 'push');
            }}
          >
            Curated Villas
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-[12px] font-semibold text-[#c5a059] uppercase tracking-widest">
            Concierge
          </h4>
          <a className="text-[#8e8e93] hover:text-[#c5a059] transition-colors text-[14px]" href="#support">
            24/7 Guest Care
          </a>
          <a className="text-[#8e8e93] hover:text-[#c5a059] transition-colors text-[14px]" href="#terms">
            Terms of Luxury
          </a>
          <a className="text-[#8e8e93] hover:text-[#c5a059] transition-colors text-[14px]" href="#privacy">
            Privacy Policy
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-[12px] font-semibold text-[#c5a059] uppercase tracking-widest">
            Direct Line
          </h4>
          <p className="text-[#8e8e93] text-[14px] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#c5a059]">call</span>
            1800-123-4567 (Toll-Free)
          </p>
          <p className="text-[#8e8e93] text-[14px] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#c5a059]">mail</span>
            concierge@stayease.in
          </p>
        </div>
      </div>

      <div className="border-t border-[#1c1c1c]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between text-[#737373] text-[13px] tracking-wide gap-3">
          <div>© 2026 StayEase Luxury Hospitality India. All rights reserved.</div>
          
          {onOpenStaffPortal && (
            <button
              type="button"
              onClick={onOpenStaffPortal}
              className="text-[11px] text-[#555] hover:text-[#c5a059] transition-colors flex items-center gap-1 cursor-pointer"
              title="Restricted Staff & Hotel Operations Terminal"
            >
              <span className="material-symbols-outlined text-[14px]">lock</span>
              <span>Authorized Staff Portal</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
