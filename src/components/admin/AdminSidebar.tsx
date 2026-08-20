import React from 'react';
import { 
  AdminTab, 
  AdminRole 
} from '../../types/admin';
import { AdminAuthSession } from '../../screens/AdminLoginScreen';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  currentRole: AdminRole;
  setCurrentRole: (role: AdminRole) => void;
  pendingRefundsCount: number;
  activeBookingsCount: number;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  adminSession?: AdminAuthSession | null;
  onLogout?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  pendingRefundsCount,
  activeBookingsCount,
  collapsed,
  setCollapsed,
  adminSession,
  onLogout,
}) => {
  const roleLabels: Record<AdminRole, { label: string; badge: string; desc: string }> = {
    super_admin: { label: 'Platform Administrator', badge: 'Super Admin', desc: 'Full System & GST Access' },
    hotel_owner: { label: 'Hotel Owner / GM', badge: 'Taj Group', desc: 'Property Revenue & Strategy' },
    operations: { label: 'Operations & Front Desk', badge: 'Front Desk', desc: 'Tape Chart & Check-ins' },
    support_agent: { label: 'Support & Disputes', badge: 'Support Desk', desc: 'Escalations & Refunds' },
  };

  const navItems: Array<{
    id: AdminTab;
    label: string;
    icon: string;
    badge?: number | string;
    badgeColor?: string;
    roles?: AdminRole[];
  }> = [
    { id: 'overview', label: 'Executive Overview', icon: 'dashboard' },
    { id: 'bookings', label: 'Bookings & Folios', icon: 'calendar_month', badge: activeBookingsCount, badgeColor: 'bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/40' },
    { id: 'inventory', label: 'Room Inventory & Tape Chart', icon: 'hotel_class' },
    { id: 'customers', label: 'Guests & VIP CRM', icon: 'groups' },
    { id: 'payments', label: 'Payments & Settlements', icon: 'payments' },
    { id: 'refunds', label: 'Instant Refunds', icon: 'currency_exchange', badge: pendingRefundsCount > 0 ? pendingRefundsCount : undefined, badgeColor: 'bg-rose-950/80 text-rose-400 border border-rose-800' },
    { id: 'reviews', label: 'Reviews & Reputation', icon: 'reviews' },
    { id: 'offers', label: 'Offers & Campaigns', icon: 'local_offer' },
    { id: 'system', label: 'System Health & Audit', icon: 'monitoring', badge: 'Live', badgeColor: 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' },
  ];

  return (
    <aside 
      className={`bg-[#0d0d0d] border-r border-[#262626] flex flex-col justify-between transition-all duration-300 z-40 shrink-0 ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Top Section */}
      <div className="flex flex-col h-full overflow-hidden">
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-[#262626] flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1c1c1c] to-[#141414] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] shrink-0 shadow-inner">
                <span className="material-symbols-outlined filled text-[20px]">hotel</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-playfair text-[18px] font-bold text-white tracking-wide truncate">StayEase</span>
                  <span className="text-[9px] font-semibold uppercase tracking-wider bg-[#c5a059] text-black px-1.5 py-0.5 rounded font-mono">
                    ADMIN
                  </span>
                </div>
                <span className="text-[11px] text-[#8e8e93] truncate">Hospitality Cloud India</span>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-9 h-9 rounded-lg bg-[#141414] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059]">
                <span className="material-symbols-outlined filled text-[20px]">hotel</span>
              </div>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md text-[#8e8e93] hover:text-white hover:bg-[#1a1a1a] transition-colors cursor-pointer hidden md:flex"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="material-symbols-outlined text-[18px]">
              {collapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>
        </div>

        {/* Persona / Role Selector Badge */}
        <div className="p-3 border-b border-[#262626]">
          {!collapsed ? (
            <div className="bg-[#141414] border border-[#262626] rounded-lg p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-semibold text-[#8e8e93] tracking-wider">Active Workspace Persona</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as AdminRole)}
                className="w-full bg-[#1c1c1c] border border-[#333] text-white text-[12px] font-medium rounded px-2 py-1.5 outline-hidden focus:border-[#c5a059] cursor-pointer"
              >
                <option value="super_admin">👑 Super Administrator (All Access)</option>
                <option value="hotel_owner">🏨 Hotel Owner / GM (Taj Portfolio)</option>
                <option value="operations">🛎️ Operations & Front Desk Lead</option>
                <option value="support_agent">🎧 Support & Disputes Desk</option>
              </select>
              <p className="text-[10px] text-[#8e8e93] mt-1.5 truncate">
                {roleLabels[currentRole].desc}
              </p>
            </div>
          ) : (
            <div className="flex justify-center" title={`Current Role: ${roleLabels[currentRole].label}`}>
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#c5a059]/50 flex items-center justify-center text-[#c5a059] text-xs font-bold">
                {currentRole === 'super_admin' ? '👑' : currentRole === 'hotel_owner' ? '🏨' : currentRole === 'operations' ? '🛎️' : '🎧'}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items List */}
        <div className="flex-grow overflow-y-auto px-2 py-3 space-y-1">
          <div className={`px-3 py-1 text-[10px] uppercase font-bold text-[#666] tracking-wider ${collapsed ? 'hidden' : 'block'}`}>
            Operations & Control
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all cursor-pointer relative group ${
                  isActive
                    ? 'bg-[#1c1c1c] text-[#c5a059] border border-[#c5a059]/40 shadow-sm'
                    : 'text-[#a3a3a3] hover:text-white hover:bg-[#141414]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#c5a059] rounded-r" />
                )}
                
                <span className={`material-symbols-outlined text-[20px] shrink-0 ${
                  isActive ? 'text-[#c5a059] filled' : 'text-[#8e8e93] group-hover:text-white'
                }`}>
                  {item.icon}
                </span>

                {!collapsed && (
                  <span className="flex-grow text-left truncate tracking-wide">
                    {item.label}
                  </span>
                )}

                {!collapsed && item.badge !== undefined && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${item.badgeColor || 'bg-[#262626] text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom User Bar */}
        <div className="p-3 border-t border-[#262626] bg-[#0a0a0a]">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-[#1c1c1c] border border-[#333] flex items-center justify-center text-xs font-bold text-[#c5a059]">
                  {adminSession ? adminSession.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'ST'}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] font-semibold text-white truncate">
                    {adminSession ? adminSession.name : 'Siddharth Tagore'}
                  </span>
                  <span className="text-[10px] text-[#8e8e93] truncate">
                    {adminSession ? adminSession.email : 's.tagore@stayease.in'}
                  </span>
                </div>
              </div>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="text-[#8e8e93] hover:text-rose-400 p-1 transition-colors cursor-pointer"
                  title="Lock terminal & sign out"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex justify-center" title={`${adminSession?.name || 'Siddharth Tagore'} (Click to Logout)`}>
              {onLogout ? (
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-8 h-8 rounded-full bg-[#1c1c1c] border border-[#c5a059]/40 hover:border-rose-500 flex items-center justify-center text-xs font-bold text-[#c5a059] hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                </button>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#1c1c1c] border border-[#c5a059]/40 flex items-center justify-center text-xs font-bold text-[#c5a059]">
                  {adminSession ? adminSession.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'ST'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
