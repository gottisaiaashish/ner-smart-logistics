/**
 * Vehicle Telemetry & Fleet Inspector Modal / Drawer
 */

import { store } from '../state/store.js';
import { sounds } from '../audio/sound-effects.js';

export function openVehicleModal(vehicleId) {
  const container = document.getElementById('modal-container');
  if (!container) return;

  const vehicle = store.state.vehicles.find(v => v.id === vehicleId) || store.state.vehicles[0];
  const isRerouted = vehicle.status === 'REROUTED';
  const isEmergency = vehicle.riskLevel === 'CRITICAL';

  const riskBadge = isEmergency 
    ? '<span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/50 font-mono font-bold text-xs">CRITICAL DISRUPTION</span>'
    : isRerouted
    ? '<span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-mono font-bold text-xs">SAFE REROUTE ACTIVE</span>'
    : '<span class="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-mono font-bold text-xs">NOMINAL TRANSIT</span>';

  container.innerHTML = `
    <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div class="hud-panel rounded-2xl max-w-2xl w-full border border-command-border bg-command-950 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 divide-y divide-command-border">
        
        <!-- Modal Header -->
        <div class="bg-command-900 p-5 sm:p-6 flex items-center justify-between">
          <div>
            <div class="flex items-center gap-3">
              <h3 class="text-lg font-display font-bold text-white tracking-wide font-mono">${vehicle.id}</h3>
              <span class="text-xs font-mono text-slate-400">${vehicle.registration}</span>
              ${riskBadge}
            </div>
            <p class="text-xs text-slate-400 mt-1">${vehicle.name}</p>
          </div>
          <button id="btn-close-modal" class="px-3 py-1.5 rounded-lg bg-command-800 hover:bg-command-700 text-slate-300 text-xs font-mono font-medium transition border border-command-border">
            Close
          </button>
        </div>

        <!-- Modal Body Grid -->
        <div class="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          <!-- Key Metrics Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="bg-command-850 p-3.5 rounded-xl border border-command-border">
              <span class="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Speed</span>
              <div class="text-xl font-bold font-mono text-cyan-400 mt-1">${vehicle.speed} <span class="text-xs text-slate-400 font-normal">km/h</span></div>
            </div>
            <div class="bg-command-850 p-3.5 rounded-xl border border-command-border">
              <span class="text-[10px] text-slate-400 font-mono uppercase tracking-wider">ETA</span>
              <div class="text-xl font-bold font-mono text-emerald-400 mt-1">${vehicle.eta}</div>
            </div>
            <div class="bg-command-850 p-3.5 rounded-xl border border-command-border">
              <span class="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Telemetry Link</span>
              <div class="text-sm font-semibold font-mono text-slate-200 mt-1 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ${vehicle.networkStatus}
              </div>
            </div>
            <div class="bg-command-850 p-3.5 rounded-xl border border-command-border">
              <span class="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Fuel / Bat</span>
              <div class="text-sm font-semibold font-mono text-slate-200 mt-1">${vehicle.fuelLevel} / ${vehicle.battery}</div>
            </div>
          </div>

          <!-- Cargo & Cold-Chain Telemetry -->
          <div class="bg-command-850 p-4 rounded-xl border border-command-border space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Cargo Manifest & Cold-Chain
              </span>
              <span class="text-xs font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-semibold">
                ${vehicle.cargoType}
              </span>
            </div>
            <div class="text-sm font-semibold text-white">${vehicle.cargo}</div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300 pt-2 border-t border-command-border font-mono">
              <div>Weight: <strong class="text-white">${vehicle.cargoWeight || '3.4 T'}</strong></div>
              <div>Required Temp: <strong class="text-white">${vehicle.tempRequirement || 'Ambient'}</strong></div>
              <div>Current: <strong class="text-emerald-400">${vehicle.currentTemp || 'Nominal'}</strong></div>
            </div>
          </div>

          <!-- Logistics Route Info -->
          <div class="bg-command-850 p-4 rounded-xl border border-command-border space-y-3">
            <h4 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Transit Corridor</h4>
            
            <div class="flex items-start justify-between text-xs">
              <div class="space-y-1">
                <span class="text-slate-400 font-mono text-[10px] uppercase">ORIGIN</span>
                <div class="font-semibold text-white">${vehicle.origin}</div>
              </div>
              <div class="text-right space-y-1">
                <span class="text-slate-400 font-mono text-[10px] uppercase">DESTINATION</span>
                <div class="font-semibold text-white">${vehicle.destination}</div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div class="bg-gradient-to-r from-cyan-500 to-emerald-500 h-2 rounded-full transition-all duration-500" style="width: ${vehicle.progressPct}%"></div>
            </div>

            <div class="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Current Sector: ${vehicle.currentLocationName}</span>
              <span>GPS lock: ${vehicle.lastGpsUpdate}</span>
            </div>
          </div>

          <!-- Driver Information & Communications -->
          <div class="bg-command-850 p-4 rounded-xl border border-command-border flex items-center justify-between">
            <div>
              <div class="text-sm font-bold text-white">${vehicle.driverName}</div>
              <div class="text-xs text-slate-400 font-mono mt-0.5">${vehicle.driverPhone}</div>
            </div>
            
            <button id="btn-call-driver-ptt" class="px-4 py-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-semibold transition">
              Dispatch Audio PTT
            </button>
          </div>

          <!-- Route History Logs -->
          <div class="bg-command-850 p-4 rounded-xl border border-command-border space-y-2">
            <h4 class="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Dispatch Event Log</h4>
            <div class="space-y-2">
              ${vehicle.routeHistory.map(item => `
                <div class="flex items-start gap-3 text-xs">
                  <span class="font-mono text-cyan-400 whitespace-nowrap">${item.time}</span>
                  <span class="text-slate-300">${item.event}</span>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- Modal Footer -->
        <div class="bg-command-900 p-4 px-6 flex items-center justify-between">
          <div class="text-xs text-slate-400 font-mono">
            Assigned Corridor: <strong class="text-white">${vehicle.assignedRoute}</strong>
          </div>
          <div class="flex items-center gap-3">
            ${!isRerouted && vehicle.id === 'TRUCK-07' ? `
              <button id="btn-modal-reroute" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition shadow-lg">
                Dispatch Route B Reroute
              </button>
            ` : ''}
            <button id="btn-close-modal-footer" class="px-4 py-2 rounded-xl bg-command-800 hover:bg-command-700 text-slate-300 text-xs font-mono font-medium transition border border-command-border">
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  // Bind Events
  const closeModal = () => {
    container.innerHTML = '';
  };

  container.querySelector('#btn-close-modal')?.addEventListener('click', closeModal);
  container.querySelector('#btn-close-modal-footer')?.addEventListener('click', closeModal);

  container.querySelector('#btn-call-driver-ptt')?.addEventListener('click', () => {
    sounds.playPttPress();
    store.sendPushToTalkMessage({
      sender: 'Control Room Dispatcher',
      text: `Dispatch calling ${vehicle.id} (${vehicle.driverName}). Acknowledging cold chain nominal telemetry.`
    });
    sounds.speakDispatch(`Dispatch calling ${vehicle.id}. Please confirm route status.`);
    closeModal();
  });

  container.querySelector('#btn-modal-reroute')?.addEventListener('click', () => {
    store.acceptReroute(vehicle.id);
    closeModal();
  });
}
