import React, { useState } from 'react';
import { AdminRoom, RoomStatus } from '../../../types/admin';

interface InventoryTabProps {
  rooms: AdminRoom[];
  onUpdateRoomStatus: (roomId: string, newStatus: RoomStatus) => void;
  onAddRoom: (room: AdminRoom) => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  rooms,
  onUpdateRoomStatus,
  onAddRoom,
}) => {
  const [selectedRoom, setSelectedRoom] = useState<AdminRoom | null>(null);
  const [activeFloorFilter, setActiveFloorFilter] = useState<string>('All');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('All');
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [weekendSurgeMultiplier, setWeekendSurgeMultiplier] = useState<number>(1.20);
  const [monsoonDiscountPct, setMonsoonDiscountPct] = useState<number>(15);
  const [surgeActive, setSurgeActive] = useState<boolean>(true);
  const [pricingToast, setPricingToast] = useState<string | null>(null);

  // New Room Form State
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomFloor, setNewRoomFloor] = useState('1');
  const [newRoomType, setNewRoomType] = useState('Deluxe City View Room');
  const [newRoomTier, setNewRoomTier] = useState<'Standard' | 'Deluxe' | 'Ocean Suite' | 'Presidential Villa'>('Deluxe');
  const [newRoomBasePrice, setNewRoomBasePrice] = useState('9500');

  const filteredRooms = rooms.filter((r) => {
    const matchesFloor = activeFloorFilter === 'All' || r.floor.toString() === activeFloorFilter;
    const matchesStatus = activeStatusFilter === 'All' || r.status === activeStatusFilter;
    return matchesFloor && matchesStatus;
  });

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case 'Clean & Available': return 'bg-emerald-950/80 border-emerald-700 text-emerald-300';
      case 'Occupied': return 'bg-blue-950/80 border-blue-700 text-blue-300';
      case 'Dirty': return 'bg-amber-950/80 border-amber-700 text-amber-300';
      case 'Inspected': return 'bg-teal-950/80 border-teal-700 text-teal-300';
      case 'Maintenance': return 'bg-rose-950/80 border-rose-700 text-rose-300';
      case 'Blocked': return 'bg-gray-900 border-gray-700 text-gray-400';
    }
  };

  const handleApplyPricingRules = () => {
    setPricingToast(`Applied: Weekend Surge ${weekendSurgeMultiplier}x & Monsoon Discount ${monsoonDiscountPct}% across ${rooms.length} room inventories.`);
    setTimeout(() => setPricingToast(null), 3000);
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber) return;

    const newRoom: AdminRoom = {
      id: `r-${Date.now()}`,
      roomNumber: newRoomNumber,
      floor: parseInt(newRoomFloor) || 1,
      type: newRoomType,
      tier: newRoomTier,
      basePrice: parseFloat(newRoomBasePrice) || 8500,
      status: 'Clean & Available',
      lastCleaned: new Date().toISOString().slice(0, 16).replace('T', ' '),
      housekeeper: 'Assigned on Shift',
      features: ['Wi-Fi', 'King Bed', 'AC', 'Work Desk']
    };

    onAddRoom(newRoom);
    setShowAddRoomModal(false);
    setNewRoomNumber('');
    setPricingToast(`Room ${newRoomNumber} added to inventory tape chart.`);
    setTimeout(() => setPricingToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Dynamic Pricing Engine Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dynamic Rate Plan & Pricing Matrix Rules (7 cols) */}
        <div className="lg:col-span-7 bg-[#141414] border border-[#262626] rounded-xl p-5 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-playfair text-[18px] font-bold text-white">Dynamic Rate Engine & Surge Modifiers</span>
                <span className="bg-[#c5a059]/20 text-[#c5a059] text-[10px] font-mono px-2 py-0.5 rounded border border-[#c5a059]/40">
                  AUTO-YIELD
                </span>
              </div>
              <p className="text-[12px] text-[#8e8e93]">
                Control weekend price multipliers, monsoon stay concessions, and minimum stay rules.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[#8e8e93]">Surge</span>
              <button
                onClick={() => setSurgeActive(!surgeActive)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  surgeActive ? 'bg-[#c5a059]' : 'bg-[#262626]'
                }`}
              >
                <div className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  surgeActive ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12px]">
            <div className="bg-[#1c1c1c] p-3 rounded-lg border border-[#262626] space-y-2">
              <div className="flex justify-between text-white font-medium">
                <span>Weekend Surge Multiplier (Fri-Sun)</span>
                <span className="font-bold text-[#c5a059]">{weekendSurgeMultiplier}x (+{Math.round((weekendSurgeMultiplier - 1)*100)}%)</span>
              </div>
              <input
                type="range"
                min="1.00"
                max="1.60"
                step="0.05"
                value={weekendSurgeMultiplier}
                onChange={(e) => setWeekendSurgeMultiplier(parseFloat(e.target.value))}
                className="w-full accent-[#c5a059] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8e8e93]">
                <span>Base (1.0x)</span>
                <span>Peak (1.6x)</span>
              </div>
            </div>

            <div className="bg-[#1c1c1c] p-3 rounded-lg border border-[#262626] space-y-2">
              <div className="flex justify-between text-white font-medium">
                <span>Monsoon Retreat Concession</span>
                <span className="font-bold text-emerald-400">-{monsoonDiscountPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={monsoonDiscountPct}
                onChange={(e) => setMonsoonDiscountPct(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8e8e93]">
                <span>0% (Regular)</span>
                <span>30% (Deep Value)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center pt-3 border-t border-[#262626]">
            <span className="text-[11px] text-[#8e8e93]">OTA Channel Manager & PMS synced at 02:00 IST</span>
            <button
              onClick={handleApplyPricingRules}
              className="bg-[#c5a059] hover:bg-[#dfba73] text-black px-4 py-1.5 rounded-lg text-[12px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Update Rate Plans
            </button>
          </div>
        </div>

        {/* Quick Inventory Summary (5 cols) */}
        <div className="lg:col-span-5 bg-[#141414] border border-[#262626] rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-playfair text-[18px] font-bold text-white">
                Live Tape Matrix Summary
              </h3>
              <button
                onClick={() => setShowAddRoomModal(true)}
                className="bg-[#1c1c1c] hover:bg-[#262626] text-[#c5a059] border border-[#333] px-3 py-1 rounded text-[11px] font-semibold uppercase tracking-wider cursor-pointer"
              >
                + Add Room
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-[12px]">
              <div className="bg-[#1c1c1c] p-2.5 rounded border border-emerald-800/40 flex items-center justify-between">
                <span className="text-emerald-400">Clean & Available</span>
                <span className="font-bold text-white font-mono">{rooms.filter(r => r.status === 'Clean & Available').length}</span>
              </div>
              <div className="bg-[#1c1c1c] p-2.5 rounded border border-blue-800/40 flex items-center justify-between">
                <span className="text-blue-400">Occupied (Guest In)</span>
                <span className="font-bold text-white font-mono">{rooms.filter(r => r.status === 'Occupied').length}</span>
              </div>
              <div className="bg-[#1c1c1c] p-2.5 rounded border border-amber-800/40 flex items-center justify-between">
                <span className="text-amber-400">Housekeeping Dirty</span>
                <span className="font-bold text-white font-mono">{rooms.filter(r => r.status === 'Dirty').length}</span>
              </div>
              <div className="bg-[#1c1c1c] p-2.5 rounded border border-rose-800/40 flex items-center justify-between">
                <span className="text-rose-400">Maintenance / Hold</span>
                <span className="font-bold text-white font-mono">{rooms.filter(r => r.status === 'Maintenance').length}</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#8e8e93] mt-3 pt-2 border-t border-[#262626]">
            💡 Click on any room tile below to change housekeeping state, inspect or view assigned guest details.
          </p>
        </div>
      </div>

      {/* Filter Tabs for Room Matrix */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Floor selector */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] uppercase font-bold text-[#8e8e93] mr-1">Floor:</span>
          {['All', '1', '2', '3', '4'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFloorFilter(f)}
              className={`px-3 py-1 rounded text-[12px] font-medium transition-colors cursor-pointer ${
                activeFloorFilter === f
                  ? 'bg-[#c5a059] text-black font-bold'
                  : 'bg-[#1c1c1c] text-[#a3a3a3] hover:text-white border border-[#262626]'
              }`}
            >
              {f === 'All' ? 'All Floors' : `Floor ${f}`}
            </button>
          ))}
        </div>

        {/* Status selector */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] uppercase font-bold text-[#8e8e93] mr-1">Status:</span>
          {['All', 'Clean & Available', 'Occupied', 'Dirty', 'Inspected', 'Maintenance'].map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                activeStatusFilter === st
                  ? 'bg-white text-black font-bold'
                  : 'bg-[#1c1c1c] text-[#a3a3a3] hover:text-white border border-[#262626]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Tape Chart / Room Grid */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 shadow-xl">
        <h3 className="font-playfair text-[18px] font-bold text-white mb-4">
          Room Inventory Tape Chart Grid
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredRooms.map((room) => {
            const statusClass = getStatusColor(room.status);
            return (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`border rounded-xl p-4 transition-all hover:scale-[1.02] cursor-pointer shadow-md ${statusClass}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">Floor {room.floor}</span>
                    <h4 className="font-playfair text-[18px] font-bold text-white">{room.roomNumber}</h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/40 border border-white/10">
                    ₹{room.basePrice.toLocaleString('en-IN')}/N
                  </span>
                </div>

                <div className="text-[12px] opacity-90 mb-2 truncate">
                  {room.type}
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="font-bold">{room.status}</span>
                  {room.assignedGuest ? (
                    <span className="text-white font-medium truncate max-w-[110px]">
                      👤 {room.assignedGuest}
                    </span>
                  ) : (
                    <span className="text-[10px] opacity-75">{room.housekeeper || 'Unassigned'}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Room Detail & Status Changer Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-[#262626] pb-4 mb-4">
              <div>
                <span className="text-[11px] text-[#c5a059] uppercase font-bold">Floor {selectedRoom.floor} • {selectedRoom.tier}</span>
                <h3 className="font-playfair text-[22px] font-bold text-white">{selectedRoom.roomNumber}</h3>
                <p className="text-[13px] text-[#8e8e93]">{selectedRoom.type}</p>
              </div>
              <button onClick={() => setSelectedRoom(null)} className="text-[#8e8e93] hover:text-white p-1">✕</button>
            </div>

            <div className="space-y-4 text-[13px]">
              <div className="grid grid-cols-2 gap-3 bg-[#1c1c1c] p-3 rounded-lg border border-[#262626]">
                <div>
                  <span className="text-[#8e8e93] text-[11px]">Base Night Tariff</span>
                  <div className="font-mono font-bold text-white text-[15px]">₹{selectedRoom.basePrice.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <span className="text-[#8e8e93] text-[11px]">Current Status</span>
                  <div className="font-bold text-[#c5a059]">{selectedRoom.status}</div>
                </div>
              </div>

              {selectedRoom.assignedGuest && (
                <div className="bg-[#1c1c1c] p-3 rounded-lg border border-blue-900/40">
                  <span className="text-[10px] uppercase font-bold text-blue-400">Current Occupant</span>
                  <div className="font-bold text-white mt-0.5">{selectedRoom.assignedGuest}</div>
                  <div className="text-[11px] text-[#8e8e93]">Linked Booking: {selectedRoom.assignedBookingId}</div>
                </div>
              )}

              {/* Status Update Quick Buttons */}
              <div>
                <span className="block text-[11px] uppercase font-bold text-[#8e8e93] mb-2">Change Housekeeping & Operational Status:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['Clean & Available', 'Occupied', 'Dirty', 'Inspected', 'Maintenance', 'Blocked'] as RoomStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onUpdateRoomStatus(selectedRoom.id, st);
                        setSelectedRoom({ ...selectedRoom, status: st });
                      }}
                      className={`p-2 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                        selectedRoom.status === st
                          ? 'bg-[#c5a059] text-black border-[#c5a059]'
                          : 'bg-[#1c1c1c] text-[#a3a3a3] hover:text-white border-[#333]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedRoom(null)}
                className="bg-[#c5a059] text-black px-4 py-2 rounded-lg text-[12px] font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Room Modal */}
      {showAddRoomModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-[#262626] pb-4 mb-4">
              <h3 className="font-playfair text-[20px] font-bold text-white">Add New Room Unit</h3>
              <button onClick={() => setShowAddRoomModal(false)} className="text-[#8e8e93] hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4 text-[13px]">
              <div>
                <label className="block text-[#8e8e93] mb-1">Room / Unit Number *</label>
                <input
                  type="text"
                  placeholder="e.g. Suite 502 or Villa 105"
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  required
                  className="w-full bg-[#1c1c1c] border border-[#333] text-white p-2.5 rounded-lg outline-hidden focus:border-[#c5a059]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8e8e93] mb-1">Floor Level</label>
                  <input
                    type="number"
                    value={newRoomFloor}
                    onChange={(e) => setNewRoomFloor(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-[#333] text-white p-2.5 rounded-lg outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[#8e8e93] mb-1">Base Night Rate (₹)</label>
                  <input
                    type="number"
                    value={newRoomBasePrice}
                    onChange={(e) => setNewRoomBasePrice(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-[#333] text-white p-2.5 rounded-lg outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8e8e93] mb-1">Category & Room Tier</label>
                <select
                  value={newRoomTier}
                  onChange={(e) => setNewRoomTier(e.target.value as any)}
                  className="w-full bg-[#1c1c1c] border border-[#333] text-white p-2.5 rounded-lg outline-hidden cursor-pointer"
                >
                  <option value="Deluxe">Deluxe City View</option>
                  <option value="Ocean Suite">Ocean Suite (Sea Facing)</option>
                  <option value="Presidential Villa">Presidential Villa</option>
                  <option value="Standard">Standard Executive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="bg-[#1c1c1c] text-[#a3a3a3] hover:text-white px-4 py-2 rounded-lg text-[12px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#c5a059] hover:bg-[#dfba73] text-black px-4 py-2 rounded-lg text-[12px] font-semibold"
                >
                  Save to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pricing Toast */}
      {pricingToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1c1c] border border-[#c5a059] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom">
          <span className="material-symbols-outlined text-[#c5a059]">bolt</span>
          <span className="text-[13px]">{pricingToast}</span>
        </div>
      )}
    </div>
  );
};
