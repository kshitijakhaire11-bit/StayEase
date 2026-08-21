import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  AdminBooking, 
  AdminRoom, 
  AdminRefund, 
  AdminRole 
} from '../../../types/admin';
import { 
  REVENUE_ANALYTICS_DATA, 
  CITY_DISTRIBUTION_DATA, 
  PAYMENT_METHOD_DISTRIBUTION 
} from '../../../data/adminMockData';

interface OverviewTabProps {
  bookings: AdminBooking[];
  rooms: AdminRoom[];
  refunds: AdminRefund[];
  currentRole: AdminRole;
  selectedHotelName: string;
  onNavigateToTab: (tab: any) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  bookings,
  rooms,
  refunds,
  currentRole,
  selectedHotelName,
  onNavigateToTab,
}) => {
  const totalRevenue = bookings.reduce((acc, b) => acc + (b.paymentStatus === 'Paid' ? b.netPayable : 0), 0);
  const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
  const cleanRooms = rooms.filter(r => r.status === 'Clean & Available' || r.status === 'Inspected').length;
  const dirtyRooms = rooms.filter(r => r.status === 'Dirty').length;
  const maintenanceRooms = rooms.filter(r => r.status === 'Maintenance' || r.status === 'Blocked').length;
  const occupancyRate = Math.round((occupiedRooms / rooms.length) * 100) || 75;

  const pendingRefundsTotal = refunds
    .filter(r => r.status === 'Pending Approval')
    .reduce((acc, r) => acc + r.refundAmount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner with Property Status */}
      <div className="bg-gradient-to-r from-[#141414] via-[#1a1813] to-[#141414] border border-[#c5a059]/30 rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#c5a059]">Portfolio Dashboard</span>
            <span className="bg-[#c5a059]/20 text-[#c5a059] text-[10px] font-bold px-2 py-0.5 rounded border border-[#c5a059]/40">
              India High-Season Active
            </span>
          </div>
          <h2 className="font-playfair text-[22px] md:text-[26px] font-bold text-white tracking-tight">
            {selectedHotelName}
          </h2>
          <p className="text-[13px] text-[#a3a3a3]">
            Operational performance, real-time RevPAR metrics, automated GST settlement reconciliation, and instant refund SLAs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigateToTab('bookings')}
            className="bg-[#1c1c1c] hover:bg-[#262626] text-white border border-[#333] px-4 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer"
          >
            View 1,842 Active Stays
          </button>
          <button 
            onClick={() => onNavigateToTab('inventory')}
            className="bg-[#c5a059] hover:bg-[#dfba73] text-black px-4 py-2 rounded-lg text-[13px] font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
          >
            Live Tape Chart
          </button>
        </div>
      </div>

      {/* 8 Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: GMV / Total Revenue */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4.5 hover:border-[#c5a059]/40 transition-colors">
          <div className="flex items-center justify-between text-[#8e8e93] text-[12px] mb-2">
            <span>Gross Revenue (MTD)</span>
            <span className="text-emerald-400 font-medium text-[11px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
              +14.8% YoY
            </span>
          </div>
          <div className="font-playfair text-[24px] md:text-[28px] font-bold text-white">
            ₹5.20 Cr
          </div>
          <div className="text-[11px] text-[#8e8e93] mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-emerald-400">trending_up</span>
            <span>₹42.8 Lakh captured in last 24h</span>
          </div>
        </div>

        {/* Metric 2: Occupancy Rate */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4.5 hover:border-[#c5a059]/40 transition-colors">
          <div className="flex items-center justify-between text-[#8e8e93] text-[12px] mb-2">
            <span>Portfolio Occupancy</span>
            <span className="text-emerald-400 font-medium text-[11px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
              +6.2%
            </span>
          </div>
          <div className="font-playfair text-[24px] md:text-[28px] font-bold text-white">
            {occupancyRate}%
          </div>
          <div className="text-[11px] text-[#8e8e93] mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#c5a059]">bed</span>
            <span>{occupiedRooms} occupied / {rooms.length} sample rooms</span>
          </div>
        </div>

        {/* Metric 3: Average Daily Rate (ADR) */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4.5 hover:border-[#c5a059]/40 transition-colors">
          <div className="flex items-center justify-between text-[#8e8e93] text-[12px] mb-2">
            <span>Average Daily Rate (ADR)</span>
            <span className="text-[#c5a059] font-medium text-[11px] bg-[#c5a059]/10 px-1.5 py-0.5 rounded border border-[#c5a059]/30">
              High Tier
            </span>
          </div>
          <div className="font-playfair text-[24px] md:text-[28px] font-bold text-white">
            ₹9,750
          </div>
          <div className="text-[11px] text-[#8e8e93] mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#c5a059]">sell</span>
            <span>RevPAR: ₹8,580 (+11.4%)</span>
          </div>
        </div>

        {/* Metric 4: Pending Refunds Queue */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4.5 hover:border-rose-800/60 transition-colors cursor-pointer"
          onClick={() => onNavigateToTab('refunds')}
        >
          <div className="flex items-center justify-between text-[#8e8e93] text-[12px] mb-2">
            <span>Pending Refunds Queue</span>
            <span className="text-rose-400 font-medium text-[11px] bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800">
              {refunds.filter(r => r.status === 'Pending Approval').length} claims
            </span>
          </div>
          <div className="font-playfair text-[24px] md:text-[28px] font-bold text-rose-400">
            ₹{pendingRefundsTotal.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#8e8e93] mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-rose-400">timer</span>
            <span>Avg SLA turnaround: 14 mins</span>
          </div>
        </div>
      </div>

      {/* Secondary Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[12px]">
        <div className="bg-[#101010] border border-[#222] p-3 rounded-lg flex items-center justify-between">
          <span className="text-[#8e8e93]">Clean & Inspected</span>
          <span className="font-bold text-emerald-400 font-mono">{cleanRooms} Rooms</span>
        </div>
        <div className="bg-[#101010] border border-[#222] p-3 rounded-lg flex items-center justify-between">
          <span className="text-[#8e8e93]">Housekeeping Dirty</span>
          <span className="font-bold text-amber-400 font-mono">{dirtyRooms} Rooms</span>
        </div>
        <div className="bg-[#101010] border border-[#222] p-3 rounded-lg flex items-center justify-between">
          <span className="text-[#8e8e93]">Maintenance / Hold</span>
          <span className="font-bold text-rose-400 font-mono">{maintenanceRooms} Rooms</span>
        </div>
        <div className="bg-[#101010] border border-[#222] p-3 rounded-lg flex items-center justify-between">
          <span className="text-[#8e8e93]">GST 18% Collected (MTD)</span>
          <span className="font-bold text-[#c5a059] font-mono">₹93.6 Lakh</span>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Velocity Chart (8 cols) */}
        <div className="lg:col-span-8 bg-[#141414] border border-[#262626] rounded-xl p-5 md:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="font-playfair text-[18px] font-bold text-white">
                Revenue Velocity & Booking Volume (2026 MTD)
              </h3>
              <p className="text-[12px] text-[#8e8e93]">
                Monthly gross booking value (₹ Lakhs) and hotel room night reservations
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="flex items-center gap-1 text-[#c5a059]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c5a059]" /> Gross Revenue (₹L)
              </span>
              <span className="flex items-center gap-1 text-emerald-400 ml-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Bookings Count
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_ANALYTICS_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c5a059" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#c5a059" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="month" stroke="#8e8e93" fontSize={12} tickLine={false} />
                <YAxis stroke="#8e8e93" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1c1c', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                  formatter={(value: any, name: any) => [
                    name === 'revenueLakhs' ? `₹${value} Lakhs` : `${value} bookings`,
                    name === 'revenueLakhs' ? 'Revenue' : 'Reservations'
                  ]}
                />
                <Area type="monotone" dataKey="revenueLakhs" stroke="#c5a059" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGold)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Gateways & Methods (4 cols) */}
        <div className="lg:col-span-4 bg-[#141414] border border-[#262626] rounded-xl p-5 md:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-playfair text-[18px] font-bold text-white mb-1">
              Payment Gateway Mix
            </h3>
            <p className="text-[12px] text-[#8e8e93] mb-4">
              UPI Intent vs Credit Cards & Corporate Invoicing
            </p>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PAYMENT_METHOD_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {PAYMENT_METHOD_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1c1c', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                  formatter={(val: any) => [`${val}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-3 border-t border-[#262626] text-[11px]">
            {PAYMENT_METHOD_DISTRIBUTION.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-[#a3a3a3]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: City Distribution & Live VIP Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Geographic Indian Demand (7 cols) */}
        <div className="lg:col-span-7 bg-[#141414] border border-[#262626] rounded-xl p-5 md:p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-playfair text-[18px] font-bold text-white">
                Top Indian Hospitality Hubs (Demand Share)
              </h3>
              <p className="text-[12px] text-[#8e8e93]">
                Revenue contribution by destination cluster
              </p>
            </div>
            <span className="text-[11px] text-[#c5a059] font-mono">Pan-India</span>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CITY_DISTRIBUTION_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="city" stroke="#8e8e93" fontSize={11} tickLine={false} />
                <YAxis stroke="#8e8e93" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1c1c', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                  formatter={(val: any) => [`${val}%`, 'Booking Share']}
                />
                <Bar dataKey="bookingsShare" fill="#c5a059" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live VIP Arrival & Check-In Feed (5 cols) */}
        <div className="lg:col-span-5 bg-[#141414] border border-[#262626] rounded-xl p-5 md:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-playfair text-[18px] font-bold text-white">
                VIP Guest Roster (Today)
              </h3>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                Front Desk IST
              </span>
            </div>

            <div className="space-y-3">
              {bookings.slice(0, 3).map((b) => (
                <div key={b.id} className="p-3 rounded-lg bg-[#1c1c1c] border border-[#262626] hover:border-[#c5a059]/40 transition-all flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[13px] text-white">{b.guestName}</span>
                      <span className="text-[10px] font-semibold text-[#c5a059] bg-[#c5a059]/10 px-1.5 py-0.2 rounded border border-[#c5a059]/30">
                        {b.guestTier}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8e8e93] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-[#c5a059]">hotel</span>
                      <span>{b.hotelName} • {b.roomNumber}</span>
                    </p>
                    <p className="text-[10px] text-[#c5a059] italic truncate max-w-[240px]">
                      "{b.specialRequests}"
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      b.bookingStatus === 'Checked In' 
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                        : 'bg-[#262626] text-white'
                    }`}>
                      {b.bookingStatus}
                    </span>
                    <div className="text-[11px] font-mono font-bold text-white mt-1">
                      ₹{b.netPayable.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onNavigateToTab('bookings')}
            className="mt-4 w-full text-center text-[12px] text-[#c5a059] hover:underline font-medium py-1"
          >
            View All Check-ins & Reservations →
          </button>
        </div>
      </div>
    </div>
  );
};
