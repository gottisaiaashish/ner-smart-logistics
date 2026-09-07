/**
 * Delivery Management & Essential Commodities Dispatch Modal
 */

import { store } from '../state/store.js';
import { sounds } from '../audio/sound-effects.js';

export function openDeliveryModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const renderContent = () => {
    const { deliveries, vehicles } = store.state;

    container.innerHTML = `
      <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        <div class="hud-panel rounded-2xl max-w-4xl w-full border border-command-border bg-command-950 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 divide-y divide-command-border">
          
          <!-- Header -->
          <div class="bg-command-900 p-5 sm:p-6 flex items-center justify-between">
            <div>
              <div class="flex items-center gap-3">
                <h3 class="text-base font-display font-bold text-white uppercase tracking-wider">
                  Commodity Dispatch Center
                </h3>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                  ACTIVE CONVOYS
                </span>
              </div>
              <p class="text-xs text-slate-400 font-mono mt-1">
                Manage, prioritize, and track emergency life-saving supply convoys across the North East
              </p>
            </div>
            <button id="btn-close-del-modal" class="px-3 py-1.5 rounded-lg bg-command-800 hover:bg-command-700 text-slate-300 text-xs font-mono font-medium transition border border-command-border">
              Close
            </button>
          </div>

          <!-- Body -->
          <div class="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            <!-- Create New Delivery Form Card -->
            <div class="bg-command-850 p-5 rounded-xl border border-command-border space-y-3.5">
              <h4 class="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                Create Essential Commodity Dispatch Request
              </h4>

              <form id="form-create-delivery" class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div class="sm:col-span-2">
                  <label class="block text-[10px] font-mono text-slate-400 mb-1 uppercase">Cargo Manifest & Goods</label>
                  <input type="text" id="del-cargo" required placeholder="e.g. 500 Anti-Venom Vials & Syringes" class="w-full bg-command-900 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans" value="120 Units Cryo Blood Plasma (Cold Storage)">
                </div>

                <div>
                  <label class="block text-[10px] font-mono text-slate-400 mb-1 uppercase">Category</label>
                  <select id="del-commodity-type" class="w-full bg-command-900 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500">
                    <option value="Medical & Vaccines">Medical Vaccines & Serum</option>
                    <option value="Liquid Oxygen">Liquid Medical Oxygen (LMO)</option>
                    <option value="Critical Bio-Supply">Whole Blood & Plasma</option>
                    <option value="Food & Relief">Disaster Food & Clean Water</option>
                    <option value="Emergency Rescue Gear">SDRF Emergency Gear</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[10px] font-mono text-slate-400 mb-1 uppercase">Origin Hub</label>
                  <input type="text" id="del-origin" required placeholder="Origin City/Depot" class="w-full bg-command-900 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans" value="Guwahati Regional Logistics Depot">
                </div>

                <div>
                  <label class="block text-[10px] font-mono text-slate-400 mb-1 uppercase">Destination Depot</label>
                  <input type="text" id="del-dest" required placeholder="Destination Depot" class="w-full bg-command-900 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans" value="District Civil Hospital, Silchar">
                </div>

                <div>
                  <label class="block text-[10px] font-mono text-slate-400 mb-1 uppercase">Priority Level</label>
                  <select id="del-priority" class="w-full bg-command-900 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500">
                    <option value="CRITICAL">CRITICAL (Emergency Lifeline)</option>
                    <option value="HIGH">HIGH (Standard Medical / Cryo)</option>
                    <option value="MEDIUM">MEDIUM (Relief Commodities)</option>
                  </select>
                </div>

                <div class="sm:col-span-2">
                  <label class="block text-[10px] font-mono text-slate-400 mb-1 uppercase">Assign Fleet Vehicle</label>
                  <select id="del-vehicle" class="w-full bg-command-900 border border-command-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500">
                    ${vehicles.map(v => `
                      <option value="${v.id}">${v.id} — ${v.name} (${v.driverName})</option>
                    `).join('')}
                  </select>
                </div>

                <div class="flex items-end">
                  <button type="submit" class="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs flex items-center justify-center shadow-lg transition">
                    Dispatch Convoy
                  </button>
                </div>
              </form>
            </div>

            <!-- Deliveries Table -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
                  Active Convoys & Manifest Status (${deliveries.length})
                </h4>
                <span class="text-xs text-slate-400 font-mono">GPS Tracking Active</span>
              </div>

              <div class="overflow-x-auto rounded-xl border border-command-border bg-command-850">
                <table class="w-full text-left text-xs text-slate-300">
                  <thead class="bg-command-900 text-[10px] font-mono text-slate-400 uppercase border-b border-command-border">
                    <tr>
                      <th class="p-3.5">Delivery ID</th>
                      <th class="p-3.5">Cargo Manifest</th>
                      <th class="p-3.5">Vehicle</th>
                      <th class="p-3.5">Route Corridor</th>
                      <th class="p-3.5">ETA</th>
                      <th class="p-3.5">Priority</th>
                      <th class="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-command-border font-sans">
                    ${deliveries.map(del => {
                      const priorityColor = del.priority === 'CRITICAL' ? 'text-rose-400 font-bold' : del.priority === 'HIGH' ? 'text-amber-400' : 'text-slate-300';
                      const statusColor = del.status === 'Rerouted' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : del.status === 'Delayed' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';

                      return `
                        <tr class="hover:bg-command-800/60 transition">
                          <td class="p-3.5 font-mono font-bold text-white">${del.id}</td>
                          <td class="p-3.5">
                            <div class="font-medium text-slate-200">${del.cargo}</div>
                            <div class="text-[11px] text-slate-400 font-mono mt-0.5">${del.commodityType}</div>
                          </td>
                          <td class="p-3.5 font-mono text-cyan-300">${del.vehicleId}</td>
                          <td class="p-3.5">
                            <div class="text-slate-200">${del.origin.split(' ')[0]} → ${del.destination.split(' ')[0]}</div>
                            <div class="text-[11px] text-slate-400 mt-0.5">${del.distance}</div>
                          </td>
                          <td class="p-3.5 font-mono text-emerald-400 font-bold">${del.eta}</td>
                          <td class="p-3.5 font-mono ${priorityColor}">${del.priority}</td>
                          <td class="p-3.5">
                            <span class="px-2 py-0.5 rounded border text-[10px] font-mono ${statusColor}">${del.status}</span>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div class="bg-command-900 p-4 px-6 flex items-center justify-end">
            <button id="btn-close-del-footer" class="px-5 py-2 rounded-xl bg-command-800 hover:bg-command-700 text-slate-300 text-xs font-mono font-medium transition border border-command-border">
              Done
            </button>
          </div>

        </div>
      </div>
    `;

    // Bind Close
    const closeModal = () => { container.innerHTML = ''; };
    container.querySelector('#btn-close-del-modal')?.addEventListener('click', closeModal);
    container.querySelector('#btn-close-del-footer')?.addEventListener('click', closeModal);

    // Form Submit
    container.querySelector('#form-create-delivery')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const cargo = container.querySelector('#del-cargo').value;
      const commodityType = container.querySelector('#del-commodity-type').value;
      const origin = container.querySelector('#del-origin').value;
      const destination = container.querySelector('#del-dest').value;
      const priority = container.querySelector('#del-priority').value;
      const vehicleId = container.querySelector('#del-vehicle').value;

      store.createDelivery({
        cargo,
        commodityType,
        origin,
        destination,
        priority,
        vehicleId,
        eta: '4h 30m',
        distance: '290 km'
      });

      sounds.playSuccess();
      renderContent();
    });
  };

  renderContent();
}
